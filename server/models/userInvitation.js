module.exports = (sequelize, DataTypes) => {
    const UserInvitation = sequelize.define('UserInvitation', {
        email: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        code: DataTypes.STRING,
        company: DataTypes.STRING,
        miscFields: {
            type: DataTypes.JSON,
            defaultValue: {},
        },
    });
    return UserInvitation;
};
