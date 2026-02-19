import { Inject, Injectable } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject } from 'rxjs';
import { UtilsService } from '../utils/utils.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { DOCUMENT } from '@angular/common';
import { environment } from 'src/environments/environment';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { RestService } from '../rest/rest.service';
import { addIndex, dateToString, dateToYMd, formatedDate1 } from 'src/app/includes/utilities/commonFunctions';
import { SubmitReviewComponent } from 'src/app/core-shared/submit-review/submit-review.component';
import * as saveAs from 'file-saver';
import { ConfirmDialogComponent } from 'src/app/includes/utilities/popups/confirm/confirm-dialog.component';

export interface IncidentTableColumns {
  Index: number,
  IncidentID: number,
  IncidentTitle: string,
  IncidentCode: string,
  ReportedDateTime: any,
  Location: any,
  LocationID: number,
  IncidentNature: string,
  IncidentNatureID: number,
  Classification: string,
  ClassificationID: number,
  ActualStatus: string,
  ActualStatusID: number
}

export interface ActionTakenTableColumns {
  Index: number,
  ActionID: any,
  Action: string,
  ActionDateTime: string,
  ActionDateTimeBackEnd: string,
  IsEdit: boolean
}

export interface ActionPlanTableColumns {
  Index: number;
  ActionID: any;
  ActionItem: string;
  StartDate: any;
  TargetDate: string;
  ActionItemOwnerGUID: number;
  ActionItemOwner: string;
}

@Injectable({
  providedIn: 'root'
})

export class IncidentReportService extends RestService {

  // Incident Report List -- Declarations - start
  public isBCManager                : boolean = false;
  public isPowerNSiteBCCNSiteAUser  : boolean = false;
  public masterIncidentList!        : any;
  public incidentListMaster         : any;
  public TableIncident!             : MatTableDataSource<IncidentTableColumns>;
  public gotMasterIncidentList$     : BehaviorSubject<boolean> = new BehaviorSubject(false);

  // Incident Report Info -- Declarations - start
  public incidentInfoData          : any;
  public TableAT!                  : MatTableDataSource<ActionTakenTableColumns>; // AT-Action Taken
  public TableAP!                  : MatTableDataSource<ActionPlanTableColumns>;  // AP-Action Plan

  // Incident Report Data -- Declarations - start
  public incidentReportData               : any;
  public gotMasterIncidentReportDataNInfo$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public incidentUploadedAttachments      : Array<any> = [];

  constructor(
    private utils: UtilsService,
    private _http: HttpClient,
    private _dialog: MatDialog,
    @Inject(DOCUMENT) private _document: any) {
    super(_http, _dialog);
  }

  // Incident list -- Methods - start
  getIncidentList(): void {
    if (environment.dummyData) {
      this.processIncidentList({
        "success": 1,
        "message": "Data fetch from DB successful.",
        "result": {
          "IncidentListDetails": [{
            "IncidentID": 1,
            "IncidentTitle": "Fire in Basement",
            "IncidentCode": "IN23020",
            "ReportedDateTime": "2024-01-10T13:23:28.490Z",
            "Location": "Amlak HO",
            "LocationID": 1,
            "IncidentNature": "Fire Incident",
            "IncidentNatureID": 1,
            "Classification": "Minor",
            "ClassificationID": 1,
			      "ActualStatus": "Ongoing",
            "ActualStatusID": 1
          },
          {
            "IncidentID": 2,
            "IncidentTitle": "Fire in Basement",
            "IncidentCode": "IN23021",
            "ReportedDateTime": "2024-01-11T13:23:28.490Z",
            "Location": "Amlak HO 2",
            "LocationID": 2,
            "IncidentNature": "Fire Incident 2",
            "IncidentNatureID": 2,
            "Classification": "Minor",
            "ClassificationID": 1,
			      "ActualStatus": "Ongoing",
            "ActualStatusID": 1
          }]
        },
        "error": {
          "errorCode": null,
          "errorMessage": null
        },
        "token": ''
      });
    }
    else {
      this.post("/business-continuity-management/incident-reports/get-incidents-report-list", {}).subscribe(res => {
        next:
        if (res.success == 1) {
          this.processIncidentList(res)
        } else {
          if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
          else
            this.popupInfo("Unsuccessful", res.error.errorMessage)
        }
      });
    }
  }

