const util = require(`${global.appRoot}/util`);
module.exports = (sequelize, DataTypes) => {
    const Invoice = sequelize.define('Invoice', {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
        externalId: DataTypes.STRING,
        amount: DataTypes.DECIMAL(9, 2),
        miscFields: {
            type: DataTypes.JSON,
            defaultValue: {},
        },
    });
    Invoice.associate = function (models) {
        models.Invoice.belongsTo(models.Job, {
            foreignKey: 'jobId',
            as: 'job',
        });
        models.Invoice.belongsTo(models.User, {
            foreignKey: 'createdById',
            as: 'createdBy',
        });
    };
    return Invoice;
};
