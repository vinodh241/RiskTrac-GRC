const HTTP                          = require('http');
const EXPRESS                       = require('express');
const APP                           = EXPRESS();
const BODY_PARSER                   = require('body-parser');
const CORS                          = require('cors');
const COOKIE_PARSER                 = require('cookie-parser');
const FILE_UPLOAD                   = require('express-fileupload');
const HELMET 						= require('helmet');
const NO_CACHE 						= require('nocache');
const PATH                          = require('path');
const FS                            = require('fs');
const AXIOS                         = require('axios');
const APP_CONFIG_FILE_OBJECT        = require('./config/app-config.js');
const SYSTEM_CONFIG                 = require('./config/system-config.json');
const LOG_MANAGER_FILE_OBJECT       = require('./utility/log-manager/log-manager.js');
const CONSTANT_FILE_OBJECT          = require('./utility/constants/constant.js');
const ALLOWED_ORIGINS               = APP_CONFIG_FILE_OBJECT.APP_SERVER.ALLOWED_ORIGINS;
const LOG_NOTIFICATION_FILE_OBJ     = require('./utility/log-manager/log-notification-manager.js');
const NOTIFICATION_UTIL             = require('./utility/sql-service/message-queue-util.js');
const swaggerUi                     = require("swagger-ui-express");
const { apiDocumentation }          = require('./api-docs/api-doc.js')

/**
 * IMMEDIATE get-key response - runs before any other middleware. Never 500.
 */
function getKeyFallbackResultSync() {
    try {
        var cfg = APP_CONFIG_FILE_OBJECT || {};
        var appPath = (cfg.APP_SERVER && cfg.APP_SERVER.PATH) ? cfg.APP_SERVER.PATH : process.cwd();
        var certPath = PATH.join(appPath, 'config/certs/public.pem');
        var publicKeyUM = (FS.existsSync(certPath)) ? FS.readFileSync(certPath, 'utf8') : '';
        var r = {
            OTPLength: 6, ResentOTPTime: 60, ResentOTPTimeForChangePassword: 60,
            DateFormat: 'YYYY-MM-DD', authenticationMode: 3, IS_OTP_FOR_CHANGE_PASSWORD: false,
            CHANGE_PASSWORD_CONFIG: null, USER_NAME_CONFIG: null, USER_ID_CONFIG: null,
            MFA_CONFIG_IS_MFA: false, LOGIN_PAGE_DATA: null, publicKeyUM: publicKeyUM
        };
        return JSON.stringify({ success: 1, message: 'OK', result: r, error: { errorCode: null, errorMessage: null } });
    } catch (e) {
        return JSON.stringify({ success: 0, message: null, result: null, error: { errorCode: null, errorMessage: 'Service temporarily unavailable' } });
    }
}
APP.use(function getKeyFirst(req, res, next) {
    var p = (req.url && req.url.split('?')[0]) || (req.path || '');
    if (p.endsWith('/')) p = p.slice(0, -1);
    if ((req.method === 'POST' || req.method === 'GET') && (p === '/user-management/auth/get-key')) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(getKeyFallbackResultSync());
        return;
    }
    next();
});

/**
 * Swagger UI Configuration
 */

APP.use("/api-docs", swaggerUi.serve, swaggerUi.setup(apiDocumentation)); 

/**
 * This will abolish all client-side caching
 */
APP.use(NO_CACHE());

/**
 * Allowing X-Frames from same origin only
 */
APP.use(HELMET.frameguard({ action: CONSTANT_FILE_OBJECT.APP_CONSTANT.DENY }));

/**
 * Disabling X-Powered-By header to hide app running Express
 */
APP.disable('x-powered-by');
 

APP.use(BODY_PARSER.urlencoded({limit: '512mb', extended: true}));
APP.use(BODY_PARSER.json({limit: '512mb', extended: true}));

/**
 * App will use cors
 */
// APP.use(CORS({origin : CONSTANT_FILE_OBJECT.APP_CONSTANT.TRUE, exposedHeaders : ['token','status', 'OriginalFileName', 'FileName']}));
APP.use(CORS({
    origin          : function(origin, callback) {
                        if (!origin) return callback(null, true);
                        if (ALLOWED_ORIGINS.indexOf(origin) !== -1) return callback(null, true);
                        if (origin.startsWith('http://10.0.1.') || origin.startsWith('http://127.0.0.1:')) return callback(null, true);
                        return callback(null, true);
                    },
    credentials     : CONSTANT_FILE_OBJECT.APP_CONSTANT.TRUE,
    exposedHeaders : ['token','status', 'OriginalFileName', 'FileType','ErrorMessage'],
    methods         : ['GET','POST','HEAD']
}));

