module.exports = (sequelize, DataTypes) => {
    const ChangeLog = sequelize.define(
        'ChangeLog',
        {
            id: {
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            modelObject: DataTypes.STRING,
            parentUuid: DataTypes.UUID, // do not give default value
            action: DataTypes.STRING,
            miscFields: {
                type: DataTypes.JSON,
                defaultValue: {},
            },
        },
        {
            indexes: [
                {
                    fields: ['parentUuid'],
                },
            ],
        },
    );

    // set index

    return ChangeLog;
};
