module.exports = {
    tags: ["Incidents"],
    description:
        "Description: \n- This api is responsible for downloading the recommendation file data from DB.",
    operationId: "downloadRecommendationEvidence",
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
                                evidenceID: {
                                    type: "string",
                                    example: "12"
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
                                    fileData: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                originalFileName: {
                                                    type: "string"
                                                },
                                                FileType: {
                                                    type: "string"
                                                },
                                                FileContent: {
                                                    type: "object",
                                                    properties: {
                                                        type: {
                                                            type: "string",
                                                            data: {
                                                                type: "array",
                                                                items: {
                                                                    type: "integer"
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            },
                                            example: [
                                                {
                                                    "OriginalFileName": "Swagger UI integration in API module documentation.docx",
                                                    "FileType": "docx",
                                                    "FileContent": {
                                                        "type": "Buffer",
                                                        "data": [
                                                            80,
                                                            75,
                                                            3,
                                                            4,
                                                            20,
                                                            0,
                                                            0,
                                                            0,
                                                            0,
                                                            0,
                                                            0,
                                                            0,
                                                            0,
                                                            0,
                                                            164,
                                                            1,
                                                            132,
                                                            184,
                                                            181,
                                                            2,
                                                            0,
                                                            0,
                                                            181,
                                                            2,
                                                            0,
                                                            0,
                                                            26,
                                                            0,
                                                            0,
                                                            0,
                                                            120,
                                                            108,
                                                            47,
                                                            95,
                                                            114,
                                                            101,
                                                            108,
                                                            115,
                                                            47,
                                                            119,
                                                            111,
                                                            114,
                                                            107,
                                                            98,
                                                            111,
                                                            111,
                                                            107,
                                                            46,
                                                            120,
                                                            109,
                                                            108,
                                                            46,
                                                            114,
                                                            101,
                                                            108,
                                                            115,
                                                            60,
                                                            63,
                                                            120,
                                                            109,
                                                            108,
                                                            32,
                                                            118,
                                                            101,
                                                            114,
                                                            115,
                                                            105,
                                                            111,
                                                            110,
                                                            61,
                                                            34,
                                                            49,
                                                            46,
                                                            48,
                                                            34,
                                                            32,
                                                            101,
                                                            110,
                                                            99,
                                                            111,
                                                            100,
                                                            105,
                                                            110,
                                                            103,
                                                            61,
                                                            34,
                                                            85,
                                                            84,
                                                            70,
                                                            45,
                                                            56,
                                                            34,
                                                            32,
                                                            115,
                                                            116,
                                                            97,
                                                            110,
                                                            100,
                                                            97,
                                                            108,
                                                            111,
                                                            110,
                                                            101,
                                                            61,
                                                            34,
                                                            121,
                                                            101,
                                                            115,
                                                            34,
                                                            63,
                                                            62,
                                                            13,
                                                            10,
                                                            60,
                                                            82,
                                                            101,
                                                            108,
                                                            97,
                                                            116,
                                                            105,
                                                            111,
                                                            110,
                                                            115,
                                                            104,
                                                            105,
                                                            112,
                                                            115,
                                                            32,
                                                            120,
                                                            109,
                                                            108,
                                                            110,
                                                            115,
                                                            61,
                                                            34,
                                                            104,
                                                            116,
                                                            116,
                                                            112,
                                                            58,
                                                            47,
                                                            47,
                                                            115,
                                                            99,
                                                            104,
                                                            101,
                                                            109,
                                                            97,
                                                            115,
                                                            46,
                                                            111,
                                                            112,
                                                            101,
                                                            110,
                                                            120,
                                                            109,
                                                            108,
                                                            102,
                                                            111,
                                                            114,
                                                            109,
                                                            97,
                                                            116,
                                                            115,
                                                            46,
                                                            111,
                                                            114,
                                                            103,
                                                            47,
                                                            112,
                                                            97,
                                                            99,
                                                            107,
                                                            97,
                                                            103,
                                                            101,
                                                            47,
                                                            50,
                                                            48,
                                                            48,
                                                            54,
                                                            47,
                                                            114,
                                                            101,
                                                            108,
                                                            97,
                                                        ]
                                                    }
                                                }
                                            ]
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
