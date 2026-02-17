const APP_VALIATOR              = require('../../utility/app-validator.js');
const MESSAGE_FILE_OBJ          = require('../../utility/message/message-constant.js');
const CONSTANT_FILE_OBJ         = require('../../utility/constants/constant.js');
const RISK_APPETITE_DB          = require('../../data-access/risk-appetite-db.js');
const APP_CONFIG_FILE_OBJ       = require('../../config/app-config.js');
const EXCEL_FILE_READER_OBJ     = require('../../utility/excel-file-reader/risk-appetite-file-reader.js');
const UTILITY_APP               = require('../../utility/utility.js');
const BINARY_DATA               = require('../../utility/binary-data.js');
const PATH                      = require('path');
const NODE_MAILER               = require("nodemailer");
const EMAIL_CONFIG              = require('../../config/email-config.js');
const EMAIL_TEMPLATE_OBJ        = require('../../utility/email-templates.js');
var fs                          = require('fs');
const GENERIC_EMAIL_FILE_PATH   = "/config/email-template/generic-a-template.js";


var appValidatorObject              = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var riskAppetiteDbObject            = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var riskAppetiteBlClassInstance     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var utilityAppObject                = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var binarydataObject                = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;


class RiskAppetiteBl {
    constructor() {
        appValidatorObject      = new APP_VALIATOR();
        riskAppetiteDbObject    = new RISK_APPETITE_DB();
        utilityAppObject        = new UTILITY_APP();
        binarydataObject        = new BINARY_DATA();
    }

    start() {
    }

