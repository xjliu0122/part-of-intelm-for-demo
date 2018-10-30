//const util = require(`${global.appRoot}/util`);
module.exports = (sequelize, DataTypes) => {
    const Company = sequelize.define(
        'Company',
        {
            id: {
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            //general company info
            name: DataTypes.STRING,
            address: DataTypes.STRING,
            year: DataTypes.INTEGER,
            phone: DataTypes.STRING,
            fax: DataTypes.STRING,
            email: DataTypes.STRING,
            businessType: {
                type: DataTypes.ENUM,
                values: ['Sole Proprietor', 'Corporation', 'LLC', 'LLP'],
                defaultValue: 'Corporation',
            },
            taxId: DataTypes.STRING,
            SCAC: DataTypes.STRING,
            type: {
                type: DataTypes.ENUM,
                values: [
                    'Shipper/Consignee', // shipper --> role of users for shiper is "user"
                    'Importer/Exporter',
                    '3 PL',
                    'Customs Broker',
                    'Freight Broker',
                    'Container Terminal',
                    'Ocean Carrier',
                    'Others',
                    'Dispatcher',
                    'Trucking Company',
                    'Owner Operator', //carrier -->  role of users for carrier is "carrier"
                ],
                defaultValue: 'Shipper/Consignee',
            },
            ratings: DataTypes.STRING,
            notes: DataTypes.STRING,
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
            active: { type: DataTypes.BOOLEAN, defaultValue: true },
            suspended: { type: DataTypes.BOOLEAN, defaultValue: false },
            qboCompanyId: DataTypes.STRING,
            qboSyncToken: DataTypes.STRING,
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
            ],
        },
    );

    Company.associate = function (models) {
        models.Company.hasMany(models.User, {
            as: 'user',
            foreignKey: 'companyId',
        });
        models.Company.hasOne(models.CarrierInfo, {
            as: 'carrierInfo',
            foreignKey: 'companyId',
        });
        models.Company.hasOne(models.AccSetting, {
            as: 'accSetting',
            foreignKey: 'companyId',
        });
        models.Company.belongsTo(models.AccAddress, {
            as: 'billingAddress',
            foreignKey: 'billingAddressId',
        });
        models.Company.belongsTo(models.AccAddress, {
            as: 'paymentAddress',
            foreignKey: 'paymentAddressId',
        });
        models.Company.belongsTo(models.GeoLocation, {
            as: 'geoLocation',
            foreignKey: 'geoLocationId',
        });
        models.Company.belongsTo(models.GeoLocation, {
            as: 'garageAddress',
            foreignKey: 'garageAddressGeoLocationId',
        });
        models.Company.hasMany(models.CarrierStateAreas, {
            as: 'operationStateArea',
            foreignKey: 'companyId',
        });
    };
    return Company;
};
