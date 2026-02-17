const { type } = require("os");
const { format } = require("path");

module.exports = {
    tags: ["Risk Assessment"],
    description:
        "Description: \n- This api is responsible for getting risk metrics.",
    operationId: "getRiskMetrics",
    security: [
        {
            bearerAuth: [],
        },
    ],
    requestBody: {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        token: {
                            type: "string",
                            example: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJEQzJEQzI4OS1GRDhFLUYwMTEtOUZDMS0wMDBDMjlBQUEyQTEiLCJ1c2VyTmFtZSI6IkZhemlsTUYiLCJpYXQiOjE3NjA0MzUzOTgsImFjY291bnROYW1lIjoiU0UwMiIsImV4cCI6MTc2MDQ0MjYwM30.K2PyNieSk_8lTIKKf47UGqZkFLefxgEr6KErb06mD5w"
                        },
                    },
                },
            },
        },
    },
    responses: {
        200: {
            description: "Data fetch from DB successful.",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            success: {
                                type: "integer",
                                description: "Success indicator (1 for success, 0 for failure)",
                                example: 1,
                            },
                            message: {
                                type: "string",
                                description: "Response message",
                                example: "Data fetch from DB successful.",
                            },
                            result: {
                                type: "object",
                                properties: {
                                    frameworkData: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                CollectionScheduleID: { type: "string" },
                                                Name: { type: "string" },
                                                StartDate: { type: "string", format: "date-time" },
                                                EndDate: { type: "string", format: "date-time" },
                                                RemainingDays: { type: "integer" },
                                                UnitID: { type: "integer" }
                                            }
                                        },
                                        example: [
                                            {
                                                CollectionScheduleID: "32",
                                                Name: "RA Appetitte Framework 05102025-1",
                                                StartDate: "2025-11-05T00:00:00.000Z",
                                                EndDate: "2025-11-30T00:00:00.000Z",
                                                RemainingDays: 24,
                                                UnitID: 1
                                            }
                                        ]
                                    },

                                    previousScoringHeader: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                Caption: { type: "string" },
                                                year: { type: "string" },
                                                Quarter: { type: "string" }
                                            }
                                        },
                                        example: [
                                            { Caption: "Q1-25", year: "2025", Quarter: "1" },
                                            { Caption: "Q2-25", year: "2025", Quarter: "2" },
                                            { Caption: "Q3-25", year: "2025", Quarter: "3" }
                                        ]
                                    },

                                    riskMetricData: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                Risk: { type: "string" },
                                                NodeID: { type: "string" },
                                                CaptionData: { type: "string" },
                                                Limit1: { type: "string" },
                                                Limit2: { type: "string" },
                                                Limit3: { type: "string" },
                                                MetricScore: { type: ["number", "null"] },
                                                Remarks: { type: ["string", "null"] },
                                                ActionPlan: { type: ["string", "null"] },
                                                UnitID: { type: "integer" },
                                                UnitName: { type: "string" },
                                                Status: { type: "integer" },
                                                StatusName: { type: "string" },
                                                IsReviewer: { type: "integer" },
                                                IsMaker: { type: "integer" },
                                                MeasurmentTypeID: { type: "integer" },
                                                MeasurmentType: { type: "string" },
                                                IsReviewed: { type: ["boolean", "null"] },
                                                RiskMetricLevelID: { type: ["integer", "null"] },
                                                RiskMetricLevel: { type: ["integer", "null"] },
                                                ColorCode: { type: ["string", "null"] },
                                                CommentData: { type: ["string", "null"] },
                                                evidences: { type: "array", items: { type: "object" } },
                                                reminderDate: { type: "string", format: "date-time" },
                                                PreviousScoring: { type: "array", items: { type: "object" } }
                                            }
                                        },
                                        example: [
                                            {
                                                Risk: "Type of Taxpayer",
                                                NodeID: "344",
                                                CaptionData: "Salaried individuals, established nonprofits, or large corporations with clear accountability.",
                                                Limit1: "=1",
                                                Limit2: "=2",
                                                Limit3: "=3",
                                                MetricScore: null,
                                                Remarks: null,
                                                ActionPlan: null,
                                                UnitID: 22,
                                                UnitName: "Internal Audit",
                                                Status: 1,
                                                StatusName: "Not Started",
                                                IsReviewer: 1,
                                                IsMaker: 0,
                                                MeasurmentTypeID: 1,
                                                MeasurmentType: "Decimal",
                                                IsReviewed: null,
                                                RiskMetricLevelID: null,
                                                RiskMetricLevel: null,
                                                ColorCode: null,
                                                CommentData: null,
                                                evidences: [],
                                                reminderDate: "2025-11-19T00:00:00.000Z",
                                                PreviousScoring: []
                                            },
                                            {
                                                "Risk": "Type of Taxpayer",
                                                "NodeID": "345",
                                                "CaptionData": "Small businesses or partnerships with moderate complexity.",
                                                "Limit1": "=1",
                                                "Limit2": "=2",
                                                "Limit3": "=3",
                                                "MetricScore": null,
                                                "Remarks": null,
                                                "ActionPlan": null,
                                                "UnitID": 22,
                                                "UnitName": "Internal Audit",
                                                "Status": 1,
                                                "StatusName": "Not Started",
                                                "IsReviewer": 1,
                                                "IsMaker": 0,
                                                "MeasurmentTypeID": 1,
                                                "MeasurmentType": "Decimal",
                                                "IsReviewed": null,
                                                "RiskMetricLevelID": null,
                                                "RiskMetricLevel": null,
                                                "ColorCode": null,
                                                "CommentData": null,
                                                "evidences": [],
                                                "reminderDate": "2025-11-19T00:00:00.000Z",
                                                "PreviousScoring": []
                                            },
                                            {
                                                "Risk": "Type of Taxpayer",
                                                "NodeID": "346",
                                                "CaptionData": "Sole proprietors or informal entities with limited transparency.",
                                                "Limit1": "=1",
                                                "Limit2": "=2",
                                                "Limit3": "=3",
                                                "MetricScore": null,
                                                "Remarks": null,
                                                "ActionPlan": null,
                                                "UnitID": 22,
                                                "UnitName": "Internal Audit",
                                                "Status": 1,
                                                "StatusName": "Not Started",
                                                "IsReviewer": 1,
                                                "IsMaker": 0,
                                                "MeasurmentTypeID": 1,
                                                "MeasurmentType": "Decimal",
                                                "IsReviewed": null,
                                                "RiskMetricLevelID": null,
                                                "RiskMetricLevel": null,
                                                "ColorCode": null,
                                                "CommentData": null,
                                                "evidences": [],
                                                "reminderDate": "2025-11-19T00:00:00.000Z",
                                                "PreviousScoring": []
                                            },
                                            {
                                                "Risk": "Demographic Information",
                                                "NodeID": "348",
                                                "CaptionData": "Stable age and occupation profile (e.g., salaried professionals or retirees with predictable income).",
                                                "Limit1": "=1",
                                                "Limit2": "=2",
                                                "Limit3": "=3",
                                                "MetricScore": null,
                                                "Remarks": null,
                                                "ActionPlan": null,
                                                "UnitID": 22,
                                                "UnitName": "Internal Audit",
                                                "Status": 1,
                                                "StatusName": "Not Started",
                                                "IsReviewer": 1,
                                                "IsMaker": 0,
                                                "MeasurmentTypeID": 1,
                                                "MeasurmentType": "Decimal",
                                                "IsReviewed": null,
                                                "RiskMetricLevelID": null,
                                                "RiskMetricLevel": null,
                                                "ColorCode": null,
                                                "CommentData": null,
                                                "evidences": [],
                                                "reminderDate": "2025-11-19T00:00:00.000Z",
                                                "PreviousScoring": []
                                            },
                                            {
                                                "Risk": "Demographic Information",
                                                "NodeID": "349",
                                                "CaptionData": "Young or mid-career professionals with variable or mixed sources of income.",
                                                "Limit1": "=1",
                                                "Limit2": "=2",
                                                "Limit3": "=3",
                                                "MetricScore": null,
                                                "Remarks": null,
                                                "ActionPlan": null,
                                                "UnitID": 22,
                                                "UnitName": "Internal Audit",
                                                "Status": 1,
                                                "StatusName": "Not Started",
                                                "IsReviewer": 1,
                                                "IsMaker": 0,
                                                "MeasurmentTypeID": 1,
                                                "MeasurmentType": "Decimal",
                                                "IsReviewed": null,
                                                "RiskMetricLevelID": null,
                                                "RiskMetricLevel": null,
                                                "ColorCode": null,
                                                "CommentData": null,
                                                "evidences": [],
                                                "reminderDate": "2025-11-19T00:00:00.000Z",
                                                "PreviousScoring": []
                                            },
                                            {
                                                "Risk": "Demographic Information",
                                                "NodeID": "350",
                                                "CaptionData": "Taxpayers engaged in occupations or age groups prone to tax evasion.",
                                                "Limit1": "=1",
                                                "Limit2": "=2",
                                                "Limit3": "=3",
                                                "MetricScore": null,
                                                "Remarks": null,
                                                "ActionPlan": null,
                                                "UnitID": 22,
                                                "UnitName": "Internal Audit",
                                                "Status": 1,
                                                "StatusName": "Not Started",
                                                "IsReviewer": 1,
                                                "IsMaker": 0,
                                                "MeasurmentTypeID": 1,
                                                "MeasurmentType": "Decimal",
                                                "IsReviewed": null,
                                                "RiskMetricLevelID": null,
                                                "RiskMetricLevel": null,
                                                "ColorCode": null,
                                                "CommentData": null,
                                                "evidences": [],
                                                "reminderDate": "2025-11-19T00:00:00.000Z",
                                                "PreviousScoring": []
                                            }
                                        ]
                                    },

                                    riskReportData: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                T0: { type: "boolean" },
                                                T1: { type: "boolean" },
                                                T2: { type: "boolean" },
                                                RiskMetricLevelID: { type: "integer" },
                                                RiskMetricLevel: { type: "integer" },
                                                IsEscalationMandatory: { type: "boolean" },
                                                IsActionMandatory: { type: "boolean" },
                                                ReportingStructureID: { type: "integer" }
                                            }
                                        },
                                        example: [
                                            {
                                                T0: true,
                                                T1: true,
                                                T2: true,
                                                RiskMetricLevelID: 121,
                                                RiskMetricLevel: 1,
                                                IsEscalationMandatory: false,
                                                IsActionMandatory: true,
                                                ReportingStructureID: 26
                                            }
                                        ]
                                    },

                                    riskMetricLevelsData: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                RiskMetricLevelID: { type: "integer" },
                                                FWID: { type: "integer" },
                                                RiskMetricLevel: { type: "integer" },
                                                ColorCode: { type: "string" },
                                                Name: { type: "string" },
                                                Description: { type: "string" },
                                                IsUsedForReWeightage: { type: "boolean" },
                                                IsActive: { type: "boolean" },
                                                IsDeleted: { type: "boolean" },
                                                CreatedDate: { type: "string", format: "date-time" },
                                                CreatedBy: { type: "string" },
                                                LastUpdatedDate: { type: "string", format: "date-time" },
                                                LastUpdatedBy: { type: "string" },
                                                DefaultColorCode: { type: "string" }
                                            }
                                        },
                                        example: [
                                            {
                                                RiskMetricLevelID: 121,
                                                FWID: 38,
                                                RiskMetricLevel: 1,
                                                ColorCode: "#61ff89",
                                                Name: "Low Risk Level",
                                                Description: "Low Risk Level",
                                                IsUsedForReWeightage: true,
                                                IsActive: true,
                                                IsDeleted: false,
                                                CreatedDate: "2025-11-05T11:58:32.957Z",
                                                CreatedBy: "FazilMF-UploadRAFrameworkFromExcel",
                                                LastUpdatedDate: "2025-11-05T11:58:32.957Z",
                                                LastUpdatedBy: "FazilMF-UploadRAFrameworkFromExcel",
                                                DefaultColorCode: "#008000"
                                            },
                                            {
                                                "RiskMetricLevelID": 122,
                                                "FWID": 38,
                                                "RiskMetricLevel": 2,
                                                "ColorCode": "#fcec00",
                                                "Name": "Moderate Risk Level",
                                                "Description": "Moderate Risk Level",
                                                "IsUsedForReWeightage": true,
                                                "IsActive": true,
                                                "IsDeleted": false,
                                                "CreatedDate": "2025-11-05T11:58:32.957Z",
                                                "CreatedBy": "FazilMF-UploadRAFrameworkFromExcel",
                                                "LastUpdatedDate": "2025-11-05T11:58:32.957Z",
                                                "LastUpdatedBy": "FazilMF-UploadRAFrameworkFromExcel",
                                                "DefaultColorCode": "#FFFF00"
                                            },
                                            {
                                                "RiskMetricLevelID": 123,
                                                "FWID": 38,
                                                "RiskMetricLevel": 3,
                                                "ColorCode": "#ff0000",
                                                "Name": "Critical Risk Level",
                                                "Description": "Critical Risk Level",
                                                "IsUsedForReWeightage": true,
                                                "IsActive": true,
                                                "IsDeleted": false,
                                                "CreatedDate": "2025-11-05T11:58:32.957Z",
                                                "CreatedBy": "FazilMF-UploadRAFrameworkFromExcel",
                                                "LastUpdatedDate": "2025-11-05T11:58:32.957Z",
                                                "LastUpdatedBy": "FazilMF-UploadRAFrameworkFromExcel",
                                                "DefaultColorCode": "#FF0000"
                                            }
                                        ]
                                    }
                                }
                            },

                            token: {
                                type: "string",
                                description: "JWT authentication token",
                                example: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJEQzJEQzI4OS1GRDhFLUYwMTEtOUZDMS0wMDBDMjlBQUEyQTEiLCJ1c2VyTmFtZSI6IkZhemlsTUYiLCJpYXQiOjE3NjA0MzUzOTgsImFjY291bnROYW1lIjoiU0UwMiIsImV4cCI6MTc2MDQ0MjYwM30.K2PyNieSk_8lTIKKf47UGqZkFLefxgEr6KErb06mD5w",
                            },
                            error: {
                                type: "object",
                                properties: {
                                    errorCode: {
                                        type: "string",
                                        nullable: true,
                                        description: "Error code",
                                        example: null,
                                    },
                                    errorMessage: {
                                        type: "string",
                                        nullable: true,
                                        description: "Error message",
                                        example: null,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        400: {
            description: "Bad Request",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            message: { type: "string", example: "Bad Request" },
                        },
                    },
                },
            },
        },
        500: {
            description: "Internal Server Error",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            message: { type: "string", example: "Internal server error" },
                        },
                    },
                },
            },
        },
    },
};