    /**
     * To download all files
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async downloadFile(request, response) {
        try {
            var refreshedToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var data = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;


            refreshedToken = request.body.refreshedToken;
            userIdFromToken = request.body.userIdFromToken;
            userNameFromToken = request.body.userNameFromToken;
            data = request.body.data;
            accountGUIDFromToken = request.body.accountGUIDFromToken

            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : downloadFile : Execution started.');

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == data || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == data) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : downloadFile : Execution end. : Invalid Request, missing mandatory parameter.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_REQUEST));
            }

            const DOWNLOAD_FILE_RESPONSE = await riskAppetiteDbObject.downloadFile(userIdFromToken, userNameFromToken, data, accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == DOWNLOAD_FILE_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == DOWNLOAD_FILE_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : downloadFile : Execution end. : download File Response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (DOWNLOAD_FILE_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : downloadFile : Execution end. : Error details :' + DOWNLOAD_FILE_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (DOWNLOAD_FILE_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && DOWNLOAD_FILE_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : downloadFile : Execution end. : Error details : ' + DOWNLOAD_FILE_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : downloadFile : Execution end. : File Downloaded successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, DOWNLOAD_FILE_RESPONSE.recordset));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : downloadFile : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * To download Risk Appetite Template
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async downloadRiskAppetiteTemplate(request, response) {
        try {
            var refreshedToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var data = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            refreshedToken = request.body.refreshedToken;
            userIdFromToken = request.body.userIdFromToken;
            userNameFromToken = request.body.userNameFromToken;
            data = request.body.data;
            accountGUIDFromToken = request.body.accountGUIDFromToken;

            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : downloadRiskAppetiteTemplate : Execution started.');

            const DOWNLAOD_RAT_RESPONSE = await riskAppetiteDbObject.downloadRiskAppetiteTemplate(userIdFromToken, userNameFromToken, data, accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == DOWNLAOD_RAT_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == DOWNLAOD_RAT_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : downloadRiskAppetiteTemplate : Execution end. : download RTA response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (DOWNLAOD_RAT_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : downloadRiskAppetiteTemplate : Execution end. : Error details :' + DOWNLAOD_RAT_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (DOWNLAOD_RAT_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && DOWNLAOD_RAT_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : downloadRiskAppetiteTemplate : Execution end. : Error details : ' + DOWNLAOD_RAT_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : downloadRiskAppetiteTemplate : Execution end. : RAT Downloaded successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, DOWNLAOD_RAT_RESPONSE.recordset));

        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : downloadRiskAppetiteTemplate : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * Get risk appetite policy details
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getPolicyDetails(request, response) {
        try {
            var refreshedToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var data = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let getRiskPolicyDetails = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let policyData = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let metricData = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let unitData = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;


            refreshedToken = request.body.refreshedToken;
            userIdFromToken = request.body.userIdFromToken;
            userNameFromToken = request.body.userNameFromToken;
            data = request.body.data;
            accountGUIDFromToken = request.body.accountGUIDFromToken;

            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : getPolicyDetails : Execution started.');

            const GET_POLICY_DATA = await riskAppetiteDbObject.getPolicyDetails(userIdFromToken, userNameFromToken, data, accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_POLICY_DATA || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_POLICY_DATA) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : getPolicyDetails : Execution end. : Get policy data is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_POLICY_DATA.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : getPolicyDetails : Execution end. : Error details :' + GET_POLICY_DATA.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_POLICY_DATA.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_POLICY_DATA.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : getPolicyDetails : Execution end. : Error details : ' + GET_POLICY_DATA.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            // No Record found in database.
            if (GET_POLICY_DATA.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_POLICY_DATA.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && GET_POLICY_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : getPolicyDetails : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, getRiskPolicyDetails));
            }

            /**
            * Formating resultset provided by DB :START.
            */
            policyData = GET_POLICY_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
            metricData = GET_POLICY_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE];
            unitData = GET_POLICY_DATA.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO];
            getRiskPolicyDetails = await getRiskPolicy(userIdFromToken, policyData, metricData, unitData);
            /**
            * Formating resultset provided by DB :END.
            */

            // Checking for null or undefined of formatted resultset data
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == getRiskPolicyDetails || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == getRiskPolicyDetails) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : getPolicyDetails : Execution end. : getRiskPolicyDetails is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : getPolicyDetails : Execution end. : Get Policy data successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, getRiskPolicyDetails));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : getPolicyDetails : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * Get risk appetite details
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getRiskAppetiteList(request, response) {
        try {
            var refreshedToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let documentDetails = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let dataForRiskAppetite = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            refreshedToken = request.body.refreshedToken;
            userIdFromToken = request.body.userIdFromToken;
            userNameFromToken = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken;

            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : getRiskAppetiteList : Execution started.');

            const RALIST_DB_RESPONSE = await riskAppetiteDbObject.getRiskAppetiteList(userIdFromToken, userNameFromToken, accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == RALIST_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == RALIST_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : getRiskAppetiteList : Execution end. : RA list db response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (RALIST_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : getRiskAppetiteList : Execution end. : Error details :' + RALIST_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (RALIST_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && RALIST_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : getRiskAppetiteList : Execution end. : Error details : ' + RALIST_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            // No Record found in database.
            if (RALIST_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && RALIST_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && RALIST_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : getRiskAppetiteList : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, dataForRiskAppetite));
            }

            /**
            * Formating resultset provided by DB :START.
            */
            documentDetails = RALIST_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
            dataForRiskAppetite = await getRiskAppetite(documentDetails, userIdFromToken);
            /**
            * Formating resultset provided by DB :END.
            */

            // Checking for null or undefined of formatted resultset data
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == dataForRiskAppetite || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == dataForRiskAppetite) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : getRiskAppetiteList : Execution end. : RALIST_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : getRiskAppetiteList : Execution end. : Get Risk Appetite List successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, dataForRiskAppetite));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : getRiskAppetiteList : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * Get risk appetite template list
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getRiskAppetiteTemplateList(request, response) {
        try {
            var refreshedToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let databaseResponse = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            refreshedToken = request.body.refreshedToken;
            userIdFromToken = request.body.userIdFromToken;
            userNameFromToken = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken;

            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : getRiskAppetiteTemplateList : Execution started.');

            const RA_TEMPLATE_DB_RESPONSE = await riskAppetiteDbObject.getRiskAppetiteTemplateList(userIdFromToken, userNameFromToken, accountGUIDFromToken);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == RA_TEMPLATE_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == RA_TEMPLATE_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : getRiskAppetiteTemplateList : Execution end. : RA_TEMPLATE_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (RA_TEMPLATE_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : getRiskAppetiteTemplateList : Execution end. : Error details :' + RA_TEMPLATE_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (RA_TEMPLATE_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && RA_TEMPLATE_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : getRiskAppetiteTemplateList : Execution end. : Error details : ' + RA_TEMPLATE_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            /**
             * Formating resultset provided by DB :START.
             */
            databaseResponse = await formatRATlist(RA_TEMPLATE_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]);
            /**
             * Formating resultset provided by DB :END.
             */

            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : getRiskAppetiteTemplateList : Execution end. : Get template list successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, databaseResponse));

        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : getRiskAppetiteTemplateList : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    

    /**
     * To upload Risk-Appetite documents (policy and framework)
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async  uploadRiskAppetite(request, response) {
        response.setTimeout(1200000);
        var uploadedFileObject = request.files.UploadFile;
        const refreshedToken = request.body.refreshedToken;
        const userIdFromToken = request.body.userIdFromToken;
        const userNameFromToken = request.body.userNameFromToken;
        const accountGUIDFromToken = request.body.accountGUIDFromToken;
        const policyName = request.body.policyName;
        var filePath = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var pdfFile = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var excelFile = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        try {
         
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : uploadRiskAppetite : Execution started.');
          
            for (var Row = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO; Row < uploadedFileObject.length; Row++) {
                var uploadedFileName = uploadedFileObject[Row].name;
                var uploadFileType = PATH.extname(uploadedFileName);
                uploadFileType = uploadFileType.toLowerCase();
                
                if (uploadFileType  == CONSTANT_FILE_OBJ.APP_CONSTANT.FILE_TYPE_PDF) {
                    pdfFile = uploadedFileObject[Row];
                } else if (uploadFileType == CONSTANT_FILE_OBJ.APP_CONSTANT.FILE_TYPE_XLSX || uploadFileType == CONSTANT_FILE_OBJ.APP_CONSTANT.FILE_TYPE_XLS){
                    excelFile = uploadedFileObject[Row];
                }
            }
            try {
                const [pdfData, excelData] = await Promise.all([
                    new Promise((fulfill, reject) => {
                        logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : uploadRiskAppetite : pdfFile : ' + JSON.stringify(pdfFile));
                    request.files.UploadFile = pdfFile;
                        uploadPdfFile(request, response, userIdFromToken, refreshedToken, accountGUIDFromToken)
                            .then(result => fulfill(result))
                            .catch(error => reject(error));
                    }),
                    new Promise((fulfill, reject) => {
                        logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : uploadRiskAppetite : excelFile : ' + JSON.stringify(excelFile));
                        request.files.UploadFile = excelFile;
                        uploadXlsxOrXlsFile(request, response, userIdFromToken, refreshedToken, accountGUIDFromToken)
                            .then(result => fulfill(result))
                            .catch(error => reject(error));
                    })
                ]);
               
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : uploadRiskAppetite : pdfData : ' + JSON.stringify(pdfData));
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : uploadRiskAppetite : excelData : ' + JSON.stringify(excelData));
                if (pdfData && excelData ) {
                                
                    const data = {
                        policyFileName: pdfData.policyFileName,
                        policyUniqueFileName: pdfData.policyUniqueFileName,
                        fileType: pdfData.policyfileType,
                        policyFileContent: pdfData.policyFileContent,
                        frameworkFileName: excelData.frameworkFileName,
                        frameworkUniqueFileName: excelData.frameworkUniqueFileName,
                        frameworkfileType: excelData.frameworkfileType,
                        frameworkFileContent: excelData.frameworkFileContent,
                    };
            
                    logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : uploadRiskAppetite : data : : ' + JSON.stringify(data));
            
                    filePath = APP_CONFIG_FILE_OBJ.FILE_UPLOAD.RISKAPPETITE_FRAMEWORK_DESTINATION_PATH;
                    let resp =   await processUploadedFiles(userIdFromToken, userNameFromToken, data, policyName, response, refreshedToken, filePath, accountGUIDFromToken);
                    if (resp.success == 1) {
                        logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : uploadRiskAppetite : RISK APPETITE UPLOADED SUCCESSFULLY : resp : ' + JSON.stringify(resp.result.documents)); 
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.RISK_APPETITE_DOCS_UPLOAD_SUCCESSFUL, resp.result.documents));
                    }
                
                } else {
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : uploadRiskAppetite : Execution end. : Error during file dumping.');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_FAIL));
                }
            } catch (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : uploadRiskAppetite : Execution end. : Error Detail : ' + error.message);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_FAIL));
            }
            
    
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : uploadRiskAppetite : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_FAIL));
        }
    }
    
    
    

    /**
     * To upload Risk-Appetite template file.
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async uploadRiskAppetiteTemplate(request, response) {
        try {
            response.setTimeout(1200000);

            var refreshedToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var destinationPath = APP_CONFIG_FILE_OBJ.FILE_UPLOAD.RISKAPPETITE_TEMPLATE_DESTINATION_PATH;
            var data = {
                fileName: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                fileContent: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
            };
            var accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            refreshedToken = request.body.refreshedToken;
            userIdFromToken = request.body.userIdFromToken;
            userNameFromToken = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken;


            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : uploadRiskAppetiteTemplate : Execution started.');

            if (request.files !== CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED &&
                request.files !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL &&
                Object.keys(request.files).length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {

                const ALLOWED_FILE_EXTENSION_TYPES = APP_CONFIG_FILE_OBJ.FILE_UPLOAD.RISK_APPETITE_TEMPLATE_EXTENSIONS_LIST;
                const ALLOWED_FILE_MIME_TYPES = APP_CONFIG_FILE_OBJ.FILE_UPLOAD.RISK_APPETITE_TEMPLATE_FILE_MIME_TYPES;
                await binarydataObject.uploadFilesInBinaryFormat(request, destinationPath, ALLOWED_FILE_EXTENSION_TYPES, ALLOWED_FILE_MIME_TYPES, userIdFromToken, function (fileUploadResponseObject) {
                    if (fileUploadResponseObject.status == CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) {

                        data.fileName = fileUploadResponseObject.fileName;
                        data.fileContent = fileUploadResponseObject.fileDataContent;

                        riskAppetiteDbObject.uploadRiskAppetiteTemplate(userIdFromToken, userNameFromToken, data, accountGUIDFromToken, function (ADD_RAT_DB_RESPONSE) {

                            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == ADD_RAT_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == ADD_RAT_DB_RESPONSE) {
                                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : uploadRiskAppetiteTemplate : Execution end. : Upload RAT response is undefined or null.');
                                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_FAIL));
                            }
                            if (ADD_RAT_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : uploadRiskAppetiteTemplate : Execution end. : Error details :' + ADD_RAT_DB_RESPONSE.errorMsg);
                                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_FAIL));
                            }
                            if (ADD_RAT_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && ADD_RAT_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : uploadRiskAppetiteTemplate : Execution end. : Error details : ' + ADD_RAT_DB_RESPONSE.procedureMessage);
                                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_FILE_EXIST));
                            }
                            /**
                             * Formating resultset provided by DB :START.
                             */
                            const FORMAT_DATA_RESULT = formatRATResponse(ADD_RAT_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]);
                            /**
                             * Formating resultset provided by DB :END.
                             */

                            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : uploadRiskAppetiteTemplate : Execution end. : RA template uploaded successfully.');
                            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_SUCCESSFUL, FORMAT_DATA_RESULT));
                        });


                    }
                    else {
                        logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : uploadRiskAppetiteTemplate : Execution end. : Error on dumping file into server. : Error detail : ' + fileUploadResponseObject.errorMessage);
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, fileUploadResponseObject.errorMessage));
                    }
                });
            }
            else {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : uploadRiskAppetiteTemplate : Execution end. : No file to upload.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_FILE_TO_UPLOAD));
            }
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : uploadRiskAppetiteTemplate : Execution end. : Got unhandled error. : Error Detail from catch block : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_FAIL));
        }
    }


    /**
     * To generate email 
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async generateEmail(request, response) {
        try {
            var userIdFromToken = request.body.userIdFromToken;
            var refreshedToken = request.body.refreshedToken;
            var accountGUIDFromToken = request.body.accountGUIDFromToken;

            let senderConfig = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let senderEmail = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let authUser = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let mailConfig = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            // email config details for QA environment
            if (EMAIL_CONFIG.ENVIRONMENT_NAME.envName == CONSTANT_FILE_OBJ.APP_CONSTANT.QA) {
                senderConfig = EMAIL_CONFIG.QA_SENDER_CONFIG;
                senderEmail = EMAIL_CONFIG.QA_SENDER_CONFIG.senderEmail;
                authUser = EMAIL_CONFIG.QA_MAIL_CONFIG.auth.user;
                mailConfig = EMAIL_CONFIG.QA_MAIL_CONFIG;
            }
            // email config details for PROD
            else if (EMAIL_CONFIG.ENVIRONMENT_NAME.envName == CONSTANT_FILE_OBJ.APP_CONSTANT.PROD) {
                senderConfig = EMAIL_CONFIG.PROD_SENDER_CONFIG;
                senderEmail = EMAIL_CONFIG.PROD_SENDER_CONFIG.senderEmail;
                authUser = EMAIL_CONFIG.PROD_MAIL_CONFIG.auth.user;
                mailConfig = EMAIL_CONFIG.PROD_MAIL_CONFIG;
            } else {
                logger.log('error', 'Email : sendMail : environment is not QA or PROD.');
                return;
            }

            let TEMPLATE_MASTER = {
                comment: ''
            };
            let emailDetails = {
                templateKey: '',
                emailIDs: senderEmail
            };

            let templateTypeIndex = request.body.data.findIndex(x => x.key === 'templateType');
            let templateType = request.body.data[templateTypeIndex];

            logger.log('info', `User Id : ${userIdFromToken} : generateEmail : templateType : ${templateType.value}`);

            if (templateType.value === 'A') {
                TEMPLATE_MASTER.comment = 'genericA';
                emailDetails.templateKey = 'GENERIC_A_TEMPLATE';
            } else if (templateType.value === 'B') {
                TEMPLATE_MASTER.comment = 'genericB';
                emailDetails.templateKey = 'GENERIC_B_TEMPLATE';
            }

            var templateObject = new EMAIL_TEMPLATE_OBJ();
            const preparedTemplate = templateObject.prepareTemplates(TEMPLATE_MASTER, emailDetails.templateKey, userIdFromToken);
            const modifiedTemplate = makeEmailBodyDynamic(preparedTemplate.Body, request.body.data);

            let toMailIndex = request.body.data.findIndex(x => x.key === 'toEmailId');
            let toMailId = request.body.data[toMailIndex].value;

            logger.log('info', `User Id : ${userIdFromToken} : generateEmail : toMailId : ${toMailId}`);

            const EMAIL_CONTENT = {
                from: senderEmail ? senderEmail : authUser,
                to: toMailId,
                subject: preparedTemplate.Subject,
                html: modifiedTemplate,
                accountGUIDFromToken: accountGUIDFromToken
            };

            if (EMAIL_CONTENT.from === CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
                logger.log('error', 'generateEmail : sender email is null');
                return response.status(200).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.EMAIL_UNSUCCESSFUL));
            }

            // ---------------------------------------
            //   EMAIL SENDING CONFIG CHECK BLOCK
            // ---------------------------------------
            if (EMAIL_CONFIG.IS_SEND_EMAIL) {
                let encryptedPassword = mailConfig.auth.pass;
                mailConfig.auth.pass = utilityAppObject.decryptDataByPrivateKey(mailConfig.auth.pass);

                const TRANSPORTER = NODE_MAILER.createTransport(mailConfig);

                mailConfig.auth.pass = encryptedPassword;

                TRANSPORTER.sendMail(EMAIL_CONTENT, (error, info) => {
                    let status = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

                    if (error) {
                        logger.log('error', 'Generic Email : sendMail : Failed : ' + JSON.stringify(error));
                        status = CONSTANT_FILE_OBJ.APP_CONSTANT.FAILED;

                        return response.status(200).json(
                            unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.EMAIL_UNSUCCESSFUL));
                    } else {
                        logger.log('info', 'Generic Email : sendMail : Success : ' + JSON.stringify(info));
                        status = CONSTANT_FILE_OBJ.APP_CONSTANT.SUCCESS;

                        return response.status(200).json(
                            successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.EMAIL_SUCCESSFUL, true));
                    }
                });
            } else {
                // EMAIL SENDING DISABLED
                logger.log('info', 'generateEmail : Email sending is paused / disabled by configuration. No email was sent.');

                let status = "Email sending is paused / disabled by configuration. No email was sent.";
                logger.log('info', 'generateEmail : status : ' + status);

                return response.status(200).json(unsuccessfulResponse(refreshedToken, status));
            }

        } catch (error) {
            logger.log('error', 'generateEmail : unhandled error : ' + error);
            return response.status(200).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.EMAIL_UNSUCCESSFUL));
        }
    }

    stop() {
    }
}

async function uploadPdfFile(request, response,userIdFromToken, refreshedToken, accountGUIDFromToken) {
    const filePath = APP_CONFIG_FILE_OBJ.FILE_UPLOAD.RISKAPPETITE_POLICY_DESTINATION_PATH;
    const ALLOWED_FILE_EXTENSION_TYPES = APP_CONFIG_FILE_OBJ.FILE_UPLOAD.RISK_APPETITE_DOCUMENTS_EXTENSIONS_LIST;
    const ALLOWED_FILE_MIME_TYPES = APP_CONFIG_FILE_OBJ.FILE_UPLOAD.RISK_APPETITE_DOCUMENTS_FILE_MIME_TYPES;
    

    return new Promise(async (resolve, reject) => {
        await getFileDetails(request, response, filePath, ALLOWED_FILE_EXTENSION_TYPES, ALLOWED_FILE_MIME_TYPES, userIdFromToken, refreshedToken, accountGUIDFromToken, function (success) {
            // logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : uploadRiskAppetite : PDF file got success : Row : ' + JSON.stringify(Row) + ' : uploadFileType : ' + CONSTANT_FILE_OBJ.APP_CONSTANT.FILE_TYPE_PDF);

            const data = {
                policyFileName: success.fileName,
                policyUniqueFileName: success.fileUniqueId,
                fileType: success.fileExtension,
                policyFileContent: success.fileDataContent,
            };

            if (data.policyFileName !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && data.policyFileName !== CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : uploadRiskAppetite : isPolicyFile :' + CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE);
                resolve(data);
            } else {
                reject(new Error('Policy file name is null or undefined.'));
            }
        });
    });
}

async function uploadXlsxOrXlsFile(request,response, userIdFromToken, refreshedToken, accountGUIDFromToken) {
    const ALLOWED_FILE_EXTENSION_TYPES = APP_CONFIG_FILE_OBJ.FILE_UPLOAD.RISK_APPETITE_DOCUMENTS_EXTENSIONS_LIST;
    const ALLOWED_FILE_MIME_TYPES = APP_CONFIG_FILE_OBJ.FILE_UPLOAD.RISK_APPETITE_DOCUMENTS_FILE_MIME_TYPES;
    const filePath = APP_CONFIG_FILE_OBJ.FILE_UPLOAD.RISKAPPETITE_FRAMEWORK_DESTINATION_PATH;

    return new Promise(async (resolve, reject) => {
        
        await getFileDetails(request, response, filePath, ALLOWED_FILE_EXTENSION_TYPES, ALLOWED_FILE_MIME_TYPES, userIdFromToken, refreshedToken, accountGUIDFromToken, function (success) {
            // logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : uploadRiskAppetite : XLXS file got success : Row : ' + JSON.stringify(Row) + ' : uploadFileType : ' + CONSTANT_FILE_OBJ.APP_CONSTANT.FILE_TYPE_XLSX);

            const data = {
                frameworkFileName: success.fileName,
                frameworkUniqueFileName: success.fileUniqueId,
                fileType: success.fileExtension,
                frameworkFileContent: success.fileDataContent,
            };

            if (data.frameworkFileName !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && data.frameworkFileName !== CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : uploadRiskAppetite : isframeworkFile :' + CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE);
                resolve(data);
            } else {
                reject(new Error('Framework file name is null or undefined.'));
            }
        });
    });
}


async function processUploadedFiles(userIdFromToken, userNameFromToken, data, policyName, response, refreshedToken,filePath, accountGUIDFromToken) {
    return new Promise((resolve, reject) => {
        let isPolicyFile = CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;
        let isframeworkFile = CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;

        if (data.policyFileName !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && data.policyFileName !== CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED) {
            isPolicyFile = CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE;
        }

        if (data.frameworkFileName !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && data.frameworkFileName !== CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED) {
            isframeworkFile = CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE;
        }

        if (isPolicyFile == CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && isframeworkFile == CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) {
            riskAppetiteDbObject.uploadRiskAppetite(userIdFromToken, userNameFromToken, data, policyName, accountGUIDFromToken, function (uploadRAResponse) {
                if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == uploadRAResponse || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == uploadRAResponse) {
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : uploadRiskAppetite : Execution end. : Upload RAT response is undefined or null.');
                    reject(new Error('Upload RAT response is undefined or null.'));
                } else if (uploadRAResponse.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : uploadRiskAppetite : Execution end. : Error details :' + uploadRAResponse.errorMsg);
                    reject(new Error('Upload RAT response status is not ONE.'));
                } else if (uploadRAResponse.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && uploadRAResponse.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                    logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : uploadRiskAppetite : Execution end. : Error details : ' + uploadRAResponse.procedureMessage);
                    reject(new Error('Upload RAT procedure success is FALSE.'));
                } else {
                    const FILE_ID = uploadRAResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].FileID;
                    const UNIQUE_FILE_NAME = uploadRAResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].UniqueFileNameFromDB;

                    logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : uploadRiskAppetite : From Data base FILE_ID value = ' + FILE_ID);
                    logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : uploadRiskAppetite : From Data base UNIQUE_FILE_NAME value = ' + UNIQUE_FILE_NAME);

                    if (filePath.endsWith(CONSTANT_FILE_OBJ.APP_CONSTANT.FORWARD_SLASH)) {
                        filePath = filePath.slice(CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO, CONSTANT_FILE_OBJ.APP_CONSTANT.MINUS_ONE);   // Removing "/" from file path
                    }

                    filePath = filePath.slice(CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO, CONSTANT_FILE_OBJ.APP_CONSTANT.MINUS_FIVE);      // Removing "/temp" fron file path
                    var newFileAbsolutePath = PATH.join(filePath + CONSTANT_FILE_OBJ.APP_CONSTANT.FORWARD_SLASH, UNIQUE_FILE_NAME);

                    EXCEL_FILE_READER_OBJ.processExcelFile(userIdFromToken, userNameFromToken, FILE_ID, newFileAbsolutePath, accountGUIDFromToken, function (processExcelFileResponse) {
                        if (processExcelFileResponse) {
                            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : uploadRiskAppetite : Risk Appetite documents files got uploaded successfully and data processing of file data is also successful. : processExcelFileResponse Vlaue : ' + processExcelFileResponse);

                            riskAppetiteDbObject.getRiskAppetiteListForUpload(userIdFromToken, userNameFromToken, accountGUIDFromToken, function (RALIST_DB_RESPONSE) {
                                if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == RALIST_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == RALIST_DB_RESPONSE) {
                                    logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : uploadRiskAppetite : Execution end. : RA list db response is undefined or null.');
                                    reject(new Error('RA list db response is undefined or null.'));
                                }
                                if (RALIST_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                                    logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : uploadRiskAppetite : Execution end. : Error details :' + RALIST_DB_RESPONSE.errorMsg);
                                    reject(new Error('RA list db response status is not ONE.'));
                                }
                                if (RALIST_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && RALIST_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                                    logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : uploadRiskAppetite : Execution end. : Error details : ' + RALIST_DB_RESPONSE.procedureMessage);
                                    reject(new Error('RA list procedure success is FALSE.'));
                                }

                                if (RALIST_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && RALIST_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && RALIST_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                                    logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : uploadRiskAppetite : Execution end. : No Record in data base');
                                    resolve(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, CONSTANT_FILE_OBJ.APP_CONSTANT.NULL));
                                }

                                const DOCUMENT_DETAILS = RALIST_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
                                logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : uploadRiskAppetite  response of DB procedure ' + JSON.stringify(DOCUMENT_DETAILS));
                                
                                formatgetRiskAppetiteData(DOCUMENT_DETAILS, userIdFromToken, function (DATA_FOR_RISK_APPETITE) {
                                    if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == DATA_FOR_RISK_APPETITE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == DATA_FOR_RISK_APPETITE) {
                                        logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : uploadRiskAppetite : Execution end. : RALIST_DB_RESPONSE is undefined or null.');
                                        reject(new Error('RALIST_DB_RESPONSE is undefined or null.'));
                                    }

                                    logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : uploadRiskAppetite : Execution end. : Get Risk Appetite List successfully.');
                                    logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : uploadRiskAppetite : Execution end. : Risk Appetite documents files got uploaded successfully.');
                                    
                                    resolve(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.RISK_APPETITE_DOCS_UPLOAD_SUCCESSFUL, DATA_FOR_RISK_APPETITE));
                                });
                            });
                        } else {
                            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : uploadRiskAppetite : Execution end. : Risk Appetite documents files got error in processExcelFile method for reading. : processExcelFileResponse Vlaue : ' + processExcelFileResponse);
                            reject(new Error('Risk Appetite documents files got error in processExcelFile method for reading.'));
                        }
                    });
                }
            });
        }
    });
}

function makeEmailBodyDynamic(emailBody, data) {
    var result;
    // finds the matching key substring in html and replaces it with the value corresponding to the key
    result = emailBody.replace(/\{\{(.+?)\}\}/g, (matching, keyValue) => data[data.findIndex(x => x.key == keyValue)].value);
    return result;

}

function unsuccessfulResponse(refreshedToken, errorMessage) {
    return {
        success: CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
        message: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
        result: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
        token: refreshedToken,
        error: {
            errorCode: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMessage: errorMessage
        }
    }
}

function successfulResponse(refreshedToken, successMessage, result) {
    return {
        success: CONSTANT_FILE_OBJ.APP_CONSTANT.ONE,
        message: successMessage,
        result: result,
        token: refreshedToken,
        error: {
            errorCode: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMessage: CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
        }
    }
}

/**
 * This is function will format the DB response of getRiskAppetite list.
 */
