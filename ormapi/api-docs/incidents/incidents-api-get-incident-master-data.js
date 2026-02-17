module.exports = {
    tags: ["Incidents"],
    description:
        "Description: \n- This api is responsible for getting incident master data from DB.",
    operationId: "getIncidentMasterData",
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
                                    incidentTypes: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                TypeID: { type: "integer" },
                                                Name: { type: "string" },
                                                IsActive: { type: "boolean" }
                                            }
                                        },
                                        example: [
                                            {
                                                TypeID: 1,
                                                Name: "Operational Risk Fraud: Internal or External",
                                                IsActive: true
                                            }, {
                                                "TypeID": 2,
                                                "Name": "Operational Risk: other category",
                                                "IsActive": true
                                            },
                                            {
                                                "TypeID": 3,
                                                "Name": "Near Miss or Potential Loss",
                                                "IsActive": true
                                            },
                                            {
                                                "TypeID": 4,
                                                "Name": "Revenue Leakage",
                                                "IsActive": true
                                            },
                                            {
                                                "TypeID": 5,
                                                "Name": "Legal",
                                                "IsActive": true
                                            },
                                            {
                                                "TypeID": 7,
                                                "Name": "Regression Type",
                                                "IsActive": true
                                            },
                                        ]
                                    },
                                    sourceOfIdentifications: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                SourceID: { type: "integer" },
                                                Name: { type: "string" },
                                                IsActive: { type: "boolean" }
                                            }
                                        },
                                        example: [
                                            {
                                                SourceID: 1,
                                                Name: "Internal Department finding",
                                                IsActive: true
                                            },
                                            {
                                                "SourceID": 2,
                                                "Name": "Other department analysis",
                                                "IsActive": true
                                            },
                                            {
                                                "SourceID": 3,
                                                "Name": "Customer Complaint",
                                                "IsActive": true
                                            },
                                            {
                                                "SourceID": 4,
                                                "Name": "Audit",
                                                "IsActive": true
                                            },
                                            {
                                                "SourceID": 5,
                                                "Name": "Source- Regression",
                                                "IsActive": true
                                            },
                                            {
                                                "SourceID": 6,
                                                "Name": "tEST SOURCE",
                                                "IsActive": true
                                            }
                                        ]
                                    },
                                    criticality: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                CriticalityID: { type: "integer" },
                                                Name: { type: "string" },
                                                IsActive: { type: "boolean" }
                                            }
                                        },
                                        example: [
                                            {
                                                CriticalityID: 1,
                                                Name: "High",
                                                IsActive: true
                                            },
                                            {
                                                "CriticalityID": 2,
                                                "Name": "Medium",
                                                "IsActive": true
                                            },
                                            {
                                                "CriticalityID": 3,
                                                "Name": "Low",
                                                "IsActive": true
                                            },
                                            {
                                                "CriticalityID": 4,
                                                "Name": "regreession- Criticality",
                                                "IsActive": true
                                            }
                                        ]
                                    },
                                    operationalRiskLossEventCategory: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                CategoryID: { type: "integer" },
                                                Name: { type: "string" },
                                                IsActive: { type: "boolean" }
                                            }
                                        },
                                        example: [
                                            {
                                                CategoryID: 1,
                                                Name: "Internal Fraud",
                                                IsActive: true
                                            },
                                            {
                                                "CategoryID": 2,
                                                "Name": "External Fraud",
                                                "IsActive": true
                                            },
                                            {
                                                "CategoryID": 3,
                                                "Name": "Execution, Delivery and Process Managemen",
                                                "IsActive": true
                                            },
                                            {
                                                "CategoryID": 4,
                                                "Name": "Damage to Physical Assets",
                                                "IsActive": true
                                            },
                                            {
                                                "CategoryID": 5,
                                                "Name": "Business Disruption and System Failures",
                                                "IsActive": true
                                            },
                                            {
                                                "CategoryID": 6,
                                                "Name": "Clients, Products and Business Practices",
                                                "IsActive": true
                                            },
                                            {
                                                "CategoryID": 7,
                                                "Name": "Employment Practices and Workplace Safety",
                                                "IsActive": true
                                            },
                                            {
                                                "CategoryID": 8,
                                                "Name": " New Risk Loss Event Category",
                                                "IsActive": true
                                            },
                                            {
                                                "CategoryID": 9,
                                                "Name": "Regression Operational Risk Loss Event Category",
                                                "IsActive": true
                                            }
                                        ]
                                    },
                                    incidentReviewers: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                ReviewerID: { type: "integer" },
                                                UserGUID: { type: "string" },
                                                FullName: { type: "string" },
                                                IsActive: { type: "boolean" },
                                                IsDeleted: { type: "boolean" }
                                            }
                                        },
                                        example: [
                                            {
                                                ReviewerID: 1,
                                                UserGUID: "44C6040B-E6C1-EF11-9453-000C29318C88",
                                                FullName: "Ansuman SE Chakra",
                                                IsActive: false,
                                                IsDeleted: true
                                            },
                                            {
                                                "ReviewerID": 2,
                                                "UserGUID": "F0B89B7B-F2C1-EF11-9453-000C29318C88",
                                                "FullName": "Anupam SE Dash",
                                                "IsActive": false,
                                                "IsDeleted": true
                                            },
                                            {
                                                "ReviewerID": 5,
                                                "UserGUID": "45666691-E9C1-EF11-9453-000C29318C88",
                                                "FullName": "Niranjan SE Srichandan",
                                                "IsActive": true,
                                                "IsDeleted": false
                                            },
                                            {
                                                "ReviewerID": 6,
                                                "UserGUID": "13A3F9B0-A2D8-EF11-9473-000C29318C88",
                                                "FullName": "Sinchana SE UserTwo",
                                                "IsActive": true,
                                                "IsDeleted": false
                                            },
                                            {
                                                "ReviewerID": 7,
                                                "UserGUID": "0DD648A7-EBC1-EF11-9453-000C29318C88",
                                                "FullName": "Bhubanananda SE Tripathy",
                                                "IsActive": true,
                                                "IsDeleted": false
                                            },
                                            {
                                                "ReviewerID": 9,
                                                "UserGUID": "9BC3ABFB-83C3-EF11-9456-000C29318C88",
                                                "FullName": "GRC Admin Pro",
                                                "IsActive": true,
                                                "IsDeleted": false
                                            }
                                        ]
                                    },
                                    incidentApprovalUsers: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                ApproverID: { type: "integer" },
                                                UserGUID: { type: "string" },
                                                FullName: { type: "string" },
                                                IsActive: { type: "boolean" },
                                                IsDeleted: { type: "boolean" }
                                            }
                                        },
                                        example: [
                                            {
                                                ApproverID: 1,
                                                UserGUID: "0DD648A7-EBC1-EF11-9453-000C29318C88",
                                                FullName: "Bhubanananda SE Tripathy",
                                                IsActive: false,
                                                IsDeleted: false
                                            },
                                            {
                                                "ApproverID": 5,
                                                "UserGUID": "DDE7A678-97DC-EF11-9478-000C29318C88",
                                                "FullName": "Sangram SE K",
                                                "IsActive": true,
                                                "IsDeleted": false
                                            },
                                            {
                                                "ApproverID": 6,
                                                "UserGUID": "DF220D15-DCC1-EF11-9453-000C29318C88",
                                                "FullName": "Sangram BCM SE Bhuyan",
                                                "IsActive": true,
                                                "IsDeleted": false
                                            },
                                            {
                                                "ApproverID": 7,
                                                "UserGUID": "B4A0CDE4-F4D7-EF11-9472-000C29318C88",
                                                "FullName": "Test SE Two",
                                                "IsActive": true,
                                                "IsDeleted": false
                                            },
                                            {
                                                "ApproverID": 8,
                                                "UserGUID": "DC2DC289-FD8E-F011-9FC1-000C29AAA2A1",
                                                "FullName": "Mohamed  Fazil",
                                                "IsActive": false,
                                                "IsDeleted": false
                                            }
                                        ]
                                    },
                                    usersList: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                UserGUID: { type: "string" },
                                                FullName: { type: "string" },
                                                RoleID: { type: "integer" }
                                            }
                                        },
                                        example: [
                                            {
                                                UserGUID: "CF37782C-CBC1-EF11-9453-000C29318C88",
                                                FullName: "GRC SE User One",
                                                RoleID: 4
                                            },
                                            {
                                                "UserGUID": "F8BE567B-CFC1-EF11-9453-000C29318C88",
                                                "FullName": "user SE test A",
                                                "RoleID": 4
                                            },
                                            {
                                                "UserGUID": "3313187D-DAC1-EF11-9453-000C29318C88",
                                                "FullName": "GRC SE Three",
                                                "RoleID": 4
                                            },
                                            {
                                                "UserGUID": "DF220D15-DCC1-EF11-9453-000C29318C88",
                                                "FullName": "Sangram BCM SE Bhuyan",
                                                "RoleID": 4
                                            },
                                            {
                                                "UserGUID": "CC4378E8-DCC1-EF11-9453-000C29318C88",
                                                "FullName": "Sinchana SE UserOne",
                                                "RoleID": 4
                                            },
                                            {
                                                "UserGUID": "45666691-E9C1-EF11-9453-000C29318C88",
                                                "FullName": "Niranjan SE Srichandan",
                                                "RoleID": 4
                                            },
                                            {
                                                "UserGUID": "0DD648A7-EBC1-EF11-9453-000C29318C88",
                                                "FullName": "Bhubanananda SE Tripathy",
                                                "RoleID": 4
                                            },
                                            {
                                                "UserGUID": "9BC3ABFB-83C3-EF11-9456-000C29318C88",
                                                "FullName": "GRC Admin Pro",
                                                "RoleID": 4
                                            },
                                            {
                                                "UserGUID": "ABD9467E-74C6-EF11-945A-000C29318C88",
                                                "FullName": "Vandana SE GRC NIne",
                                                "RoleID": 4
                                            },
                                            {
                                                "UserGUID": "FC3BD0F9-6FCE-EF11-9466-000C29318C88",
                                                "FullName": "Debadatta SE Jena",
                                                "RoleID": 4
                                            },
                                            {
                                                "UserGUID": "B4A0CDE4-F4D7-EF11-9472-000C29318C88",
                                                "FullName": "Test SE Two",
                                                "RoleID": 4
                                            },
                                            {
                                                "UserGUID": "13A3F9B0-A2D8-EF11-9473-000C29318C88",
                                                "FullName": "Sinchana SE UserTwo",
                                                "RoleID": 4
                                            },
                                            {
                                                "UserGUID": "B1FFB063-72D9-EF11-9474-000C29318C88",
                                                "FullName": "Amrutanshu SE One",
                                                "RoleID": 4
                                            },
                                            {
                                                "UserGUID": "DDE7A678-97DC-EF11-9478-000C29318C88",
                                                "FullName": "Sangram SE K",
                                                "RoleID": 4
                                            },
                                            {
                                                "UserGUID": "DC2DC289-FD8E-F011-9FC1-000C29AAA2A1",
                                                "FullName": "Mohamed  Fazil",
                                                "RoleID": 4
                                            },
                                            {
                                                "UserGUID": "F8313E01-F39D-F011-9FC1-000C29AAA2A1",
                                                "FullName": "Nilesh Middle Last",
                                                "RoleID": 4
                                            },
                                        ]
                                    },
                                    IncidentCheckers: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                UserGUID: { type: "string" },
                                                FullName: { type: "string" },
                                                IsActive: { type: "boolean" },
                                                CheckerID: { type: "integer" },
                                                UnitName: { type: "string" },
                                                UnitID: { type: "integer" },
                                                GroupName: { type: "string" },
                                                IsDeleted: { type: "boolean" }
                                            }
                                        },
                                        example: [
                                            {
                                                UserGUID: "DF220D15-DCC1-EF11-9453-000C29318C88",
                                                FullName: "Sangram BCM SE Bhuyan",
                                                IsActive: false,
                                                CheckerID: 1,
                                                UnitName: "Cyber Security",
                                                UnitID: 1,
                                                GroupName: "Credit & Risk",
                                                IsDeleted: true
                                            },
                                            {
                                                "UserGUID": "5AEFD598-06DE-EF11-947A-000C29318C88",
                                                "FullName": "Anupam SE Dash G",
                                                "IsActive": true,
                                                "CheckerID": 4,
                                                "UnitName": "Legal",
                                                "UnitID": 12,
                                                "GroupName": "Legal and Governance",
                                                "IsDeleted": false
                                            },
                                            {
                                                "UserGUID": "020B7E1E-CFC1-EF11-9453-000C29318C88",
                                                "FullName": "Super SE user",
                                                "IsActive": true,
                                                "CheckerID": 5,
                                                "UnitName": "Governance",
                                                "UnitID": 11,
                                                "GroupName": "Legal and Governance",
                                                "IsDeleted": false
                                            },
                                            {
                                                "UserGUID": "F0B89B7B-F2C1-EF11-9453-000C29318C88",
                                                "FullName": "Anupam SE Dash",
                                                "IsActive": false,
                                                "CheckerID": 6,
                                                "UnitName": "Cyber Security",
                                                "UnitID": 1,
                                                "GroupName": "Credit & Risk",
                                                "IsDeleted": true
                                            },
                                            {
                                                "UserGUID": "DF220D15-DCC1-EF11-9453-000C29318C88",
                                                "FullName": "Sangram BCM SE Bhuyan",
                                                "IsActive": false,
                                                "CheckerID": 7,
                                                "UnitName": "BCM",
                                                "UnitID": 37,
                                                "GroupName": "Credit & Risk",
                                                "IsDeleted": false
                                            },
                                            {
                                                "UserGUID": "DF220D15-DCC1-EF11-9453-000C29318C88",
                                                "FullName": "Sangram BCM SE Bhuyan",
                                                "IsActive": false,
                                                "CheckerID": 8,
                                                "UnitName": "Risk Management",
                                                "UnitID": 5,
                                                "GroupName": "Credit & Risk",
                                                "IsDeleted": false
                                            },
                                            {
                                                "UserGUID": "B4A0CDE4-F4D7-EF11-9472-000C29318C88",
                                                "FullName": "Test SE Two",
                                                "IsActive": true,
                                                "CheckerID": 9,
                                                "UnitName": "Risk Management",
                                                "UnitID": 5,
                                                "GroupName": "Credit & Risk",
                                                "IsDeleted": false
                                            },
                                            {
                                                "UserGUID": "D0AA5AB7-CFC1-EF11-9453-000C29318C88",
                                                "FullName": "GRC SE Two",
                                                "IsActive": false,
                                                "CheckerID": 12,
                                                "UnitName": "Digital Group",
                                                "UnitID": 40,
                                                "GroupName": "Digital Group",
                                                "IsDeleted": true
                                            },
                                            {
                                                "UserGUID": "B2AB8834-4CDA-EF11-9475-000C29318C88",
                                                "FullName": "Nandan SE Nandan",
                                                "IsActive": true,
                                                "CheckerID": 13,
                                                "UnitName": "Cyber Security",
                                                "UnitID": 1,
                                                "GroupName": "Credit & Risk",
                                                "IsDeleted": false
                                            },
                                            {
                                                "UserGUID": "B65D2FE8-73D9-EF11-9474-000C29318C88",
                                                "FullName": "sinchana SE UserThree",
                                                "IsActive": true,
                                                "CheckerID": 14,
                                                "UnitName": "Compliance",
                                                "UnitID": 10,
                                                "GroupName": "Legal and Governance",
                                                "IsDeleted": false
                                            },
                                            {
                                                "UserGUID": "DC2DC289-FD8E-F011-9FC1-000C29AAA2A1",
                                                "FullName": "Mohamed  Fazil",
                                                "IsActive": false,
                                                "CheckerID": 16,
                                                "UnitName": "Compliance.",
                                                "UnitID": 43,
                                                "GroupName": "Compliance.",
                                                "IsDeleted": false
                                            },
                                            {
                                                "UserGUID": "D0AA5AB7-CFC1-EF11-9453-000C29318C88",
                                                "FullName": "GRC SE Two",
                                                "IsActive": false,
                                                "CheckerID": 17,
                                                "UnitName": "Cyber Security",
                                                "UnitID": 1,
                                                "GroupName": "Credit & Risk",
                                                "IsDeleted": false
                                            },
                                            {
                                                "UserGUID": "4E11C34C-84C6-EF11-945A-000C29318C88",
                                                "FullName": "Test SE User",
                                                "IsActive": true,
                                                "CheckerID": 18,
                                                "UnitName": "Cyber Security",
                                                "UnitID": 1,
                                                "GroupName": "Credit & Risk",
                                                "IsDeleted": false
                                            }
                                        ]
                                    },
                                    AddingIncidentCheckersGroup: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                IsActive: { type: "boolean" },
                                                GroupName: { type: "string" },
                                                GroupID: { type: "integer" },
                                                IsDeleted: { type: "boolean" }
                                            }
                                        },
                                        example: [
                                            {
                                                IsActive: true,
                                                GroupName: "Credit & Risk",
                                                GroupID: 1,
                                                IsDeleted: false
                                            },
                                            {
                                                "IsActive": true,
                                                "GroupName": "Operations & Shared Services",
                                                "GroupID": 2,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "GroupName": "Legal and Governance",
                                                "GroupID": 3,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "GroupName": "Finance & Accounting",
                                                "GroupID": 4,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "GroupName": "Strategy & Marketing",
                                                "GroupID": 5,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "GroupName": "HR & Admin",
                                                "GroupID": 6,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "GroupName": "Retail Group",
                                                "GroupID": 7,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "GroupName": "Corporate Group",
                                                "GroupID": 8,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "GroupName": "Internal Audit",
                                                "GroupID": 9,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "GroupName": "Finance",
                                                "GroupID": 1001,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "GroupName": "Compliance & AML",
                                                "GroupID": 1002,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "GroupName": "Retail",
                                                "GroupID": 1003,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "GroupName": "Corporate",
                                                "GroupID": 1004,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "GroupName": "Strategy and Marketing",
                                                "GroupID": 1005,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "GroupName": "Source Unit",
                                                "GroupID": 1006,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "GroupName": "Digital Group",
                                                "GroupID": 1007,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "GroupName": "Compliance.",
                                                "GroupID": 1008,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "GroupName": "Management",
                                                "GroupID": 1009,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Retail Credit",
                                                "UnitID": 2,
                                                "GroupID": 1,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Corporate Credit",
                                                "UnitID": 3,
                                                "GroupID": 1,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Collections",
                                                "UnitID": 4,
                                                "GroupID": 1,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Risk Management",
                                                "UnitID": 5,
                                                "GroupID": 1,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Information Technology",
                                                "UnitID": 6,
                                                "GroupID": 2,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Credit Administration & Control",
                                                "UnitID": 7,
                                                "GroupID": 2,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Operations",
                                                "UnitID": 8,
                                                "GroupID": 2,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Customer Care",
                                                "UnitID": 9,
                                                "GroupID": 2,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Compliance",
                                                "UnitID": 10,
                                                "GroupID": 3,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Governance",
                                                "UnitID": 11,
                                                "GroupID": 3,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Legal",
                                                "UnitID": 12,
                                                "GroupID": 3,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Accounting & Tax",
                                                "UnitID": 13,
                                                "GroupID": 4,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Financial Reporting",
                                                "UnitID": 14,
                                                "GroupID": 4,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Treasury",
                                                "UnitID": 15,
                                                "GroupID": 4,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Business Development & Marketing",
                                                "UnitID": 16,
                                                "GroupID": 5,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Strategy",
                                                "UnitID": 17,
                                                "GroupID": 5,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Human Resources",
                                                "UnitID": 18,
                                                "GroupID": 6,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Administration and Procurement",
                                                "UnitID": 19,
                                                "GroupID": 6,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Retail Group",
                                                "UnitID": 20,
                                                "GroupID": 7,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Corporate Group",
                                                "UnitID": 21,
                                                "GroupID": 8,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Internal Audit",
                                                "UnitID": 22,
                                                "GroupID": 9,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Remedial",
                                                "UnitID": 23,
                                                "GroupID": 1,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Credit-ALCO",
                                                "UnitID": 24,
                                                "GroupID": 1,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Credit",
                                                "UnitID": 25,
                                                "GroupID": 1,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Credit-ECL",
                                                "UnitID": 26,
                                                "GroupID": 1,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Credit-Prudential Returns",
                                                "UnitID": 27,
                                                "GroupID": 1,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Retail Business",
                                                "UnitID": 28,
                                                "GroupID": 1003,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Corporate Business",
                                                "UnitID": 29,
                                                "GroupID": 1004,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Financial Accounting",
                                                "UnitID": 30,
                                                "GroupID": 1001,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Financial Reporting & Planning",
                                                "UnitID": 31,
                                                "GroupID": 1001,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Compliance & AML",
                                                "UnitID": 32,
                                                "GroupID": 1002,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Business Process Management",
                                                "UnitID": 33,
                                                "GroupID": 1005,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Marketing",
                                                "UnitID": 34,
                                                "GroupID": 1005,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Product Development",
                                                "UnitID": 35,
                                                "GroupID": 1005,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Source Unit",
                                                "UnitID": 36,
                                                "GroupID": 1006,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "BCM",
                                                "UnitID": 37,
                                                "GroupID": 1,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Internal Control",
                                                "UnitID": 38,
                                                "GroupID": 2,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Data Management",
                                                "UnitID": 39,
                                                "GroupID": 2,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Digital Group",
                                                "UnitID": 40,
                                                "GroupID": 1007,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "SAM",
                                                "UnitID": 41,
                                                "GroupID": 1,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Collections.",
                                                "UnitID": 42,
                                                "GroupID": 2,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Compliance.",
                                                "UnitID": 43,
                                                "GroupID": 1008,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Management",
                                                "UnitID": 44,
                                                "GroupID": 1009,
                                                "IsDeleted": false
                                            }
                                        ]
                                    },
                                    AddingIncidentCheckersUnit: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                IsActive: { type: "boolean" },
                                                Name: { type: "string" },
                                                UnitID: { type: "integer" },
                                                GroupID: { type: "integer" },
                                                IsDeleted: { type: "boolean" }
                                            }
                                        },
                                        example: [
                                            {
                                                IsActive: true,
                                                Name: "Cyber Security",
                                                UnitID: 1,
                                                GroupID: 1,
                                                IsDeleted: false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Retail Credit",
                                                "UnitID": 2,
                                                "GroupID": 1,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Corporate Credit",
                                                "UnitID": 3,
                                                "GroupID": 1,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Collections",
                                                "UnitID": 4,
                                                "GroupID": 1,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Risk Management",
                                                "UnitID": 5,
                                                "GroupID": 1,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Information Technology",
                                                "UnitID": 6,
                                                "GroupID": 2,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Credit Administration & Control",
                                                "UnitID": 7,
                                                "GroupID": 2,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Operations",
                                                "UnitID": 8,
                                                "GroupID": 2,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Customer Care",
                                                "UnitID": 9,
                                                "GroupID": 2,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Compliance",
                                                "UnitID": 10,
                                                "GroupID": 3,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Governance",
                                                "UnitID": 11,
                                                "GroupID": 3,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Legal",
                                                "UnitID": 12,
                                                "GroupID": 3,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Accounting & Tax",
                                                "UnitID": 13,
                                                "GroupID": 4,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Financial Reporting",
                                                "UnitID": 14,
                                                "GroupID": 4,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Treasury",
                                                "UnitID": 15,
                                                "GroupID": 4,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Business Development & Marketing",
                                                "UnitID": 16,
                                                "GroupID": 5,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Strategy",
                                                "UnitID": 17,
                                                "GroupID": 5,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Human Resources",
                                                "UnitID": 18,
                                                "GroupID": 6,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Administration and Procurement",
                                                "UnitID": 19,
                                                "GroupID": 6,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Retail Group",
                                                "UnitID": 20,
                                                "GroupID": 7,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Corporate Group",
                                                "UnitID": 21,
                                                "GroupID": 8,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Internal Audit",
                                                "UnitID": 22,
                                                "GroupID": 9,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Remedial",
                                                "UnitID": 23,
                                                "GroupID": 1,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Credit-ALCO",
                                                "UnitID": 24,
                                                "GroupID": 1,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Credit",
                                                "UnitID": 25,
                                                "GroupID": 1,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Credit-ECL",
                                                "UnitID": 26,
                                                "GroupID": 1,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Credit-Prudential Returns",
                                                "UnitID": 27,
                                                "GroupID": 1,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Retail Business",
                                                "UnitID": 28,
                                                "GroupID": 1003,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Corporate Business",
                                                "UnitID": 29,
                                                "GroupID": 1004,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Financial Accounting",
                                                "UnitID": 30,
                                                "GroupID": 1001,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Financial Reporting & Planning",
                                                "UnitID": 31,
                                                "GroupID": 1001,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Compliance & AML",
                                                "UnitID": 32,
                                                "GroupID": 1002,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Business Process Management",
                                                "UnitID": 33,
                                                "GroupID": 1005,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Marketing",
                                                "UnitID": 34,
                                                "GroupID": 1005,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Product Development",
                                                "UnitID": 35,
                                                "GroupID": 1005,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Source Unit",
                                                "UnitID": 36,
                                                "GroupID": 1006,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "BCM",
                                                "UnitID": 37,
                                                "GroupID": 1,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Internal Control",
                                                "UnitID": 38,
                                                "GroupID": 2,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Data Management",
                                                "UnitID": 39,
                                                "GroupID": 2,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Digital Group",
                                                "UnitID": 40,
                                                "GroupID": 1007,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "SAM",
                                                "UnitID": 41,
                                                "GroupID": 1,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Collections.",
                                                "UnitID": 42,
                                                "GroupID": 2,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Compliance.",
                                                "UnitID": 43,
                                                "GroupID": 1008,
                                                "IsDeleted": false
                                            },
                                            {
                                                "IsActive": true,
                                                "Name": "Management",
                                                "UnitID": 44,
                                                "GroupID": 1009,
                                                "IsDeleted": false
                                            }
                                        ]
                                    },
                                    AddingIncidentCheckersUsers: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                UserGUID: { type: "string" },
                                                UserName: { type: "string" },
                                                FullName: { type: "string" },
                                                UnitName: { type: "string" },
                                                UnitID: { type: "integer" },
                                                GroupName: { type: "string" },
                                                GroupID: { type: "integer" }
                                            }
                                        },
                                        example: [
                                            {
                                                UserGUID: "D0AA5AB7-CFC1-EF11-9453-000C29318C88",
                                                UserName: "GRCUser002",
                                                FullName: "GRC SE Two",
                                                UnitName: "Cyber Security",
                                                UnitID: 1,
                                                GroupName: "Credit & Risk",
                                                GroupID: 1
                                            },
                                            {
                                                "UserGUID": "3313187D-DAC1-EF11-9453-000C29318C88",
                                                "UserName": "GRCUser003",
                                                "FullName": "GRC SE Three",
                                                "UnitName": "Cyber Security",
                                                "UnitID": 1,
                                                "GroupName": "Credit & Risk",
                                                "GroupID": 1
                                            },
                                            {
                                                "UserGUID": "4E11C34C-84C6-EF11-945A-000C29318C88",
                                                "UserName": "TestNew0012",
                                                "FullName": "Test SE User",
                                                "UnitName": "Cyber Security",
                                                "UnitID": 1,
                                                "GroupName": "Credit & Risk",
                                                "GroupID": 1
                                            },
                                            {
                                                "UserGUID": "B2AB8834-4CDA-EF11-9475-000C29318C88",
                                                "UserName": "Naaaganandan",
                                                "FullName": "Nandan SE Nandan",
                                                "UnitName": "Cyber Security",
                                                "UnitID": 1,
                                                "GroupName": "Credit & Risk",
                                                "GroupID": 1
                                            },
                                            {
                                                "UserGUID": "DC2DC289-FD8E-F011-9FC1-000C29AAA2A1",
                                                "UserName": "FazilMF",
                                                "FullName": "Mohamed  Fazil",
                                                "UnitName": "Cyber Security",
                                                "UnitID": 1,
                                                "GroupName": "Credit & Risk",
                                                "GroupID": 1
                                            },
                                            {
                                                "UserGUID": "D0AA5AB7-CFC1-EF11-9453-000C29318C88",
                                                "UserName": "GRCUser002",
                                                "FullName": "GRC SE Two",
                                                "UnitName": "Retail Credit",
                                                "UnitID": 2,
                                                "GroupName": "Credit & Risk",
                                                "GroupID": 1
                                            },
                                            {
                                                "UserGUID": "F0B89B7B-F2C1-EF11-9453-000C29318C88",
                                                "UserName": "Anupam",
                                                "FullName": "Anupam SE Dash",
                                                "UnitName": "Retail Credit",
                                                "UnitID": 2,
                                                "GroupName": "Credit & Risk",
                                                "GroupID": 1
                                            },
                                            {
                                                "UserGUID": "DB9FC826-F3D7-EF11-9472-000C29318C88",
                                                "UserName": "testuser1",
                                                "FullName": "test SE one",
                                                "UnitName": "Retail Credit",
                                                "UnitID": 2,
                                                "GroupName": "Credit & Risk",
                                                "GroupID": 1
                                            },
                                            {
                                                "UserGUID": "5AEFD598-06DE-EF11-947A-000C29318C88",
                                                "UserName": "Anupamdash",
                                                "FullName": "Anupam SE Dash G",
                                                "UnitName": "Retail Credit",
                                                "UnitID": 2,
                                                "GroupName": "Credit & Risk",
                                                "GroupID": 1
                                            },
                                            {
                                                "UserGUID": "DC2DC289-FD8E-F011-9FC1-000C29AAA2A1",
                                                "UserName": "FazilMF",
                                                "FullName": "Mohamed  Fazil",
                                                "UnitName": "Retail Credit",
                                                "UnitID": 2,
                                                "GroupName": "Credit & Risk",
                                                "GroupID": 1
                                            },
                                            {
                                                "UserGUID": "DC2DC289-FD8E-F011-9FC1-000C29AAA2A1",
                                                "UserName": "FazilMF",
                                                "FullName": "Mohamed  Fazil",
                                                "UnitName": "Corporate Credit",
                                                "UnitID": 3,
                                                "GroupName": "Credit & Risk",
                                                "GroupID": 1
                                            },
                                            {
                                                "UserGUID": "DC2DC289-FD8E-F011-9FC1-000C29AAA2A1",
                                                "UserName": "FazilMF",
                                                "FullName": "Mohamed  Fazil",
                                                "UnitName": "Collections",
                                                "UnitID": 4,
                                                "GroupName": "Credit & Risk",
                                                "GroupID": 1
                                            },
                                            {
                                                "UserGUID": "CF37782C-CBC1-EF11-9453-000C29318C88",
                                                "UserName": "GRCAuditorUser1",
                                                "FullName": "GRC SE User One",
                                                "UnitName": "Risk Management",
                                                "UnitID": 5,
                                                "GroupName": "Credit & Risk",
                                                "GroupID": 1
                                            },
                                            {
                                                "UserGUID": "F8BE567B-CFC1-EF11-9453-000C29318C88",
                                                "UserName": "useradmin",
                                                "FullName": "user SE test A",
                                                "UnitName": "Risk Management",
                                                "UnitID": 5,
                                                "GroupName": "Credit & Risk",
                                                "GroupID": 1
                                            },
                                            {
                                                "UserGUID": "3313187D-DAC1-EF11-9453-000C29318C88",
                                                "UserName": "GRCUser003",
                                                "FullName": "GRC SE Three",
                                                "UnitName": "Risk Management",
                                                "UnitID": 5,
                                                "GroupName": "Credit & Risk",
                                                "GroupID": 1
                                            },
                                            {
                                                "UserGUID": "DF220D15-DCC1-EF11-9453-000C29318C88",
                                                "UserName": "Sangram",
                                                "FullName": "Sangram BCM SE Bhuyan",
                                                "UnitName": "Risk Management",
                                                "UnitID": 5,
                                                "GroupName": "Credit & Risk",
                                                "GroupID": 1
                                            },
                                            {
                                                "UserGUID": "CC4378E8-DCC1-EF11-9453-000C29318C88",
                                                "UserName": "Sinchana1",
                                                "FullName": "Sinchana SE UserOne",
                                                "UnitName": "Risk Management",
                                                "UnitID": 5,
                                                "GroupName": "Credit & Risk",
                                                "GroupID": 1
                                            },
                                            {
                                                "UserGUID": "45666691-E9C1-EF11-9453-000C29318C88",
                                                "UserName": "GRCUserAdmin",
                                                "FullName": "Niranjan SE Srichandan",
                                                "UnitName": "Risk Management",
                                                "UnitID": 5,
                                                "GroupName": "Credit & Risk",
                                                "GroupID": 1
                                            },
                                            {
                                                "UserGUID": "0DD648A7-EBC1-EF11-9453-000C29318C88",
                                                "UserName": "Bhuban",
                                                "FullName": "Bhubanananda SE Tripathy",
                                                "UnitName": "Risk Management",
                                                "UnitID": 5,
                                                "GroupName": "Credit & Risk",
                                                "GroupID": 1
                                            },
                                            {
                                                "UserGUID": "9BC3ABFB-83C3-EF11-9456-000C29318C88",
                                                "UserName": "GRCAdminPro",
                                                "FullName": "GRC Admin Pro",
                                                "UnitName": "Risk Management",
                                                "UnitID": 5,
                                                "GroupName": "Credit & Risk",
                                                "GroupID": 1
                                            },
                                            {
                                                "UserGUID": "ABD9467E-74C6-EF11-945A-000C29318C88",
                                                "UserName": "GRCUser009",
                                                "FullName": "Vandana SE GRC NIne",
                                                "UnitName": "Risk Management",
                                                "UnitID": 5,
                                                "GroupName": "Credit & Risk",
                                                "GroupID": 1
                                            },
                                            {
                                                "UserGUID": "FC3BD0F9-6FCE-EF11-9466-000C29318C88",
                                                "UserName": "Debadatta",
                                                "FullName": "Debadatta SE Jena",
                                                "UnitName": "Risk Management",
                                                "UnitID": 5,
                                                "GroupName": "Credit & Risk",
                                                "GroupID": 1
                                            },
                                            {
                                                "UserGUID": "B4A0CDE4-F4D7-EF11-9472-000C29318C88",
                                                "UserName": "testuser2",
                                                "FullName": "Test SE Two",
                                                "UnitName": "Risk Management",
                                                "UnitID": 5,
                                                "GroupName": "Credit & Risk",
                                                "GroupID": 1
                                            },
                                            {
                                                "UserGUID": "13A3F9B0-A2D8-EF11-9473-000C29318C88",
                                                "UserName": "Sinchana2",
                                                "FullName": "Sinchana SE UserTwo",
                                                "UnitName": "Risk Management",
                                                "UnitID": 5,
                                                "GroupName": "Credit & Risk",
                                                "GroupID": 1
                                            },
                                            {
                                                "UserGUID": "B1FFB063-72D9-EF11-9474-000C29318C88",
                                                "UserName": "Amrutanshu1",
                                                "FullName": "Amrutanshu SE One",
                                                "UnitName": "Risk Management",
                                                "UnitID": 5,
                                                "GroupName": "Credit & Risk",
                                                "GroupID": 1
                                            },
                                            {
                                                "UserGUID": "DDE7A678-97DC-EF11-9478-000C29318C88",
                                                "UserName": "SangramK",
                                                "FullName": "Sangram SE K",
                                                "UnitName": "Risk Management",
                                                "UnitID": 5,
                                                "GroupName": "Credit & Risk",
                                                "GroupID": 1
                                            },
                                            {
                                                "UserGUID": "DC2DC289-FD8E-F011-9FC1-000C29AAA2A1",
                                                "UserName": "FazilMF",
                                                "FullName": "Mohamed  Fazil",
                                                "UnitName": "Risk Management",
                                                "UnitID": 5,
                                                "GroupName": "Credit & Risk",
                                                "GroupID": 1
                                            },
                                            {
                                                "UserGUID": "F8313E01-F39D-F011-9FC1-000C29AAA2A1",
                                                "UserName": "Nilesh",
                                                "FullName": "Nilesh Middle Last",
                                                "UnitName": "Risk Management",
                                                "UnitID": 5,
                                                "GroupName": "Credit & Risk",
                                                "GroupID": 1
                                            },
                                            {
                                                "UserGUID": "9BDBD7E6-C9C1-EF11-9453-000C29318C88",
                                                "UserName": "testsajid01",
                                                "FullName": "Sajid SE Standard User",
                                                "UnitName": "Information Technology",
                                                "UnitID": 6,
                                                "GroupName": "Operations & Shared Services",
                                                "GroupID": 2
                                            },
                                            {
                                                "UserGUID": "DC2DC289-FD8E-F011-9FC1-000C29AAA2A1",
                                                "UserName": "FazilMF",
                                                "FullName": "Mohamed  Fazil",
                                                "UnitName": "Information Technology",
                                                "UnitID": 6,
                                                "GroupName": "Operations & Shared Services",
                                                "GroupID": 2
                                            },
                                            {
                                                "UserGUID": "9BDBD7E6-C9C1-EF11-9453-000C29318C88",
                                                "UserName": "testsajid01",
                                                "FullName": "Sajid SE Standard User",
                                                "UnitName": "Credit Administration & Control",
                                                "UnitID": 7,
                                                "GroupName": "Operations & Shared Services",
                                                "GroupID": 2
                                            },
                                            {
                                                "UserGUID": "82FDD5BA-DCC1-EF11-9453-000C29318C88",
                                                "UserName": "Amrutanshu",
                                                "FullName": "Amrutanshu SE sahoo",
                                                "UnitName": "Credit Administration & Control",
                                                "UnitID": 7,
                                                "GroupName": "Operations & Shared Services",
                                                "GroupID": 2
                                            },
                                            {
                                                "UserGUID": "4E11C34C-84C6-EF11-945A-000C29318C88",
                                                "UserName": "TestNew0012",
                                                "FullName": "Test SE User",
                                                "UnitName": "Credit Administration & Control",
                                                "UnitID": 7,
                                                "GroupName": "Operations & Shared Services",
                                                "GroupID": 2
                                            },
                                            {
                                                "UserGUID": "DB9FC826-F3D7-EF11-9472-000C29318C88",
                                                "UserName": "testuser1",
                                                "FullName": "test SE one",
                                                "UnitName": "Credit Administration & Control",
                                                "UnitID": 7,
                                                "GroupName": "Operations & Shared Services",
                                                "GroupID": 2
                                            },
                                            {
                                                "UserGUID": "CF37782C-CBC1-EF11-9453-000C29318C88",
                                                "UserName": "GRCAuditorUser1",
                                                "FullName": "GRC SE User One",
                                                "UnitName": "Compliance",
                                                "UnitID": 10,
                                                "GroupName": "Legal and Governance",
                                                "GroupID": 3
                                            },
                                            {
                                                "UserGUID": "D79512E0-83C6-EF11-945A-000C29318C88",
                                                "UserName": "TestNew001",
                                                "FullName": "Test SE User",
                                                "UnitName": "Compliance",
                                                "UnitID": 10,
                                                "GroupName": "Legal and Governance",
                                                "GroupID": 3
                                            },
                                            {
                                                "UserGUID": "B65D2FE8-73D9-EF11-9474-000C29318C88",
                                                "UserName": "Sinchana3",
                                                "FullName": "sinchana SE UserThree",
                                                "UnitName": "Compliance",
                                                "UnitID": 10,
                                                "GroupName": "Legal and Governance",
                                                "GroupID": 3
                                            },
                                            {
                                                "UserGUID": "DC2DC289-FD8E-F011-9FC1-000C29AAA2A1",
                                                "UserName": "FazilMF",
                                                "FullName": "Mohamed  Fazil",
                                                "UnitName": "Compliance",
                                                "UnitID": 10,
                                                "GroupName": "Legal and Governance",
                                                "GroupID": 3
                                            },
                                            {
                                                "UserGUID": "020B7E1E-CFC1-EF11-9453-000C29318C88",
                                                "UserName": "superuser",
                                                "FullName": "Super SE user",
                                                "UnitName": "Governance",
                                                "UnitID": 11,
                                                "GroupName": "Legal and Governance",
                                                "GroupID": 3
                                            },
                                            {
                                                "UserGUID": "DC2DC289-FD8E-F011-9FC1-000C29AAA2A1",
                                                "UserName": "FazilMF",
                                                "FullName": "Mohamed  Fazil",
                                                "UnitName": "Governance",
                                                "UnitID": 11,
                                                "GroupName": "Legal and Governance",
                                                "GroupID": 3
                                            },
                                            {
                                                "UserGUID": "CC4378E8-DCC1-EF11-9453-000C29318C88",
                                                "UserName": "Sinchana1",
                                                "FullName": "Sinchana SE UserOne",
                                                "UnitName": "Legal",
                                                "UnitID": 12,
                                                "GroupName": "Legal and Governance",
                                                "GroupID": 3
                                            },
                                            {
                                                "UserGUID": "D79512E0-83C6-EF11-945A-000C29318C88",
                                                "UserName": "TestNew001",
                                                "FullName": "Test SE User",
                                                "UnitName": "Legal",
                                                "UnitID": 12,
                                                "GroupName": "Legal and Governance",
                                                "GroupID": 3
                                            },
                                            {
                                                "UserGUID": "5AEFD598-06DE-EF11-947A-000C29318C88",
                                                "UserName": "Anupamdash",
                                                "FullName": "Anupam SE Dash G",
                                                "UnitName": "Legal",
                                                "UnitID": 12,
                                                "GroupName": "Legal and Governance",
                                                "GroupID": 3
                                            },
                                            {
                                                "UserGUID": "DC2DC289-FD8E-F011-9FC1-000C29AAA2A1",
                                                "UserName": "FazilMF",
                                                "FullName": "Mohamed  Fazil",
                                                "UnitName": "Legal",
                                                "UnitID": 12,
                                                "GroupName": "Legal and Governance",
                                                "GroupID": 3
                                            },
                                            {
                                                "UserGUID": "D79512E0-83C6-EF11-945A-000C29318C88",
                                                "UserName": "TestNew001",
                                                "FullName": "Test SE User",
                                                "UnitName": "Treasury",
                                                "UnitID": 15,
                                                "GroupName": "Finance & Accounting",
                                                "GroupID": 4
                                            },
                                            {
                                                "UserGUID": "5AEFD598-06DE-EF11-947A-000C29318C88",
                                                "UserName": "Anupamdash",
                                                "FullName": "Anupam SE Dash G",
                                                "UnitName": "Treasury",
                                                "UnitID": 15,
                                                "GroupName": "Finance & Accounting",
                                                "GroupID": 4
                                            },
                                            {
                                                "UserGUID": "DC2DC289-FD8E-F011-9FC1-000C29AAA2A1",
                                                "UserName": "FazilMF",
                                                "FullName": "Mohamed  Fazil",
                                                "UnitName": "Business Development & Marketing",
                                                "UnitID": 16,
                                                "GroupName": "Strategy & Marketing",
                                                "GroupID": 5
                                            },
                                            {
                                                "UserGUID": "DC2DC289-FD8E-F011-9FC1-000C29AAA2A1",
                                                "UserName": "FazilMF",
                                                "FullName": "Mohamed  Fazil",
                                                "UnitName": "Strategy",
                                                "UnitID": 17,
                                                "GroupName": "Strategy & Marketing",
                                                "GroupID": 5
                                            },
                                            {
                                                "UserGUID": "020B7E1E-CFC1-EF11-9453-000C29318C88",
                                                "UserName": "superuser",
                                                "FullName": "Super SE user",
                                                "UnitName": "Human Resources",
                                                "UnitID": 18,
                                                "GroupName": "HR & Admin",
                                                "GroupID": 6
                                            },
                                            {
                                                "UserGUID": "9BC3ABFB-83C3-EF11-9456-000C29318C88",
                                                "UserName": "GRCAdminPro",
                                                "FullName": "GRC Admin Pro",
                                                "UnitName": "Human Resources",
                                                "UnitID": 18,
                                                "GroupName": "HR & Admin",
                                                "GroupID": 6
                                            },
                                            {
                                                "UserGUID": "1FB66BF3-27C4-EF11-9457-000C29318C88",
                                                "UserName": "GRCUser007",
                                                "FullName": "Vandana SE User Seven",
                                                "UnitName": "Human Resources",
                                                "UnitID": 18,
                                                "GroupName": "HR & Admin",
                                                "GroupID": 6
                                            },
                                            {
                                                "UserGUID": "4E11C34C-84C6-EF11-945A-000C29318C88",
                                                "UserName": "TestNew0012",
                                                "FullName": "Test SE User",
                                                "UnitName": "Human Resources",
                                                "UnitID": 18,
                                                "GroupName": "HR & Admin",
                                                "GroupID": 6
                                            },
                                            {
                                                "UserGUID": "C946D135-81DC-EF11-9478-000C29318C88",
                                                "UserName": "SudipRoy",
                                                "FullName": "Sudip SE Roy",
                                                "UnitName": "Human Resources",
                                                "UnitID": 18,
                                                "GroupName": "HR & Admin",
                                                "GroupID": 6
                                            },
                                            {
                                                "UserGUID": "D79512E0-83C6-EF11-945A-000C29318C88",
                                                "UserName": "TestNew001",
                                                "FullName": "Test SE User",
                                                "UnitName": "Retail Group",
                                                "UnitID": 20,
                                                "GroupName": "Retail Group",
                                                "GroupID": 7
                                            },
                                            {
                                                "UserGUID": "D0AA5AB7-CFC1-EF11-9453-000C29318C88",
                                                "UserName": "GRCUser002",
                                                "FullName": "GRC SE Two",
                                                "UnitName": "Internal Audit",
                                                "UnitID": 22,
                                                "GroupName": "Internal Audit",
                                                "GroupID": 9
                                            },
                                            {
                                                "UserGUID": "3313187D-DAC1-EF11-9453-000C29318C88",
                                                "UserName": "GRCUser003",
                                                "FullName": "GRC SE Three",
                                                "UnitName": "Internal Audit",
                                                "UnitID": 22,
                                                "GroupName": "Internal Audit",
                                                "GroupID": 9
                                            },
                                            {
                                                "UserGUID": "1FB66BF3-27C4-EF11-9457-000C29318C88",
                                                "UserName": "GRCUser007",
                                                "FullName": "Vandana SE User Seven",
                                                "UnitName": "Remedial",
                                                "UnitID": 23,
                                                "GroupName": "Credit & Risk",
                                                "GroupID": 1
                                            },
                                            {
                                                "UserGUID": "7AD436F0-4DDA-EF11-9475-000C29318C88",
                                                "UserName": "ShwethaA",
                                                "FullName": "ShwethaA SE A",
                                                "UnitName": "Credit-ALCO",
                                                "UnitID": 24,
                                                "GroupName": "Credit & Risk",
                                                "GroupID": 1
                                            },
                                            {
                                                "UserGUID": "9BDBD7E6-C9C1-EF11-9453-000C29318C88",
                                                "UserName": "testsajid01",
                                                "FullName": "Sajid SE Standard User",
                                                "UnitName": "BCM",
                                                "UnitID": 37,
                                                "GroupName": "Credit & Risk",
                                                "GroupID": 1
                                            },
                                            {
                                                "UserGUID": "CF37782C-CBC1-EF11-9453-000C29318C88",
                                                "UserName": "GRCAuditorUser1",
                                                "FullName": "GRC SE User One",
                                                "UnitName": "BCM",
                                                "UnitID": 37,
                                                "GroupName": "Credit & Risk",
                                                "GroupID": 1
                                            },
                                            {
                                                "UserGUID": "020B7E1E-CFC1-EF11-9453-000C29318C88",
                                                "UserName": "superuser",
                                                "FullName": "Super SE user",
                                                "UnitName": "BCM",
                                                "UnitID": 37,
                                                "GroupName": "Credit & Risk",
                                                "GroupID": 1
                                            },
                                            {
                                                "UserGUID": "3313187D-DAC1-EF11-9453-000C29318C88",
                                                "UserName": "GRCUser003",
                                                "FullName": "GRC SE Three",
                                                "UnitName": "BCM",
                                                "UnitID": 37,
                                                "GroupName": "Credit & Risk",
                                                "GroupID": 1
                                            },
                                            {
                                                "UserGUID": "DF220D15-DCC1-EF11-9453-000C29318C88",
                                                "UserName": "Sangram",
                                                "FullName": "Sangram BCM SE Bhuyan",
                                                "UnitName": "BCM",
                                                "UnitID": 37,
                                                "GroupName": "Credit & Risk",
                                                "GroupID": 1
                                            },
                                            {
                                                "UserGUID": "CC4378E8-DCC1-EF11-9453-000C29318C88",
                                                "UserName": "Sinchana1",
                                                "FullName": "Sinchana SE UserOne",
                                                "UnitName": "BCM",
                                                "UnitID": 37,
                                                "GroupName": "Credit & Risk",
                                                "GroupID": 1
                                            },
                                            {
                                                "UserGUID": "45666691-E9C1-EF11-9453-000C29318C88",
                                                "UserName": "GRCUserAdmin",
                                                "FullName": "Niranjan SE Srichandan",
                                                "UnitName": "BCM",
                                                "UnitID": 37,
                                                "GroupName": "Credit & Risk",
                                                "GroupID": 1
                                            },
                                            {
                                                "UserGUID": "0DD648A7-EBC1-EF11-9453-000C29318C88",
                                                "UserName": "Bhuban",
                                                "FullName": "Bhubanananda SE Tripathy",
                                                "UnitName": "BCM",
                                                "UnitID": 37,
                                                "GroupName": "Credit & Risk",
                                                "GroupID": 1
                                            },
                                            {
                                                "UserGUID": "F0B89B7B-F2C1-EF11-9453-000C29318C88",
                                                "UserName": "Anupam",
                                                "FullName": "Anupam SE Dash",
                                                "UnitName": "BCM",
                                                "UnitID": 37,
                                                "GroupName": "Credit & Risk",
                                                "GroupID": 1
                                            },
                                            {
                                                "UserGUID": "9BC3ABFB-83C3-EF11-9456-000C29318C88",
                                                "UserName": "GRCAdminPro",
                                                "FullName": "GRC Admin Pro",
                                                "UnitName": "BCM",
                                                "UnitID": 37,
                                                "GroupName": "Credit & Risk",
                                                "GroupID": 1
                                            },
                                            {
                                                "UserGUID": "4E11C34C-84C6-EF11-945A-000C29318C88",
                                                "UserName": "TestNew0012",
                                                "FullName": "Test SE User",
                                                "UnitName": "BCM",
                                                "UnitID": 37,
                                                "GroupName": "Credit & Risk",
                                                "GroupID": 1
                                            },
                                            {
                                                "UserGUID": "FC3BD0F9-6FCE-EF11-9466-000C29318C88",
                                                "UserName": "Debadatta",
                                                "FullName": "Debadatta SE Jena",
                                                "UnitName": "BCM",
                                                "UnitID": 37,
                                                "GroupName": "Credit & Risk",
                                                "GroupID": 1
                                            },
                                            {
                                                "UserGUID": "13A3F9B0-A2D8-EF11-9473-000C29318C88",
                                                "UserName": "Sinchana2",
                                                "FullName": "Sinchana SE UserTwo",
                                                "UnitName": "BCM",
                                                "UnitID": 37,
                                                "GroupName": "Credit & Risk",
                                                "GroupID": 1
                                            },
                                            {
                                                "UserGUID": "B1FFB063-72D9-EF11-9474-000C29318C88",
                                                "UserName": "Amrutanshu1",
                                                "FullName": "Amrutanshu SE One",
                                                "UnitName": "BCM",
                                                "UnitID": 37,
                                                "GroupName": "Credit & Risk",
                                                "GroupID": 1
                                            },
                                            {
                                                "UserGUID": "B2AB8834-4CDA-EF11-9475-000C29318C88",
                                                "UserName": "Naaaganandan",
                                                "FullName": "Nandan SE Nandan",
                                                "UnitName": "BCM",
                                                "UnitID": 37,
                                                "GroupName": "Credit & Risk",
                                                "GroupID": 1
                                            },
                                            {
                                                "UserGUID": "C946D135-81DC-EF11-9478-000C29318C88",
                                                "UserName": "SudipRoy",
                                                "FullName": "Sudip SE Roy",
                                                "UnitName": "BCM",
                                                "UnitID": 37,
                                                "GroupName": "Credit & Risk",
                                                "GroupID": 1
                                            },
                                            {
                                                "UserGUID": "DDE7A678-97DC-EF11-9478-000C29318C88",
                                                "UserName": "SangramK",
                                                "FullName": "Sangram SE K",
                                                "UnitName": "BCM",
                                                "UnitID": 37,
                                                "GroupName": "Credit & Risk",
                                                "GroupID": 1
                                            },
                                            {
                                                "UserGUID": "F8313E01-F39D-F011-9FC1-000C29AAA2A1",
                                                "UserName": "Nilesh",
                                                "FullName": "Nilesh Middle Last",
                                                "UnitName": "BCM",
                                                "UnitID": 37,
                                                "GroupName": "Credit & Risk",
                                                "GroupID": 1
                                            },
                                            {
                                                "UserGUID": "FC3BD0F9-6FCE-EF11-9466-000C29318C88",
                                                "UserName": "Debadatta",
                                                "FullName": "Debadatta SE Jena",
                                                "UnitName": "Data Management",
                                                "UnitID": 39,
                                                "GroupName": "Operations & Shared Services",
                                                "GroupID": 2
                                            },
                                            {
                                                "UserGUID": "CC841E18-CDC1-EF11-9453-000C29318C88",
                                                "UserName": "GRCUser001",
                                                "FullName": "GRC SE One",
                                                "UnitName": "Digital Group",
                                                "UnitID": 40,
                                                "GroupName": "Digital Group",
                                                "GroupID": 1007
                                            },
                                            {
                                                "UserGUID": "44C6040B-E6C1-EF11-9453-000C29318C88",
                                                "UserName": "Ansuman",
                                                "FullName": "Ansuman SE Chakra",
                                                "UnitName": "Digital Group",
                                                "UnitID": 40,
                                                "GroupName": "Digital Group",
                                                "GroupID": 1007
                                            },
                                            {
                                                "UserGUID": "0D5A7A37-F5C1-EF11-9453-000C29318C88",
                                                "UserName": "GRCUser004",
                                                "FullName": "GRC User four",
                                                "UnitName": "Digital Group",
                                                "UnitID": 40,
                                                "GroupName": "Digital Group",
                                                "GroupID": 1007
                                            },
                                            {
                                                "UserGUID": "DC2DC289-FD8E-F011-9FC1-000C29AAA2A1",
                                                "UserName": "FazilMF",
                                                "FullName": "Mohamed  Fazil",
                                                "UnitName": "Compliance.",
                                                "UnitID": 43,
                                                "GroupName": "Compliance.",
                                                "GroupID": 1008
                                            },
                                            {
                                                "UserGUID": "3313187D-DAC1-EF11-9453-000C29318C88",
                                                "UserName": "GRCUser003",
                                                "FullName": "GRC SE Three",
                                                "UnitName": "Management",
                                                "UnitID": 44,
                                                "GroupName": "Management",
                                                "GroupID": 1009
                                            },
                                            {
                                                "UserGUID": "DC2DC289-FD8E-F011-9FC1-000C29AAA2A1",
                                                "UserName": "FazilMF",
                                                "FullName": "Mohamed  Fazil",
                                                "UnitName": "Management",
                                                "UnitID": 44,
                                                "GroupName": "Management",
                                                "GroupID": 1009
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
