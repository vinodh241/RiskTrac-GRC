module.exports = {
    tags: ["Auth"],
    description:
        "Description: \n- This api is responsible for getting the user details by name from DB. \n- This API will be executed when changing the user's password. \n- username, accountName, old and new passwords is get encrypted and send it to the backend(server). \n- In backend (server side), The data is decrypted and By the username, the user details are fetched from DB. \n- And for the particular user the password get changed.",
    operationId: "getUserDetailsByName",
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
                            example: "IbwCloPrgZjEa4KWmb8lzhmC6/FVsMZjMGiEn+6AE+sjy2Are3f7uNqRmkEtGd7WrRrGmJOM7DMM620zHFi08TIzNR54HI/ciTfQB1yZ0cvX33ZMBk53kQFFDTNh02CAgmlX34FVXSEsumTptV5MlDhKkKpRoBL96RqboNwfxiRA0WwQLUxH8qGgfE73WiMxH7LbB07PvoC1RsAp8IrWDDmRjwGRBZeSg3xyHCr5CjBDycNzV2CIztdR034ANQU5RzOyWHR0M5J5GD9N/rBUKx4nne9qoMt9oR8WaEU/1uz3+MCrx0DaNC/U/g6Z8E2PRVSEuERHoFoO5CiWl7y4zLxTKA7dgbHmIGQxmiq6qA2S5/mm4JrGKzNulUXLYlWR0nJXWXqe10LHWoeYJAGKA6+qA50+H5jxNJxC4pvzcttmH+AgHsMbDRoKDuiSrIzrA0huI2scMGtaxHDSw2o8uSL33U/PCsqqZAToh5w5w520LG6nEb9vYI8nQL/xADc8cz7/831jp/gctKjlRZb+nnhvIm1xoRDHmaMlj68wEnIN7vQ7LtsIygOhVyrC8p0NjrUg12srZj1nfZ2TgWnVCsVe7iuw0p/jeyJC9SzVi8OvaLWqYEABg6cIKbo4MvpTbHv5xlMmbytI+LasMEBdJtY5jLNoUPGa9KtzIp57lFk="
                        },
                    },
                },
            },
        },
    },
    responses: {
        200: {
            description: "Successfully retrieved all account names",
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
                                example: "Data fetched successfully.",
                            },
                            result: {
                                example: null,
                            },
                            token: {
                                type: "string",
                                description: "JWT authentication token",
                                example: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIyMjE3REZCRS0yRDkyLUYwMTEtOUZDMS0wMDBDMjlBQUEyQTEiLCJ1c2VyTmFtZSI6ImZhemlsQ2hlY2tlciIsImlhdCI6MTc1ODYxMzM5NCwiYWNjb3VudE5hbWUiOiJTRTAyIiwiZXhwIjoxNzU4NjIwNzQzfQ.dJPRH0jDtejr24r0plr6T5bC606GFj0SSQO2U1Dun1k",
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