async function getRiskAppetite(documentDetails, userIdFromToken) {
    try {
        logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : getRiskAppetite : Execution Start.');
        let documentData = [];
        for (const obj of Object.values(documentDetails)) {
            documentData.push({
                "FWID": obj.FWID,
                "FrameworkName": obj.PolicyName,
                "Version": obj.MajorVersion + '.' + obj.MinorVersion,
                "PolicyFileID": obj.FileID,
                "PolicyFileName": obj.PolicyFileName,
                "FrameworkFileId": obj.FileID,
                "FrameworkFileName": obj.FrameworkFileName,
                "UploadDate": obj.UploadDate
            })
        };
        logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : getRiskAppetite : Execution end.');

        return {
            "documents": documentData
        }
    } catch (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : getRiskAppetite : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return {
            "documents": null
        }
    }
}

/**
 * This is function will format the DB response of getRiskPolicy details.
 */
async function getRiskPolicy(userIdFromToken, policyData, metricData, unitData) {
    try {
        logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : getRiskPolicy : Execution started.');

        let riskData = [];
        let riskMetricData = [];
        // adding parent Risk and unitname to riskmetricData
        riskData = policyData.filter(ele => ele.ParentNodeID != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL);
        riskData.forEach(obj => {

            let policyObj = policyData.filter(ele => ele.NodeID == obj.ParentNodeID);
            let unitObj = unitData.filter(ele => ele.UnitID == obj.UnitID);

            obj['ParentRisk'] = policyObj && policyObj.length ? policyObj.map(ele => ele.CaptionData) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            obj['UnitName'] = unitObj && unitObj.length ? unitObj.map(ele => ele.Name) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        });

        riskData.forEach(obj => {
            riskMetricData.push({
                "col1": obj.ParentRisk != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? obj.ParentRisk[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                "col2": obj.CaptionData,
                "Units": obj.UnitID,
                "UnitName": obj.UnitName != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? obj.UnitName[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                "MeasurmentTypeID": obj.MeasurmentTypeID,
                "Low": obj.Limit1 ? obj.Limit1.trim() : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                "Moderate": obj.Limit2 ? obj.Limit2.trim() : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                "High": obj.Limit3 ? obj.Limit3.trim() : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
            })
        })
        logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : getRiskPolicy : Execution end.');

        return {
            "colors": {
                "low": metricData && metricData.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? metricData[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ColorCode : null,
                "moderate": metricData && metricData.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? metricData[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE].ColorCode : null,
                "high": metricData && metricData.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? metricData[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO].ColorCode : null
            },
            "cols": {
                "col1": CONSTANT_FILE_OBJ.APP_CONSTANT.RISK,
                "col2": CONSTANT_FILE_OBJ.APP_CONSTANT.RISK_METRIC
            },
            "data": riskMetricData
        }
    } catch (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : getRiskPolicy : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }

}

/**
 * This is function will format the DB response of get Risk Appetite Template list.
 */
async function formatRATlist(dbRecordSet) {
    return {
        "dataList": dbRecordSet
    }
}

function formatRATResponse(dbRecordSet) {
    let data = []
    let result = JSON.stringify(dbRecordSet);
    data.push({
        "TemplateID": JSON.parse(result)[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].TemplateID,
        "FileName": JSON.parse(result)[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].FileName,
        "CreatedDate": JSON.parse(result)[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].UploadedDate
    });

    return {
        "dataList": data
    }
}

/**
 * This is function will format the DB response of getRiskAppetite list for upload method.
 */
async function formatgetRiskAppetiteData(documentDetails, userIdFromToken, callback) {
    try {
        logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : getRiskAppetite : Execution Start.');
        let documentData = [];
        for (const obj of Object.values(documentDetails)) {
            documentData.push({
                "FWID": obj.FWID,
                "FrameworkName": obj.PolicyName,
                "Version": obj.MajorVersion + '.' + obj.MinorVersion,
                "PolicyFileID": obj.FileID,
                "PolicyFileName": obj.PolicyFileName,
                "FrameworkFileId": obj.FileID,
                "FrameworkFileName": obj.FrameworkFileName,
                "UploadDate": obj.UploadDate
            })
        };
        logger.log('info', 'User Id  : RiskAppetiteBl : getRiskAppetite : documentData' + documentData);
        logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : getRiskAppetite : Execution end.');

        callback({
            "documents": documentData
        });
    } catch (error) {
        logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : getRiskAppetite : Execution end. : Got unhandled error. : Error Detail : ' + error);
        callback(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL);
    }
}

/**
 * This is function will upload file in server and return file details
 */
async function getFileDetails(request, response, filePath, ALLOWED_FILE_EXTENSION_TYPES, ALLOWED_FILE_MIME_TYPES, userIdFromToken, refreshedToken, accountGUIDFromToken, callback) {
    logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : getFileDetails : Execution started.');

    await binarydataObject.uploadFilesInBinaryFormat(request, filePath, ALLOWED_FILE_EXTENSION_TYPES, ALLOWED_FILE_MIME_TYPES, userIdFromToken, function (fileUploadResponseObject) {
        if (fileUploadResponseObject.status == CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) {
            logger.log('info', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : getFileDetails : Execution end.');
            callback(fileUploadResponseObject);
        }
        else {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : RiskAppetiteBl : getFileDetails : Execution end. : Error on dumping file into server. : Error detail : ' + fileUploadResponseObject.errorMessage);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_FAIL));
        }
    });

}

function getRiskAppetiteBLClassInstance() {
    if (riskAppetiteBlClassInstance === CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
        riskAppetiteBlClassInstance = new RiskAppetiteBl();
    }
    return riskAppetiteBlClassInstance;
}

exports.getRiskAppetiteBLClassInstance = getRiskAppetiteBLClassInstance;