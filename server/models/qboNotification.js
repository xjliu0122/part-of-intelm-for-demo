module.exports = (sequelize, DataTypes) => {
    const QboNotification = sequelize.define('QboNotification', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        type: DataTypes.STRING,
        qboId: DataTypes.STRING,
        operation: DataTypes.STRING,
        qboLastUpdated: DataTypes.DATE,
    });

    return QboNotification;
};
