import { Inject, Injectable } from '@angular/core';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { environment } from 'src/environments/environment';
import { RestService } from '../rest/rest.service';
import { UtilsService } from '../utils/utils.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { DOCUMENT, DatePipe } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';


@Injectable({
  providedIn: 'root'
})

export class DashboardService extends RestService {
  dashboardLeftmenu: any = "overall"
  public master!: any;
  public masterIndicator!: any;
  public masterKRICode!: any;
  public masterIndicatorNew!: any;
  public InheritRiskmaster!: any;
  public ResidualRiskmaster!: any;
  public RAMaster!: any;
  public Mhrmaster!: any;
  public dashboardIncMaster: any;
  public gotMasterIndicator: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public gotMaster: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public gotRAMaster: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public gotincidentDashboardMaster: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public gotYearQuater: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public gotOverallDashboardMaster: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public riskMetricData: any = [];
  public dashboardRCSAMaster: any;
  public dashboardRAMaster: any;
  public dashboardKRIMaster: any;
  public dashboardINCMaster: any;
  public dashboardKRIColorMaster: any;
  public dashboardRAColor: any;

  public inAppRCSA: any;
  public inAppRA: any;
  public inAppKRI: any;
  public inAppINC: any;
  public CurrencyType: any;
  KeyRiskIndicatorScore: any[] = [];
  KeyRiskIndicatorZone!: MatTableDataSource<any>;
  // KeyRiskIndicatorUnits!: MatTableDataSource<any>;
  KeyRiskIndicatorCycleReporting: any;
  KeyRiskIndicatorChart: any;
  KeyRiskIndicatorData!: any;
  quarterData: any;
  yearData: any;
  quaterValue: any;
  yearValue: any;
  reportingFrequencyData: any[] =[];

  constructor(
    private utils: UtilsService,
    private _http: HttpClient,
    private _dialog: MatDialog,
    private _datePipe: DatePipe,
    @Inject(DOCUMENT) private _document: any) {
    super(_http, _dialog);
  }

  private processKeyRiskIndicator(res: any): void {
    this.KeyRiskIndicatorData = res.result
    // console.log(this.KeyRiskIndicatorData)
  }

  getKeyRiskIndicator() {
    this.post("/operational-risk-management/dashboard/get-dashboard-kri", {}).subscribe(res => {
      next:
      if (res.success == 1) {
        this.processRiskIndicatorSchedule(res)
      } else {
        if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
          this.utils.relogin(this._document);
        else
          this.popupInfo("Unsuccessful", res.error.errorMessage)
      }
    });
  }

  processRiskIndicatorSchedule(response: any): void {
    this.masterIndicator = response.result.KRIData;
    this.masterKRICode = response.result.KRIColorData;
    this.masterIndicatorNew = JSON.stringify(response.result.KRIData);
    this.reportingFrequencyData = response.result.reportingFrequencyData;
    this.gotMasterIndicator.next(true);
  }

  getRiskAssessmentSchedule(): void {
    // if (environment.dummyData) {
    //   this.processRiskAssessmentSchedule({
    //     "success": 1,
    //     "message": "Data fetch from DB successful.",
    //     "result": {
    //       "totalRiskAssessments": 58,
    //       "unitOverdue": [
    //         {
    //           "totalUnitOverdue": 100,
    //           "scheduledUnitOverdue": 15,
    //           "percentageUnitOverdue": 15,
    //         }
    //       ],
    //       "assessmentNotFilled": [
    //         {
    //           "totalassessmentNotFilled": 100,
    //           "scheduledassessmentNotFilled": 43,
    //           "percentageassessmentNotFilled": 43,
    //         }
    //       ],

    //     },
    //     "error": {
    //       "errorCode": null,
    //       "errorMessage": null
    //     },
    //     "token": "eyJ0eXAiOiJKV"
    //   })
    // } else {
    this.post("/operational-risk-management/dashboard/get-dashboard-rcsa", {}).subscribe(res => {
      next:
      if (res.success == 1) {
        // console.log(res);

        this.processRiskAssessmentSchedule(res)
      } else {
        if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
          this.utils.relogin(this._document);
        else
          this.popupInfo("Unsuccessful", res.error.errorMessage)
      }
    });
    // }
  }


  processRiskAssessmentSchedule(response: any): void {
    this.master = response.result.RCSAData;
    this.gotMaster.next(true);
  }

