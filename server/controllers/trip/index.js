const models = require(`${global.appRoot}/models`);
const util = require(`${global.appRoot}/util`);
const _ = require('lodash');
const moment = require('moment');
const svg2png = require('svg2png');
const jobController = require('../job/index');
const googleMapsClient = require('@google/maps')
    .createClient({
        key: 'AIzaSyD18TCLmU4Kr7gDTskJh6hyOyo_GKOkiwY',
    });
const notificationHelper = require('../notificationHelper');
const emailHelper = require('../emailHelper');
const sharp = require('sharp');

const Op = models.Sequelize.Op;
const mainIncludeOptions = [
    {
        model: models.Container,
        as: 'container',
        //include: ['job'], this is done via a 2nd api call below.
    },
    {
        model: models.Stop,
        as: 'stop',
        include: [
            {
                model: models.Location,
                as: 'stopLocation',
                include: ['geoLocation'],
            },
        ],
    },
    {
        model: models.Company,
        as: 'assignee',
    },
    {
        model: models.BidRequest,
        as: 'bidRequest',
        include: [
            {
                model: models.Company,
                as: 'company',
                include: [
                    {
                        model: models.GeoLocation,
                        as: 'geoLocation',
                    },
                    {
                        model: models.CarrierStateAreas,
                        as: 'operationStateArea',
                    },
                    {
                        model: models.CarrierInfo,
                        as: 'carrierInfo',
                    },
                    {
                        model: models.User,
                        as: 'user',
                    },
                ],
            },
        ],
    },
];

