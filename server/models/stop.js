const util = require(`${global.appRoot}/util`);
module.exports = (sequelize, DataTypes) => {
    const Stop = sequelize.define('Stop', {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
        stopNo: DataTypes.INTEGER,
        type: {
            type: DataTypes.ENUM,
            values: [
                'terminal',
                'consignee',
                'street-turn',
                'shipper',
                'stopover',
                'dray-yard',
            ],
            required: true,
        },
        action: {
            type: DataTypes.ENUM,
            values: [
                'pick-up empty',
                'pick-up load',
                'drop-off load',
                'drop-off empty',
            ],
            required: true,
        },
        status: DataTypes.STRING,
        plannedDateTime: DataTypes.DATE,
        actualTime: DataTypes.DATE, // actual finish time.
        needAppointment: { type: DataTypes.BOOLEAN, defaultValue: false },
        signature: DataTypes.JSON,
        pdfDocLink: DataTypes.STRING,
        //{
        //     name: String,
        //     dataURL: String,
        //     date: Date,
        // },
        appointmentNo: DataTypes.STRING,
        miscFields: {
            type: DataTypes.JSON,
            defaultValue: {},
        },
    });

    Stop.associate = function (models) {
        models.Stop.belongsTo(models.Location, {
            foreignKey: 'stopLocationId',
            as: 'stopLocation',
        });
    };
    return Stop;
};
