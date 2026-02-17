module.exports = {
    tags: ["Risk Reports"],
    description:
        "Description: \n- This api is responsible for getting the risk report setting from DB.",
    operationId: "getRiskReportsSetting",
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
                                    reportSettingsData: {
                                        type: "array",
                                    },
                                    riskMetricData: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                RiskMetricLevelID: { type: "integer" },
                                                FWID: { type: "integer" },
                                                IncRiskMetricLevelidentTitle: { type: "integer" },
                                                RiskMetricZone: { type: "string" },
                                                ColorCode: { type: "string", format: "date-time" },
                                                DefaultColorCode: { type: "string" },
                                                Name: { type: "string" },
                                                Description: { type: "integer" },
                                                CreatedDate: { type: "string", format: "date-time" },
                                            },
                                            example: [
                                                {
                                                    "RiskMetricLevelID": 121,
                                                    "FWID": 38,
                                                    "RiskMetricLevel": 1,
                                                    "RiskMetricZone": "Green Zone",
                                                    "ColorCode": "#61ff89",
                                                    "DefaultColorCode": "#008000",
                                                    "Name": "Low Risk Level",
                                                    "Description": "Low Risk Level",
                                                    "CreatedDate": "2025-11-05T11:58:32.957Z"
                                                },
                                                {
                                                    "RiskMetricLevelID": 122,
                                                    "FWID": 38,
                                                    "RiskMetricLevel": 2,
                                                    "RiskMetricZone": "Yellow Zone",
                                                    "ColorCode": "#fcec00",
                                                    "DefaultColorCode": "#FFFF00",
                                                    "Name": "Moderate Risk Level",
                                                    "Description": "Moderate Risk Level",
                                                    "CreatedDate": "2025-11-05T11:58:32.957Z"
                                                },
                                                {
                                                    "RiskMetricLevelID": 123,
                                                    "FWID": 38,
                                                    "RiskMetricLevel": 3,
                                                    "RiskMetricZone": "Red Zone",
                                                    "ColorCode": "#ff0000",
                                                    "DefaultColorCode": "#FF0000",
                                                    "Name": "Critical Risk Level",
                                                    "Description": "Critical Risk Level",
                                                    "CreatedDate": "2025-11-05T11:58:32.957Z"
                                                }
                                            ]
                                        },
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
