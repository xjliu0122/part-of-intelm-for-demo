// add logger information
const winston = require('winston');
const fs = require('fs');

const env = process.env.NODE_ENV || 'development';
const config = global.appConfig;

const level = config.logLevel || 'debug';
const logDir = 'logs';

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const tsFormat = () => new Date()
    .toLocaleTimeString();
const logger = new winston.Logger({
    transports: [
        // colorize the output to the console
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true,
            humanReadableUnhandledException: true,
        }),
        new winston.transports.File({
            level: env === 'development' ? 'info' : 'info',
            filename: `${logDir}/system.log`,
            handleExceptions: true,
            timestamp: tsFormat,
            json: false,
            //prettyPrint: true,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: false,
        }),
    ],
});
logger.level = level;
logger.morganStream = {
    write(message) {
        if (env === 'development') console.log(message); // this is only for VSCode debugger....
        logger.verbose(message);
    },
};
module.exports = logger;
