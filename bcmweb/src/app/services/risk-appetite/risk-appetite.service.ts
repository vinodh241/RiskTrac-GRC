import { Injectable } from '@angular/core';
import { RestService } from '../rest/rest.service';
import { environment } from 'src/environments/environment';
@Injectable({
    providedIn: 'root'
})
export class RiskAppetiteService extends RestService {
    uploadRiskAppetite(data:FormData, rafPolicyName: string) {
        return this.upload("/operational-risk-management/risk-appetite/upload-risk-appetite", data);
    }

    downloadRiskAppetite(fileData: {fileId: string, fileType : string}) {
        return this.post("/operational-risk-management/risk-appetite/download-file", {
            "data": fileData
        });
    }

    getRiskAppetites() {
        return this.post("/operational-risk-management/risk-appetite/get-risk-appetite-list", {});
    }

    getPolicyDetails(FWID: string) {
        return this.post("/operational-risk-management/risk-appetite/get-policy-details", {
            "data": {
                "fwid": FWID
            },
        });
    }

    downloadRiskAppetiteTemplate(templateId: any) {
        return this.post("/operational-risk-management/risk-appetite/download-risk-appetite-template", {
            "data" : {
                "templateId" : templateId
            }
        });
    }

    uploadRiskAppetiteTemplate(data:FormData) {
        return this.upload("/operational-risk-management/risk-appetite/upload-risk-appetite-template", data);
    }

    getRiskAppetiteTemplates() {
        return this.post("/operational-risk-management/risk-appetite/get-risk-appetite-template-list", {});
    }

