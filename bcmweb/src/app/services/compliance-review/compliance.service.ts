import { DOCUMENT, DatePipe } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UtilsService } from '../utils/utils.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { RestService } from '../rest/rest.service';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ComplianceService extends RestService {

  public allComplainceData: any;
  public allComplainceInfo: any;
  public dashboardObj: any;

  public selectedCompliance: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public gotMasterComplainceData: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public gotMasterComplainceInfo: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public dashboardSubj: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private datePipe: DatePipe,
    private utils: UtilsService,
    private _http: HttpClient,
    private _dialog: MatDialog,
    @Inject(DOCUMENT) private _document: any) {
    super(_http, _dialog);
  }

  //Listing page Complaince Review - Start

  getComplianceListData() {
    if (environment.dummyData) {
      this.processComplainceListData({
        "success": 1,
        "message": "Data fetch from DB successful.",
        "result": {
          "ComplianceReviewsList": [{
            "ComplianceReviewID": 1,
            "ComplianceReviewCode": "CR2300229",
            "ComplianceReviewTitle": "Annual KPI Assessment",
            "ComplianceReviewTypeID": 2,
            "ComplianceReviewType": "KPI Assessment",
            "FrameworkID": 1,
            "Framework": "SAMA BCM",
            "Scope": "Site: Amlak HO",
            "StartDate": "2024-04-15T00:00:00.000Z",
            "EndDate": "2024-04-30T00:00:00.000Z",
            "StatusID": 1,
            "Status": "Scheduled",
            "Progress": "50%",
            "RespondentGUID": "89224892-6BC9-ED11-BB1D-000C29A8F9E1",
            "Respondent": "Nandan ",
            "AuditorGUID": "0DDE8C05-788A-ED11-BAC5-000C29A8F9E1",
            "Auditor": "mo_bank_22  "
          },
          {
            "ComplianceReviewID": 2,
            "ComplianceReviewCode": "CR2300220",
            "ComplianceReviewTitle": "BCP Self-Review for Finance",
            "ComplianceReviewTypeID": 1,
            "ComplianceReviewType": "Standards Compliance",
            "FrameworkID": 1,
            "Framework": "SAMA BCM",
            "Scope": "BF: Finance",
            "StartDate": "2024-04-15T00:00:00.000Z",
            "EndDate": "2024-04-30T00:00:00.000Z",
            "StatusID": 3,
            "Status": "Completed",
            "Progress": "100%",
            "RespondentGUID": "89224892-6BC9-ED11-BB1D-000C29A8F9E1",
            "Respondent": "Nandan ",
            "AuditorGUID": "0DDE8C05-788A-ED11-BAC5-000C29A8F9E1",
            "Auditor": "mo_bank_22  "
          }],
        "token": "",
        "error": {
            "errorCode": null,
            "errorMessage": null
        }
      }
      });
    }
    else {
      this.post("/business-continuity-management/compliance-reviews/get-compliance-reviews-list", {}).subscribe(res => {
        next:
        if (res.success == 1) {
          this.processComplainceListData(res)
        } else {
          if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
          else
            this.popupInfo("Unsuccessful", res.error.errorMessage)
        }
      });
    }
  }

  processComplainceListData(res: any) {
    this.allComplainceData = res.result
    this.gotMasterComplainceData.next(true)
  }

  //Listing page Complaince Review - End

  //New Complaince Review - Start

  getComplianceInfoData() {
    if (environment.dummyData) {
      this.processComplainceInfoData({
        "success": 1,
        "message": "Data fetch from DB successful.",
        "result": {
          "AssessmentTypeList": [{
            "AssessmentTypeID": 1,
            "AssessmentType": "Standard Compliance"
          },
          {
            "AssessmentTypeID": 2,
            "AssessmentType": "KPI Assessment"
          },
          {
            "AssessmentTypeID": 3,
            "AssessmentType": "KRI Assessment"
          }],
          "BusinessFunctionsList": [{
            "BusinessFunctionID": 1,
            "BusinessFunction": "Finance",
            "FBCCGUID": "0DDE8C05-788A-ED11-BAC5-000C29A8F9E1",
            "FBCC": "Nandan",
            "BusinessGroupID": 1,
            "BusinessGroup": "Finance And Accounting"
          },
          {
            "BusinessFunctionID": 2,
            "BusinessFunction": "Legal",
            "FBCCGUID": "0DDE8C05-788A-ED11-BAC5-000C29A8F9E1",
            "FBCC": "Nandan",
            "BusinessGroupID": 2,
            "BusinessGroup": "Legal And Governance"
          },
          {
            "BusinessFunctionID": 3,
            "BusinessFunction": "Remedial",
            "FBCCGUID": "0DDE8C05-788A-ED11-BAC5-000C29A8F9E1",
            "FBCC": "Nandan",
            "BusinessGroupID": 3,
            "BusinessGroup": "Credit And Risk"
          },
          {
            "BusinessFunctionID": 4,
            "BusinessFunction": "Retail Business",
            "FBCCGUID": "0DDE8C05-788A-ED11-BAC5-000C29A8F9E1",
            "FBCC": "Nandan",
            "BusinessGroupID": 4,
            "BusinessGroup": "Operations & Shared Services"
          }],

          "AssessmentReviewerList": [{
            "UserGUID": "89224892-6BC9-ED11-BB1D-000C29A8F9E1",
            "UserName": "Nandan"
          },
          {
            "UserGUID": "0DDE8C05-788A-ED11-BAC5-000C29A8F9E1",
            "UserName": "mo_bank_22"
          }],

          "SiteList": [{
            "SiteID": 1,
            "Site": "Amlak Head Office"
          },
          {
            "SiteID": 2,
            "Site": "Riyadh Branch Office"
          },
          {
            "SiteID": 3,
            "Site": "Jeddah Branch Office"
          }],

          "FrameworkList": [{
            "FrameworkID": 1,
            "FrameworkName": "SAMA BCM Framework"
          },
          {
            "FrameworkID": 2,
            "FrameworkName": "ISO 22301"
          }],

          "FrameworkDomainList": [{
            "FrameworkID": 1,
            "FrameworkName": "SAMA BCM Framework",
            "DomainID": 1,
            "DomainName": "Test Domain 1 for SAMA BCM Framework",
            "FrameworkControlList": [{"ControlID": 1, "ControlName": "Test control 1 for Domain 1 in SAMA BCM Framework"}]
          },
          {
            "FrameworkID": 1,
            "FrameworkName": "SAMA BCM Framework",
            "DomainID": 2,
            "DomainName": "Test Domain 2 for SMA BCM Framework",
            "FrameworkControlList": [{"ControlID":2 , "ControlName": "Test control 1 for Domain 2 for SAMA BCM Framework"}]
          },
          {
            "FrameworkID": 2,
            "FrameworkName": "ISO 22301",
            "DomainID": 1,
            "DomainName": "Test Domain 1 for ISO 22301 Framework",
            "FrameworkControlList": [{"ControlID": 1, "ControlName": "Test control 1 for Domain 1 for ISO 22301 Framework"}]
          }],
          "ObserverList": [{
            "UserGUID": "0DDE8C05-788A-ED11-BAC5-000C29A8F9E1",
            "UserName": "Nandan",
            "BusinessFunction": "Finance",
            "BusinessFunctionID": 1
          },
          {
            "UserGUID": "89224892-6BC9-ED11-BB1D-000C29A8F9E1",
            "UserName": "mo_bank_22",
            "BusinessFunction": "Legal",
            "BusinessFunctionID": 2
          }],

          "AssessmentCode": "CR240001"
        },
      });
    }
    else {
      this.post("/business-continuity-management/compliance-reviews/get-compliance-reviews-info", {}).subscribe(res => {
        next:
        if (res.success == 1) {
          this.processComplainceInfoData(res)
        } else {
          if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
          else
            this.popupInfo("Unsuccessful", res.error.errorMessage)
        }
      });
    }
  }

  processComplainceInfoData(res: any) {
    this.allComplainceInfo = res.result
    this.gotMasterComplainceInfo.next(true)
  }

  //New Complaince Review - End

  //Assessment status BC Mang view page 41 - Start

  getComplianceDashboard() {
    if (environment.dummyData) {
      this.ComplainceDashboardInfo({
        "success": 1,
        "message": "Data fetch from DB successful.",
        "result": {
          "ComplianceReviewOverviewList": [{
            "ComplianceReviewID": 1,
            "ComplianceReviewCode": "CR230001",
            "ComplianceReviewTitle": "BCP Assessment for Amlak HO",
            "Description": "Test Description",
            "StartDate": "2024-04-12",
            "Deadline": "2024-04-15",
            "StatusID": 2,
            "Status": "In-Progress",
            "Observers": [{
              "ObserverGUID": "0DDE8C05-788A-ED11-BAC5-000C29A8F9E1",
              "Observer": "mo_bank_8"
            },
            {
              "ObserverGUID": "89224892-6BC9-ED11-BB1D-000C29A8F9E1",
              "Observer": "Nandan"
            }],
            "ReviewerGUID": "1FD8BAC4-3B8B-ED11-BAC6-000C29A8F9E1",
            "Reviewer": "mo_bank_10",
            "OverAllCompletionPercentage": "13%"
          }],
          "AssessmentStatusList": [{
            "ComplianceReviewID": 1,
            "ComplianceReviewCode": "CR230001",
            "BusinessFunctionID": 1,
            "BusinessFunction": "Credit Administration & Control",
            "ResponseStatusID": 2,
            "ResponseStatus": "In-Progress",
            "RespondentUser": {
              "UserGUID": "0DDE8C05-788A-ED11-BAC5-000C29A8F9E1",
              "User": "mo_bank_8"
            },
            "CompletedPercentage": "50%",
          },
          {
            "ComplianceReviewID": 1,
            "ComplianceReviewCode": "CR230001",
            "BusinessFunctionID": 2,
            "BusinessFunction": "Financial Reporting",
            "ResponseStatusID": 1,
            "ResponseStatus": "Not-Started",
            "RespondentUser": {
              "UserGUID": "89224892-6BC9-ED11-BB1D-000C29A8F9E1",
              "User": "Nandan"
            },
            "CompletedPercentage": "0%",
          }],
          "WorkFlowAction": [{
            "NextAction": "Submit responses for review",
            "NextActionBy": "mo_bank_8"
          }],
        "token": "",
        "error": {
            "errorCode": null,
            "errorMessage": null
        }
      }
      });
    }
    else {
      this.post("/business-continuity-management/compliance-reviews/get-compliance-reviews-list", {}).subscribe(res => {
        next:
        if (res.success == 1) {
          this.ComplainceDashboardInfo(res)
        } else {
          if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
          else
            this.popupInfo("Unsuccessful", res.error.errorMessage)
        }
      });
    }
  }

  ComplainceDashboardInfo(res: any) {
    this.dashboardObj = res.result
    this.dashboardSubj.next(true)
  }

  //Assessment status BC Mang view page 41 - End

  popupInfo(title: string, message: string) {
    const timeout = 3000; // 3 seconds
    const confirm = this._dialog.open(InfoComponent, {
      disableClose: true,
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
}
