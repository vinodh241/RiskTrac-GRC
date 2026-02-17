const CONSTANT_FILE_OBJ = require('./constants/constant.js');

/**
 * Error code constants for Excel upload failures
 */
const ERROR_CODES = {
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    PARSING_ERROR: 'PARSING_ERROR',
    BUSINESS_RULE_ERROR: 'BUSINESS_RULE_ERROR',
    DB_ERROR: 'DB_ERROR',
    UNKNOWN_ERROR: 'UNKNOWN_ERROR'
};

/**
 * Creates a standardized unsuccessful response with detailed error information
 * @param {string} refreshedToken - Refreshed authentication token
 * @param {string} errorMessage - User-friendly error message
 * @param {string} errorCode - Error code (VALIDATION_ERROR, PARSING_ERROR, etc.)
 * @param {object} details - Additional error details (rowNumber, field, reason, etc.)
 * @returns {object} Standardized error response object
 */
function unsuccessfulResponse(refreshedToken, errorMessage, errorCode = null, details = null) {
    return {
        success: CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
        message: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
        result: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
        token: refreshedToken,
        error: {
            errorCode: errorCode || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMessage: errorMessage || 'An error occurred',
            details: details || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        }
    };
}

/**
 * Creates a standardized successful response
 * @param {string} refreshedToken - Refreshed authentication token
 * @param {string} successMessage - Success message
 * @param {object} result - Result data object
 * @returns {object} Standardized success response object
 */
function successfulResponse(refreshedToken, successMessage, result) {
    // Handle special case for recordset formatting (backward compatibility)
    if (successMessage && typeof successMessage === 'string' && successMessage.split("|").length > 1) {
        if (result && result.recordset) {
            result.recordset = result.recordset[0];
        }
        successMessage = successMessage.split("|")[0];
    }
    
    return {
        success: CONSTANT_FILE_OBJ.APP_CONSTANT.ONE,
        message: successMessage || 'Operation completed successfully',
        result: result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
        token: refreshedToken,
        error: {
            errorCode: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMessage: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        }
    };
}

/**
 * Creates a successful response when some records failed (partial success).
 * Populates the error object with failure details so the network response includes failure reasons.
 * @param {string} refreshedToken - Refreshed authentication token
 * @param {string} successMessage - Success message (e.g. "Number of Records successfully added : X, Number of records failed to add : Y")
 * @param {object} result - Result data object (must include validData and inValidData)
 * @param {Array} invalidData - Array of failed records with failure reasons (e.g. [{ "Failure reason": "..." }])
 * @returns {object} Success response with error object populated for partial failures
 */
function successfulResponseWithPartialFailures(refreshedToken, successMessage, result, invalidData) {
    const payload = successfulResponse(refreshedToken, successMessage, result);
    if (invalidData && invalidData.length > 0) {
        payload.error = {
            errorCode: ERROR_CODES.VALIDATION_ERROR,
            errorMessage: successMessage,
            details: invalidData
        };
    }
    return payload;
}

/**
 * Creates an error response for validation failures
 * @param {string} refreshedToken - Refreshed authentication token
 * @param {string} message - Error message
 * @param {number} rowNumber - Row number where validation failed (optional)
 * @param {string} field - Field name that failed validation (optional)
 * @param {string} reason - Specific reason for failure (optional)
 * @returns {object} Validation error response
 */
function validationErrorResponse(refreshedToken, message, rowNumber = null, field = null, reason = null) {
    const details = {};
    if (rowNumber !== null) details.rowNumber = rowNumber;
    if (field !== null) details.field = field;
    if (reason !== null) details.reason = reason;
    
    return unsuccessfulResponse(
        refreshedToken,
        message,
        ERROR_CODES.VALIDATION_ERROR,
        Object.keys(details).length > 0 ? details : null
    );
}

/**
 * Creates an error response for parsing failures
 * @param {string} refreshedToken - Refreshed authentication token
 * @param {string} message - Error message
 * @param {string} reason - Specific parsing error reason (optional)
 * @returns {object} Parsing error response
 */
function parsingErrorResponse(refreshedToken, message, reason = null) {
    return unsuccessfulResponse(
        refreshedToken,
        message,
        ERROR_CODES.PARSING_ERROR,
        reason ? { reason } : null
    );
}

/**
 * Creates an error response for business rule violations
 * @param {string} refreshedToken - Refreshed authentication token
 * @param {string} message - Error message
 * @param {number} rowNumber - Row number where rule violation occurred (optional)
 * @param {string} field - Field name involved in rule violation (optional)
 * @param {string} reason - Specific reason for violation (optional)
 * @returns {object} Business rule error response
 */
function businessRuleErrorResponse(refreshedToken, message, rowNumber = null, field = null, reason = null) {
    const details = {};
    if (rowNumber !== null) details.rowNumber = rowNumber;
    if (field !== null) details.field = field;
    if (reason !== null) details.reason = reason;
    
    return unsuccessfulResponse(
        refreshedToken,
        message,
        ERROR_CODES.BUSINESS_RULE_ERROR,
        Object.keys(details).length > 0 ? details : null
    );
}

/**
 * Creates an error response for database errors
 * @param {string} refreshedToken - Refreshed authentication token
 * @param {string} message - User-friendly error message
 * @param {string} technicalMessage - Technical error message for logging (optional)
 * @returns {object} Database error response
 */
function databaseErrorResponse(refreshedToken, message, technicalMessage = null) {
    return unsuccessfulResponse(
        refreshedToken,
        message,
        ERROR_CODES.DB_ERROR,
        technicalMessage ? { technicalMessage } : null
    );
}

/**
 * Translates database error messages to user-friendly messages
 * @param {string} dbErrorMessage - Database error message
 * @returns {string} User-friendly error message
 */
function translateDbError(dbErrorMessage) {
    if (!dbErrorMessage) return 'Database operation failed';
    
    const errorLower = dbErrorMessage.toLowerCase();
    
    // Foreign key violations
    if (errorLower.includes('foreign key') || errorLower.includes('fk_')) {
        return 'Invalid reference: One or more referenced values do not exist in the system';
    }
    
    // Unique constraint violations
    if (errorLower.includes('unique') || errorLower.includes('duplicate') || errorLower.includes('pk_')) {
        return 'Duplicate record: This record already exists in the system';
    }
    
    // Check constraint violations
    if (errorLower.includes('check constraint') || errorLower.includes('ck_')) {
        return 'Data validation failed: The provided data does not meet required constraints';
    }
    
    // Not null violations
    if (errorLower.includes('cannot insert null') || errorLower.includes('not null')) {
        return 'Required field missing: One or more mandatory fields are empty';
    }
    
    // Default fallback
    return 'Database operation failed. Please verify your data and try again';
}

module.exports = {
    unsuccessfulResponse,
    successfulResponse,
    successfulResponseWithPartialFailures,
    validationErrorResponse,
    parsingErrorResponse,
    businessRuleErrorResponse,
    databaseErrorResponse,
    translateDbError,
    ERROR_CODES
};
