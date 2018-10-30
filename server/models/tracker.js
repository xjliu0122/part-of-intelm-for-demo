const util = require(`${global.appRoot}/util`);
module.exports = (sequelize, DataTypes) => {
    const Tracker = sequelize.define('Tracker', {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
        dateTime: {
            type: DataTypes.DATE,
            defaultValue: new Date(),
        },
        geoPoint: DataTypes.GEOMETRY('POINT'),
        miscFields: {
            type: DataTypes.JSON,
            defaultValue: {},
        },
    });

    Tracker.associate = function (models) {
        models.Tracker.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user',
        });
    };

    return Tracker;
};
