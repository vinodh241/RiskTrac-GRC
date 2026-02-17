module.exports = {
    tags: ["Dashboard"],
    description:
        "Description: \n- This api is responsible for getting the incident data from DB and show it in dashboard. \n- In response, I gave only one incident data for example.",
    operationId: "getDashboardIncident",
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
                            "result": {
                                "type": "array",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "IncidentID": { "type": "string" },
                                        "IncidentCode": { "type": "string" },
                                        "UnitID": { "type": "integer" },
                                        "ReporterGUID": { "type": "string" },
                                        "LocationTypeID": { "type": "integer" },
                                        "IncidentTeam": { "type": "string" },
                                        "IncidentDate": { "type": "string", "format": "date-time" },
                                        "Description": { "type": "string" },
                                        "Action": { "type": "string" },
                                        "IncidentSourceID": { "type": "integer" },
                                        "CreatedDate": { "type": "string", "format": "date-time" },
                                        "LossAmount": { "type": "integer" },
                                        "Currency": { "type": "string" },
                                        "ReportingDate": { "type": "string", "format": "date-time" },
                                        "AggPartyDetails": { "type": "string" },
                                        "CriticalityID": { "type": "integer" },
                                        "StatusID": { "type": "integer" },
                                        "Recommendation": { "type": "string" },
                                        "ReviewerGUID": { "type": "string" },
                                        "ApproverGUID": { "type": "string" },
                                        "IncidentTitle": { "type": "string" },
                                        "IncidentType": { "type": "string" },
                                        "IncidentUnitID": { "type": "integer" },
                                        "IncidentUnitName": { "type": "string" },
                                        "GroupID": { "type": "integer" },
                                        "GroupName": { "type": "string" },
                                        "CriticalityName": { "type": "string" },
                                        "IncidentSource": { "type": "string" },
                                        "StatusName": { "type": "string" },
                                        "TargetDate": { "type": "string", "format": "date-time" },
                                        "RecommendationTargetDate": { "type": "string", "format": "date-time" },
                                        "RecommendationStatusIDs": { "type": "string" },
                                        "NoOfRecommendations": { "type": "integer" },
                                        "NoOfClosed": { "type": "integer" },
                                        "NoOfClaimClosed": { "type": "integer" },
                                        "NoOfOpen": { "type": "integer" },
                                        "NoOfRejectedRecommendations": { "type": "integer" },
                                        "OverDueRecommendationCount": { "type": "integer" },
                                        "IncidentYear": { "type": "integer" },
                                        "Quater": { "type": "string" },
                                        "OverDueDays": { "type": "integer" },
                                        "RecomendationData": {
                                            "type": "array",
                                            "items": {
                                                "type": "object",
                                                "properties": {
                                                    "RecommendationID": { "type": "integer" },
                                                    "RecomStatusID": { "type": "integer" },
                                                    "RecommendationStatus": { "type": "string" },
                                                    "RecommendationAction": { "type": "string" },
                                                    "RecommendationCode": { "type": "string" },
                                                    "Description": { "type": "string" },
                                                    "RecomendedUnit": { "type": "integer" },
                                                    "RecomendedUnitName": { "type": "string" }
                                                }
                                            }
                                        }
                                    },
                                    "example": {
                                        "IncidentID": "18",
                                        "IncidentCode": "INC-25-014",
                                        "UnitID": 1,
                                        "ReporterGUID": "3313187D-DAC1-EF11-9453-000C29318C88",
                                        "LocationTypeID": 1,
                                        "IncidentTeam": "team",
                                        "IncidentDate": "2025-09-22T00:00:00.000Z",
                                        "Description": "inc-22092025-1 description",
                                        "Action": "inc-22092025-1 AT",
                                        "IncidentSourceID": 1,
                                        "CreatedDate": "2025-09-22T10:27:28.783Z",
                                        "LossAmount": 130,
                                        "Currency": "INR",
                                        "ReportingDate": "2025-09-22T00:00:00.000Z",
                                        "AggPartyDetails": "team sc",
                                        "CriticalityID": 1,
                                        "StatusID": 9,
                                        "Recommendation": "inc-22092025-1 RAU",
                                        "ReviewerGUID": "9BC3ABFB-83C3-EF11-9456-000C29318C88",
                                        "ApproverGUID": "B4A0CDE4-F4D7-EF11-9472-000C29318C88",
                                        "IncidentTitle": "inc-22092025-1",
                                        "IncidentType": "Operational Risk Fraud: Internal or External",
                                        "IncidentUnitID": 1,
                                        "IncidentUnitName": "Cyber Security",
                                        "GroupID": 1,
                                        "GroupName": "Credit & Risk",
                                        "CriticalityName": "High",
                                        "IncidentSource": "Internal Department finding",
                                        "StatusName": "Remediation",
                                        "TargetDate": "2025-09-22T00:00:00.000Z",
                                        "RecommendationTargetDate": "2025-09-22T00:00:00.000Z",
                                        "RecommendationStatusIDs": "2",
                                        "NoOfRecommendations": 1,
                                        "NoOfClosed": 0,
                                        "NoOfClaimClosed": 1,
                                        "NoOfOpen": 0,
                                        "NoOfRejectedRecommendations": 0,
                                        "OverDueRecommendationCount": 1,
                                        "IncidentYear": 2025,
                                        "Quater": "Q3-25",
                                        "OverDueDays": 22,
                                        "RecomendationData": [
                                            {
                                                "RecommendationID": 19,
                                                "RecomStatusID": 2,
                                                "RecommendationStatus": "Claimed Closed",
                                                "RecommendationAction": "action plan 1 for recom 1",
                                                "RecommendationCode": "INC-25-014-R1",
                                                "Description": "recomandations 1",
                                                "RecomendedUnit": 1,
                                                "RecomendedUnitName": "Cyber Security"
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
