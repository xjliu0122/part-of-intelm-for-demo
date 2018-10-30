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

const createCustomer = async company => {
    try {
        const conf = Util.getQboAxiosConfig('/customer');

        const newCustomerResponse = await axios({
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
        if (newCustomerResponse.status === 200) {
            const qbCompany = newCustomerResponse.data.Customer;
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

const findCustomer = async company => {
    const conf = Util.getQboAxiosConfig(`/query?query=select * from Customer Where CompanyName='${
        company.dataValues.name
    }'`);

    try {
        const newCustomerResponse = await axios({
            ...conf,
            method: 'GET',
            'Content type': 'text/plain',
        });

        if (newCustomerResponse.status === 200) {
            const qbCompany = _.get(
                newCustomerResponse,
                'data.QueryResponse.Customer[0]',
            );
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

const findCustomerFetchLatestSyncToken = async company => {
    const conf = Util.getQboAxiosConfig(`/query?query=select * from Customer Where Id='${
        company.dataValues.qboCompanyId
    }'`);

    try {
        const newCustomerResponse = await axios({
            ...conf,
            method: 'GET',
            'Content type': 'text/plain',
        });

        if (newCustomerResponse.status === 200) {
            const qbCompany = _.get(
                newCustomerResponse,
                'data.QueryResponse.Customer[0]',
            );
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

const updateCustomer = async company => {
    try {
        const conf = Util.getQboAxiosConfig('/customer');
        if (!_.get(company.dataValues, 'qboCompanyId')) return;
        await findCustomerFetchLatestSyncToken(company);
        const newCustomerResponse = await axios({
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
        if (newCustomerResponse.status === 200) {
            const qbCompany = newCustomerResponse.data.Customer;
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
                    [Op.in]: [
                        'Shipper/Consignee',
                        'Importer/Exporter',
                        '3 PL',
                        'Customs Broker',
                        'Freight Broker',
                        'Container Terminal',
                        'Ocean Carrier',
                        'Others',
                    ],
                },
            },
        });
        await Promise.all(_.map(companies, async company => {
            await findCustomer(company);
        }));

        //2  sync all data for updating exsiting ones
        companies = await models.Company.findAll({
            where: {
                updatedAt: {
                    [Op.gte]: fromMoment,
                },
                type: {
                    [Op.in]: [
                        'Shipper/Consignee',
                        'Importer/Exporter',
                        '3 PL',
                        'Customs Broker',
                        'Freight Broker',
                        'Container Terminal',
                        'Ocean Carrier',
                        'Others',
                    ],
                },
            },
        });

        for (let i = 0; i < companies.length; i++) {
            await updateCustomer(companies[i]);
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
                    [Op.in]: [
                        'Shipper/Consignee',
                        'Importer/Exporter',
                        '3 PL',
                        'Customs Broker',
                        'Freight Broker',
                        'Container Terminal',
                        'Ocean Carrier',
                        'Others',
                    ],
                },
            },
        });
        for (let i = 0; i < companies.length; i++) {
            await createCustomer(companies[i]);
        }

        process.exit(0);
    } catch (e) {
        console.log(e);
        process.exit(1);
    }
};
setTimeout(doWork, 10000);
