module.exports = {
    tags: ["Auth"],
    description:
        "Description: \n- This api is responsible for getting the user to logout of the application \n- It makes the token expired, so that the user cannot being login to the application, It makes the user to logout from the application. \n- When user again login by giving credentials, then the new token is generated.",
    operationId: "logout",
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
                            example:
                                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJEQzJEQzI4OS1GRDhFLUYwMTEtOUZDMS0wMDBDMjlBQUEyQTEiLCJ1c2VyTmFtZSI6IkZhemlsTUYiLCJpYXQiOjE3NTgyNzc2ODMsImV4cCI6MTc1ODI4NDg4MywiYWNjb3VudE5hbWUiOiJTRTAyIn0.tvt1JdBYrfCvFF6ONIGWZbQMmywkfbmdI2lSQUItmtg",
                        },
                    },
                },
            },
        },
    },
    responses: {
        200: {
            description: "Successful logout",
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
                                example: "Logout successful.",
                            },
                            result: {},
                            token: null,
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
        TOKEN_EXPIRED: {
            description: "Bad Request",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            success: { type: "string", description: "Success indicator (1 for success, 0 for failure)", example: "0" },
                            message: { type: "string", description: "Response message", example: null },
                            result: { type: "string", description: "Response message", example: null },
                            token: { type: "string", description: "Response message", example: null },
                            error: {
                                type: "object",
                                properties: {
                                    errorCode: {
                                        type: "string",
                                        description: "Error code",
                                        example: "TOKEN_EXPIRED",
                                    },
                                    errorMessage: {
                                        type: "string",
                                        description: "Error message",
                                        example: "Invalid session, please re-login.",
                                    },
                                },
                            },
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
