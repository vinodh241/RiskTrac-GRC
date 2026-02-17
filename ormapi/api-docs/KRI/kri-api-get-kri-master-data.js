module.exports = {
    tags: ["KRI"],
    description:
        "Description: \n- This api is responsible for getting kri master data from DB.",
    operationId: "getKRIMasterData",
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
                            example: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJEQzJEQzI4OS1GRDhFLUYwMTEtOUZDMS0wMDBDMjlBQUEyQTEiLCJ1c2VyTmFtZSI6IkZhemlsTUYiLCJpYXQiOjE3NjA0MzUzOTgsImFjY291bnROYW1lIjoiU0UwMiIsImV4cCI6MTc2MDQ0MjYwM30.K2PyNieSk_8lTIKKf47UGqZkFLefxgEr6KErb06mD5w"
                        },
                    },
                },
            },
        },
    },
    responses: {
        200: {
            description: "Data fetch from DB successful.",
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
                                    measurementFrequencies: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                FrequencyID: { type: "integer" },
                                                Name: { type: "string" },
                                                Description: { type: "string" },
                                                IsActive: { type: "boolean" }
                                            },
                                            example: [
                                                {
                                                    FrequencyID: 1,
                                                    Name: "Monthly",
                                                    Description: "1 Month",
                                                    IsActive: true
                                                },
                                                {
                                                    "FrequencyID": 2,
                                                    "Name": "Quarterly",
                                                    "Description": "3 Months",
                                                    "IsActive": true
                                                },
                                                {
                                                    "FrequencyID": 3,
                                                    "Name": "Semi Annual",
                                                    "Description": "6 Months",
                                                    "IsActive": true
                                                },
                                                {
                                                    "FrequencyID": 4,
                                                    "Name": "Annually",
                                                    "Description": "12 Months",
                                                    "IsActive": true
                                                },
                                            ]
                                        }
                                    },

                                    types: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                TypeID: { type: "integer" },
                                                Name: { type: "string" },
                                                IsActive: { type: "boolean" }
                                            },
                                            example: [
                                                {
                                                    "TypeID": 1,
                                                    "Name": "Processsss NEWW ",
                                                    "IsActive": true
                                                },
                                                {
                                                    "TypeID": 2,
                                                    "Name": "Technologyies",
                                                    "IsActive": true
                                                },
                                                {
                                                    "TypeID": 3,
                                                    "Name": "People ",
                                                    "IsActive": true
                                                },
                                                {
                                                    "TypeID": 6,
                                                    "Name": "Operation",
                                                    "IsActive": true
                                                },
                                                {
                                                    "TypeID": 7,
                                                    "Name": "Operation",
                                                    "IsActive": true
                                                },
                                                {
                                                    "TypeID": 8,
                                                    "Name": "Operation",
                                                    "IsActive": true
                                                },
                                                {
                                                    "TypeID": 9,
                                                    "Name": "Operation",
                                                    "IsActive": true
                                                },
                                                {
                                                    "TypeID": 10,
                                                    "Name": "Operation",
                                                    "IsActive": true
                                                }
                                            ]
                                        }
                                    },

                                    reportingFrequencies: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                FrequencyID: { type: "integer" },
                                                Name: { type: "string" },
                                                Description: { type: "string" },
                                                InUse: { type: "boolean" },
                                                IsActive: { type: "boolean" },
                                                GracePeriodDays: { type: "integer" },
                                                LastUpdatedDate: { type: "string", format: "date-time" },
                                                reminderdays: { type: "integer" }
                                            },
                                            example: [
                                                {
                                                    FrequencyID: 1,
                                                    Name: "Monthly",
                                                    Description: "1 Month",
                                                    InUse: true,
                                                    IsActive: true,
                                                    GracePeriodDays: 7,
                                                    LastUpdatedDate: "2025-10-23T15:03:02.507Z",
                                                    reminderdays: 10
                                                },
                                                {
                                                    "FrequencyID": 2,
                                                    "Name": "Quarterly",
                                                    "Description": "3 Months",
                                                    "InUse": false,
                                                    "IsActive": true,
                                                    "GracePeriodDays": 15,
                                                    "LastUpdatedDate": "2025-10-13T15:01:27.730Z",
                                                    "reminderdays": 6
                                                },
                                                {
                                                    "FrequencyID": 3,
                                                    "Name": "Semi Annual",
                                                    "Description": "6 Months",
                                                    "InUse": false,
                                                    "IsActive": true,
                                                    "GracePeriodDays": 15,
                                                    "LastUpdatedDate": "2025-10-07T18:36:48.827Z",
                                                    "reminderdays": 10
                                                },
                                                {
                                                    "FrequencyID": 4,
                                                    "Name": "Annually",
                                                    "Description": "12 Months",
                                                    "InUse": false,
                                                    "IsActive": true,
                                                    "GracePeriodDays": 10,
                                                    "LastUpdatedDate": "2025-10-07T18:36:48.827Z",
                                                    "reminderdays": 30
                                                }
                                            ]
                                        }
                                    },

                                    status: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                StatusID: { type: "integer" },
                                                Name: { type: "string" }
                                            },
                                            example: [
                                                {
                                                    StatusID: 1,
                                                    Name: "Measured"
                                                },
                                                {
                                                    "StatusID": 2,
                                                    "Name": "Not Measured"
                                                }
                                            ]
                                        }
                                    },

                                    thresholdValue: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                ThresholdID: { type: "integer" },
                                                Value: { type: "integer" },
                                                ColorCode: { type: "string" },
                                                IsActive: { type: "boolean" },
                                                Name: { type: "string" }
                                            },
                                            example: [
                                                {
                                                    "ThresholdID": 1,
                                                    "Value": 1,
                                                    "ColorCode": "#dd00ff",
                                                    "IsActive": true,
                                                    "Name": "Redd NEWW"
                                                },
                                                {
                                                    "ThresholdID": 2,
                                                    "Value": 2,
                                                    "ColorCode": "#FFBF00",
                                                    "IsActive": true,
                                                    "Name": "Amber NEWWW"
                                                },
                                                {
                                                    "ThresholdID": 3,
                                                    "Value": 3,
                                                    "ColorCode": "#FFA500",
                                                    "IsActive": true,
                                                    "Name": "Orange Zone"
                                                },
                                                {
                                                    "ThresholdID": 4,
                                                    "Value": 4,
                                                    "ColorCode": "#FFFF00",
                                                    "IsActive": true,
                                                    "Name": "Yellow Zone"
                                                },
                                                {
                                                    "ThresholdID": 5,
                                                    "Value": 5,
                                                    "ColorCode": "#008000",
                                                    "IsActive": true,
                                                    "Name": "Green Zone"
                                                }
                                            ]
                                        }
                                    },

                                    emailData: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                EmailFrequencyID: { type: "integer" },
                                                ReportingFrequencyID: { type: "integer" },
                                                Month: { type: "string" },
                                                InUse: { type: "boolean" },
                                                IsActive: { type: "boolean" },
                                                Day: { type: "string" },
                                                Description: { type: "boolean" },
                                                IsDeleted: { type: "boolean" }
                                            },
                                            example: [
                                                {
                                                    "EmailFrequencyID": 1,
                                                    "ReportingFrequencyID": 1,
                                                    "Month": "Month 1",
                                                    "InUse": true,
                                                    "IsActive": true,
                                                    "Day": "Day 5",
                                                    "Description": true,
                                                    "IsDeleted": false
                                                },
                                                {
                                                    "EmailFrequencyID": 2,
                                                    "ReportingFrequencyID": 2,
                                                    "Month": "Month 3",
                                                    "InUse": false,
                                                    "IsActive": true,
                                                    "Day": "Day 5",
                                                    "Description": false,
                                                    "IsDeleted": false
                                                },
                                                {
                                                    "EmailFrequencyID": 3,
                                                    "ReportingFrequencyID": 3,
                                                    "Month": "Month 6",
                                                    "InUse": false,
                                                    "IsActive": true,
                                                    "Day": "Day 25",
                                                    "Description": false,
                                                    "IsDeleted": false
                                                },
                                                {
                                                    "EmailFrequencyID": 4,
                                                    "ReportingFrequencyID": 4,
                                                    "Month": "Month 12",
                                                    "InUse": false,
                                                    "IsActive": true,
                                                    "Day": "Day 25",
                                                    "Description": false,
                                                    "IsDeleted": false
                                                }
                                            ]
                                        }
                                    },

                                    reviewFrequencies: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                ReviewerID: { type: "integer" },
                                                FullName: { type: "string" },
                                                UserGUID: { type: "string" },
                                                IsDeleted: { type: "boolean" },
                                                IsActive: { type: "boolean" }
                                            },
                                            example: [
                                                {
                                                    "ReviewerID": 1,
                                                    "FullName": "Sangram BCM SE Bhuyan",
                                                    "UserGUID": "DF220D15-DCC1-EF11-9453-000C29318C88",
                                                    "IsDeleted": false,
                                                    "IsActive": true
                                                },
                                                {
                                                    "ReviewerID": 2,
                                                    "FullName": "Bhubanananda SE Tripathy",
                                                    "UserGUID": "0DD648A7-EBC1-EF11-9453-000C29318C88",
                                                    "IsDeleted": false,
                                                    "IsActive": true
                                                },
                                                {
                                                    "ReviewerID": 3,
                                                    "FullName": "Sinchana SE UserTwo",
                                                    "UserGUID": "13A3F9B0-A2D8-EF11-9473-000C29318C88",
                                                    "IsDeleted": false,
                                                    "IsActive": false
                                                },
                                                {
                                                    "ReviewerID": 4,
                                                    "FullName": "Sinchana SE UserOne",
                                                    "UserGUID": "CC4378E8-DCC1-EF11-9453-000C29318C88",
                                                    "IsDeleted": false,
                                                    "IsActive": false
                                                },
                                                {
                                                    "ReviewerID": 7,
                                                    "FullName": "Mohamed  Fazil",
                                                    "UserGUID": "DC2DC289-FD8E-F011-9FC1-000C29AAA2A1",
                                                    "IsDeleted": false,
                                                    "IsActive": true
                                                },
                                                {
                                                    "ReviewerID": 8,
                                                    "FullName": "GRC SE Three",
                                                    "UserGUID": "3313187D-DAC1-EF11-9453-000C29318C88",
                                                    "IsDeleted": false,
                                                    "IsActive": true
                                                }
                                            ]
                                        }
                                    },

                                    userList: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                UserGUID: { type: "string" },
                                                FullName: { type: "string" },
                                                UserName: { type: "string" }
                                            },
                                            example: [
                                                {
                                                    "UserGUID": "CF37782C-CBC1-EF11-9453-000C29318C88",
                                                    "FullName": "GRC SE User One",
                                                    "UserName": "GRCAuditorUser1"
                                                },
                                                {
                                                    "UserGUID": "F8BE567B-CFC1-EF11-9453-000C29318C88",
                                                    "FullName": "user SE test A",
                                                    "UserName": "useradmin"
                                                },
                                                {
                                                    "UserGUID": "3313187D-DAC1-EF11-9453-000C29318C88",
                                                    "FullName": "GRC SE Three",
                                                    "UserName": "GRCUser003"
                                                },
                                                {
                                                    "UserGUID": "DF220D15-DCC1-EF11-9453-000C29318C88",
                                                    "FullName": "Sangram BCM SE Bhuyan",
                                                    "UserName": "Sangram"
                                                },
                                                {
                                                    "UserGUID": "CC4378E8-DCC1-EF11-9453-000C29318C88",
                                                    "FullName": "Sinchana SE UserOne",
                                                    "UserName": "Sinchana1"
                                                },
                                                {
                                                    "UserGUID": "45666691-E9C1-EF11-9453-000C29318C88",
                                                    "FullName": "Niranjan SE Srichandan",
                                                    "UserName": "GRCUserAdmin"
                                                },
                                                {
                                                    "UserGUID": "0DD648A7-EBC1-EF11-9453-000C29318C88",
                                                    "FullName": "Bhubanananda SE Tripathy",
                                                    "UserName": "Bhuban"
                                                },
                                                {
                                                    "UserGUID": "9BC3ABFB-83C3-EF11-9456-000C29318C88",
                                                    "FullName": "GRC Admin Pro",
                                                    "UserName": "GRCAdminPro"
                                                },
                                                {
                                                    "UserGUID": "ABD9467E-74C6-EF11-945A-000C29318C88",
                                                    "FullName": "Vandana SE GRC NIne",
                                                    "UserName": "GRCUser009"
                                                },
                                                {
                                                    "UserGUID": "FC3BD0F9-6FCE-EF11-9466-000C29318C88",
                                                    "FullName": "Debadatta SE Jena",
                                                    "UserName": "Debadatta"
                                                },
                                                {
                                                    "UserGUID": "B4A0CDE4-F4D7-EF11-9472-000C29318C88",
                                                    "FullName": "Test SE Two",
                                                    "UserName": "testuser2"
                                                },
                                                {
                                                    "UserGUID": "13A3F9B0-A2D8-EF11-9473-000C29318C88",
                                                    "FullName": "Sinchana SE UserTwo",
                                                    "UserName": "Sinchana2"
                                                },
                                                {
                                                    "UserGUID": "B1FFB063-72D9-EF11-9474-000C29318C88",
                                                    "FullName": "Amrutanshu SE One",
                                                    "UserName": "Amrutanshu1"
                                                },
                                                {
                                                    "UserGUID": "DDE7A678-97DC-EF11-9478-000C29318C88",
                                                    "FullName": "Sangram SE K",
                                                    "UserName": "SangramK"
                                                },
                                                {
                                                    "UserGUID": "DC2DC289-FD8E-F011-9FC1-000C29AAA2A1",
                                                    "FullName": "Mohamed  Fazil",
                                                    "UserName": "FazilMF"
                                                },
                                                {
                                                    "UserGUID": "2217DFBE-2D92-F011-9FC1-000C29AAA2A1",
                                                    "FullName": "MD  Faz",
                                                    "UserName": "FazilChecker"
                                                },
                                                {
                                                    "UserGUID": "F8313E01-F39D-F011-9FC1-000C29AAA2A1",
                                                    "FullName": "Nilesh Middle Last",
                                                    "UserName": "Nilesh"
                                                }
                                            ]
                                        }
                                    },

                                    updatedFrequency: {
                                        type: "array",
                                        items: {
                                            type: "object"
                                        },
                                        example: []
                                    },

                                    inherentRisks: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                InherentRiskID: { type: "integer" },
                                                SLNO: { type: "string" },
                                                UnitID: { type: "integer" },
                                                Risk: { type: "string" }
                                            },
                                            example: [
                                                {
                                                    "InherentRiskID": 22,
                                                    "SLNO": "CS-014",
                                                    "UnitID": 1,
                                                    "Risk": "Inherent Risk Bulk Upload Cyber Security Department 10"
                                                },
                                                {
                                                    "InherentRiskID": 23,
                                                    "SLNO": "CS-015",
                                                    "UnitID": 1,
                                                    "Risk": "Inherent Risk Bulk Upload Cyber Security Department 11"
                                                },
                                                {
                                                    "InherentRiskID": 24,
                                                    "SLNO": "CS-016",
                                                    "UnitID": 1,
                                                    "Risk": "Inherent Risk Bulk Upload Cyber Security Department 12"
                                                },
                                                {
                                                    "InherentRiskID": 30,
                                                    "SLNO": "RC-003",
                                                    "UnitID": 2,
                                                    "Risk": "RE RCSA Risk 02 update to check KRI definition screen"
                                                },
                                                {
                                                    "InherentRiskID": 34,
                                                    "SLNO": "CS-024",
                                                    "UnitID": 1,
                                                    "Risk": "firec catching"
                                                },
                                                {
                                                    "InherentRiskID": 35,
                                                    "SLNO": "CS-025",
                                                    "UnitID": 1,
                                                    "Risk": "Added Risk"
                                                },
                                                {
                                                    "InherentRiskID": 36,
                                                    "SLNO": "CS-026",
                                                    "UnitID": 1,
                                                    "Risk": "failuer"
                                                }
                                            ]
                                        }
                                    }
                                }
                            },

                            token: {
                                type: "string",
                                description: "JWT authentication token",
                                example: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJEQzJEQzI4OS1GRDhFLUYwMTEtOUZDMS0wMDBDMjlBQUEyQTEiLCJ1c2VyTmFtZSI6IkZhemlsTUYiLCJpYXQiOjE3NjA0MzUzOTgsImFjY291bnROYW1lIjoiU0UwMiIsImV4cCI6MTc2MDQ0MjYwM30.K2PyNieSk_8lTIKKf47UGqZkFLefxgEr6KErb06mD5w",
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
