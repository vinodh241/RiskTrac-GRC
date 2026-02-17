// Dashboard API imports
const getDashboardIncident = require("./dashboard/dashboard-api-get-dashboard-incident");
const getDashboardKRI = require("./dashboard/dashboard-api-get-dashboard-kri");
const getDashboardRiskAppetite = require("./dashboard/dashboard-api-get-dashboard-risk-appetite");
const getDashboardRCSA = require("./dashboard/dashboard-api-get-dashboard-rcsa");
const getOverallDashboard = require("./dashboard/dashboard-api-get-overall-dashboard");

// In-App Notification API imports
const getUsersAlerts = require("./in-app notification/in-app-notification-api-get-user-alerts");

//Incidents API imports
const getIncidentMasterData = require("./incidents/incidents-api-get-incident-master-data");
const setIncidentMasterData = require("./incidents/incidents-api-set-incident-master-data");
const getIncidents = require("./incidents/incidents-api-get-incidents");
const getIncident = require("./incidents/incidents-api-get-incident");
const setIncident = require("./incidents/incidents-api-set-incident");
const getIncidentInfo = require("./incidents/incidents-api-get-incident-info");
const uploadRCAEvidence = require("./incidents/incidents-api-upload-rca-evidence");
const downloadRCAEvidence = require("./incidents/incidents-api-download-rca-evidence");
const uploadRecommendationEvidence = require("./incidents/incidents-api-upload-recommendation-evidence");
const downloadRecommendationEvidence = require("./incidents/incidents-api-download-recommendation-evidence");
const uploadIncidentEvidence = require("./incidents/incidents-api-upload-incident-evidence");
const downloadIncidentEvidence = require("./incidents/incidents-api-download-incident-evidence");
const deleteIncidentEvidence = require("./incidents/incidents-api-delete-incident-evidence");
const setRecommendationAction = require("./incidents/incidents-api-set-recommendation-action");
const setIncidentStatus = require("./incidents/incidents-api-set-incident-status");
const setRecommendationStatus = require("./incidents/incidents-api-set-recommendation-status");
const setIncidentReview = require("./incidents/incidents-api-set-incident-review");

// KRI API imports
const setKRIMasterData = require("./KRI/kri-api-set-kri-master-data");
const getKRIMasterData = require("./KRI/kri-api-get-kri-master-data");
const getKRIDefinitions = require("./KRI/kri-api-get-kri-definitions");
const setKRIDefinition = require("./KRI/kri-api-set-kri-definitions");
const deleteKRIDefinition = require("./KRI/kri-api-delete-kri-definitions");
const getKRIMetricScoring = require("./KRI/kri-api-get-kri-metrics-scoring");
const setKRIMetricScoring = require("./KRI/kri-api-set-kri-metrics-scoring");
const setKRIMetricReport = require("./KRI/kri-api-set-kri-metrics-report");
const getKRIReport = require("./KRI/kri-api-get-kri-report");
const getKRIHistoricalReport = require("./KRI/kri-api-get-kri-historical-report");
const uploadKRIScoringEvidence = require("./KRI/kri-api-upload-KriScoring-evidence");
const downloadKRIScoringEvidence = require("./KRI/kri-api-download-KriScoring-evidence");
const sendBulkEmailRemainder = require("./KRI/kri-api-send-bulk-email-reminder");
const saveReviewReportedKRIData = require("./KRI/kri-api-save-review-reported-kri-data");
const submitKRIReview = require("./KRI/kri-api-submit-kri-review");
const getKRIReportedData = require("./KRI/kri-api-get-kri-reported-data");
const bulkUploadKRIMetrics = require("./KRI/kri-api-bulk-upload-kri-metrics");

// Reports API imports
const getReportRiskAppetite = require("./Report/report-api-get-report-risk-appetite");
const getReportIncident = require("./Report/report-api-get-report-incident");
const getReportKRI = require("./Report/report-api-get-report-kri");
const getReportRCSA = require("./Report/report-api-get-report-rcsa");

// Risk Appetite API imports
const downloadFile = require("./risk-appetite/risk-appetite-api-download-file");
const downloadRiskAppetiteTemplate = require("./risk-appetite/risk-appetite-api-download-risk-appetite-template");
const getPolicyDetails = require("./risk-appetite/risk-appetite-api-get-policy-details");
const getRiskAppetiteList = require("./risk-appetite/risk-appetite-api-get-risk-appetite-list");
const uploadRiskAppetite = require("./risk-appetite/risk-appetite-api-upload-risk-appetite");
const generateEmail = require("./risk-appetite/risk-appetite-api-generate-email");

