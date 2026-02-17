module.exports = {
    tags: ["KRI"],
    description:
        "Description: \n- This api is responsible for sending submit KRI status to DB.",
    operationId: "submitKRIReview",
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
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    metricIDs: { type: "string" },
                                },
                                example: [
                                    {
                                        "metricID": "28,106,111,113,116,117,118",
                                    },

                                ]
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
            description: "Submitted successfully.",
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
                                example: "Submitted successfully.",
                            },
                            result: {
                                type: "array",
                                items: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            // Common properties across arrays
                                            KRICode: { type: "string" },
                                            MetricID: { type: "string" },
                                            MeasurementID: { type: "string" },
                                            ReportID: { type: "string" },
                                            Period: { type: "string" },
                                            StatusID: { type: "integer" },
                                            StatusName: { type: "string" },
                                            ReviewedBy: { type: "string" },
                                            UnitID: { type: "integer" },
                                            UnitName: { type: "string" },
                                            IsReviewed: { type: "boolean" },

                                            // User / Reviewer info
                                            FirstName: { type: "string" },
                                            MiddleName: { type: "string" },
                                            LastName: { type: "string" },
                                            EmailID: { type: "string", format: "email" },
                                            UserGUID: { type: "string" },
                                            UserType: { type: "string" },

                                            // Metric details
                                            Description: { type: "string" },
                                            MeasurementFrequencyID: { type: "integer" },
                                            MeasurementFrequency: { type: "string" },
                                            KRITypeID: { type: "integer" },
                                            KRIType: { type: "string" },
                                            ThresholdValue1: { type: "number" },
                                            ThresholdValue2: { type: "number" },
                                            ThresholdValue3: { type: "number" },
                                            ThresholdValue4: { type: "number" },
                                            ThresholdValue5: { type: "number" }
                                        }
                                    }
                                },
                                example: [
                                    [
                                        {
                                            KRICode: "KRI-CS-001",
                                            MetricID: "28",
                                            MeasurementID: "18",
                                            ReportID: "3",
                                            Period: "Oct 2025",
                                            StatusID: 2,
                                            StatusName: "Rejected",
                                            ReviewedBy: "Mohamed  Fazil",
                                            UnitID: 1,
                                            UnitName: "Cyber Security",
                                            IsReviewed: false
                                        },
                                        {
                                            "KRICode": "KRI-CS-002",
                                            "MetricID": "106",
                                            "MeasurementID": "13",
                                            "ReportID": "4",
                                            "Period": "Oct 2025",
                                            "StatusID": 2,
                                            "StatusName": "Rejected",
                                            "ReviewedBy": "Mohamed  Fazil",
                                            "UnitID": 1,
                                            "UnitName": "Cyber Security",
                                            "IsReviewed": false
                                        },
                                        {
                                            "KRICode": "KRI-CS-005",
                                            "MetricID": "111",
                                            "MeasurementID": "14",
                                            "ReportID": "5",
                                            "Period": "Oct 2025",
                                            "StatusID": 2,
                                            "StatusName": "Rejected",
                                            "ReviewedBy": "Mohamed  Fazil",
                                            "UnitID": 1,
                                            "UnitName": "Cyber Security",
                                            "IsReviewed": false
                                        },
                                        {
                                            "KRICode": "KRI-CS-006",
                                            "MetricID": "113",
                                            "MeasurementID": "15",
                                            "ReportID": "6",
                                            "Period": "Oct 2025",
                                            "StatusID": 2,
                                            "StatusName": "Rejected",
                                            "ReviewedBy": "Mohamed  Fazil",
                                            "UnitID": 1,
                                            "UnitName": "Cyber Security",
                                            "IsReviewed": false
                                        },
                                        {
                                            "KRICode": "KRI-CS-009",
                                            "MetricID": "116",
                                            "MeasurementID": "10",
                                            "ReportID": "9",
                                            "Period": "Oct 2025",
                                            "StatusID": 2,
                                            "StatusName": "Rejected",
                                            "ReviewedBy": "Mohamed  Fazil",
                                            "UnitID": 1,
                                            "UnitName": "Cyber Security",
                                            "IsReviewed": false
                                        },
                                        {
                                            "KRICode": "KRI-CS-010",
                                            "MetricID": "117",
                                            "MeasurementID": "11",
                                            "ReportID": "10",
                                            "Period": "Oct 2025",
                                            "StatusID": 2,
                                            "StatusName": "Rejected",
                                            "ReviewedBy": "Mohamed  Fazil",
                                            "UnitID": 1,
                                            "UnitName": "Cyber Security",
                                            "IsReviewed": false
                                        },
                                        {
                                            "KRICode": "KRI-CS-011",
                                            "MetricID": "118",
                                            "MeasurementID": "21",
                                            "ReportID": "11",
                                            "Period": "Oct 2025",
                                            "StatusID": 2,
                                            "StatusName": "Rejected",
                                            "ReviewedBy": "Mohamed  Fazil",
                                            "UnitID": 1,
                                            "UnitName": "Cyber Security",
                                            "IsReviewed": false
                                        }
                                    ],
                                    [
                                        {
                                            UnitID: 1,
                                            UnitName: "Cyber Security",
                                            FirstName: "Nandan",
                                            MiddleName: "SE",
                                            LastName: "Nandan",
                                            EmailID: "sudarshan.kokku@secureyes.net",
                                            UserGUID: "B2AB8834-4CDA-EF11-9475-000C29318C88",
                                            UserType: "FA"
                                        },
                                        {
                                            "UnitID": 1,
                                            "UnitName": "Cyber Security",
                                            "FirstName": "Nandan",
                                            "MiddleName": "SE",
                                            "LastName": "Nandan",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "B2AB8834-4CDA-EF11-9475-000C29318C88",
                                            "UserType": "FA"
                                        },
                                        {
                                            "UnitID": 1,
                                            "UnitName": "Cyber Security",
                                            "FirstName": "Nandan",
                                            "MiddleName": "SE",
                                            "LastName": "Nandan",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "B2AB8834-4CDA-EF11-9475-000C29318C88",
                                            "UserType": "FA"
                                        },
                                        {
                                            "UnitID": 1,
                                            "UnitName": "Cyber Security",
                                            "FirstName": "Nandan",
                                            "MiddleName": "SE",
                                            "LastName": "Nandan",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "B2AB8834-4CDA-EF11-9475-000C29318C88",
                                            "UserType": "FA"
                                        },
                                        {
                                            "UnitID": 1,
                                            "UnitName": "Cyber Security",
                                            "FirstName": "Nandan",
                                            "MiddleName": "SE",
                                            "LastName": "Nandan",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "B2AB8834-4CDA-EF11-9475-000C29318C88",
                                            "UserType": "FA"
                                        },
                                        {
                                            "UnitID": 1,
                                            "UnitName": "Cyber Security",
                                            "FirstName": "Nandan",
                                            "MiddleName": "SE",
                                            "LastName": "Nandan",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "B2AB8834-4CDA-EF11-9475-000C29318C88",
                                            "UserType": "FA"
                                        },
                                        {
                                            "UnitID": 1,
                                            "UnitName": "Cyber Security",
                                            "FirstName": "Nandan",
                                            "MiddleName": "SE",
                                            "LastName": "Nandan",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "B2AB8834-4CDA-EF11-9475-000C29318C88",
                                            "UserType": "FA"
                                        },
                                        {
                                            "UnitID": 1,
                                            "UnitName": "Cyber Security",
                                            "FirstName": "Test",
                                            "MiddleName": "SE",
                                            "LastName": "User",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "4E11C34C-84C6-EF11-945A-000C29318C88",
                                            "UserType": "PU"
                                        },
                                        {
                                            "UnitID": 1,
                                            "UnitName": "Cyber Security",
                                            "FirstName": "Test",
                                            "MiddleName": "SE",
                                            "LastName": "User",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "4E11C34C-84C6-EF11-945A-000C29318C88",
                                            "UserType": "PU"
                                        },
                                        {
                                            "UnitID": 1,
                                            "UnitName": "Cyber Security",
                                            "FirstName": "Test",
                                            "MiddleName": "SE",
                                            "LastName": "User",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "4E11C34C-84C6-EF11-945A-000C29318C88",
                                            "UserType": "PU"
                                        },
                                        {
                                            "UnitID": 1,
                                            "UnitName": "Cyber Security",
                                            "FirstName": "Test",
                                            "MiddleName": "SE",
                                            "LastName": "User",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "4E11C34C-84C6-EF11-945A-000C29318C88",
                                            "UserType": "PU"
                                        },
                                        {
                                            "UnitID": 1,
                                            "UnitName": "Cyber Security",
                                            "FirstName": "Test",
                                            "MiddleName": "SE",
                                            "LastName": "User",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "4E11C34C-84C6-EF11-945A-000C29318C88",
                                            "UserType": "PU"
                                        },
                                        {
                                            "UnitID": 1,
                                            "UnitName": "Cyber Security",
                                            "FirstName": "Test",
                                            "MiddleName": "SE",
                                            "LastName": "User",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "4E11C34C-84C6-EF11-945A-000C29318C88",
                                            "UserType": "PU"
                                        },
                                        {
                                            "UnitID": 1,
                                            "UnitName": "Cyber Security",
                                            "FirstName": "Test",
                                            "MiddleName": "SE",
                                            "LastName": "User",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "4E11C34C-84C6-EF11-945A-000C29318C88",
                                            "UserType": "PU"
                                        },
                                        {
                                            "UnitID": 1,
                                            "UnitName": "Cyber Security",
                                            "FirstName": "GRC",
                                            "MiddleName": "SE",
                                            "LastName": "Two",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "D0AA5AB7-CFC1-EF11-9453-000C29318C88",
                                            "UserType": "PU"
                                        },
                                        {
                                            "UnitID": 1,
                                            "UnitName": "Cyber Security",
                                            "FirstName": "GRC",
                                            "MiddleName": "SE",
                                            "LastName": "Two",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "D0AA5AB7-CFC1-EF11-9453-000C29318C88",
                                            "UserType": "PU"
                                        },
                                        {
                                            "UnitID": 1,
                                            "UnitName": "Cyber Security",
                                            "FirstName": "GRC",
                                            "MiddleName": "SE",
                                            "LastName": "Two",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "D0AA5AB7-CFC1-EF11-9453-000C29318C88",
                                            "UserType": "PU"
                                        },
                                        {
                                            "UnitID": 1,
                                            "UnitName": "Cyber Security",
                                            "FirstName": "GRC",
                                            "MiddleName": "SE",
                                            "LastName": "Two",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "D0AA5AB7-CFC1-EF11-9453-000C29318C88",
                                            "UserType": "PU"
                                        },
                                        {
                                            "UnitID": 1,
                                            "UnitName": "Cyber Security",
                                            "FirstName": "GRC",
                                            "MiddleName": "SE",
                                            "LastName": "Two",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "D0AA5AB7-CFC1-EF11-9453-000C29318C88",
                                            "UserType": "PU"
                                        },
                                        {
                                            "UnitID": 1,
                                            "UnitName": "Cyber Security",
                                            "FirstName": "GRC",
                                            "MiddleName": "SE",
                                            "LastName": "Two",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "D0AA5AB7-CFC1-EF11-9453-000C29318C88",
                                            "UserType": "PU"
                                        },
                                        {
                                            "UnitID": 1,
                                            "UnitName": "Cyber Security",
                                            "FirstName": "GRC",
                                            "MiddleName": "SE",
                                            "LastName": "Two",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "D0AA5AB7-CFC1-EF11-9453-000C29318C88",
                                            "UserType": "PU"
                                        },
                                        {
                                            "UnitID": 1,
                                            "UnitName": "Cyber Security",
                                            "FirstName": "MD",
                                            "MiddleName": "",
                                            "LastName": "Faz",
                                            "EmailID": "fazil.mohamed@secureyes.net",
                                            "UserGUID": "2217DFBE-2D92-F011-9FC1-000C29AAA2A1",
                                            "UserType": "FA"
                                        },
                                        {
                                            "UnitID": 1,
                                            "UnitName": "Cyber Security",
                                            "FirstName": "MD",
                                            "MiddleName": "",
                                            "LastName": "Faz",
                                            "EmailID": "fazil.mohamed@secureyes.net",
                                            "UserGUID": "2217DFBE-2D92-F011-9FC1-000C29AAA2A1",
                                            "UserType": "FA"
                                        },
                                        {
                                            "UnitID": 1,
                                            "UnitName": "Cyber Security",
                                            "FirstName": "MD",
                                            "MiddleName": "",
                                            "LastName": "Faz",
                                            "EmailID": "fazil.mohamed@secureyes.net",
                                            "UserGUID": "2217DFBE-2D92-F011-9FC1-000C29AAA2A1",
                                            "UserType": "FA"
                                        },
                                        {
                                            "UnitID": 1,
                                            "UnitName": "Cyber Security",
                                            "FirstName": "MD",
                                            "MiddleName": "",
                                            "LastName": "Faz",
                                            "EmailID": "fazil.mohamed@secureyes.net",
                                            "UserGUID": "2217DFBE-2D92-F011-9FC1-000C29AAA2A1",
                                            "UserType": "FA"
                                        },
                                        {
                                            "UnitID": 1,
                                            "UnitName": "Cyber Security",
                                            "FirstName": "MD",
                                            "MiddleName": "",
                                            "LastName": "Faz",
                                            "EmailID": "fazil.mohamed@secureyes.net",
                                            "UserGUID": "2217DFBE-2D92-F011-9FC1-000C29AAA2A1",
                                            "UserType": "FA"
                                        },
                                        {
                                            "UnitID": 1,
                                            "UnitName": "Cyber Security",
                                            "FirstName": "MD",
                                            "MiddleName": "",
                                            "LastName": "Faz",
                                            "EmailID": "fazil.mohamed@secureyes.net",
                                            "UserGUID": "2217DFBE-2D92-F011-9FC1-000C29AAA2A1",
                                            "UserType": "FA"
                                        },
                                        {
                                            "UnitID": 1,
                                            "UnitName": "Cyber Security",
                                            "FirstName": "MD",
                                            "MiddleName": "",
                                            "LastName": "Faz",
                                            "EmailID": "fazil.mohamed@secureyes.net",
                                            "UserGUID": "2217DFBE-2D92-F011-9FC1-000C29AAA2A1",
                                            "UserType": "FA"
                                        },
                                        {
                                            "UnitID": 1,
                                            "UnitName": "Cyber Security",
                                            "FirstName": "GRC",
                                            "MiddleName": "SE",
                                            "LastName": "Three",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "3313187D-DAC1-EF11-9453-000C29318C88",
                                            "UserType": "FA"
                                        },
                                        {
                                            "UnitID": 1,
                                            "UnitName": "Cyber Security",
                                            "FirstName": "GRC",
                                            "MiddleName": "SE",
                                            "LastName": "Three",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "3313187D-DAC1-EF11-9453-000C29318C88",
                                            "UserType": "FA"
                                        },
                                        {
                                            "UnitID": 1,
                                            "UnitName": "Cyber Security",
                                            "FirstName": "GRC",
                                            "MiddleName": "SE",
                                            "LastName": "Three",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "3313187D-DAC1-EF11-9453-000C29318C88",
                                            "UserType": "FA"
                                        },
                                        {
                                            "UnitID": 1,
                                            "UnitName": "Cyber Security",
                                            "FirstName": "GRC",
                                            "MiddleName": "SE",
                                            "LastName": "Three",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "3313187D-DAC1-EF11-9453-000C29318C88",
                                            "UserType": "FA"
                                        },
                                        {
                                            "UnitID": 1,
                                            "UnitName": "Cyber Security",
                                            "FirstName": "GRC",
                                            "MiddleName": "SE",
                                            "LastName": "Three",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "3313187D-DAC1-EF11-9453-000C29318C88",
                                            "UserType": "FA"
                                        },
                                        {
                                            "UnitID": 1,
                                            "UnitName": "Cyber Security",
                                            "FirstName": "GRC",
                                            "MiddleName": "SE",
                                            "LastName": "Three",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "3313187D-DAC1-EF11-9453-000C29318C88",
                                            "UserType": "FA"
                                        },
                                        {
                                            "UnitID": 1,
                                            "UnitName": "Cyber Security",
                                            "FirstName": "GRC",
                                            "MiddleName": "SE",
                                            "LastName": "Three",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "3313187D-DAC1-EF11-9453-000C29318C88",
                                            "UserType": "FA"
                                        },
                                        {
                                            "UnitID": 1,
                                            "UnitName": "Cyber Security",
                                            "FirstName": "Mohamed",
                                            "MiddleName": "",
                                            "LastName": "Fazil",
                                            "EmailID": "fazil.mohamed@secureyes.net",
                                            "UserGUID": "DC2DC289-FD8E-F011-9FC1-000C29AAA2A1",
                                            "UserType": "FA"
                                        },
                                        {
                                            "UnitID": 1,
                                            "UnitName": "Cyber Security",
                                            "FirstName": "Mohamed",
                                            "MiddleName": "",
                                            "LastName": "Fazil",
                                            "EmailID": "fazil.mohamed@secureyes.net",
                                            "UserGUID": "DC2DC289-FD8E-F011-9FC1-000C29AAA2A1",
                                            "UserType": "FA"
                                        },
                                        {
                                            "UnitID": 1,
                                            "UnitName": "Cyber Security",
                                            "FirstName": "Mohamed",
                                            "MiddleName": "",
                                            "LastName": "Fazil",
                                            "EmailID": "fazil.mohamed@secureyes.net",
                                            "UserGUID": "DC2DC289-FD8E-F011-9FC1-000C29AAA2A1",
                                            "UserType": "FA"
                                        },
                                        {
                                            "UnitID": 1,
                                            "UnitName": "Cyber Security",
                                            "FirstName": "Mohamed",
                                            "MiddleName": "",
                                            "LastName": "Fazil",
                                            "EmailID": "fazil.mohamed@secureyes.net",
                                            "UserGUID": "DC2DC289-FD8E-F011-9FC1-000C29AAA2A1",
                                            "UserType": "FA"
                                        },
                                        {
                                            "UnitID": 1,
                                            "UnitName": "Cyber Security",
                                            "FirstName": "Mohamed",
                                            "MiddleName": "",
                                            "LastName": "Fazil",
                                            "EmailID": "fazil.mohamed@secureyes.net",
                                            "UserGUID": "DC2DC289-FD8E-F011-9FC1-000C29AAA2A1",
                                            "UserType": "FA"
                                        },
                                        {
                                            "UnitID": 1,
                                            "UnitName": "Cyber Security",
                                            "FirstName": "Mohamed",
                                            "MiddleName": "",
                                            "LastName": "Fazil",
                                            "EmailID": "fazil.mohamed@secureyes.net",
                                            "UserGUID": "DC2DC289-FD8E-F011-9FC1-000C29AAA2A1",
                                            "UserType": "FA"
                                        },
                                        {
                                            "UnitID": 1,
                                            "UnitName": "Cyber Security",
                                            "FirstName": "Mohamed",
                                            "MiddleName": "",
                                            "LastName": "Fazil",
                                            "EmailID": "fazil.mohamed@secureyes.net",
                                            "UserGUID": "DC2DC289-FD8E-F011-9FC1-000C29AAA2A1",
                                            "UserType": "FA"
                                        }
                                    ],
                                    [
                                        {
                                            UnitID: 5,
                                            UnitName: "Risk Management",
                                            FirstName: "GRC",
                                            MiddleName: "SE",
                                            LastName: "User One",
                                            EmailID: "sudarshan.kokku@secureyes.net",
                                            UserGUID: "CF37782C-CBC1-EF11-9453-000C29318C88",
                                            UserType: "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "GRC",
                                            "MiddleName": "SE",
                                            "LastName": "User One",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "CF37782C-CBC1-EF11-9453-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "GRC",
                                            "MiddleName": "SE",
                                            "LastName": "User One",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "CF37782C-CBC1-EF11-9453-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "GRC",
                                            "MiddleName": "SE",
                                            "LastName": "User One",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "CF37782C-CBC1-EF11-9453-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "GRC",
                                            "MiddleName": "SE",
                                            "LastName": "User One",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "CF37782C-CBC1-EF11-9453-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "GRC",
                                            "MiddleName": "SE",
                                            "LastName": "User One",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "CF37782C-CBC1-EF11-9453-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "GRC",
                                            "MiddleName": "SE",
                                            "LastName": "User One",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "CF37782C-CBC1-EF11-9453-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "GRC",
                                            "MiddleName": "SE",
                                            "LastName": "Three",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "3313187D-DAC1-EF11-9453-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "GRC",
                                            "MiddleName": "SE",
                                            "LastName": "Three",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "3313187D-DAC1-EF11-9453-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "GRC",
                                            "MiddleName": "SE",
                                            "LastName": "Three",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "3313187D-DAC1-EF11-9453-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "GRC",
                                            "MiddleName": "SE",
                                            "LastName": "Three",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "3313187D-DAC1-EF11-9453-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "GRC",
                                            "MiddleName": "SE",
                                            "LastName": "Three",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "3313187D-DAC1-EF11-9453-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "GRC",
                                            "MiddleName": "SE",
                                            "LastName": "Three",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "3313187D-DAC1-EF11-9453-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "GRC",
                                            "MiddleName": "SE",
                                            "LastName": "Three",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "3313187D-DAC1-EF11-9453-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Sangram",
                                            "MiddleName": "BCM SE",
                                            "LastName": "Bhuyan",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "DF220D15-DCC1-EF11-9453-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Sangram",
                                            "MiddleName": "BCM SE",
                                            "LastName": "Bhuyan",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "DF220D15-DCC1-EF11-9453-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Sangram",
                                            "MiddleName": "BCM SE",
                                            "LastName": "Bhuyan",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "DF220D15-DCC1-EF11-9453-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Sangram",
                                            "MiddleName": "BCM SE",
                                            "LastName": "Bhuyan",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "DF220D15-DCC1-EF11-9453-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Sangram",
                                            "MiddleName": "BCM SE",
                                            "LastName": "Bhuyan",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "DF220D15-DCC1-EF11-9453-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Sangram",
                                            "MiddleName": "BCM SE",
                                            "LastName": "Bhuyan",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "DF220D15-DCC1-EF11-9453-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Sangram",
                                            "MiddleName": "BCM SE",
                                            "LastName": "Bhuyan",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "DF220D15-DCC1-EF11-9453-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Sinchana",
                                            "MiddleName": "SE",
                                            "LastName": "UserOne",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "CC4378E8-DCC1-EF11-9453-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Sinchana",
                                            "MiddleName": "SE",
                                            "LastName": "UserOne",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "CC4378E8-DCC1-EF11-9453-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Sinchana",
                                            "MiddleName": "SE",
                                            "LastName": "UserOne",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "CC4378E8-DCC1-EF11-9453-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Sinchana",
                                            "MiddleName": "SE",
                                            "LastName": "UserOne",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "CC4378E8-DCC1-EF11-9453-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Sinchana",
                                            "MiddleName": "SE",
                                            "LastName": "UserOne",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "CC4378E8-DCC1-EF11-9453-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Sinchana",
                                            "MiddleName": "SE",
                                            "LastName": "UserOne",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "CC4378E8-DCC1-EF11-9453-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Sinchana",
                                            "MiddleName": "SE",
                                            "LastName": "UserOne",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "CC4378E8-DCC1-EF11-9453-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Niranjan",
                                            "MiddleName": "SE",
                                            "LastName": "Srichandan",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "45666691-E9C1-EF11-9453-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Niranjan",
                                            "MiddleName": "SE",
                                            "LastName": "Srichandan",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "45666691-E9C1-EF11-9453-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Niranjan",
                                            "MiddleName": "SE",
                                            "LastName": "Srichandan",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "45666691-E9C1-EF11-9453-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Niranjan",
                                            "MiddleName": "SE",
                                            "LastName": "Srichandan",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "45666691-E9C1-EF11-9453-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Niranjan",
                                            "MiddleName": "SE",
                                            "LastName": "Srichandan",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "45666691-E9C1-EF11-9453-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Niranjan",
                                            "MiddleName": "SE",
                                            "LastName": "Srichandan",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "45666691-E9C1-EF11-9453-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Niranjan",
                                            "MiddleName": "SE",
                                            "LastName": "Srichandan",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "45666691-E9C1-EF11-9453-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Bhubanananda",
                                            "MiddleName": "SE",
                                            "LastName": "Tripathy",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "0DD648A7-EBC1-EF11-9453-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Bhubanananda",
                                            "MiddleName": "SE",
                                            "LastName": "Tripathy",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "0DD648A7-EBC1-EF11-9453-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Bhubanananda",
                                            "MiddleName": "SE",
                                            "LastName": "Tripathy",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "0DD648A7-EBC1-EF11-9453-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Bhubanananda",
                                            "MiddleName": "SE",
                                            "LastName": "Tripathy",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "0DD648A7-EBC1-EF11-9453-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Bhubanananda",
                                            "MiddleName": "SE",
                                            "LastName": "Tripathy",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "0DD648A7-EBC1-EF11-9453-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Bhubanananda",
                                            "MiddleName": "SE",
                                            "LastName": "Tripathy",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "0DD648A7-EBC1-EF11-9453-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Bhubanananda",
                                            "MiddleName": "SE",
                                            "LastName": "Tripathy",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "0DD648A7-EBC1-EF11-9453-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Vandana",
                                            "MiddleName": "SE",
                                            "LastName": "GRC NIne",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "ABD9467E-74C6-EF11-945A-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Vandana",
                                            "MiddleName": "SE",
                                            "LastName": "GRC NIne",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "ABD9467E-74C6-EF11-945A-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Vandana",
                                            "MiddleName": "SE",
                                            "LastName": "GRC NIne",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "ABD9467E-74C6-EF11-945A-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Vandana",
                                            "MiddleName": "SE",
                                            "LastName": "GRC NIne",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "ABD9467E-74C6-EF11-945A-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Vandana",
                                            "MiddleName": "SE",
                                            "LastName": "GRC NIne",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "ABD9467E-74C6-EF11-945A-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Vandana",
                                            "MiddleName": "SE",
                                            "LastName": "GRC NIne",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "ABD9467E-74C6-EF11-945A-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Vandana",
                                            "MiddleName": "SE",
                                            "LastName": "GRC NIne",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "ABD9467E-74C6-EF11-945A-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Debadatta",
                                            "MiddleName": "SE",
                                            "LastName": "Jena",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "FC3BD0F9-6FCE-EF11-9466-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Debadatta",
                                            "MiddleName": "SE",
                                            "LastName": "Jena",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "FC3BD0F9-6FCE-EF11-9466-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Debadatta",
                                            "MiddleName": "SE",
                                            "LastName": "Jena",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "FC3BD0F9-6FCE-EF11-9466-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Debadatta",
                                            "MiddleName": "SE",
                                            "LastName": "Jena",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "FC3BD0F9-6FCE-EF11-9466-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Debadatta",
                                            "MiddleName": "SE",
                                            "LastName": "Jena",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "FC3BD0F9-6FCE-EF11-9466-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Debadatta",
                                            "MiddleName": "SE",
                                            "LastName": "Jena",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "FC3BD0F9-6FCE-EF11-9466-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Debadatta",
                                            "MiddleName": "SE",
                                            "LastName": "Jena",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "FC3BD0F9-6FCE-EF11-9466-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Test",
                                            "MiddleName": "SE",
                                            "LastName": "Two",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "B4A0CDE4-F4D7-EF11-9472-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Test",
                                            "MiddleName": "SE",
                                            "LastName": "Two",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "B4A0CDE4-F4D7-EF11-9472-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Test",
                                            "MiddleName": "SE",
                                            "LastName": "Two",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "B4A0CDE4-F4D7-EF11-9472-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Test",
                                            "MiddleName": "SE",
                                            "LastName": "Two",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "B4A0CDE4-F4D7-EF11-9472-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Test",
                                            "MiddleName": "SE",
                                            "LastName": "Two",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "B4A0CDE4-F4D7-EF11-9472-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Test",
                                            "MiddleName": "SE",
                                            "LastName": "Two",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "B4A0CDE4-F4D7-EF11-9472-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Test",
                                            "MiddleName": "SE",
                                            "LastName": "Two",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "B4A0CDE4-F4D7-EF11-9472-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Sinchana",
                                            "MiddleName": "SE",
                                            "LastName": "UserTwo",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "13A3F9B0-A2D8-EF11-9473-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Sinchana",
                                            "MiddleName": "SE",
                                            "LastName": "UserTwo",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "13A3F9B0-A2D8-EF11-9473-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Sinchana",
                                            "MiddleName": "SE",
                                            "LastName": "UserTwo",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "13A3F9B0-A2D8-EF11-9473-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Sinchana",
                                            "MiddleName": "SE",
                                            "LastName": "UserTwo",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "13A3F9B0-A2D8-EF11-9473-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Sinchana",
                                            "MiddleName": "SE",
                                            "LastName": "UserTwo",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "13A3F9B0-A2D8-EF11-9473-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Sinchana",
                                            "MiddleName": "SE",
                                            "LastName": "UserTwo",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "13A3F9B0-A2D8-EF11-9473-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Sinchana",
                                            "MiddleName": "SE",
                                            "LastName": "UserTwo",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "13A3F9B0-A2D8-EF11-9473-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Amrutanshu",
                                            "MiddleName": "SE",
                                            "LastName": "One",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "B1FFB063-72D9-EF11-9474-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Amrutanshu",
                                            "MiddleName": "SE",
                                            "LastName": "One",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "B1FFB063-72D9-EF11-9474-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Amrutanshu",
                                            "MiddleName": "SE",
                                            "LastName": "One",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "B1FFB063-72D9-EF11-9474-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Amrutanshu",
                                            "MiddleName": "SE",
                                            "LastName": "One",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "B1FFB063-72D9-EF11-9474-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Amrutanshu",
                                            "MiddleName": "SE",
                                            "LastName": "One",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "B1FFB063-72D9-EF11-9474-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Amrutanshu",
                                            "MiddleName": "SE",
                                            "LastName": "One",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "B1FFB063-72D9-EF11-9474-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Amrutanshu",
                                            "MiddleName": "SE",
                                            "LastName": "One",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "B1FFB063-72D9-EF11-9474-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Sangram",
                                            "MiddleName": "SE",
                                            "LastName": "K",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "DDE7A678-97DC-EF11-9478-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Sangram",
                                            "MiddleName": "SE",
                                            "LastName": "K",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "DDE7A678-97DC-EF11-9478-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Sangram",
                                            "MiddleName": "SE",
                                            "LastName": "K",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "DDE7A678-97DC-EF11-9478-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Sangram",
                                            "MiddleName": "SE",
                                            "LastName": "K",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "DDE7A678-97DC-EF11-9478-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Sangram",
                                            "MiddleName": "SE",
                                            "LastName": "K",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "DDE7A678-97DC-EF11-9478-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Sangram",
                                            "MiddleName": "SE",
                                            "LastName": "K",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "DDE7A678-97DC-EF11-9478-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Sangram",
                                            "MiddleName": "SE",
                                            "LastName": "K",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "DDE7A678-97DC-EF11-9478-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "GRC",
                                            "MiddleName": "Admin",
                                            "LastName": "Pro",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "9BC3ABFB-83C3-EF11-9456-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "GRC",
                                            "MiddleName": "Admin",
                                            "LastName": "Pro",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "9BC3ABFB-83C3-EF11-9456-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "GRC",
                                            "MiddleName": "Admin",
                                            "LastName": "Pro",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "9BC3ABFB-83C3-EF11-9456-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "GRC",
                                            "MiddleName": "Admin",
                                            "LastName": "Pro",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "9BC3ABFB-83C3-EF11-9456-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "GRC",
                                            "MiddleName": "Admin",
                                            "LastName": "Pro",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "9BC3ABFB-83C3-EF11-9456-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "GRC",
                                            "MiddleName": "Admin",
                                            "LastName": "Pro",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "9BC3ABFB-83C3-EF11-9456-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "GRC",
                                            "MiddleName": "Admin",
                                            "LastName": "Pro",
                                            "EmailID": "sudarshan.kokku@secureyes.net",
                                            "UserGUID": "9BC3ABFB-83C3-EF11-9456-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Mohamed",
                                            "MiddleName": "",
                                            "LastName": "Fazil",
                                            "EmailID": "fazil.mohamed@secureyes.net",
                                            "UserGUID": "DC2DC289-FD8E-F011-9FC1-000C29AAA2A1",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Mohamed",
                                            "MiddleName": "",
                                            "LastName": "Fazil",
                                            "EmailID": "fazil.mohamed@secureyes.net",
                                            "UserGUID": "DC2DC289-FD8E-F011-9FC1-000C29AAA2A1",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Mohamed",
                                            "MiddleName": "",
                                            "LastName": "Fazil",
                                            "EmailID": "fazil.mohamed@secureyes.net",
                                            "UserGUID": "DC2DC289-FD8E-F011-9FC1-000C29AAA2A1",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Mohamed",
                                            "MiddleName": "",
                                            "LastName": "Fazil",
                                            "EmailID": "fazil.mohamed@secureyes.net",
                                            "UserGUID": "DC2DC289-FD8E-F011-9FC1-000C29AAA2A1",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Mohamed",
                                            "MiddleName": "",
                                            "LastName": "Fazil",
                                            "EmailID": "fazil.mohamed@secureyes.net",
                                            "UserGUID": "DC2DC289-FD8E-F011-9FC1-000C29AAA2A1",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Mohamed",
                                            "MiddleName": "",
                                            "LastName": "Fazil",
                                            "EmailID": "fazil.mohamed@secureyes.net",
                                            "UserGUID": "DC2DC289-FD8E-F011-9FC1-000C29AAA2A1",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Mohamed",
                                            "MiddleName": "",
                                            "LastName": "Fazil",
                                            "EmailID": "fazil.mohamed@secureyes.net",
                                            "UserGUID": "DC2DC289-FD8E-F011-9FC1-000C29AAA2A1",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Nilesh",
                                            "MiddleName": "Middle",
                                            "LastName": "Last",
                                            "EmailID": "Nilesh.Se@Secureyes.net",
                                            "UserGUID": "F8313E01-F39D-F011-9FC1-000C29AAA2A1",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Nilesh",
                                            "MiddleName": "Middle",
                                            "LastName": "Last",
                                            "EmailID": "Nilesh.Se@Secureyes.net",
                                            "UserGUID": "F8313E01-F39D-F011-9FC1-000C29AAA2A1",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Nilesh",
                                            "MiddleName": "Middle",
                                            "LastName": "Last",
                                            "EmailID": "Nilesh.Se@Secureyes.net",
                                            "UserGUID": "F8313E01-F39D-F011-9FC1-000C29AAA2A1",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Nilesh",
                                            "MiddleName": "Middle",
                                            "LastName": "Last",
                                            "EmailID": "Nilesh.Se@Secureyes.net",
                                            "UserGUID": "F8313E01-F39D-F011-9FC1-000C29AAA2A1",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Nilesh",
                                            "MiddleName": "Middle",
                                            "LastName": "Last",
                                            "EmailID": "Nilesh.Se@Secureyes.net",
                                            "UserGUID": "F8313E01-F39D-F011-9FC1-000C29AAA2A1",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Nilesh",
                                            "MiddleName": "Middle",
                                            "LastName": "Last",
                                            "EmailID": "Nilesh.Se@Secureyes.net",
                                            "UserGUID": "F8313E01-F39D-F011-9FC1-000C29AAA2A1",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "Nilesh",
                                            "MiddleName": "Middle",
                                            "LastName": "Last",
                                            "EmailID": "Nilesh.Se@Secureyes.net",
                                            "UserGUID": "F8313E01-F39D-F011-9FC1-000C29AAA2A1",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "user",
                                            "MiddleName": "SE",
                                            "LastName": "test A",
                                            "EmailID": "sudarshan.kokku1@secureyes.net",
                                            "UserGUID": "F8BE567B-CFC1-EF11-9453-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "user",
                                            "MiddleName": "SE",
                                            "LastName": "test A",
                                            "EmailID": "sudarshan.kokku1@secureyes.net",
                                            "UserGUID": "F8BE567B-CFC1-EF11-9453-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "user",
                                            "MiddleName": "SE",
                                            "LastName": "test A",
                                            "EmailID": "sudarshan.kokku1@secureyes.net",
                                            "UserGUID": "F8BE567B-CFC1-EF11-9453-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "user",
                                            "MiddleName": "SE",
                                            "LastName": "test A",
                                            "EmailID": "sudarshan.kokku1@secureyes.net",
                                            "UserGUID": "F8BE567B-CFC1-EF11-9453-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "user",
                                            "MiddleName": "SE",
                                            "LastName": "test A",
                                            "EmailID": "sudarshan.kokku1@secureyes.net",
                                            "UserGUID": "F8BE567B-CFC1-EF11-9453-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "user",
                                            "MiddleName": "SE",
                                            "LastName": "test A",
                                            "EmailID": "sudarshan.kokku1@secureyes.net",
                                            "UserGUID": "F8BE567B-CFC1-EF11-9453-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "user",
                                            "MiddleName": "SE",
                                            "LastName": "test A",
                                            "EmailID": "sudarshan.kokku1@secureyes.net",
                                            "UserGUID": "F8BE567B-CFC1-EF11-9453-000C29318C88",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "MD",
                                            "MiddleName": "",
                                            "LastName": "Faz",
                                            "EmailID": "fazil.mohamed@secureyes.net",
                                            "UserGUID": "2217DFBE-2D92-F011-9FC1-000C29AAA2A1",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "MD",
                                            "MiddleName": "",
                                            "LastName": "Faz",
                                            "EmailID": "fazil.mohamed@secureyes.net",
                                            "UserGUID": "2217DFBE-2D92-F011-9FC1-000C29AAA2A1",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "MD",
                                            "MiddleName": "",
                                            "LastName": "Faz",
                                            "EmailID": "fazil.mohamed@secureyes.net",
                                            "UserGUID": "2217DFBE-2D92-F011-9FC1-000C29AAA2A1",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "MD",
                                            "MiddleName": "",
                                            "LastName": "Faz",
                                            "EmailID": "fazil.mohamed@secureyes.net",
                                            "UserGUID": "2217DFBE-2D92-F011-9FC1-000C29AAA2A1",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "MD",
                                            "MiddleName": "",
                                            "LastName": "Faz",
                                            "EmailID": "fazil.mohamed@secureyes.net",
                                            "UserGUID": "2217DFBE-2D92-F011-9FC1-000C29AAA2A1",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "MD",
                                            "MiddleName": "",
                                            "LastName": "Faz",
                                            "EmailID": "fazil.mohamed@secureyes.net",
                                            "UserGUID": "2217DFBE-2D92-F011-9FC1-000C29AAA2A1",
                                            "UserType": "Risk Unit User"
                                        },
                                        {
                                            "UnitID": 5,
                                            "UnitName": "Risk Management",
                                            "FirstName": "MD",
                                            "MiddleName": "",
                                            "LastName": "Faz",
                                            "EmailID": "fazil.mohamed@secureyes.net",
                                            "UserGUID": "2217DFBE-2D92-F011-9FC1-000C29AAA2A1",
                                            "UserType": "Risk Unit User"
                                        }
                                    ],
                                ]
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
