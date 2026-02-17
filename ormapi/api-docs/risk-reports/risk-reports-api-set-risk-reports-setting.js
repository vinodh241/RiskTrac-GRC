module.exports = {
    tags: ["Risk Reports"],
    description:
        "Description: \n- This api is responsible for setting the risk report setting from DB.",
    operationId: "setRiskReportsSetting",
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
                            type: "array",
                            items: {
                                properties: {
                                    T0: { type: "boolean" },
                                    T1: { type: "boolean" },
                                    T2: { type: "boolean" },
                                    RiskMetricLevelID: { type: "integer" },
                                    RiskMetricLevel: { type: "integer" },
                                    RiskMetricLevelName: { type: "string" },
                                    IsEscalationMandatory: { type: "boolean" },
                                    Escalation: { type: "string" },
                                    IsActionMandatory: { type: "boolean" },
                                    Action: { type: "boolean" },
                                },
                                example: [
                                    {
                                        "T0": true,
                                        "T1": true,
                                        "T2": true,
                                        "RiskMetricLevelID": 121,
                                        "RiskMetricLevel": 1,
                                        "RiskMetricLevelName": "Green Zone",
                                        "IsEscalationMandatory": false,
                                        "Escalation": "Escalation",
                                        "IsActionMandatory": true,
                                        "Action": "Action"
                                    },
                                ],
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
                                example: "Added successfully.",
                            },
                            result: {
                                type: "object",
                                properties: {
                                    reportSettingsData: {
                                        type: "array",
                                        items: {
                                            properties: {
                                                T0: { type: "boolean" },
                                                T1: { type: "boolean" },
                                                T2: { type: "boolean" },
                                                RiskMetricLevelID: { type: "integer" },
                                                RiskMetricLevel: { type: "integer" },
                                                IsEscalationMandatory: { type: "boolean" },
                                                Escalation: { type: "string" },
                                                IsActionMandatory: { type: "boolean" },
                                                Action: { type: "boolean" },
                                            },
                                            example: [
                                                {
                                                    "T0": true,
                                                    "T1": true,
                                                    "T2": true,
                                                    "RiskMetricLevelID": 121,
                                                    "RiskMetricLevel": 1,
                                                    "RiskMetricLevelName": "Green Zone",
                                                    "IsEscalationMandatory": false,
                                                    "Escalation": "Escalation",
                                                    "IsActionMandatory": true,
                                                    "Action": "Action"
                                                },
                                            ],
                                        }
                                    },
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
