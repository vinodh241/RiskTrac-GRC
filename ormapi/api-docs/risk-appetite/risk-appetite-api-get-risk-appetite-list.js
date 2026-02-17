const { format } = require("path");

module.exports = {
    tags: ["Risk Appetite"],
    description:
        "Description: \n- This api is responsible for getting the Risk Appetite List from DB.",
    operationId: "getRiskAppetiteList",
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
                                    documents: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                FWID: { type: "string" },
                                                FrameworkName: { type: "string" },
                                                Version: { type: "string" },
                                                PolicyFileID: { type: "string" },
                                                PolicyFileName: { type: "string" },
                                                FrameworkFileId: { type: "string" },
                                                FrameworkFileName: { type: "string" },
                                                UploadDate: { type: "string", format: "date-time" },
                                            },
                                            example: [
                                                {
                                                    "FWID": "37",
                                                    "FrameworkName": "RA Appetitte Framework 18092025-1",
                                                    "Version": "1.0",
                                                    "PolicyFileID": "34",
                                                    "PolicyFileName": "Risk_Appetite_Framework_3rd March (1).pdf",
                                                    "FrameworkFileId": "34",
                                                    "FrameworkFileName": "Risk Appetite Framework_TaxPayers.xlsx (4).xlsx",
                                                    "UploadDate": "2025-09-18T16:14:10.640Z"
                                                },
                                                {
                                                    "FWID": "36",
                                                    "FrameworkName": "RA Appetitte Framework 18092025",
                                                    "Version": "1.0",
                                                    "PolicyFileID": "33",
                                                    "PolicyFileName": "Risk_Appetite_Framework_3rd March (1).pdf",
                                                    "FrameworkFileId": "33",
                                                    "FrameworkFileName": "Risk Appetite Framework_TaxPayers.xlsx (4).xlsx",
                                                    "UploadDate": "2025-09-18T16:11:06.327Z"
                                                },
                                                {
                                                    "FWID": "35",
                                                    "FrameworkName": "RA Appetite 18th Sep",
                                                    "Version": "1.0",
                                                    "PolicyFileID": "32",
                                                    "PolicyFileName": "Risk_Appetite_Framework_3rd March (1).pdf",
                                                    "FrameworkFileId": "32",
                                                    "FrameworkFileName": "Risk Appetite Framework_TaxPayers.xlsx (4).xlsx",
                                                    "UploadDate": "2025-09-18T14:57:28.697Z"
                                                },
                                                {
                                                    "FWID": "34",
                                                    "FrameworkName": "Risk Appetite for Tax Payer",
                                                    "Version": "1.0",
                                                    "PolicyFileID": "31",
                                                    "PolicyFileName": "Risk_Appetite_Framework_3rd March (1).pdf",
                                                    "FrameworkFileId": "31",
                                                    "FrameworkFileName": "Risk Appetite Framework_TaxPayers.xlsx (4).xlsx",
                                                    "UploadDate": "2025-04-24T15:05:02.450Z"
                                                },
                                                {
                                                    "FWID": "33",
                                                    "FrameworkName": "RA Framework 5th March",
                                                    "Version": "1.0",
                                                    "PolicyFileID": "30",
                                                    "PolicyFileName": "Risk_Appetite_Framework_3rd March (1).pdf",
                                                    "FrameworkFileId": "30",
                                                    "FrameworkFileName": "Risk_Appetite_Framework_3rd March (1).xlsx",
                                                    "UploadDate": "2025-03-05T11:38:02.340Z"
                                                },
                                                {
                                                    "FWID": "32",
                                                    "FrameworkName": "RA Framework 3rd March",
                                                    "Version": "1.3",
                                                    "PolicyFileID": "29",
                                                    "PolicyFileName": "Risk_Appetite_Framework_3rd March.pdf",
                                                    "FrameworkFileId": "29",
                                                    "FrameworkFileName": "Risk_Appetite_Framework_3rd March.xlsx",
                                                    "UploadDate": "2025-03-03T13:28:35.020Z"
                                                },
                                                {
                                                    "FWID": "31",
                                                    "FrameworkName": "RA Framework 3rd March",
                                                    "Version": "1.2",
                                                    "PolicyFileID": "28",
                                                    "PolicyFileName": "Risk_Appetite_Framework_3rd March.pdf",
                                                    "FrameworkFileId": "28",
                                                    "FrameworkFileName": "Risk_Appetite_Framework_3rd March.xlsx",
                                                    "UploadDate": "2025-03-03T13:28:04.913Z"
                                                },
                                                {
                                                    "FWID": "30",
                                                    "FrameworkName": "RA Framework 3rd March",
                                                    "Version": "1.1",
                                                    "PolicyFileID": "27",
                                                    "PolicyFileName": "Risk_Appetite_Framework_3rd March.pdf",
                                                    "FrameworkFileId": "27",
                                                    "FrameworkFileName": "Risk_Appetite_Framework_3rd March.xlsx",
                                                    "UploadDate": "2025-03-03T13:27:48.143Z"
                                                },
                                                {
                                                    "FWID": "29",
                                                    "FrameworkName": "RA Framework 3rd March",
                                                    "Version": "1.0",
                                                    "PolicyFileID": "26",
                                                    "PolicyFileName": "Risk_Appetite_Framework_3rd March.pdf",
                                                    "FrameworkFileId": "26",
                                                    "FrameworkFileName": "Risk_Appetite_Framework_3rd March.xlsx",
                                                    "UploadDate": "2025-03-03T13:27:28.090Z"
                                                },
                                                {
                                                    "FWID": "28",
                                                    "FrameworkName": "RA Framework 2",
                                                    "Version": "1.0",
                                                    "PolicyFileID": "25",
                                                    "PolicyFileName": "Risk Appetite Policy Test_24th Feb.pdf",
                                                    "FrameworkFileId": "25",
                                                    "FrameworkFileName": "Risk_Appetite_Framework_24th Feb.xlsx",
                                                    "UploadDate": "2025-02-26T16:18:17.597Z"
                                                },
                                                {
                                                    "FWID": "27",
                                                    "FrameworkName": "RA Assessment for Feb 26th",
                                                    "Version": "1.0",
                                                    "PolicyFileID": "24",
                                                    "PolicyFileName": "Risk Appetite Policy Test_24th Feb.pdf",
                                                    "FrameworkFileId": "24",
                                                    "FrameworkFileName": "Risk_Appetite_Framework_24th Feb.xlsx",
                                                    "UploadDate": "2025-02-26T12:25:22.197Z"
                                                },
                                                {
                                                    "FWID": "26",
                                                    "FrameworkName": " RA Framework 24th Feb",
                                                    "Version": "1.0",
                                                    "PolicyFileID": "23",
                                                    "PolicyFileName": "Risk Appetite Policy Test_24th Feb.pdf",
                                                    "FrameworkFileId": "23",
                                                    "FrameworkFileName": "Risk_Appetite_Framework_24th Feb.xlsx",
                                                    "UploadDate": "2025-02-24T16:19:22.387Z"
                                                },
                                                {
                                                    "FWID": "25",
                                                    "FrameworkName": "RA Framework 24th Feb",
                                                    "Version": "1.0",
                                                    "PolicyFileID": "22",
                                                    "PolicyFileName": "Risk Appetite Policy Test_24th Feb.pdf",
                                                    "FrameworkFileId": "22",
                                                    "FrameworkFileName": "Risk_Appetite_Framework_24th Feb.xlsx",
                                                    "UploadDate": "2025-02-24T16:18:50.243Z"
                                                },
                                                {
                                                    "FWID": "24",
                                                    "FrameworkName": "RA Framework 19th Feb 2",
                                                    "Version": "1.0",
                                                    "PolicyFileID": "21",
                                                    "PolicyFileName": "Risk Appetite Policy Test 19th Feb - 2.pdf",
                                                    "FrameworkFileId": "21",
                                                    "FrameworkFileName": "Risk_Appetite_Framework 19th Feb - 2.xlsx",
                                                    "UploadDate": "2025-02-19T13:13:41.010Z"
                                                },
                                                {
                                                    "FWID": "23",
                                                    "FrameworkName": "RA Framework 18th Feb",
                                                    "Version": "1.0",
                                                    "PolicyFileID": "20",
                                                    "PolicyFileName": "Risk Appetite Policy Test (1).pdf",
                                                    "FrameworkFileId": "20",
                                                    "FrameworkFileName": "Risk_Appetite_Framework Updated 18th Feb.xlsx",
                                                    "UploadDate": "2025-02-18T16:30:02.033Z"
                                                },
                                                {
                                                    "FWID": "22",
                                                    "FrameworkName": "Risk_Appetite_Framework Updated 18th Feb",
                                                    "Version": "1.0",
                                                    "PolicyFileID": "19",
                                                    "PolicyFileName": "Risk Appetite Policy Test (1).pdf",
                                                    "FrameworkFileId": "19",
                                                    "FrameworkFileName": "Risk_Appetite_Framework Updated 18th Feb.xlsx",
                                                    "UploadDate": "2025-02-18T13:07:51.843Z"
                                                },
                                                {
                                                    "FWID": "21",
                                                    "FrameworkName": " Risk_Appetite_Framework",
                                                    "Version": "1.1",
                                                    "PolicyFileID": "18",
                                                    "PolicyFileName": "Risk Appetite Policy Test.pdf",
                                                    "FrameworkFileId": "18",
                                                    "FrameworkFileName": "Risk_Appetite_Framework.xlsx",
                                                    "UploadDate": "2025-02-17T17:39:16.607Z"
                                                },
                                                {
                                                    "FWID": "20",
                                                    "FrameworkName": " Risk_Appetite_Framework",
                                                    "Version": "1.0",
                                                    "PolicyFileID": "17",
                                                    "PolicyFileName": "Risk Appetite Policy Test.pdf",
                                                    "FrameworkFileId": "17",
                                                    "FrameworkFileName": "Risk_Appetite_Framework.xlsx",
                                                    "UploadDate": "2025-02-14T13:29:47.047Z"
                                                },
                                                {
                                                    "FWID": "19",
                                                    "FrameworkName": "Risk_Appetite_Framework",
                                                    "Version": "1.3",
                                                    "PolicyFileID": "16",
                                                    "PolicyFileName": "Risk Appetite Policy Test.pdf",
                                                    "FrameworkFileId": "16",
                                                    "FrameworkFileName": "Risk_Appetite_Framework.xlsx",
                                                    "UploadDate": "2025-02-14T13:29:22.950Z"
                                                },
                                                {
                                                    "FWID": "18",
                                                    "FrameworkName": "Risk_Appetite_Framework",
                                                    "Version": "1.2",
                                                    "PolicyFileID": "15",
                                                    "PolicyFileName": "Risk Appetite Policy Test.pdf",
                                                    "FrameworkFileId": "15",
                                                    "FrameworkFileName": "Risk_Appetite_Framework.xlsx",
                                                    "UploadDate": "2025-02-14T13:29:05.250Z"
                                                },
                                                {
                                                    "FWID": "17",
                                                    "FrameworkName": "Risk_Appetite_Framework",
                                                    "Version": "1.1",
                                                    "PolicyFileID": "14",
                                                    "PolicyFileName": "Risk Appetite Policy Test.pdf",
                                                    "FrameworkFileId": "14",
                                                    "FrameworkFileName": "Risk_Appetite_Framework.xlsx",
                                                    "UploadDate": "2025-02-14T13:27:20.493Z"
                                                },
                                                {
                                                    "FWID": "16",
                                                    "FrameworkName": "Risk_Appetite_Framework",
                                                    "Version": "1.0",
                                                    "PolicyFileID": "13",
                                                    "PolicyFileName": "Risk Appetite Policy Test.pdf",
                                                    "FrameworkFileId": "13",
                                                    "FrameworkFileName": "Risk_Appetite_Framework.xlsx",
                                                    "UploadDate": "2025-02-13T16:02:05.450Z"
                                                },
                                                {
                                                    "FWID": "15",
                                                    "FrameworkName": "Re Upload RA Framework",
                                                    "Version": "1.0",
                                                    "PolicyFileID": "12",
                                                    "PolicyFileName": "Risk Appetite Policy (4).pdf.pdf",
                                                    "FrameworkFileId": "12",
                                                    "FrameworkFileName": "Risk Appetite Framework_4 Demo _ Unit.xlsx.xlsx",
                                                    "UploadDate": "2025-02-10T17:48:30.793Z"
                                                },
                                                {
                                                    "FWID": "14",
                                                    "FrameworkName": "test 1001",
                                                    "Version": "1.1",
                                                    "PolicyFileID": "11",
                                                    "PolicyFileName": "Risk Appetite Policy (4).pdf",
                                                    "FrameworkFileId": "11",
                                                    "FrameworkFileName": "Risk Appetite Framework_4 Demo _ Unit- Updated (1) (1).xlsx",
                                                    "UploadDate": "2025-02-10T17:25:45.223Z"
                                                },
                                                {
                                                    "FWID": "13",
                                                    "FrameworkName": "New RA GRC Framework ",
                                                    "Version": "1.0",
                                                    "PolicyFileID": "10",
                                                    "PolicyFileName": "Risk Appetite Policy SecurEyes Updated New.pdf",
                                                    "FrameworkFileId": "10",
                                                    "FrameworkFileName": "Risk Appetite Framework GRC.xlsx",
                                                    "UploadDate": "2025-02-10T16:25:59.690Z"
                                                },
                                                {
                                                    "FWID": "9",
                                                    "FrameworkName": "Test for unit mapping ",
                                                    "Version": "1.0",
                                                    "PolicyFileID": "6",
                                                    "PolicyFileName": "Risk Appetite Policy (4).pdf",
                                                    "FrameworkFileId": "6",
                                                    "FrameworkFileName": "Risk Appetite Framework_4 Demo _ Unit- Updated (1).xlsx",
                                                    "UploadDate": "2025-02-03T17:51:10.470Z"
                                                },
                                                {
                                                    "FWID": "8",
                                                    "FrameworkName": "NEW RA Policy",
                                                    "Version": "1.0",
                                                    "PolicyFileID": "5",
                                                    "PolicyFileName": "Risk Appetite Policy SE 1.pdf",
                                                    "FrameworkFileId": "5",
                                                    "FrameworkFileName": "Risk Appetite Framework_4 Demo _ Unit- Updated (1).xlsx",
                                                    "UploadDate": "2025-01-30T17:33:06.143Z"
                                                },
                                                {
                                                    "FWID": "7",
                                                    "FrameworkName": "test 1001",
                                                    "Version": "1.0",
                                                    "PolicyFileID": "4",
                                                    "PolicyFileName": "Risk Appetite Policy (4).pdf",
                                                    "FrameworkFileId": "4",
                                                    "FrameworkFileName": "Risk Appetite Sanity Test Data.xlsx",
                                                    "UploadDate": "2025-01-27T14:33:07.357Z"
                                                },
                                                {
                                                    "FWID": "5",
                                                    "FrameworkName": "RA Sanity Latest",
                                                    "Version": "1.0",
                                                    "PolicyFileID": "2",
                                                    "PolicyFileName": "Risk Appetite Policy.pdf",
                                                    "FrameworkFileId": "2",
                                                    "FrameworkFileName": "Risk Appetite Sanity Test Data.xlsx",
                                                    "UploadDate": "2024-12-29T17:06:53.813Z"
                                                },
                                                {
                                                    "FWID": "4",
                                                    "FrameworkName": "RA Sanity Test ",
                                                    "Version": "1.0",
                                                    "PolicyFileID": "1",
                                                    "PolicyFileName": "Risk Appetite Policy.pdf",
                                                    "FrameworkFileId": "1",
                                                    "FrameworkFileName": "RA Sanity Framework.xlsx",
                                                    "UploadDate": "2024-12-29T17:01:21.247Z"
                                                }
                                            ]
                                        },
                                    },
                                },
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
