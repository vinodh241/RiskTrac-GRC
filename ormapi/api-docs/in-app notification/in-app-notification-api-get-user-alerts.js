module.exports = {
    tags: ["In App Notification"],
    description:
        "Description: \n- This api is responsible for getting data for the data in-app notification from DB and will display in notification widget. \n- It will give all the module data such as KRI Module, RCSA Module, Incident Module, Risk Appetite Module. \n- In response, I gave only one data(Records) form each module for example. But it will return all the data(Records) from all the module",
    operationId: "getUsersAlerts",
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
                                data: {
                                    type: "string",
                                    example: "DC2DC289-FD8E-F011-9FC1-000C29AAA2A1"
                                }
                            }
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
                                                    "RA Appetitte Framework 18092025-1 has been Approved for the unit: Internal Audit ",
                                                link: "review-risk-assessments"
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
                                                InAppMessage: "RCSA Assessment Initiated: RCSA-012link:schedule-assessments",
                                                IsRead: false,
                                                IsInAppNotification: true,
                                                TotalCount: "187",
                                                UnReadCount: "187",
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
                                                InAppMessage: "Incident Closure: INC-25-016 link:incident-list",
                                                IsRead: false,
                                                IsInAppNotification: true,
                                                TotalCount: "187",
                                                UnReadCount: "187",
                                                SubModuleID: 3,
                                                message: "Incident Closure: INC-25-016 ",
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
                                                AlertID: "17122",
                                                AlertDate: "2025-10-15T17:46:40.977Z",
                                                ToUserGUID: "DC2DC289-FD8E-F011-9FC1-000C29AAA2A1",
                                                InAppMessage:
                                                    "KRI has been reviewed for your department: Information Technology, Approved KRIs - (KRI-IT-001, KRI-IT-003, KRI-IT-005), Rejected KRIs - (KRI-IT-002, KRI-IT-004)link:kri-measurement-review",
                                                IsRead: false,
                                                IsInAppNotification: true,
                                                TotalCount: "187",
                                                UnReadCount: "187",
                                                SubModuleID: 4,
                                                message:
                                                    "KRI has been reviewed for your department: Information Technology, Approved KRIs - (KRI-IT-001, KRI-IT-003, KRI-IT-005), Rejected KRIs - (KRI-IT-002, KRI-IT-004)",
                                                link: "kri-measurement-review"
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
