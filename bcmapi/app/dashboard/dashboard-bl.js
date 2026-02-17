const MESSAGE_FILE_OBJ          = require("../../utility/message/message-constant.js");
const CONSTANT_FILE_OBJ         = require("../../utility/constants/constant.js");
const DASHBOARD_DB              = require("../../data-access/dashboard-db.js");
const { logger }                = require("../../utility/log-manager/log-manager.js");





var DashboardBLClassInstance  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var dashboardDB               = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;


class DashboardBL {
    constructor() {
        dashboardDB         = new DASHBOARD_DB();
    }

    start() {}


    /** 
    * This function will fetch the all crisis communications list from the dataBase 
    */
    async getGlobalDashboardData(request, response) {
        let refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let dashboardData           = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let accountGUIDFromToken    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        refreshedToken              = request.body.refreshedToken;
        userIdFromToken             = request.body.userIdFromToken;
        userNameFromToken           = request.body.userNameFromToken;
        accountGUIDFromToken        = request.body.accountGUIDFromToken;
        try {

            dashboardData  = request.body.data;

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == dashboardData || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == dashboardData) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : DashboardBL : getGlobalDashboardData : Execution end. : dashboardData is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_INPUT_REQUEST));
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : DashboardBL : getGlobalDashboardData : Execution started.');

            const GET_GLOBAL_DASHBOARD_DATA = await dashboardDB.getGlobalDashboardData(userIdFromToken, userNameFromToken,dashboardData, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : DashboardBL : getGlobalDashboardData : GET_GLOBAL_DASHBOARD_DATA : '+JSON.stringify(GET_GLOBAL_DASHBOARD_DATA));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_GLOBAL_DASHBOARD_DATA || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_GLOBAL_DASHBOARD_DATA) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : DashboardBL : getGlobalDashboardData : Execution end. :  GET_GLOBAL_DASHBOARD_DATA is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_GLOBAL_DASHBOARD_DATA.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : DashboardBL : getGlobalDashboardData : Execution end. : Error details :' + GET_GLOBAL_DASHBOARD_DATA.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_GLOBAL_DASHBOARD_DATA.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_GLOBAL_DASHBOARD_DATA.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : DashboardBL : getGlobalDashboardData : Execution end. : Error details : ' + GET_GLOBAL_DASHBOARD_DATA.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            const GET_DASHBOARD_INFO = await dashboardDB.getDashboardInfo(userIdFromToken, userNameFromToken, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : DashboardBL : getGlobalDashboardData : GET_DASHBOARD_INFO : '+JSON.stringify(GET_DASHBOARD_INFO));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_DASHBOARD_INFO || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_DASHBOARD_INFO) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : DashboardBL : getGlobalDashboardData : Execution end. :  GET_DASHBOARD_INFO is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_DASHBOARD_INFO.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : DashboardBL : getGlobalDashboardData : Execution end. : Error details :' + GET_DASHBOARD_INFO.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (GET_DASHBOARD_INFO.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_DASHBOARD_INFO.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : DashboardBL : getGlobalDashboardData : Execution end. : Error details : ' + GET_DASHBOARD_INFO.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            const FORMAT_GET_GLOBAL_DASHBOARD_DATA = await getFormatGlobalDashboardData(userIdFromToken, userNameFromToken, GET_GLOBAL_DASHBOARD_DATA, GET_DASHBOARD_INFO, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : DashboardBL : getGlobalDashboardData : FORMAT_GET_GLOBAL_DASHBOARD_DATA : '+JSON.stringify(FORMAT_GET_GLOBAL_DASHBOARD_DATA));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_GET_GLOBAL_DASHBOARD_DATA || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_GET_GLOBAL_DASHBOARD_DATA) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : DashboardBL : getGlobalDashboardData : Execution end. :  FORMAT_GET_GLOBAL_DASHBOARD_DATA response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, FORMAT_GET_GLOBAL_DASHBOARD_DATA));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : DashboardBL : getGlobalDashboardData : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

}

