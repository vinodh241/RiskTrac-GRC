module.exports = {
    tags: ["KRI"],
    description:
        "Description: \n- This api is responsible for setting kri's when go to KRI definition page and create a new KRI this api will get called.",
    operationId: "setKRIDefinitions",
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
                            type: "object",
                            properties: {
                                KriCode: { type: "string" },
                                UnitID: { type: "integer" },
                                KeyRiskIndicator: { type: "string" },
                                MeasurementFrequencyID: { type: "integer" },
                                KriTypeID: { type: "integer" },
                                ReportingFrequencyID: { type: "integer" },
                                ThresholdValue1: { type: "number" },
                                ThresholdValue2: { type: "number" },
                                ThresholdValue3: { type: "number" },
                                ThresholdValue4: { type: "number" },
                                ThresholdValue5: { type: "number" },
                                emailfrequencyID: { type: "number" },
                                InherentRiskID: { type: ["integer", "null"] },
                            },
                            example: {
                                "kriCode": null,
                                "unitID": 1,
                                "keyRiskIndicator": "KRI-CS",
                                "measurementFrequencyID": 1,
                                "kriTpyeID": 1,
                                "reportingFrequencyID": 1,
                                "thresholdValue5": 100,
                                "thresholdValue4": 70,
                                "thresholdValue3": 40,
                                "thresholdValue2": 20,
                                "thresholdValue1": 0,
                                "emailfrequencyID": 1,
                                "InherentRiskID": 22
                            },
                        },
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
                                    kriData: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                KriCode: { type: "string" },
                                                MetricID: { type: "string" },
                                                UnitID: { type: "integer" },
                                                UnitName: { type: "string" },
                                                KeyRiskIndicator: { type: "string" },
                                                MeasurementFrequencyID: { type: "integer" },
                                                ReportingFrequencyID: { type: "integer" },
                                                Target: { type: "number" },
                                                KriTypeID: { type: "integer" },
                                                KriTypeName: { type: "string" },
                                                ThresholdValue1: { type: "number" },
                                                ThresholdValue2: { type: "number" },
                                                ThresholdValue3: { type: "number" },
                                                ThresholdValue4: { type: "number" },
                                                ThresholdValue5: { type: "number" },
                                                InherentRiskID: { type: ["integer", "null"] },
                                            },
                                            example: [
                                                {
                                                    "KriCode": "KRI-CS-036",
                                                    "MetricID": "153",
                                                    "UnitID": 1,
                                                    "UnitName": "Cyber Security",
                                                    "KeyRiskIndicator": "KRI-CS",
                                                    "MeasurementFrequencyID": 1,
                                                    "ReportingFrequencyID": 1,
                                                    "Target": 100,
                                                    "KriTypeID": 1,
                                                    "KriTypeName": "Processsss NEWW ",
                                                    "ThresholdValue1": 0,
                                                    "ThresholdValue2": 20,
                                                    "ThresholdValue3": 40,
                                                    "ThresholdValue4": 70,
                                                    "ThresholdValue5": 100,
                                                    "InherentRiskID": 22
                                                }
                                            ]
                                        }
                                    },
                                    groups: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                GroupID: { type: "integer" },
                                                GroupName: { type: "string" }
                                            },
                                            example: [
                                                { GroupID: 1, GroupName: "Credit & Risk" },
                                                {
                                                    "GroupID": 2,
                                                    "GroupName": "Operations & Shared Services"
                                                },
                                                {
                                                    "GroupID": 3,
                                                    "GroupName": "Legal and Governance"
                                                },
                                                {
                                                    "GroupID": 4,
                                                    "GroupName": "Finance & Accounting"
                                                },
                                                {
                                                    "GroupID": 5,
                                                    "GroupName": "Strategy & Marketing"
                                                },
                                                {
                                                    "GroupID": 6,
                                                    "GroupName": "HR & Admin"
                                                },
                                                {
                                                    "GroupID": 7,
                                                    "GroupName": "Retail Group"
                                                },
                                                {
                                                    "GroupID": 8,
                                                    "GroupName": "Corporate Group"
                                                },
                                                {
                                                    "GroupID": 9,
                                                    "GroupName": "Internal Audit"
                                                },
                                                {
                                                    "GroupID": 1001,
                                                    "GroupName": "Finance"
                                                },
                                                {
                                                    "GroupID": 1002,
                                                    "GroupName": "Compliance & AML"
                                                },
                                                {
                                                    "GroupID": 1003,
                                                    "GroupName": "Retail"
                                                },
                                                {
                                                    "GroupID": 1004,
                                                    "GroupName": "Corporate"
                                                },
                                                {
                                                    "GroupID": 1005,
                                                    "GroupName": "Strategy and Marketing"
                                                },
                                                {
                                                    "GroupID": 1006,
                                                    "GroupName": "Source Unit"
                                                },
                                                {
                                                    "GroupID": 1007,
                                                    "GroupName": "Digital Group"
                                                },
                                                {
                                                    "GroupID": 1008,
                                                    "GroupName": "Compliance."
                                                },
                                                {
                                                    "GroupID": 1009,
                                                    "GroupName": "Management"
                                                }
                                            ]
                                        }
                                    },
                                    units: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                UnitID: { type: "integer" },
                                                GroupID: { type: "integer" },
                                                UnitName: { type: "string" }
                                            },
                                            example: [
                                                { UnitID: 1, GroupID: 1, UnitName: "Cyber Security" },
                                                {
                                                    "UnitID": 2,
                                                    "GroupID": 1,
                                                    "UnitName": "Retail Credit"
                                                },
                                                {
                                                    "UnitID": 3,
                                                    "GroupID": 1,
                                                    "UnitName": "Corporate Credit"
                                                },
                                                {
                                                    "UnitID": 4,
                                                    "GroupID": 1,
                                                    "UnitName": "Collections"
                                                },
                                                {
                                                    "UnitID": 5,
                                                    "GroupID": 1,
                                                    "UnitName": "Risk Management"
                                                },
                                                {
                                                    "UnitID": 6,
                                                    "GroupID": 2,
                                                    "UnitName": "Information Technology"
                                                },
                                                {
                                                    "UnitID": 7,
                                                    "GroupID": 2,
                                                    "UnitName": "Credit Administration & Control"
                                                },
                                                {
                                                    "UnitID": 8,
                                                    "GroupID": 2,
                                                    "UnitName": "Operations"
                                                },
                                                {
                                                    "UnitID": 9,
                                                    "GroupID": 2,
                                                    "UnitName": "Customer Care"
                                                },
                                                {
                                                    "UnitID": 10,
                                                    "GroupID": 3,
                                                    "UnitName": "Compliance"
                                                },
                                                {
                                                    "UnitID": 11,
                                                    "GroupID": 3,
                                                    "UnitName": "Governance"
                                                },
                                                {
                                                    "UnitID": 12,
                                                    "GroupID": 3,
                                                    "UnitName": "Legal"
                                                },
                                                {
                                                    "UnitID": 13,
                                                    "GroupID": 4,
                                                    "UnitName": "Accounting & Tax"
                                                },
                                                {
                                                    "UnitID": 14,
                                                    "GroupID": 4,
                                                    "UnitName": "Financial Reporting"
                                                },
                                                {
                                                    "UnitID": 15,
                                                    "GroupID": 4,
                                                    "UnitName": "Treasury"
                                                },
                                                {
                                                    "UnitID": 16,
                                                    "GroupID": 5,
                                                    "UnitName": "Business Development & Marketing"
                                                },
                                                {
                                                    "UnitID": 17,
                                                    "GroupID": 5,
                                                    "UnitName": "Strategy"
                                                },
                                                {
                                                    "UnitID": 18,
                                                    "GroupID": 6,
                                                    "UnitName": "Human Resources"
                                                },
                                                {
                                                    "UnitID": 19,
                                                    "GroupID": 6,
                                                    "UnitName": "Administration and Procurement"
                                                },
                                                {
                                                    "UnitID": 20,
                                                    "GroupID": 7,
                                                    "UnitName": "Retail Group"
                                                },
                                                {
                                                    "UnitID": 21,
                                                    "GroupID": 8,
                                                    "UnitName": "Corporate Group"
                                                },
                                                {
                                                    "UnitID": 22,
                                                    "GroupID": 9,
                                                    "UnitName": "Internal Audit"
                                                },
                                                {
                                                    "UnitID": 23,
                                                    "GroupID": 1,
                                                    "UnitName": "Remedial"
                                                },
                                                {
                                                    "UnitID": 24,
                                                    "GroupID": 1,
                                                    "UnitName": "Credit-ALCO"
                                                },
                                                {
                                                    "UnitID": 25,
                                                    "GroupID": 1,
                                                    "UnitName": "Credit"
                                                },
                                                {
                                                    "UnitID": 26,
                                                    "GroupID": 1,
                                                    "UnitName": "Credit-ECL"
                                                },
                                                {
                                                    "UnitID": 27,
                                                    "GroupID": 1,
                                                    "UnitName": "Credit-Prudential Returns"
                                                },
                                                {
                                                    "UnitID": 28,
                                                    "GroupID": 1003,
                                                    "UnitName": "Retail Business"
                                                },
                                                {
                                                    "UnitID": 29,
                                                    "GroupID": 1004,
                                                    "UnitName": "Corporate Business"
                                                },
                                                {
                                                    "UnitID": 30,
                                                    "GroupID": 1001,
                                                    "UnitName": "Financial Accounting"
                                                },
                                                {
                                                    "UnitID": 31,
                                                    "GroupID": 1001,
                                                    "UnitName": "Financial Reporting & Planning"
                                                },
                                                {
                                                    "UnitID": 32,
                                                    "GroupID": 1002,
                                                    "UnitName": "Compliance & AML"
                                                },
                                                {
                                                    "UnitID": 33,
                                                    "GroupID": 1005,
                                                    "UnitName": "Business Process Management"
                                                },
                                                {
                                                    "UnitID": 34,
                                                    "GroupID": 1005,
                                                    "UnitName": "Marketing"
                                                },
                                                {
                                                    "UnitID": 35,
                                                    "GroupID": 1005,
                                                    "UnitName": "Product Development"
                                                },
                                                {
                                                    "UnitID": 36,
                                                    "GroupID": 1006,
                                                    "UnitName": "Source Unit"
                                                },
                                                {
                                                    "UnitID": 37,
                                                    "GroupID": 1,
                                                    "UnitName": "BCM"
                                                },
                                                {
                                                    "UnitID": 38,
                                                    "GroupID": 2,
                                                    "UnitName": "Internal Control"
                                                },
                                                {
                                                    "UnitID": 39,
                                                    "GroupID": 2,
                                                    "UnitName": "Data Management"
                                                },
                                                {
                                                    "UnitID": 40,
                                                    "GroupID": 1007,
                                                    "UnitName": "Digital Group"
                                                },
                                                {
                                                    "UnitID": 41,
                                                    "GroupID": 1,
                                                    "UnitName": "SAM"
                                                },
                                                {
                                                    "UnitID": 42,
                                                    "GroupID": 2,
                                                    "UnitName": "Collections."
                                                },
                                                {
                                                    "UnitID": 43,
                                                    "GroupID": 1008,
                                                    "UnitName": "Compliance."
                                                },
                                                {
                                                    "UnitID": 44,
                                                    "GroupID": 1009,
                                                    "UnitName": "Management"
                                                }
                                            ]
                                        }
                                    },
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
                                                { FrequencyID: 1, Name: "Monthly", Description: "1 Month", IsActive: true },
                                                { FrequencyID: 2, Name: "Quarterly", Description: "3 Months", IsActive: true },
                                                { FrequencyID: 3, Name: "Semi Annual", Description: "6 Months", IsActive: true },
                                                { FrequencyID: 4, Name: "Annually", Description: "12 Months", IsActive: true }
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
                                                { TypeID: 1, Name: "Processsss NEWW", IsActive: true },
                                                { TypeID: 2, Name: "Technologyies", IsActive: true },
                                                { TypeID: 3, Name: "People", IsActive: true },
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
                                                Name: { type: "string" },
                                                IsActive: { type: "boolean" }
                                            },
                                            example: [
                                                { StatusID: 1, Name: "Measured", IsActive: true },
                                                { StatusID: 2, Name: "Not Measured", IsActive: true }
                                            ]
                                        }
                                    },
                                    thresholdValue: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                ThresholdID: { type: "integer" },
                                                Value: { type: "number" },
                                                ColorCode: { type: "string" },
                                                IsActive: { type: "boolean" },
                                                Name: { type: "string" }
                                            },
                                            example: [
                                                { ThresholdID: 1, Value: 1, ColorCode: "#dd00ff", IsActive: true, Name: "Redd NEWW" },
                                                { ThresholdID: 2, Value: 2, ColorCode: "#FFBF00", IsActive: true, Name: "Amber NEWWW" },
                                                { ThresholdID: 3, Value: 3, ColorCode: "#FFA500", IsActive: true, Name: "Orange Zone" },
                                                { ThresholdID: 4, Value: 4, ColorCode: "#FFFF00", IsActive: true, Name: "Yellow Zone" },
                                                { ThresholdID: 5, Value: 5, ColorCode: "#008000", IsActive: true, Name: "Green Zone" }
                                            ]
                                        }
                                    },
                                    usersList: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                UserGUID: { type: "string", format: "uuid" },
                                                FullName: { type: "string" }
                                            },
                                            example: [
                                                { UserGUID: "DDC5E857-67C1-EF11-9452-000C29318C88", FullName: "BodaSESecurEyes" },
                                                {
                                                    "UserGUID": "9BDBD7E6-C9C1-EF11-9453-000C29318C88",
                                                    "FullName": "SajidSEStandard User"
                                                },
                                                {
                                                    "UserGUID": "CF37782C-CBC1-EF11-9453-000C29318C88",
                                                    "FullName": "GRCSEUser One"
                                                },
                                                {
                                                    "UserGUID": "CC841E18-CDC1-EF11-9453-000C29318C88",
                                                    "FullName": "GRCSEOne"
                                                },
                                                {
                                                    "UserGUID": "020B7E1E-CFC1-EF11-9453-000C29318C88",
                                                    "FullName": "SuperSEuser"
                                                },
                                                {
                                                    "UserGUID": "F8BE567B-CFC1-EF11-9453-000C29318C88",
                                                    "FullName": "userSEtest A"
                                                },
                                                {
                                                    "UserGUID": "D0AA5AB7-CFC1-EF11-9453-000C29318C88",
                                                    "FullName": "GRCSETwo"
                                                },
                                                {
                                                    "UserGUID": "3313187D-DAC1-EF11-9453-000C29318C88",
                                                    "FullName": "GRCSEThree"
                                                },
                                                {
                                                    "UserGUID": "DF220D15-DCC1-EF11-9453-000C29318C88",
                                                    "FullName": "SangramBCM SEBhuyan"
                                                },
                                                {
                                                    "UserGUID": "82FDD5BA-DCC1-EF11-9453-000C29318C88",
                                                    "FullName": "AmrutanshuSEsahoo"
                                                },
                                                {
                                                    "UserGUID": "CC4378E8-DCC1-EF11-9453-000C29318C88",
                                                    "FullName": "SinchanaSEUserOne"
                                                },
                                                {
                                                    "UserGUID": "44C6040B-E6C1-EF11-9453-000C29318C88",
                                                    "FullName": "AnsumanSEChakra"
                                                },
                                                {
                                                    "UserGUID": "45666691-E9C1-EF11-9453-000C29318C88",
                                                    "FullName": "NiranjanSESrichandan"
                                                },
                                                {
                                                    "UserGUID": "0DD648A7-EBC1-EF11-9453-000C29318C88",
                                                    "FullName": "BhubananandaSETripathy"
                                                },
                                                {
                                                    "UserGUID": "F0B89B7B-F2C1-EF11-9453-000C29318C88",
                                                    "FullName": "AnupamSEDash"
                                                },
                                                {
                                                    "UserGUID": "0D5A7A37-F5C1-EF11-9453-000C29318C88",
                                                    "FullName": "GRCUserfour"
                                                },
                                                {
                                                    "UserGUID": "CD4D7095-09C2-EF11-9453-000C29318C88",
                                                    "FullName": "GRCUserFive"
                                                },
                                                {
                                                    "UserGUID": "C368CD4D-75C3-EF11-9456-000C29318C88",
                                                    "FullName": "GRCUserSix"
                                                },
                                                {
                                                    "UserGUID": "9BC3ABFB-83C3-EF11-9456-000C29318C88",
                                                    "FullName": "GRCAdminPro"
                                                },
                                                {
                                                    "UserGUID": "4D9F2ABD-C1C3-EF11-9456-000C29318C88",
                                                    "FullName": "BodaSESecurEyes"
                                                },
                                                {
                                                    "UserGUID": "4E9F2ABD-C1C3-EF11-9456-000C29318C88",
                                                    "FullName": "AdminUserSESecureEyes"
                                                },
                                                {
                                                    "UserGUID": "57FE9C83-1BC4-EF11-9457-000C29318C88",
                                                    "FullName": "SajidSECommitte User"
                                                },
                                                {
                                                    "UserGUID": "1FB66BF3-27C4-EF11-9457-000C29318C88",
                                                    "FullName": "VandanaSEUser Seven"
                                                },
                                                {
                                                    "UserGUID": "04E0804C-40C4-EF11-9457-000C29318C88",
                                                    "FullName": "TestSELarge"
                                                },
                                                {
                                                    "UserGUID": "CD4EC9F9-2FC5-EF11-9458-000C29318C88",
                                                    "FullName": "steering committeeSEGRCUser Eight"
                                                },
                                                {
                                                    "UserGUID": "ABD9467E-74C6-EF11-945A-000C29318C88",
                                                    "FullName": "VandanaSEGRC NIne"
                                                },
                                                {
                                                    "UserGUID": "D79512E0-83C6-EF11-945A-000C29318C88",
                                                    "FullName": "TestSEUser"
                                                },
                                                {
                                                    "UserGUID": "4E11C34C-84C6-EF11-945A-000C29318C88",
                                                    "FullName": "TestSEUser"
                                                },
                                                {
                                                    "UserGUID": "D4E91ED1-9FC6-EF11-945A-000C29318C88",
                                                    "FullName": "VandanaSEUser Ten"
                                                },
                                                {
                                                    "UserGUID": "2A75C708-A3C6-EF11-945A-000C29318C88",
                                                    "FullName": "TestSEUser"
                                                },
                                                {
                                                    "UserGUID": "40FC21C0-BAC6-EF11-945A-000C29318C88",
                                                    "FullName": "VandanaSEUser eleven"
                                                },
                                                {
                                                    "UserGUID": "6B88CAF1-35C7-EF11-945B-000C29318C88",
                                                    "FullName": "TestSEUser"
                                                },
                                                {
                                                    "UserGUID": "786A7E27-37C7-EF11-945B-000C29318C88",
                                                    "FullName": "SecureyesSEUser One"
                                                },
                                                {
                                                    "UserGUID": "35893ED8-45C7-EF11-945B-000C29318C88",
                                                    "FullName": "SecureyesSEUser two"
                                                },
                                                {
                                                    "UserGUID": "25D37174-5CC7-EF11-945B-000C29318C88",
                                                    "FullName": "SteeringSECommittee"
                                                },
                                                {
                                                    "UserGUID": "E973EA37-65C7-EF11-945B-000C29318C88",
                                                    "FullName": "vandana SEK"
                                                },
                                                {
                                                    "UserGUID": "44ED0A95-BCC9-EF11-9460-000C29318C88",
                                                    "FullName": "Test SEAuditor"
                                                },
                                                {
                                                    "UserGUID": "FC3BD0F9-6FCE-EF11-9466-000C29318C88",
                                                    "FullName": "DebadattaSEJena"
                                                },
                                                {
                                                    "UserGUID": "ECDE8389-40CF-EF11-9467-000C29318C88",
                                                    "FullName": "Vandana SEGRC three"
                                                },
                                                {
                                                    "UserGUID": "266D3692-DFD7-EF11-9472-000C29318C88",
                                                    "FullName": "RMSEOne"
                                                },
                                                {
                                                    "UserGUID": "DB9FC826-F3D7-EF11-9472-000C29318C88",
                                                    "FullName": "testSEone"
                                                },
                                                {
                                                    "UserGUID": "B4A0CDE4-F4D7-EF11-9472-000C29318C88",
                                                    "FullName": "TestSETwo"
                                                },
                                                {
                                                    "UserGUID": "FFB01397-A1D8-EF11-9473-000C29318C88",
                                                    "FullName": "auditorSEuser"
                                                },
                                                {
                                                    "UserGUID": "13A3F9B0-A2D8-EF11-9473-000C29318C88",
                                                    "FullName": "SinchanaSEUserTwo"
                                                },
                                                {
                                                    "UserGUID": "B1FFB063-72D9-EF11-9474-000C29318C88",
                                                    "FullName": "AmrutanshuSEOne"
                                                },
                                                {
                                                    "UserGUID": "B65D2FE8-73D9-EF11-9474-000C29318C88",
                                                    "FullName": "sinchanaSEUserThree"
                                                },
                                                {
                                                    "UserGUID": "B2AB8834-4CDA-EF11-9475-000C29318C88",
                                                    "FullName": "NandanSENandan"
                                                },
                                                {
                                                    "UserGUID": "7AD436F0-4DDA-EF11-9475-000C29318C88",
                                                    "FullName": "ShwethaASEA"
                                                },
                                                {
                                                    "UserGUID": "C946D135-81DC-EF11-9478-000C29318C88",
                                                    "FullName": "SudipSERoy"
                                                },
                                                {
                                                    "UserGUID": "F34603EB-8CDC-EF11-9478-000C29318C88",
                                                    "FullName": "TestSEThree"
                                                },
                                                {
                                                    "UserGUID": "DDE7A678-97DC-EF11-9478-000C29318C88",
                                                    "FullName": "SangramSEK"
                                                },
                                                {
                                                    "UserGUID": "DC9E8096-9EDC-EF11-9478-000C29318C88",
                                                    "FullName": "TPtracSEUserOne"
                                                },
                                                {
                                                    "UserGUID": "5AEFD598-06DE-EF11-947A-000C29318C88",
                                                    "FullName": "AnupamSEDash G"
                                                },
                                                {
                                                    "UserGUID": "0979B511-8FE3-EF11-9482-000C29318C88",
                                                    "FullName": "TPTRACSEONLY"
                                                },
                                                {
                                                    "UserGUID": "CFE7C652-90E3-EF11-9482-000C29318C88",
                                                    "FullName": "TPTRACSEONLYNew"
                                                },
                                                {
                                                    "UserGUID": "FE688F8F-BAE3-EF11-9482-000C29318C88",
                                                    "FullName": "auditorSEname"
                                                },
                                                {
                                                    "UserGUID": "FDBA2C69-6DEF-EF11-9491-000C29318C88",
                                                    "FullName": "testuser"
                                                },
                                                {
                                                    "UserGUID": "9D086976-E20A-F011-94B5-000C29318C88",
                                                    "FullName": "UserOne"
                                                },
                                                {
                                                    "UserGUID": "DC2DC289-FD8E-F011-9FC1-000C29AAA2A1",
                                                    "FullName": "MohamedFazil"
                                                },
                                                {
                                                    "UserGUID": "2217DFBE-2D92-F011-9FC1-000C29AAA2A1",
                                                    "FullName": "MDFaz"
                                                },
                                                {
                                                    "UserGUID": "F8313E01-F39D-F011-9FC1-000C29AAA2A1",
                                                    "FullName": "NileshMiddleLast"
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