  processIncidentList(response: any): void {
    this.incidentListMaster = response.result;
    this.isPowerNSiteBCCNSiteAUser = response.result.PowerUsersList.some((user: any) => user.PUUserGUID == localStorage.getItem('userguid')) || response.result.SiteBCCUsersList.some((user: any) => user.SiteBCChampionGUID == localStorage.getItem('userguid')) || response.result.SiteAdminUsersList.some((user: any) => user.SAUserGUID == localStorage.getItem('userguid'));
    this.isBCManager = response.result.BCManagersList.some((user: any) => user.AdminGUID == localStorage.getItem('userguid'));
    this.masterIncidentList = response.result.IncidentListDetails;
    this.masterIncidentList = this.masterIncidentList.map((x: any) => {
      x.ConsolidatedReportDate = formatedDate1(x.ReportedDateTime)
      x.FormatedDate = formatedDate1(x.ReportedDateTime) // need to show 12 November, 2023 - 10:45 AM
      return x;
    });
    this.TableIncident = new MatTableDataSource(addIndex((this.masterIncidentList), false));
    this.gotMasterIncidentList$.next(true);
  }


  // Incident list -- Methods - end

  // Incident Create Info -- Methods - start
  getIncidentCreateInfo(): void {
    if (environment.dummyData) {
      this.processIncidentCreateInfo({
        "success": 1,
        "message": "Data fetch from DB successful.",
        "result": {
          // MasterList: {
            "IncidentStatusList": [{
              "ActualStatus": 'Ongoing',
              "ActualStatusID": 1
            }],
            "IncidentNatureList":[{
              "IncidentNature": 'Fire Incident',
              "IncidentNatureID": 1
            }],
            "IncidentSiteLocations":[{    			// list of sites
              "IncidentLocation": 'Amlak DR Center',
              "IncidentLocationID": 1
            },{    			// list of sites
              "IncidentLocation": 'Amlak HO',
              "IncidentLocationID": 2
            },{    			// list of sites
              "IncidentLocation": 'Riyadh',
              "IncidentLocationID": 3
            }],
            "Classifications":[{
              "Classification": 'Major',
              "ClassificationID": 1
            },
            {
              "Classification": 'Moderate',
              "ClassificationID": 2
            },
            {
              "Classification": 'Minor',
              "ClassificationID": 3
            }],
            "ActionItemOwnerList":[{
              "ActionItemOwnerGUID":1,
              "ActionItemOwnerName":"HR"
            },
            {
              "ActionItemOwnerGUID":2,
              "ActionItemOwnerName":"CR"
            }]
        // }
      },
        "error": {
          "errorCode": null,
          "errorMessage": null
        },
        "token": ''
      });
    }
    else {
      this.post("/business-continuity-management/incident-reports/get-create-incident-info", {}).subscribe(res => {
        next:
        if (res.success == 1) {
          this.processIncidentCreateInfo(res)
        } else {
          if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
          else
            this.popupInfo("Unsuccessful", res.error.errorMessage)
        }
      });
    }
  }

  processIncidentCreateInfo(response: any): void {
    this.incidentInfoData = response.result;
    this.gotMasterIncidentReportDataNInfo$.next(true);
  }
  // Incident Create Info -- Methods - end