  getInheritRiskSchedule(): void {
    // if (environment.dummyData) {
    this.processInheritRiskSchedule({
      "success": 1,
      "message": "Data fetch from DB successful.",
      "result": {
        "analysisData": [{
          "name": "Operations",
          "value": 11
        }, {
          "name": "Treasury",
          "value": 8
        }, {
          "name": "Retail Credit",
          "value": 3
        }, {
          "name": "Financial Reporting & Planning",
          "value": 1
        }],
        "inheritRiskFirstStep": [
          {
            "color": "#cfcfcf",
            "name": "High Risk Count",
            "y": 34
          }, {
            "color": "#cfcfcf",
            "name": "# of Risk migrated from Low/Mid to High",
            "y": 12
          }, {
            "color": "#fc7575",
            "name": "# of Risk migrated from High to Low/Mid",
            "y": 37
          }
        ],
        "inheritRiskSecondStep": [
          {
            "color": "#fc7575",
            "name": "High Risk Count",
            "y": 39
          }, {
            "color": "#fc7575",
            "name": "# of Risk migrated from Low/Mid to High",
            "y": 24
          }, {
            "color": "#8ae6d0",
            "name": "# of Risk migrated from High to Low/Mid",
            "y": 26
          }
        ],
        "legendsFordata": [
          {
            "color": "#cfcfcf",
            "name": "Previous Data"
          }, {
            "color": "#fc7575",
            "name": "Current Data (Priority >= High) Risk"
          }, {
            "color": "#8ae6d0",
            "name": "Current Data Low/Med Risk"
          }
        ],

      },
      "error": {
        "errorCode": null,
        "errorMessage": null
      },
      "token": "eyJ0eXAiOiJKV"
    })
    // } else {
    //   this.post("/operational-risk-management/incidents/get-incident-master-data", {}).subscribe(res => {
    //     next:
    //     if (res.success == 1) {
    //       this.processInheritRiskSchedule(res)
    //     } else {
    //       if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
    //         this.utils.relogin(this._document);
    //       else
    //         this.popupInfo("Unsuccessful", res.error.errorMessage)
    //     }
    //   });
    // }
  }

  processInheritRiskSchedule(response: any): void {
    this.InheritRiskmaster = response.result;
  }

  getResidualRiskSchedule(): void {
    // if (environment.dummyData) {
    this.processResidualRiskSchedule({
      "success": 1,
      "message": "Data fetch from DB successful.",
      "result": {
        "analysisData": [{
          "name": "Management",
          "value": 5
        }, {
          "name": "Customer Care",
          "value": 3
        }, {
          "name": "Treasury",
          "value": 2
        }, {
          "name": "Financial Reporting & Planning",
          "value": 1
        }],
        "ResidualRiskFirstStep": [
          {
            "color": "#cfcfcf",
            "name": "(Priority >= High) Risk Count",
            "y": 17
          }, {
            "color": "#cfcfcf",
            "name": "# of Risk migrated from Low/Mid to (Priority >= High)",
            "y": 8
          }, {
            "color": "#fc7575",
            "name": "# of Risk migrated from (Priority >= High) to Low/Mid",
            "y": 17
          }
        ],
        "ResidualRiskSecondStep": [
          {
            "color": "#fc7575",
            "name": "(Priority >= High) Risk Count",
            "y": 24
          }, {
            "color": "#fc7575",
            "name": "# of Risk migrated from Low/Mid to (Priority >= High)",
            "y": 12
          }, {
            "color": "#8ae6d0",
            "name": "# of Risk migrated from (Priority >= High) to Low/Mid",
            "y": 14
          }
        ],
        "legendsFordata": [
          {
            "color": "#cfcfcf",
            "name": "Previous Data"
          }, {
            "color": "#fc7575",
            "name": "Current Data (Priority >= High) Risk"
          }, {
            "color": "#8ae6d0",
            "name": "Current Data Low/Med Risk"
          }
        ],

      },
      "error": {
        "errorCode": null,
        "errorMessage": null
      },
      "token": "eyJ0eXAiOiJKV"
    })
    // } else {
    //   this.post("/operational-risk-management/dashboard/get-dashboard-rcsa", {}).subscribe(res => {
    //     next:
    //     if (res.success == 1) {
    //       this.processResidualRiskSchedule(res)
    //     } else {
    //       if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
    //         this.utils.relogin(this._document);
    //       else
    //         this.popupInfo("Unsuccessful", res.error.errorMessage)
    //     }
    //   });
    // }
  }

  processResidualRiskSchedule(response: any): void {
    this.ResidualRiskmaster = response.result;
  }

