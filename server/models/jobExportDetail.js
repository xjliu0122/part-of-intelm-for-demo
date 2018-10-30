module.exports = (sequelize, DataTypes) => {
    const JobExportDetail = sequelize.define(
        'JobExportDetail',
        {
            id: {
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },

            booking: { type: DataTypes.STRING }, //index: true },
            consignee: DataTypes.STRING,
            dateOfDeparture: DataTypes.DATE,
            marineCarrier: { type: DataTypes.STRING },
            terminal: DataTypes.STRING,
            vesselName: DataTypes.STRING,
            voyageNumber: DataTypes.STRING,
            emptyStartDate: DataTypes.DATE,
            fullStartDate: DataTypes.DATE,
            cutOffDate: DataTypes.DATE,
            miscFields: {
                type: DataTypes.JSON,
                defaultValue: {},
            },
        },
        {
            indexes: [
                {
                    fields: ['booking'],
                },
            ],
        },
    );

    return JobExportDetail;
};
