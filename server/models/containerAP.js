const util = require(`${global.appRoot}/util`);
module.exports = (sequelize, DataTypes) => {
    const ContainerAP = sequelize.define(
        'ContainerAP',
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
            tripRowNoInContainer: DataTypes.INTEGER,
            miscFields: {
                type: DataTypes.JSON,
                defaultValue: {},
            },
        },
        {
            indexes: [
                {
                    fields: ['createdAt'],
                },
            ],
        },
    );

    ContainerAP.associate = function (models) {
        models.ContainerAP.belongsTo(models.Vendor, {
            foreignKey: 'payeeId',
            as: 'payee',
        });
        models.ContainerAP.belongsTo(models.Container, {
            foreignKey: 'containerId',
            as: 'container',
        });
        models.ContainerAP.belongsTo(models.User, {
            foreignKey: 'addedById',
            as: 'addedBy',
        });
        models.ContainerAP.belongsTo(models.User, {
            foreignKey: 'updatedById',
            as: 'updatedBy',
        });
    };

    return ContainerAP;
};