  // Incident Report Data -- Methods - start
  getIncidentReportData(incident: any): void {
    if (environment.dummyData) {
      this.processIncidentReportData({
        "success": 1,
        "message": "Data fetch from DB successful.",
        "result": {
          IncidentData: [{
            IncidentID: 1,
            IncidentCode: 'IN23020',
            ActualStatus: 'Ongoing',
            ActualStatusID: 1,
            IncidentStartDateTime: '2024-03-22T20:21:34.757Z',
            IncidentEndDateTime: '2024-03-23T20:00:34.757Z',
            IncidentTitle: 'Fire in Basement',
            IncidentNature: 'Fire Incident',
            IncidentNatureID: 1,
            Classification: 'Major',
            ClassificationID: 1,
            IncidentLocation: 'Amlak DR Center',
            IncidentLocationID: 1,
            IncidentDescription: 'lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enimad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
            PostIncidentEvaluationConclusion: '<p>Evaluation added<p>',
            IsReviewer:1,
            IsReviewed:1,
            ActionsTaken: [{
              ActionID: 1,
              Action: 'Employees in basement and 2 floors asked to evacuate',
              ActionDateTime: '2024-01-11T13:23:28.490Z'
            }],
            ActionPlan: [{
              ActionItemID: 1,
              ActionItem: 'Duis aute irure dolor in reprehenderit',
              StartDate: '2024-03-15T10:21:34.757',
              TargetDate: '2024-03-15T10:21:34.757',
              ActionItemOwner: 'HR',
              ActionItemOwnerGUID: 1
            }],
            IncidentReviewComments: [
              {
                  "IncidentCommentID": 11,
                  "CommentBody": "rejected by BC manager 1st risk",
                  "CreatedDate": "2024-03-15T10:21:34.757",
                  "UserGUID": "BFC732F4-68D4-EE11-B0A9-000C296CF4F3",
                  "CommentUserName": "Anjali  Gupta",
                  "IsVisible": true
              },
              {
                  "IncidentCommentID": 15,
                  "CommentBody": "approved  1st risk ",
                  "CreatedDate": "2024-03-15T12:34:32.827",
                  "UserGUID": "BFC732F4-68D4-EE11-B0A9-000C296CF4F3",
                  "CommentUserName": "Anjali  Gupta",
                  "IsVisible": true
              }
            ]
          }],

          // this will be seperate procedure to fetch all master list
          MasterList: {
            IncidentStatusList: [{
              "ActualStatus": 'Ongoing',
              "ActualStatusID": 1
            }],
            IncidentNatureList:[{
              "IncidentNature": 'Fire Incident',
              "IncidentNatureID": 1
            }],
            IncidentSiteLocations:[{    			// list of sites
              "IncidentLocation": 'Amlak DR Center',
              "IncidentLocationID": 1
            }],
            Classifications:[{
              "Classification": 'Major',
              "ClassificationID": 1
            },
            {
              "Classification": 'Moderate',
              "ClassificationID": 2
            },
            {
              "Classification": 'Minor',
              "ClassificationID": 3
            }],
            ActionItemOwnerList:[{
              "ActionItemOwnerGUID":1,
              "ActionItemOwnerName":"fdfdfdf"
            },
            {
              "ActionItemOwnerGUID":2,
              "ActionItemOwnerName":"fdfdff"
            }]
        }
        },
        "error": {
                "errorCode": null,
                "errorMessage": null
            },
            "token": ''
      });
    }
    else {
      this.post("/business-continuity-management/incident-reports/get-incident-report-data", {data: {incidentIds: incident.IncidentID}}).subscribe(res => {
        next:
        if (res.success == 1) {
          this.processIncidentReportData(res)
        } else {
          if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
          else
            this.popupInfo("Unsuccessful", res.error.errorMessage)
        }
      });
    }
  }

  processIncidentReportData(response: any): void {
    this.incidentInfoData    = response.result.MasterList;
    response.result.IncidentData[0].ActionsTaken = response.result.IncidentData[0].ActionsTaken.map((x: any) => {
      let date = x.ActionDateTime;
      x.ActionDateTime = this.getTakenDateFormat(new Date(date));
      x.ActionDateTimeBackEnd = date;
      return x;
    });
    this.incidentReportData  = response.result.IncidentData[0];
    this.incidentUploadedAttachments = [];
    this.incidentUploadedAttachments = JSON.parse(JSON.stringify(response.result.IncidentData[0].IncidentEvidences));
    this.gotMasterIncidentReportDataNInfo$.next(true);
  }
  // Incident Report Data -- Methods - end

  //Upload Incident Attachment -- Methods - start
  processUploadIncidentAttachment(response: any): void {
    if (this.incidentUploadedAttachments == null || this.incidentUploadedAttachments == undefined)
      this.incidentUploadedAttachments = [];
    this.incidentUploadedAttachments.push(response?.result?.attachmentDetails[0]);
  }


  deleteUploadIncidentAttachment(id: any) {
    const confirm = this.dialog.open(ConfirmDialogComponent, {
      id: 'ConfirmDialogComponent',
      disableClose: true,
      minWidth: '300px',
      panelClass: 'dark',
      data: {
        title: 'Confirmation',
        content:
          'Are you sure you want to delete the attachment?',
      },
    });
    confirm.afterClosed().subscribe((result) => {
      if (result) {
        this.incidentUploadedAttachments = this.incidentUploadedAttachments.filter((x: any) => x.FileContentID !== id);
      }
    });
  }
  //Upload Incident Attachment -- Methods - end

