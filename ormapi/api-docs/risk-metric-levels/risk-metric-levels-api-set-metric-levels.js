module.exports = {
    tags: ["Risk Metric Levels"],
    description:
        "Description: \n- This api is responsible for getting the overall data from DB and show it in dashboard. \n- It will give all the module data such as KRI Module, RCSA Module, Incident Module, Risk Appetite Module. \n- In response, I gave only one data(Records) form each module for example. But it will return all the data(Records) from all the module",
    operationId: "setUsersAlerts",
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
                        riskMetricData: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    riskMetricLevelId: {
                                        type: "integer"
                                    },
                                    colorCode: {
                                        type: "string",
                                    }
                                },
                                example: [
                                    {

                                        "riskMetricLevelId": 118,
                                        "colorCode": "#61ff89"
                                    },
                                    {
                                        "riskMetricLevelId": 119,
                                        "colorCode": "#fcec00"
                                    },
                                    {
                                        "riskMetricLevelId": 120,
                                        "colorCode": "#ff0000"
                                    }
                                ],
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
                                type: "object",
                                properties: {
                                    riskMetricData: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                RiskMetricLevelID: { type: "integer" },
                                                FWID: { type: "integer" },
                                                RiskMetricLevel: { type: "integer" },
                                                RiskMetricZone: { type: "string" },
                                                ColorCode: { type: "string" },
                                                DefaultColorCode: { type: "string" },
                                                Name: { type: "string" },
                                                Description: { type: "string" },
                                                CreatedDate: { type: "string", format: "date-time" }
                                            },
                                            example: [
                                                {
                                                    RiskMetricLevelID: 118,
                                                    FWID: 37,
                                                    RiskMetricLevel: 1,
                                                    RiskMetricZone: "Green Zone",
                                                    ColorCode: "#61ff89",
                                                    DefaultColorCode: "#008000",
                                                    Name: "Low Risk Level",
                                                    Description: "Low Risk Level",
                                                    CreatedDate: "2025-09-18T16:14:10.763Z"
                                                },
                                                {
                                                    "RiskMetricLevelID": 119,
                                                    "FWID": 37,
                                                    "RiskMetricLevel": 2,
                                                    "RiskMetricZone": "Yellow Zone",
                                                    "ColorCode": "#fcec00",
                                                    "DefaultColorCode": "#FFFF00",
                                                    "Name": "Moderate Risk Level",
                                                    "Description": "Moderate Risk Level",
                                                    "CreatedDate": "2025-09-18T16:14:10.763Z"
                                                },
                                                {
                                                    "RiskMetricLevelID": 120,
                                                    "FWID": 37,
                                                    "RiskMetricLevel": 3,
                                                    "RiskMetricZone": "Red Zone",
                                                    "ColorCode": "#ff0000",
                                                    "DefaultColorCode": "#FF0000",
                                                    "Name": "Critical Risk Level",
                                                    "Description": "Critical Risk Level",
                                                    "CreatedDate": "2025-09-18T16:14:10.763Z"
                                                }
                                            ],
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
