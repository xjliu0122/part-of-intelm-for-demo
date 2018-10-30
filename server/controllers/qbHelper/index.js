const helper = require('../../crons/util');
const Config = require('./config');
const _ = require('lodash');
const axios = require('axios');
const uuid = require('uuid');

const getQboAxiosConfig = async (user, path) => {
    const token = await helper.getAuthToken(user);
    return helper.getQboAxiosConfig(path, token);
};

const getSKUFromType = type => {
    const obj = _.find(Config.qboParts, { type });
    return obj && obj.sku;
};
module.exports = {
    getQboInvoiceById: async (invoiceId, user) => {
        const config = await getQboAxiosConfig(user, `/invoice/${invoiceId}`);

        try {
            const resp = await axios({
                ...config,
                method: 'GET',
            });
            const invoice = _.get(resp, 'data.Invoice');
            return invoice;
        } catch (err) {
            console.log(err);
            return null;
        }
    },
    getQboBillById: async (id, user) => {
        const config = await getQboAxiosConfig(user, `/bill/${id}`);

        try {
            const resp = await axios({
                ...config,
                method: 'GET',
            });
            const bill = _.get(resp, 'data.Bill');
            return bill;
        } catch (err) {
            console.log(err);
            return null;
        }
    },
    createQboInvoice: async (newInvoice, user) => {
        const config = await getQboAxiosConfig(user, '/invoice');

        try {
            const resp = await axios({
                ...config,
                method: 'POST',
                'Content-type': 'application/json',
                data: newInvoice,
            });
            const invoice = _.get(resp, 'data.Invoice');
            return invoice;
        } catch (err) {
            console.log(err);
            return null;
        }
    },
    createQboBill: async (newBill, user) => {
        const config = await getQboAxiosConfig(user, '/bill');

        try {
            const resp = await axios({
                ...config,
                method: 'POST',
                'Content-type': 'application/json',
                data: newBill,
            });
            const bill = _.get(resp, 'data.Bill');
            return bill;
        } catch (err) {
            console.log(err);
            return null;
        }
    },
    getQBOStatement: async ({
        user, qboCompId, from, to,
    }) => {
        const config = await getQboAxiosConfig(
            user,
            `/reports/TransactionList?customer=${qboCompId}&columns=tx_date,txn_type,due_date,subt_nat_amount,nat_open_bal&start_date=${from}&end_date=${to}`,
        );

        try {
            const resp = await axios({
                ...config,
                method: 'GET',
                'Accept-type': 'application/json',
            });
            //const bill = _.get(resp, 'data.Bill');
            const result = [];
            const columns = _.get(resp, 'data.Columns.Column');
            const rows = _.get(resp, 'data.Rows.Row');
            _.map(rows, row => {
                const colData = row.ColData;
                const line = { id: uuid() };
                _.map(colData, (col, ind) => {
                    line[columns[ind].ColType] = col;
                });
                if (_.get(line, 'txn_type.value') === 'Invoice') {
                    result.push(line);
                }
            });
            return result;
        } catch (err) {
            console.log(err);
            return null;
        }
    },
    getQBOInvoicePDF: async (id, user) => {
        const config = await getQboAxiosConfig(user, `/invoice/${id}/pdf`);

        try {
            const resp = await axios({
                ...config,
                method: 'GET',
                headers: {
                    ...config.headers,
                    Accept: 'application/pdf',
                },
                responseType: 'arraybuffer',
            });

            return resp.data;
        } catch (err) {
            console.log(err);
            return null;
        }
    },
};
