module.exports = {
    tags: ["Incidents"],
    description:
        "Description: \n- This api is responsible for getting all incident data from DB.",
    operationId: "getIncidents",
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
                                    RAInApp: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                AlertID: { type: "string" },
                                                AlertDate: { type: "string", format: "date-time" },
                                                ToUserGUID: { type: "string" },
                                                InAppMessage: { type: "string" },
                                                IsRead: { type: "boolean" },
                                                IsInAppNotification: { type: "boolean" },
                                                TotalCount: { type: "string" },
                                                UnReadCount: { type: "string" },
                                                SubModuleID: { type: "integer" },
                                                message: { type: "string" },
                                                link: { type: "string" }
                                            },
                                            example: {
                                                AlertID: "12330",
                                                AlertDate: "2025-09-18T17:54:01.580Z",
                                                ToUserGUID: "DC2DC289-FD8E-F011-9FC1-000C29AAA2A1",
                                                InAppMessage:
                                                    "RA Appetitte Framework 18092025-1 has been Approved for the unit: Internal Audit link:review-risk-assessments",
                                                IsRead: false,
                                                IsInAppNotification: true,
                                                TotalCount: "187",
                                                UnReadCount: "187",
                                                SubModuleID: 1,
                                                message:
                                                    "RA Appetitte Framework 18092025-1 has been Approved for the unit: Internal Audit",
                                                link: "review-risk-assessments"
                                            }
                                        }
                                    },

                                    incidents: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                IncidentID: { type: "string" },
                                                IncidentCode: { type: "string" },
                                                IncidentTitle: { type: "string" },
                                                UnitID: { type: "integer" },
                                                UnitName: { type: "string" },
                                                ReportingDate: { type: "string", format: "date-time" },
                                                IncidentDate: { type: "string", format: "date-time" },
                                                IncidentTypeData: {
                                                    type: "array",
                                                    items: {
                                                        type: "object",
                                                        properties: {
                                                            IncidentTypeLNID: { type: "integer" },
                                                            IncidentTypeID: { type: "integer" },
                                                            Name: { type: "string" }
                                                        }
                                                    }
                                                },
                                                CriticalityID: { type: "integer" },
                                                CriticalityName: { type: "string" },
                                                MakerRCA: { type: "string" },
                                                StatusID: { type: "integer" },
                                                StatusName: { type: "string" },
                                                NoOfRecommendation: { type: "integer" },
                                                Open: { type: "integer" },
                                                ClaimClosed: { type: "integer" },
                                                Closed: { type: "integer" }
                                            },
                                            example: {
                                                IncidentID: "20",
                                                IncidentCode: "INC-25-016",
                                                IncidentTitle: "inc-25-011",
                                                UnitID: 1,
                                                UnitName: "Cyber Security",
                                                ReportingDate: "2025-09-22T12:10:28.900Z",
                                                IncidentDate: "2025-09-22T00:00:00.000Z",
                                                IncidentTypeData: [
                                                    {
                                                        IncidentTypeLNID: 35,
                                                        IncidentTypeID: 1,
                                                        Name: "Operational Risk Fraud: Internal or External"
                                                    }
                                                ],
                                                CriticalityID: 2,
                                                CriticalityName: "Medium",
                                                MakerRCA: "testing",
                                                StatusID: 10,
                                                StatusName: "Closed",
                                                NoOfRecommendation: 1,
                                                Open: 0,
                                                ClaimClosed: 0,
                                                Closed: 1
                                            }
                                        }
                                    },

                                    RCSAInApp: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                AlertID: { type: "string" },
                                                AlertDate: { type: "string", format: "date-time" },
                                                ToUserGUID: { type: "string" },
                                                InAppMessage: { type: "string" },
                                                IsRead: { type: "boolean" },
                                                IsInAppNotification: { type: "boolean" },
                                                TotalCount: { type: "string" },
                                                UnReadCount: { type: "string" },
                                                SubModuleID: { type: "integer" },
                                                message: { type: "string" },
                                                link: { type: "string" }
                                            },
                                            example: {
                                                AlertID: "12613",
                                                AlertDate: "2025-09-22T15:49:22.750Z",
                                                ToUserGUID: "DC2DC289-FD8E-F011-9FC1-000C29AAA2A1",
                                                InAppMessage:
                                                    "RCSA Assessment Initiated: RCSA-012link:schedule-assessments",
                                                IsRead: false,
                                                IsInAppNotification: true,
                                                TotalCount: "188",
                                                UnReadCount: "188",
                                                SubModuleID: 2,
                                                message: "RCSA Assessment Initiated: RCSA-012",
                                                link: "schedule-assessments"
                                            }
                                        }
                                    },

                                    INCInApp: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                AlertID: { type: "string" },
                                                AlertDate: { type: "string", format: "date-time" },
                                                ToUserGUID: { type: "string" },
                                                InAppMessage: { type: "string" },
                                                IsRead: { type: "boolean" },
                                                IsInAppNotification: { type: "boolean" },
                                                TotalCount: { type: "string" },
                                                UnReadCount: { type: "string" },
                                                SubModuleID: { type: "integer" },
                                                message: { type: "string" },
                                                link: { type: "string" }
                                            },
                                            example: {
                                                AlertID: "12595",
                                                AlertDate: "2025-09-22T12:25:26.510Z",
                                                ToUserGUID: "DC2DC289-FD8E-F011-9FC1-000C29AAA2A1",
                                                InAppMessage:
                                                    "Incident Closure: INC-25-016 link:incident-list",
                                                IsRead: false,
                                                IsInAppNotification: true,
                                                TotalCount: "188",
                                                UnReadCount: "188",
                                                SubModuleID: 3,
                                                message: "Incident Closure: INC-25-016",
                                                link: "incident-list"
                                            }
                                        }
                                    },

                                    KRIInApp: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                AlertID: { type: "string" },
                                                AlertDate: { type: "string", format: "date-time" },
                                                ToUserGUID: { type: "string" },
                                                InAppMessage: { type: "string" },
                                                IsRead: { type: "boolean" },
                                                IsInAppNotification: { type: "boolean" },
                                                TotalCount: { type: "string" },
                                                UnReadCount: { type: "string" },
                                                SubModuleID: { type: "integer" },
                                                message: { type: "string" },
                                                link: { type: "string" }
                                            },
                                            example: {
                                                AlertID: "17228",
                                                AlertDate: "2025-10-16T14:56:13.893Z",
                                                ToUserGUID: "DC2DC289-FD8E-F011-9FC1-000C29AAA2A1",
                                                InAppMessage:
                                                    "KRI - (undefined) has been submitted for Review.link:kri-measurement-mykri",
                                                IsRead: false,
                                                IsInAppNotification: true,
                                                TotalCount: "188",
                                                UnReadCount: "188",
                                                SubModuleID: 4,
                                                message: "KRI - (undefined) has been submitted for Review.",
                                                link: "kri-measurement-mykri"
                                            }
                                        }
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
