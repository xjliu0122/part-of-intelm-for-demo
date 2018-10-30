module.exports = (sequelize, DataTypes) => {
    const CarrierInfo = sequelize.define(
        'CarrierInfo',
        {
            id: {
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            mc: DataTypes.STRING,
            dot: DataTypes.STRING,
            publicLiabilityinsuranceProvider: DataTypes.STRING,
            cargoInsuranceProvider: DataTypes.STRING,
            ownerOperator: DataTypes.BOOLEAN,
            twic: DataTypes.STRING,
            hazmat: DataTypes.BOOLEAN,
            oversize: DataTypes.BOOLEAN,
            overweight: DataTypes.BOOLEAN,
            serviceTypeDrayage: DataTypes.BOOLEAN,
            serviceTypeRailDrayage: DataTypes.BOOLEAN,
            serviceTypeTankDrayage: DataTypes.BOOLEAN,
            serviceTypeOversize: DataTypes.BOOLEAN,
            serviceTypeHazmat: DataTypes.BOOLEAN,
            serviceTypeBondedWarehouse: DataTypes.BOOLEAN,
            defaults: DataTypes.JSON,
            miscFields: {
                type: DataTypes.JSON,
                defaultValue: {},
            },
        },
        {
            indexes: [
                {
                    fields: ['serviceTypeDrayage'],
                },
                {
                    fields: ['serviceTypeRailDrayage'],
                },
                {
                    fields: ['serviceTypeTankDrayage'],
                },
                {
                    fields: ['serviceTypeOversize'],
                },
                {
                    fields: ['serviceTypeHazmat'],
                },
                {
                    fields: ['serviceTypeBondedWarehouse'],
                },
            ],
        },
    );

    return CarrierInfo;
};
