const util = require(`${global.appRoot}/util`);
module.exports = (sequelize, DataTypes) => {
    const Quote = sequelize.define(
        'Quote',
        {
            name: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            type: {
                type: DataTypes.ENUM,
                values: ['Import', 'Export', 'Cross Town'],
                required: true,
                //index: true,
            },

            remarks: DataTypes.STRING,
            notes: DataTypes.STRING,

            markedAsDeleted: { type: DataTypes.BOOLEAN, default: false },

            status: { type: DataTypes.STRING, defaultValue: 'New' },
            miscFields: {
                type: DataTypes.JSON,
                defaultValue: {},
            },
        },
        {
            indexes: [
                {
                    unique: true,
                    fields: ['name'],
                },
                {
                    fields: ['status'],
                },
            ],
        },
    );

    Quote.associate = function (models) {
        models.Quote.belongsTo(models.User, {
            foreignKey: 'createdById',
            as: 'createdBy',
        });
        models.Quote.belongsTo(models.Company, {
            foreignKey: 'clientId',
            as: 'client',
        });
        models.Quote.belongsTo(models.Location, {
            foreignKey: 'portId',
            as: 'port',
        });
        models.Quote.hasMany(models.Container, {
            foreignKey: 'quoteId',
            as: 'container',
        });
    };
    return Quote;
};
