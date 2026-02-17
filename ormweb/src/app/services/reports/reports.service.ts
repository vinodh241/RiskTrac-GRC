import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ThisReceiver } from '@angular/compiler';
import { Inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RestService } from '../rest/rest.service';
import { UtilsService } from '../utils/utils.service';

@Injectable({
    providedIn: 'root'
})
export class ReportsService extends RestService {
    public incidents!: any;
    public RCSAResults!: any;
    public KRIResults!: any;
    public KRIResultsNew!: any;
    public RAResults!: any;
    userguid: any;
    public gotIncidents: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public gotRCSA: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public gotKRI: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public gotRA: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public KRIValues: BehaviorSubject<any> = new BehaviorSubject(null);
    public incidentValues: BehaviorSubject<any> = new BehaviorSubject(null);
    public assessmentValues: BehaviorSubject<any> = new BehaviorSubject(null);
    public RCSValues: BehaviorSubject<any> = new BehaviorSubject(null);
    public criticality: BehaviorSubject<any> = new BehaviorSubject([]);
    public incidentStatus: BehaviorSubject<any> = new BehaviorSubject([]);
    public incidentUnits: BehaviorSubject<any> = new BehaviorSubject([]);
    public assesmentUnits: BehaviorSubject<any> = new BehaviorSubject([]);
    public RAResultsUnit: BehaviorSubject<any> = new BehaviorSubject([]);
    public rcsaResultUnit: BehaviorSubject<any> = new BehaviorSubject([]);
    reportFrequencyData: any;
    constructor(
        private utils: UtilsService,
        private _http: HttpClient,
        private _dialog: MatDialog,
        @Inject(DOCUMENT) private _document: any) {
        super(_http, _dialog)
    }
    ngOnInit(): void {
        this.userguid = localStorage.getItem("userguid");
        //this.emailTemplate.userId = this.userguid;
    }

