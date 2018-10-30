const util = require(`${global.appRoot}/util`);
module.exports = (sequelize, DataTypes) => {
    const ContainerAR = sequelize.define(
        'ContainerAR',
        {
            id: {
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            type: DataTypes.STRING,
            amount: DataTypes.DECIMAL(9, 2),
            status: DataTypes.STRING,
            row: DataTypes.STRING,
            qboDocNo: DataTypes.STRING,
            qboDocItemNo: DataTypes.STRING,
            qboSyncToken: DataTypes.STRING,
            miscFields: {
                type: DataTypes.JSON,
                defaultValue: {},
            },
        },
        {
            indexes: [
                {
                    fields: ['qboDocNo'],
                },
            ],
        },
    );

    ContainerAR.associate = function (models) {
        models.ContainerAR.belongsTo(models.Company, {
            foreignKey: 'payerId',
            as: 'payer',
        });
        models.ContainerAR.belongsTo(models.Container, {
            foreignKey: 'containerId',
            as: 'container',
        });
        models.ContainerAR.belongsTo(models.User, {
            foreignKey: 'addedById',
            as: 'addedBy',
        });
        models.ContainerAR.belongsTo(models.User, {
            foreignKey: 'updatedById',
            as: 'updatedBy',
        });
    };

    return ContainerAR;
};
