module.exports = {
    tags: ["Auth"],
    description:
        "Description: \n- This api is responsible for verifying the OTP for the user to forgot and reset the password. \n- When the user's OTP is got verified, the password is then changed. ",
    operationId: "verifyOtpForLogin",
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
                        OTP: {
                            type: "object",
                            properties: {
                                data: {
                                    type: "string",
                                    example: "iUng2GwjjCM9E1ppt+d5eY4j3mSlEq3Pq3QR6hA1AcQlnMRcP2/38DVsXiDsf0q2DgbrFVA4cb4A86JjzehafyNuKot4XbH1QJoKldQqzn68BLiF2rOUbwBatR09HFBzLx1rPAX9/JG/srE7Z9s6V8rv1hkFmjsLA7i5wyea7anaoaPrOhTreK3bVRfWUjVnkc6sqsjChb3vL5gjMjFSM9K7t0fPqjlbdCOp9Wm1D+k7iSTGDvfJrUeanpvoNWSSgZoiFV9fxxvZ3YJCtPre6GLVA8DKnAJ5De6vbxlNv8oRMUGgaENS+D3PZ4Zprtrq1U32a/67m7fCxYf8Omd3qcnWJtYCOrt+6DaMhGigWiLe0io1utKvEI6dIr/M78hBZ2zoIBA2B065w/ZwqegDXZhJCWK0MyiUaE9RY1FFT0wo4/Oym4IH/sgJxYJiWQhu85AkRPzeSOcApf8m66l8HlyQ4dDXSQqkgmV6n2wnHvRWN1NCBlorcWZBS9nJyuoxlwvO1f2ztv3uA6zQnoz+5e0YaRSPebdYLjC+2oosVRHOY0A5WGV/TCqF8rVp45kVA3JwOD8NGLP0BSzUNnB76xhlV18Bxh8UwucwDwK+XK+rb/Ke+fbIaryIsecWQX928DVh5l7kPbcp8BTRoorjFfvkqYofnpY33zF62EfxsKQ="
                                },
                            },
                        },
                        token: {
                            type: "string",
                            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyMjE3REZCRS0yRDkyLUYwMTEtOUZDMS0wMDBDMjlBQUEyQTEiLCJ1c2VyTmFtZSI6ImZhemlsQ2hlY2tlciIsImlhdCI6MTc1ODYxMzM5NCwiZXhwIjoxNzU4NjIwNTk0LCJhY2NvdW50TmFtZSI6IlNFMDIifQ.OisJ_Ej7AAYioT5MwcHk9Me02CbyHcIIh3xZRQWGjCE"
                        },
                    }
                },
            },
        },
    },
    responses: {
        200: {
            description: "OTP verified successfully.",
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
                                example: "OTP verified successfully",
                            },
                            result: {
                                example: null
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