  // Created New Incident -- Methods - start
  createNewIncident(incidentData?: any, incidentCode?: any, mode?: any) {
    let ActionTaken  = this.TableAT.data.map((action: any) => ({actionID: action.ActionID, action: action.Action, actionDateTime: this.utils.formatTimeZone(action.ActionDateTimeBackEnd)}))
    let ActionItems  = this.TableAP.data.map((action: any) => ({actionItemID: mode != 'Edit'? null : action.ActionItemID, actionItem: action.ActionItem, startDate: this.utils.formatTimeZone(action.StartDate), targetDate: this.utils.formatTimeZone(action.TargetDate), actionItemOwnerGUID: action.ActionItemOwnerGUID}))

    let data = {
      incidentId                      : mode != 'Edit'? null : this.incidentReportData.IncidentID,
      incidentCode                    : incidentCode,
      incidentStatusId                : mode != 'Edit'? incidentData.incidentStatusId : this.incidentReportData.ActualStatusID,
      incidentStartDate               : this.utils.formatTimeZone(incidentData.incidentStartDate),//attachDateTime(!incidentData.incidentStartDate.includes('T') ? (incidentData.incidentStartDate).toISOString() : incidentData.incidentStartDate, incidentData.incidentStateTime),
      incidentEndDate                 : this.utils.formatTimeZone(incidentData.incidentEndDate),//attachDateTime(!incidentData.incidentEndDate.includes('T') ? (incidentData.incidentEndDate).toISOString() : incidentData.incidentEndDate, incidentData.incidentEndTime),
      incidentStartTime               : incidentData.incidentStateTime,
      incidentEndTime                 : incidentData.incidentEndTime,
      incidentTitle                   : incidentData.incidentTitle,
      incidentNatureId                : incidentData.incidentNatureId.join(','),
      incidentClassificationId        : incidentData.classification,
      incidentLocationId              : incidentData.incidentLocationId.join(','),
      incidentDescription             : incidentData.description,
      postIncidentEvaluationConclusion: incidentData.postIncidentEvaCon,
      actionsTaken                    : ActionTaken,
      actionPlan                      : ActionItems,
      evidenceIds                     : (this.incidentUploadedAttachments || []).map((ele: any) => ele.AttachmentID).join(","),
    }
    return this.post(mode != 'Edit' ? "/business-continuity-management/incident-reports/create-new-incident-report" : "/business-continuity-management/incident-reports/update-incident-report", { "data": data });
  }
  // Created New Incident -- Methods - end

