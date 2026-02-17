module.exports = {
    tags: ["Dashboard"],
    description:
        "Description: \n- This api is responsible for getting the risk appetite data from DB and show it in dashboard. \n- In response, I gave only one risk appetite data for example.",
    operationId: "getDashboardRiskAppetite",
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
                                    Formatted_DATA: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                CollectionScheduleID: { type: "string" },
                                                CollectionID: { type: "string" },
                                                UnitID: { type: "integer" },
                                                UnitName: { type: "string" },
                                                GroupID: { type: "integer" },
                                                GroupName: { type: "string" },
                                                NodeID: { type: "string" },
                                                ParentNodeID: { type: "string" },
                                                CaptionData: { type: "string" },
                                                Risks: { type: "string" },
                                                MetricScore: { type: "integer" },
                                                RiskMetricLevelID: { type: "integer" },
                                                RiskMetricLevel: { type: "integer" },
                                                LevelName: { type: "string" },
                                                FWID: { type: "integer" },
                                                FrameworkName: { type: "string" },
                                                Abbreviation: { type: "string" },
                                                StatusID: { type: "integer" },
                                                CollectionStatusName: { type: "string" },
                                                ColorCode: { type: "string" },
                                                MeasurmentTypeID: { type: "integer" },
                                                MeasurmentType: { type: "string" },
                                                Limit1: { type: "string" },
                                                Limit2: { type: "string" },
                                                Limit3: { type: "string" },
                                                StartDate: { type: "string", format: "date-time" },
                                                EndDate: { type: "string", format: "date-time" },
                                                QuaterID: { type: "string" },
                                                Year: { type: "integer" },
                                                Quater: { type: "string" },
                                                Remarks: { type: "string" },
                                                ActionPlan: { type: "string" },
                                                IsReviewed: { type: "boolean" }
                                            },
                                            example: {
                                                CollectionScheduleID: "1",
                                                CollectionID: "1",
                                                UnitID: 1,
                                                UnitName: "Cyber Security",
                                                GroupID: 1,
                                                GroupName: "Credit & Risk",
                                                NodeID: "6",
                                                ParentNodeID: "5",
                                                CaptionData: "Enterprise Wide Risk Appetite",
                                                Risks: "Total NPL % (non-performing Loans as a % of total Exposure)",
                                                MetricScore: 5,
                                                RiskMetricLevelID: 23,
                                                RiskMetricLevel: 2,
                                                LevelName: "Moderate Risk Level",
                                                FWID: 5,
                                                FrameworkName: "RA Sanity Latest",
                                                Abbreviation: "RAF",
                                                StatusID: 5,
                                                CollectionStatusName: "Approved",
                                                ColorCode: "#fcec00",
                                                MeasurmentTypeID: 2,
                                                MeasurmentType: "Percentage",
                                                Limit1: "< 4.5",
                                                Limit2: ">= 4.5 and <= 6",
                                                Limit3: "> 6",
                                                StartDate: "2024-12-12T00:00:00.000Z",
                                                EndDate: "2024-12-31T00:00:00.000Z",
                                                QuaterID: "40",
                                                Year: 2024,
                                                Quater: "Q4-24",
                                                Remarks: "Remarks 1",
                                                ActionPlan: "Action Plan 1",
                                                IsReviewed: true
                                            }
                                        }
                                    },
                                    RISK_COLOR_DATA: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                RiskMetricLevelID: { type: "integer" },
                                                FWID: { type: "integer" },
                                                RiskMetricLevel: { type: "integer" },
                                                ColorCode: { type: "string" },
                                                Name: { type: "string" },
                                                Description: { type: "string" },
                                                IsUsedForReWeightage: { type: "boolean" },
                                                IsActive: { type: "boolean" },
                                                IsDeleted: { type: "boolean" },
                                                CreatedDate: { type: "string", format: "date-time" },
                                                CreatedBy: { type: "string" },
                                                LastUpdatedDate: { type: "string", format: "date-time" },
                                                LastUpdatedBy: { type: "string" },
                                                DefaultColorCode: { type: "string" },
                                                RiskMetricZone: { type: "string" }
                                            },
                                            example: {
                                                RiskMetricLevelID: 118,
                                                FWID: 37,
                                                RiskMetricLevel: 1,
                                                ColorCode: "#61ff89",
                                                Name: "Low Risk Level",
                                                Description: "Low Risk Level",
                                                IsUsedForReWeightage: true,
                                                IsActive: true,
                                                IsDeleted: false,
                                                CreatedDate: "2025-09-18T16:14:10.763Z",
                                                CreatedBy: "GRCUser003-UploadRAFrameworkFromExcel",
                                                LastUpdatedDate: "2025-09-18T16:14:10.763Z",
                                                LastUpdatedBy: "GRCUser003-UploadRAFrameworkFromExcel",
                                                DefaultColorCode: "#008000",
                                                RiskMetricZone: "Green Zone"
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
