module.exports = {
    tags: ["Risk Appetite"],
    description:
        "Description: \n- This api is responsible for getting the policy details from DB.",
    operationId: "getPolicyDetails",
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
                                fwid: {
                                    type: "string",
                                    example: "37"
                                },
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
                                    colors: {
                                        type: "object",
                                        properties: {
                                            low: { type: "string", example: "#61ff89" },
                                            moderate: { type: "string", example: "#fcec00" },
                                            high: { type: "string", example: "#ff0000" },
                                        },
                                    },
                                    cols: {
                                        type: "object",
                                        properties: {
                                            col1: { type: "string", example: "Risk" },
                                            col2: { type: "string", example: "Risk Metric" },
                                        }
                                    },
                                    data: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                col1: { type: "string" },
                                                col2: { type: "string" },
                                                Units: { type: "integer" },
                                                UnitName: { type: "string" },
                                                MeasurmentTypeID: { type: "integer" },
                                                Low: { type: "string" },
                                                Moderate: { type: "string" },
                                                High: { type: "string" },
                                            },
                                            example: [
                                                {
                                                    "col1": "Type of Taxpayer",
                                                    "col2": "Salaried individuals, established nonprofits, or large corporations with clear accountability.",
                                                    "Units": 22,
                                                    "UnitName": "Internal Audit",
                                                    "MeasurmentTypeID": 1,
                                                    "Low": "=1",
                                                    "Moderate": "=2",
                                                    "High": "=3"
                                                },
                                                {
                                                    "col1": "Type of Taxpayer",
                                                    "col2": "Small businesses or partnerships with moderate complexity.",
                                                    "Units": 22,
                                                    "UnitName": "Internal Audit",
                                                    "MeasurmentTypeID": 1,
                                                    "Low": "=1",
                                                    "Moderate": "=2",
                                                    "High": "=3"
                                                },
                                                {
                                                    "col1": "Type of Taxpayer",
                                                    "col2": "Sole proprietors or informal entities with limited transparency.",
                                                    "Units": 22,
                                                    "UnitName": "Internal Audit",
                                                    "MeasurmentTypeID": 1,
                                                    "Low": "=1",
                                                    "Moderate": "=2",
                                                    "High": "=3"
                                                },
                                                {
                                                    "col1": "Demographic Information",
                                                    "col2": "Stable age and occupation profile (e.g., salaried professionals or retirees with predictable income).",
                                                    "Units": 22,
                                                    "UnitName": "Internal Audit",
                                                    "MeasurmentTypeID": 1,
                                                    "Low": "=1",
                                                    "Moderate": "=2",
                                                    "High": "=3"
                                                },
                                                {
                                                    "col1": "Demographic Information",
                                                    "col2": "Young or mid-career professionals with variable or mixed sources of income.",
                                                    "Units": 22,
                                                    "UnitName": "Internal Audit",
                                                    "MeasurmentTypeID": 1,
                                                    "Low": "=1",
                                                    "Moderate": "=2",
                                                    "High": "=3"
                                                },
                                                {
                                                    "col1": "Demographic Information",
                                                    "col2": "Taxpayers engaged in occupations or age groups prone to tax evasion.",
                                                    "Units": 22,
                                                    "UnitName": "Internal Audit",
                                                    "MeasurmentTypeID": 1,
                                                    "Low": "=1",
                                                    "Moderate": "=2",
                                                    "High": "=3"
                                                },
                                            ],
                                        },
                                    },
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