  // (Submit for Review/Review Decision) -- Methods - start
  openSubmitForReview(actionBy: any, incidentData: any) {
    let reviewData: any = {};
    if (actionBy == 'Submit For Review') {
      reviewData = {
        isDecision     : { required: false, isDropdown: { required: false } },
        modalTitle     : `Incident Report - ${incidentData.IncidentTitle} : Submit Response for Review`,
        modalBodyTitle : "Please submit the incident report for review. Once approved, the incident report will be published and the action items will become live.",
        commentLabel   : "Comment",
        buttonLabel    : "Submit",
        getCommentsURL : "/business-continuity-management/incident-reports/get-incident-action-trials",
        commentsPayload: {
          incidentIds: incidentData.IncidentID
        },
        submitReviewURL: "/business-continuity-management/incident-reports/submit-incident-report-for-review",
        payload: {
          incidentId: incidentData.IncidentID,
          statusId  : incidentData.ActualStatusID
        }
      }
    } else if (actionBy == 'Provide Review Decision') {
      reviewData = {
        isDecision: {
          required: true, isDropdown: { required: false },
          optionData: [{ id: 1, value: "Approve and publish incident report", class: "greenRadio" }, { id: 2, value: "Return to submitter with comment", class: "redRadio mt-2" }],
        },
        dropdownLable: "Review Decision",
        modalTitle: "Incident Report",
        modalBodyTitle: "Please provide review decision for this draft incident report. If approved, the report will be published and will be accessible to everyone. If returned, the submitter will receive a notification and will be able to make further changes and submit again.",
        commentLabel: "Decision Justification /",
        buttonLabel: "Submit",
        getCommentsURL: "/business-continuity-management/incident-reports/get-incident-action-trials",
        commentsPayload: {
          incidentIds: incidentData.IncidentID
        },
        submitReviewURL: "/business-continuity-management/incident-reports/review-incident-report",
        payload: {
          incidentId: incidentData.IncidentID,
          statusId  : incidentData.ActualStatusID
        }
      }
    }
    const dialog = this.dialog.open(SubmitReviewComponent, {
      maxWidth: '100vw',
      width: '89.5vw',
      panelClass: ['assessmentList', 'full-screen-modal'],
      data: reviewData
    });
    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.saveSuccess(actionBy == 'Submit For Review'? 'Submitted for Review' : 'Provided Review Decision');
        setTimeout(() => {
          this.dialog.closeAll();
          this.getIncidentList();
        }, 3000)
      }
    });
  }
  // (Submit for Review/Review Decision) -- methods - end

  //download Crisis Attachment -- Methods -start
  downloadFile(atchmtId: any) {
    let data = { "fileContentId": atchmtId }
    this.post('/business-continuity-management/incident-reports/download-incident-evidence', { data }).subscribe(res => {
      if (res.success == 1) {
        const TYPED_ARRAY = new Uint8Array(res.result.attachmentDetails[0].FileContent.data);
        const base64String = window.btoa(new Uint8Array(TYPED_ARRAY).reduce(function (data, byte) {
          return data + String.fromCharCode(byte);
        }, ''));
        const fileMetaType = res.result.attachmentDetails[0].AttachmentType;
        const blobData = this.convertBase64ToBlobData(base64String, fileMetaType);
        const blob = new Blob([blobData], { type: fileMetaType });
        saveAs(blob, res.result.attachmentDetails[0].AttachmentName)
      } else {
        if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
          this.utils.relogin(this._document);
        else
          this.popupInfo("Unsuccessful", res.error.errorMessage);
      }
    });
  }

  convertBase64ToBlobData(base64Data: any, contentType: string) {
    contentType = contentType || '';
    let sliceSize = 1024;
    let byteCharacters = window.atob(decodeURIComponent(base64Data));
    let bytesLength = byteCharacters.length;
    let slicesCount = Math.ceil(bytesLength / sliceSize);
    let byteArrays = new Array(slicesCount);
    for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
      let begin = sliceIndex * sliceSize;
      let end = Math.min(begin + sliceSize, bytesLength);

      let bytes = new Array(end - begin);
      for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
        bytes[i] = byteCharacters[offset].charCodeAt(0);
      }
      byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new Blob(byteArrays, { type: contentType });
  }
  //download Crisis Attachment -- Methods -end

  // common functions below
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

  saveSuccess(content: string): void {
    const timeout = 3000; // 3 Seconds
    const confirm = this.dialog.open(InfoComponent, {
      id: "InfoComponent",
      disableClose: true,
      minWidth: "5vh",
      panelClass: "success",
      data: {
        title: "Success",
        content: content
      }
    });

    confirm.afterOpened().subscribe((result: any) => {
      setTimeout(() => {
        confirm.close();
      }, timeout)
    });
  }

  getTakenDateFormat(dateo: any) {
    const day = dateo.getDate();
    const month = dateo.getMonth() + 1;
    const year = dateo.getFullYear();

    let hours = dateo.getHours();
    const minutes = dateo.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;

    const formattedDate = `${day}/${month}/${year}`;
    const formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;

    return `${formattedDate}, ${formattedTime}`;
  }

  // 2020-09-18T16:28:45.000Z to 18/092020 04:28PM
  dateToStringWithTimeStamp(dateo: String, includeDate = true, includeTime = true, includeAMPM = true, seperator: any = '/') {
    if (dateo) {
      const ary = dateo.split('T');
      const aryd = ary[0].split('-');
      const aryt = ary[1].split('.')[0].split(':');
      let date = "";
      if (includeDate)
        date = aryd[1] + seperator + aryd[2] + seperator + aryd[0];
      if (includeTime) {
        if (date != "")
          date += " ";
        if (includeAMPM) {
          date += this.convertTime(((dateo || '').split('T')[1]).split('.')[0]);
        } else {
          date += aryt[0] + ':' + aryt[1] + ':' + aryt[2];
        }
      }
      return date;
    } else {
      return null;
    }
  }

  convertTime(timeString: any) {
    const [hours, minutes] = timeString.split(':').map(Number);
    const period = hours >= 12 ? 'pm' : 'am';
    const hour12 = (hours % 12) || 12;
    return `${hour12.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
  }
}