const mainIncludeOptionsWithoutPic = _.cloneDeep(mainIncludeOptions);
mainIncludeOptionsWithoutPic[1].attributes = { exclude: ['signature'] };
const getTripById = async id => {
    const trip = await models.Trip.findOne({
        where: { id },
        order: [[{ model: models.Stop, as: 'stop' }, 'stopNo', 'ASC']],
        include: mainIncludeOptions,
    });
    if (!trip) return null;
    const data = {
        ...trip.dataValues,
        container: {
            ...trip.dataValues.container.dataValues,
            job: await jobController.getExpandedJobById(_.get(trip, 'dataValues.container.jobId')),
        },
    };

    return data;
};
const getTotalDistanceFromStops = async stops => {
    let total = 0;
    if (_.size(stops) > 1) {
        const start = _.get(
            stops[0],
            'stopLocation.geoLocation.coordinates.coordinates',
        );
        const end = _.get(
            stops[_.size(stops) - 1],
            'stopLocation.geoLocation.coordinates.coordinates',
        );
        const waypointsCoords = _.map(_.drop(_.dropRight(stops)), stop =>
            _.get(stop, 'stopLocation.geoLocation.coordinates.coordinates'));
        const waypoints = _.map(waypointsCoords, coords => {
            return { lat: coords[0], lng: coords[1] };
            // return {
            //     location: { lat: coords[0], lng: coords[1] },
            //     stopover: false,
            // };
        });
        const service = googleMapsClient.directions;
        total = await new Promise((resolve, reject) => {
            service(
                {
                    origin: { lat: start[0], lng: start[1] },
                    destination: { lat: end[0], lng: end[1] },
                    mode: 'driving',
                    alternatives: false,
                    waypoints,
                },
                (err, result) => {
                    if (result.status === 200) {
                        let value = 0;
                        const legs = _.get(result, 'json.routes[0].legs') || [];
                        _.map(legs, leg => {
                            value += leg.distance.value;
                        });
                        resolve((value * 0.000621371).toFixed(2));
                    } else {
                        resolve(0);
                    }
                },
            );
        });
    }
    return total;
};
const determineLocationAndTimes = async originalTrip => {
    const trip = { ...originalTrip };
    const stops = _.get(trip, 'stop');
    const size = _.size(stops);
    if (!size) return trip;
    const firstStop = stops[0];
    const lastStop = stops[size - 1];
    trip.startLocation = _.get(
        firstStop,
        'stopLocation.geoLocation.coordinates',
    );
    trip.startLocationId = _.get(firstStop, 'stopLocation.id');
    trip.endLocation = _.get(lastStop, 'stopLocation.geoLocation.coordinates');
    trip.endLocationId = _.get(lastStop, 'stopLocation.id');
    trip.estimatedStartTime = _.get(firstStop, 'plannedDateTime');
    trip.estimatedEndTime = _.get(lastStop, 'plannedDateTime');
    trip.actualStartTime = _.get(firstStop, 'actualTime');
    trip.actualEndTime = _.get(lastStop, 'actualTime');
    trip.totalDistance = await getTotalDistanceFromStops(stops);
    return trip;
};
const convertSVGToJPEG = async svgString => {
    const decoded = Buffer.from(svgString, 'base64');
    const buffer = await svg2png(decoded);

    return Buffer.from(buffer, 'binary')
        .toString('base64');
};
const convertJPGURIToGreyscale = async uriString => {
    const base64Data = Buffer.from(
        uriString.replace(/^data:image\/\w+;base64,/, ''),
        'base64',
    );

    const greyedData = await sharp(base64Data)
        .greyscale()
        .jpeg({
            quality: 20,
        })
        .toBuffer();
    return `data:image/jpeg;base64,${Buffer.from(greyedData)
        .toString('base64')}`;
};
module.exports = {
    getTripById,
    searchTripsForManagement: async (req, res, next) => {
        try {
            const { body, user } = req;
            let filter = {
                ...body,
            };
            if (user.role !== 'dispatcher') {
                filter = {
                    ...filter,
                    assigneeId: user.companyId,
                };
            }
            let skip = 0;
            let usingDate = false;

            if (filter.skip) {
                skip = filter.skip;
            }
            // preprocessing filters
            if (filter.fromDate || filter.toDate) {
                usingDate = true;
            }
            if (!filter.fromDate) filter.fromDate = '1900-01-01';
            if (!filter.toDate) filter.toDate = '2500-12-31';

            const conds = {};
            //never fetch all jobs. upper limit set to 90 days.
            conds.createdAt = {
                [Op.gte]: moment()
                    .subtract(90, 'Days'),
            };

            // prepare where condition
            if (filter.status) {
                conds.status = filter.status;
            }
            if (filter.assigneeId) {
                conds.assigneeId = filter.assigneeId;
            }
            if (filter.id) {
                conds.id = filter.id;
            }
            if (usingDate) {
                conds.estimatedStartTime = {
                    [Op.and]: [
                        { [Op.gte]: filter.fromDate },
                        { [Op.lte]: filter.toDate },
                    ],
                };
            }
            const includeForSearch = _.cloneDeep(mainIncludeOptionsWithoutPic);
            if (
                filter.port ||
                filter.shipper ||
                filter.clientId ||
                filter.consignee
            ) {
                const jobWhere = {};
                let jobInclude = null;
                if (filter.port) {
                    jobWhere.portId = filter.port;
                }
                if (filter.clientId) {
                    jobWhere.clientId = filter.clientId;
                }
                if (filter.shipper || filter.consignee) {
                    jobInclude = [];

                    if (filter.shipper) {
                        jobInclude.push({
                            model: models.Location,
                            as: 'shipper',
                            required: true,
                            where: {
                                name: {
                                    [Op.like]: `%${filter.shipper}%`,
                                },
                            },
                        });
                    }
                    if (filter.consignee) {
                        jobInclude.push({
                            model: models.Location,
                            as: 'consignee',
                            required: true,
                            where: {
                                name: {
                                    [Op.like]: `%${filter.consignee}%`,
                                },
                            },
                        });
                    }
                }

                includeForSearch[0] = {
                    model: models.Container,
                    as: 'container',
                    required: true,
                    include: [
                        {
                            model: models.Job,
                            as: 'job',
                            attributes: ['name'],
                            where: { ...jobWhere },
                            required: jobWhere !== {},
                        },
                    ],
                };
                if (jobInclude) {
                    includeForSearch[0].include[0].include = jobInclude;
                }
            }
            if (filter.stop) {
                includeForSearch[1] = {
                    model: models.Stop,
                    as: 'stop',
                    attributes: ['id', 'stopLocationId'],
                    //required: true,
                    include: [
                        {
                            model: models.Location,
                            as: 'stopLocation',
                            required: true,
                            where: {
                                name: {
                                    [Op.like]: `%${filter.stop}%`,
                                },
                            },
                        },
                    ],
                };
            }
            const count = await models.Trip.count({
                where: conds,
                order: [['name', 'DESC']],
                distinct: 'id',
                include: includeForSearch,
            });
            const trips = await models.Trip.findAll({
                where: conds,
                order: [
                    ['estimatedStartTime', 'DESC'],
                    ['rowNo', 'ASC'],
                    [{ model: models.Stop, as: 'stop' }, 'stopNo', 'ASC'],
                ],
                distinct: 'id',
                offset: skip,
                limit: 10,
                include: includeForSearch,
            });
            const result = await Promise.all(_.map(trips, async trip => {
                if (!filter.stop) {
                    const jobData = await jobController.getExpandedJobById(trip.dataValues.container.dataValues.jobId);
                    return {
                        ...trip.dataValues,
                        container: {
                            ...trip.dataValues.container.dataValues,
                            job: jobData,
                        },
                    };
                }
                // stop touched. need to fetch all stops.
                return getTripById(trip.id);
            }));
            res.json({ rows: result, count });
        } catch (err) {
            next(err);
        }
    },
    getTripsByFilter: async (req, res, next) => {
        // removed suggestion search from this function, added new one instead
        try {
            const { body, user } = req;
            let filter = {
                ...body,
            };

            if (user.role === 'tc') {
                filter = {
                    ...filter,
                    assigneeId: user.companyId,
                };
            }
            if (user.role === 'bco') {
                filter = {
                    ...filter,
                    containerId: _.get(filter, 'containerId') || 'DUMMY',
                };
            }
            filter = _.omit(
                {
                    ...filter,
                },
                'anchorTime',
            );

            if (filter.statusNe) {
                // RN client. ne completed.
                filter.status = { [Op.ne]: filter.statusNe };
                filter = _.omit(filter, 'statusNe');
            }
            if (filter.scheduleIdEmpty) {
                // suggestion --
                filter.scheduleId = null;
                filter = _.omit(filter, 'scheduleIdEmpty');
            }

            const trips = await models.Trip.findAll({
                where: filter,
                order: [
                    ['rowNo', 'ASC'],
                    [{ model: models.Stop, as: 'stop' }, 'stopNo', 'ASC'],
                ],
                include: mainIncludeOptionsWithoutPic,
            });
            const result = await Promise.all(_.map(trips, async trip => {
                const jobData = await jobController.getExpandedJobById(trip.dataValues.container.dataValues.jobId);
                return {
                    ...trip.dataValues,
                    container: {
                        ...trip.dataValues.container.dataValues,
                        job: jobData,
                    },
                };
            }));

            res.json(result);
        } catch (err) {
            next(err);
        }
    },
    getTripSuggestions: async (req, res, next) => {
        // this is only for searching suggested trips
        try {
            const { body, user } = req;
            let filter = {
                ...body,
            };

            if (user.role !== 'dispatcher') {
                filter = {
                    ...filter,
                    assigneeId: user.companyId,
                };
            }
            const scheduleId = _.get(filter, 'scheduleId');
            // get all trips listed

            const currentTrips = await models.Trip.findAll({
                where: {
                    scheduleId,
                },
                order: [['scheduleRowNo', 'ASC']],
            });

            if (_.size(currentTrips) === 0) {
                res.json([]); // nothing to be sent. should not happen
                return;
            }
            const startTrip = _.head(currentTrips);
            const lastTrip = _.last(currentTrips);
            const portId = startTrip.portId;

            // this is for suggestion
            const startDateTime = moment
                .utc(moment(startTrip.estimatedStartTime)
                    .startOf('day'))
                .subtract(1, 'Days')
                .format();
            const endDateTime = moment
                .utc(moment(lastTrip.estimatedEndTime)
                    .startOf('day'))
                .add(2, 'Days')
                .format();
            filter = _.omit(
                {
                    ...filter,
                    estimatedStartTime: {
                        [Op.between]: [startDateTime, endDateTime],
                    },
                },
                'scheduleId',
            );
            // status filtering for suggestions
            filter.status = { [Op.in]: ['New', 'Active'] };

            //port
            filter.portId = {
                [Op.or]: [
                    {
                        [Op.eq]: portId,
                    },
                    { [Op.eq]: null },
                ],
            };

            // ready for dispatch?

            filter.readyForDispatch = true;

            if (filter.scheduleIdEmpty) {
                // suggestion --
                filter.scheduleId = null;
                filter = _.omit(filter, 'scheduleIdEmpty');
            }

            const trips = await models.Trip.findAll({
                where: filter,
                order: [
                    ['rowNo', 'ASC'],
                    [{ model: models.Stop, as: 'stop' }, 'stopNo', 'ASC'],
                ],
                include: mainIncludeOptionsWithoutPic,
            });
            const result = await Promise.all(_.map(trips, async trip => {
                const jobData = await jobController.getExpandedJobById(trip.dataValues.container.dataValues.jobId);
                return {
                    ...trip.dataValues,
                    container: {
                        ...trip.dataValues.container.dataValues,
                        job: jobData,
                    },
                };
            }));

            res.json(result);
        } catch (err) {
            next(err);
        }
    },
    createTrip: async (req, res, next) => {
        const tr = await models.sequelize.transaction();
        try {
            const { body } = req;
            const user = req.user;
            let trip;

            let data = { ...body };
            if (['dispatcher'].indexOf(user.role) === -1) {
                util.throwApiException('You are not allowed to create trip');
            } else {
                // pre processing
                const determinedData = await determineLocationAndTimes(data);
                data = { ...determinedData };
                // bring aux info for searches
                const container = await models.Container.findById(data.containerId);
                if (container) {
                    const job = await container.getJob();
                    data.portId = job.portId;
                }
                data.createdById = user.id;
                trip = await models.Trip.create(data, {
                    transaction: tr,
                    include: [
                        {
                            model: models.Stop,
                            as: 'stop',
                        },
                    ],
                });
            }
            await tr.commit();
            const resp = await getTripById(trip.id);
            res.json(resp);
        } catch (err) {
            await tr.rollback();
            next(err);
        }
    },
    adjustTripOrder: async (req, res, next) => {
        const tr = await models.sequelize.transaction();
        try {
            const trips = req.body;
            const user = req.user;
            let trip;

            if (['dispatcher'].indexOf(user.role) === -1) {
                util.throwApiException('You are not allowed to update trip');
            } else {
                // pre processing
                await Promise.all(_.map(trips, async t => {
                    trip = await models.Trip.findById(t.id);
                    await trip.updateAttributes(
                        {
                            ...t,
                        },
                        {
                            transaction: tr,
                        },
                    );
                }));
            }
            await tr.commit();
            res.json([]);
        } catch (err) {
            await tr.rollback();
            next(err);
        }
    },
    updateTrip: async (req, res, next) => {
        const tr = await models.sequelize.transaction();
        try {
            const { body } = req;
            const user = req.user;
            let trip;

            let data = { ...body };
            if (['dispatcher'].indexOf(user.role) === -1) {
                util.throwApiException('You are not allowed to update trip');
            } else {
                // pre processing
                const determinedData = await determineLocationAndTimes(data);
                data = { ...determinedData };

                trip = await models.Trip.findById(data.id, {
                    include: ['stop'],
                });
                //trip itself
                await trip.updateAttributes(
                    {
                        ...data,
                    },
                    {
                        transaction: tr,
                    },
                );

                // stops:
                // 1st step: delete or update
                if (body.stop) {
                    const stops = await trip.getStop();
                    await Promise.all(_.map(stops, async handler => {
                        const temp = _.find(body.stop, con => {
                            return con.id === handler.id;
                        });
                        if (!temp) {
                            await handler.destroy({
                                transaction: tr,
                            });
                        } else {
                            await handler.updateAttributes(
                                {
                                    ...temp,
                                },
                                {
                                    transaction: tr,
                                },
                            );
                        }
                    }));

                    //2nd step: add new ones.
                    await Promise.all(_.map(body.stop, async st => {
                        if (!st.id) {
                            const handler = await models.Stop.create(
                                {
                                    ...st,
                                },
                                {
                                    transaction: tr,
                                },
                            );
                            await trip.addStop(handler, {
                                transaction: tr,
                            });
                        }
                    }));
                }
            }
            await tr.commit();
            const resp = await getTripById(trip.id);
            res.json(resp);
        } catch (err) {
            await tr.rollback();
            next(err);
        }
    },
    deleteTrip: async (req, res, next) => {
        const tr = await models.sequelize.transaction();

        try {
            const idToDelete = _.get(req, 'params.id');
            if (!idToDelete) {
                util.throwApiException('Trip id to delete is missing');
                return;
            }
            const user = req.user;
            let trip;

            if (['dispatcher'].indexOf(user.role) === -1) {
                util.throwApiException('You are not allowed to update trip');
            } else {
                // pre processing
                trip = await models.Trip.findById(idToDelete, {
                    include: ['stop', 'container'],
                });
                const container = await trip.getContainer();
                let trips = await container.getTrip();
                // delete stops:
                const stops = await trip.getStop();
                await Promise.all(_.map(stops, async handler => {
                    await handler.destroy({
                        transaction: tr,
                    });
                }));

                //trip itself
                await trip.destroy({
                    transaction: tr,
                });

                //2nd step: reorder remaining trip no in container.
                _.remove(trips, t => t.id === idToDelete);
                trips = _.sortBy(trips, 'rowNo');

                await Promise.all(_.map(trips, async (t, i) => {
                    await t.updateAttributes(
                        { rowNo: i + 1 },
                        { transaction: tr },
                    );
                }));
            }
            await tr.commit();
            res.json({ id: req.params.id });
            return;
        } catch (err) {
            await tr.rollback();
            next(err);
        }
    },
    getSingleTrip: async (req, res, next) => {
        const tripId = req.params.id;
        const resp = await getTripById(tripId);
        res.json(resp);
    },
    assignTrip: async (req, res, next) => {
        const tr = await models.sequelize.transaction();
        try {
            const { body } = req;
            const user = req.user;
            let trip,
                bid;

            const data = { ...body };
            if (['dispatcher'].indexOf(user.role) === -1) {
                util.throwApiException('You are not allowed to update trip');
            } else {
                trip = await models.Trip.findById(data.tripId);
                if (data.bidId) {
                    bid = await models.BidRequest.findById(data.bidId);
                }
                //trip itself
                if (data.bidId) {
                    await trip.updateAttributes(
                        {
                            assigneeId: bid.companyId,
                            amount: bid.amount,
                            status: 'Assigned',
                            warningFlag: false,
                        },
                        {
                            transaction: tr,
                        },
                    );
                } else {
                    await trip.updateAttributes(
                        {
                            assigneeId: null,
                            amount: null,
                        },
                        {
                            transaction: tr,
                        },
                    );
                }
                // send notification
                if (bid) {
                    const driverUser = await models.User.findOne({
                        where: { companyId: bid.companyId },
                    });
                    if (driverUser.mobilePushToken) {
                        await notificationHelper.send(
                            driverUser.mobilePushToken,
                            'You have been assigned a trip',
                        );
                    }
                }

                await tr.commit();

                const resp = await getTripById(trip.id);
                res.json(resp);
            }
        } catch (err) {
            await tr.rollback();
            next(err);
        }
    },
    completeStop: async (req, res, next) => {
        const tr = await models.sequelize.transaction();
        try {
            const { body } = req;
            const user = req.user;
            let container,
                stop,
                jobInfo,
                picBaseStr = '',
                picExtention = '';
            // send email notification
            let emailObj = {};

            const data = { ...body };
            if (['dispatcher', 'tc'].indexOf(user.role) === -1) {
                util.throwApiException('You are not allowed to do this');
            } else {
                if (data.stopId) {
                    stop = await models.Stop.findById(data.stopId, {
                        include: ['stopLocation'],
                    });
                }
                //stop itself
                if (stop) {
                    if (_.get(data, 'signature.type') === 'sig') {
                        const imageObj = await convertSVGToJPEG(_.get(data, 'signature.data'));
                        picExtention = '.png';
                        data.signature.data = `data:image/png;base64,${imageObj}`;
                        picBaseStr = data.signature.data;
                    } else if (_.get(data, 'signature.type') === 'photo') {
                        data.signature.data = `data:image/jpeg;base64,${_.get(
                            data,
                            'signature.data',
                        )}`;
                        // convert to greyscale.
                        data.signature.data = await convertJPGURIToGreyscale(data.signature.data);
                        picBaseStr = data.signature.data;
                        picExtention = '.jpg';
                    }

                    await stop.updateAttributes(
                        {
                            status: 'Completed',
                            actualTime: moment(),
                            signature: data.signature,
                        },
                        {
                            transaction: tr,
                        },
                    );
                    // update container
                    container = await models.Container.findAll(
                        {
                            include: [
                                {
                                    model: models.Trip,
                                    as: 'trip',
                                    where: {
                                        id: stop.tripId,
                                    },
                                },
                                {
                                    model: models.Job,
                                    as: 'job',
                                    include: [
                                        'jobImportDetail',
                                        'jobExportDetail',
                                        'client',
                                    ],
                                },
                            ],
                        },
                        { transaction: tr },
                    );

                    if (_.size(container) > 0) {
                        // should only one trip. but has to use findAll coz sequlize limit
                        await container[0].updateAttributes(
                            {
                                seal: data.sealNo,
                                chassisType: data.chassisType,
                                chassisNo: data.chasisNo,
                                equipmentNo: data.equipmentNo,
                            },
                            { transaction: tr },
                        );
                        //get job info for email
                        jobInfo = container[0].job;
                        //send email only for certain cases.

                        emailObj = {
                            dateTime: moment()
                                .format('MM/DD/YYYY HH:MM'),
                            blBKNo:
                                _.get(
                                    jobInfo,
                                    'jobImportDetail.billOfLading',
                                ) ||
                                _.get(jobInfo, 'jobExportDetail.booking') ||
                                '',
                            clientRefNo: _.get(jobInfo, 'clientRefNo') || '',
                            containerType: _.get(container[0], 'type') || '',
                            containerNo:
                                _.get(container[0], 'equipmentNo') || '',
                            stopAt: _.get(stop, 'stopLocation.name') || '',
                            signedBy: _.get(data, 'signature.signedBy') || '',
                            carrierName:
                                _.get(
                                    jobInfo,
                                    'jobExportDetail.marineCarrier',
                                ) || '',
                        };
                        // send email by conditions.

                        // Job Type == Import, Stop Type == Consignee, Stop Action ==
                        // Drop Off Load (Refer to “Delivery Receipt” form at the end of
                        // this Doc.)
                        // - Job Type == Export, Stop Type == Shipper, Stop Action == Pickup
                        // Load (Refer to “Cargo Receipt” at the end of this doc.)
                        switch (_.get(jobInfo, 'type')) {
                            case 'Import':
                                if (
                                    _.get(stop, 'type') === 'consignee' &&
                                    _.get(stop, 'action') === 'drop-off load'
                                ) {
                                    //“Delivery Receipt”
                                    const docUrl = await emailHelper.sendDeliveryReceipt(
                                        _.get(jobInfo, 'client.email'),
                                        emailObj,
                                        picBaseStr,
                                        picExtention,
                                    );
                                    await stop.updateAttributes(
                                        {
                                            pdfDocLink: docUrl,
                                        },
                                        {
                                            transaction: tr,
                                        },
                                    );
                                }
                                break;
                            case 'Export':
                                if (
                                    _.get(stop, 'type') === 'shipper' &&
                                    _.get(stop, 'action') === 'pick-up load'
                                ) {
                                    //Cargo Receipt
                                    const docUrl = await emailHelper.sendPickupReceipt(
                                        _.get(jobInfo, 'client.email'),
                                        emailObj,
                                        picBaseStr,
                                        picExtention,
                                    );
                                    await stop.updateAttributes(
                                        {
                                            pdfDocLink: docUrl,
                                        },
                                        {
                                            transaction: tr,
                                        },
                                    );
                                }
                                break;
                            default:
                        }
                    }
                }

                await tr.commit();

                const resp = await getTripById(stop.tripId);
                res.json(resp);
            }
        } catch (err) {
            await tr.rollback();
            console.log(err);
            next(err);
        }
    },
    cancelTrip: async (req, res, next) => {
        const transaction = await models.sequelize.transaction();
        try {
            const user = req.user;
            const { id } = req.params;

            if (user.role === 'tc') {
                // first, cancel the trip
                const trip = await models.Trip.findOne(
                    {
                        where: {
                            id,
                        },
                    },
                    { transaction },
                );
                if (trip) {
                    await trip.updateAttributes(
                        {
                            status: 'Retracted',
                            assigneeId: null,
                            warningFlag: true,
                        },
                        { transaction },
                    );
                }
                // second, cancel the bid request
                const request = await models.BidRequest.findOne({
                    where: {
                        tripId: id,
                        companyId: user.companyId,
                    },
                });
                if (request) {
                    await request.updateAttributes(
                        {
                            amount: 0,
                            status: 'Rejected',
                        },
                        { transaction },
                    );
                }

                await transaction.commit();
            } else {
                util.throwApiException('You are not allowed for this API');
            }
            res.send(id);
        } catch (err) {
            await transaction.rollback();
            next(err);
        }
    },
    getSignatureOrPOD: async (req, res, next) => {
        try {
            let sigData;
            const { id } = req.params;

            const stop = await models.Stop.findOne({
                where: {
                    id,
                },
            });
            if (stop) {
                sigData = stop.signature || {};
            }
            res.json(sigData);
        } catch (err) {
            next(err);
        }
    },
};