    // getKriHistorical(): void {
    //     if (environment.dummyData) {
    //         this.processKriHistorical({
    //             "success": 1,
    //             "message": "Data fetch from DB successful.",
    //             "result": {
    //                 "units": [
    //                     {
    //                         "UnitID": 1,
    //                         "UnitName": "Treasury",
    //                         "GroupID": 2
    //                     },
    //                     {
    //                         "UnitID": 1,
    //                         "UnitName": "Business",
    //                         "GroupID": 1
    //                     },
    //                     {
    //                         "UnitID": 2,
    //                         "UnitName": "Financial Accounting",
    //                         "GroupID": 2
    //                     }
    //                 ],
    //                 "groups": [
    //                     {
    //                         "GroupID": 1,
    //                         "GroupName": "Corporate"
    //                     },
    //                     {
    //                         "GroupID": 2,
    //                         "GroupName": "Finance"
    //                     }
    //                 ],
    //                 "years": [
    //                     {
    //                         "Years": 2021
    //                     },
    //                     {
    //                         "Years": 2022
    //                     },
    //                     {
    //                         "Years": 2023
    //                     }
    //                 ],
    //                 "kriMetricData": [
    //                     {
    //                         "KriCode": "KRI-001",
    //                         "MetricID": 1,
    //                         "GroupID": 1,
    //                         "GroupName": "Corporate",
    //                         "UnitID": 1,
    //                         "UnitName": "Business",
    //                         "KeyRiskIndicator": "dfdfdfgfdg",
    //                         "MeasurementFrequencyID": 1,
    //                         "MeasurementFrequency": "Semi Annual",
    //                         "scoring": [
    //                             {
    //                                 "MetricID": 4,
    //                                 "MeassurementID": "12",
    //                                 "Period": "Jul-Dec 22",
    //                                 "Date": "2022-11-18T12:59:00.000Z",
    //                                 "Measurement": 36,
    //                                 "ThresholdID": 1,
    //                                 "ThresholdValue": 3,
    //                                 "ColorCode": "#f2cb30",
    //                                 "Year": 2022
    //                             },
    //                             {
    //                                 "MetricID": 4,
    //                                 "MeassurementID": "12",
    //                                 "Period": "Apr-Jun 23",
    //                                 "Date": "2023-11-18T12:59:00.000Z",
    //                                 "Measurement": 36,
    //                                 "ThresholdID": 1,
    //                                 "ThresholdValue": 3,
    //                                 "ColorCode": "#fffHHH",
    //                                 "Year": 2023
    //                             },
    //                             {
    //                                 "MetricID": 4,
    //                                 "MeassurementID": "12",
    //                                 "Period": "Jul-Sep 22",
    //                                 "Date": "2022-11-18T12:59:00.000Z",
    //                                 "Measurement": 36,
    //                                 "ThresholdID": 1,
    //                                 "ThresholdValue": 3,
    //                                 "ColorCode": "#56af36",
    //                                 "Year": 2022
    //                             }
    //                         ]
    //                     },
    //                     {
    //                         "KriCode": "KRI-001",
    //                         "MetricID": 1,
    //                         "GroupID": 1,
    //                         "GroupName": "Corporate",
    //                         "UnitID": 1,
    //                         "UnitName": "Business",
    //                         "KeyRiskIndicator": "dfdfdfgfdg",
    //                         "MeasurementFrequencyID": 1,
    //                         "MeasurementFrequency": "Quarterly",
    //                         "scoring": [
    //                             {
    //                                 "MetricID": 4,
    //                                 "MeassurementID": "12",
    //                                 "Period": "Oct-Dec 22",
    //                                 "Date": "2022-11-18T12:59:00.000Z",
    //                                 "Measurement": 36,
    //                                 "ThresholdID": 1,
    //                                 "ThresholdValue": 3,
    //                                 "ColorCode": "#56af36",
    //                                 "Year": 2022
    //                             },
    //                             {
    //                                 "MetricID": 4,
    //                                 "MeassurementID": "12",
    //                                 "Period": "Oct-Dec 21",
    //                                 "Date": "2021-11-18T12:59:00.000Z",
    //                                 "Measurement": 36,
    //                                 "ThresholdID": 1,
    //                                 "ThresholdValue": 3,
    //                                 "ColorCode": "#f2cb30",
    //                                 "Year": 2021
    //                             },
    //                             {
    //                                 "MetricID": 4,
    //                                 "MeassurementID": "12",
    //                                 "Period": "Jul-Sep 21",
    //                                 "Date": "2021-11-18T12:59:00.000Z",
    //                                 "Measurement": 36,
    //                                 "ThresholdID": 1,
    //                                 "ThresholdValue": 3,
    //                                 "ColorCode": "#f2cb30",
    //                                 "Year": 2021
    //                             }
    //                         ]
    //                     },
    //                     {
    //                         "KriCode": "KRI-001",
    //                         "MetricID": 1,
    //                         "GroupID": 2,
    //                         "GroupName": "Finance",
    //                         "UnitID": 2,
    //                         "UnitName": "Financial Accounting",
    //                         "KeyRiskIndicator": "dfdfdfgfdg",
    //                         "MeasurementFrequencyID": 1,
    //                         "MeasurementFrequency": "Monthly",
    //                         "scoring": [
    //                             {
    //                                 "MetricID": 4,
    //                                 "MeassurementID": "12",
    //                                 "Period": "Jan 22",
    //                                 "Date": "2022-11-18T12:59:00.000Z",
    //                                 "Measurement": 36,
    //                                 "ThresholdID": 1,
    //                                 "ThresholdValue": 3,
    //                                 "ColorCode": "#ffcc61",
    //                                 "Year": 2022
    //                             },
    //                             {
    //                                 "MetricID": 4,
    //                                 "MeassurementID": "12",
    //                                 "Period": "Feb 22",
    //                                 "Date": "2022-11-18T12:59:00.000Z",
    //                                 "Measurement": 36,
    //                                 "ThresholdID": 1,
    //                                 "ThresholdValue": 3,
    //                                 "ColorCode": "#f2cb30",
    //                                 "Year": 2021
    //                             },
    //                             {
    //                                 "MetricID": 4,
    //                                 "MeassurementID": "12",
    //                                 "Period": "March 22",
    //                                 "Date": "2022-11-18T12:59:00.000Z",
    //                                 "Measurement": 36,
    //                                 "ThresholdID": 1,
    //                                 "ThresholdValue": 3,
    //                                 "ColorCode": "#fffHHH",
    //                                 "Year": 2022
    //                             },
    //                             {
    //                                 "MetricID": 4,
    //                                 "MeassurementID": "12",
    //                                 "Period": "Jun 22",
    //                                 "Date": "2022-11-18T12:59:00.000Z",
    //                                 "Measurement": 36,
    //                                 "ThresholdID": 1,
    //                                 "ThresholdValue": 3,
    //                                 "ColorCode": "#56af36",
    //                                 "Year": 2022
    //                             },
    //                             {
    //                                 "MetricID": 4,
    //                                 "MeassurementID": "12",
    //                                 "Period": "Sep 22",
    //                                 "Date": "2022-11-18T12:59:00.000Z",
    //                                 "Measurement": 36,
    //                                 "ThresholdID": 1,
    //                                 "ThresholdValue": 3,
    //                                 "ColorCode": "#fffHHH",
    //                                 "Year": 2021
    //                             }
    //                         ]
    //                     },
    //                     {
    //                         "KriCode": "KRI-001",
    //                         "MetricID": 1,
    //                         "GroupID": 2,
    //                         "GroupName": "Finance",
    //                         "UnitID": 1,
    //                         "UnitName": "Treasury",
    //                         "KeyRiskIndicator": "dfdfdfgfdg",
    //                         "MeasurementFrequencyID": 1,
    //                         "MeasurementFrequencyName": "Monthly",
    //                         "scoring": [
    //                             {
    //                                 "MetricID": 4,
    //                                 "MeassurementID": "12",
    //                                 "Period": "Oct 22",
    //                                 "Date": "2022-11-18T12:59:00.000Z",
    //                                 "Measurement": 36,
    //                                 "ThresholdID": 1,
    //                                 "ThresholdValue": 3,
    //                                 "ColorCode": "#fffHHH",
    //                                 "Year": 2022
    //                             },
    //                             {
    //                                 "MetricID": 4,
    //                                 "MeassurementID": "12",
    //                                 "Period": "Jul 22",
    //                                 "Date": "2022-11-18T12:59:00.000Z",
    //                                 "Measurement": 36,
    //                                 "ThresholdID": 1,
    //                                 "ThresholdValue": 3,
    //                                 "ColorCode": "#ffcc61",
    //                                 "Year": 2021
    //                             },
    //                             {
    //                                 "MetricID": 4,
    //                                 "MeassurementID": "12",
    //                                 "Period": "Dec 22",
    //                                 "Date": "2022-11-18T12:59:00.000Z",
    //                                 "Measurement": 36,
    //                                 "ThresholdID": 1,
    //                                 "ThresholdValue": 3,
    //                                 "ColorCode": "#f2cb30",
    //                                 "Year": 2022
    //                             }
    //                         ]
    //                     },
    //                     {
    //                         "KriCode": "KRI-001",
    //                         "MetricID": 1,
    //                         "GroupID": 1,
    //                         "GroupName": "Corporate",
    //                         "UnitID": 1,
    //                         "UnitName": "Business",
    //                         "KeyRiskIndicator": "dfdfdfgfdg",
    //                         "MeasurementFrequencyID": 1,
    //                         "MeasurementFrequency": "Annually",
    //                         "scoring": [
    //                             {
    //                                 "MetricID": 4,
    //                                 "MeassurementID": "12",
    //                                 "Period": "Jan-Dec 22",
    //                                 "Date": "2022-11-18T12:59:00.000Z",
    //                                 "Measurement": 36,
    //                                 "ThresholdID": 1,
    //                                 "ThresholdValue": 3,
    //                                 "ColorCode": "#56af36",
    //                                 "Year": 2022
    //                             }
    //                         ]
    //                     },
    //                     {
    //                         "KriCode": "KRI-001",
    //                         "MetricID": 1,
    //                         "GroupID": 2,
    //                         "GroupName": "Finance",
    //                         "UnitID": 1,
    //                         "UnitName": "Treasury",
    //                         "KeyRiskIndicator": "dfdfdfgfdg",
    //                         "MeasurementFrequencyID": 1,
    //                         "MeasurementFrequency": "Monthly",
    //                         "scoring": [
    //                             {
    //                                 "MetricID": 4,
    //                                 "MeassurementID": "12",
    //                                 "Period": "Jan 22",
    //                                 "Date": "2022-11-18T12:59:00.000Z",
    //                                 "Measurement": 36,
    //                                 "ThresholdID": 1,
    //                                 "ThresholdValue": 3,
    //                                 "ColorCode": "#ffcc61",
    //                                 "Year": 2022
    //                             },
    //                             {
    //                                 "MetricID": 4,
    //                                 "MeassurementID": "12",
    //                                 "Period": "Feb 22",
    //                                 "Date": "2022-11-18T12:59:00.000Z",
    //                                 "Measurement": 36,
    //                                 "ThresholdID": 1,
    //                                 "ThresholdValue": 3,
    //                                 "ColorCode": "#f2cb30",
    //                                 "Year": 2021
    //                             },
    //                             {
    //                                 "MetricID": 4,
    //                                 "MeassurementID": "12",
    //                                 "Period": "March 22",
    //                                 "Date": "2022-11-18T12:59:00.000Z",
    //                                 "Measurement": 36,
    //                                 "ThresholdID": 1,
    //                                 "ThresholdValue": 3,
    //                                 "ColorCode": "#fffHHH",
    //                                 "Year": 2022
    //                             },
    //                             {
    //                                 "MetricID": 4,
    //                                 "MeassurementID": "12",
    //                                 "Period": "Jun 22",
    //                                 "Date": "2022-11-18T12:59:00.000Z",
    //                                 "Measurement": 36,
    //                                 "ThresholdID": 1,
    //                                 "ThresholdValue": 3,
    //                                 "ColorCode": "#56af36",
    //                                 "Year": 2021
    //                             },
    //                             {
    //                                 "MetricID": 4,
    //                                 "MeassurementID": "12",
    //                                 "Period": "Sep 22",
    //                                 "Date": "2022-11-18T12:59:00.000Z",
    //                                 "Measurement": 36,
    //                                 "ThresholdID": 1,
    //                                 "ThresholdValue": 3,
    //                                 "ColorCode": "#fffHHH",
    //                                 "Year": 2022
    //                             }
    //                         ]
    //                     },
    //                     {
    //                         "KriCode": "KRI-001",
    //                         "MetricID": 1,
    //                         "GroupID": 1,
    //                         "GroupName": "Corporate",
    //                         "UnitID": 1,
    //                         "UnitName": "Business",
    //                         "KeyRiskIndicator": "dfdfdfgfdg",
    //                         "MeasurementFrequencyID": 1,
    //                         "MeasurementFrequency": "Semi Annual",
    //                         "scoring": [
    //                             {
    //                                 "MetricID": 4,
    //                                 "MeassurementID": "12",
    //                                 "Period": "Jul-Dec 22",
    //                                 "Date": "2022-11-18T12:59:00.000Z",
    //                                 "Measurement": 36,
    //                                 "ThresholdID": 1,
    //                                 "ThresholdValue": 3,
    //                                 "ColorCode": "#f2cb30",
    //                                 "Year": 2022
    //                             },
    //                             {
    //                                 "MetricID": 4,
    //                                 "MeassurementID": "12",
    //                                 "Period": "Apr-Jun 23",
    //                                 "Date": "2023-11-18T12:59:00.000Z",
    //                                 "Measurement": 36,
    //                                 "ThresholdID": 1,
    //                                 "ThresholdValue": 3,
    //                                 "ColorCode": "#fffHHH",
    //                                 "Year": 2023
    //                             },
    //                             {
    //                                 "MetricID": 4,
    //                                 "MeassurementID": "12",
    //                                 "Period": "Jul-Sep 22",
    //                                 "Date": "2022-11-18T12:59:00.000Z",
    //                                 "Measurement": 36,
    //                                 "ThresholdID": 1,
    //                                 "ThresholdValue": 3,
    //                                 "ColorCode": "#56af36",
    //                                 "Year": 2022
    //                             }
    //                         ]
    //                     },
    //                     {
    //                         "KriCode": "KRI-001",
    //                         "MetricID": 1,
    //                         "GroupID": 1,
    //                         "GroupName": "Corporate",
    //                         "UnitID": 1,
    //                         "UnitName": "Business",
    //                         "KeyRiskIndicator": "dfdfdfgfdg",
    //                         "MeasurementFrequencyID": 1,
    //                         "MeasurementFrequency": "Quarterly",
    //                         "scoring": [
    //                             {
    //                                 "MetricID": 4,
    //                                 "MeassurementID": "12",
    //                                 "Period": "Oct-Dec 22",
    //                                 "Date": "2022-11-18T12:59:00.000Z",
    //                                 "Measurement": 36,
    //                                 "ThresholdID": 1,
    //                                 "ThresholdValue": 3,
    //                                 "ColorCode": "#56af36",
    //                                 "Year": 2022
    //                             },
    //                             {
    //                                 "MetricID": 4,
    //                                 "MeassurementID": "12",
    //                                 "Period": "Oct-Dec 21",
    //                                 "Date": "2021-11-18T12:59:00.000Z",
    //                                 "Measurement": 36,
    //                                 "ThresholdID": 1,
    //                                 "ThresholdValue": 3,
    //                                 "ColorCode": "#f2cb30",
    //                                 "Year": 2021
    //                             },
    //                             {
    //                                 "MetricID": 4,
    //                                 "MeassurementID": "12",
    //                                 "Period": "Jul-Sep 21",
    //                                 "Date": "2021-11-18T12:59:00.000Z",
    //                                 "Measurement": 36,
    //                                 "ThresholdID": 1,
    //                                 "ThresholdValue": 3,
    //                                 "ColorCode": "#f2cb30",
    //                                 "Year": 2021
    //                             }
    //                         ]
    //                     },
    //                     {
    //                         "KriCode": "KRI-001",
    //                         "MetricID": 1,
    //                         "GroupID": 2,
    //                         "GroupName": "Finance",
    //                         "UnitID": 2,
    //                         "UnitName": "Financial Accounting",
    //                         "KeyRiskIndicator": "dfdfdfgfdg",
    //                         "MeasurementFrequencyID": 1,
    //                         "MeasurementFrequency": "Monthly",
    //                         "scoring": [
    //                             {
    //                                 "MetricID": 4,
    //                                 "MeassurementID": "12",
    //                                 "Period": "Jan 22",
    //                                 "Date": "2022-11-18T12:59:00.000Z",
    //                                 "Measurement": 36,
    //                                 "ThresholdID": 1,
    //                                 "ThresholdValue": 3,
    //                                 "ColorCode": "#ffcc61",
    //                                 "Year": 2022
    //                             },
    //                             {
    //                                 "MetricID": 4,
    //                                 "MeassurementID": "12",
    //                                 "Period": "Feb 22",
    //                                 "Date": "2022-11-18T12:59:00.000Z",
    //                                 "Measurement": 36,
    //                                 "ThresholdID": 1,
    //                                 "ThresholdValue": 3,
    //                                 "ColorCode": "#f2cb30",
    //                                 "Year": 2021
    //                             },
    //                             {
    //                                 "MetricID": 4,
    //                                 "MeassurementID": "12",
    //                                 "Period": "March 22",
    //                                 "Date": "2022-11-18T12:59:00.000Z",
    //                                 "Measurement": 36,
    //                                 "ThresholdID": 1,
    //                                 "ThresholdValue": 3,
    //                                 "ColorCode": "#fffHHH",
    //                                 "Year": 2022
    //                             },
    //                             {
    //                                 "MetricID": 4,
    //                                 "MeassurementID": "12",
    //                                 "Period": "Jun 22",
    //                                 "Date": "2022-11-18T12:59:00.000Z",
    //                                 "Measurement": 36,
    //                                 "ThresholdID": 1,
    //                                 "ThresholdValue": 3,
    //                                 "ColorCode": "#56af36",
    //                                 "Year": 2022
    //                             },
    //                             {
    //                                 "MetricID": 4,
    //                                 "MeassurementID": "12",
    //                                 "Period": "Sep 22",
    //                                 "Date": "2022-11-18T12:59:00.000Z",
    //                                 "Measurement": 36,
    //                                 "ThresholdID": 1,
    //                                 "ThresholdValue": 3,
    //                                 "ColorCode": "#fffHHH",
    //                                 "Year": 2021
    //                             }
    //                         ]
    //                     },
    //                     {
    //                         "KriCode": "KRI-001",
    //                         "MetricID": 1,
    //                         "GroupID": 2,
    //                         "GroupName": "Finance",
    //                         "UnitID": 1,
    //                         "UnitName": "Treasury",
    //                         "KeyRiskIndicator": "dfdfdfgfdg",
    //                         "MeasurementFrequencyID": 1,
    //                         "MeasurementFrequencyName": "Monthly",
    //                         "scoring": [
    //                             {
    //                                 "MetricID": 4,
    //                                 "MeassurementID": "12",
    //                                 "Period": "Oct 22",
    //                                 "Date": "2022-11-18T12:59:00.000Z",
    //                                 "Measurement": 36,
    //                                 "ThresholdID": 1,
    //                                 "ThresholdValue": 3,
    //                                 "ColorCode": "#fffHHH",
    //                                 "Year": 2022
    //                             },
    //                             {
    //                                 "MetricID": 4,
    //                                 "MeassurementID": "12",
    //                                 "Period": "Jul 22",
    //                                 "Date": "2022-11-18T12:59:00.000Z",
    //                                 "Measurement": 36,
    //                                 "ThresholdID": 1,
    //                                 "ThresholdValue": 3,
    //                                 "ColorCode": "#ffcc61",
    //                                 "Year": 2021
    //                             },
    //                             {
    //                                 "MetricID": 4,
    //                                 "MeassurementID": "12",
    //                                 "Period": "Dec 22",
    //                                 "Date": "2022-11-18T12:59:00.000Z",
    //                                 "Measurement": 36,
    //                                 "ThresholdID": 1,
    //                                 "ThresholdValue": 3,
    //                                 "ColorCode": "#f2cb30",
    //                                 "Year": 2022
    //                             }
    //                         ]
    //                     },
    //                     {
    //                         "KriCode": "KRI-001",
    //                         "MetricID": 1,
    //                         "GroupID": 1,
    //                         "GroupName": "Corporate",
    //                         "UnitID": 1,
    //                         "UnitName": "Business",
    //                         "KeyRiskIndicator": "dfdfdfgfdg",
    //                         "MeasurementFrequencyID": 1,
    //                         "MeasurementFrequency": "Annually",
    //                         "scoring": [
    //                             {
    //                                 "MetricID": 4,
    //                                 "MeassurementID": "12",
    //                                 "Period": "Jan-Dec 22",
    //                                 "Date": "2022-11-18T12:59:00.000Z",
    //                                 "Measurement": 36,
    //                                 "ThresholdID": 1,
    //                                 "ThresholdValue": 3,
    //                                 "ColorCode": "#56af36",
    //                                 "Year": 2022
    //                             }
    //                         ]
    //                     },
    //                     {
    //                         "KriCode": "KRI-001",
    //                         "MetricID": 1,
    //                         "GroupID": 2,
    //                         "GroupName": "Finance",
    //                         "UnitID": 1,
    //                         "UnitName": "Treasury",
    //                         "KeyRiskIndicator": "dfdfdfgfdg",
    //                         "MeasurementFrequencyID": 1,
    //                         "MeasurementFrequency": "Monthly",
    //                         "scoring": [
    //                             {
    //                                 "MetricID": 4,
    //                                 "MeassurementID": "12",
    //                                 "Period": "Jan 22",
    //                                 "Date": "2022-11-18T12:59:00.000Z",
    //                                 "Measurement": 36,
    //                                 "ThresholdID": 1,
    //                                 "ThresholdValue": 3,
    //                                 "ColorCode": "#ffcc61",
    //                                 "Year": 2022
    //                             },
    //                             {
    //                                 "MetricID": 4,
    //                                 "MeassurementID": "12",
    //                                 "Period": "Feb 22",
    //                                 "Date": "2022-11-18T12:59:00.000Z",
    //                                 "Measurement": 36,
    //                                 "ThresholdID": 1,
    //                                 "ThresholdValue": 3,
    //                                 "ColorCode": "#f2cb30",
    //                                 "Year": 2021
    //                             },
    //                             {
    //                                 "MetricID": 4,
    //                                 "MeassurementID": "12",
    //                                 "Period": "March 22",
    //                                 "Date": "2022-11-18T12:59:00.000Z",
    //                                 "Measurement": 36,
    //                                 "ThresholdID": 1,
    //                                 "ThresholdValue": 3,
    //                                 "ColorCode": "#fffHHH",
    //                                 "Year": 2022
    //                             },
    //                             {
    //                                 "MetricID": 4,
    //                                 "MeassurementID": "12",
    //                                 "Period": "Jun 22",
    //                                 "Date": "2022-11-18T12:59:00.000Z",
    //                                 "Measurement": 36,
    //                                 "ThresholdID": 1,
    //                                 "ThresholdValue": 3,
    //                                 "ColorCode": "#56af36",
    //                                 "Year": 2021
    //                             },
    //                             {
    //                                 "MetricID": 4,
    //                                 "MeassurementID": "12",
    //                                 "Period": "Sep 22",
    //                                 "Date": "2022-11-18T12:59:00.000Z",
    //                                 "Measurement": 36,
    //                                 "ThresholdID": 1,
    //                                 "ThresholdValue": 3,
    //                                 "ColorCode": "#fffHHH",
    //                                 "Year": 2022
    //                             }
    //                         ]
    //                     },
    //                 ]
    //             },
    //             "error": {
    //                 "errorCode": null,
    //                 "errorMessage": null
    //             },
    //             "token": "GF35R0sw7i5tJG6VN0kLO4TlRnWdn9pLe2RpJYqOcaA"
    //         })
    //     } else {
    //         this.post("/operational-risk-management/kri/get-kri-historical-scoring", {}).subscribe(res => {
    //             next:
    //             if (res.success == 1) {
    //                 // console.log("kri service", res);
    //                 this.processKriHistorical(res)
    //             } else {
    //                 // console.log("kri service error");
    //                 if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
    //                     this.utils.relogin(this._document);
    //                 else
    //                     this.popupInfo("Unsuccessful", res.error.errorMessage)
    //             }
    //         });
    //     }
    // }
}
