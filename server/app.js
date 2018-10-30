// IntelModal Backend Server

// Global Variables
global.appRoot = __dirname; // appRoot is global to every sub modules
const env = process.env.NODE_ENV || 'development';
const config = require('./config')[env];

global.appConfig = config;

const express = require('express');
const compression = require('compression');
const morgan = require('morgan');
const logger = require('./util/logger');
const morganBody = require('morgan-body');
const cors = require('cors');
const bodyParser = require('body-parser');
const resolve = require('path').resolve;

const morganLevel = 'combined'; // should change to production.
const port = process.env.NODE_PORT || config.port || '80';
const isDevOrQA = env !== 'production';
const outputPath = `${global.appRoot}/../dist`; // ????

const app = express();

// production tend to use nignx so we do not need to run compression middleware.
if (isDevOrQA) app.use(compression());

// common middlewares
// CORS handling -- including pre-flight requests
app.use(cors());

// bodyparser middleware
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: false }));

// morgan - production for error only requests, others to inlcude successful ones for debug
app.use(morgan(morganLevel, {
    skip(req, res) {
        return res.statusCode < 400;
    },
    stream: logger.morganStream, //process.stderr,
}));
if (isDevOrQA) {
    app.use(morgan(morganLevel, {
        skip(req, res) {
            return res.statusCode >= 400;
        },
        stream: logger.morganStream,
    }));
    morganBody(app, { stream: logger.morganStream });
}

// protectors

// static middleware for hosting react part
app.use('/', express.static(outputPath));

// API routes
app.use('/api', require('./routes'));

// get the intended host and port number, use localhost and port 3000 if not provided
const host = '0.0.0.0' || config.host;
app.get('*', (req, res) => res.sendFile(resolve(outputPath, 'index.html')));
// Start your app.
app.listen(port, host, err => {
    if (err) {
        return logger.error(err.message);
    }

    logger.warn(`Server started at: ${host}:${port}`);
});

// api exception handling.
// eslint-disable-next-line
app.use((err, req, res, next) => {
    if (err.name === 'ApiException') {
        logger.error(err.message);
        res.status(err.status)
            .json({
                ErrorMessage: err.message,
            });
    } else {
        // non predefined errors
        logger.error(err.stack);
        res.status(500)
            .json(err.message);
    }
});
// uncaught error
process.on('uncaughtException', err => {
    logger.error(err.stack);
});
