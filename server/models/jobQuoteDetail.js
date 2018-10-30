module.exports = (sequelize, DataTypes) => {
    const JobQuoteDetail = sequelize.define('JobQuoteDetail', {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
        charge: DataTypes.DECIMAL(9, 2),
        isContractRate: DataTypes.BOOLEAN,
        note: DataTypes.STRING,
        sentByIM: DataTypes.DATE,
        bookingByClient: DataTypes.DATE,
        bookedByClient: DataTypes.DATE,
        miscFields: {
            type: DataTypes.JSON,
            defaultValue: {},
        },
    });

    // JobQuoteDetail.associate = function (models) {
    //     models.JobQuoteDetail.belongsTo(models.Job, {
    //         foreignKey: 'jobId',
    //     });
    // };

    return JobQuoteDetail;
};
