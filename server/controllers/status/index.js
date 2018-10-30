const models = require(`${global.appRoot}/models`);
const util = require(`${global.appRoot}/util`);
const _ = require('lodash');
const moment = require('moment');

const Op = models.Sequelize.Op;
const getFormattedStringFromUTCDateTime = date => {
    if (date) {
        return moment(date)
            .add(5, 'hours')
            .format('MM/DD/YYYY');
    }
    return '--/--';
};
const calcTripActive = (trip, job, container) => {
    let isActive = true;
    // trip has 'Terminal/Pickup empty' stop, and (Empty request date !== null, and Date/Time (appointment) for the stop !== null)
    let stop = _.find(trip.stop, {
        type: 'terminal',
        action: 'pick-up empty',
    });
    if (stop) {
        if (!(stop.plannedDateTime && container.emptyRequestDate)) {
            isActive = false;
        }
    }
    // trip has 'Terminal/Pickup load' stop, and (Release date !== null, and Date/Time (appointment) for the stop !== null)
    stop = _.find(trip.stop, { type: 'terminal', action: 'pick-up load' });
    if (stop) {
        if (
            !(
                stop.plannedDateTime &&
                _.get(job, 'jobImportDetail.emptyRequestDate')
            )
        ) {
            isActive = false;
        }
    }
    // trip has 'Terminal/Drop off load' stop, and (Load ready date !== null, and Date/Time (appointment) for the stop !== null)
    stop = _.find(trip.stop, { type: 'terminal', action: 'drop-off load' });
    if (stop) {
        if (!(stop.plannedDateTime && _.get(container, 'loadReadyDate'))) {
            isActive = false;
        }
    }
    // trip has 'Terminal/Drop off empty' stop, and (Empty ready datee !== null, and Date/Time (appointment) for the stop !== null)
    stop = _.find(trip.stop, {
        type: 'terminal',
        action: 'drop-off empty',
    });
    if (stop) {
        if (!(stop.plannedDateTime && _.get(container, 'emptyReadyDate'))) {
            isActive = false;
        }
    }

    // trip has 'Shipper/Drop off empty' stop, and (Empty request date !== null)
    stop = _.find(trip.stop, { type: 'shipper', action: 'drop-off empty' });
    if (stop) {
        if (!_.get(container, 'emptyRequestDate')) {
            isActive = false;
        }
    }
    // trip has 'Shipper/Pickup load' stop, and (Load ready date !== null)
    stop = _.find(trip.stop, { type: 'shipper', action: 'pick-up load' });
    if (stop) {
        if (!_.get(container, 'loadReadyDate')) {
            isActive = false;
        }
    }
    // trip has 'Consignee/Pickup empty' stop, and (Empty Reay Date !== null)
    stop = _.find(trip.stop, {
        type: 'consignee',
        action: 'pick-up empty',
    });
    if (stop) {
        if (!_.get(container, 'emptyReadyDate')) {
            isActive = false;
        }
    }
    return isActive;
};
module.exports = {
    setStatusForJob: async (job, user) => {
        await job.reload();
        let status = 'New';
        // check if should set it as Active.
        // Job Type==Import, & Rlsd Date is today or before or ETA+2 is today or before
        // Job Type==Export, and MT Date (1st Requested Empty Delivery Date) -1 is today or before
        // Job Type==Cross Town, PU Date (1st Pickup Date)-1 is today or before

        switch (job.type) {
            case 'Import':
                job.jobImportDetail =
                    job.jobImportDetail || (await job.getJobImportDetail());
                if (job.jobImportDetail.etaDate) {
                    status = `ETA:${getFormattedStringFromUTCDateTime(job.jobImportDetail.etaDate)}`;
                    if (
                        moment()
                            .startOf('day') -
                            moment(job.jobImportDetail.etaDate)
                                .startOf('day') >=
                        -172800000
                    ) {
                        status = 'Active';
                    }
                }
                if (status !== 'Active' && job.jobImportDetail.released) {
                    status = `Rlsd:${getFormattedStringFromUTCDateTime(job.jobImportDetail.released)}`;
                    if (
                        moment()
                            .startOf('day') -
                            moment(job.jobImportDetail.released)
                                .startOf('day') >=
                        0
                    ) {
                        status = 'Active';
                    }
                }
                break;
            case 'Export':
                if (!job.container) {
                    job.container = await job.getContainer();
                }
                job.jobExportDetail =
                    job.jobExportDetail || (await job.getJobExportDetail());

                const earlistRequestedEmptyDeliveryDate = _.min(_.compact(_.map(job.container, con => con.emptyRequestDate)));

                if (earlistRequestedEmptyDeliveryDate) {
                    status = `MT:${getFormattedStringFromUTCDateTime(earlistRequestedEmptyDeliveryDate)}`;
                    if (
                        moment()
                            .startOf('day') -
                            moment(earlistRequestedEmptyDeliveryDate)
                                .startOf('day') >=
                        -86400000
                    ) {
                        status = 'Active';
                    }
                } else if (_.get(job, 'jobExportDetail.cutOffDate')) {
                    // no emtpy request date entered. set cutoff or etd

                    status = `Cut-off:${getFormattedStringFromUTCDateTime(_.get(job, 'jobExportDetail.cutOffDate'))}`;
                } else {
                    status = `ETD:${getFormattedStringFromUTCDateTime(_.get(job, 'jobExportDetail.dateOfDeparture'))}`;
                }

                break;
            case 'Cross Town':
                if (!job.container) {
                    job.container = await job.getContainer();
                }
                const earlistPickupDate = _.min(_.compact(_.map(job.container, con => con.pickupDate)));

                if (earlistPickupDate) {
                    status = `PU:${getFormattedStringFromUTCDateTime(earlistPickupDate)}`;
                    if (
                        moment()
                            .startOf('day') -
                            moment(earlistPickupDate)
                                .startOf('day') >=
                        -86400000
                    ) {
                        status = 'Active';
                    }
                } else {
                    //status = 'PU';
                }
                break;
            default:
                break;
        }

        // now look at container level
        if (!job.container) job.container = await job.getContainer();
        let warningFlag = false,
            completeFlag = true;
        _.map(job.container, con => {
            if (con.warningFlag) {
                warningFlag = true;
            }
            if (con.status !== 'Complete') {
                completeFlag = false;
            }
        });

        if (completeFlag && _.size(job.container) > 0) {
            status = 'Complete';
        }
        //update job status.
        return { status, warningFlag };
    },
    setStatusForTrips: async (ts, user) => {
        const trips = _.sortBy(ts, ['rowNo']);
        if (_.size(trips) === 0) return {};
        const container = await trips[0].getContainer();
        const job = await container.getJob();
        switch (job.type) {
            case 'Import':
                job.jobImportDetail =
                    job.jobImportDetail || (await job.getJobImportDetail());
                break;
            case 'Export':
                if (!job.container) {
                    job.container = await job.getContainer();
                }
                break;
            case 'Cross Town':
                if (!job.container) {
                    job.container = await job.getContainer();
                }
                break;
            default:
                break;
        }

        await Promise.all(_.map(trips, async trip => {
            let status = 'New'; // New for initial status

            if (status === 'Retracted') return; // do not recalculate for retracted status.. this is only updated when assigning
            // Sent;
            const bidRequests = await trip.getBidRequest();
            if (_.size(bidRequests) > 0) status = 'Sent';

            //No Bid! or has bid
            let hasBid = false;
            _.map(bidRequests, bidRequest => {
                if (['Bid', 'Accepted'].indexOf(bidRequest.status) !== -1) {
                    hasBid = true;
                }
            });
            if (hasBid) {
                status = 'Has Bid';
            }
            if (
                !hasBid && _.size(bidRequests) > 0 &&
                    trip.estimatedStartTime &&
                    moment(trip.estimatedStartTime) - moment() < 86400000
            ) {
                status = 'No Bid';
            }

            //Assigned
            if (trip.assigneeId) status = 'Assigned';

            //Delay
            if (
                status === 'Assigned' &&
                    trip.estimatedStartTime &&
                    moment(trip.estimatedStartTime) - moment() < 3600000 &&
                    !trip.isStarted
            ) {
                status = 'Delay';
            }
            let actualStartTime,
                actualEndTime,
                timeToUpdate = {};
                // transit
            const stops = await trip.getStop();
            _.map(stops, stop => {
                if (stop.status === 'Completed') {
                    status = 'En Route';
                    if (!actualStartTime) actualStartTime = stop.actualTime;
                }
            });

            //Complete
            let allDone = true;
            _.map(stops, stop => {
                if (stop.status !== 'Completed') {
                    allDone = false;
                }
            });

            if (allDone) {
                status = 'Complete';
                actualEndTime = moment();
            }
            //
            if (!trip.actualStartTime) {
                timeToUpdate.actualStartTime = actualStartTime;
            }
            if (!trip.actualEndTime) {
                timeToUpdate.actualEndTime = actualEndTime;
            }
            if (status !== trip.status) {
                await trip.updateAttributes({
                    status,
                    ...timeToUpdate,
                });
            }
            // warning flag
            let warningFlag = false;
            if (['No Bid', 'Delay'].indexOf(status) !== -1) {
                warningFlag = true;
            }
            if (warningFlag !== trip.warningFlag) {
                await trip.updateAttributes({
                    warningFlag,
                });
            }
            // appt flag
            const apptFlag = false;

            // await Promise.all(_.map(stops, async s => {
            //     if (!s.plannedDateTime) {
            //         apptFlag = true;
            //     }
            // }));
            if (apptFlag !== trip.apptFlag) {
                // const warningFlagToUpdate = {};
                // if (apptFlag) warningFlagToUpdate.warningFlag = true;
                await trip.updateAttributes({
                    apptFlag,
                    //...warningFlagToUpdate,
                });
            }
            await trip.reload();
        }));

        // active status
        // Job Type==Import, & Trip#==1, & Status of the Job is 'Active'
        // Job Type==Import, & Trip#>1, & Status of Trip#-1 == 'Complete'
        // Job Type==Export, & Trip#==1, & Status of the Job is 'Active'
        // Job Type==Export, & Trip#>1, & Status of Trip#-1 is 'Complete'
        // Job Type==Cross Town, & Trip#==1, Job Status=='Active'
        // Job Type==Cross Town, & Trip#>1, & Status of Trip#-1== 'Complete'
        if (
            ['New'].indexOf(trips[0].status) !== -1
            // && job.status === 'Active'
        ) {
            trips[0].stop = await trips[0].getStop();
            if (calcTripActive(trips[0], job, container)) {
                await trips[0].updateAttributes({ status: 'Active' });
                await trips[0].reload();
            }
        }
        if (!trips[0].readyForDispatch) {
            await trips[0].updateAttributes({ readyForDispatch: true });
            await trips[0].reload();
        }
        for (let i = 1; i < trips.length; i++) {
            if (
                trips[i - 1].status === 'Complete' &&
                ['New'].indexOf(trips[i].status) !== -1
            ) {
                trips[i].stop = await trips[i].getStop();
                if (calcTripActive(trips[i], job, container)) {
                    await trips[i].updateAttributes({ status: 'Active' });
                }
            }
            if (
                trips[i - 1].status === 'Complete' &&
                !trips[i].readyForDispatch
            ) {
                await trips[i].updateAttributes({ readyForDispatch: true });
            }
        }
    },

    setStatusForContainer: async con => {
        let trips = await con.getTrip();
        trips = _.sortBy(trips, ['rowNo']);
        const job = await con.getJob();
        if (!job) return;
        let status = 'Scheduling';
        // calculate todo actions.
        let toDoActions = '';
        const streetTurn = false;
        const type = job.type;

        switch (type) {
            case 'Import':
                if (_.size(trips) > 1 && _.isNil(con.emptyReadyDate)) {
                    toDoActions = 'Set MT Ready Date';
                }
                let consigneeDropoffTrip,
                    terminalDropOffEmptyTrip;
                _.map(trips, async t => {
                    await t.getStop();
                    _.map(t.stop, s => {
                        if (
                            s.type === 'consignee' &&
                            s.action === 'drop-off load' &&
                            s.signature !== null
                        ) {
                            consigneeDropoffTrip = t;
                        }
                        if (
                            s.type === 'terminal' &&
                            s.action === 'drop-off empty' &&
                            s.signature === null
                        ) {
                            terminalDropOffEmptyTrip = t;
                        }
                    });
                });

                if (consigneeDropoffTrip && terminalDropOffEmptyTrip) {
                    toDoActions = 'Street Turn Opp';
                }
                break;
            case 'Export':
                if (!con.emptyRequestDate) {
                    toDoActions = 'Set MT Rqst Date';
                } else if (!con.emptyRequestDate) {
                    toDoActions = 'Set Ld Ready Date';
                }
                break;
            default:
        }

        // No Trips   no Trip is created
        if (_.size(trips) === 0) {
            status = 'No Trips';
        }
        // Transit: 'Stop Type' Any one of Trips status == Transit. Stop type=the Type of the last Stop of that Trip (of which status is In Transit).

        // At 'Stop type' A container has 2 or more Trips. & the status of  the most recent Trip is Complete.  Put the last Stop type of that Trip.
        // Complete Status for all Trips for the container are "Complete"
        let completeFlag = true;
        _.map(trips, trip => {
            if (trip.status !== 'Complete') {
                completeFlag = false;
            }
        });
        if (_.size(trips) > 0) {
            if (completeFlag) {
                status = 'Complete';
            } else {
                // not complete
                let hasTransitTrip = false;
                _.map(trips, trip => {
                    if (trip.status === 'En Route') {
                        hasTransitTrip = true;
                    }
                });
                if (hasTransitTrip) {
                    const currentTrip = _.findLast(trips, {
                        status: 'En Route',
                    });
                    let currentStops = await currentTrip.getStop();
                    currentStops = _.sortBy(currentStops, ['stopNo']);
                    if (_.size(currentStops) > 0) {
                        const lastStop = currentStops[_.size(currentStops) - 1];
                        status = `In Transit: ${lastStop.type}`;
                    }
                } else {
                    const currentTrip = _.findLast(trips, {
                        status: 'Complete',
                    });
                    if (currentTrip) {
                        let currentStops = await currentTrip.getStop();
                        currentStops = _.sortBy(currentStops, ['stopNo']);
                        if (_.size(currentStops) > 0) {
                            const lastStop =
                                currentStops[_.size(currentStops) - 1];
                            status = `At: ${lastStop.type}`;
                        }
                    }
                }
            }
        }

        if (status !== con.status) {
            await con.updateAttributes({
                status,
            });
        }
        if (toDoActions !== con.toDoActions) {
            await con.updateAttributes({
                toDoActions,
            });
        }

        // warning flag
        let warningFlag = false;
        if (['No Trips'].indexOf(status) !== -1) {
            warningFlag = true;
        }
        _.map(trips, trip => {
            if (trip.warningFlag) warningFlag = true;
        });
        if (warningFlag !== con.warningFlag) {
            await con.updateAttributes({
                warningFlag,
            });
        }
    },
};
