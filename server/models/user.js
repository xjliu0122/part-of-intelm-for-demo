module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
        uid: {
            type: DataTypes.STRING,
            required: true,
        },
        name: {
            type: DataTypes.STRING,
            required: true,
        },
        email: {
            type: DataTypes.STRING,
            lowercase: true,
            required: true,
            validate: {
                isEmail: {
                    msg: 'Email format is not valid.',
                },
            },
            unique: true,
        },
        role: {
            type: DataTypes.ENUM,
            values: ['user', 'bco', 'tc', 'dispatcher'],
            required: true,
            defaultValue: 'user',
        },
        phone: DataTypes.STRING,
        isAdmin: { type: DataTypes.BOOLEAN, defaultValue: true },
        position: DataTypes.STRING,
        miscFields: {
            type: DataTypes.JSON,
            defaultValue: {},
        },
        mobilePushToken: DataTypes.STRING,
        active: { type: DataTypes.BOOLEAN, defaultValue: true },
        // dispatchingPrivileges: {
        //     accounting: { type: DataTypes.BOOLEAN, defaultValue: true },
        //     booking: { type: DataTypes.BOOLEAN, defaultValue: true },
        //     carrierUpdating: { type: DataTypes.BOOLEAN, defaultValue: true },
        // },

        // emailConfirmed: { type: Boolean, defaultValue: false },
        // authorized: { type: Boolean, defaultValue: false },
        // requestedCompany: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     defaultValue: null,
        // },
    });
    User.associate = function (models) {
        models.User.belongsTo(models.Company, {
            foreignKey: 'companyId',
        });
    };

    return User;
};
