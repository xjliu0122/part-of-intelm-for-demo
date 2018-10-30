const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const logger = require(`${global.appRoot}/util/logger`);
const basename = path.basename(__filename);
const config = global.appConfig;

const db = {};

const sequelize = new Sequelize(
    'intelmodal',
    config.databaseUsername,
    config.databasePassword,
    {
        host: config.databaseHost,
        dialect: 'mysql',
        operatorsAliases: false,
        define: {
            charset: 'utf8',
            collate: 'utf8_general_ci',
            timestamps: true,
        },
        pool: {
            max: 10,
            min: 1,
            acquire: 30000,
            idle: 10000,
        },
        logging: true,
    },
);

// load the models
fs
    .readdirSync(__dirname)
    .filter(file => {
        return (
            file.indexOf('.') !== 0 &&
            file !== basename &&
            file.slice(-3) === '.js'
        );
    })
    .forEach(file => {
        const model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db)
    .forEach(modelName => {
        if (db[modelName].associate) {
            db[modelName].associate(db);
        }
    });
sequelize
    .query('SET FOREIGN_KEY_CHECKS = 0')
    .then(() => {
        return sequelize.sync({ force: false });
    })
    .then(() => {
        return sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    })
    .catch(error => {
        logger.error(error.stack);
        process.exit(1);
    });
// sequelize.sync({ force: true })
//     .catch(error => {
//         logger.error(error.stack);
//         process.exit(1);
//     });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// const obj = await model.findOne({ where: condition })
// if (obj) {
//   // only do update is value is different from queried object from db
//   for (var key in values) {
//     const val = values[key]
//     if (parseFloat(obj[key]) !== val) {
//       obj.isUpdatedRecord = true
//       return obj.update(values)
//     }
//   }
//   obj.isUpdatedRecord = false
//   return obj

// } else {
//   // insert
//   const merged = { ...values, ...condition }
//   return model.create(merged)
// }

Sequelize.Model.prototype.findCreateUpdate = function (
    findWhereMap,
    newValuesMap,
) {
    return this.findOne({
        where: findWhereMap,
    })
        .then(obj => {
            if (obj) {
            // update
                return obj.update(newValuesMap);
            }
            // create
            return this.create({ ...findWhereMap, ...newValuesMap });
        });
};
module.exports = db;
