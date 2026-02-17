const APP_ROOT          = require('app-root-path');
const WINSTON           = require('winston');
const MOMENT            = require('moment');
const APP_CONFIG        = require('../../config/app-config.js');
const CONSTANT_FILE_OBJ = require('../constants/constant.js');
require('winston-daily-rotate-file');



var errorFileSize = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE_MEGABYTE*APP_CONFIG.LOG_CONFIG.FILE_SIZE;

var fileName = APP_CONFIG.LOG_CONFIG.NOTIFICATION_ERROR_LOG_FILE_NAME;
fileName     = (fileName == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || fileName == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED ) ? CONSTANT_FILE_OBJ.APP_CONSTANT.NOTIFICATION_ERROR_LOG_FILE_NAME : fileName;
fileName     = APP_ROOT+"/log-files/"+fileName+"-%DATE%.log";

var logLevel = APP_CONFIG.LOG_CONFIG.logLevel;
logLevel     = (logLevel == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || logLevel == CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED ) ? CONSTANT_FILE_OBJ.APP_CONSTANT.DEFAULT_LOG_LEVEL : logLevel;
// Instantiate a new Winston Logger with the settings defined above
var Notificationlogger = WINSTON.createLogger({
    level             : 'info',
    datePattern       : 'YYYY-MM-DD',
    handleExceptions  : true,
    json              : true,
    zippedArchive     : true,
    maxSize           : CONSTANT_FILE_OBJ.APP_CONSTANT.ONE_MEGABYTE*APP_CONFIG.LOG_CONFIG.FILE_SIZE,
    colorize          : true,
    format            : WINSTON.format.combine(
      WINSTON.format.timestamp(),
      WINSTON.format.printf(info => {
          return `${MOMENT(info.timestamp).utc().utcOffset(MOMENT().format('Z')).format()} ${info.level}: ${info.message}`;
      })
    ),
    transports: [
      new WINSTON.transports.DailyRotateFile({ filename: fileName, maxSize: errorFileSize, level: logLevel })       
    ],
    exitOnError: false // do not exit on handled exceptions
});

module.exports = {
  Notificationlogger  : Notificationlogger
};