/**
 * App will use cookie parser
 */
APP.use(COOKIE_PARSER());

/**
 * Global error handler: never send 500 to client; return 200 with success:0
 */
APP.use(function(err, req, res, next) {
    try { if (global.logger && global.logger.log) global.logger.log('error', 'Unhandled error: ' + (err && (err.message || err.toString()) || err)); } catch (_) {}
    if (res.headersSent) return next(err);
    res.status(200).json({ success: 0, message: null, result: null, error: { errorCode: null, errorMessage: 'Service temporarily unavailable' } });
});

/**
 * Build minimal success result from local config + public key (used when authapi is down).
 */
function getKeyFallbackResult() {
    try {
        var cfg = APP_CONFIG_FILE_OBJECT || {};
        var appPath = (cfg.APP_SERVER && cfg.APP_SERVER.PATH) ? cfg.APP_SERVER.PATH : process.cwd();
        var certPath = PATH.join(appPath, 'config/certs/public.pem');
        var publicKeyUM = (FS.existsSync(certPath)) ? FS.readFileSync(certPath, 'utf8') : '';
        var r = {
            OTPLength: (cfg.OTP_CONFIG && cfg.OTP_CONFIG.NUMBER_OF_DIGITS_IN_OTP) !== undefined ? cfg.OTP_CONFIG.NUMBER_OF_DIGITS_IN_OTP : 6,
            ResentOTPTime: (cfg.OTP_CONFIG && cfg.OTP_CONFIG.RESEND_OTP_TIME_IN_SECONDS) !== undefined ? cfg.OTP_CONFIG.RESEND_OTP_TIME_IN_SECONDS : 60,
            ResentOTPTimeForChangePassword: (cfg.OTP_CONFIG_FOR_CHANGE_PASSWORD && cfg.OTP_CONFIG_FOR_CHANGE_PASSWORD.RESEND_OTP_TIME_IN_SECONDS) !== undefined ? cfg.OTP_CONFIG_FOR_CHANGE_PASSWORD.RESEND_OTP_TIME_IN_SECONDS : 60,
            DateFormat: (cfg.DATE_FORMAT_CONFIG && cfg.DATE_FORMAT_CONFIG.DATE_FORMAT) || 'YYYY-MM-DD',
            authenticationMode: (cfg.APP_SERVER && cfg.APP_SERVER.APP_AUTHENTICATION_MODE) !== undefined ? cfg.APP_SERVER.APP_AUTHENTICATION_MODE : 3,
            IS_OTP_FOR_CHANGE_PASSWORD: (cfg.PASSWORD_CONFIG && cfg.PASSWORD_CONFIG.REQUIRED_OTP_FOR_CHANGE_PASSWORD) === true,
            CHANGE_PASSWORD_CONFIG: (cfg && cfg.CHANGE_PASSWORD_CONFIG) || null,
            USER_NAME_CONFIG: (cfg && cfg.USER_NAME_CONFIG) || null,
            USER_ID_CONFIG: (cfg && cfg.USER_ID_CONFIG) || null,
            MFA_CONFIG_IS_MFA: (cfg.MFA_CONFIG && cfg.MFA_CONFIG.IS_MFA) === true,
            LOGIN_PAGE_DATA: (cfg && cfg.LOGIN_PAGE_DATA) || null,
            publicKeyUM: publicKeyUM
        };
        return { success: 1, message: 'OK', result: r, error: { errorCode: null, errorMessage: null } };
    } catch (e) {
        return { success: 0, message: null, result: null, error: { errorCode: null, errorMessage: 'Service temporarily unavailable' } };
    }
}

/**
 * Early get-key route: always 200, never 500. If authapi fails, returns local key so app can load.
 */
