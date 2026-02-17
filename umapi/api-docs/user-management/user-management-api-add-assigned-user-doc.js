module.exports = {
    tags: ["User Management"],
    description:
        "Description: \n- This api is responsible for adding new users to the application.",
    operationId: "addAssignedUser",
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
                        userMaster: {
                            type: "object",
                            properties: {
                                adUserName: {
                                    type: "string",
                                    example: "userName"
                                },
                                firstName: {
                                    type: "string",
                                    example: "First Name"
                                },
                                middleName: {
                                    type: "string",
                                    example: ""
                                },
                                lastName: {
                                    type: "string",
                                    example: "Last Name"
                                },
                                mobileNumber: {
                                    type: "string",
                                    example: "7896541236"
                                },
                                emailI: {
                                    type: "string",
                                    example: "lastname.firstname@secureyes.net"
                                },
                                defaultRoleID: {
                                    type: "integer",
                                    example: 5
                                },
                                isUserManager: {
                                    type: "boolean",
                                    example: false
                                },
                                assignedModules: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            ModuleGUID: {
                                                type: "string",
                                                description: "Unique identifier of the module",
                                                example: "B56FB4D8-BC87-EF11-9FAE-000C29AAA2A1"
                                            },
                                            "RoleID": {
                                                "type": "integer",
                                                "description": "Role ID assigned to this module",
                                                "example": 4
                                            },
                                            "IsFunctionalAdmin": {
                                                "type": "boolean",
                                                "description": "Whether the user is a functional admin for this module",
                                                "example": true
                                            }
                                        }
                                    },
                                    "example": [
                                        {
                                            "ModuleGUID": "B56FB4D8-BC87-EF11-9FAE-000C29AAA2A1",
                                            "RoleID": 4,
                                            "IsFunctionalAdmin": true
                                        },
                                        {
                                            "ModuleGUID": "088168BF-BCF7-406A-BE15-DF7B5FD0046D",
                                            "RoleID": 4,
                                            "IsFunctionalAdmin": true
                                        },
                                        {
                                            "ModuleGUID": "B26FB4D8-BC87-EF11-9FAE-000C29AAA2A1",
                                            "RoleID": 4,
                                            "IsFunctionalAdmin": true
                                        },
                                        {
                                            "ModuleGUID": "CE455D4F-8A5F-4D8E-BFEE-45859ADF30F9",
                                            "RoleID": 4,
                                            "IsFunctionalAdmin": false
                                        }
                                    ]
                                },
                                assignedGroupsUnits: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            UnitID: {
                                                type: "integer"
                                            }

                                        }
                                    },
                                    example: [
                                        {
                                            UnitID: 43
                                        },
                                        {
                                            UnitID: 44
                                        },
                                        {
                                            UnitID: 5
                                        },
                                        {
                                            UnitID: 12
                                        },
                                        {
                                            UnitID: 4
                                        },
                                        {
                                            UnitID: 6
                                        },
                                        {
                                            UnitID: 10
                                        },
                                        {
                                            UnitID: 3
                                        },
                                        {
                                            UnitID: 2
                                        },
                                        {
                                            UnitID: 11
                                        },
                                        {
                                            UnitID: 17
                                        },
                                        {
                                            UnitID: 16
                                        },
                                    ]
                                },
                                userGUID: {
                                    type: "string",
                                    description: "",
                                    example: "DC2DC289-FD8E-F011-9FC1-000C29AAA2A1"
                                },
                                accountGUID: {
                                    type: "string",
                                    description: "",
                                    example: ""
                                },
                                authenticationMode: {
                                    type: "integer",
                                    description: "",
                                    example: 3
                                }

                            }
                        },
                    },
                },
            },
        },
    },
    responses: {
        200: {
            description: "Added successfully",
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
                                example: "Added successfully",
                            },
                            result: {
                                type: "array",
                                items:
                                {
                                    type: "array",
                                    items:
                                    {
                                        type: "object",
                                        oneOf:
                                            [
                                                {
                                                    type: "object",
                                                    properties:
                                                    {
                                                        UserGUID: { type: "string", example: "DC2DC289-FD8E-F011-9FC1-000C29AAA2A1" },
                                                        UserName: { type: "string", example: "FazilMF" },
                                                        DeptID: { type: "integer", example: 1 },
                                                        Salt: { type: "string", example: "$2b$10$tyF9jRD.uYp3GOQb0Vn9S." },
                                                        Password: { type: "string", example: "$2b$10$tyF9jRD.uYp3GOQb0Vn9S.qykwmw.YndxzxQEKoklFhLWOPOilLhm" },
                                                        DefaultRoleID: { type: "integer", example: 5 },
                                                        FirstName: { type: "string", example: "Mohamed" },
                                                        MiddleName: { type: "string", example: "" },
                                                        LastName: { type: "string", example: "Fazil" },
                                                        MobileNumber: { type: "string", example: "7896541236" },
                                                        EmailID: { type: "string", example: "fazil12.mohamed@secureyes.net" },
                                                        AllowLogin: { type: "boolean", example: true },
                                                        IsActive: { type: "boolean", example: true },
                                                        IsDeleted: { type: "boolean", example: false },
                                                        CreatedDate: { type: "string", example: "2025-09-11T16:23:24.753Z" },
                                                        CreatedBy: { type: "string", example: "OpsSecurEyes01-AddUser" },
                                                        LastUpdatedDate: { type: "string", example: "2025-09-29T15:09:23.617Z" },
                                                        LastUpdatedBy: { type: "string", example: "OpsSecurEyes01@Secureyesdev.com-AddUser" },
                                                        TryCount: { type: "integer", example: 0 },
                                                        LastLogin: { type: "string", example: "2025-09-29T09:32:15.057Z" },
                                                        IsDefaultPassword: { type: "boolean", example: false }
                                                    }
                                                },
                                                {
                                                    type: "object",
                                                    properties:
                                                    {
                                                        ModuleUserRoleID: { type: "integer", example: 286 },
                                                        ModuleGUID: { type: "string", example: "B26FB4D8-BC87-EF11-9FAE-000C29AAA2A1" },
                                                        UserGUID: { type: "string", example: "DC2DC289-FD8E-F011-9FC1-000C29AAA2A1" },
                                                        RoleID: { type: "integer", example: 4 },
                                                        IsFunctionalAdmin: { type: "boolean", example: true },
                                                        IsActive: { type: "boolean", example: true },
                                                        IsDeleted: { type: "boolean", example: false },
                                                        CreatedDate: { type: "string", example: "2025-09-11T16:23:24.760Z" },
                                                        CreatedBy: { type: "string", example: "OpsSecurEyes01-AddUser" },
                                                        LastUpdatedDate: { type: "string", example: "2025-09-29T15:09:23.620Z" },
                                                        LastUpdatedBy: { type: "string", example: "OpsSecurEyes01@Secureyesdev.com-AddUser" },
                                                        assignedModules:
                                                        {
                                                            type: "array",
                                                            items:
                                                            {
                                                                type: "object",
                                                                properties:
                                                                {
                                                                    ModuleGUID: { type: "string", example: "B56FB4D8-BC87-EF11-9FAE-000C29AAA2A1" },
                                                                    RoleID: { type: "integer", example: 4 },
                                                                    IsFunctionalAdmin: { type: "boolean", example: true }
                                                                }
                                                            },
                                                            example:
                                                                [
                                                                    { ModuleGUID: "B56FB4D8-BC87-EF11-9FAE-000C29AAA2A1", RoleID: 4, IsFunctionalAdmin: true },
                                                                    { ModuleGUID: "088168BF-BCF7-406A-BE15-DF7B5FD0046D", RoleID: 4, IsFunctionalAdmin: true },
                                                                    { ModuleGUID: "B26FB4D8-BC87-EF11-9FAE-000C29AAA2A1", RoleID: 4, IsFunctionalAdmin: true },
                                                                    { ModuleGUID: "CE455D4F-8A5F-4D8E-BFEE-45859ADF30F9", RoleID: 4, IsFunctionalAdmin: false }
                                                                ]
                                                        }
                                                    }
                                                },
                                                {
                                                    type: "object",
                                                    properties:
                                                    {
                                                        UserUnitID: { type: "integer", example: 247 },
                                                        UnitID: { type: "integer", example: 43 },
                                                        UserGUID: { type: "string", example: "DC2DC289-FD8E-F011-9FC1-000C29AAA2A1" },
                                                        IsDefault: { type: "boolean", example: false },
                                                        IsActive: { type: "boolean", example: true },
                                                        IsDeleted: { type: "boolean", example: false },
                                                        CreatedDate: { type: "string", example: "2025-09-11T16:23:24.770Z" },
                                                        CreatedBy: { type: "string", example: "OpsSecurEyes01-AddUser" },
                                                        LastUpdatedDate: { type: "string", example: "2025-09-29T15:09:23.627Z" },
                                                        LastUpdatedBy: { type: "string", example: "OpsSecurEyes01@Secureyesdev.com-AddUser" }
                                                    }
                                                }
                                            ]
                                    }
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
