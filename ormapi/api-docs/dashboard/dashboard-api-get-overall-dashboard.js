module.exports = {
    tags: ["Dashboard"],
    description:
        "Description: \n- This api is responsible for getting the overall data from DB and show it in dashboard. \n- It will give all the module data such as KRI Module, RCSA Module, Incident Module, Risk Appetite Module. \n- In response, I gave only one data(Records) form each module for example. But it will return all the data(Records) from all the module",
    operationId: "getOverallDashboard",
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
                                Year: {
                                    type: "integer",
                                    example: 2025
                                }
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
                                    },
                                    "INCIDENT_DATA": {
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
                                    RA_DATA: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                CollectionScheduleID: { type: "string" },
                                                CollectionID: { type: ["string", "null"] },
                                                UnitID: { type: "integer" },
                                                UnitName: { type: "string" },
                                                GroupID: { type: "integer" },
                                                GroupName: { type: "string" },
                                                NodeID: { type: "string" },
                                                ParentNodeID: { type: "string" },
                                                CaptionData: { type: "string" },
                                                Risks: { type: "string" },
                                                MetricScore: { type: ["integer", "null"] },
                                                RiskMetricLevelID: { type: ["integer", "null"] },
                                                RiskMetricLevel: { type: ["integer", "null"] },
                                                LevelName: { type: ["string", "null"] },
                                                FWID: { type: ["integer", "null"] },
                                                FrameworkName: { type: "string" },
                                                Abbreviation: { type: "string" },
                                                StatusID: { type: ["integer", "null"] },
                                                CollectionStatusName: { type: "string" },
                                                ColorCode: { type: ["string", "null"] },
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
                                                Remarks: { type: ["string", "null"] },
                                                ActionPlan: { type: ["string", "null"] },
                                                IsReviewed: { type: ["boolean", "null"] }
                                            },
                                            example: {
                                                CollectionScheduleID: "3",
                                                CollectionID: null,
                                                UnitID: 1,
                                                UnitName: "Cyber Security",
                                                GroupID: 1,
                                                GroupName: "Credit & Risk",
                                                NodeID: "6",
                                                ParentNodeID: "5",
                                                CaptionData: "Enterprise Wide Risk Appetite",
                                                Risks: "Total NPL % (non-performing Loans as a % of total Exposure)",
                                                MetricScore: null,
                                                RiskMetricLevelID: null,
                                                RiskMetricLevel: null,
                                                LevelName: null,
                                                FWID: null,
                                                FrameworkName: "RA Sanity Latest",
                                                Abbreviation: "RAF",
                                                StatusID: null,
                                                CollectionStatusName: "Not Started",
                                                ColorCode: null,
                                                MeasurmentTypeID: 2,
                                                MeasurmentType: "Percentage",
                                                Limit1: "< 4.5",
                                                Limit2: ">= 4.5 and <= 6",
                                                Limit3: "> 6",
                                                StartDate: "2025-01-01T00:00:00.000Z",
                                                EndDate: "2025-01-29T00:00:00.000Z",
                                                QuaterID: "41",
                                                Year: 2025,
                                                Quater: "Q1-25",
                                                Remarks: null,
                                                ActionPlan: null,
                                                IsReviewed: null
                                            }
                                        }
                                    },
                                    RA_COLOR_DATA: {
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
                                            }
                                        },
                                        example: [
                                            {
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
                                            },
                                            {
                                                RiskMetricLevelID: 119,
                                                FWID: 37,
                                                RiskMetricLevel: 2,
                                                ColorCode: "#fcec00",
                                                Name: "Moderate Risk Level",
                                                Description: "Moderate Risk Level",
                                                IsUsedForReWeightage: true,
                                                IsActive: true,
                                                IsDeleted: false,
                                                CreatedDate: "2025-09-18T16:14:10.763Z",
                                                CreatedBy: "GRCUser003-UploadRAFrameworkFromExcel",
                                                LastUpdatedDate: "2025-09-18T16:14:10.763Z",
                                                LastUpdatedBy: "GRCUser003-UploadRAFrameworkFromExcel",
                                                DefaultColorCode: "#FFFF00",
                                                RiskMetricZone: "Yellow Zone"
                                            },
                                            {
                                                RiskMetricLevelID: 120,
                                                FWID: 37,
                                                RiskMetricLevel: 3,
                                                ColorCode: "#ff0000",
                                                Name: "Critical Risk Level",
                                                Description: "Critical Risk Level",
                                                IsUsedForReWeightage: true,
                                                IsActive: true,
                                                IsDeleted: false,
                                                CreatedDate: "2025-09-18T16:14:10.763Z",
                                                CreatedBy: "GRCUser003-UploadRAFrameworkFromExcel",
                                                LastUpdatedDate: "2025-09-18T16:14:10.763Z",
                                                LastUpdatedBy: "GRCUser003-UploadRAFrameworkFromExcel",
                                                DefaultColorCode: "#FF0000",
                                                RiskMetricZone: "Red Zone"
                                            }
                                        ]
                                    },
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
                                    },
                                    RAInApp: {
                                        type: "array",
                                        items: { type: "object" },
                                        example: []
                                    },
                                    RCSAInApp: {
                                        type: "array",
                                        items: { type: "object" },
                                        example: []
                                    },
                                    INCInApp: {
                                        type: "array",
                                        items: { type: "object" },
                                        example: []
                                    },
                                    KRIInApp: {
                                        type: "array",
                                        items: { type: "object" },
                                        example: []
                                    },
                                    CurrencyType: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                AccountName: { type: "string" },
                                                Currency: { type: "string" }
                                            }
                                        },
                                        example: [
                                            {
                                                AccountName: "SecurEyes",
                                                Currency: "INR"
                                            }
                                        ],
                                    },
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
