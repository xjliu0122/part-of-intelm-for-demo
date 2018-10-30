const models = require(`${global.appRoot}/models`);
const util = require(`${global.appRoot}/util`);
const _ = require('lodash');

module.exports = {
    processNotifications: async (req, res, next) => {
        try {
            const { body } = req;
            const notifications = _.get(
                body,
                'eventNotifications[0].dataChangeEvent.entities',
            );
            if (_.size(notifications) > 0) {
                // prepare for db insert
                const toInsert = [];
                _.map(notifications, notif =>
                    toInsert.push({
                        type: notif.name,
                        qboId: notif.id,
                        operation: notif.operation,
                        qboLastUpdated: notif.lastUpdated,
                    }));
                models.QboNotification.bulkCreate(toInsert);
            }
            res.send(200);
        } catch (err) {
            next(err);
            res.status(400)
                .send(err.message);
        }
    },
};
