module.exports = {
    tags: ["KRI"],
    description:
        "Description: \n- This api is responsible for bulk uploading the KRI Metrics.",
    operationId: "bulkUploadKRIMetrics",
    security: [
        {
            bearerAuth: [],
        },
    ],
    requestBody: {
        required: true,
        content: {
            "multipart/form-data": {
                schema: {
                    type: "object",
                    properties: {
                        bulkKRIData: {
                            type: "string",
                        },
                        UploadFile: {
                            type: "string",
                            format: "binary",
                            description: ""
                        },
                        token: {
                            type: "string",
                            description: "JWT authentication token"
                        },
                        fileName: {
                            type: "string",
                            description: "KRI_Template.xlsx"
                        }
                    },
                    required: ["UploadFile", "token"]
                },
                encoding: {
                    UploadFile: {
                        contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    }
                }
            }
        }
    },
    responses: {
        200: {
            description: "File uploaded successfully.",
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
                                    validData: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                GroupName: { type: "string" },
                                                UnitName: { type: "string" },
                                                Description: { type: "string" },
                                                InherentRisk: { type: "string" },
                                                MeasurementFrequency: { type: "string" },
                                                KRIType: { type: "string" },
                                                ThresholdValue1: { type: "integer" },
                                                ThresholdValue2: { type: "integer" },
                                                ThresholdValue3: { type: "integer" },
                                                ThresholdValue4: { type: "integer" },
                                                ThresholdValue5: { type: "integer" },

                                            },
                                            example: [
                                                {
                                                    "GroupName": "Credit & Risk",
                                                    "UnitName": "Cyber Security",
                                                    "Description": "test",
                                                    "InherentRisk": null,
                                                    "MeasurementFrequency": "Monthly",
                                                    "KRIType": "People",
                                                    "ThresholdValue1": 0,
                                                    "ThresholdValue2": 20,
                                                    "ThresholdValue3": 40,
                                                    "ThresholdValue4": 60,
                                                    "ThresholdValue5": 100
                                                }
                                            ]
                                        }
                                    },
                                    invalidData: {
                                        type: "array",
                                        items: {}
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
