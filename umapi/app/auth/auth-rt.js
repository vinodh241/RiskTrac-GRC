const AUTH_BL                   = require('./auth-bl.js');
const CONSTANT_FILE_OBJ         = require('../../utility/constants/constant.js');
const TOKEN_UPDATE_MIDDELWARE   = require('../../utility/middleware/validate-update-token.js');

var thisInstance = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class AuthRt {
    constructor(app) {
        this.app            = app;
        this.authBlObject   = AUTH_BL.getAuthBlClassInstance();
        this.authBlObject.start();
    }

    /**
     * This function will be used to initialize controller specific operation
     */
    start() {
        this.app.post('/user-management/auth/logout',   TOKEN_UPDATE_MIDDELWARE,  this.authBlObject.updateUserLogout);
        const safeGetPublicKey = (req, res) => {
            Promise.resolve(this.authBlObject.getPublicKey(req, res)).catch((err) => {
                try { if (global.logger && global.logger.log) global.logger.log('error', 'get-key route catch: ' + (err && (err.message || err.toString()) || err)); } catch (_) {}
                if (!res.headersSent) res.status(200).json({ success: 0, message: null, result: null, error: { errorCode: null, errorMessage: 'Service temporarily unavailable' } });
            });
        };
        this.app.post('/user-management/auth/get-key',                            safeGetPublicKey);
        this.app.get('/user-management/auth/get-key',                             safeGetPublicKey);
        this.app.post('/user-management/auth/login',                              this.authBlObject.updateUserLogin);
        this.app.get('/user-management/auth/get-All-Accounts-Name',               this.authBlObject.getAllAccountsName);

        //Local Authentication API's 
        this.app.post('/user-management/auth/verify-user-details',               this.authBlObject.verifyUserDetails);
        this.app.post('/user-management/auth/send-otp-for-forgot-password',      this.authBlObject.sendOTP);
        this.app.post('/user-management/auth/send-otp-for-login',                this.authBlObject.sendOTPLogin);
        this.app.post('/user-management/auth/verify-OTP-for-forgot-password',    this.authBlObject.verifyOTPForForgotPassword);
        this.app.post('/user-management/auth/verify-account-details',            this.authBlObject.verifyAccountDetails);
        // this.app.post('/user-management/auth/verify-OTP-for-login',              this.authBlObject.verifyOTPForLogin);
        this.app.post('/user-management/auth/change-password',                   this.authBlObject.changePassword);
        this.app.post('/user-management/auth/get-user-details-by-name',          this.authBlObject.getUserDetailsByName);
        this.app.post('/user-management/auth/verify-OTP-for-login',             TOKEN_UPDATE_MIDDELWARE,  this.authBlObject.verifyOTPForLogin);

        this.app.post('/user-management/auth/get-password-history-data',        TOKEN_UPDATE_MIDDELWARE,  this.authBlObject.getPasswordHistoryData);
        this.app.post('/user-management/auth/send-otp-for-change-password',     TOKEN_UPDATE_MIDDELWARE,  this.authBlObject.sendOTPForChangePassword);
        this.app.post('/user-management/auth/change-password-user',             TOKEN_UPDATE_MIDDELWARE,  this.authBlObject.changePasswordUser);
    }
    
    /**
     * This function will be used to stop service of controller in case any.
     */
    stop() {

    }
}

/**
 * This is function will be used to return single instance of class.
 * @param {*} app 
 */
function getInstance( app ) {
    if( thisInstance === CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ) {
        thisInstance = new AuthRt(app);
    }
    return thisInstance;
}

exports.getInstance = getInstance;