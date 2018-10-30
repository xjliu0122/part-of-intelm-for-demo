const util = require(`${global.appRoot}/util`);
module.exports = (sequelize, DataTypes) => {
    const Schedule = sequelize.define('Schedule', {
        id: {
            primaryKey: true,
            type: DataTypes.INTEGER,
            autoIncrement: true,
        },

        currentDriverLocation: DataTypes.GEOMETRY('POINT'),
        currentLocationUpdate: DataTypes.DATE,

        startLocation: DataTypes.GEOMETRY('POINT'),
        endLocation: DataTypes.GEOMETRY('POINT'),
        estimatedStartTime: DataTypes.DATE, //derived time from stops, for query purpose
        estimatedEndTime: DataTypes.DATE, //derived time from stops, for query purpose

        requestingFixedBids: { type: DataTypes.BOOLEAN, defaultValue: false },
        // fixedAmount: DataTypes.DECIMAL(9, 2),
        //auxiliary and derived information to support query
        loadStarted: { type: DataTypes.BOOLEAN, defaultValue: false },
        completed: { type: DataTypes.BOOLEAN, defaultValue: false },
        miscFields: {
            type: DataTypes.JSON,
            defaultValue: {},
        },
    });

    // ScheduleSchema.plugin(AutoIncrement, {inc_field: 'scheduleNumber'});
    // registerEvents(ScheduleSchema);
    // ScheduleSchema.index({'trips.startLocation': '2dsphere'});
    // ScheduleSchema.index({'trips.endLocation': '2dsphere'});
    // ScheduleSchema.index({'currentDriverLocation.location': '2dsphere'});

    Schedule.associate = function (models) {
        models.Schedule.belongsTo(models.Company, {
            foreignKey: 'assigneeId',
            as: 'assignee',
        });
        models.Schedule.hasMany(models.Trip, {
            foreignKey: 'scheduleId',
            as: 'trip',
        });
        models.Schedule.belongsTo(models.User, {
            foreignKey: 'createdById',
            as: 'createdBy',
        });
        models.Schedule.belongsTo(models.User, {
            foreignKey: 'driverId',
            as: 'driver',
        });
    };

    return Schedule;
};
