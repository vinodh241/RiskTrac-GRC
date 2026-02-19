import { DOCUMENT, DatePipe } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { UtilsService } from '../utils/utils.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { RestService } from '../rest/rest.service';
import { environment } from 'src/environments/environment';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';

@Injectable({
  providedIn: 'root'
})

export class RemediationTrackerService extends RestService {

  public gotremediationList: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public actionprogSubj: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public gotremediationInfo: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public actionUpdateInfoSubj: BehaviorSubject<boolean> = new BehaviorSubject(false);

  public remediationListObj: any;
  public remediationInfoObj: any;
  public actionprogObj: any;
  public actionUpdateInfoObj: any;

  constructor(private datePipe: DatePipe,
    private utils: UtilsService,
    private _http: HttpClient,
    private _dialog: MatDialog,
    @Inject(DOCUMENT) private _document: any) { super(_http, _dialog); }

  getRemediationListData() {
    if (environment.dummyData) {
      this.processRemediationListData({
        "success": 1,
        "message": "Data fetch from DB successful.",
        "result": {
          "ActionItemsList": [{
            "ActionItemID": 1,
            "ActionItemName": "Review SLA to match with BIAs/RTO ",
            "ActionItemSource": "CS Assessment",
            "ActionItemModule": "Site Risk Assessments",
            "ActionItemOwnerGUID": "",
            "ActionItemOwner": "Jami pavan",
            "StartDate": "",
            "EndDate": "",
            "StatusID": 1,
            "StatusName": "Open",
            "CriticalityID": 1,
            "CriticalityName": "Low",
            "IsBudgetRequired": 1,
            "BudgetedCost": "SAR 100000",
            "Progress": "100%"
          }],
          "ActionItemStatusList": [{
            "ActionItemStatusID": 1,
            "ActionItemStatus": "Unassinged"
          },
          {
            "ActionItemStatusID": 2,
            "ActionItemStatus": "Open"
          },
          {
            "ActionItemStatusID": 3,
            "ActionItemStatus": "Closed"
          },
          {
            "ActionItemStatusID": 4,
            "ActionItemStatus": "Delayed"
          }],
        }
      });
    }
    else {
      this.post("/business-continuity-management/remediation-tracker/get-action-item-List", {}).subscribe(res => {
        next:
        if (res.success == 1) {
          this.processRemediationListData(res)
        } else {
          if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
          else
            this.popupInfo("Unsuccessful", res.error.errorMessage)
        }
      });
    }
  }

  processRemediationListData(res: any) {
    this.remediationListObj = res.result
    this.gotremediationList.next(true)
  }

  getRemediationInfoData() {
    if (environment.dummyData) {
      this.processRemediationInfoData({
        "success": 1,
        "message": "Data fetch from DB successful.",
        "result": {
          "ActionItemModuleList": [{
            "ActionItemModuleID": 1,
            "ActionItemModule": "Site Risk Assessment"
          },
          {
            "ActionItemModuleID": 2,
            "ActionItemModule": "Business Continuity Plans"
          },
          {
            "ActionItemModuleID": 3,
            "ActionItemModule": "Compliance Reviews"
          }],
          "ActionItemSourceList": [{
            "ActionItemModuleID": 1,
            "Sources": [{
              "ActionItemSourceID": 1,
              "ActionItemSource": "Some Test data"
            },
            {
              "ActionItemSourceID": 2,
              "ActionItemSource": "Some new test data"
            }]
          },
          {
            "ActionItemModuleID": 2,
            "Sources": [{
              "ActionItemSourceID": 1,
              "ActionItemSource": "Multiple test data"
            },
            {
              "ActionItemSourceID": 2,
              "ActionItemSource": "Multiple new test data"
            }]
          },
          {
            "ActionItemModuleID": 3,
            "Sources": [{
              "ActionItemSourceID": 1,
              "ActionItemSource": "Any test data"
            },
            {
              "ActionItemSourceID": 2,
              "ActionItemSource": "Any new test data"
            }]
          }],
          "ActionItemOwnerList": [{
            "ActionItemOwnerGUID": "89224892-6BC9-ED11-BB1D-000C29A8F9E1",
            "ActionItemOwner": "mo_bank_22"
          },
          {
            "ActionItemOwnerGUID": "433877BA-CCAA-EE11-B06E-000C296CF4F3",
            "ActionItemOwner": "Jami Pavan"
          }]
        }
      });
    }
    else {
      this.post("/business-continuity-management/remediation-tracker/get-action-item-info", {}).subscribe(res => {
        next:
        if (res.success == 1) {
          this.processRemediationInfoData(res)
        } else {
          if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
          else
            this.popupInfo("Unsuccessful", res.error.errorMessage)
        }
      });
    }
  }

  processRemediationInfoData(res: any) {
    this.remediationInfoObj = res.result
    this.gotremediationInfo.next(true)
  }

