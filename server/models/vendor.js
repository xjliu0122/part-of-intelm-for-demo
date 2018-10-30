module.exports = (sequelize, DataTypes) => {
    const Vendor = sequelize.define('Vendor', {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
        type: {
            type: DataTypes.STRING,
            required: true,
            defaultValue: 'qbo',
        },
        qboId: {
            type: DataTypes.STRING,
            required: true,
        },
        name: {
            type: DataTypes.STRING,
            required: true,
        },
    });

    return Vendor;
};
