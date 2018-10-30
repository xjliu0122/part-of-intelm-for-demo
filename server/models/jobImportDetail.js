const util = require(`${global.appRoot}/util`);
module.exports = (sequelize, DataTypes) => {
    const JobImportDetail = sequelize.define(
        'JobImportDetail',
        {
            id: {
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            billOfLading: { type: DataTypes.STRING }, //index: true },
            etaDate: DataTypes.DATE,
            customsClearDate: DataTypes.DATE,
            marineCarrier: { type: DataTypes.STRING },
            terminal: DataTypes.STRING,
            vesselName: DataTypes.STRING,
            voyageNumber: DataTypes.STRING,
            shipper: DataTypes.STRING,
            customs: {
                type: DataTypes.ENUM,
                values: ['Pending', 'Under Exam', 'Cleared'],
                defaultValue: 'Pending',
            },
            released: DataTypes.DATE,
            lastFreeDate: DataTypes.DATE,
            miscFields: {
                type: DataTypes.JSON,
                defaultValue: {},
            },
        },
        {
            indexes: [
                {
                    fields: ['billOfLading'],
                },
            ],
        },
    );
    return JobImportDetail;
};