  getMhrSchedule(): void {
    // if (environment.dummyData) {
    this.processMhrSchedule({
      "success": 1,
      "message": "Data fetch from DB successful.",
      "result": {
        "inherent": [
          {
            "name": "Corporate Credit",
            "y": 12
          }, {
            "name": "Collection",
            "y": 11
          }, {
            "name": "Cyber Security",
            "y": 10
          }, {
            "name": "Risk Management",
            "y": 7
          }, {
            "name": "Business Countinuity",
            "y": 6
          }, {
            "name": "Corporate Credit",
            "y": 12
          }, {
            "name": "Collection",
            "y": 11
          }
        ],
        "residual": [
          {
            "name": "Corporate Credit",
            "y": 15
          }, {
            "name": "Collection",
            "y": 11
          }, {
            "name": "Cyber Security",
            "y": 13
          }, {
            "name": "Risk Management",
            "y": 3
          }, {
            "name": "Business Countinuity",
            "y": 7
          }, {
            "name": "Corporate Credit",
            "y": 15
          }, {
            "name": "Collection",
            "y": 11
          }
        ],

      },
      "error": {
        "errorCode": null,
        "errorMessage": null
      },
      "token": "eyJ0eXAiOiJKV"
    })
    // } else {

    // this.post("/operational-risk-management/dashboard/get-dashboard-rcsa", { }).subscribe(res => {
    //   if (res.success == 1) {
    //       this.processMhrSchedule(res.result);
    //   } else {
    //       if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
    //           this.utils.relogin(this._document);
    //       else
    //           this.popupInfo("Unsuccessful", res.error.errorMessage)
    //       }
    //   });
    // }
  }

  processMhrSchedule(response: any): void {
    this.Mhrmaster = response.result;
  }

  popupInfo(title: string, message: string) {
    const timeout = 3000; // 3 seconds
    const confirm = this._dialog.open(InfoComponent, {
      disableClose: true,
      id: "InfoComponent",
      minWidth: "300px",
      panelClass: "dark",
      data: {
        title: title,
        content: message
      }
    });

    confirm.afterOpened().subscribe(result => {
      setTimeout(() => {
        confirm.close();
        // this.router.navigate(['']);
      }, timeout)
    });
  }


