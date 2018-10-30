const util = require(`${global.appRoot}/util`);
module.exports = (sequelize, DataTypes) => {
    const AccAddress = sequelize.define('AccAddress', {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
        type: {
            type: DataTypes.ENUM,
            values: ['billing', 'payment'],
        },

        sameAsCompany: DataTypes.BOOLEAN,
        name: DataTypes.STRING,
        address: DataTypes.STRING,
        phone: DataTypes.STRING,
        fax: DataTypes.STRING,
        email: DataTypes.STRING,
        note: DataTypes.STRING,

        miscFields: {
            type: DataTypes.JSON,
            defaultValue: {},
        },
    });

    AccAddress.associate = function (models) {};

    return AccAddress;
};
