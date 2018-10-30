const util = require(`${global.appRoot}/util`);
module.exports = (sequelize, DataTypes) => {
    const Trip = sequelize.define(
        'Trip',
        {
            id: {
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            amount: DataTypes.DECIMAL(9, 2), // cost and to pay the tuckers.
            fixedAmount: DataTypes.DECIMAL(9, 2),
            rowNo: DataTypes.INTEGER,
            scheduleRowNo: DataTypes.INTEGER,
            status: {
                type: DataTypes.STRING,
                defaultValue: 'New',
            },
            //auxiliary and derived information to support query
            startLocation: DataTypes.GEOMETRY('POINT'),
            endLocation: DataTypes.GEOMETRY('POINT'),
            estimatedStartTime: DataTypes.DATE, //derived time from stops, for query purpose
            estimatedEndTime: DataTypes.DATE, //derived time from stops, for query purpose
            actualStartTime: DataTypes.DATE, //derived time from stops, for query purpose
            actualEndTime: DataTypes.DATE, //derived time from stops, for query purpose
            totalDistance: DataTypes.DECIMAL(9, 2),
            warningFlag: { type: DataTypes.BOOLEAN, defaultValue: false },
            apptFlag: { type: DataTypes.BOOLEAN, defaultValue: false },
            note: DataTypes.TEXT,
            mcInstruction: DataTypes.TEXT,
            refNo: DataTypes.STRING,
            noticeSent: DataTypes.BOOLEAN,
            readyForDispatch: DataTypes.BOOLEAN,
            miscFields: {
                type: DataTypes.JSON,
                defaultValue: {},
            },
        },
        {
            indexes: [
                {
                    fields: ['refNo'],
                },
                {
                    fields: ['createdAt'],
                },
                {
                    fields: [
                        'estimatedStartTime',
                        'status',
                        'portId',
                        'readyForDispatch',
                    ],
                },
                {
                    fields: ['status'],
                },
                {
                    fields: ['noticeSent'],
                },
            ],
        },
    );
    Trip.associate = function (models) {
        models.Trip.belongsTo(models.Company, {
            foreignKey: 'assigneeId',
            as: 'assignee',
        });
        models.Trip.hasMany(models.BidRequest, {
            foreignKey: 'tripId',
            as: 'bidRequest',
        });
        models.Trip.hasMany(models.Stop, {
            foreignKey: 'tripId',
            as: 'stop',
        });
        models.Trip.belongsTo(models.Location, {
            foreignKey: 'startLocationId',
            as: 'startGeoLocation',
        });
        models.Trip.belongsTo(models.Location, {
            foreignKey: 'endLocationId',
            as: 'endGeoLocation',
        });

        // aux info  for search
        models.Trip.belongsTo(models.Location, {
            foreignKey: 'portId',
            as: 'port',
        });
        models.Trip.belongsTo(models.Schedule, {
            foreignKey: 'scheduleId',
            as: 'schedule',
        });
        models.Trip.belongsTo(models.Container, {
            foreignKey: 'containerId',
            as: 'container',
        });
    };

    return Trip;
};
