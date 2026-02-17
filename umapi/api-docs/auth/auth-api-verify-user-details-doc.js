module.exports = {
    tags: ["Auth"],
    description:
        "Description: \n- This api is responsible for verifying the user details when the user gives all the details required to forgot and reset password. \n- It takes username, email, First Name, Last Name, New Password and Confirm password. All are encrypted and sent to the backend.",
    operationId: "verifyUserDetails",
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
                        cipherData: {
                            type: "string",
                            example:
                                "Q2ru9ZzCSj6c9NJcyUoAD0uFkIe53XMgrPXbU8+hp0gi4kd7hm1TmV4eKgKMzOXH6/oSc3+reKPy6/0pXsVEFWatZzSCB53nhS+LOgznsV6fQQP8Lh72xgsgUv742/8Qsoc54wVJk/FOj8zAjbanBxSMVqvC6wX5tavwQ4zv2AE2HrAdHhYRUqN6yNKTXOym9WpCJVcCAXndjZyGk9takP7IIkyGN0FTucCZm8R8pmIsIDDk675BISP51tyAtiaM5QmKBSAeWrdd1CN60fMgdsZ0uBp44pxJg3Q//n3mtN0TIFQNGQmlhKI/1DsGY7rRqYq9W6JbTmMF4lrS15GJkk072Q24u7LSole2w2T+3Bebex6y/HW34vEEPC+DOIwHVPOks2TfmG5CgvSh83Z88ZH85PW/fzE5XzvoUIDR8rzU0fpJAfBgmRIx72PcvA8opBZuvwLS40WaYr/q0XNXgDwCwKgSrSaXdUUDS6W18Ko/HsJgZVsc0TxOvAgpuFWXR8JQAgBq5NVWPAvLLAdBe74FPWyQPOXWcglQk5gjF+VP6VguN0sTV2Zg+m2BUzpnu48RXBxaFxed7Yt1Mj/NOcuaR8chRQZc91rlSHakO1L/rMJNF8+x0CdIZXhOG+ocbi61LxwIY1ZPLnSpqTaVmb5eerK/91+0aarKXcV4yPE=",
                        },
                    },
                },
            },
        },
    },
    responses: {
        200: {
            description: "user details is valid",
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
                                example: "user details is valid",
                            },
                            result: {
                                type: "object",
                                properties: {
                                    userID: {
                                        type: "object",
                                        example: "2217DFBE-2D92-F011-9FC1-000C29AAA2A1"
                                    },
                                },
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
