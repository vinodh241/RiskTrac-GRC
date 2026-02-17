module.exports = {
    tags: ["User Management"],
    description:
        "Description: \n- This api is responsible for getting the user's Assigned units, modules info DB.\n- This will includes all the user's modules info, units info, Role of the user",
    operationId: "getAssignedUserInfo",
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
                            example: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiI0RTlGMkFCRC1DMUMzLUVGMTEtOTQ1Ni0wMDBDMjkzMThDODgiLCJ1c2VyTmFtZSI6Ik9wc1NlY3VyRXllczAxQFNlY3VyZXllc2Rldi5jb20iLCJpYXQiOjE3NTg3MDU1NjQsImFjY291bnROYW1lIjoiU0UwMiIsImV4cCI6MTc1ODcxMjc2OX0.tAdQ5wxlFZ9kfW7_2QEmgP_LTUR0FIPc-g0W7FJSoxw"
                        },
                    },
                },
            },
        },
    },
    responses: {
        200: {
            description: "Successful feteched user details from AD",
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
                            "result": {
                                "type": "object",
                                "properties": {
                                    "userAccountData": {
                                        "type": "array",
                                        "items": {
                                            "type": "object",
                                            "properties": {
                                                "Name": {
                                                    "type": "string",
                                                    "description": "Account name",
                                                    "example": "SecurEyes"
                                                },
                                                "Abbreviation": {
                                                    "type": "string",
                                                    "description": "Account abbreviation",
                                                    "example": "SE"
                                                },
                                                "Description": {
                                                    "type": "string",
                                                    "description": "Account description",
                                                    "example": "Description of the account"
                                                },
                                                "UserCounts": {
                                                    "type": "integer",
                                                    "description": "Number of users in account",
                                                    "example": 50
                                                },
                                                "IsActive": {
                                                    "type": "boolean",
                                                    "description": "Account active status",
                                                    "example": true
                                                },
                                                "IsDeleted": {
                                                    "type": "boolean",
                                                    "description": "Account deleted status",
                                                    "example": false
                                                },
                                                "CreatedDate": {
                                                    "type": "string",
                                                    "format": "date-time",
                                                    "description": "Account creation date",
                                                    "example": "2024-12-24T01:18:47.843Z"
                                                },
                                                "CreatedBy": {
                                                    "type": "string",
                                                    "description": "Account created by",
                                                    "example": "boda.sagar@secureyesdev.com"
                                                },
                                                "LastUpdatedDate": {
                                                    "type": "string",
                                                    "format": "date-time",
                                                    "description": "Last updated date",
                                                    "example": "2024-12-27T01:10:06.813Z"
                                                },
                                                "LastUpdatedBy": {
                                                    "type": "string",
                                                    "description": "Last updated by",
                                                    "example": "BASE SCRIPT"
                                                },
                                                "SubscriptionDetails": {
                                                    "type": "string",
                                                    "description": "JSON string containing subscription details",
                                                    "example": null
                                                }
                                            },
                                        }
                                    },
                                    "authorizedModuleData": {
                                        "type": "array",
                                        "items": {
                                            "type": "object",
                                            "properties": {
                                                "ModuleGUID": {
                                                    "type": "string",
                                                    "description": "Module GUID",
                                                    "example": "B26FB4D8-BC87-EF11-9FAE-000C29AAA2A1"
                                                },
                                                "Name": {
                                                    "type": "string",
                                                    "description": "Module name",
                                                    "example": "Operational Risk Management"
                                                },
                                                "Abbreviation": {
                                                    "type": "string",
                                                    "description": "Module abbreviation",
                                                    "example": "ORM"
                                                },
                                                "API": {
                                                    "type": "string",
                                                    "nullable": true,
                                                    "description": "API endpoint",
                                                    "example": null
                                                },
                                                "WEB": {
                                                    "type": "string",
                                                    "nullable": true,
                                                    "description": "Web endpoint",
                                                    "example": null
                                                },
                                                "Description": {
                                                    "type": "string",
                                                    "nullable": true,
                                                    "description": "Module description",
                                                    "example": null
                                                },
                                                "OwnerUnitID": {
                                                    "type": "integer",
                                                    "nullable": true,
                                                    "description": "Owner unit ID",
                                                    "example": 5
                                                },
                                                "IsActive": {
                                                    "type": "boolean",
                                                    "description": "Module active status",
                                                    "example": true
                                                },
                                                "IsDeleted": {
                                                    "type": "boolean",
                                                    "description": "Module deleted status",
                                                    "example": false
                                                },
                                                "CreatedDate": {
                                                    "type": "string",
                                                    "format": "date-time",
                                                    "description": "Module creation date",
                                                    "example": "2024-12-24T01:13:07.040Z"
                                                },
                                                "CreatedBy": {
                                                    "type": "string",
                                                    "description": "Module created by",
                                                    "example": "BASE SCRIPT"
                                                },
                                                "LastUpdatedDate": {
                                                    "type": "string",
                                                    "format": "date-time",
                                                    "description": "Last updated date",
                                                    "example": "2024-12-24T01:13:07.040Z"
                                                },
                                                "LastUpdatedBy": {
                                                    "type": "string",
                                                    "description": "Last updated by",
                                                    "example": "BASE SCRIPT"
                                                }
                                            },
                                        }
                                    },
                                    "roleData": {
                                        "type": "array",
                                        "items": {
                                            "type": "object",
                                            "properties": {
                                                "RoleID": {
                                                    "type": "integer",
                                                    "description": "Role identifier",
                                                    "example": 1
                                                },
                                                "Name": {
                                                    "type": "string",
                                                    "description": "Role name",
                                                    "example": "SuperAdmin"
                                                },
                                                "Description": {
                                                    "type": "string",
                                                    "description": "Role description",
                                                    "example": "Super Admin"
                                                },
                                                "Abbreviation": {
                                                    "type": "string",
                                                    "description": "Role abbreviation",
                                                    "example": "SA"
                                                },
                                                "IsActive": {
                                                    "type": "boolean",
                                                    "description": "Role active status",
                                                    "example": true
                                                },
                                                "IsDeleted": {
                                                    "type": "boolean",
                                                    "description": "Role deleted status",
                                                    "example": false
                                                },
                                                "CreatedDate": {
                                                    "type": "string",
                                                    "format": "date-time",
                                                    "description": "Role creation date",
                                                    "example": "2024-12-24T01:13:07.117Z"
                                                },
                                                "CreatedBy": {
                                                    "type": "string",
                                                    "description": "Role created by",
                                                    "example": "BASE SCRIPT"
                                                },
                                                "LastUpdatedDate": {
                                                    "type": "string",
                                                    "format": "date-time",
                                                    "description": "Last updated date",
                                                    "example": "2024-12-24T01:13:07.117Z"
                                                },
                                                "LastUpdatedBy": {
                                                    "type": "string",
                                                    "description": "Last updated by",
                                                    "example": "BASE SCRIPT"
                                                },
                                                "AccountGUID": {
                                                    "type": "string",
                                                    "nullable": true,
                                                    "description": "Associated account GUID",
                                                    "example": null
                                                }
                                            },
                                        }
                                    },
                                    "userUnitData": {
                                        "type": "array",
                                        "items": {
                                            "type": "object",
                                            "properties": {
                                                "UserName": {
                                                    "type": "string",
                                                    "description": "Username",
                                                    "example": null
                                                },
                                                "UnitID": {
                                                    "type": "integer",
                                                    "description": "Unit ID",
                                                    "example": 1
                                                },
                                                "UnitName": {
                                                    "type": "string",
                                                    "description": "Unit name",
                                                    "example": "Cyber Security"
                                                },
                                                "Abbreviation": {
                                                    "type": "string",
                                                    "description": "Unit abbreviation",
                                                    "example": "CS"
                                                }
                                            },
                                        }
                                    },
                                    "groupData": {
                                        "type": "array",
                                        "items": {
                                            "type": "object",
                                            "properties": {
                                                "GroupID": {
                                                    "type": "integer",
                                                    "description": "Group identifier",
                                                    "example": 1
                                                },
                                                "Name": {
                                                    "type": "string",
                                                    "description": "Group name",
                                                    "example": "Credit & Risk"
                                                },
                                                "Abbreviation": {
                                                    "type": "string",
                                                    "description": "Group abbreviation",
                                                    "example": "CRR"
                                                },
                                                "Description": {
                                                    "type": "string",
                                                    "description": "Group description",
                                                    "example": "Credit & Risk"
                                                },
                                                "IsActive": {
                                                    "type": "boolean",
                                                    "description": "Group active status",
                                                    "example": true
                                                },
                                                "IsDeleted": {
                                                    "type": "boolean",
                                                    "description": "Group deleted status",
                                                    "example": false
                                                },
                                                "CreatedDate": {
                                                    "type": "string",
                                                    "format": "date-time",
                                                    "description": "Group creation date",
                                                    "example": "2024-12-24T01:13:07.187Z"
                                                },
                                                "CreatedBy": {
                                                    "type": "string",
                                                    "description": "Group created by",
                                                    "example": "BASE SCRIPT"
                                                },
                                                "LastUpdatedDate": {
                                                    "type": "string",
                                                    "format": "date-time",
                                                    "description": "Last updated date",
                                                    "example": "2024-12-27T11:14:35.053Z"
                                                },
                                                "LastUpdatedBy": {
                                                    "type": "string",
                                                    "description": "Last updated by",
                                                    "example": "BASE SCRIPT"
                                                }
                                            },
                                        }
                                    },
                                    "auditorRoleData": {
                                        "type": "array",
                                        "items": {
                                            "type": "object",
                                            "properties": {
                                                "AuditorRoleID": {
                                                    "type": "integer",
                                                    "description": "Auditor role identifier",
                                                    "example": 4
                                                },
                                                "AuditorRoleName": {
                                                    "type": "string",
                                                    "description": "Auditor role name",
                                                    "example": "Super User"
                                                },
                                                "Description": {
                                                    "type": "string",
                                                    "description": "Auditor role description",
                                                    "example": "Used by the application support team to provide level 2 support to users"
                                                },
                                                "IsActive": {
                                                    "type": "boolean",
                                                    "description": "Auditor role active status",
                                                    "example": true
                                                },
                                                "IsDeleted": {
                                                    "type": "boolean",
                                                    "description": "Auditor role deleted status",
                                                    "example": false
                                                },
                                                "CreatedDate": {
                                                    "type": "string",
                                                    "format": "date-time",
                                                    "description": "Auditor role creation date",
                                                    "example": "2024-12-24T01:13:17.187Z"
                                                },
                                                "CreatedBy": {
                                                    "type": "string",
                                                    "description": "Auditor role created by",
                                                    "example": "BASE SCRIPT"
                                                },
                                                "LastUpdatedDate": {
                                                    "type": "string",
                                                    "format": "date-time",
                                                    "description": "Last updated date",
                                                    "example": "2024-12-24T01:13:17.187Z"
                                                },
                                                "LastUpdatedBy": {
                                                    "type": "string",
                                                    "description": "Last updated by",
                                                    "example": "BASE SCRIPT"
                                                },
                                                "CanBeAssigned": {
                                                    "type": "string",
                                                    "description": "Indicates if the role can be assigned",
                                                    "example": "1"
                                                }
                                            },
                                        }
                                    },
                                    "domainData": {
                                        "type": "array",
                                        "items": {
                                            "type": "object",
                                            "properties": {
                                                "DomainName": {
                                                    "type": "string",
                                                    "description": "Domain name",
                                                    "example": ""
                                                },
                                                "EmailDomain": {
                                                    "type": "string",
                                                    "description": "Email domain",
                                                    "example": "secureyes.net"
                                                }
                                            },
                                        }
                                    },
                                    "userModuleRoleData": {
                                        "type": "array",
                                        "items": {
                                            "type": "object",
                                            "properties": {
                                                "ModuleUserRoleID": {
                                                    "type": "integer",
                                                    "description": "Module user role ID",
                                                    "example": null
                                                },
                                                "ModuleGUID": {
                                                    "type": "string",
                                                    "description": "Module GUID",
                                                    "example": null
                                                },
                                                "UserGUID": {
                                                    "type": "string",
                                                    "description": "User GUID",
                                                    "example": null
                                                },
                                                "RoleID": {
                                                    "type": "integer",
                                                    "description": "Role ID",
                                                    "example": 5
                                                },
                                                "IsFunctionalAdmin": {
                                                    "type": "boolean",
                                                    "description": "Functional admin status",
                                                    "example": false
                                                },
                                                "IsActive": {
                                                    "type": "boolean",
                                                    "description": "Active status",
                                                    "example": null
                                                },
                                                "IsDeleted": {
                                                    "type": "boolean",
                                                    "description": "Deleted status",
                                                    "example": null
                                                },
                                                "CreatedDate": {
                                                    "type": "string",
                                                    "format": "date-time",
                                                    "description": "Creation date",
                                                    "example": null
                                                },
                                                "CreatedBy": {
                                                    "type": "string",
                                                    "description": "Created by",
                                                    "example": null
                                                },
                                                "LastUpdatedDate": {
                                                    "type": "string",
                                                    "format": "date-time",
                                                    "description": "Last updated date",
                                                    "example": null
                                                },
                                                "LastUpdatedBy": {
                                                    "type": "string",
                                                    "description": "Last updated by",
                                                    "example": null
                                                },
                                                "ModuleName": {
                                                    "type": "string",
                                                    "description": "Module name",
                                                    "example": "Operational Risk Management"
                                                },
                                                "Abbreviation": {
                                                    "type": "string",
                                                    "description": "Module abbreviation",
                                                    "example": "ORM"
                                                },
                                                "SubscriptionDetails": {
                                                    "type": "string",
                                                    "description": "JSON string containing subscription details",
                                                    "example": null
                                                }
                                            },
                                        }
                                    },
                                    "moduleList": {
                                        "type": "array",
                                        "items": {
                                            "type": "object",
                                            "properties": {
                                                "ModuleAbbreviation": {
                                                    "type": "string",
                                                    "description": "Module abbreviation",
                                                    "example": "ORM"
                                                },
                                                "ModuleName": {
                                                    "type": "string",
                                                    "description": "Module name",
                                                    "example": "Operational Risk Management"
                                                }
                                            },
                                            "required": ["ModuleAbbreviation", "ModuleName"]
                                        }
                                    },
                                    "authenticationModeData": {
                                        "type": "object",
                                        "properties": {
                                            "authenticationMode": {
                                                "type": "integer",
                                                "description": "Authentication mode identifier",
                                                "example": 3
                                            }
                                        },
                                    },
                                    "validationRulesData": {
                                        "type": "array",
                                        "items": {
                                            "type": "object",
                                            "properties": {
                                                "ValidateMobNo": {
                                                    "type": "boolean",
                                                    "description": "Indicates if mobile number validation is required",
                                                    "example": true
                                                },
                                                "MobNoRange": {
                                                    "type": "array",
                                                    "items": {
                                                        "type": "integer"
                                                    },
                                                    "description": "Range for mobile number length",
                                                    "example": [6, 15]
                                                },
                                                "validateEmailIDDomain": {
                                                    "type": "boolean",
                                                    "description": "Indicates if email domain validation is required",
                                                    "example": false
                                                }
                                            },
                                        }
                                    },
                                    "userNameRulesData": {
                                        "type": "object",
                                        "properties": {
                                            "MIN_LENGTH": {
                                                "type": "integer",
                                                "description": "Minimum length for username",
                                                "example": 6
                                            },
                                            "MAX_LENGTH": {
                                                "type": "integer",
                                                "description": "Maximum length for username",
                                                "example": 50
                                            },
                                            "REGEXP_REFERENCE": {
                                                "type": "string",
                                                "description": "Regular expression for username validation",
                                                "example": "^[a-zA-Z][a-zA-Z0-9]*$"
                                            },
                                            "MESSAGE": {
                                                "type": "string",
                                                "description": "Validation message for username",
                                                "example": "User Name should contain (A-Z,a-z), (0-9) and 6 - 50 characters long."
                                            }
                                        },
                                    },
                                    "allowedModuleData": {
                                        "type": "object",
                                        "properties": {
                                            "AllowedModuleAbbreviation": {
                                                "type": "array",
                                                "items": {
                                                    "type": "string"
                                                },
                                                "description": "List of allowed module abbreviations",
                                                "example": ["ORM", "BCM"]
                                            }
                                        },
                                    },
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
