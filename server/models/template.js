const util = require(`${global.appRoot}/util`);
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },

        miscFields: {
            type: DataTypes.JSON,
            defaultValue: {},
        },
    });

    // User.associate = function (models) {
        // models.Payable.belongsTo(models.User, {            
        //     foreignKey:''
        // });
    // };

    return User;
};
