module.exports = {
    tags: ["Auth"],
    description:
        "Description: \n- This api is responsible for changing the user's password. \n- From client side, User will give the old password, new password and username taken from the local storage. It is then encrypted and send to the server. \n- In server side, encrypted will get decrypted and change the password in DB for the particular username. ",
    operationId: "changePassword",
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
                            example: "MNeayosF2F4yKwyaGgKp7D1JPtUCcSDBUEHQKJ7ZtP9rhvUI9a8gutsZJ7FdH2NoB0iISA/2upr/i/lJBo30UC5Lvx2v7YEfwhmN4Mlly3i4v3v4USOX41Pscx+7NXIh62Xa/nW+ZJXLxpfTaaF2klwF0dT0/NVLprsg6XV+P/qfR6HWfI9n2IGvF+VRmgFA2pZSiWnbonNbqNmGTU3DQuhFyvO6qs6TbGuz12z0wW02RzI+g71jU8v1JVqEvKi4d/gzHUcaHucNWe9QPHDYjIU813q+JEDyRyLn4Tl6MSoWb3sMWiGMRcYl0ZYQ2zGwx01lqoiWeDftTUrrbEmK18fU2vm8cXTR/TsD1NEVd6R1x0WFh+wDvWr9Gaq/RRpP69+fEugyD8jHpdWB7N4C+XmudQBS7oSJf27CMxsBVM0y2AoJ0ELvmXihtyzYjekBdBo9fUpFjBdAybVeDTYyFFgpxHsRQexyIwuyfUjyBvuomuB3ONMaVxoJZN32LiouRkmVePmRrYJ2M09FiclFX5eWb98R4o4QAyGN4nP4ThENyczOAhXgj4SJUPbBAGahkF/IOlC956Ex3QaBgUWkiyP42T3IZB4+WIFjLjrpCalPGe72naBhL9cu8IwuiE6zeUhex9hvsF8HrsfR9EsiSkeun7VeyLY0plUT4FKQbuE="
                        },
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
