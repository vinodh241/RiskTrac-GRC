const APP_ROUTE_METHODS = require('../../config/route-methods.json');
const COMMOM_DB         = require('../data-base-utility/common-db.js');
const UTILITY_APP       = require('../utility.js');
const CONSTANT_FILE_OBJ = require('../constants/constant.js');
const MESSAGE_FILE_OBJ  = require('../message/message-constant.js');

var commonDBObject      = new COMMOM_DB();
var utilityAppObject    = new UTILITY_APP();


module.exports = async function validateUpdateToken(request, response, next){
    try {
        logger.log('info', 'ValidateUpdateTokenMiddleware : validateUpdateToken : Execution started.');

        var token               = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userIdFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userNameFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        var validateTokenResponseObj = {
            status          : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
            message         : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            refreshedToken  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMessage    : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };

        var userIdFromTokenObj = {
            error   : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            userId  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };

        var userNameFromTokenObj = {
            error       : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            userName    : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };

        // check request body should not be undefined
        if(typeof request.body === CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED || request.body === CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            logger.log('error', 'ValidateUpdateTokenMiddleware : validateUpdateToken : Execution end. : Request body has not found');

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json({
                success : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
                message : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                result  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                token   : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                error   : {
                    errorCode       : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    errorMessage    : MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_REQUEST
                }
            });
        }

        if(request.body.token === CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || request.body.token === CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED){
            logger.log('error', 'ValidateUpdateTokenMiddleware : validateUpdateToken : Execution end. : Token is null or undefined in request body');

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json({
                success : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
                message : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                result  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                token   : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                error   : {
                    errorCode       : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    errorMessage    : MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_REQUEST
                }
            }); 
        }

        token = request.body.token;
        
        logger.log('info', 'ValidateUpdateTokenMiddleware : validateUpdateToken : Token from request : '+token);

        var routeObject         = await getCurrentRouteObject(request.originalUrl);
        var functionName        = routeObject.functionName;
        var validateFunction    = routeObject.validateFunction;

        validateTokenResponseObj = utilityAppObject.validateToken(token);

        // checking validation token method result and according to that making response on error case
        if (validateTokenResponseObj.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
            logger.log('error', 'ValidateUpdateTokenMiddleware : validateUpdateToken : Execution end. : Error in token');
            // Case : Error in token
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json({
                success : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
                message : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                result  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                token   : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                error   : {
                    errorCode       : CONSTANT_FILE_OBJ.APP_CONSTANT.TOKEN_EXPIRED,
                    errorMessage    : MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.TOKEN_EXPIRED
                }
            });
        }

        // We will send refreshedToken in response on successful condition
        refreshedToken = validateTokenResponseObj.refreshedToken;

        /**
         * Fetching user id from refreshed token. : Start
         */
        userIdFromTokenObj = utilityAppObject.getUserIdFromToken(refreshedToken);
        
        if (userIdFromTokenObj.error) {
            // Case : Unable to fetch user id from token
            logger.log('error', 'ValidateUpdateTokenMiddleware : validateUpdateToken : Execution end. : Unable to fetch user id from token.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(utilityAppObject.invalidTokenResposeString());
        }

        userIdFromToken = userIdFromTokenObj.userId;
        /**
         * Fetching user id from refreshed token. : End
         */

        /**
         * Fetching user name from refreshed token. : Start
         */
        userNameFromTokenObj = utilityAppObject.getUserNameFromToken(refreshedToken);

        if (userNameFromTokenObj.error){
            // Case : Unable to fetch user name from token
            logger.log('error', 'User Id : '+ userIdFromToken +' : ValidateUpdateTokenMiddleware : validateUpdateToken : Execution end. : Unable to fetch user name from token.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(utilityAppObject.invalidTokenResposeString());
        }
        
        userNameFromToken = userNameFromTokenObj.userName;
        /**
         * Fetching user name from refreshed token. : End
         */

        /**
         * updating user login table with refresh token
         */
        const COMMON_DB_RESPONSE = await commonDBObject.updateUserLoginForRefreshToken(userIdFromToken, userNameFromToken, refreshedToken, token, validateFunction, functionName);
        
        if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED != COMMON_DB_RESPONSE){
            if (COMMON_DB_RESPONSE.procedureMessage === CONSTANT_FILE_OBJ.APP_CONSTANT.INVALID_SESSION) {
                // Case : Unable to update user login for refresh token
                logger.log('error', 'User Id : '+ userIdFromToken +' : ValidateUpdateTokenMiddleware : validateUpdateToken : Execution end. : Error in db update for refresh token : '+COMMON_DB_RESPONSE.procedureMessage);

                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json({
                    success : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
                    message : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    result  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    token   : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    error   : {
                        errorCode       : CONSTANT_FILE_OBJ.APP_CONSTANT.TOKEN_EXPIRED,
                        errorMessage    : MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_SESSION
                    }
                });
            } else if (COMMON_DB_RESPONSE.procedureMessage === CONSTANT_FILE_OBJ.APP_CONSTANT.UNAUTHORIZED_ACCESS) {
                // Case : Unable to update user login for refresh token
                logger.log('error', 'User Id : '+ userIdFromToken +' : ValidateUpdateTokenMiddleware : validateUpdateToken : Execution end. : Error in db update for refresh token : '+COMMON_DB_RESPONSE.procedureMessage);

                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json({
                    success : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
                    message : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    result  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    token   : refreshedToken,
                    error   : {
                        errorCode       : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                        errorMessage    : MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNAUTHORIZED_ACCESS
                    }
                });
            } else if (COMMON_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && COMMON_DB_RESPONSE.procedureMessage != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && COMMON_DB_RESPONSE.procedureSuccess != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
                logger.log('info', 'User Id : '+ userIdFromToken +' : ValidateUpdateTokenMiddleware : validateUpdateToken : Execution end. : Refresh token updated successfully.');

                request.body.userIdFromToken    = userIdFromToken;
                request.body.userNameFromToken  = userNameFromToken;
                request.body.refreshedToken     = refreshedToken;

                next();
            }else {
                logger.log('error', 'User Id : '+ userIdFromToken +' : ValidateUpdateTokenMiddleware : validateUpdateToken : Execution end. : Error in Procedure execution while db update for refresh token : '+COMMON_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json({
                    success : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
                    message : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    result  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    token   : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    error   : {
                        errorCode       : CONSTANT_FILE_OBJ.APP_CONSTANT.TOKEN_EXPIRED,
                        errorMessage    : MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_SESSION
                    }
                });
            }
        } else {
            logger.log('error', 'User Id : '+ userIdFromToken +' : ValidateUpdateTokenMiddleware : validateUpdateToken : Execution end. : Error in Procedure execution while db update for refresh token.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json({
                success : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
                message : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                result  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                token   : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                error   : {
                    errorCode       : CONSTANT_FILE_OBJ.APP_CONSTANT.TOKEN_EXPIRED,
                    errorMessage    : MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_SESSION
                }
            });
        }
    } catch (error) {
        logger.log('error', 'User Id : '+ userIdFromToken +' : ValidateUpdateTokenMiddleware : validateUpdateToken : Execution end. : Got unhandled error : Error Detail : '+ error);
        
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json({
            success : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
            message : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            result  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            token   : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            error   : {
                errorCode       : CONSTANT_FILE_OBJ.APP_CONSTANT.TOKEN_EXPIRED,
                errorMessage    : MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_SESSION
            }
        });
    }
};

async function getCurrentRouteObject(requestUri){
    logger.log('info', 'ValidateUpdateTokenMiddleware : getCurrentRouteObject : Execution started.');
    var uriComponents   = requestUri.split(CONSTANT_FILE_OBJ.APP_CONSTANT.FORWARD_SLASH);
    const URI_LENGTH    = uriComponents.length;
    const END_POINT     = uriComponents[URI_LENGTH - CONSTANT_FILE_OBJ.APP_CONSTANT.ONE];

    logger.log('info', 'ValidateUpdateTokenMiddleware : getCurrentRouteObject : END_POINT : ' + END_POINT);
    
    var isEndPointFound = CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;
    var routeObj;

    for(obj of APP_ROUTE_METHODS["ROUTE_METHODS"]){
        if(END_POINT in obj){
            routeObj = {"functionName": obj[END_POINT], "validateFunction": obj["validateFunction"]};
            isEndPointFound = CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE;
            logger.log('info', 'ValidateUpdateTokenMiddleware : getCurrentRouteObject : End point found in route-methods.json file.');
            break;
        } 
    }
    
    if(isEndPointFound){
        logger.log('info', 'ValidateUpdateTokenMiddleware : getCurrentRouteObject : Execution end. : routeObj : ' + JSON.stringify(routeObj));
        return routeObj;
    } else {
        logger.log('error', 'ValidateUpdateTokenMiddleware : getCurrentRouteObject : Execution end. : unable to find End point in route-methods.json file : End Point value is : ' + END_POINT);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}