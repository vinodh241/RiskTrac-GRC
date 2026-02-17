module.exports = {
    tags: ["Incidents"],
    description:
        "Description: \n- This api is responsible for uploading the RCA evidence on the DB.",
    operationId: "uploadRCAEvidence",
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
                        UploadFile: {
                            type: "string",
                            format: "binary",
                            description: "Upload Word document (.docx)"
                        },
                        token: {
                            type: "string",
                            description: "JWT authentication token"
                        },
                        remarks: {
                            type: "string",
                            description: "Additional remarks"
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
                                    fileData: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                EvidenceID: { type: "integer" },
                                                OriginalFileName: { type: "string" },
                                                Remark: { type: "string" },
                                            },
                                            example: [
                                                {
                                                    "EvidenceID": "7",
                                                    "OriginalFileName": "SE-RiskTrac API Documentation.docx",
                                                    "Remark": "remarks"
                                                }
                                            ]
                                        }
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
