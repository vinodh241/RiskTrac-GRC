module.exports = {
    tags: ["User Management"],
    description:
        "Description: \n- This api is responsible for enabling and disabling the users from application.",
    operationId: "enableDisableUser",
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
                        userMaster: {
                            type: "object",
                            properties: {
                                UserGUID: {
                                    type: "string",
                                    description: "",
                                    example: "DC2DC289-FD8E-F011-9FC1-000C29AAA2A1"
                                },
                                isEnabled: {
                                    type: "boolean",
                                    description: "",
                                    example: false
                                },
                            },
                        },
                        token: {
                            type: "string",
                            description: "",
                            example: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiI0RTlGMkFCRC1DMUMzLUVGMTEtOTQ1Ni0wMDBDMjkzMThDODgiLCJ1c2VyTmFtZSI6Ik9wc1NlY3VyRXllczAxQFNlY3VyZXllc2Rldi5jb20iLCJpYXQiOjE3NTkxNDgyNzMsImFjY291bnROYW1lIjoiU0UwMiIsImV4cCI6MTc1OTE1NTQ3N30._QfjOqp478j740TGxhx5uWDEK3ub80h9xuAbbdjAb2E"
                        }
                    },
                },
            },
        },
    },
    responses: {
        200: {
            description: "Added successfully",
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
                                description: "",
                                properties: {
                                    status: {
                                        type: "integer",
                                        description: "",
                                        example: 1
                                    },
                                    recordset: {
                                        type: "array",
                                        description: "",
                                        
                                    },
                                    errorMsg: {
                                        type: "string",
                                        description: "",
                                        example: null
                                    },
                                    procedureSuccess: {
                                        type: "boolean",
                                        description: "",
                                        example: true
                                    },
                                    procedureMessage: {
                                        type: "string",
                                        description: "",
                                        example: "User Master fetched successfully"
                                    },
                                }
                            },
                            token: {
                                type: "string",
                                description: "JWT authentication token",
                                example: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiI0RTlGMkFCRC1DMUMzLUVGMTEtOTQ1Ni0wMDBDMjkzMThDODgiLCJ1c2VyTmFtZSI6Ik9wc1NlY3VyRXllczAxQFNlY3VyZXllc2Rldi5jb20iLCJpYXQiOjE3NTkxNDgyNzMsImFjY291bnROYW1lIjoiU0UwMiIsImV4cCI6MTc1OTE1NTQ5MX0.uzfiSwmWAt8zt6Ruz1sMzcCtwcpJ1XEqbDRudkrDuzQ",
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