    getIncidentMaster(): void {
        if (environment.dummyData) {
            this.processIncidents({
                result: {
                    IncidentData: [
                        {
                            "IncidentID": "1",
                            "IncidentCode": "INC-23-001",
                            "IncidentTitle": "Title-1",
                            "ReportingDate": "2023-01-02T00:00:00.000Z",
                            "IncidentDate": "2023-01-03T00:00:00.000Z",
                            "IncidentType": "Operational Risk Fraud: Internal or External",
                            "IncidentUnitID": 1,
                            "IncidentUnitName": "Cyber Security",
                            "CriticalityName": "High",
                            "StatusName": "Remediation",
                            "StatusCode": 6,
                            "ReporterGUID": "1382CCB0-5B8B-ED11-AEE5-000C296CF4F3",
                            "IncidentTeam": "INC-03JAN23",
                            "Description": "INC-03JAN23 Desc",
                            "Recommendation": "INC-03JAN23 recomend",
                            "NoOfRecommendationStatus": 3,
                            "Closed": 3,
                            "ClaimClosed": 0,
                            "OpenIncidents": 0
                        },
                        {
                            "IncidentID": "2",
                            "IncidentCode": "INC-23-002",
                            "IncidentTitle": "Title-2",
                            "ReportingDate": null,
                            "IncidentDate": "2023-01-02T00:00:00.000Z",
                            "IncidentType": "Operational Risk Fraud: Internal or External",
                            "IncidentUnitID": 21,
                            "IncidentUnitName": "Corporate Group",
                            "CriticalityName": "High",
                            "StatusName": "Submitted by Reportee",
                            "StatusCode": 2,
                            "ReporterGUID": "AD88C7AD-5A8B-ED11-AEE5-000C296CF4F3",
                            "IncidentTeam": null,
                            "Description": "dsd",
                            "Recommendation": "dsds",
                            "NoOfRecommendationStatus": 13,
                            "Closed": 13,
                            "ClaimClosed": 0,
                            "OpenIncidents": 0
                        }
                    ]
                }
            })
        }
        else {
            this.post("/operational-risk-management/report/get-report-incident", {}).subscribe(res => {
                if (res.success == 1) {
                    this.processIncidents(res);
                } else {
                    if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
                        this.utils.relogin(this._document);
                }
            });
        }
    }
    getKRI() {
        this.post("/operational-risk-management/report/get-report-kri", {}).subscribe(res => {
            if (res.success == 1) {
                this.processKRI(res.result);
            } else {
                if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
                    this.utils.relogin(this._document);
            }
        });
    }
    getRA() {
        if (environment.dummyData) {
            let result = {
                "RiskAppetiteData": [
                    {
                        "FrameWorkName": "test",
                        "StartDate": "2023-05-01T08:30:00.000Z",
                        "EndDate": "2023-05-24T00:00:00.000Z",
                        "Quater": "Q2-23",
                        "Reviewer": "devtest3@secureyesdev.com",
                        "UnitName": "Cyber Security",
                        "PolicyName": "test",
                        "Status": "Approved"
                    },
                    {
                        "FrameWorkName": "test",
                        "StartDate": "2023-05-01T08:30:00.000Z",
                        "EndDate": "2023-05-24T00:00:00.000Z",
                        "Quater": "Q2-23",
                        "Reviewer": "devtest3@secureyesdev.com",
                        "UnitName": "Cyber Security",
                        "PolicyName": "test",
                        "Status": "Approved"
                    },
                    {
                        "FrameWorkName": "test",
                        "StartDate": "2023-05-01T08:30:00.000Z",
                        "EndDate": "2023-05-24T00:00:00.000Z",
                        "Quater": "Q2-23",
                        "Reviewer": "devtest3@secureyesdev.com",
                        "UnitName": "Cyber Security",
                        "PolicyName": "test",
                        "Status": "Approved"
                    }
                ]
            }
            this.processRA(result);
        }
        else {
            this.post("/operational-risk-management/report/get-report-risk-appetite", {}).subscribe(res => {
                if (res.success == 1) {
                    this.processRA(res.result);
                    // console.log("service cal", res.result)
                } else {
                    if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
                        this.utils.relogin(this._document);
                }
            });
        }
    }
    getRCSA() {
        if (environment.dummyData) {
            let result = {
                "RCSAData": [
                    {
                        "Groups": "Operations & Shared Services",
                        "Units": "Operations",
                        "Risk": "Strategic",
                        "Status": "Approved",
                        "InherentRiskRating": "High Risk",
                        "ControlEnvironment": "Partially Effective",
                        "ResidualRiskRating": "Moderate Risk",
                        "SelfComment": "Operations & Shared Services 1--- self cmnts ",
                        "TotalAssessments": 5
                    },
                    {
                        "Groups": "Operations & Shared Services",
                        "Units": "Operations",
                        "Risk": "Strategic",
                        "Status": "Approved",
                        "InherentRiskRating": "High Risk",
                        "ControlEnvironment": "Partially Effective",
                        "ResidualRiskRating": "Moderate Risk",
                        "SelfComment": "test",
                        "TotalAssessments": 5
                    },
                    {
                        "Groups": "Finance & Accounting",
                        "Units": "Accounting & Tax",
                        "Risk": "Financial",
                        "Status": "New",
                        "InherentRiskRating": "High Risk",
                        "ControlEnvironment": "Effective",
                        "ResidualRiskRating": "Moderate Risk",
                        "SelfComment": null,
                        "TotalAssessments": 5
                    }
                ]
            }
            this.processRCSA(result)
        }
        else {
            // let result = this.post("/operational-risk-management/report/get-report-rcsa", {}, false).subscribe((res) => {
            //   this.processRCSA(result)
            // })

            this.post("/operational-risk-management/report/get-report-rcsa", {}).subscribe(res => {
                if (res.success == 1) {
                    this.processRCSA(res.result);
                } else {
                    if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
                        this.utils.relogin(this._document);
                }
            });
        }

    }
    processRCSA(response: any): void {
        this.RCSAResults = response.RCSAData;
        this.rcsaResultUnit = response.RCSA_Units;
        this.gotRCSA.next(true)
    }
    processKRI(response: any): void {
        this.KRIResults = response.KRIData;
        this.KRIResultsNew = JSON.stringify(response.KRIData);
        this.reportFrequencyData = response.reportingFrequencyData ?? [];
        this.gotKRI.next(true)
    }
    processRA(response: any): void {
        this.RAResults = response.RiskAppetiteData;
        this.RAResultsUnit = response.RA_Units;
        this.gotRA.next(true)
    }
    processIncidents(response: any): void {
        this.incidents = response.result
        this.gotIncidents.next(true)
    }
    updatecriticality(result: any) {
        this.criticality.next(result);
    }
    updateIncidentStatus(result: any) {
        this.incidentStatus.next(result);
    }
    updateIncidentDropDowns(result: any) {
        this.incidentUnits.next(result);
    }
    updateAssesmentUnits(result: any) {
        this.assesmentUnits.next(result);
    }


}
