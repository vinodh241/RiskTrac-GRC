module.exports = {
  tags: ["Auth"],
  description:
    "Description: \n- This api is responsible for get the public key from the api and give to the client side. \n- From client side, it is stored in local storage. \n- Then this key is used to encrypt the user login credentials and give to api while login.",
  operationId: "getPublicKey",
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
        },
      },
    },
  },
  responses: {
    200: {
      description: "Successfully retrieved public key and config",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: {
                type: "integer",
                example: 1,
              },
              message: {
                type: "string",
                example: "Get public key successfully.",
              },
              result: {
                type: "object",
                properties: {
                  publicKey: {
                    type: "string",
                    example:
                      "-----BEGIN PUBLIC KEY----------END PUBLIC KEY-----",
                  },
                  domainName: {
                    type: "string",
                    example: "secureyesdev.com",
                  },
                  serverTime: {
                    type: "string",
                    format: "date-time",
                    example: "2025-09-16T10:15:46.145Z",
                  },
                  separator: {
                    type: "string",
                    example: "--",
                  },
                  sessionTimeOut: {
                    type: "integer",
                    example: 120,
                  },
                  OTPLength: {
                    type: "integer",
                    example: 6,
                  },
                  ResentOTPTime: {
                    type: "integer",
                    example: 120,
                  },
                  ResentOTPTimeForChangePassword: {
                    type: "integer",
                    example: 60,
                  },
                  DateFormat: {
                    type: "string",
                    example: "DD/MM/YYYY",
                  },
                  authenticationMode: {
                    type: "integer",
                    example: 3,
                  },
                  IS_OTP_FOR_CHANGE_PASSWORD: {
                    type: "boolean",
                    example: true,
                  },
                  CHANGE_PASSWORD_CONFIG: {
                    type: "object",
                    properties: {
                      MIN_LENGTH: {
                        type: "integer",
                        example: 8,
                      },
                      MAX_LENGTH: {
                        type: "integer",
                        example: 20,
                      },
                      REGEXP_REFERENCE: {
                        type: "string",
                        example:
                          "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@$%#^&*()_+|\\-=\\{}'`;:<>?,./])[A-Za-z0-9!@$%#^&*()_+|\\-=\\{}'`;:<>?,./]*$",
                      },
                      TOOL_TIP_MESSAGE: {
                        type: "string",
                        example:
                          "* Password Policy:\n- Password Range min = 8 , max = 20.\n- It should contain minimum 1 uppercase, 1 lowercase, 1 digit & 1 special character.\n- Password should not be same as username.\n- Last (2) passwords cannot be reused.\n- Allowed special characters [!@$#%^&*()_+|\\-=\\{}';:<>?,./].",
                      },
                    },
                  },
                  USER_NAME_CONFIG: {
                    type: "object",
                    properties: {
                      MIN_LENGTH: {
                        type: "integer",
                        example: 6,
                      },
                      MAX_LENGTH: {
                        type: "integer",
                        example: 50,
                      },
                      REGEXP_REFERENCE: {
                        type: "string",
                        example: "^[a-zA-Z][a-zA-Z0-9]*$",
                      },
                      MESSAGE: {
                        type: "string",
                        example:
                          "User Name should contain (A-Z,a-z), (0-9) and 6 - 50 characters long.",
                      },
                    },
                  },
                  USER_ID_CONFIG: {
                    type: "object",
                    properties: {
                      MIN_LENGTH: {
                        type: "integer",
                        example: 6,
                      },
                      MAX_LENGTH: {
                        type: "integer",
                        example: 50,
                      },
                      REGEXP_REFERENCE: {
                        type: "string",
                        example:
                          "^[a-zA-Z][A-Za-z0-9]*$|^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$",
                      },
                      MESSAGE: {
                        type: "string",
                        example:
                          "User ID range should be 6 to 50 and (A-Z,a-z,0-9,domain) characters allow only.",
                      },
                    },
                  },
                  MFA_CONFIG_IS_MFA: {
                    type: "boolean",
                    example: false,
                  },
                  LOGIN_PAGE_DATA: {
                    type: "object",
                    properties: {
                      LOGIN_PAGE_DESC: {
                        type: "string",
                        example:
                          "SE-TPTRAC provides a comprehensive platform for efficiently managing third party risks throughout the entire supplier life cycle...",
                      },
                      LANDING_TEXT: {
                        type: "string",
                        example: "SE-GRC",
                      },
                      LANDING_EMAILID: {
                        type: "string",
                        example: "tptracsupport@secureyes.net",
                      },
                    },
                  },
                  publicKeyUM: {
                    type: "string",
                    example:
                      "-----BEGIN PUBLIC KEY----------END PUBLIC KEY-----",
                  },
                },
              },
              error: {
                type: "object",
                properties: {
                  errorCode: {
                    type: "string",
                    nullable: true,
                    example: null,
                  },
                  errorMessage: {
                    type: "string",
                    nullable: true,
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
