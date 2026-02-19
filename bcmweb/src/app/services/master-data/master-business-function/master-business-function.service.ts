import { Inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { RestService } from '../../rest/rest.service';
import { UtilsService } from '../../utils/utils.service';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';

@Injectable({
  providedIn: 'root'
})

export class MasterBusinessFunctionService extends RestService {

  masterBusinessFun!: any;
  BusinessFun!: any;
  public businessFunSubj: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public businessSubj: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private _http: HttpClient,
    private _dialog: MatDialog,
    private utils: UtilsService,
    @Inject(DOCUMENT) private _document: any) {
    super(_http, _dialog);
  }

  getBusinessFunMaster(): void {
    if (environment.dummyData) {
      this.processBusinessFunList({
        "success": 1,
        "message": "Data fetch from DB successful.",
        "result": {
          "businessFunctionList": [{
            "ShortCode": "MM",
            "BusinessFunctionName": "Management",
            "BusinessGroup": "Management",
            "SiteList": "Amlak Head Office",
            "FBCC": "Abdellatif Ismail",
            "HeadCount": 10,
            "BusinessGroupID": 1,
            "SiteID": 1,
            "IsActive": true,
            "FBCC_ID": 1,
          }, {
            "ShortCode": "IT",
            "BusinessFunctionName": "IT",
            "BusinessGroup": "IT",
            "SiteList": "Jeddah Branch Office",
            "FBCC": "Abdellatif Ismail1",
            "HeadCount": 20,
            "BusinessGroupID": 2,
            "SiteID": 2,
            "IsActive": true,
            "FBCC_ID": 2,
          }, {
            "ShortCode": "IT",
            "BusinessFunctionName": "IT",
            "BusinessGroup": "IT",
            "SiteList": "Jeddah Branch Office1",
            "FBCC": "Abdellatif Ismail",
            "HeadCount": 20,
            "BusinessGroupID": 2,
            "SiteID": 3,
            "IsActive": true,
            "FBCC_ID": 2,
          }, {
            "ShortCode": "IT",
            "BusinessFunctionName": "IT",
            "BusinessGroup": "IT",
            "SiteList": "Jeddah Branch Office2",
            "FBCC": "Abdellatif Ismail",
            "HeadCount": 20,
            "BusinessGroupID": 2,
            "SiteID": 4,
            "IsActive": true,
            "FBCC_ID": 2,
          }],
          "groupInfo": [{ "BusinessGroup": "Management", "BusinessGroupID": 1 }, { "BusinessGroup": "IT", "BusinessGroupID": 2 }],
          "siteList": [{ "SiteName": "Amlak Head Office", "SiteID": 1 }, { "SiteName": "Jeddah Branch Office", "SiteID": 2 }, { "SiteName": "Jeddah Branch Office1", "SiteID": 3 }, { "SiteName": "Jeddah Branch Office2", "SiteID": 4 }],
          "FBCCList": [{ "FBCC": "Abdellatif Ismail", "FBCC_ID": 1 }, { "FBCC": "Abdellatif Ismail1", "FBCC_ID": 2 }]
        },
        "error": {
          "errorCode": null,
          "errorMessage": null
        },
        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1Nis"
      })
    }
    else {
      this.post("/bcm/business-function-master/get-business-function-master", {}).subscribe(res => {
        next:
        if (res.success == 1) {
          this.processBusinessFunList(res)
        } else {
          if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
          else
            this.popupInfo("Unsuccessful", res.error.errorMessage)
        }
      });
    }
  }

  getBusinessFunList() {
    if (environment.dummyData) {
      this.processBusinessFun({
        "success": 1,
        "message": "Data fetch from DB successful.",
        "result": {
          "BusinessGroupList": [{ "BusinessGroup": "Management", "BusinessGroupID": 1 }, { "BusinessGroup": "IT", "BusinessGroupID": 2 }],
          "SiteList": [{ "SiteList": "Amlak Head Office", "SiteID": 1 }, { "SiteList": "Jeddah Branch Office", "SiteID": 2 }, { "SiteList": "Jeddah Branch Office1", "SiteID": 3 }, { "SiteList": "Jeddah Branch Office2", "SiteID": 4 }],
          "FBCC_List": [{ "FBCC": "Abdellatif Ismail", "FBCC_ID": 1 }, { "FBCC": "Abdellatif Ismail1", "FBCC_ID": 2 }]
        },
        "error": {
          "errorCode": null,
          "errorMessage": null
        },
        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1Nis"
      })
    }
    else {
      this.post("/bcm/business-function-master/get-business-function-master-info", {}).subscribe(res => {
        next:
        if (res.success == 1) {
          this.processBusinessFun(res)
        } else {
          if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
          else
            this.popupInfo("Unsuccessful", res.error.errorMessage)
        }
      });
    }
  }

  addUpdateBusinessFun(data: any) {
    return this.post("/bcm/business-function-master/add-business-functions-master", {
      "data": {
        "BusinessFunctionsID": data.BusinessFunctionID,
        "FBCCID": data.FBCC_ID,
        "BusinessGroupID": data.BusinessGroupID,
        "ShortCode": data.ShortCode,
        "Name": null,
        "UnitID": data.UnitId,
        "Sites": data.SiteID
      }
    });
  }

  processBusinessFunList(response: any): void {
    this.masterBusinessFun = response.result
    this.businessFunSubj.next(true);
  }

  processBusinessFun(response: any): void {
    this.BusinessFun = response.result
    this.businessSubj.next(true);
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
  }

}
