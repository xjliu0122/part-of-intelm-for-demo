module.exports = (sequelize, DataTypes) => {
    const AccSetting = sequelize.define('AccSetting', {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
        paymentTerm: DataTypes.STRING,
        paymentMethod: {
            type: DataTypes.ENUM,
            values: ['Check', 'ACH', 'Debit/Credit Card'],
            defaultValue: 'Check',
        },

        creditLimit: DataTypes.INTEGER,
        status: DataTypes.STRING,
        statusUpdatedByUser: DataTypes.INTEGER,
        miscFields: {
            type: DataTypes.JSON,
            defaultValue: {},
        },
    });

    AccSetting.associate = function (models) {};

    return AccSetting;
};
