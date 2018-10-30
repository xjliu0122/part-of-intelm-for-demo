// IntelModal Sync Customers to QBO

// Global Variables
const env = process.env.NODE_ENV || 'development';

global.appConfig = require('../config')[env];

global.appRoot = `${__dirname}/..`;
const _ = require('lodash');
const axios = require('axios');
const moment = require('moment');
const models = require('../models');
const Util = require('./util');

const fromMoment = process.env.FROM_DATETIME
    ? moment(process.env.FROM_DATETIME)
    : moment()
        .subtract(90, 'day');
const Op = models.Sequelize.Op;

const createVendor = async company => {
    try {
        const conf = Util.getQboAxiosConfig('/vendor');

        const resp = await axios({
            ...conf,
            method: 'post',
            data: {
                DisplayName: company.dataValues.name,
                CompanyName: company.dataValues.name,
                PrimaryPhone: {
                    FreeFormNumber: company.dataValues.phone,
                },
            },
        });
        if (resp.status === 200) {
            const qbCompany = resp.data.Vendor;
            if (qbCompany) {
                await company.updateAttributes({
                    qboCompanyId: qbCompany.Id,
                    qboSyncToken: qbCompany.SyncToken,
                });
            }
        }
    } catch (err) {
        console.error(err);
    }
};

const findVendor = async company => {
    const conf = Util.getQboAxiosConfig(`/query?query=select * from Vendor Where CompanyName='${
        company.dataValues.name
    }'`);

    try {
        const resp = await axios({
            ...conf,
            method: 'GET',
            'Content type': 'text/plain',
        });

        if (resp.status === 200) {
            const qbCompany = _.get(resp, 'data.QueryResponse.Vendor[0]');
            if (qbCompany) {
                await company.updateAttributes({
                    qboCompanyId: qbCompany.Id,
                    qboSyncToken: qbCompany.SyncToken,
                });
            }
        }
    } catch (err) {
        console.error(err);
    }
};

const findVendorFetchLatestSyncToken = async company => {
    if (!company.dataValues.qboCompanyId) return;
    const conf = Util.getQboAxiosConfig(`/query?query=select * from Vendor Where Id='${
        company.dataValues.qboCompanyId
    }'`);

    try {
        const resp = await axios({
            ...conf,
            method: 'GET',
            'Content type': 'text/plain',
        });

        if (resp.status === 200) {
            const qbCompany = _.get(resp, 'data.QueryResponse.Vendor[0]');
            if (qbCompany) {
                await company.updateAttributes({
                    qboSyncToken: qbCompany.SyncToken,
                });
            }
        }
    } catch (err) {
        console.error(err);
    }
};

const updateVendor = async company => {
    try {
        const conf = Util.getQboAxiosConfig('/vendor');
        if (!_.get(company.dataValues, 'qboCompanyId')) return;
        await findVendorFetchLatestSyncToken(company);
        const resp = await axios({
            ...conf,
            data: {
                sparse: true,
                Id: _.get(company.dataValues, 'qboCompanyId'),
                SyncToken: _.get(company.dataValues, 'qboSyncToken'),
                DisplayName: company.dataValues.name,
                CompanyName: company.dataValues.name,
                PrimaryPhone: {
                    FreeFormNumber: company.dataValues.phone,
                },
            },
            method: 'POST',
        });
        if (resp.status === 200) {
            const qbCompany = resp.data.Vendor;
            if (qbCompany) {
                await company.updateAttributes({
                    qboCompanyId: qbCompany.Id,
                    qboSyncToken: qbCompany.SyncToken,
                });
            }
        }
    } catch (err) {
        console.error(err);
    }
};

// now do the actual job.
const doWork = async () => {
    try {
        // 0. get service credentials.
        await Util.getAuthObject();
        //1. sync if missing.
        let companies = await models.Company.findAll({
            where: {
                updatedAt: {
                    [Op.gte]: fromMoment,
                },
                qboCompanyId: {
                    [Op.eq]: null,
                },
                type: {
                    [Op.in]: ['Trucking Company', 'Owner Operator'],
                },
            },
        });
        await Promise.all(_.map(companies, async company => {
            await findVendor(company);
        }));

        //2  sync all data for updating exsiting ones
        companies = await models.Company.findAll({
            where: {
                updatedAt: {
                    [Op.gte]: fromMoment,
                },
                type: {
                    [Op.in]: ['Trucking Company', 'Owner Operator'],
                },
            },
        });

        for (let i = 0; i < companies.length; i++) {
            await updateVendor(companies[i]);
        }

        // now. those still emtpy ones are new ones. to be created.
        companies = await models.Company.findAll({
            where: {
                updatedAt: {
                    [Op.gte]: fromMoment,
                },
                qboCompanyId: {
                    [Op.eq]: null,
                },
                type: {
                    [Op.in]: ['Trucking Company', 'Owner Operator'],
                },
            },
        });
        for (let i = 0; i < companies.length; i++) {
            await createVendor(companies[i]);
        }
        // last step. create these entries in local vendor table.
        companies = await models.Company.findAll({
            where: {
                updatedAt: {
                    [Op.gte]: fromMoment,
                },
                qboCompanyId: {
                    [Op.ne]: null,
                },
                type: {
                    [Op.in]: ['Trucking Company', 'Owner Operator'],
                },
            },
        });
        await Promise.all(_.map(companies, async comp => {
            const vendor = await models.Vendor.findOne({
                where: { id: comp.id },
            });
            if (vendor) {
                vendor.updateAttributes({
                    qboId: comp.qboCompanyId,
                    name: comp.name,
                    type: 'mc',
                });
            } else {
                await models.Vendor.create({
                    id: comp.id,
                    qboId: comp.qboCompanyId,
                    name: comp.name,
                    type: 'mc',
                });
            }
        }));
        process.exit(0);
    } catch (e) {
        console.log(e);
        process.exit(1);
    }
};
setTimeout(doWork, 10000);