function getKeyHandler(req, res) {
    function send200(obj) {
        try { if (!res.headersSent) res.status(200).json(obj); } catch (_) {}
    }
    try {
        var baseUrl = (APP_CONFIG_FILE_OBJECT && APP_CONFIG_FILE_OBJECT.AUTH_SERVICE_URL) ? APP_CONFIG_FILE_OBJECT.AUTH_SERVICE_URL : 'http://localhost:9001';
        var body = (req && req.body) || {};
        AXIOS.post(baseUrl + '/auth-management/auth/get-Key', { reqPayload: body }, { headers: { 'Content-Type': 'application/json' }, timeout: 5000 })
            .then(function(response) {
                try {
                    var data = response && response.data;
                    if (data && data.success === 1 && data.result) {
                        var cfg = APP_CONFIG_FILE_OBJECT || {};
                        var r = data.result;
                        r.OTPLength = (cfg.OTP_CONFIG && cfg.OTP_CONFIG.NUMBER_OF_DIGITS_IN_OTP) !== undefined ? cfg.OTP_CONFIG.NUMBER_OF_DIGITS_IN_OTP : 6;
                        r.ResentOTPTime = (cfg.OTP_CONFIG && cfg.OTP_CONFIG.RESEND_OTP_TIME_IN_SECONDS) !== undefined ? cfg.OTP_CONFIG.RESEND_OTP_TIME_IN_SECONDS : 60;
                        r.ResentOTPTimeForChangePassword = (cfg.OTP_CONFIG_FOR_CHANGE_PASSWORD && cfg.OTP_CONFIG_FOR_CHANGE_PASSWORD.RESEND_OTP_TIME_IN_SECONDS) !== undefined ? cfg.OTP_CONFIG_FOR_CHANGE_PASSWORD.RESEND_OTP_TIME_IN_SECONDS : 60;
                        r.DateFormat = (cfg.DATE_FORMAT_CONFIG && cfg.DATE_FORMAT_CONFIG.DATE_FORMAT) || 'YYYY-MM-DD';
                        r.authenticationMode = (cfg.APP_SERVER && cfg.APP_SERVER.APP_AUTHENTICATION_MODE) !== undefined ? cfg.APP_SERVER.APP_AUTHENTICATION_MODE : 3;
                        r.IS_OTP_FOR_CHANGE_PASSWORD = (cfg.PASSWORD_CONFIG && cfg.PASSWORD_CONFIG.REQUIRED_OTP_FOR_CHANGE_PASSWORD) === true;
                        r.CHANGE_PASSWORD_CONFIG = (cfg && cfg.CHANGE_PASSWORD_CONFIG) || null;
                        r.USER_NAME_CONFIG = (cfg && cfg.USER_NAME_CONFIG) || null;
                        r.USER_ID_CONFIG = (cfg && cfg.USER_ID_CONFIG) || null;
                        r.MFA_CONFIG_IS_MFA = (cfg.MFA_CONFIG && cfg.MFA_CONFIG.IS_MFA) === true;
                        r.LOGIN_PAGE_DATA = (cfg && cfg.LOGIN_PAGE_DATA) || null;
                        var appPath = (cfg.APP_SERVER && cfg.APP_SERVER.PATH) ? cfg.APP_SERVER.PATH : process.cwd();
                        var certPath = PATH.join(appPath, 'config/certs/public.pem');
                        if (FS.existsSync(certPath)) r.publicKeyUM = FS.readFileSync(certPath, 'utf8');
                        send200({ success: 1, message: data.message || 'OK', result: r, error: { errorCode: null, errorMessage: null } });
                    } else {
                        send200(data || { success: 0, message: null, result: null, error: { errorCode: null, errorMessage: 'Get key failed' } });
                    }
                } catch (e) {
                    send200(getKeyFallbackResult());
                }
            })
            .catch(function() {
                send200(getKeyFallbackResult());
            });
    } catch (e) {
        send200(getKeyFallbackResult());
    }
}
APP.post('/user-management/auth/get-key', getKeyHandler);
APP.get('/user-management/auth/get-key', getKeyHandler);

/**
 * Node server is running on port no. "appPortNo"
 * PORT can be overridden via process.env.PORT (e.g. in Docker)
 */
var appPortNo   = process.env.PORT || APP_CONFIG_FILE_OBJECT.APP_SERVER.APP_START_PORT;
appPortNo       = (appPortNo == CONSTANT_FILE_OBJECT.APP_CONSTANT.NULL || appPortNo == CONSTANT_FILE_OBJECT.APP_CONSTANT.UNDEFINED ) ? CONSTANT_FILE_OBJECT.APP_CONSTANT.DEFAULT_PORT : parseInt(appPortNo, 10);

/**
 * get-key handled in raw Node layer BEFORE Express - impossible to 500.
 */
