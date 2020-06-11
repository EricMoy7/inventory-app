/**
 * This is the entrypoint to the application programmer interface.
 */

/**
 * Catch and log uncaught exceptions as soon as they happen, log them, then exit with error code 1.
 * Do this before loading anything else.
 */
process.on('uncaughtException', (exception) => {
    console.error(`An uncaughtException happened:\n${exception}`);
    process.exit(1);
});

const express = require('express');
const os = require('os');
const mysql = require("mysql");
const config = require('./config/config.js');
const logger = require('./utils/logger.js')();

const databaseConfig = config.database;
const connection = mysql.createConnection(databaseConfig);

connection.connect(function(err) {
    if (err) {
      console.error('Database connection failed: ' + err.stack);
      return;
    }
  
    console.log('Connected to database.');
});

/**
 * Instanitate an ExpressJS webserver.
 * Later on, this should probably be turned into a "core" module that we import into here and inject into the "components".
 */
const app = express();

// Set the port we are listening to
const listen = (expressApp, port) => {
    return new Promise((resolve, reject) => {
        expressApp.listen(port, () => {
            console.log(`api-server: listening on ${os.hostname()}:${port}`)
            resolve();
        });
    });
}

// Set the headers
const cors = (expressApp, origin, headers) => {
    return new Promise((resolve, reject) => {
        expressApp.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', origin);
            res.header('Access-Control-Allow-Headers', headers);
            next();
        });
        resolve();
    });
}

/**
 * Send error code to client side
 */
const clientErrorHandler = (err, req, res, next) => {
    if (req.xhr) {
        res.status(500).send({ error: 'Something failed!' });
    } else {
        next(err);
    }
}

/**
 * The “catch-all” errorHandler function
 */
const errorHandler = (err, req, res, next) => {
    res.sendStatus(500);
}

/**
 * Use logger to log error
 */
const logErrors = (err, req, res, next) => {
    logger.error(err);
    next(err);
}

/**
 * Catches urls that do not match and return 404
 */
const notFoundErrors = (err, req, res, next) => {
    res.status(404).send({ error: 'URL Not Found' });
    next();
}

/**
 * Initialize the express application
 */
Promise.all([
    listen(app, config.port),
    cors(app, config.cors_allow_origin, config.cors_allow_headers)
])
.then(([]) => {
    /**
     * Init providers
     */
    const amazonWmsInstance = require('./providers/amazonWms')(config.amazonWms);
    
    /**
     * Import the components. Each component is an instance of an ExpressJS router.
     * Here the application (general utility) component is loaded.
     */
    const productComponent = require('./components/product')(config, connection);
    const wmsComponent = require('./components/amazonWms')(amazonWmsInstance);

    /**
     * Bind the components to the express application
     */
    app.use('/product', productComponent);
    app.use('/wms', wmsComponent);

    app.use('*', notFoundErrors);
    app.use(logErrors);
    app.use(clientErrorHandler);
    app.use(errorHandler);

})
.catch((reason) => {
    console.error(reason);
});
