module.exports = {
  tags: ["Auth"],
  description:
    "Description: \n- This api is responsible for authentication the user to login into the application \n- From client side, the username, password and other things get encrypted by public key and then sent to the backend \n- In backend, the encrypted data is decrypted by private key and then check with the DB. \n- If the user credentials are correct then, it lets user to login and use the application. \n- If it is error, then the error message will appear. ",
  operationId: "login",
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
            userData: {
              type: "string",
              example:
                "AV+rb8JjZobKuNktChAk5pT1wnAMuu+frvKDwR5/AK/m/vGnXb8XLcWp7yC7K+07Ilg/QuWr0+Akhqin/3xk5m4jZcgmFOWJ34KoCOGUWTGwSQXAwpbSnPvuWa8nWcgK9JedCzA+eHniPAtd5nnzOdm9aUW9HHkb1/skdJBZmoCHO5q0B0MzKneyuOi0bAX/Sp6+rdLAY4WxT3lQ1FO8VeT+J2EWcBdaNxlwPFc62nrq/LG+qcAPdCTCZyeURwSPV6rUBvKmeiSIVOGnaEmriEYJ6BWlhNgkDrZEqhckJWEeeAC7o4X6bMch6owPa1gcFV4jrH/TAXekg79iXPGFA2dopMiHEPltaCpMB1gQOYG98KTyFBp9YZ3u+bZ4TFLCn7wOPNj4ZgTExXHYgoR2Cmzde3BdNvT0e6QpaWGOBNxSIwFf6hZ7tufGGfTdcPA6Uv7S44FXdEHC7Fx4T86yw0y1qiygXshKHwJFnlHADwxDn0KzwQ7HRNcFaiQS9Mr9Va50jHFqWGTewomczvVlZzqhjvPXppO3ZeBOwJ6miUPGF8ZAbdUDR9oi3op3XU+F5fxdUhAFeKZFtgcnPp/5+CjRiBWX8bp2y/xgMMpwXs0HjhW7GCxIZpdP+LhehC+Zj9AP3Tt9OUemFdYhunj66QDlOc70mJJeld5YJux++rk=",
            },
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: "Successful login",
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
                example: "Login successful.",
              },
              result: {
                type: "object",
                properties: {
                  loginData: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        LoginID: {
                          type: "string",
                          description: "Login identifier",
                          example: "4691",
                        },
                        UserGUID: {
                          type: "string",
                          description: "User GUID",
                          example: "DC2DC289-FD8E-F011-9FC1-000C29AAA2A1",
                        },
                        SessionID: {
                          type: "string",
                          description: "Session identifier",
                          example: "932459AC-4065-45B1-9880-A7817F0D0CC2",
                        },
                        TokenALL: {
                          type: "string",
                          description: "JWT token for all access",
                          example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                        },
                        TokenBG: {
                          type: "string",
                          nullable: true,
                          description: "Background token",
                          example: null,
                        },
                        TokenOTH: {
                          type: "string",
                          nullable: true,
                          description: "Other token",
                          example: null,
                        },
                        RoleID: {
                          type: "integer",
                          description: "Role identifier",
                          example: 5,
                        },
                        LoginDate: {
                          type: "string",
                          nullable: true,
                          description: "Login date",
                          example: null,
                        },
                        LastAccessDate: {
                          type: "string",
                          format: "date-time",
                          description: "Last access timestamp",
                          example: "2025-09-17T17:30:19.780Z",
                        },
                        ExpiryDate: {
                          type: "string",
                          nullable: true,
                          description: "Token expiry date",
                          example: null,
                        },
                        LoginIPAddress: {
                          type: "string",
                          nullable: true,
                          description: "Login IP address",
                          example: null,
                        },
                        HostName: {
                          type: "string",
                          nullable: true,
                          description: "Host name",
                          example: null,
                        },
                        SystemUser: {
                          type: "string",
                          nullable: true,
                          description: "System user",
                          example: null,
                        },
                        token_poll: {
                          type: "string",
                          description: "Polling token",
                          example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                        },
                        AccountGUID: {
                          type: "string",
                          description: "Account GUID",
                          example: "630E9CEF-468D-4BF1-AC40-F0EA65557D11",
                        },
                        FirstName: {
                          type: "string",
                          description: "User's first name",
                          example: "First Name",
                        },
                        MiddleName: {
                          type: "string",
                          description: "User's middle name",
                          example: "",
                        },
                        LastName: {
                          type: "string",
                          description: "User's last name",
                          example: "Last Name",
                        },
                        FullName: {
                          type: "string",
                          description: "User's full name",
                          example: "Full Name",
                        },
                      },
                    },
                  },
                  roleData: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        RoleID: {
                          type: "integer",
                          description: "Role identifier",
                          example: 1,
                        },
                        Name: {
                          type: "string",
                          description: "Role name",
                          example: "SuperAdmin",
                        },
                        Description: {
                          type: "string",
                          description: "Role description",
                          example: "Super Admin",
                        },
                        Abbreviation: {
                          type: "string",
                          description: "Role abbreviation",
                          example: "SA",
                        },
                        IsActive: {
                          type: "boolean",
                          description: "Role active status",
                          example: true,
                        },
                        IsDeleted: {
                          type: "boolean",
                          description: "Role deleted status",
                          example: false,
                        },
                        CreatedDate: {
                          type: "string",
                          format: "date-time",
                          description: "Role creation date",
                          example: "2024-12-24T01:13:07.117Z",
                        },
                        CreatedBy: {
                          type: "string",
                          description: "Role created by",
                          example: "BASE SCRIPT",
                        },
                        LastUpdatedDate: {
                          type: "string",
                          format: "date-time",
                          description: "Last updated date",
                          example: "2024-12-24T01:13:07.117Z",
                        },
                        LastUpdatedBy: {
                          type: "string",
                          description: "Last updated by",
                          example: "BASE SCRIPT",
                        },
                        AccountGUID: {
                          type: "string",
                          nullable: true,
                          description: "Associated account GUID",
                          example: null,
                        },
                      },
                    },
                  },
                  authorizedModuleData: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        ModuleGUID: {
                          type: "string",
                          description: "Module GUID",
                          example: "B26FB4D8-BC87-EF11-9FAE-000C29AAA2A1",
                        },
                        Name: {
                          type: "string",
                          description: "Module name",
                          example: "Operational Risk Management",
                        },
                        Abbreviation: {
                          type: "string",
                          description: "Module abbreviation",
                          example: "ORM",
                        },
                        API: {
                          type: "string",
                          nullable: true,
                          description: "API endpoint",
                          example: null,
                        },
                        WEB: {
                          type: "string",
                          nullable: true,
                          description: "Web endpoint",
                          example: null,
                        },
                        Description: {
                          type: "string",
                          nullable: true,
                          description: "Module description",
                          example: null,
                        },
                        OwnerUnitID: {
                          type: "integer",
                          nullable: true,
                          description: "Owner unit ID",
                          example: 5,
                        },
                        IsActive: {
                          type: "boolean",
                          description: "Module active status",
                          example: true,
                        },
                        IsDeleted: {
                          type: "boolean",
                          description: "Module deleted status",
                          example: false,
                        },
                        CreatedDate: {
                          type: "string",
                          format: "date-time",
                          description: "Module creation date",
                          example: "2024-12-24T01:13:07.040Z",
                        },
                        CreatedBy: {
                          type: "string",
                          description: "Module created by",
                          example: "BASE SCRIPT",
                        },
                        LastUpdatedDate: {
                          type: "string",
                          format: "date-time",
                          description: "Last updated date",
                          example: "2024-12-24T01:13:07.040Z",
                        },
                        LastUpdatedBy: {
                          type: "string",
                          description: "Last updated by",
                          example: "BASE SCRIPT",
                        },
                      },
                    },
                  },
                  userAccountData: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        Name: {
                          type: "string",
                          description: "Account name",
                          example: "SecurEyes",
                        },
                        Abbreviation: {
                          type: "string",
                          description: "Account abbreviation",
                          example: "SE",
                        },
                        Description: {
                          type: "string",
                          description: "Account description",
                          example: "Description of the account",
                        },
                        UserCounts: {
                          type: "integer",
                          description: "Number of users in account",
                          example: 50,
                        },
                        IsActive: {
                          type: "boolean",
                          description: "Account active status",
                          example: true,
                        },
                        IsDeleted: {
                          type: "boolean",
                          description: "Account deleted status",
                          example: false,
                        },
                        CreatedDate: {
                          type: "string",
                          format: "date-time",
                          description: "Account creation date",
                          example: "2024-12-24T01:18:47.843Z",
                        },
                        CreatedBy: {
                          type: "string",
                          description: "Account created by",
                          example: "boda.sagar@secureyesdev.com",
                        },
                        LastUpdatedDate: {
                          type: "string",
                          format: "date-time",
                          description: "Last updated date",
                          example: "2024-12-27T01:10:06.813Z",
                        },
                        LastUpdatedBy: {
                          type: "string",
                          description: "Last updated by",
                          example: "BASE SCRIPT",
                        },
                        SubscriptionDetails: {
                          type: "string",
                          description:
                            "JSON string containing subscription details",
                          example:
                            '[{"AccountGUID":"630E9CEF-468D-4BF1-AC40-F0EA65557D11","AccountName":"SecurEyes",...}]',
                        },
                      },
                    },
                  },
                  userModuleRoleData: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        ModuleUserRoleID: {
                          type: "integer",
                          description: "Module user role ID",
                          example: 286,
                        },
                        ModuleGUID: {
                          type: "string",
                          description: "Module GUID",
                          example: "B26FB4D8-BC87-EF11-9FAE-000C29AAA2A1",
                        },
                        UserGUID: {
                          type: "string",
                          description: "User GUID",
                          example: "DC2DC289-FD8E-F011-9FC1-000C29AAA2A1",
                        },
                        RoleID: {
                          type: "integer",
                          description: "Role ID",
                          example: 4,
                        },
                        IsFunctionalAdmin: {
                          type: "boolean",
                          description: "Functional admin status",
                          example: true,
                        },
                        IsActive: {
                          type: "boolean",
                          description: "Active status",
                          example: true,
                        },
                        IsDeleted: {
                          type: "boolean",
                          description: "Deleted status",
                          example: false,
                        },
                        CreatedDate: {
                          type: "string",
                          format: "date-time",
                          description: "Creation date",
                          example: "2025-09-11T16:23:24.760Z",
                        },
                        CreatedBy: {
                          type: "string",
                          description: "Created by",
                          example: "OpsSecurEyes01-AddUser",
                        },
                        LastUpdatedDate: {
                          type: "string",
                          format: "date-time",
                          description: "Last updated date",
                          example: "2025-09-15T18:23:28.770Z",
                        },
                        LastUpdatedBy: {
                          type: "string",
                          description: "Last updated by",
                          example: "OpsSecurEyes01@Secureyesdev.com-AddUser",
                        },
                        ModuleName: {
                          type: "string",
                          description: "Module name",
                          example: "Operational Risk Management",
                        },
                        Abbreviation: {
                          type: "string",
                          description: "Module abbreviation",
                          example: "ORM",
                        },
                        SubscriptionDetails: {
                          type: "string",
                          description:
                            "JSON string containing subscription details",
                          example:
                            '[{"AccountGUID":"630E9CEF-468D-4BF1-AC40-F0EA65557D11",...}]',
                        },
                      },
                    },
                  },
                  userUnitData: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        UserName: {
                          type: "string",
                          description: "Username",
                          example: "FazilMF",
                        },
                        UnitID: {
                          type: "integer",
                          description: "Unit ID",
                          example: 43,
                        },
                        UnitName: {
                          type: "string",
                          description: "Unit name",
                          example: "Compliance.",
                        },
                        Abbreviation: {
                          type: "string",
                          description: "Unit abbreviation",
                          example: "CI",
                        },
                      },
                    },
                  },
                  authorizedFunctionData: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        UserID: {
                          type: "string",
                          description: "User ID",
                          example: "DC2DC289-FD8E-F011-9FC1-000C29AAA2A1",
                        },
                        ModuleName: {
                          type: "string",
                          description: "Module name",
                          example: "RiskAppetite",
                        },
                        FunctionCode: {
                          type: "string",
                          description: "Function code",
                          example: "RA01-001",
                        },
                        RequiredAuthorization: {
                          type: "boolean",
                          description: "Authorization requirement",
                          example: true,
                        },
                        AppFunctionName: {
                          type: "string",
                          description: "Application function name",
                          example: "downloadFile",
                        },
                      },
                    },
                  },
                  bcmStreeringCommittee: {
                    type: "array",
                    description:
                      "BCM Steering Committee data (empty in this example)",
                    items: {
                      type: "object",
                    },
                  },
                  moduleList: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        ModuleAbbreviation: {
                          type: "string",
                          description: "Module abbreviation",
                          example: "ORM",
                        },
                        ModuleName: {
                          type: "string",
                          description: "Module name",
                          example: "ORM",
                        },
                      },
                    },
                  },
                },
              },
              token: {
                type: "string",
                description: "JWT authentication token",
                example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
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