  saveActionItem(data: any) {
    return this.post("/business-continuity-management/remediation-tracker/add-update-new-action-item", {
      "data": data
    })
  }

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
      }, timeout)
    });
  }

  // Page 119 start

  getUpdateActionItemInfo() {
    if (environment.dummyData) {
      this.processUpdateActionItemInfo({
        "success": 1,
        "message": "Data fetch from DB successful.",
        "result": {
          "DetailsActionItemsList": [{
            "ActionItemID": 1,
            "ActionItemName": "Review SLA to match with BIAs/RTO ",
            "ActionItemSource": "CS Assessment",
            "ActionItemModule": "Site Risk Assessments",
            "ActionItemOwnerGUID": "",
            "ActionItemOwner": "Jami pavan",
            "StartDate": "2024-04-24T00:00:00.000Z",
            "EndDate": "2024-04-30T00:00:00.000Z",
            "StatusID": 1,
            "StatusName": "Open",
            "CriticalityID": 1,
            "CriticalityName": "Low",
            "IsBudgetRequired": 1,
            "BudgetedCost": "SAR 100000",
          }],
          "ActionItemOwnerList": [{
            "ActionItemOwnerGUID": "0187D64A-1FE4-ED11-BB42-000C29A8F9E1",
            "ActionItemOwner": "mo_bank_23  User 3"
          },
          {
            "ActionItemOwnerGUID": "6EA8FAFB-22E4-ED11-BB42-000C29A8F9E1",
            "ActionItemOwner": "mo_bank_30  "
          }],
          "CriticalityList": [{
            "CriticalityID": 1,
            "CriticalityName": "High"
          },
          {
            "CriticalityID": 2,
            "CriticalityName": "Medium"
          },
          {
            "CriticalityID": 3,
            "CriticalityName": "Low"
          }],
          "BudgetRequiredList": [{
            "IsBudgetRequired": 1,
            "IsBudgetRequiredName": "Yes"
          },
          {
            "IsBudgetRequired": 2,
            "IsBudgetRequiredName": "No"
          }]
        },
        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1",
        "error": {
          "errorCode": null,
          "errorMessage": null
        }
      });
    }
    else {
      this.post("/business-continuity-management/remediation-tracker/get-update-action-item-info", {}).subscribe(res => {
        next:
        if (res.success == 1) {
          this.processUpdateActionItemInfo(res)
        } else {
          if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
          else
            this.popupInfo("Unsuccessful", res.error.errorMessage)
        }
      });
    }
  }

  processUpdateActionItemInfo(res: any) {
    this.actionUpdateInfoObj = res.result
    this.actionUpdateInfoSubj.next(true)
  }

  // Page 119 end

  // Page 120

  getUpdateActionItemProgressInfo(actionItem: any) {
    if (environment.dummyData) {
      this.processActionProgress({
        "success": 1,
        "message": "Data fetch from DB successful.",
        "result": {
          "ActionItemsList": [{
            "ActionItemID": 1,
            "ActionItemName": "Review SLA to match with BIAs/RTO ",
            "ActionItemSource": "CS Assessment",
            "ActionItemModule": "Site Risk Assessments",
            "ActionItemOwnerGUID": "",
            "ActionItemOwner": "Jami pavan",
            "StartDate": "May 12, 2023",
            "EndDate": "May 20, 2023",
            "StatusID": 1,
            "StatusName": "Open",
            "CriticalityID": 1,
            "CriticalityName": "Low",
            "IsBudgetRequired": 1,
            "BudgetedCost": "SAR 100000",
            "Progress": 100,
            "Attachments": [{ "AttachmentID": 1, "AttachmentName": "dfdfdf", "CreatedDate": "2024-01-10T13:23:28.490Z", "AttachmentType": "pdf", "FileContent": "", "IsVisible": 1 }],
          }],
          "UpdateCommentsHistory": [{
            "CommentID": 1,
            "CommentBody": "orem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore",
            "CommentUserName": "Nandan",
            "CreatedDate": "May 12, 2023",
            "IsVisible": 1
          }]
        },
        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1",
        "error": {
          "errorCode": null,
          "errorMessage": null
        }
      });
    }
    else {
      this.post("/business-continuity-management/remediation-tracker/get-action-item-data", {
        data: {
          ActionItemID: actionItem
        }
      }).subscribe(res => {
        next:
        if (res.success == 1) {
          this.processActionProgress(res)
        } else {
          if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
          else
            this.popupInfo("Unsuccessful", res.error.errorMessage)
        }
      });
    }
  }

  processActionProgress(res: any) {
    this.actionprogObj = res.result
    this.actionprogSubj.next(true)
  }

  updateProcessAction(data: any) {
    return this.post(
      '/business-continuity-management/remediation-tracker/save-action-item-details',
      { data: data }
    );
  }

  // Page 120 end

  // page 121 start

  getUploadActionItemAttachment(file: any) {
    return this.upload("/business-continuity-management/remediation-tracker/upload-action-item-attachment", file);
  }

  // page 121 end

  // page 122 start

  updateReqExtension(data: any) {
    return this.post(
      '/business-continuity-management/remediation-tracker/request-action-item-extention',
      { data: data }
    );
  }

  // page 122 end

  downloadFile(data: any) {
    return this.post(
      '/business-continuity-management/remediation-tracker/download-action-item-attachment',
      { data: data }
    );
  }

  deleteFile(data: any) {
    return this.post(
      '/business-continuity-management/remediation-tracker/delete-action-item-attachment',
      { data: data }
    );
  }

}
