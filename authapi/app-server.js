const { ensureAuthCerts } = require("./utility/ensure-auth-certs.js");
const { apiDocumentation } = require("./api-docs/api-doc.js");
const EXPRESS = require("express");
const APP = EXPRESS();
const BODY_PARSER = require("body-parser");
const CORS = require("cors");
const COOKIE_PARSER = require("cookie-parser");
const HELMET = require("helmet");
const NO_CACHE = require("nocache");
const APP_CONFIG_FILE_OBJECT = require("./config/app-config.js");
const SYSTEM_CONFIG = require("./config/system-config.json");
const LOG_MANAGER_FILE_OBJECT = require("./utility/log-manager/log-manager.js");
const CONSTANT_FILE_OBJECT = require("./utility/constants/constant.js");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const ALLOWED_ORIGINS = APP_CONFIG_FILE_OBJECT.APP_SERVER.ALLOWED_ORIGINS;

/*
 * Swagger UI configuration
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
APP.disable("x-powered-by");

APP.use(BODY_PARSER.urlencoded({ limit: "512mb", extended: true }));
APP.use(BODY_PARSER.json({ limit: "512mb", extended: true }));

/**
 * App will use cors
 */
APP.use(
  CORS({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (ALLOWED_ORIGINS.indexOf(origin) !== -1) return callback(null, true);
      if (origin.startsWith("http://10.0.1.") || origin.startsWith("http://127.0.0.1:")) return callback(null, true);
      return callback(null, true);
    },
    credentials: CONSTANT_FILE_OBJECT.APP_CONSTANT.TRUE,
    exposedHeaders: [
      "token",
      "status",
      "OriginalFileName",
      "FileType",
      "FileName",
      "ErrorMessage",
    ],
    methods: ["GET", "POST", "HEAD"],
  })
);

/**
 * App will use cookie parser
 */
APP.use(COOKIE_PARSER());

/**
 * Global error handler: never send 500 to client; return 200 with success:0
 */
APP.use(function (err, req, res, next) {
  try { if (global.logger && global.logger.log) global.logger.log("error", "Unhandled error: " + (err && (err.message || err.toString()) || err)); } catch (_) {}
  if (res.headersSent) return next(err);
  res.status(200).json({ success: 0, message: null, result: null, error: { errorCode: null, errorMessage: "Service temporarily unavailable" } });
});

/**
 * Node server is running on port no. "appPortNo"
 * PORT can be overridden via process.env.PORT (e.g. in Docker)
 */
var appPortNo = process.env.PORT || APP_CONFIG_FILE_OBJECT.APP_SERVER.APP_START_PORT;
appPortNo =
  appPortNo == CONSTANT_FILE_OBJECT.APP_CONSTANT.NULL ||
  appPortNo == CONSTANT_FILE_OBJECT.APP_CONSTANT.UNDEFINED
    ? CONSTANT_FILE_OBJECT.APP_CONSTANT.DEFAULT_PORT
    : parseInt(appPortNo, 10);

/**
 *
 */
APP.listen(appPortNo, async function () {
  /**
   * Fetching looger object and setting in global variable :: Start
   */
  try {
    global.logger = await LOG_MANAGER_FILE_OBJECT.logger;
    logger.log("info", "Logger initialized......");
    // console.log("Logger initialized......");
  } catch (error) {
    // console.log('appIndex.js : Logger is not set into global object. Error details : '+error.stack);
    logger.log(
      "error",
      "appIndex.js : Logger is not set into global object. Error details : " +
        error
    );
    process.exit(CONSTANT_FILE_OBJECT.APP_CONSTANT.ZERO);
  }
  /**
   * Fetching looger object and setting in global variable :: End
   */
  ensureAuthCerts();
  // console.log('App is listening on port : '+appPortNo);
  logger.log("info", "App is listening on port : " + appPortNo);

  console.log("App is listening on port : " + appPortNo);

  APP.set("moduleConfig", SYSTEM_CONFIG);
  initializeModules();

  /**
   * Connecting to database by connection pooling logic :: Start
   * Non-fatal: if DB fails, app stays up so container does not restart loop; login will fail with clear error.
   */
  try {
    var {
      poolConnectionObject,
    } = require("./utility/db-connection/db-connection.js");
    global.poolConnectionObject = await poolConnectionObject;
    logger.log("info", "Database Connected......");
  } catch (error) {
    console.error("Auth API: DB connection failed (app staying up):", error && (error.message || error));
    logger.log(
      "error",
      "appIndex.js : Data Base not connected : " + (error && (error.message || error))
    );
    global.poolConnectionObject = null;
  }
});

/**
 * Initializing module request handler (router) class
 */
function initializeModules() {
  try {
    let moduleConfigObj = APP.get("moduleConfig");
    logger.log("info", "Application modules loading.......");
    for (let key in moduleConfigObj["APP_MODULES"]) {
      let appModules = require(moduleConfigObj["APP_MODULES"][key]);
      let modulesInstance = appModules.getInstance(APP);
      modulesInstance.start();
      logger.log("info", key + " loaded.");
      // console.log(key+' loaded.');
    }
  } catch (error) {
    // console.log('appIndex.js : Error from appIndex.js : Modules not intialized : Error details : '+error.stack);
    logger.log(
      "error",
      "appIndex.js : Error from appIndex.js : Modules not intialized : Error details : " +
        error
    );
    process.exit(CONSTANT_FILE_OBJECT.APP_CONSTANT.ZERO);
  }
}
