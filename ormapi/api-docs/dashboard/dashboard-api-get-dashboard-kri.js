module.exports = {
    tags: ["Dashboard"],
    description:
        "Description: \n- This api is responsible for getting the KRI's data from DB and show it in dashboard. \n- In response, I gave only one kri data for example.",
    operationId: "getDashboardKRI",
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
                                    KRIData: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                MetricID: { type: "string" },
                                                Unit: { type: "string" },
                                                UnitID: { type: "integer" },
                                                KRICode: { type: "string" },
                                                Indicator: { type: "string" },
                                                KRI_Defined_Quater: { type: "string" },
                                                KRICreatedDate: { type: "string", format: "date-time" },
                                                MeasurementFrequency: { type: "string" },
                                                KRI_Type: { type: "string" },
                                                Period: { type: "string" },
                                                IsReported: { type: "string" },
                                                Date: { type: "string", format: "date-time" },
                                                MeasurementID: { type: "string" },
                                                MeasurementValue: { type: "integer" },
                                                ThresholdID: { type: "integer" },
                                                ReportStatusID: { type: "integer" },
                                                ReportStatusName: { type: "string" },
                                                KRI_Status: { type: "string" },
                                                KRI_Value: { type: "integer" },
                                                ColorCode: { type: "string" },
                                                KRI_Target: { type: "string" },
                                                Remark: { type: "string" },
                                                Quater: { type: "string" },
                                                ThresholdValue1: { type: "integer" },
                                                ThresholdValue2: { type: "integer" },
                                                ThresholdValue3: { type: "integer" },
                                                ThresholdValue4: { type: "integer" },
                                                ThresholdValue5: { type: "integer" },
                                                FrequencyID: { type: "integer" },
                                                Frequency: { type: "string" },
                                                PreviousQuarterData: {
                                                    type: "array",
                                                    items: {
                                                        type: "object",
                                                        properties: {
                                                            MeasurementID: { type: "integer" },
                                                            MetricID: { type: "integer" },
                                                            UnitID: { type: "integer" },
                                                            KRICode: { type: "string" },
                                                            Indicator: { type: "string" },
                                                            Unit: { type: "string" },
                                                            Period: { type: "string" },
                                                            Date: { type: "string", format: "date-time" },
                                                            Remark: { type: "string" },
                                                            IsReported: { type: "string" },
                                                            Measurement: { type: "integer" },
                                                            MeasurementFrequencyID: { type: "integer" },
                                                            ThresholdID: { type: "integer" },
                                                            ColorCode: { type: "string" },
                                                            ThresholdValue: { type: "integer" },
                                                            KRI_Value: { type: "integer" },
                                                            LastUpdatedDate: { type: "string", format: "date-time" },
                                                            KRI_Type: { type: "string" },
                                                            KRI_Target: { type: "string" },
                                                            KRI_Defined_Quater: { type: "string" },
                                                            Quater: { type: "string" },
                                                            ThresholdValue1: { type: "integer" },
                                                            ThresholdValue2: { type: "integer" },
                                                            ThresholdValue3: { type: "integer" },
                                                            ThresholdValue4: { type: "integer" },
                                                            ThresholdValue5: { type: "integer" },
                                                            MeasurementFrequency: { type: "string" },
                                                            ReportStatusID: { type: "integer" },
                                                            ReportStatusName: { type: "string" },
                                                            KRI_Status: { type: "string" }
                                                        }
                                                    }
                                                }
                                            },
                                            example: {
                                                MetricID: "139",
                                                Unit: "Cyber Security",
                                                UnitID: 1,
                                                KRICode: "KRI-CS-028",
                                                Indicator: "Testing after node version upgrade",
                                                KRI_Defined_Quater: "Q4-25",
                                                KRICreatedDate: "2025-10-14T10:59:20.513Z",
                                                MeasurementFrequency: "Monthly",
                                                KRI_Type: "Processsss NEWW ",
                                                Period: "Oct 2025",
                                                IsReported: "T",
                                                Date: "2025-10-14T11:00:27.243Z",
                                                MeasurementID: "322",
                                                MeasurementValue: 70,
                                                ThresholdID: 3,
                                                ReportStatusID: 3,
                                                ReportStatusName: "Approved",
                                                KRI_Status: "Approved",
                                                KRI_Value: 3,
                                                ColorCode: "#FFA500",
                                                KRI_Target: "100%",
                                                Remark: "KRI-CS-028",
                                                Quater: "Q4-25",
                                                ThresholdValue1: 0,
                                                ThresholdValue2: 40,
                                                ThresholdValue3: 60,
                                                ThresholdValue4: 80,
                                                ThresholdValue5: 100,
                                                FrequencyID: 1,
                                                Frequency: "Monthly",
                                                PreviousQuarterData: [
                                                    {
                                                        MeasurementID: 322,
                                                        MetricID: 139,
                                                        UnitID: 1,
                                                        KRICode: "KRI-CS-028",
                                                        Indicator: "Testing after node version upgrade",
                                                        Unit: "Cyber Security",
                                                        Period: "Oct 2025",
                                                        Date: "2025-10-14T11:00:27.243Z",
                                                        Remark: "KRI-CS-028",
                                                        IsReported: "True",
                                                        Measurement: 70,
                                                        MeasurementFrequencyID: 1,
                                                        ThresholdID: 3,
                                                        ColorCode: "#FFA500",
                                                        ThresholdValue: 3,
                                                        KRI_Value: 3,
                                                        LastUpdatedDate: "2025-10-14T11:04:08.383Z",
                                                        KRI_Type: "Processsss NEWW ",
                                                        KRI_Target: "100%",
                                                        KRI_Defined_Quater: "Q4-25",
                                                        Quater: "Q4-25",
                                                        ThresholdValue1: 0,
                                                        ThresholdValue2: 40,
                                                        ThresholdValue3: 60,
                                                        ThresholdValue4: 80,
                                                        ThresholdValue5: 100,
                                                        MeasurementFrequency: "Monthly",
                                                        ReportStatusID: 3,
                                                        ReportStatusName: "Approved",
                                                        KRI_Status: "Approved"
                                                    }
                                                ]
                                            }
                                        }
                                    },
                                    KRIColorData: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                KRI_Value: { type: "integer" },
                                                ColorCode: { type: "string" }
                                            }
                                        },
                                        example: [
                                            { KRI_Value: 1, ColorCode: "#dd00ff" },
                                            { KRI_Value: 2, ColorCode: "#FFBF00" },
                                            { KRI_Value: 3, ColorCode: "#FFA500" },
                                            { KRI_Value: 4, ColorCode: "#FFFF00" },
                                            { KRI_Value: 5, ColorCode: "#008000" }
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
