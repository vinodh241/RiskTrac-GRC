module.exports = {
    tags: ["Auth"],
    description:
        "Description: \n- This api is responsible for changing the user's password. \n- After the entered OTP is successfully verified, The password is successfully changed in DB. ",
    operationId: "changePasswordUser",
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
                            type: "string",
                            example: "g0tIEOauE7NxFsFPqX29zUCkLQa5xUhLpS//eB1LfAmFoI4WLLuAxxUvNyrdNlzVOdRWKgJxfSD3NGnhvVlCaeQ2kbq7ckoDmVcO0UNWjCbOboyexTo+KTuyX/AdwWHBQ5PYlryt5I4FMVzG1ubFZlM+QVBUS0yZPjBWDlQZBP4uVPDCL6LtiEyXmP75P2g/uaZqpfhr10zBeDNchlGfODqxAlKVWbjjnjaVbQWAnHJ5FEeWg2INVpPAXqxifyTj/+CkNCA0fOH/IlgM/qxgzfYcLDSTJJu7Wfjx6Elsp/2JjlHZWPJ6bAG0n7NgPXOF+bePue67CcOJQBpBuH0VETx8A8BQ9M+AOodBMir5W/v31wGgHHqFydPxmC3Xn5ebw+hC+mDYjClHU/Nrk5kwKbX25kitCId+hdzqf+VhpaF1tBLGOUIIcCyHvtNxF4fMxqre/x9fFYt1qtgBlYHr5CYxChvLfzWJnyj5Irz0ut1344cNeWSo4Zudcwthm3QoMdhZHjc7VjZqNVEciRQFs88+D6uwKiqtgLwlK+0GvhBzi+Nlj0fqPcxdtjE9HzLntgD7tNNRxXLYndtQTeoVARvJarGvsSQvGunXaKKSFB7LSgAl4fgeDRTlou8kHWCnzUWv/T6Ket+9hnBMISTbratnVI8qMp3lGYJHq2bqgko="
                        },
                        token: {
                            type: "string",
                            example: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIyMjE3REZCRS0yRDkyLUYwMTEtOUZDMS0wMDBDMjlBQUEyQTEiLCJ1c2VyTmFtZSI6ImZhemlsQ2hlY2tlciIsImlhdCI6MTc1ODYwOTg1NywiYWNjb3VudE5hbWUiOiJTRTAyIiwiZXhwIjoxNzU4NjE3MjU4fQ.V1CWhXySxSqG0CST_L2RfXRID1ZYqgyp26Esvtpe-kg"
                        }
                    },
                },
            },
        },
    },
    responses: {
        200: {
            description: "Change Password",
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
                                example: "Password changed successfully",
                            },
                            result: {
                                example: null
                            },
                            token: {
                                type: "string",
                                description: "JWT authentication token",
                                example: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIyMjE3REZCRS0yRDkyLUYwMTEtOUZDMS0wMDBDMjlBQUEyQTEiLCJ1c2VyTmFtZSI6ImZhemlsQ2hlY2tlciIsImlhdCI6MTc1ODYwOTg1NywiYWNjb3VudE5hbWUiOiJTRTAyIiwiZXhwIjoxNzU4NjE3NDM1fQ.TBJNi6mPozWJBUHJUnkBNzFS2v6sDzmr3V3QChKzolk",
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
