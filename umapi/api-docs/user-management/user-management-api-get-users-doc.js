module.exports = {
    tags: ["User Management"],
    description:
        "Description: \n- This api is responsible for getting all the user details from DB.\n- This will take the token as input parameter and get decrypted in the backed.\n- Then it will list all the roles details and user details. \n- In this example response, I given only one details of the user.",
    operationId: "getUsers",
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
                            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0RTlGMkFCRC1DMUMzLUVGMTEtOTQ1Ni0wMDBDMjkzMThDODgiLCJ1c2VyTmFtZSI6Ik9wc1NlY3VyRXllczAxQFNlY3VyZXllc2Rldi5jb20iLCJpYXQiOjE3NTg2OTYzNTYsImV4cCI6MTc1ODcwMzU1NiwiYWNjb3VudE5hbWUiOiJTRTAyIn0.S2IynsuC8CGpKQDUdVNjvbpzQI9lEwIQWk4QZOZeXGQ"
                        },
                    },
                },
            },
        },
    },
    responses: {
        200: {
            description: "Successful fetched user details from DB",
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
                                example: "Data fetch from DB successful.",
                            },
                            result: {
                                type: "object",
                                properties: {
                                    "Roles": {
                                        "type": "array",
                                        "items": {
                                            "type": "object",
                                            "properties": {
                                                "RoleID": { "type": "integer" },
                                                "Name": { "type": "string" },
                                                "Description": { "type": "string" },
                                                "Abbreviation": { "type": "string" },
                                                "IsActive": { "type": "boolean" },
                                                "IsDeleted": { "type": "boolean" },
                                                "CreatedDate": { "type": "string", "format": "date-time" },
                                                "CreatedBy": { "type": "string" },
                                                "LastUpdatedDate": { "type": "string", "format": "date-time" },
                                                "LastUpdatedBy": { "type": "string" }
                                            },
                                            "example": {
                                                "RoleID": 1,
                                                "Name": "SuperAdmin",
                                                "Description": "Super Admin",
                                                "Abbreviation": "SA",
                                                "IsActive": true,
                                                "IsDeleted": false,
                                                "CreatedDate": "2024-12-24T01:13:07.117Z",
                                                "CreatedBy": "BASE SCRIPT",
                                                "LastUpdatedDate": "2024-12-24T01:13:07.117Z",
                                                "LastUpdatedBy": "BASE SCRIPT"
                                            }
                                        },
                                        "example": [
                                            {
                                                "RoleID": 1,
                                                "Name": "SuperAdmin",
                                                "Description": "Super Admin",
                                                "Abbreviation": "SA",
                                                "IsActive": true,
                                                "IsDeleted": false,
                                                "CreatedDate": "2024-12-24T01:13:07.117Z",
                                                "CreatedBy": "BASE SCRIPT",
                                                "LastUpdatedDate": "2024-12-24T01:13:07.117Z",
                                                "LastUpdatedBy": "BASE SCRIPT"
                                            },
                                            {
                                                "RoleID": 2,
                                                "Name": "TenantManager",
                                                "Description": "Tenant Manager",
                                                "Abbreviation": "TM",
                                                "IsActive": true,
                                                "IsDeleted": false,
                                                "CreatedDate": "2024-12-24T01:13:07.117Z",
                                                "CreatedBy": "BASE SCRIPT",
                                                "LastUpdatedDate": "2024-12-24T01:13:07.117Z",
                                                "LastUpdatedBy": "BASE SCRIPT"
                                            },
                                            {
                                                "RoleID": 3,
                                                "Name": "UserManagement",
                                                "Description": "User Management",
                                                "Abbreviation": "UM",
                                                "IsActive": true,
                                                "IsDeleted": false,
                                                "CreatedDate": "2024-12-24T01:13:07.117Z",
                                                "CreatedBy": "BASE SCRIPT",
                                                "LastUpdatedDate": "2024-12-24T01:13:07.117Z",
                                                "LastUpdatedBy": "BASE SCRIPT"
                                            },
                                            {
                                                "RoleID": 4,
                                                "Name": "PowerUser",
                                                "Description": "Power User",
                                                "Abbreviation": "PU",
                                                "IsActive": true,
                                                "IsDeleted": false,
                                                "CreatedDate": "2024-12-24T01:13:07.117Z",
                                                "CreatedBy": "BASE SCRIPT",
                                                "LastUpdatedDate": "2024-12-24T01:13:07.117Z",
                                                "LastUpdatedBy": "BASE SCRIPT"
                                            },
                                            {
                                                "RoleID": 5,
                                                "Name": "StandardUser",
                                                "Description": "Standard User",
                                                "Abbreviation": "SU",
                                                "IsActive": true,
                                                "IsDeleted": false,
                                                "CreatedDate": "2024-12-24T01:13:07.117Z",
                                                "CreatedBy": "BASE SCRIPT",
                                                "LastUpdatedDate": "2024-12-24T01:13:07.117Z",
                                                "LastUpdatedBy": "BASE SCRIPT"
                                            }
                                        ]
                                    },
                                    "Users": {
                                        "type": "array",
                                        "items": {
                                            "type": "object",
                                            "properties": {
                                                "UserGUID": {
                                                    "type": "string",
                                                    "example": "DC2DC289-FD8E-F011-9FC1-000C29AAA2A1"
                                                },
                                                "UserName": {
                                                    "type": "string",
                                                    "example": "UserName"
                                                },
                                                "DeptID": {
                                                    "type": "integer",
                                                    "example": 1
                                                },
                                                "Salt": {
                                                    "type": "string",
                                                    "example": "$2b$10$tyF9jRD.uYp3GOQb0Vn9S."
                                                },
                                                "Password": {
                                                    "type": "string",
                                                    "example": "$2b$10$tyF9jRD.uYp3GOQb0Vn9S.qykwmw.YndxzxQEKoklFhLWOPOilLhm"
                                                },
                                                "DefaultRoleID": {
                                                    "type": "integer",
                                                    "example": 5
                                                },
                                                "FirstName": {
                                                    "type": "string",
                                                    "example": "First Name"
                                                },
                                                "MiddleName": {
                                                    "type": "string",
                                                    "example": ""
                                                },
                                                "LastName": {
                                                    "type": "string",
                                                    "example": "Last Name"
                                                },
                                                "MobileNumber": {
                                                    "type": "string",
                                                    "example": "7896541236"
                                                },
                                                "EmailID": {
                                                    "type": "string",
                                                    "example": "firstname.lastname@secureyes.net"
                                                },
                                                "AllowLogin": {
                                                    "type": "boolean",
                                                    "example": true
                                                },
                                                "IsActive": {
                                                    "type": "boolean",
                                                    "example": true
                                                },
                                                "IsDeleted": {
                                                    "type": "boolean",
                                                    "example": false
                                                },
                                                "CreatedDate": {
                                                    "type": "string",
                                                    "format": "date-time",
                                                    "example": "2025-09-11T16:23:24.753Z"
                                                },
                                                "CreatedBy": {
                                                    "type": "string",
                                                    "example": "OpsSecurEyes01-AddUser"
                                                },
                                                "LastUpdatedDate": {
                                                    "type": "string",
                                                    "format": "date-time",
                                                    "example": "2025-09-22T12:24:26.423Z"
                                                },
                                                "LastUpdatedBy": {
                                                    "type": "string",
                                                    "example": "UpdateUser"
                                                },
                                                "TryCount": {
                                                    "type": "integer",
                                                    "example": 0
                                                },
                                                "LastLogin": {
                                                    "type": "string",
                                                    "format": "date-time",
                                                    "example": "2025-09-22T06:54:26.267Z"
                                                },
                                                "IsDefaultPassword": {
                                                    "type": "boolean",
                                                    "example": false
                                                },
                                                "UserType": {
                                                    "type": "string",
                                                    "example": "StandardUser"
                                                },
                                                "ADUserName": {
                                                    "type": "string",
                                                    "example": "UserName"
                                                },
                                                "ActivationDate": {
                                                    "type": ["string", "null"],
                                                    "format": "date-time",
                                                    "example": null
                                                },
                                                "DeactivationDate": {
                                                    "type": ["string", "null"],
                                                    "format": "date-time",
                                                    "example": null
                                                },
                                                "LastUpdatedPasswordDate": {
                                                    "type": "string",
                                                    "format": "date-time",
                                                    "example": "2025-09-11T16:25:51.250Z"
                                                },
                                                "PasswordExpiryDate": {
                                                    "type": ["string", "null"],
                                                    "format": "date-time",
                                                    "example": null
                                                },
                                                "IPAddress": {
                                                    "type": "string",
                                                    "example": "00.0.0.000"
                                                },
                                                "OTPTryCount": {
                                                    "type": "integer",
                                                    "example": 0
                                                },
                                                "isAuthenticated": {
                                                    "type": "boolean",
                                                    "example": true
                                                },
                                                "isValidated": {
                                                    "type": "boolean",
                                                    "example": false
                                                },
                                                "IsUserEnabled": {
                                                    "type": "integer",
                                                    "example": 1
                                                },
                                                "Modules": {
                                                    "type": "array",
                                                    "items": {
                                                        "type": "object",
                                                        "properties": {
                                                            "ModuleUserRoleID": {
                                                                "type": "integer",
                                                                "example": 287
                                                            },
                                                            "ModuleGUID": {
                                                                "type": "string",
                                                                "example": "B56FB4D8-BC87-EF11-9FAE-000C29AAA2A1"
                                                            },
                                                            "UserGUID": {
                                                                "type": "string",
                                                                "example": "DC2DC289-FD8E-F011-9FC1-000C29AAA2A1"
                                                            },
                                                            "RoleID": {
                                                                "type": "integer",
                                                                "example": 4
                                                            },
                                                            "IsFunctionalAdmin": {
                                                                "type": "boolean",
                                                                "example": true
                                                            },
                                                            "IsActive": {
                                                                "type": "boolean",
                                                                "example": true
                                                            },
                                                            "IsDeleted": {
                                                                "type": "boolean",
                                                                "example": false
                                                            },
                                                            "CreatedDate": {
                                                                "type": "string",
                                                                "format": "date-time",
                                                                "example": "2025-09-11T16:23:24.760Z"
                                                            },
                                                            "CreatedBy": {
                                                                "type": "string",
                                                                "example": "OpsSecurEyes01-AddUser"
                                                            },
                                                            "LastUpdatedDate": {
                                                                "type": "string",
                                                                "format": "date-time",
                                                                "example": "2025-09-15T18:23:28.770Z"
                                                            },
                                                            "LastUpdatedBy": {
                                                                "type": "string",
                                                                "example": "OpsSecurEyes01@Secureyesdev.com-AddUser"
                                                            },
                                                            "ModuleName": {
                                                                "type": "string",
                                                                "example": "Business Continuity Management"
                                                            },
                                                            "ModuleAbbreviation": {
                                                                "type": "string",
                                                                "example": "BCM"
                                                            },
                                                            "IsSelected": {
                                                                "type": "boolean",
                                                                "example": true
                                                            },
                                                            "headColor": {
                                                                "type": "string",
                                                                "example": "#F4E0E0"
                                                            },
                                                            "rowColor": {
                                                                "type": "string",
                                                                "example": "#FAF7F7"
                                                            }
                                                        }
                                                    }
                                                },
                                                "Units": {
                                                    "type": "array",
                                                    "items": {
                                                        "type": "object",
                                                        "properties": {
                                                            "UserUnitID": {
                                                                "type": "integer",
                                                                "example": 247
                                                            },
                                                            "UnitID": {
                                                                "type": "integer",
                                                                "example": 43
                                                            },
                                                            "UserGUID": {
                                                                "type": "string",
                                                                "example": "DC2DC289-FD8E-F011-9FC1-000C29AAA2A1"
                                                            },
                                                            "IsDefault": {
                                                                "type": "boolean",
                                                                "example": false
                                                            },
                                                            "IsActive": {
                                                                "type": "boolean",
                                                                "example": true
                                                            },
                                                            "IsDeleted": {
                                                                "type": "boolean",
                                                                "example": false
                                                            },
                                                            "CreatedDate": {
                                                                "type": "string",
                                                                "format": "date-time",
                                                                "example": "2025-09-11T16:23:24.770Z"
                                                            },
                                                            "CreatedBy": {
                                                                "type": "string",
                                                                "example": "OpsSecurEyes01-AddUser"
                                                            },
                                                            "LastUpdatedDate": {
                                                                "type": "string",
                                                                "format": "date-time",
                                                                "example": "2025-09-15T18:23:28.773Z"
                                                            },
                                                            "LastUpdatedBy": {
                                                                "type": "string",
                                                                "example": "OpsSecurEyes01@Secureyesdev.com-AddUser"
                                                            },
                                                            "UserName": {
                                                                "type": "string",
                                                                "example": "UserName"
                                                            },
                                                            "UnitName": {
                                                                "type": "string",
                                                                "example": "Compliance."
                                                            },
                                                            "GroupID": {
                                                                "type": "integer",
                                                                "example": 1008
                                                            },
                                                            "GroupName": {
                                                                "type": "string",
                                                                "example": "Compliance."
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }


                                }

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
