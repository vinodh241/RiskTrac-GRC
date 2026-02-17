const { type } = require("os");
const { format } = require("path");

module.exports = {
    tags: ["Incidents"],
    description:
        "Description: \n- This api is responsible for setting the incident review to an incident",
    operationId: "setIncidentReview",
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
                        data: {
                            type: "object",
                            properties: {
                                incidentID: {
                                    type: "string",
                                    example: "22"
                                },
                                comment: {
                                    type: "string",
                                    example: "test"
                                },
                                rca: {
                                    type: "string",
                                    example: "test"
                                },
                                recommendationData: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            description: { type: "string" },
                                            unitID: { type: "integer" },
                                            targetDate: { type: "string", format: "date-time" },
                                        },
                                        example: [
                                            {
                                                "description": "Recommendation",
                                                "unitID": 1,
                                                "targetDate": "2025-11-04T00:00:00.000Z"
                                            }
                                        ]
                                    }

                                },
                                fileIDs: {
                                    type: "string",
                                    example: "9"
                                },
                                FinancialLossComment: {
                                    type: "string",
                                    example: "comments"
                                },
                                IsFinancialLoss: {
                                    type: "string",
                                    example: "Yes"
                                },
                            },
                        },
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
                                type: 'object',
                                properties: {
                                    incidentTypesData: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                TypeID: { type: "integer" },
                                                Name: { type: "string" }
                                            },
                                            example: [
                                                {
                                                    TypeID: 1,
                                                    Name: "Operational Risk Fraud: Internal or External"
                                                },
                                            ]
                                        }
                                    },
                                    impactedUnitsData: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                UnitID: { type: "integer" },
                                                Name: { type: "string" },
                                                LossValue: { type: "integer" }
                                            },
                                            example: [
                                                {
                                                    "UnitID": 1,
                                                    "Name": "Cyber Security",
                                                    "LossValue": 100
                                                },
                                            ]
                                        }
                                    },
                                    incidentWorkflowActionData: {
                                        type: "array",
                                        items: {}
                                    },
                                    auditTrail: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                CreatedDate: {
                                                    "type": "string", "format": "date-time",
                                                },
                                                Code: {
                                                    type: "string",
                                                },
                                                Action: {
                                                    type: "Closed"
                                                },
                                                FullName: {
                                                    type: "string"
                                                },
                                                Comment: {
                                                    type: "string"
                                                }
                                            },
                                            example: [
                                                {
                                                    "CreatedDate": "2025-10-31T15:39:12.610Z",
                                                    "Code": "INC-25-018",
                                                    "Action": "Submitted by Checker",
                                                    "FullName": "MD  Faz",
                                                    "Comment": "submitted to reviewer"
                                                },
                                                {
                                                    "CreatedDate": "2025-10-31T15:36:31.587Z",
                                                    "Code": "INC-25-018",
                                                    "Action": "Submitted by Reportee",
                                                    "FullName": "Test SE Two",
                                                    "Comment": "submitted to checker\n"
                                                }
                                            ],
                                        },
                                    },
                                    recommendations: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                RecommendationID: { type: "integer" },
                                                IncidentID: { type: "integer" },
                                                RecommendationCode: { type: "string" },
                                                Description: { type: "string" },
                                                UnitID: { type: "integer" },
                                                UnitName: { type: "string" },
                                                TargetDate: { type: "string", format: "date-time" },
                                                IsApproved: { type: "boolean" },
                                                StatusID: { type: "integer" },
                                                StatusCode: { type: "integer" },
                                                StatusName: { type: "string" },
                                                Action: { type: "string" },
                                                LessonLearnt: { type: "string" },
                                                Reportee: { type: "boolean" }
                                            },
                                            example:
                                                [
                                                    {
                                                        "RecommendationID": "23",
                                                        "IncidentID": "22",
                                                        "RecommendationCode": "INC-25-018-R1",
                                                        "Description": "Recommendation",
                                                        "UnitID": 1,
                                                        "UnitName": "Cyber Security",
                                                        "TargetDate": "2025-11-04T00:00:00.000Z",
                                                        "IsApproved": null,
                                                        "StatusID": 1,
                                                        "StatusCode": 1,
                                                        "StatusName": "Open",
                                                        "Action": null,
                                                        "LessonLearnt": null,
                                                        "Reportee": false
                                                    }
                                                ]

                                        }
                                    },
                                    incidentEvidences: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                EvidenceID: { type: "string" },
                                                IncidentID: { type: "string" },
                                                OriginalFileName: { type: "string" },
                                                FileType: { type: "string" },
                                                Remark: { type: "string" },
                                            },
                                            example: [
                                                {
                                                    "EvidenceID": "23",
                                                    "IncidentID": "22",
                                                    "OriginalFileName": "Swagger UI integration in API module documentation.docx",
                                                    "FileType": "docx",
                                                    "Remark": "remarks"
                                                }
                                            ]
                                        }
                                    },
                                    rcaEvidences: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                EvidenceID: { type: "string" },
                                                IncidentID: { type: "string" },
                                                OriginalFileName: { type: "string" },
                                                FileType: { type: "string" },
                                                Remark: { type: "string" },
                                            },
                                            example: [
                                                {
                                                    "EvidenceID": "9",
                                                    "IncidentID": "22",
                                                    "OriginalFileName": "SE-RiskTrac API Documentation.docx",
                                                    "FileType": "docx",
                                                    "Remark": "remarks"
                                                }
                                            ]
                                        }
                                    },
                                    recommendationEvidences: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                        }
                                    },
                                    riskLossCategory: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                RiskLossCategoryID: { type: "integer" },
                                                Name: { type: "string" }
                                            },
                                            example: [
                                                {
                                                    "RiskLossCategoryID": 1,
                                                    "Name": "Internal Fraud"
                                                },
                                            ]
                                        }
                                    },
                                    EmailDetails: {
                                        type: "object",
                                        properties: {
                                        },
                                    },
                                    FinancialEmailDetails: {
                                        type: "object",
                                        example: {}
                                    },
                                    incidentData: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                IncidentCode: { type: "string" },
                                                IncidentID: { type: "integer" },
                                                IncidentTitle: { type: "string" },
                                                GroupID: { type: "integer" },
                                                GroupName: { type: "string" },
                                                UnitID: { type: "integer" },
                                                UnitName: { type: "string" },
                                                UserGUID: { type: "string" },
                                                LocationName: { type: "string" },
                                                LocationTypeID: { type: "integer" },
                                                IncidentTeam: { type: "string" },
                                                IdentificationDate: { type: "string", format: "date-time" },
                                                IncidentDate: { type: "string", format: "date-time" },
                                                MobileNumber: { type: "string" },
                                                EmailID: { type: "string" },
                                                Description: { type: "string" },
                                                Recommendation: { type: "string" },
                                                Action: { type: "string" },
                                                MakerRCA: { type: "string" },
                                                IncidentSourceID: { type: "integer" },
                                                DirectLoss: { type: "number" },
                                                IndirectLoss: { type: "number" },
                                                Recoveries: { type: "number" },
                                                LossAmount: { type: "number" },
                                                AggPartyDetails: { type: "string" },
                                                CriticalityID: { type: "integer" },
                                                CriticalityName: { type: "string" },
                                                StatusID: { type: "integer" },
                                                StatusName: { type: "string" },
                                                StatusCode: { type: "integer" },
                                                WorkflowActionBy: { type: "string" },
                                                RiskApproverUserName: { type: "string", nullable: true },
                                                RiskApprovalDate: { type: "string", nullable: true },
                                                RiskClosureUserName: { type: "string", nullable: true },
                                                Comment: { type: "string" },
                                                RCA: { type: "string" },
                                                IsApproved: { type: "boolean" },
                                                IsReviewed: { type: "boolean" },
                                                ReportingDate: { type: "string", format: "date-time" },
                                                Reportee: { type: "boolean" },
                                                Reviewer: { type: "boolean" },
                                                Approver: { type: "boolean" },
                                                Checker: { type: "boolean" },
                                                IsFinancialLoss: { type: "string" },
                                                FinancialLossComment: { type: "string" },
                                                ReporterName: { type: "string" },
                                                IsReporteeAndChecker: { type: "boolean" },
                                                IsReportedByChecker: { type: "boolean" }
                                            },
                                            example: [
                                                {
                                                    "IncidentCode": "INC-25-018",
                                                    "IncidentID": "22",
                                                    "IncidentTitle": "INC-23-01031",
                                                    "GroupID": 1,
                                                    "GroupName": "Credit & Risk",
                                                    "UnitID": 1,
                                                    "UnitName": "Cyber Security",
                                                    "UserGUID": "B4A0CDE4-F4D7-EF11-9472-000C29318C88",
                                                    "LocationName": "Corporate Head Office",
                                                    "LocationTypeID": 1,
                                                    "IncidentTeam": "Cyber Security",
                                                    "IdentificationDate": "2025-10-31T00:00:00.000Z",
                                                    "IncidentDate": "2025-10-31T00:00:00.000Z",
                                                    "MobileNumber": "9865231410",
                                                    "EmailID": "sudarshan.kokku@secureyes.net",
                                                    "Description": "test",
                                                    "Recommendation": "test",
                                                    "Action": "test",
                                                    "MakerRCA": "test",
                                                    "IncidentSourceID": 1,
                                                    "DirectLoss": 100,
                                                    "IndirectLoss": 82,
                                                    "Recoveries": 52,
                                                    "LossAmount": 130,
                                                    "AggPartyDetails": "test",
                                                    "CriticalityID": 2,
                                                    "CriticalityName": "Medium",
                                                    "StatusID": 2,
                                                    "StatusName": "Submitted by Checker",
                                                    "StatusCode": 2,
                                                    "WorkflowActionBy": "Reviewer",
                                                    "RiskApproverUserName": null,
                                                    "RiskApprovalDate": null,
                                                    "RiskClosureUserName": null,
                                                    "Comment": "comments",
                                                    "RCA": "test",
                                                    "IsApproved": null,
                                                    "IsReviewed": null,
                                                    "ReportingDate": "2025-10-31T15:35:54.490Z",
                                                    "Reportee": false,
                                                    "Reviewer": true,
                                                    "Approver": false,
                                                    "Checker": false,
                                                    "IsFinancialLoss": "Yes",
                                                    "FinancialLossComment": "comments",
                                                    "ReporterName": "Test SE Two",
                                                    "IsReporteeAndChecker": false,
                                                    "IsReportedByChecker": false
                                                }
                                            ]
                                        }
                                    },
                                    incidentWorkflowActionCheckerData: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                NextWorkflowAction: { type: "string" },
                                                NextWorkflowActionBy: { type: "string" },
                                                NextStatusCode: { type: "integer", nullable: true }
                                            },
                                            example: [
                                                {
                                                    "NextWorkflowAction": "Reject Review",
                                                    "NextWorkflowActionBy": "Reviewer",
                                                    "NextStatusCode": 3
                                                },
                                                {
                                                    "NextWorkflowAction": "Submit to Approver",
                                                    "NextWorkflowActionBy": "Reviewer",
                                                    "NextStatusCode": 4
                                                }
                                            ]
                                        }
                                    },
                                    groups: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                GroupID: { type: "integer" },
                                                Name: { type: "string" }
                                            },
                                            example: [
                                                {
                                                    "GroupID": 1,
                                                    "Name": "Credit & Risk"
                                                },
                                                {
                                                    "GroupID": 2,
                                                    "Name": "Operations & Shared Services"
                                                },
                                                {
                                                    "GroupID": 3,
                                                    "Name": "Legal and Governance"
                                                },
                                                {
                                                    "GroupID": 4,
                                                    "Name": "Finance & Accounting"
                                                },
                                                {
                                                    "GroupID": 5,
                                                    "Name": "Strategy & Marketing"
                                                },
                                                {
                                                    "GroupID": 6,
                                                    "Name": "HR & Admin"
                                                },
                                                {
                                                    "GroupID": 7,
                                                    "Name": "Retail Group"
                                                },
                                                {
                                                    "GroupID": 8,
                                                    "Name": "Corporate Group"
                                                },
                                                {
                                                    "GroupID": 9,
                                                    "Name": "Internal Audit"
                                                },
                                                {
                                                    "GroupID": 1001,
                                                    "Name": "Finance"
                                                },
                                                {
                                                    "GroupID": 1002,
                                                    "Name": "Compliance & AML"
                                                },
                                                {
                                                    "GroupID": 1003,
                                                    "Name": "Retail"
                                                },
                                                {
                                                    "GroupID": 1004,
                                                    "Name": "Corporate"
                                                },
                                                {
                                                    "GroupID": 1005,
                                                    "Name": "Strategy and Marketing"
                                                },
                                                {
                                                    "GroupID": 1006,
                                                    "Name": "Source Unit"
                                                },
                                                {
                                                    "GroupID": 1007,
                                                    "Name": "Digital Group"
                                                },
                                                {
                                                    "GroupID": 1008,
                                                    "Name": "Compliance."
                                                },
                                                {
                                                    "GroupID": 1009,
                                                    "Name": "Management"
                                                }
                                            ]
                                        }
                                    },
                                    units: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                UnitID: { type: "integer" },
                                                GroupID: { type: "integer" },
                                                Name: { type: "string" }
                                            },
                                            example: [
                                                {
                                                    "UnitID": 1,
                                                    "GroupID": 1,
                                                    "Name": "Cyber Security"
                                                },
                                                {
                                                    "UnitID": 2,
                                                    "GroupID": 1,
                                                    "Name": "Retail Credit"
                                                },
                                                {
                                                    "UnitID": 3,
                                                    "GroupID": 1,
                                                    "Name": "Corporate Credit"
                                                },
                                                {
                                                    "UnitID": 4,
                                                    "GroupID": 1,
                                                    "Name": "Collections"
                                                },
                                                {
                                                    "UnitID": 5,
                                                    "GroupID": 1,
                                                    "Name": "Risk Management"
                                                },
                                                {
                                                    "UnitID": 6,
                                                    "GroupID": 2,
                                                    "Name": "Information Technology"
                                                },
                                                {
                                                    "UnitID": 7,
                                                    "GroupID": 2,
                                                    "Name": "Credit Administration & Control"
                                                },
                                                {
                                                    "UnitID": 8,
                                                    "GroupID": 2,
                                                    "Name": "Operations"
                                                },
                                                {
                                                    "UnitID": 9,
                                                    "GroupID": 2,
                                                    "Name": "Customer Care"
                                                },
                                                {
                                                    "UnitID": 10,
                                                    "GroupID": 3,
                                                    "Name": "Compliance"
                                                },
                                                {
                                                    "UnitID": 11,
                                                    "GroupID": 3,
                                                    "Name": "Governance"
                                                },
                                                {
                                                    "UnitID": 12,
                                                    "GroupID": 3,
                                                    "Name": "Legal"
                                                },
                                                {
                                                    "UnitID": 13,
                                                    "GroupID": 4,
                                                    "Name": "Accounting & Tax"
                                                },
                                                {
                                                    "UnitID": 14,
                                                    "GroupID": 4,
                                                    "Name": "Financial Reporting"
                                                },
                                                {
                                                    "UnitID": 15,
                                                    "GroupID": 4,
                                                    "Name": "Treasury"
                                                },
                                                {
                                                    "UnitID": 16,
                                                    "GroupID": 5,
                                                    "Name": "Business Development & Marketing"
                                                },
                                                {
                                                    "UnitID": 17,
                                                    "GroupID": 5,
                                                    "Name": "Strategy"
                                                },
                                                {
                                                    "UnitID": 18,
                                                    "GroupID": 6,
                                                    "Name": "Human Resources"
                                                },
                                                {
                                                    "UnitID": 19,
                                                    "GroupID": 6,
                                                    "Name": "Administration and Procurement"
                                                },
                                                {
                                                    "UnitID": 20,
                                                    "GroupID": 7,
                                                    "Name": "Retail Group"
                                                },
                                                {
                                                    "UnitID": 21,
                                                    "GroupID": 8,
                                                    "Name": "Corporate Group"
                                                },
                                                {
                                                    "UnitID": 22,
                                                    "GroupID": 9,
                                                    "Name": "Internal Audit"
                                                },
                                                {
                                                    "UnitID": 23,
                                                    "GroupID": 1,
                                                    "Name": "Remedial"
                                                },
                                                {
                                                    "UnitID": 24,
                                                    "GroupID": 1,
                                                    "Name": "Credit-ALCO"
                                                },
                                                {
                                                    "UnitID": 25,
                                                    "GroupID": 1,
                                                    "Name": "Credit"
                                                },
                                                {
                                                    "UnitID": 26,
                                                    "GroupID": 1,
                                                    "Name": "Credit-ECL"
                                                },
                                                {
                                                    "UnitID": 27,
                                                    "GroupID": 1,
                                                    "Name": "Credit-Prudential Returns"
                                                },
                                                {
                                                    "UnitID": 28,
                                                    "GroupID": 1003,
                                                    "Name": "Retail Business"
                                                },
                                                {
                                                    "UnitID": 29,
                                                    "GroupID": 1004,
                                                    "Name": "Corporate Business"
                                                },
                                                {
                                                    "UnitID": 30,
                                                    "GroupID": 1001,
                                                    "Name": "Financial Accounting"
                                                },
                                                {
                                                    "UnitID": 31,
                                                    "GroupID": 1001,
                                                    "Name": "Financial Reporting & Planning"
                                                },
                                                {
                                                    "UnitID": 32,
                                                    "GroupID": 1002,
                                                    "Name": "Compliance & AML"
                                                },
                                                {
                                                    "UnitID": 33,
                                                    "GroupID": 1005,
                                                    "Name": "Business Process Management"
                                                },
                                                {
                                                    "UnitID": 34,
                                                    "GroupID": 1005,
                                                    "Name": "Marketing"
                                                },
                                                {
                                                    "UnitID": 35,
                                                    "GroupID": 1005,
                                                    "Name": "Product Development"
                                                },
                                                {
                                                    "UnitID": 36,
                                                    "GroupID": 1006,
                                                    "Name": "Source Unit"
                                                },
                                                {
                                                    "UnitID": 37,
                                                    "GroupID": 1,
                                                    "Name": "BCM"
                                                },
                                                {
                                                    "UnitID": 38,
                                                    "GroupID": 2,
                                                    "Name": "Internal Control"
                                                },
                                                {
                                                    "UnitID": 39,
                                                    "GroupID": 2,
                                                    "Name": "Data Management"
                                                },
                                                {
                                                    "UnitID": 40,
                                                    "GroupID": 1007,
                                                    "Name": "Digital Group"
                                                },
                                                {
                                                    "UnitID": 41,
                                                    "GroupID": 1,
                                                    "Name": "SAM"
                                                },
                                                {
                                                    "UnitID": 42,
                                                    "GroupID": 2,
                                                    "Name": "Collections."
                                                },
                                                {
                                                    "UnitID": 43,
                                                    "GroupID": 1008,
                                                    "Name": "Compliance."
                                                },
                                                {
                                                    "UnitID": 44,
                                                    "GroupID": 1009,
                                                    "Name": "Management"
                                                }
                                            ]
                                        }
                                    },
                                    locationTypes: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                LocationTypeID: { type: "integer" },
                                                Name: { type: "string" }
                                            },
                                            example: [
                                                {
                                                    LocationTypeID: 1,
                                                    Name: "Corporate Head Office"
                                                },
                                                {
                                                    "LocationTypeID": 2,
                                                    "Name": "Branch"
                                                },
                                            ]
                                        }
                                    },
                                    incidentTypes: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                TypeID: { type: "integer" },
                                                Name: { type: "string" }
                                            },
                                            example:
                                                [
                                                    {
                                                        TypeID: 1,
                                                        Name: "Operational Risk Fraud: Internal or External"
                                                    },
                                                    {
                                                        "TypeID": 2,
                                                        "Name": "Operational Risk: other category"
                                                    },
                                                    {
                                                        "TypeID": 3,
                                                        "Name": "Near Miss or Potential Loss"
                                                    },
                                                    {
                                                        "TypeID": 4,
                                                        "Name": "Revenue Leakage"
                                                    },
                                                    {
                                                        "TypeID": 5,
                                                        "Name": "Legal"
                                                    },
                                                    {
                                                        "TypeID": 7,
                                                        "Name": "Regression Type"
                                                    }
                                                ]
                                        }
                                    },
                                    incidentSources: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                SourceID: { type: "integer" },
                                                Name: { type: "string" }
                                            },
                                            example: [
                                                {
                                                    SourceID: 1,
                                                    Name: "Internal Department finding"
                                                },
                                                {
                                                    "SourceID": 2,
                                                    "Name": "Other department analysis"
                                                },
                                                {
                                                    "SourceID": 3,
                                                    "Name": "Customer Complaint"
                                                },
                                                {
                                                    "SourceID": 4,
                                                    "Name": "Audit"
                                                },
                                                {
                                                    "SourceID": 5,
                                                    "Name": "Source- Regression"
                                                },
                                                {
                                                    "SourceID": 6,
                                                    "Name": "tEST SOURCE"
                                                }
                                            ]
                                        }
                                    },
                                    incidentCriticalities: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                CriticalityID: { type: "integer" },
                                                Name: { type: "string" }
                                            },
                                            example: [
                                                {
                                                    CriticalityID: 1,
                                                    Name: "High"
                                                },
                                                {
                                                    "CriticalityID": 2,
                                                    "Name": "Medium"
                                                },
                                                {
                                                    "CriticalityID": 3,
                                                    "Name": "Low"
                                                },
                                                {
                                                    "CriticalityID": 4,
                                                    "Name": "regreession- Criticality"
                                                },
                                            ]
                                        }
                                    },
                                    lossCategories: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                CategoryID: { type: "integer" },
                                                Name: { type: "string" }
                                            },
                                            example: [
                                                {
                                                    CategoryID: 1,
                                                    Name: "Internal Fraud"
                                                },
                                                {
                                                    "CategoryID": 2,
                                                    "Name": "External Fraud"
                                                },
                                                {
                                                    "CategoryID": 3,
                                                    "Name": "Execution, Delivery and Process Managemen"
                                                },
                                                {
                                                    "CategoryID": 4,
                                                    "Name": "Damage to Physical Assets"
                                                },
                                                {
                                                    "CategoryID": 5,
                                                    "Name": "Business Disruption and System Failures"
                                                },
                                                {
                                                    "CategoryID": 6,
                                                    "Name": "Clients, Products and Business Practices"
                                                },
                                                {
                                                    "CategoryID": 7,
                                                    "Name": "Employment Practices and Workplace Safety"
                                                },
                                                {
                                                    "CategoryID": 8,
                                                    "Name": " New Risk Loss Event Category"
                                                },
                                                {
                                                    "CategoryID": 9,
                                                    "Name": "Regression Operational Risk Loss Event Category"
                                                }
                                            ]
                                        }
                                    },
                                    users: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                UserGUID: { type: "string" },
                                                FullName: { type: "string" }
                                            },
                                            example: [
                                                {
                                                    UserGUID: "DDC5E857-67C1-EF11-9452-000C29318C88",
                                                    FullName: "BodaSESecurEyes"
                                                },
                                                {
                                                    "UserGUID": "9BDBD7E6-C9C1-EF11-9453-000C29318C88",
                                                    "FullName": "SajidSEStandard User"
                                                },
                                                {
                                                    "UserGUID": "CF37782C-CBC1-EF11-9453-000C29318C88",
                                                    "FullName": "GRCSEUser One"
                                                },
                                                {
                                                    "UserGUID": "CC841E18-CDC1-EF11-9453-000C29318C88",
                                                    "FullName": "GRCSEOne"
                                                },
                                                {
                                                    "UserGUID": "020B7E1E-CFC1-EF11-9453-000C29318C88",
                                                    "FullName": "SuperSEuser"
                                                },
                                                {
                                                    "UserGUID": "F8BE567B-CFC1-EF11-9453-000C29318C88",
                                                    "FullName": "userSEtest A"
                                                },
                                                {
                                                    "UserGUID": "D0AA5AB7-CFC1-EF11-9453-000C29318C88",
                                                    "FullName": "GRCSETwo"
                                                },
                                                {
                                                    "UserGUID": "3313187D-DAC1-EF11-9453-000C29318C88",
                                                    "FullName": "GRCSEThree"
                                                },
                                                {
                                                    "UserGUID": "DF220D15-DCC1-EF11-9453-000C29318C88",
                                                    "FullName": "SangramBCM SEBhuyan"
                                                },
                                                {
                                                    "UserGUID": "82FDD5BA-DCC1-EF11-9453-000C29318C88",
                                                    "FullName": "AmrutanshuSEsahoo"
                                                },
                                                {
                                                    "UserGUID": "CC4378E8-DCC1-EF11-9453-000C29318C88",
                                                    "FullName": "SinchanaSEUserOne"
                                                },
                                                {
                                                    "UserGUID": "44C6040B-E6C1-EF11-9453-000C29318C88",
                                                    "FullName": "AnsumanSEChakra"
                                                },
                                                {
                                                    "UserGUID": "45666691-E9C1-EF11-9453-000C29318C88",
                                                    "FullName": "NiranjanSESrichandan"
                                                },
                                                {
                                                    "UserGUID": "0DD648A7-EBC1-EF11-9453-000C29318C88",
                                                    "FullName": "BhubananandaSETripathy"
                                                },
                                                {
                                                    "UserGUID": "F0B89B7B-F2C1-EF11-9453-000C29318C88",
                                                    "FullName": "AnupamSEDash"
                                                },
                                                {
                                                    "UserGUID": "0D5A7A37-F5C1-EF11-9453-000C29318C88",
                                                    "FullName": "GRCUserfour"
                                                },
                                                {
                                                    "UserGUID": "CD4D7095-09C2-EF11-9453-000C29318C88",
                                                    "FullName": "GRCUserFive"
                                                },
                                                {
                                                    "UserGUID": "C368CD4D-75C3-EF11-9456-000C29318C88",
                                                    "FullName": "GRCUserSix"
                                                },
                                                {
                                                    "UserGUID": "9BC3ABFB-83C3-EF11-9456-000C29318C88",
                                                    "FullName": "GRCAdminPro"
                                                },
                                                {
                                                    "UserGUID": "4D9F2ABD-C1C3-EF11-9456-000C29318C88",
                                                    "FullName": "BodaSESecurEyes"
                                                },
                                                {
                                                    "UserGUID": "4E9F2ABD-C1C3-EF11-9456-000C29318C88",
                                                    "FullName": "AdminUserSESecureEyes"
                                                },
                                                {
                                                    "UserGUID": "57FE9C83-1BC4-EF11-9457-000C29318C88",
                                                    "FullName": "SajidSECommitte User"
                                                },
                                                {
                                                    "UserGUID": "1FB66BF3-27C4-EF11-9457-000C29318C88",
                                                    "FullName": "VandanaSEUser Seven"
                                                },
                                                {
                                                    "UserGUID": "04E0804C-40C4-EF11-9457-000C29318C88",
                                                    "FullName": "TestSELarge"
                                                },
                                                {
                                                    "UserGUID": "CD4EC9F9-2FC5-EF11-9458-000C29318C88",
                                                    "FullName": "steering committeeSEGRCUser Eight"
                                                },
                                                {
                                                    "UserGUID": "ABD9467E-74C6-EF11-945A-000C29318C88",
                                                    "FullName": "VandanaSEGRC NIne"
                                                },
                                                {
                                                    "UserGUID": "D79512E0-83C6-EF11-945A-000C29318C88",
                                                    "FullName": "TestSEUser"
                                                },
                                                {
                                                    "UserGUID": "4E11C34C-84C6-EF11-945A-000C29318C88",
                                                    "FullName": "TestSEUser"
                                                },
                                                {
                                                    "UserGUID": "D4E91ED1-9FC6-EF11-945A-000C29318C88",
                                                    "FullName": "VandanaSEUser Ten"
                                                },
                                                {
                                                    "UserGUID": "2A75C708-A3C6-EF11-945A-000C29318C88",
                                                    "FullName": "TestSEUser"
                                                },
                                                {
                                                    "UserGUID": "40FC21C0-BAC6-EF11-945A-000C29318C88",
                                                    "FullName": "VandanaSEUser eleven"
                                                },
                                                {
                                                    "UserGUID": "6B88CAF1-35C7-EF11-945B-000C29318C88",
                                                    "FullName": "TestSEUser"
                                                },
                                                {
                                                    "UserGUID": "786A7E27-37C7-EF11-945B-000C29318C88",
                                                    "FullName": "SecureyesSEUser One"
                                                },
                                                {
                                                    "UserGUID": "35893ED8-45C7-EF11-945B-000C29318C88",
                                                    "FullName": "SecureyesSEUser two"
                                                },
                                                {
                                                    "UserGUID": "25D37174-5CC7-EF11-945B-000C29318C88",
                                                    "FullName": "SteeringSECommittee"
                                                },
                                                {
                                                    "UserGUID": "E973EA37-65C7-EF11-945B-000C29318C88",
                                                    "FullName": "vandana SEK"
                                                },
                                                {
                                                    "UserGUID": "44ED0A95-BCC9-EF11-9460-000C29318C88",
                                                    "FullName": "Test SEAuditor"
                                                },
                                                {
                                                    "UserGUID": "FC3BD0F9-6FCE-EF11-9466-000C29318C88",
                                                    "FullName": "DebadattaSEJena"
                                                },
                                                {
                                                    "UserGUID": "ECDE8389-40CF-EF11-9467-000C29318C88",
                                                    "FullName": "Vandana SEGRC three"
                                                },
                                                {
                                                    "UserGUID": "266D3692-DFD7-EF11-9472-000C29318C88",
                                                    "FullName": "RMSEOne"
                                                },
                                                {
                                                    "UserGUID": "DB9FC826-F3D7-EF11-9472-000C29318C88",
                                                    "FullName": "testSEone"
                                                },
                                                {
                                                    "UserGUID": "B4A0CDE4-F4D7-EF11-9472-000C29318C88",
                                                    "FullName": "TestSETwo"
                                                },
                                                {
                                                    "UserGUID": "FFB01397-A1D8-EF11-9473-000C29318C88",
                                                    "FullName": "auditorSEuser"
                                                },
                                                {
                                                    "UserGUID": "13A3F9B0-A2D8-EF11-9473-000C29318C88",
                                                    "FullName": "SinchanaSEUserTwo"
                                                },
                                                {
                                                    "UserGUID": "B1FFB063-72D9-EF11-9474-000C29318C88",
                                                    "FullName": "AmrutanshuSEOne"
                                                },
                                                {
                                                    "UserGUID": "B65D2FE8-73D9-EF11-9474-000C29318C88",
                                                    "FullName": "sinchanaSEUserThree"
                                                },
                                                {
                                                    "UserGUID": "B2AB8834-4CDA-EF11-9475-000C29318C88",
                                                    "FullName": "NandanSENandan"
                                                },
                                                {
                                                    "UserGUID": "7AD436F0-4DDA-EF11-9475-000C29318C88",
                                                    "FullName": "ShwethaASEA"
                                                },
                                                {
                                                    "UserGUID": "C946D135-81DC-EF11-9478-000C29318C88",
                                                    "FullName": "SudipSERoy"
                                                },
                                                {
                                                    "UserGUID": "F34603EB-8CDC-EF11-9478-000C29318C88",
                                                    "FullName": "TestSEThree"
                                                },
                                                {
                                                    "UserGUID": "DDE7A678-97DC-EF11-9478-000C29318C88",
                                                    "FullName": "SangramSEK"
                                                },
                                                {
                                                    "UserGUID": "DC9E8096-9EDC-EF11-9478-000C29318C88",
                                                    "FullName": "TPtracSEUserOne"
                                                },
                                                {
                                                    "UserGUID": "5AEFD598-06DE-EF11-947A-000C29318C88",
                                                    "FullName": "AnupamSEDash G"
                                                },
                                                {
                                                    "UserGUID": "0979B511-8FE3-EF11-9482-000C29318C88",
                                                    "FullName": "TPTRACSEONLY"
                                                },
                                                {
                                                    "UserGUID": "CFE7C652-90E3-EF11-9482-000C29318C88",
                                                    "FullName": "TPTRACSEONLYNew"
                                                },
                                                {
                                                    "UserGUID": "FE688F8F-BAE3-EF11-9482-000C29318C88",
                                                    "FullName": "auditorSEname"
                                                },
                                                {
                                                    "UserGUID": "FDBA2C69-6DEF-EF11-9491-000C29318C88",
                                                    "FullName": "testuser"
                                                },
                                                {
                                                    "UserGUID": "9D086976-E20A-F011-94B5-000C29318C88",
                                                    "FullName": "UserOne"
                                                },
                                                {
                                                    "UserGUID": "DC2DC289-FD8E-F011-9FC1-000C29AAA2A1",
                                                    "FullName": "MohamedFazil"
                                                },
                                                {
                                                    "UserGUID": "F8313E01-F39D-F011-9FC1-000C29AAA2A1",
                                                    "FullName": "NileshMiddleLast"
                                                }
                                            ]
                                        }
                                    },
                                    currentUserData: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                UnitIDs: { type: "array", items: { type: "integer" } },
                                                FullName: { type: "string" },
                                                EmailID: { type: "string" },
                                                MobileNumber: { type: "string" }
                                            },
                                            example: [{
                                                UnitIDs: [43, 1, 2, 3, 4, 5, 10, 11, 12, 44, 6, 16, 17],
                                                FullName: "Mohamed Fazil",
                                                EmailID: "fazil.mohamed@secureyes.net",
                                                MobileNumber: "7896541236"
                                            }]
                                        }
                                    },
                                    currencyType: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                AccountName: { type: "string" },
                                                Currency: { type: "string" }
                                            },
                                            example: [{
                                                AccountName: "SecurEyes",
                                                Currency: "INR"
                                            }]
                                        }
                                    }
                                },
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
