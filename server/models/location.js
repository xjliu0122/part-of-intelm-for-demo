const util = require(`${global.appRoot}/util`);
module.exports = (sequelize, DataTypes) => {
    const Location = sequelize.define(
        'Location',
        {
            id: {
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            name: {
                type: DataTypes.STRING,
                required: true,
            },
            code: DataTypes.STRING, // port or rail code
            active: { type: DataTypes.BOOLEAN, defaultValue: true },
            type: {
                type: DataTypes.ENUM([
                    'Port',
                    'Business',
                    'Tradeshow',
                    'Residential',
                    'OCEANPORT',
                ]),
                defaultValue: 'Business',
            },
            notes: DataTypes.STRING,
            contactName: DataTypes.STRING,
            contactPhone: DataTypes.STRING,
            contactEmail: DataTypes.STRING,
            miscFields: {
                type: DataTypes.JSON,
                defaultValue: {},
            },
        },
        {
            indexes: [
                {
                    fields: ['type'],
                },
                {
                    fields: ['name'],
                },
            ],
        },
    );
    Location.associate = function (models) {
        models.Location.belongsTo(models.GeoLocation, {
            foreignKey: 'geoLocationId',
            as: 'geoLocation',
        });
        models.Location.belongsTo(models.User, {
            foreignKey: 'createdById',
            as: 'createdBy',
        });
        models.Location.belongsTo(models.Company, {
            foreignKey: 'managedByCompanyId',
            as: 'managedByCompany',
        });
    };
    return Location;
};
