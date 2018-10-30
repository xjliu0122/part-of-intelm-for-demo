const util = require(`${global.appRoot}/util`);
module.exports = (sequelize, DataTypes) => {
    const GeoLocation = sequelize.define('GeoLocation', {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
        coordinates: DataTypes.GEOMETRY('POINT'),
        address: DataTypes.STRING,
        zipCode: DataTypes.STRING,
        city: DataTypes.STRING,
        state: DataTypes.STRING,
        miscFields: DataTypes.JSON,
    });

    return GeoLocation;
};
