module.exports = {
    tags: ["Auth"],
    description:
        "Description: \n- This api is responsible for sending OTP to the user when the user details are verified for change password. ",
    operationId: "sendOTPForChangePassword",
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
                        authMaster: {
                            type: "object",
                            properties: {
                                userID: {
                                    type: "string",
                                    description: "",
                                    example: "2217DFBE-2D92-F011-9FC1-000C29AAA2A1"
                                },
                                isSendOtp: {
                                    type: "integer",
                                    description: "",
                                    example: "1"
                                },
                                AccountName: {
                                    type: "string",
                                    description: "",
                                    example: "SE02"
                                },
                                Type: {
                                    type: "string",
                                    description: "",
                                    example: "ChangePWD"
                                },
                            }
                        },
                        token: {
                            type: "string",
                            example: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIyMjE3REZCRS0yRDkyLUYwMTEtOUZDMS0wMDBDMjlBQUEyQTEiLCJ1c2VyTmFtZSI6ImZhemlsQ2hlY2tlciIsImlhdCI6MTc1ODYwOTg1NywiYWNjb3VudE5hbWUiOiJTRTAyIiwiZXhwIjoxNzU4NjE3MDg2fQ.3Glp7ql95BbdwZxi7vxlsZ8OQYThEhf6OU-WgJKb4-Y"
                        }
                    },
                },
            },
        },
    },
    responses: {
        200: {
            description: "OTP sent successfully.",
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
                            token: {
                                type: "string",
                                description: "JWT authentication token",
                                example: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIyMjE3REZCRS0yRDkyLUYwMTEtOUZDMS0wMDBDMjlBQUEyQTEiLCJ1c2VyTmFtZSI6ImZhemlsQ2hlY2tlciIsImlhdCI6MTc1ODYwOTg1NywiYWNjb3VudE5hbWUiOiJTRTAyIiwiZXhwIjoxNzU4NjE3MjU4fQ.V1CWhXySxSqG0CST_L2RfXRID1ZYqgyp26Esvtpe-kg",
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
