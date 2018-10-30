const util = require(`${global.appRoot}/util`);
module.exports = (sequelize, DataTypes) => {
    const JobMessage = sequelize.define('JobMessage', {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
        text: DataTypes.STRING,
        time: DataTypes.DATE,
        miscFields: {
            type: DataTypes.JSON,
            defaultValue: {},
        },
    });
    JobMessage.associate = function (models) {
        models.JobMessage.belongsTo(models.User, {
            foreignKey: 'createdById',
            as: 'createdBy',
        });
    };
    return JobMessage;
};
