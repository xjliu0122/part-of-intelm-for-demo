const util = require(`${global.appRoot}/util`);
module.exports = (sequelize, DataTypes) => {
    const BidRequest = sequelize.define('BidRequest', {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: 'Sent',
            required: true,
        },
        requestedByIM: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        amount: DataTypes.DECIMAL(9, 2),
        fixed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        unread: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        miscFields: {
            type: DataTypes.JSON,
            defaultValue: {},
        },
    });

    BidRequest.associate = function (models) {
        models.BidRequest.belongsTo(models.Company, {
            foreignKey: 'companyId',
            as: 'company',
        });
        models.BidRequest.belongsTo(models.Trip, {
            foreignKey: 'tripId',
            as: 'trip',
        });
    };
    return BidRequest;
};
