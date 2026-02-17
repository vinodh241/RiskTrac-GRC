module.exports = {
    tags: ["Risk Assessment"],
    description:
        "Description: \n- This api is responsible for getting info of the scheduled risk assessment from DB.",
    operationId: "getInfoScheduleRiskAssessment",
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
                                CollectionScheduleID: {
                                    type: "string",
                                    example: "32"
                                },
                            }
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
                                example: "Added successfully.",
                            },
                            result: {
                                type: "object",
                                properties: {
                                    frameworkData: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                FWID: { type: "integer" },
                                                Name: { type: "string" },
                                                Abbreviation: { type: "string" },
                                                Description: { type: "string" },
                                                MajorVersion: { type: "integer" },
                                                MinorVersion: { type: "integer" },
                                                DEPTID: { type: ["integer", "null"] },
                                                HierarchyLevel: { type: "integer" },
                                                IsPublished: { type: "boolean" },
                                                StatusID: { type: "integer" },
                                                TemplateFileName: { type: ["string", "null"] },
                                                RevisionDate: { type: "string", format: "date-time" },
                                                RevisionDescription: { type: "string" },
                                                IsActive: { type: "boolean" },
                                                IsDeleted: { type: "boolean" },
                                                CreatedDate: { type: "string", format: "date-time" },
                                                CreatedBy: { type: "string" },
                                                LastUpdatedDate: { type: "string", format: "date-time" },
                                                LastUpdatedBy: { type: "string" }
                                            }
                                        },
                                        example: [
                                            {
                                                FWID: 38,
                                                Name: "RA Appetitte Framework 05102025-1",
                                                Abbreviation: "RAF",
                                                Description: "RA Appetitte Framework 05102025-1",
                                                MajorVersion: 1,
                                                MinorVersion: 0,
                                                DEPTID: null,
                                                HierarchyLevel: 2,
                                                IsPublished: true,
                                                StatusID: 5,
                                                TemplateFileName: null,
                                                RevisionDate: "2025-11-05T11:58:32.937Z",
                                                RevisionDescription: "RA Appetitte Framework 05102025-1",
                                                IsActive: true,
                                                IsDeleted: false,
                                                CreatedDate: "2025-11-05T11:58:32.937Z",
                                                CreatedBy: "FazilMF-UploadRAFrameworkFromExcel",
                                                LastUpdatedDate: "2025-11-05T11:58:32.937Z",
                                                LastUpdatedBy: "FazilMF-UploadRAFrameworkFromExcel"
                                            }
                                        ]
                                    },
                                    userData: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                userGUID: { type: "string" },
                                                FirstName: { type: "string" },
                                                MiddleName: { type: "string" },
                                                LastName: { type: "string" },
                                                userName: { type: "string" }
                                            }
                                        },
                                        example: [
                                            {
                                                userGUID: "9BDBD7E6-C9C1-EF11-9453-000C29318C88",
                                                FirstName: "Sajid",
                                                MiddleName: "SE",
                                                LastName: "Standard User",
                                                userName: "Sajid Standard User"
                                            },
                                            {
                                                "userGUID": "CF37782C-CBC1-EF11-9453-000C29318C88",
                                                "FirstName": "GRC",
                                                "MiddleName": "SE",
                                                "LastName": "User One",
                                                "userName": "GRC User One"
                                            },
                                            {
                                                "userGUID": "CC841E18-CDC1-EF11-9453-000C29318C88",
                                                "FirstName": "GRC",
                                                "MiddleName": "SE",
                                                "LastName": "One",
                                                "userName": "GRC One"
                                            },
                                            {
                                                "userGUID": "020B7E1E-CFC1-EF11-9453-000C29318C88",
                                                "FirstName": "Super",
                                                "MiddleName": "SE",
                                                "LastName": "user",
                                                "userName": "Super user"
                                            },
                                            {
                                                "userGUID": "F8BE567B-CFC1-EF11-9453-000C29318C88",
                                                "FirstName": "user",
                                                "MiddleName": "SE",
                                                "LastName": "test A",
                                                "userName": "user test A"
                                            },
                                            {
                                                "userGUID": "D0AA5AB7-CFC1-EF11-9453-000C29318C88",
                                                "FirstName": "GRC",
                                                "MiddleName": "SE",
                                                "LastName": "Two",
                                                "userName": "GRC Two"
                                            },
                                            {
                                                "userGUID": "DF220D15-DCC1-EF11-9453-000C29318C88",
                                                "FirstName": "Sangram",
                                                "MiddleName": "BCM SE",
                                                "LastName": "Bhuyan",
                                                "userName": "Sangram Bhuyan"
                                            },
                                            {
                                                "userGUID": "82FDD5BA-DCC1-EF11-9453-000C29318C88",
                                                "FirstName": "Amrutanshu",
                                                "MiddleName": "SE",
                                                "LastName": "sahoo",
                                                "userName": "Amrutanshu sahoo"
                                            },
                                            {
                                                "userGUID": "CC4378E8-DCC1-EF11-9453-000C29318C88",
                                                "FirstName": "Sinchana",
                                                "MiddleName": "SE",
                                                "LastName": "UserOne",
                                                "userName": "Sinchana UserOne"
                                            },
                                            {
                                                "userGUID": "44C6040B-E6C1-EF11-9453-000C29318C88",
                                                "FirstName": "Ansuman",
                                                "MiddleName": "SE",
                                                "LastName": "Chakra",
                                                "userName": "Ansuman Chakra"
                                            },
                                            {
                                                "userGUID": "45666691-E9C1-EF11-9453-000C29318C88",
                                                "FirstName": "Niranjan",
                                                "MiddleName": "SE",
                                                "LastName": "Srichandan",
                                                "userName": "Niranjan Srichandan"
                                            },
                                            {
                                                "userGUID": "0DD648A7-EBC1-EF11-9453-000C29318C88",
                                                "FirstName": "Bhubanananda",
                                                "MiddleName": "SE",
                                                "LastName": "Tripathy",
                                                "userName": "Bhubanananda Tripathy"
                                            },
                                            {
                                                "userGUID": "F0B89B7B-F2C1-EF11-9453-000C29318C88",
                                                "FirstName": "Anupam",
                                                "MiddleName": "SE",
                                                "LastName": "Dash",
                                                "userName": "Anupam Dash"
                                            },
                                            {
                                                "userGUID": "0D5A7A37-F5C1-EF11-9453-000C29318C88",
                                                "FirstName": "GRC",
                                                "MiddleName": "User",
                                                "LastName": "four",
                                                "userName": "GRC four"
                                            },
                                            {
                                                "userGUID": "C368CD4D-75C3-EF11-9456-000C29318C88",
                                                "FirstName": "GRC",
                                                "MiddleName": "User",
                                                "LastName": "Six",
                                                "userName": "GRC Six"
                                            },
                                            {
                                                "userGUID": "9BC3ABFB-83C3-EF11-9456-000C29318C88",
                                                "FirstName": "GRC",
                                                "MiddleName": "Admin",
                                                "LastName": "Pro",
                                                "userName": "GRC Pro"
                                            },
                                            {
                                                "userGUID": "1FB66BF3-27C4-EF11-9457-000C29318C88",
                                                "FirstName": "Vandana",
                                                "MiddleName": "SE",
                                                "LastName": "User Seven",
                                                "userName": "Vandana User Seven"
                                            },
                                            {
                                                "userGUID": "ABD9467E-74C6-EF11-945A-000C29318C88",
                                                "FirstName": "Vandana",
                                                "MiddleName": "SE",
                                                "LastName": "GRC NIne",
                                                "userName": "Vandana GRC NIne"
                                            },
                                            {
                                                "userGUID": "D79512E0-83C6-EF11-945A-000C29318C88",
                                                "FirstName": "Test",
                                                "MiddleName": "SE",
                                                "LastName": "User",
                                                "userName": "Test User"
                                            },
                                            {
                                                "userGUID": "4E11C34C-84C6-EF11-945A-000C29318C88",
                                                "FirstName": "Test",
                                                "MiddleName": "SE",
                                                "LastName": "User",
                                                "userName": "Test User"
                                            },
                                            {
                                                "userGUID": "FC3BD0F9-6FCE-EF11-9466-000C29318C88",
                                                "FirstName": "Debadatta",
                                                "MiddleName": "SE",
                                                "LastName": "Jena",
                                                "userName": "Debadatta Jena"
                                            },
                                            {
                                                "userGUID": "DB9FC826-F3D7-EF11-9472-000C29318C88",
                                                "FirstName": "test",
                                                "MiddleName": "SE",
                                                "LastName": "one",
                                                "userName": "test one"
                                            },
                                            {
                                                "userGUID": "B4A0CDE4-F4D7-EF11-9472-000C29318C88",
                                                "FirstName": "Test",
                                                "MiddleName": "SE",
                                                "LastName": "Two",
                                                "userName": "Test Two"
                                            },
                                            {
                                                "userGUID": "13A3F9B0-A2D8-EF11-9473-000C29318C88",
                                                "FirstName": "Sinchana",
                                                "MiddleName": "SE",
                                                "LastName": "UserTwo",
                                                "userName": "Sinchana UserTwo"
                                            },
                                            {
                                                "userGUID": "B1FFB063-72D9-EF11-9474-000C29318C88",
                                                "FirstName": "Amrutanshu",
                                                "MiddleName": "SE",
                                                "LastName": "One",
                                                "userName": "Amrutanshu One"
                                            },
                                            {
                                                "userGUID": "B65D2FE8-73D9-EF11-9474-000C29318C88",
                                                "FirstName": "sinchana",
                                                "MiddleName": "SE",
                                                "LastName": "UserThree",
                                                "userName": "sinchana UserThree"
                                            },
                                            {
                                                "userGUID": "B2AB8834-4CDA-EF11-9475-000C29318C88",
                                                "FirstName": "Nandan",
                                                "MiddleName": "SE",
                                                "LastName": "Nandan",
                                                "userName": "Nandan Nandan"
                                            },
                                            {
                                                "userGUID": "7AD436F0-4DDA-EF11-9475-000C29318C88",
                                                "FirstName": "ShwethaA",
                                                "MiddleName": "SE",
                                                "LastName": "A",
                                                "userName": "ShwethaA A"
                                            },
                                            {
                                                "userGUID": "C946D135-81DC-EF11-9478-000C29318C88",
                                                "FirstName": "Sudip",
                                                "MiddleName": "SE",
                                                "LastName": "Roy",
                                                "userName": "Sudip Roy"
                                            },
                                            {
                                                "userGUID": "DDE7A678-97DC-EF11-9478-000C29318C88",
                                                "FirstName": "Sangram",
                                                "MiddleName": "SE",
                                                "LastName": "K",
                                                "userName": "Sangram K"
                                            },
                                            {
                                                "userGUID": "5AEFD598-06DE-EF11-947A-000C29318C88",
                                                "FirstName": "Anupam",
                                                "MiddleName": "SE",
                                                "LastName": "Dash G",
                                                "userName": "Anupam Dash G"
                                            },
                                            {
                                                "userGUID": "3313187D-DAC1-EF11-9453-000C29318C88",
                                                "FirstName": "GRC",
                                                "MiddleName": "SE",
                                                "LastName": "Three",
                                                "userName": "GRC Three"
                                            },
                                            {
                                                "userGUID": "DC2DC289-FD8E-F011-9FC1-000C29AAA2A1",
                                                "FirstName": "Mohamed",
                                                "MiddleName": "",
                                                "LastName": "Fazil",
                                                "userName": "Mohamed Fazil"
                                            },
                                            {
                                                "userGUID": "2217DFBE-2D92-F011-9FC1-000C29AAA2A1",
                                                "FirstName": "MD",
                                                "MiddleName": "",
                                                "LastName": "Faz",
                                                "userName": "MD Faz"
                                            },
                                            {
                                                "userGUID": "F8313E01-F39D-F011-9FC1-000C29AAA2A1",
                                                "FirstName": "Nilesh",
                                                "MiddleName": "Middle",
                                                "LastName": "Last",
                                                "userName": "Nilesh Last"
                                            }
                                        ]
                                    },
                                    unitData: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                unitID: { type: "integer" },
                                                unitName: { type: "string" }
                                            }
                                        },
                                        example: [
                                            {
                                                unitID: 1,
                                                unitName: "Cyber Security"
                                            },
                                            {
                                                "unitID": 2,
                                                "unitName": "Retail Credit"
                                            },
                                            {
                                                "unitID": 3,
                                                "unitName": "Corporate Credit"
                                            },
                                            {
                                                "unitID": 4,
                                                "unitName": "Collections"
                                            },
                                            {
                                                "unitID": 5,
                                                "unitName": "Risk Management"
                                            },
                                            {
                                                "unitID": 6,
                                                "unitName": "Information Technology"
                                            },
                                            {
                                                "unitID": 7,
                                                "unitName": "Credit Administration & Control"
                                            },
                                            {
                                                "unitID": 8,
                                                "unitName": "Operations"
                                            },
                                            {
                                                "unitID": 9,
                                                "unitName": "Customer Care"
                                            },
                                            {
                                                "unitID": 10,
                                                "unitName": "Compliance"
                                            },
                                            {
                                                "unitID": 11,
                                                "unitName": "Governance"
                                            },
                                            {
                                                "unitID": 12,
                                                "unitName": "Legal"
                                            },
                                            {
                                                "unitID": 13,
                                                "unitName": "Accounting & Tax"
                                            },
                                            {
                                                "unitID": 14,
                                                "unitName": "Financial Reporting"
                                            },
                                            {
                                                "unitID": 15,
                                                "unitName": "Treasury"
                                            },
                                            {
                                                "unitID": 16,
                                                "unitName": "Business Development & Marketing"
                                            },
                                            {
                                                "unitID": 17,
                                                "unitName": "Strategy"
                                            },
                                            {
                                                "unitID": 18,
                                                "unitName": "Human Resources"
                                            },
                                            {
                                                "unitID": 19,
                                                "unitName": "Administration and Procurement"
                                            },
                                            {
                                                "unitID": 20,
                                                "unitName": "Retail Group"
                                            },
                                            {
                                                "unitID": 21,
                                                "unitName": "Corporate Group"
                                            },
                                            {
                                                "unitID": 22,
                                                "unitName": "Internal Audit"
                                            },
                                            {
                                                "unitID": 23,
                                                "unitName": "Remedial"
                                            },
                                            {
                                                "unitID": 24,
                                                "unitName": "Credit-ALCO"
                                            },
                                            {
                                                "unitID": 25,
                                                "unitName": "Credit"
                                            },
                                            {
                                                "unitID": 26,
                                                "unitName": "Credit-ECL"
                                            },
                                            {
                                                "unitID": 27,
                                                "unitName": "Credit-Prudential Returns"
                                            },
                                            {
                                                "unitID": 28,
                                                "unitName": "Retail Business"
                                            },
                                            {
                                                "unitID": 29,
                                                "unitName": "Corporate Business"
                                            },
                                            {
                                                "unitID": 30,
                                                "unitName": "Financial Accounting"
                                            },
                                            {
                                                "unitID": 31,
                                                "unitName": "Financial Reporting & Planning"
                                            },
                                            {
                                                "unitID": 32,
                                                "unitName": "Compliance & AML"
                                            },
                                            {
                                                "unitID": 33,
                                                "unitName": "Business Process Management"
                                            },
                                            {
                                                "unitID": 34,
                                                "unitName": "Marketing"
                                            },
                                            {
                                                "unitID": 35,
                                                "unitName": "Product Development"
                                            },
                                            {
                                                "unitID": 36,
                                                "unitName": "Source Unit"
                                            },
                                            {
                                                "unitID": 37,
                                                "unitName": "BCM"
                                            },
                                            {
                                                "unitID": 38,
                                                "unitName": "Internal Control"
                                            },
                                            {
                                                "unitID": 39,
                                                "unitName": "Data Management"
                                            },
                                            {
                                                "unitID": 40,
                                                "unitName": "Digital Group"
                                            },
                                            {
                                                "unitID": 41,
                                                "unitName": "SAM"
                                            },
                                            {
                                                "unitID": 42,
                                                "unitName": "Collections."
                                            },
                                            {
                                                "unitID": 43,
                                                "unitName": "Compliance."
                                            },
                                            {
                                                "unitID": 44,
                                                "unitName": "Management"
                                            }
                                        ]
                                    },
                                    quaterData: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                QuaterID: { type: "string" },
                                                Year: { type: "integer" },
                                                Quater: { type: "integer" }
                                            }
                                        },
                                        example: [
                                            {
                                                QuaterID: "43",
                                                Year: 2025,
                                                Quater: 3
                                            },
                                            {
                                                "QuaterID": "44",
                                                "Year": 2025,
                                                "Quater": 4
                                            },
                                            {
                                                "QuaterID": "45",
                                                "Year": 2026,
                                                "Quater": 1
                                            }
                                        ]
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
