import { Inject, Injectable } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { UtilsService } from '../../utils/utils.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { DOCUMENT } from '@angular/common';
import { environment } from 'src/environments/environment';
import { RestService } from '../../rest/rest.service';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { addIndex } from 'src/app/includes/utilities/commonFunctions';

export interface CrisisCommsTemplatesList {
  Index: number;
  CommunicationTitle: string;
  Type: string;
  isEdit: boolean;
}

@Injectable({
  providedIn: 'root'
})

export class MasterCrisisService extends RestService {
  public master!: any;
  public TableCrisisCommsTemp!: MatTableDataSource<CrisisCommsTemplatesList>;

  public infoData!: any;

  constructor(
    private utils: UtilsService,
    private _http: HttpClient,
    private _dialog: MatDialog,
    @Inject(DOCUMENT) private _document: any) {
    super(_http, _dialog);
  }

  getCrisisMaster(): void {
    if (environment.dummyData) {
      this.processCrisisCommsTempList({
        "success": 1,
        "message": "Data fetch from DB successful.",
        "result": {
          "CrisisEmailTemplateList": [{
            "EmailTemplateID": 1,
            "EmailTitle": "BCP declaration for incident",
            "EmailContent": "<p><em><strong>Topic</strong></em>: [[communication_title]]</p> <p>&nbsp;</p><p><strong>Dear</strong> [[recipient_name]],</p><p>&nbsp;</p><h3>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</h3><p>&nbsp;</p><p><strong>Click here to see more details</strong> - [[action_link]]</p>",
            "CriticalityID": 1,
            "CriticalityName": "Critical",
            "ActionLinkID": 1,
            "ActionLink": "Link to functional BCP"
          }]

        },
        "error": {
          "errorCode": null,
          "errorMessage": null
        },
        "token": ""
      });
    }
    else {
      this.post("/business-continuity-management/master/crisis-comms/get-crisis-comms-master", {}).subscribe(res => {
        next:
        if (res.success == 1) {
          this.processCrisisCommsTempList(res)
        } else {
          if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
          else
            this.popupInfo("Unsuccessful", res.error.errorMessage)
        }
      });
    }
  }

  processCrisisCommsTempList(response: any): void {
    this.master = response.result;
    this.TableCrisisCommsTemp = new MatTableDataSource(addIndex(this.master.CrisisEmailTemplateList, false));
  }

  deleteThreatLibrary(id: any) {
    return this.post("/business-continuity-management/master/crisis-comms/delete-crisis-comms-master", {
      "data": {
        "emailTemplateID": id,
      },
    });
  }

  getSiteMasterInfo(): void {
    if (environment.dummyData) {
      this.processCrisisCommsTempMasterInfo({
        "success": 1,
        "message": "Data fetch from DB successful.",
        "result": {
          "ActionLinksList": [{									//currently we have only one value for the dropdown later it will be update with multiple values
            "ActionLinkID": 1,
            "ActionLink": "Link to Functional BCP"
          },
          {									//currently we have only one value for the dropdown later it will be update with multiple values
            "ActionLinkID": 2,
            "ActionLink": "Link to Power BCP"
          }],
          "CriticalityList": [
            {
              "CriticalityID": 1,
              "CriticalityName": "Critical"
            },
            {
              "CriticalityID": 2,
              "CriticalityName": "High"
            },
            {
              "CriticalityID": 3,
              "CriticalityName": "Normal"
            },
            {
              "CriticalityID": 4,
              "CriticalityName": "Low"
            }]

        },
        "error": {
          "errorCode": null,
          "errorMessage": null
        },
        "token": ""
      });
    }
    else {
      this.post("/business-continuity-management/master/crisis-comms/get-crisis-comms-master-info", {}).subscribe(res => {
        next:
        if (res.success == 1) {
          this.processCrisisCommsTempMasterInfo(res)
        } else {
          if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
          else
            this.popupInfo("Unsuccessful", res.error.errorMessage)
        }
      });
    }
  }

  processCrisisCommsTempMasterInfo(response: any) {
    this.infoData = response.result;
  }

  addOrUpdateCrisisCommsTemp(TempId: any, crisisTempData: any, mode: any) {
    let data = {
      "emailTemplateID": TempId,
      "emailTemplateName" : crisisTempData.TemplateName,
			"emailTitle": crisisTempData.EmailTitle,
			"emailContent": crisisTempData.EmailContent,             //Need to have datatype NVARCHAR(Max) in DB
			"actionLinkId": crisisTempData.ActionLinkID,
			"criticalityId": crisisTempData.CriticalityID
    }
    return this.post(mode == "Add" ? "/business-continuity-management/master/crisis-comms/add-crisis-comms-master" : "/business-continuity-management/master/crisis-comms/update-crisis-comms-master", { "data": data });
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
}
