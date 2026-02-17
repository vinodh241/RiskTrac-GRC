module.exports = {
    tags: ["Auth"],
    description:
        "Description: \n- This api is responsible for sending OTP to the user when the user details are verified for forgot password. ",
    operationId: "sendOtpForForgotPassword",
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
                                    example: "ForgotPWD"
                                },
                            }
                        },
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
                            message: {
                                type: "string",
                                description: "Response message",
                                example: null,
                            },
                            token: {
                                type: "string",
                                description: "JWT authentication token",
                                example: null,
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
