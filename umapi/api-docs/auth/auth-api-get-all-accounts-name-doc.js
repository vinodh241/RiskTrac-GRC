module.exports = {
  tags: ["Auth"],
  description:
    "Description: \n- This api is responsible for getting All the Accounts Name from DB when app initialization",
  operationId: "getUserDetails",
  security: [
    {
      bearerAuth: [],
    },
  ],
  requestBody: {
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
                type: "array",
                items: {
                  type: "array",
                  items: {
                    properties: {
                      Name: {
                        type: "string",
                        description: "Account Name",
                        example: "Account1",
                      },
                      Name: {
                        type: "string",
                        description: "Account Name",
                        example: "SecurEyes",
                      }
                    },
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