// Risk Assessment API imports
const getInfoScheduleRiskAssessment = require("./risk-assessment/risk-assessment-api-get-info-schedule-risk-assessment");
const setRiskAssessment = require("./risk-assessment/risk-assessment-api-set-risk-assessment");
const getRiskAssessment = require("./risk-assessment/risk-assessment-api-get-risk-assessment");
const getRiskMetrics = require("./risk-assessment/risk-assessment-api-get-risk-metrics");
const getRiskMetricsMaker = require("./risk-assessment/risk-assessment-api-get-risk-metrics-maker");

// Risk Metric Levels API imports
const getRiskMetricLevel = require("./risk-metric-levels/risk-metric-levels-api-get-metric-levels");
const setRiskMetricLevel = require("./risk-metric-levels/risk-metric-levels-api-set-metric-levels");

// Risk Report API imports
const getRiskReportsSetting = require("./risk-reports/risk-reports-api-get-risk-reports-setting");
const setRiskReportsSetting = require("./risk-reports/risk-reports-api-set-risk-reports-setting");


const APP_CONFIG_FILE_OBJECT = require("../config/app-config");

var appPortNo = APP_CONFIG_FILE_OBJECT.APP_SERVER.APP_START_PORT;

const apiDocumentation = {
    openapi: "3.0.0",
    info: {
        version: "1.0.0",
        title: "ORM Module API Documentation",
        description:
            "This documentation is about the ORM API module.",
        contact: {
            name: "Mohamed Fazil",
            email: "fazil.mohamed@secureyes.net",
        },
    },
    servers: [
        {
            url: `http://localhost:${appPortNo}`,
            description: "Local Server",
        },
    ],
    tags: [
        {
            name: "Dashboard",
        },
        {
            name: "In App Notification",
        },
        {
            name: "Incidents",
        },
        {
            name: "KRI",
        },
        {
            name: "RCSA",
        },
        {
            name: "Report",
        },
        {
            name: "Risk Appetite",
        },
        {
            name: "Risk Assessment",
        },
        {
            name: "Risk Metric Levels",
        },
        {
            name: "Risk Reports",
        },

    ],
    paths: {
        // Dashboard Routes
        "/operational-risk-management/dashbaord/incident/get-dashboard-incident": {
            post: getDashboardIncident,
        },
        "/operational-risk-management/dashboard/get-dashboard-kri": {
            post: getDashboardKRI,
        },
        "/operational-risk-management/dashboard/get-dashboard-risk-appetite": {
            post: getDashboardRiskAppetite,
        },
        "/operational-risk-management/dashboard/get-dashboard-rcsa": {
            post: getDashboardRCSA,
        },
        "/operational-risk-management/dashbaord/overall/get-overall-dashboard": {
            post: getOverallDashboard,
        },

        // In App Notification Routes
        "/operational-risk-management/inApp-notification/get-user-alerts": {
            post: getUsersAlerts,
        },

        // Incidents Routed
        "/operational-risk-management/incidents/get-incident-master-data": {
            post: getIncidentMasterData
        },
        "/operational-risk-management/incidents/set-incident-master-data": {
            post: setIncidentMasterData
        },
        "/operational-risk-management/incidents/get-incidents": {
            post: getIncidents
        },
        "/operational-risk-management/incidents/get-incident-info": {
            post: getIncidentInfo
        },
        "/operational-risk-management/incidents/get-incident": {
            post: getIncident
        },
        "/operational-risk-management/incidents/set-incident": {
            post: setIncident
        },
        "/operational-risk-management/incidents/upload-incident-evidence": {
            post: uploadIncidentEvidence
        },
        "/operational-risk-management/incidents/upload-rca-evidence": {
            post: uploadRCAEvidence
        },
        "/operational-risk-management/incidents/upload-recommendation-evidence": {
            post: uploadRecommendationEvidence
        },
        "/operational-risk-management/incidents/download-incident-evidence": {
            post: downloadIncidentEvidence
        },
        "/operational-risk-management/incidents/download-rca-evidence": {
            post: downloadRCAEvidence
        },
        "/operational-risk-management/incidents/download-recommendation-evidence": {
            post: downloadRecommendationEvidence
        },
        "/operational-risk-management/incidents/set-recommendation-action": {
            post: setRecommendationAction
        },
        "/operational-risk-management/incidents/set-incident-status": {
            post: setIncidentStatus
        },
        "/operational-risk-management/incidents/set-recommendation-status": {
            post: setRecommendationStatus
        },
        "/operational-risk-management/incidents/set-incident-review": {
            post: setIncidentReview
        },
        // "/operational-risk-management/incidents/delete-incident-evidence": {
        //     post: deleteIncidentEvidence
        // },

        // KRI Routes
        "/operational-risk-management/kri/get-kri-master-data": {
            post: getKRIMasterData
        },
        "/operational-risk-management/kri/set-kri-master-data": {
            post: setKRIMasterData
        },
        "/operational-risk-management/kri/get-kri-definitions": {
            post: getKRIDefinitions
        },
        "/operational-risk-management/kri/set-kri-definition": {
            post: setKRIDefinition
        },
        "/operational-risk-management/kri/delete-kri-definition": {
            post: deleteKRIDefinition
        },
        "/operational-risk-management/kri/get-kri-metrics-scoring": {
            post: getKRIMetricScoring
        },
        "/operational-risk-management/kri/set-kri-metrics-scoring": {
            post: setKRIMetricScoring
        },
        "/operational-risk-management/kri/set-kri-metrics-report": {
            post: setKRIMetricReport
        },
        "/operational-risk-management/kri/get-kri-report": {
            post: getKRIReport
        },
        "/operational-risk-management/kri/get-kri-historical-report": {
            post: getKRIHistoricalReport
        },
        "/operational-risk-management/kri/upload-KriScoring-evidence": {
            post: uploadKRIScoringEvidence
        },
        "/operational-risk-management/kri/download-KriScoring-evidence": {
            post: downloadKRIScoringEvidence
        },
        "/operational-risk-management/kri/send-bulk-email-reminder": {
            post: sendBulkEmailRemainder
        },
        "/operational-risk-management/kri/save-review-reported-kri-data": {
            post: saveReviewReportedKRIData
        },
        "/operational-risk-management/kri/submit-kri-review": {
            post: submitKRIReview
        },
        "/operational-risk-management/kri/get-kri-reported-data": {
            post: getKRIReportedData
        },
        "/operational-risk-management/kri/bulk-upload-kri-metrics": {
            post: bulkUploadKRIMetrics
        },

        // Reports API
        "/operational-risk-management/report/get-report-risk-appetite": {
            post: getReportRiskAppetite
        },
        "/operational-risk-management/report/get-report-incident": {
            post: getReportIncident
        },
        "/operational-risk-management/report/get-report-kri": {
            post: getReportKRI
        },
        "/operational-risk-management/report/get-report-rcsa": {
            post: getReportRCSA
        },

        // Risk Appetite
        "/operational-risk-management/risk-appetite/download-file": {
            post: downloadFile
        },
        "/operational-risk-management/risk-appetite/get-policy-details": {
            post: getPolicyDetails
        },
        "/operational-risk-management/risk-appetite/get-risk-appetite-list": {
            post: getRiskAppetiteList
        },
        "/operational-risk-management/risk-appetite/upload-risk-appetite": {
            post: uploadRiskAppetite
        },

        // Risk Assessment
        "/operational-risk-management/risk-assessment/get-info-schedule-risk-assessment": {
            post: getInfoScheduleRiskAssessment
        },
        "/operational-risk-management/risk-assessment/set-risk-assessment": {
            post: setRiskAssessment
        },
        "/operational-risk-management/risk-assessment/get-risk-assessments": {
            post: getRiskAssessment
        },
        "/operational-risk-management/risk-assessment/get-risk-metrics": {
            post: getRiskMetrics
        },
        "/operational-risk-management/risk-assessment/get-risk-metrics-maker": {
            post: getRiskMetricsMaker
        },

        // Risk Metric Levels
        "/operational-risk-management/risk-metric-levels/get-risk-metric-levels": {
            post: getRiskMetricLevel,
        },
        "/operational-risk-management/risk-metric-levels/set-risk-metric-levels": {
            post: setRiskMetricLevel,
        },

        // Risk Report 
        "/operational-risk-management/risk-reports/get-risk-reports-setting": {
            post: getRiskReportsSetting,
        },
        "/operational-risk-management/risk-reports/set-risk-reports-setting": {
            post: setRiskReportsSetting,
        },
    },
};

exports.apiDocumentation = apiDocumentation;
