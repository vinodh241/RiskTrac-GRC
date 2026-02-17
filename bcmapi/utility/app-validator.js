const CONSTANT_FILE_OBJ = require('./constants/constant.js');

module.exports = class AppValidator {
    constructor() {
    }

/**
 * This function check string is undefined or not.
 * return true if string is null else false.
 * @param {*} dataString 
 */
    isStringUndefined(dataString){
        if(dataString === CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED){
            return CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE;
        } else {
            return CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;
        }
    }

    /**
     * This function check string is null or not.
     * return true if string is null else false.
     * @param {*} dataString 
     */
    isStringNull(dataString){
        if(dataString === null){
            return CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE;
        } else {
            return CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;
        }
    }

    /**
     * This function will check for empty string.
     * return true if sting is empty else false.
     * @param {*} dataString 
     */
    isStringEmpty(dataString){
        if(dataString === "" || dataString === ''){
            return CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE;
        } else {
            return CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;
        }
    }
    
    /**
     * This function check data is positive integer and greater then zero or not.
     * return true if data is positive integer else false.
     *  @param {String} dataString 
     */
    isPositiveInteger(dataString){
        var data = Number(dataString);
        if(Number.isInteger(data) && data > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ){
            return CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE;
        } else {
            return CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;
        }
    }

    /**
     * This function will check for bit value of data.
     * @param {*} dataString 
     */
    isStringBit(dataString){
        if(dataString === "true" || dataString === "false"){
            return CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE;
        } else {
            return CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;
        }
    }
}