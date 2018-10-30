const util = require(`${global.appRoot}/util`);
module.exports = (sequelize, DataTypes) => {
    const Job = sequelize.define(
        'Job',
        {
            // id: {
            //     primaryKey: true,
            //     type: DataTypes.UUID,
            //     defaultValue: DataTypes.UUIDV4,
            // },
            name: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            type: {
                type: DataTypes.ENUM,
                values: ['Import', 'Export', 'Cross Town', 'FTL', 'LTL'],
                required: true,
                //index: true,
            },
            // 1. common job stakeholder attributes

            clientRefNo: { type: DataTypes.STRING }, //, index: true },

            remarks: DataTypes.STRING,
            notes: DataTypes.STRING,
            markedAsDeleted: { type: DataTypes.BOOLEAN, defaultValue: false },
            fromQuote: DataTypes.STRING,
            status: { type: DataTypes.STRING, defaultValue: 'New' },
            warningFlag: { type: DataTypes.BOOLEAN, defaultValue: false },
            confirmationMailSent: { type: DataTypes.BOOLEAN, defaultValue: false },
            rmark: { type: DataTypes.BOOLEAN, defaultValue: false },
            amark: { type: DataTypes.BOOLEAN, defaultValue: false },
            //auxiliary and derived information to support query
            // completed: { type: Boolean, default: false, index: true },
            miscFields: {
                type: DataTypes.JSON,
                defaultValue: {},
            },
        },
        {
            indexes: [
                {
                    unique: true,
                    fields: ['name'],
                },
                {
                    fields: ['clientRefNo'],
                },
                {
                    fields: ['status'],
                },
                {
                    fields: ['portId'],
                },
                {
                    fields: ['rmark'],
                },
                {
                    fields: ['amark'],
                },
            ],
        },
    );

    Job.associate = function (models) {
        models.Job.belongsTo(models.Location, {
            foreignKey: 'shipperId',
            as: 'shipper',
        });
        models.Job.belongsTo(models.Location, {
            foreignKey: 'consigneeId',
            as: 'consignee',
        });
        models.Job.belongsTo(models.Location, {
            foreignKey: 'portId',
            as: 'port',
        });
        models.Job.belongsTo(models.Company, {
            foreignKey: 'billToId',
            as: 'billTo',
        });
        models.Job.belongsTo(models.User, {
            foreignKey: 'createdById',
            as: 'createdBy',
        });
        models.Job.belongsTo(models.Company, {
            foreignKey: 'clientId',
            as: 'client',
        });
        models.Job.hasOne(models.JobExportDetail, {
            foreignKey: 'jobId',
            as: 'jobExportDetail',
        });
        models.Job.hasOne(models.JobImportDetail, {
            foreignKey: 'jobId',
            as: 'jobImportDetail',
        });
        models.Job.hasMany(models.JobMessage, {
            foreignKey: 'jobId',
            as: 'jobMessage',
        });
        models.Job.hasMany(models.Container, {
            foreignKey: 'jobId',
            as: 'container',
        });
        models.Job.hasOne(models.Invoice, {
            foreignKey: 'jobId',
            as: 'invoice',
        });
    };

    // invoiceId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Invoice',
    //     index: true,
    // },

    // containers: [ContainerSchema],

    //         messages: [MessageSchema],

    //     alerts: [alert],
    //     logs: [log],
    return Job;
};

// JobSchema.plugin(AutoIncrement, { inc_field: 'name' });
// JobSchema.index({ 'deliveryAddress.location': '2dsphere' });
// JobSchema.index({ 'pickupAddress.location': '2dsphere' });
// JobSchema.index({ 'containers.trips.stops.location.location': '2dsphere' });
