const util = require(`${global.appRoot}/util`);
module.exports = (sequelize, DataTypes) => {
    const Container = sequelize.define(
        'Container',
        {
            id: {
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            equipmentNo: DataTypes.STRING,
            type: DataTypes.STRING,
            grossWeight: DataTypes.STRING,

            description: DataTypes.STRING,
            seal: DataTypes.STRING,
            chassisType: DataTypes.STRING,
            chassisNo: DataTypes.STRING,
            charge: DataTypes.DECIMAL(9, 2),
            quotedAmt: DataTypes.DECIMAL(9, 2),
            revenue: DataTypes.DECIMAL(9, 2),
            length: DataTypes.DECIMAL(9, 2),
            width: DataTypes.DECIMAL(9, 2),
            height: DataTypes.DECIMAL(9, 2),
            status: {
                type: DataTypes.STRING,
                defaultValue: 'New',
            },
            seqNo: DataTypes.STRING,
            unit: {
                type: DataTypes.ENUM,
                values: ['in', 'cm', 'ft', 'm'],
                defaultValue: 'ft',
            },
            //Options
            loadingOptions: {
                type: DataTypes.ENUM,
                values: ['Live', 'Drop & Hook', 'Drop & Pickup later'],
                defaultValue: 'Live',
            },
            hazmat: DataTypes.BOOLEAN,
            overweight: DataTypes.BOOLEAN,
            oversize: DataTypes.BOOLEAN,
            pickupDate: { type: DataTypes.DATE }, //,all
            deliveryDate: { type: DataTypes.DATE }, //all
            emptyRequestDate: DataTypes.DATE, // export only
            lfdEmptyReturnDate: DataTypes.DATE, // import only
            emptyReadyDate: DataTypes.DATE, // import only
            loadReadyDate: DataTypes.DATE,
            warningFlag: { type: DataTypes.BOOLEAN, defaultValue: false },
            toDoActions: DataTypes.STRING,
            miscFields: {
                type: DataTypes.JSON,
                defaultValue: {},
            },
        },
        {
            indexes: [
                {
                    fields: ['pickupDate'],
                },
                {
                    fields: ['deliveryDate'],
                },
            ],
        },
    );

    Container.associate = function (models) {
        models.Container.hasMany(models.ContainerAR, {
            foreignKey: 'containerId',
            as: 'containerAR',
        });
        models.Container.hasMany(models.ContainerAP, {
            foreignKey: 'containerId',
            as: 'containerAP',
        });
        models.Container.hasMany(models.Trip, {
            foreignKey: 'containerId',
            as: 'trip',
        });
        models.Container.belongsTo(models.Location, {
            foreignKey: 'deliverToLocationId',
            as: 'deliverToLocation',
        });
        models.Container.belongsTo(models.Location, {
            foreignKey: 'pickupFromLocationId',
            as: 'pickupFromLocation',
        });
        models.Container.belongsTo(models.Job, {
            foreignKey: 'jobId',
            as: 'job',
        });
        models.Container.belongsTo(models.Quote, {
            foreignKey: 'quoteId',
            as: 'quote',
        });
    };

    return Container;
};
