module.exports = (sequelize, DataTypes) => {
    const CarrierStateAreas = sequelize.define(
        'CarrierStateAreas',
        {
            id: {
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            type: {
                type: DataTypes.ENUM,
                values: ['state', 'area'],
            },
            name: DataTypes.STRING,
            miscFields: {
                type: DataTypes.JSON,
                defaultValue: {},
            },
        },
        {
            indexes: [
                {
                    fields: ['type', 'name'],
                },
                {
                    fields: ['type', 'portId'],
                },
            ],
        },
    );

    CarrierStateAreas.associate = function (models) {
        models.CarrierStateAreas.belongsTo(models.Location, {
            as: 'port',
            foreignKey: 'portId',
        });
    };
    return CarrierStateAreas;
};