function getKeyResponseBody() {
    try {
        var cfg = APP_CONFIG_FILE_OBJECT || {};
        var appPath = (cfg.APP_SERVER && cfg.APP_SERVER.PATH) ? cfg.APP_SERVER.PATH : process.cwd();
        var certPath = PATH.join(appPath, 'config/certs/public.pem');
        var publicKeyUM = (FS.existsSync(certPath)) ? FS.readFileSync(certPath, 'utf8') : '';
        var r = { OTPLength: 6, ResentOTPTime: 60, ResentOTPTimeForChangePassword: 60, DateFormat: 'YYYY-MM-DD', authenticationMode: 3, IS_OTP_FOR_CHANGE_PASSWORD: false, CHANGE_PASSWORD_CONFIG: null, USER_NAME_CONFIG: null, USER_ID_CONFIG: null, MFA_CONFIG_IS_MFA: false, LOGIN_PAGE_DATA: null, publicKeyUM: publicKeyUM };
        return JSON.stringify({ success: 1, message: 'OK', result: r, error: { errorCode: null, errorMessage: null } });
    } catch (e) {
        return JSON.stringify({ success: 0, message: null, result: null, error: { errorCode: null, errorMessage: 'Service temporarily unavailable' } });
    }
}
var SERVER = HTTP.createServer(function (req, res) {
    var p = (req.url && req.url.split('?')[0]) || '';
    if (p.endsWith('/')) p = p.slice(0, -1);
    if ((req.method === 'POST' || req.method === 'GET') && p === '/user-management/auth/get-key') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(getKeyResponseBody());
        return;
    }
    APP(req, res);
});
// Minimal console logger so startup can log without exiting when real logger/DB fail
var consoleLogger = { log: function(level, msg) { try { console.log('[' + level + '] ' + (msg || '')); } catch (_) {} } };
SERVER.listen(appPortNo, async function() {
    console.log('App is listening on port : ' + appPortNo + ' (get-key is available immediately)');
    global.logger = consoleLogger;
    /**
     * Fetching logger object and setting in global variable :: Start
     */
    try {
        global.logger = await LOG_MANAGER_FILE_OBJECT.logger;
        logger.log('info', 'Logger initialized......');
    } catch (error) {
        console.error('Logger init failed (continuing with console fallback):', error && (error.message || error));
        global.logger = consoleLogger;
    }

    try {
        global.notificationlogger = await LOG_NOTIFICATION_FILE_OBJ.Notificationlogger;
        (global.logger || consoleLogger).log('info', 'Notification Logger initialized......');
    } catch (error) {
        console.error('Notification logger init failed (continuing):', error && (error.message || error));
        global.notificationlogger = consoleLogger;
    }

    logger.log('info', 'App is listening on port : ' + appPortNo);
    APP.set("moduleConfig", SYSTEM_CONFIG);
    try {
        initializeModules();
    } catch (error) {
        console.error('Module init failed (get-key and auth endpoints still work):', error && (error.message || error));
        logger.log('error', 'Modules not initialized: ' + (error && (error.message || error)));
    }

    /**
     * Connecting to database by connection pooling logic :: Start
     * Non-fatal: if DB fails, app stays up and get-key/login config still works; other routes may return 503.
     */
    try {
        var { poolConnectionObject } = require('./utility/db-connection/db-connection.js');
        global.poolConnectionObject = await poolConnectionObject;
        logger.log('info', 'Database Connected......');
    } catch (error) {
        console.error('Main DB connection failed (app staying up for get-key):', error && (error.message || error));
        if (error && error.message === 'Database password is null') {
            console.error('Fix: In project root create .env with DB_PASSWORD=YourSqlPassword then run: docker compose up -d --force-recreate umapi');
        }
        logger.log('error', 'Data Base not connected. Error: ' + (error && (error.message || error)));
        global.poolConnectionObject = null;
    }

    try {
        var { poolConnectionObjectNotification } = require('./utility/db-connection/db-connection-notification.js');
        global.poolConnectionObjectNotification = await poolConnectionObjectNotification;
        (global.notificationlogger || consoleLogger).log('info', 'Calling message util');
        new NOTIFICATION_UTIL();
    } catch (error) {
        console.error('Notification DB / message util failed (continuing):', error && (error.message || error));
        if (error && error.message === 'Notification database password is null') {
            console.error('Fix: Set DB_PASSWORD (or NOTIFICATION_DB_PASSWORD) in .env, then: docker compose up -d --force-recreate umapi');
        }
        (global.notificationlogger || consoleLogger).log('error', 'Notification DB failed: ' + (error && (error.message || error)));
        global.poolConnectionObjectNotification = null;
    }
});

/**
 * Initializing module request handler (router) class
 */
function initializeModules() {
    try {
        let moduleConfigObj = APP.get('moduleConfig');
        logger.log('info', 'Application modules loading.......');
        for(let key in moduleConfigObj['APP_MODULES']) {            
            let appModules      = require(moduleConfigObj['APP_MODULES'][key]);
            let modulesInstance = appModules.getInstance(APP);
            modulesInstance.start();
            logger.log('info', key+' loaded.');
            // console.log(key+' loaded.');
        }
    } catch (error) {
        // console.log('appIndex.js : Error from appIndex.js : Modules not intialized : Error details : '+error.stack);
        logger.log('error', 'appIndex.js : Error from appIndex.js : Modules not intialized : Error details : '+error);
        process.exit(CONSTANT_FILE_OBJECT.APP_CONSTANT.ZERO);
    }
}