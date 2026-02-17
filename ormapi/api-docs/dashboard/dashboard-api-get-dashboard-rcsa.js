module.exports = {
    tags: ["Dashboard"],
    description:
        "Description: \n- This api is responsible for getting the RCSA data from DB and show it in dashboard. \n- In response, I gave only one RCSA data for example.",
    operationId: "getDashboardRCSA",
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
                                    RCSAData: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                ScheduleAssessmentID: { type: "integer" },
                                                RCSACode: { type: "string" },
                                                SchedulePeriod: { type: "string" },
                                                ProposedStartDate: { type: "string", format: "date-time" },
                                                ProposedCompletionDate: { type: "string", format: "date-time" },
                                                ScheduleInherentRiskID: { type: "integer" },
                                                SLNO: { type: "string" },
                                                InherentRiskID: { type: "integer" },
                                                Risk: { type: "string" },
                                                RCSAStatusID: { type: "integer" },
                                                ScheduleInherentRiskStatusName: { type: "string" },
                                                RCSAStatusName: { type: "string" },
                                                GroupName: { type: "string" },
                                                Units: { type: "string" },
                                                RiskCategoryName: { type: "string" },
                                                InherentLikelihoodName: { type: "string" },
                                                InherentImpactRatingName: { type: "string" },
                                                OverallInherentRiskScore: { type: "integer" },
                                                ControlTypeName: { type: "string" },
                                                InherentRiskRating: { type: "string" },
                                                ControlEnvironmentRating: { type: "string" },
                                                ResidualRiskRating: { type: "string" },
                                                ResidualRiskRatingColourCode: { type: "string" },
                                                OverallControlEnvironmentRatingColourCode: { type: "string" },
                                                OverallInherentRiskColorCode: { type: "string" },
                                                SelfComment: { type: "string" },
                                                ControlDescription: { type: "string" },
                                                Quater: { type: "string" }
                                            },
                                            example: {
                                                ScheduleAssessmentID: 1,
                                                RCSACode: "RCSA-001",
                                                SchedulePeriod: "Quarter 4, 2024",
                                                ProposedStartDate: "2024-12-15T00:00:00.000Z",
                                                ProposedCompletionDate: "2024-12-30T00:00:00.000Z",
                                                ScheduleInherentRiskID: 2,
                                                SLNO: "CS-001",
                                                InherentRiskID: 1,
                                                Risk: "Inherent Risk for Cyber Security Department 1",
                                                RCSAStatusID: 3,
                                                ScheduleInherentRiskStatusName: "Approved",
                                                RCSAStatusName: "Completed",
                                                GroupName: "Credit & Risk",
                                                Units: "Cyber Security",
                                                RiskCategoryName: "Strategic",
                                                InherentLikelihoodName: "Possible",
                                                InherentImpactRatingName: "Minor",
                                                OverallInherentRiskScore: 4,
                                                ControlTypeName: "Process",
                                                InherentRiskRating: "Low Risk",
                                                ControlEnvironmentRating: "Ineffective",
                                                ResidualRiskRating: "Low",
                                                ResidualRiskRatingColourCode: "#0fb116",
                                                OverallControlEnvironmentRatingColourCode: "#ea4515",
                                                OverallInherentRiskColorCode: "#18e435",
                                                SelfComment: "Save/Submit RCSA-001\tInherent Risk for Cyber Security Department 1\tCredit & Risk\tCyber Security",
                                                ControlDescription: "RCSA-001\tInherent Risk for Cyber Security Department 1\tCredit & Risk\tCyber Security",
                                                Quater: "Q4-24"
                                            }
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