  // getRiskAppetiteSchedule(): void {
  //   if (environment.dummyData) {
  //     this.processRiskAppetiteSchedule({
  //       "success": 1,
  //       "message": "Data fetch from Database successful.",
  //       "result": {
  //         "totalData": [
  //           {
  //             "LevelName": "Critical Risk Level",
  //             "RiskLevelCount": 11
  //           },
  //           {
  //             "LevelName": "Low Risk Level",
  //             "RiskLevelCount": 11
  //           },
  //           {
  //             "LevelName": "Moderate Risk Level",
  //             "RiskLevelCount": 11
  //           }
  //         ],
  //         "countMetrics": [
  //           {
  //             "managementCount": 101,
  //             "riskCreditCount": 151,
  //             "retailCount": 11,
  //             "hrAdminCount": 101,
  //             "cororateCount": 151,
  //             "legalGovernanceCount": 11,
  //             "operationSharedServicesCount": 101,
  //             "strategyMarketingCount": 11,
  //             "financeCount": 151,
  //             "auditCount": 11,
  //           }
  //         ],
  //         "totalMajorRisk": [
  //           {
  //             "Risks": null,
  //             "ModerateRiskMetrics": 1,
  //             "CriticalRiskMetrics": 1
  //           },
  //           {
  //             "Risks": "Credit Risk Appetite",
  //             "ModerateRiskMetrics": 1,
  //             "CriticalRiskMetrics": 1
  //           },
  //           {
  //             "Risks": "Enterprise Wide Risk Appetite",
  //             "ModerateRiskMetrics": 1,
  //             "CriticalRiskMetrics": 1
  //           },
  //           // },
  //           {
  //             "Risks": "Leverage (Debt / Equity)",
  //             "ModerateRiskMetrics": 1,
  //             "CriticalRiskMetrics": 1
  //           },
  //           {
  //             "Risks": "SAMA Leverage (Total Exposure/Total Equity)",
  //             "ModerateRiskMetrics": 1,
  //             "CriticalRiskMetrics": 1
  //           },
  //           {
  //             "Risks": "Single Operational Risk Loss due to collateral related incidents",
  //             "ModerateRiskMetrics": 1,
  //             "CriticalRiskMetrics": 1
  //           },
  //           {
  //             "Risks": "Total Exposure LTV of >=87.5 % for Corporate and HNW to total portfolio.",
  //             "ModerateRiskMetrics": 2,
  //             "CriticalRiskMetrics": 2
  //           },
  //           {
  //             "Risks": "Total Large Exposure to total portfolio",
  //             "ModerateRiskMetrics": 1,
  //             "CriticalRiskMetrics": 1
  //           },
  //           {
  //             "Risks": "Total NPL % (non-performing Loans as a % of total Exposure)",
  //             "ModerateRiskMetrics": 2,
  //             "CriticalRiskMetrics": 2
  //           }
  //         ], "totalCritical": [
  //           {
  //             "Quater": "Q2",
  //             "TotalCriticalRiskMetrics": 1550
  //           },
  //           {
  //             "Quater": "Q3",
  //             "TotalCriticalRiskMetrics": 1005
  //           }
  //         ],
  //         "showData": [
  //           {
  //             "No": 1,
  //             "FameworkName": 'test',
  //             "Unit": 1,
  //             "StartDate": '05-02-2023',
  //             "EndDate": '05-02-2023',
  //             "Quater": 'Q1-23',
  //             "Status": 'Scheduled'
  //           },
  //           {
  //             "No": 1,
  //             "FameworkName": 'test',
  //             "Unit": 1,
  //             "StartDate": '05-02-2023',
  //             "EndDate": '05-02-2023',
  //             "Quater": 'Q1-23',
  //             "Status": 'Scheduled'
  //           },
  //           {
  //             "No": 1,
  //             "FameworkName": 'test',
  //             "Unit": 1,
  //             "StartDate": '05-02-2023',
  //             "EndDate": '05-02-2023',
  //             "Quater": 'Q1-23',
  //             "Status": 'Scheduled'
  //           },
  //           {
  //             "No": 1,
  //             "FameworkName": 'test',
  //             "Unit": 1,
  //             "StartDate": '05-02-2023',
  //             "EndDate": '05-02-2023',
  //             "Quater": 'Q1-23',
  //             "Status": 'Scheduled'
  //           },
  //           {
  //             "No": 1,
  //             "FameworkName": 'test',
  //             "Unit": 1,
  //             "StartDate": '05-02-2023',
  //             "EndDate": '05-02-2023',
  //             "Quater": 'Q1-23',
  //             "Status": 'Scheduled'
  //           },
  //           {
  //             "No": 1,
  //             "FameworkName": 'test',
  //             "Unit": 1,
  //             "StartDate": '05-02-2023',
  //             "EndDate": '05-02-2023',
  //             "Quater": 'Q1-23',
  //             "Status": 'Scheduled'
  //           },
  //         ],



  //       },
  //       "error": {
  //         "errorCode": null,
  //         "errorMessage": null
  //       },
  //       "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9"
  //     })
  //   } else {
  //     this.post("/operational-risk-management/dashboard/get-dashboard-risk-appetite", {}).subscribe(res => {
  //       next:
  //       if (res.success == 1) {
  //         this.processRiskAppetiteSchedule(res)
  //       } else {
  //         if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
  //           this.utils.relogin(this._document);
  //         else
  //           this.popupInfo("Unsuccessful", res.error.errorMessage)
  //       }
  //     });
  //   }
  // }


  getDashboardRiskAppetite(): any {
    this.post("/operational-risk-management/dashboard/get-dashboard-risk-appetite", {}).subscribe(res => {
      if (res.success == 1) {
        this.processRiskAppetiteSchedule(res.result);
      } else {
        if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
          this.utils.relogin(this._document);
        else
          this.popupInfo("Unsuccessful", res.error.errorMessage)
      }
    });
  }

  processRiskAppetiteSchedule(response: any): void {
    this.RAMaster = response;
    this.gotRAMaster.next(true);
  }