function unsuccessfulResponse(refreshedToken, errorMessage) {
    return {
        success : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
        message : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
        result  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
        token   : refreshedToken,
        error   : {
            errorCode    : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMessage : errorMessage,
        },
    };
}

function successfulResponse(refreshedToken, successMessage, result) {
    return {
        success : CONSTANT_FILE_OBJ.APP_CONSTANT.ONE,
        message : successMessage,
        result  : result,
        token   : refreshedToken,
        error   : {
            errorCode    : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMessage : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
        },
    };
}

//This function will format globalDashboardData
async function getFormatGlobalDashboardData(userIdFromToken,userNameFromToken, globalDashboardData, customDashboardInfo, accountGUIDFromToken){
    let RMTList                 = [];
    let financialYears          = [];
    let dashboards              = [];
    let SRAAssessments          = [];
    let risksData               = [];
    let topSites                = [];
    let dashboardWidgets        = [];
    let BCMSTestList            = [];
    let BCPCoverageList         = [];
    let criticalityDistribution = [];
    let SRAScheduledCounts      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let SRAInProgressCounts     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let SRAPublishedCounts      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let BCMSScheduledCounts     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let BCMSInProgressCounts    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let BCMSPublishedCounts     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let SRATotal                = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
    let BCMSTotal               = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
    let SRAPeriodic             = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let BCMSPeriodic            = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let BIALowCounts            = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let BIAMediumCounts         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let BIAHighCounts           = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let BIA_TotaL               = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
    let BCPPeriodic             = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;   
    let BCP_Coverage            = {}; 
    let result                  = {
        "RPO_4_Hours"           : 0,
        "RPO_4_Hours_1_Days"    : 0,
        "RPO_2_3_Days"          : 0,
        "RPO_3_5_Days"          : 0,
        "RPO_5_Days"            : 0,
        "RTO_4_Hours"           : 0,
        "RTO_4_Hours_1_Days"    : 0,
        "RTO_2_3_Days"          : 0,
        "RTO_3_5_Days"          : 0,
        "RTO_5_Days"            : 0,
        "MTPD_4_Hours"          : 0,
        "MTPD_4_Hours_1_Days"   : 0,
        "MTPD_2_3_Days"         : 0,
        "MTPD_3_5_Days"         : 0,
        "MTPD_5_Days"           : 0,
        "RPO_Total"             : 0,
        "RTO_Total"             : 0,
        "MTPD_Total"            : 0,
        "Total"                 : 0
    };
    try {
        logger.log('info', 'User Id : ' + userIdFromToken + ' : DashboardBL : getFormatGlobalDashboardData : Execution start.'); 

        let yearsData           = globalDashboardData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] && globalDashboardData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? globalDashboardData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] : [];
        let SRAData             = globalDashboardData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] && globalDashboardData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? globalDashboardData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] : [];
        let RMTData             = globalDashboardData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] && globalDashboardData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? globalDashboardData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] : [];
        let RMTModuleData       = globalDashboardData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] && globalDashboardData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? globalDashboardData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] : [];
        let BCMSData            = globalDashboardData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR] && globalDashboardData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? globalDashboardData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR] : [];
        let BCPCoverageData     = globalDashboardData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE] && globalDashboardData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? globalDashboardData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE] : [];
        let BCPdata             = globalDashboardData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX] && globalDashboardData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? globalDashboardData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX] : [];
        // let dashboardsData  = globalDashboardData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] && globalDashboardData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? globalDashboardData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] : [];
        let dashboardTypesData  = customDashboardInfo.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] && customDashboardInfo.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? customDashboardInfo.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] : [];
        let widgetsData         = customDashboardInfo.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] && customDashboardInfo.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? customDashboardInfo.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] : [];
        let businessData        = globalDashboardData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN] && globalDashboardData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN].length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? globalDashboardData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN] : [];
        

         // formatting widgets data from response
         if (widgetsData !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && widgetsData.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
            Object.values(widgetsData).forEach((item) => {
                dashboardWidgets.push({
                    "WidgetID"      : Number(item.WidgetID),
                    "WidgetName"    : item.WidgetTitle,
                    "WidgetContent" : item.WidgetContent
                })
            })
        }

        // formatting different types of dashboards data from response
        if (dashboardTypesData !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && dashboardTypesData.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO && dashboardWidgets !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            Object.values(dashboardTypesData).forEach((item) => {
                dashboards.push({
                    "DashboardID"       : Number(item.DashboardID),
                    "DashboardName"     : item.DashboardTitle,
                    "DashboardWidgets"  : dashboardWidgets
                })
            })
        }


        /**
         * SRA and Remediation Tracker Widget Data : Start
         */
        if(SRAData.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
            risksData               = [];
            Object.values(SRAData).forEach(ass =>{
                //SRA List Data
                SRAAssessments.push({
                    "SiteRiskAssessmentID"          : ass.SiteRiskAssessmentID,
                    "AssessmentName"                : ass.AssessmentName,
                    "AssessmentCode"                : ass.AssessmentCode,
                    "SiteID"                        : ass.SiteID,
                    "ShortCode"                     : ass.ShortCode,
                    "SiteName"                      : ass.SiteName,
                    "StartDate"                     : ass.StartDate,
                    "EndDate"                       : ass.EndDate,
                    "SiteRiskAssessmentStatusID"    : ass.SiteRiskAssessmentstatusID,
                    "SiteRiskAssessmentStatus"      : ass.SiteRiskAssessmentstatus
                })
                if(ass.Risks != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){ 
                    Object.values(JSON.parse(ass.Risks)).forEach(risk =>{
                        //Risks List Data
                        risksData.push(risk);
                    })

                    if(risksData.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
                        //excluding custom risks which are not published
                        // risksData = risksData.filter(ele => !(ele.IsCustomRisk && [1,2,3,4,5,6].includes(ele.StatusID)));

                        //excluding risks which are in new&draft(custom risk) status
                        risksData = risksData.filter(ele => !(ele.IsCustomRisk && [1,2].includes(ele.StatusID)));
                       
                       Object.values(risksData).forEach(risk =>{
                            if(risk.SiteRiskAssessmentID == ass.SiteRiskAssessmentID) {
                                risk["SiteID"]        = ass.SiteID;
                                risk["ShortCode"]     = ass.ShortCode;
                                risk["SiteName"]      = ass.SiteName;
                            }
                        })
                    }
                }
            })

        }

        //Finding Top 3 sites with high residual risk
        let risksWithHighResidualRisk = risksData.filter(ele => ele.OverallResidualRiskRatingID == CONSTANT_FILE_OBJ.APP_CONSTANT.THREE);
        const siteCounts = risksWithHighResidualRisk.reduce((acc, item) => {
            const { SiteID, ShortCode, SiteName } = item;
            if (acc[SiteID]) {
                acc[SiteID].HighResidualRiskCount++;
            } else {
                acc[SiteID] = {
                SiteID,
                ShortCode,
                SiteName,
                HighResidualRiskCount: 1
                };
            }
        return acc;
        }, {});          

        const sortedSites = Object.values(siteCounts).sort((a, b) => b.HighResidualRiskCount - a.HighResidualRiskCount);
        
        //Get the top 3 sites
        topSites = sortedSites.slice(0, 3);

        
        // RMT List data 
        if(RMTData.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
            RMTList = RMTData;
        }

        // BCMS Test data from response
        if (BCMSData !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && BCMSData.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
            BCMSTestList = BCMSData;
        }
        /**
         * SRA and Remediation Tracker Widget Data : End
         */


       

        /**
         * Periodic Review Widget Data : Start
         */

        // calculating number of SRAs, BCMS tests and BIA ratings based on overallStatus
        if (SRAData !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && SRAData.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
            SRAScheduledCounts = SRAData.filter((item) => Number(item.SiteRiskAssessmentstatusID) === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE).length;
            SRAInProgressCounts = SRAData.filter((item) => Number(item.SiteRiskAssessmentstatusID) === CONSTANT_FILE_OBJ.APP_CONSTANT.TWO).length;
            SRAPublishedCounts = SRAData.filter((item) => Number(item.SiteRiskAssessmentstatusID) === CONSTANT_FILE_OBJ.APP_CONSTANT.THREE).length;
            SRATotal = SRAData.length;

            SRAPeriodic = {
                "SRAScheduledCounts"    : SRAScheduledCounts,
                "SRAInProgressCounts"   : SRAInProgressCounts,
                "SRAPublishedCounts"    : SRAPublishedCounts,
                "Total"                 : (SRAScheduledCounts + SRAInProgressCounts + SRAPublishedCounts)
            }
        } else {
            SRAPeriodic = {
                "SRAScheduledCounts"    : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
                "SRAInProgressCounts"   : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
                "SRAPublishedCounts"    : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
                "Total"                 : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO
            }
        }

        if (BCMSData !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && BCMSData.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
            BCMSScheduledCounts = BCMSData.filter((item) => Number(item.TestAssessmentStatusID) === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE).length;
            BCMSInProgressCounts = BCMSData.filter((item) => Number(item.TestAssessmentStatusID) === CONSTANT_FILE_OBJ.APP_CONSTANT.TWO || Number(item.TestAssessmentStatusID) === CONSTANT_FILE_OBJ.APP_CONSTANT.THREE).length;
            BCMSPublishedCounts = BCMSData.filter((item) => Number(item.TestAssessmentStatusID) === CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR).length;
            BCMSTotal = BCMSData.length;

            BCMSPeriodic = {
                "BCMSScheduledCounts"   : BCMSScheduledCounts,
                "BCMSInProgressCounts"  : BCMSInProgressCounts,
                "BCMSPublishedCounts"   : BCMSPublishedCounts,
                "Total"                 : (BCMSPublishedCounts + BCMSInProgressCounts + BCMSScheduledCounts)
            }
        } else {
            BCMSPeriodic = {
                "BCMSScheduledCounts"   : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
                "BCMSInProgressCounts"  : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
                "BCMSPublishedCounts"   : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
                "Total"                 : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
            } 
        }

        if (BCPdata !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && BCPdata.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
            BIALowCounts = BCPdata.filter((item) => item.BIA === CONSTANT_FILE_OBJ.APP_CONSTANT.LOW).length;
            BIAMediumCounts = BCPdata.filter((item) => item.BIA === CONSTANT_FILE_OBJ.APP_CONSTANT.MEDIUM).length;
            BIAHighCounts = BCPdata.filter((item) => item.BIA === CONSTANT_FILE_OBJ.APP_CONSTANT.HIGH).length;
            BIA_TotaL = BCPdata.length;

            BCPPeriodic = {
                "BCPLowCounts"      : BIALowCounts,
                "BCPMediumCounts"   : BIAMediumCounts,
                "BCPHighCounts"     : BIAHighCounts,
                "Total"             : (BIALowCounts + BIAMediumCounts + BIAHighCounts)
            }
        } else {
            BCPPeriodic = {
                "BCPLowCounts"      : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
                "BCPMediumCounts"   : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
                "BCPHighCounts"     : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
                "Total"             : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO
            }
        }
         /**
         * Periodic Review Widget Data : End
         */


        /*
        * Criticality Distribution Widget Response : Start
        */
        if (BCPdata != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && BCPdata.length) {
            const data = BCPdata.filter(n => n.CurrentWorkFlowStatusID == 9);  
            for (let i = 0; i < data.length; i++) {
                const item = data[i];                    
                if (item.RPO) {
                    const rpo = parseInt(item.RPO);
                    if (rpo <= 4)        result.RPO_4_Hours++;
                    else if (rpo <= 24)  result.RPO_4_Hours_1_Days++;
                    else if (rpo <= 72)  result.RPO_2_3_Days++;
                    else if (rpo <= 120) result.RPO_3_5_Days++;
                    else result.RPO_5_Days++;
                    result.RPO_Total++;
                }        
                if (item.RTO) {
                    const rto = parseInt(item.RTO);
                    if (rto <= 4)        result.RTO_4_Hours++;
                    else if (rto <= 24)  result.RTO_4_Hours_1_Days++;
                    else if (rto <= 72)  result.RTO_2_3_Days++;
                    else if (rto <= 120) result.RTO_3_5_Days++;
                    else result.RTO_5_Days++;
                    result.RTO_Total++;
                }        
                if (item.MTPD) {
                    const mtpd = parseInt(item.MTPD);
                    if (mtpd <= 4)        result.MTPD_4_Hours++;
                    else if (mtpd <= 24)  result.MTPD_4_Hours_1_Days++;
                    else if (mtpd <= 72)  result.MTPD_2_3_Days++;
                    else if (mtpd <= 120) result.MTPD_3_5_Days++;
                    else result.MTPD_5_Days++;
                    result.MTPD_Total++;
                }
            }
            result.Total = result.RPO_Total + result.RTO_Total + result.MTPD_Total;   
        }
        /*
        * Criticality Distribution Widget Response : End
        */

        /*
        * BCP Coverage Widget Data from response :Start
        */
        if (businessData != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            let uniqueBusinessFunction  = []
            BCP_Coverage = {
                "BCPCovered"        : 0,
                "BCPNotCovered"     : 0,
            }   
            if (BCPdata.length) {
                uniqueBusinessFunction =   Array.from(new Set(BCPdata.map(a => a.BusinessFunctionID))).map(BusinessFunctionID => {
                    return BCPdata.find(a => a.BusinessFunctionID === BusinessFunctionID)
                })
                BCP_Coverage.BCPNotCovered  = (businessData.length - uniqueBusinessFunction.length)
                BCP_Coverage.BCPCovered     = uniqueBusinessFunction.length
            } else {
                BCP_Coverage.BCPNotCovered  = businessData.length
            }   
        }
        /*
        * BCP Coverage Widget Data from response :End
        */

        // ResultSet : Years List 
        if(yearsData.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
            financialYears = yearsData;
        }

        
        logger.log('info', 'User Id : ' + userIdFromToken + ' : DashboardBL : getFormatGlobalDashboardData : Execution end.'); 


        //Forming final resultset
        return {
            "SiteRiskAssessments"       : 
                {
                    "AssessmentsList"   : SRAAssessments,
                    "RisksList"         : risksData,
                    "Top3Sites"         : topSites
                },
            "RemediationTracker"        : {
                     "RMTList"          : RMTList,
                     "RMTModuleList"    : RMTModuleData
            },
            "DashboardsList"            : dashboards,
            "FinancialYearsList"        : financialYears,
            "BCMSTestList"              : BCMSTestList,
            "BCPCoverageList"           : [BCP_Coverage],    //BCPCoverageList,
            "PeriodicReviewList"        :
                {
                    "SRAPeriodic"       : SRAPeriodic,
                    "BCMSPeriodic"      : BCMSPeriodic,
                    "BCPPeriodic"       : BCPPeriodic
                },
            "BCPCriticalityDistribution": [result] //criticalityDistribution
        }

    } catch(error){
        logger.log('error', 'User Id : ' + userIdFromToken + ' : DashboardBL : getFormatGlobalDashboardData : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}
/**
* This is function will be used to return single instance of class.
*/
function getDashboardBLClassInstance() {
    if (DashboardBLClassInstance === CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
        DashboardBLClassInstance = new DashboardBL();
    }
    return DashboardBLClassInstance;
}

exports.getDashboardBLClassInstance = getDashboardBLClassInstance;