  getDashboardIncident() {
    if (environment.dummyData) {
      this.processIncidentdata({
        success: 1,
        message: 'Data fetch from DB successful.',
        result: {
          quarterWiseData: [
            {
              Id: 1,
              Quarter: 'Q1-22',
              TotalReported: 1210,
            },
            {
              Id: 2,
              Quarter: 'Q2-21',
              TotalReported: 1014,
            },
            {
              Id: 3,
              Quarter: 'Q3-23',
              TotalReported: 123,
            },
            {
              Id: 4,
              Quarter: 'Q4-22',
              TotalReported: 1.582,
            },
          ],
          criticalitywiseData: [
            {
              Id: 1,
              Status: 'Critical',
              TotalReported: 121,
            },
            {
              Id: 2,
              Status: 'High',
              TotalReported: 101,
            },
            {
              Id: 3,
              Status: 'Medium',
              TotalReported: 123,
            },
          ],
          overallCountData: [
            {
              OpenCount: 25,
              OverdueCount: 10,
              OverduePercentageCount: 30,
            },
          ],
          rejectedRecommendationData: [
            {
              rejectedCount: 25
            },
          ],
          incidentWiseData: [
            {
              id: 1,
              unitNames: "Information Technology",
              totalScore: 387,
              persentage: "20%",
              quarterWise: "position",
              title: "testing 1",
              status: "Remidiation",
              incidentDate: "28 Mar 2023",
              reportingDate: "28 Mar 2023",
              amount: "2,80,000"
            },
            {
              id: 2,
              unitNames: "Credit Administration & Control",
              totalScore: 350,
              persentage: "10%",
              quarterWise: "position",
              title: "testing 1",
              status: "Remidiation",
              incidentDate: "28 Mar 2023",
              reportingDate: "28 Mar 2023",
              amount: "2,80,000"
            },
            {
              id: 3,
              unitNames: "Financial Accountancy",
              totalScore: 254,
              persentage: "5%",
              quarterWise: "position",
              title: "testing 1",
              status: "Remidiation",
              incidentDate: "28 Mar 2023",
              reportingDate: "28 Mar 2023",
              amount: "2,80,000"
            },
          ],
          // identificationCounts
        },
        error: {
          errorCode: null,
          errorMessage: null,
        },
        token: 'GF35R0sw7i5tJG6VN0kLO4TlRnWdn9pLe2RpJYqOcaA',
      });
    } else {
      this.post(
        '/operational-risk-management/dashbaord/incident/get-dashboard-incident',
        {}
      ).subscribe((res) => {
        next: if (res.success == 1) {
          this.processIncidentdata(res);
        } else {
          if (
            res.error.errorCode &&
            res.error.errorCode == 'TOKEN_EXPIRED'
          )
            this.utils.relogin(this._document);
          else this.popupInfo('Unsuccessful', res.error.errorMessage);
        }
      });
    }
  }

  processIncidentdata(response: any): void {
    // console.log("response", response)
    this.master = response.result;
    this.gotMaster.next(true);
  }


  processIncident(response: any): void {
    // console.log("response", response)
    this.dashboardIncMaster = Array.isArray(response) ? response : [];
    this.gotincidentDashboardMaster.next(true);
  }

  getIncidentData(): any {
    this.post("/operational-risk-management/dashbaord/incident/get-dashboard-incident", {}).subscribe(res => {
      if (res.success == 1) {
        this.processIncident(res.result);
      } else {
        if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
          this.utils.relogin(this._document);
        else
          this.popupInfo("Unsuccessful", res.error.errorMessage)
      }
    });
  }

  getOverallDashbardData(year: any): any {
    this.post("/operational-risk-management/dashbaord/overall/get-overall-dashboard", {
      data: {
        Year: year,
      }
    }).subscribe(res => {
      if (res.success == 1) {
        this.processDashboardData(res.result);
      } else {
        if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
          this.utils.relogin(this._document);
        else
          this.popupInfo("Unsuccessful", res.error.errorMessage)
      }
    });
  }

  processDashboardData(response: any): any {
    this.dashboardRCSAMaster = response.RCSA_DATA;
    this.dashboardRAMaster = response.RA_DATA;
    this.dashboardRAColor = response.RA_COLOR_DATA;
    this.dashboardKRIMaster = JSON.stringify(response.KRI_DATA);
    this.dashboardKRIColorMaster = response.KRI_COLOR_DATA;
    this.dashboardINCMaster = response.INCIDENT_DATA;
    this.inAppRCSA = response.RCSAInApp
    this.inAppKRI = response.KRIInApp
    this.inAppRA = response.RAInApp
    this.inAppINC = response.INCInApp
    this.CurrencyType = response.CurrencyType
    this.gotOverallDashboardMaster.next(true);
  }


  getQuarterData(data: any) {
    this.quarterData = data
    this.getYearQuarterData()
  }
  getYearData(data: any) {
    this.yearData = data
    this.getYearQuarterData()
  }

  getYearQuarterData() {
    this.quaterValue = this.quarterData
    this.yearValue = this.yearData
    this.gotYearQuater.next(true);
  }
}
