import { Inject, Injectable } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject } from 'rxjs';
import { UtilsService } from '../utils/utils.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { DOCUMENT } from '@angular/common';
import { RestService } from '../rest/rest.service';
import { environment } from 'src/environments/environment';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { addIndex, formatTimeZone } from 'src/app/includes/utilities/commonFunctions';
import * as saveAs from 'file-saver';
import { ConfirmDialogComponent } from 'src/app/includes/utilities/popups/confirm/confirm-dialog.component';

export interface CrisisCommunicationList {
  Index: number;
  comID: string;
  Title: string;
  Category: string;
  Recipient: string;
  IssueDate: string;
  Attach: string;
  Status: string;
}

@Injectable({
  providedIn: 'root'
})

export class CrisisCommunicationService extends RestService {

  public selectedCrisis$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  // Crisis-Communication-Listing-Page -- declarations
  public isBCManager: boolean = false;
  public isFBCCUser: boolean = false;
  public masterCrisisList!: any;
  public TableCrisisComm!: MatTableDataSource<CrisisCommunicationList>;
  public gotCrisisListMaster$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  // Crisis-Communication-Create-Info -- declarations
  public crisisInfoData!: any;
  public gotMasterCrisiCommDataNInfo$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  // Crisis-Communication-Data -- Declarations - start
  public crisisCommData: any;

  // Crisis-Create-Message(file upload) -- Declarations - start
  public uploadedAttachments: any[] = [];

  constructor(
    private _http: HttpClient,
    private _dialog: MatDialog,
    private utils: UtilsService,
    @Inject(DOCUMENT) private _document: any) {
    super(_http, _dialog);
  }

  // Crisis Communication list -- Methods - start
  getCrisisCommList(): void {
    if (environment.dummyData) {
      this.processCrisisCommList({
        "success": 1,
        "message": "Data fetch from DB successful.",
        "result": {
          "CrisisCommunicationsListDetails": [{
            "CommunicationID": 1,
            "CommunicationCode": 1,
            "CommunicationTitle": "BCP Amlak HO",
            "CrisisCategoryID": "1",
            "CrisisCategory": "Crisis Alerts",
            "CommunicationIssueDate": "2024-01-10T13:23:28.490Z",
            "RecipentOptionID": 2,
            "RecipentOption": "All Business Functions at Specific Site",
            "Sites": [{ "SiteID": 1, "SiteName": "Site Test1" }],
            "BussinessFunctions": [{ "BusinessFunctionsID": 1, "BusinessFunctionsName": "Business test1" }],
            "FBCCsAndFBCTs": [{ "UserGUID": 1, "UserName": "Business test1" }],
            "Attachments": [{ "AttachmentID": 1, "AttachmentName": "dfdfdf", "CreatedDate": "2024-01-10T13:23:28.490Z", "AttachmentType": "pdf", "FileContent": "", "IsVisible": 1 }],
            "IsAttachmentsAvailable": 1,
            "Status": "Draft",
            "StatusID": 1,
            "Incident": "dfdf",
            "IncidentID": 1,
            "EmailTemplateID": 1,
            "EmailTemplateName": "fdfdf"
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
      this.post("/business-continuity-management/crisis-communications/get-crisis-communications-list", {}).subscribe(res => {
        next:
        if (res.success == 1) {
          this.processCrisisCommList(res)
        } else {
          if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
          else
            this.popupInfo("Unsuccessful", res.error.errorMessage)
        }
      });
    }
  }

  processCrisisCommList(response: any): void {
    this.crisisCommData = [];
    // FBCC is nothing but Business Owner
    this.isFBCCUser = response.result.FBCCUsersList.some((user: any) => user.FBCCUserGUID == localStorage.getItem('userguid'));
    this.isBCManager = response.result.BCManagersList.some((user: any) => user.AdminGUID == localStorage.getItem('userguid'));
    this.masterCrisisList = response.result.CrisisCommunicationsListDetails;
    this.masterCrisisList = this.masterCrisisList.map((x: any) => {
      x.FormatedIssueDate = formatTimeZone(x.CommunicationIssueDate) // need to show May 12,2023 HH:MM AM/PM
      return x;
    });
    this.TableCrisisComm = new MatTableDataSource(addIndex((this.masterCrisisList), false));
    this.gotCrisisListMaster$.next(true);
  }
  // Crisis Communication list -- Methods - end

  // Crisis Communication Info -- Methods - start
  getCrisisCommCreateInfo(): void {
    if (environment.dummyData) {
      this.processCrisisCommCreateInfo({
        "success": 1,
        "message": "Data fetch from DB successful.",
        "result": {
          "IncidentsList": [{
            "Incident": "	Fire in Basement",
            "IncidentID": 1
          }, {
            "Incident": "Volcano",
            "IncidentID": 2
          }, {
            "Incident": "Water Crisis",
            "IncidentID": 3
          }],
          "EmailTemplatesList": [{
            "EmailTemplateID": 1,
            "EmailTemplateName": "Return to BAU Declaration for incident",
            "EmailContent": "<p><strong>Return to BAU Declaration for incident content&nbsp;</strong>testing the email content data&nbsp;</p>\n",
          },
          {
            "EmailTemplateID": 2,
            "EmailTemplateName": "New Template Test 1",
            "EmailContent": "<h2 style=\"font-style:italic;\"><strong>Lorem ipsum dolor</strong> <em>sit amet, consectetur adipiscing elit. Maecenas a mi lorem. Donec mollis eros in mollis finibus. Maecenas tempor enim augue, vitae luctus felis sagittis ac. Nunc ut placerat purus, nec mattis ligula. Mauris placerat vehicula risus in maximus. Nulla facilisi. Nulla congue semper egestas. Pellentesque consectetur nisi at sapien placerat, a pulvinar elit ultricies. Phasellus at bibendum tellus. Aliquam et turpis tortor. Maecenas turpis risus, rutrum aliquet laoreet quis, sollicitudin in orci.</em> <strong>Vestibulum vestibulum gravida nulla, quis egestas enim aliquet vel. Aenean eu pharetra magna, in tincidunt diam. Vivamus quis mauris ut erat facilisis vestibulum ut ac arcu.</strong></h2>\n",
          },
          {
            "EmailTemplateID": 3,
            "EmailTemplateName": "fdfdf3",
            "EmailContent": "DFdfdf3",
          }],
          "SitesList":
            [{
              "SiteID": 1,
              "SiteName": "Site Test1"
            },
            {
              "SiteID": 2,
              "SiteName": "Site Test2"
            }],
          "BusinessFunctionsList":
            [{
              "BusinessFunctionsID": 1,
              "BusinessFunctionsName": "Business test1"
            },
            {
              "BusinessFunctionsID": 2,
              "BusinessFunctionsName": "Business test2"
            }],
          "FBCCAndFBCTs":
            [{
              "UserGUID": 1,
              "UserName": "Jami Pavan"
            },
            {
              "UserGUID": 2,
              "UserName": "Shwetha"
            }],
          "CrisisCatergoryList":
            [{
              "CrisisCategoryID": 1,
              "CrisisCategory": "Crisis Alerts1",
            }, {
              "CrisisCategoryID": 2,
              "CrisisCategory": "Crisis Alerts2",
            }],
          "RecipentsOptionList":
            [{
              "RecipentOptionID": 1,
              "RecipentOption": "All Business Functions across Sites"
            },
            {
              "RecipentOptionID": 2,
              "RecipentOption": "All Business Functions at Specific Site"
            },
            {
              "RecipentOptionID": 3,
              "RecipentOption": "Custom list of Business Functions"
            },
            {
              "RecipentOptionID": 4,
              "RecipentOption": "Custom List of Sites"
            },
            {
              "RecipentOptionID": 5,
              "RecipentOption": "Custom list of Recipients"
            }],
          "AttachmentConfiguration": [{
            "FileSize": 10,
            "FileExtensions": ["xlsx", "pdf", "docx", "jpeg", "jpg", "png"]
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
      this.post("/business-continuity-management/crisis-communications/get-create-crisis-message-info", {}).subscribe(res => {
        next:
        if (res.success == 1) {
          this.processCrisisCommCreateInfo(res)
        } else {
          if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
          else
            this.popupInfo("Unsuccessful", res.error.errorMessage)
        }
      });
    }
  }

  processCrisisCommCreateInfo(response: any): void {
    this.crisisInfoData = response.result;
    this.gotMasterCrisiCommDataNInfo$.next(true);
  }
  // Crisis Communication Info -- Methods - end

  // Crisis Communication Data -- Methods - start
  getCrisisCommunicationData(comID: any): void {
    if (environment.dummyData) {
      this.processCrisisCommunicationData({
        "success": 1,
        "message": "Data fetch from DB successful.",
        "result": {
          "CrisisCommunicationsListDetails": [{
            "CommunicationID": 1,
            "CommunicationCode": "391000059160",
            "CommunicationTitle": "BCP Amlak HO",
            "CrisisCategoryID": "1",
            "CrisisCategory": "Crisis Alerts",
            "CommunicationIssueDate": "2024-01-10T13:23:28.490Z",
            "RecipentOptionID": 2,
            "RecipentOption": "All Business Functions at Specific Site",
            "Sites": [{ "SiteID": 1, "SiteName": "Site Test1" }],
            "BussinessFunctions": [{ "BusinessFunctionsID": 1, "BusinessFunctionsName": "Business test1" }],
            "FBCCsAndFBCTs": [{ "UserGUID": 1, "UserName": "Business test1" }],
            "Attachments": [{ "AttachmentID": 1, "AttachmentName": "dfdfdf", "CreatedDate": "2024-01-10T13:23:28.490Z", "AttachmentType": "pdf", "FileContent": "", "IsVisible": 1 }],
            "Status": "Draft",
            "StatusID": 1,
            "Incident": "dfdf",
            "IncidentID": 1,
            "EmailTemplateID": 1,
            "EmailTemplateName": "Return to BAU Declaration for incident",
            "EmailContent": "<p><strong>Return to BAU Declaration for incident content&nbsp;</strong>testing the email content data&nbsp;</p>\n",
          }],
          "MasterList": {
            "IncidentsList": [{
              "Incident": "	Fire in Basement",
              "IncidentID": 1
            }, {
              "Incident": "Volcano",
              "IncidentID": 2
            }, {
              "Incident": "Water Crisis",
              "IncidentID": 3
            }],
            "EmailTemplatesList": [{
              "EmailTemplateID": 1,
              "EmailTemplateName": "Return to BAU Declaration for incident",
              "EmailContent": "<p><strong>Return to BAU Declaration for incident content&nbsp;</strong>testing the email content data&nbsp;</p>\n",
            },
            {
              "EmailTemplateID": 2,
              "EmailTemplateName": "New Template Test 1",
              "EmailContent": "<h2 style=\"font-style:italic;\"><strong>Lorem ipsum dolor</strong> <em>sit amet, consectetur adipiscing elit. Maecenas a mi lorem. Donec mollis eros in mollis finibus. Maecenas tempor enim augue, vitae luctus felis sagittis ac. Nunc ut placerat purus, nec mattis ligula. Mauris placerat vehicula risus in maximus. Nulla facilisi. Nulla congue semper egestas. Pellentesque consectetur nisi at sapien placerat, a pulvinar elit ultricies. Phasellus at bibendum tellus. Aliquam et turpis tortor. Maecenas turpis risus, rutrum aliquet laoreet quis, sollicitudin in orci.</em> <strong>Vestibulum vestibulum gravida nulla, quis egestas enim aliquet vel. Aenean eu pharetra magna, in tincidunt diam. Vivamus quis mauris ut erat facilisis vestibulum ut ac arcu.</strong></h2>\n",
            },
            {
              "EmailTemplateID": 3,
              "EmailTemplateName": "fdfdf3",
              "EmailContent": "DFdfdf3",
            }],
            "SitesList":
              [{
                "SiteID": 1,
                "SiteName": "Site Test1"
              },
              {
                "SiteID": 2,
                "SiteName": "Site Test2"
              }],
            "BusinessFunctionsList":
              [{
                "BusinessFunctionsID": 1,
                "BusinessFunctionsName": "Business test1"
              },
              {
                "BusinessFunctionsID": 2,
                "BusinessFunctionsName": "Business test2"
              }],
            "FBCCAndFBCTs":
              [{
                "UserID": 1,
                "UserGUID": "Business test3"
              },
              {
                "UserID": 2,
                "UserGUID": "Business test4"
              }],
            "CrisisCatergoryList":
              [{
                "CrisisCategoryID": 1,
                "CrisisCategory": "Crisis Alerts1",
              }, {
                "CrisisCategoryID": 2,
                "CrisisCategory": "Crisis Alerts2",
              }],
            "RecipentsOptionList":
              [{
                "RecipentOptionID": 1,
                "RecipentOption": "All Business Functions across Sites"
              },
              {
                "RecipentOptionID": 2,
                "RecipentOption": "All Business Functions at Specific Site"
              },
              {
                "RecipentOptionID": 3,
                "RecipentOption": "Custom list of Business Functions"
              },
              {
                "RecipentOptionID": 4,
                "RecipentOption": "Custom List of Sites"
              },
              {
                "RecipentOptionID": 5,
                "RecipentOption": "Custom list of Recipients"
              }],
            "AttachmentConfiguration": [{
              "FileSize": 10,
              "FileExtensions": ["xlsx", "pdf", "docx", "jpeg", "jpg", "png"]
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
      this.post("/business-continuity-management/crisis-communications/get-crisis-communication-data", { data: { communicationIds: comID } }).subscribe(res => {
        next:
        if (res.success == 1) {
          this.processCrisisCommunicationData(res)
        } else {
          if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
          else
            this.popupInfo("Unsuccessful", res.error.errorMessage)
        }
      });
    }
  }

  // Crisis Message-Creation -- Method - starts
  addUpdateCrisisMessage(mode: any, formData: any, communicationId: any, participantBusiness: any, participantSites: any, participantFBCCsAndFBCTs: any) {
    let participantOptionValue: any = (formData.recipentGroup.recipents == 1) ? null : (formData.recipentGroup.recipents == 2) ? (formData.recipentGroup.specificSiteId).toString() : (formData.recipentGroup.recipents == 3) ? participantBusiness : (formData.recipentGroup.recipents == 4) ? participantSites : participantFBCCsAndFBCTs;
    let data = {
      communicationId: communicationId,
      recipentsData: participantOptionValue,
      templateId: formData.emailTemplateId,
      categoryId: formData.crisisCategoryId,
      communicationTitle: formData.communicationTitle,
      emailTitle: this.crisisInfoData?.EmailTemplatesList.find((ele: any) => ele.EmailTemplateID == formData.emailTemplateId)?.EmailTitle,
      emailContent: formData.customizeEmailContent,
      recipentId: formData.recipentGroup.recipents,
      incidentIds: formData.relatedIncidentId.join(","),
      statusId: this.crisisInfoData?.CrisisStatusList[0].StatusID,
      evidenceIds: (this.uploadedAttachments || []).map((ele: any) => ele.AttachmentID).join(","),
    }
    return this.post(mode == 'Add' ? "/business-continuity-management/crisis-communications/create-crisis-message" : "/business-continuity-management/crisis-communications/update-crisis-message", { "data": data });
  }
  // Crisis Message-Creation -- Methods - end


  processCrisisCommunicationData(response: any): void {
    this.crisisInfoData = response.result.MasterList;
    response.result.CrisisCommunicationsListDetails = response.result.CrisisCommunicationsListDetails.map((x: any) => {
      x.FormatedSites = (x.Sites || []).map((x: any) => x.SiteName).join(', ');
      x.FormatedBusinessFunctions = (x.BussinessFunctions || []).map((x: any) => x.BusinessFunctionsName).join(', ');
      x.FormatedFBCCAndFBCTs = (x.FBCCsAndFBCTs || []).map((x: any) => x.UserName).join(', ');
      return x;
    });
    this.crisisCommData = response.result.CrisisCommunicationsListDetails[0];
    this.gotMasterCrisiCommDataNInfo$.next(true);
  }
  // Crisis Communication Data -- Methods - end

  //Upload Crisis Attachment -- Methods - start
  processUploadCrisisAttachment(response: any): void {
    if (this.uploadedAttachments == null || this.uploadedAttachments == undefined)
      this.uploadedAttachments = [];
    this.uploadedAttachments.push(response?.result?.attachmentDetails[0]);
  }


  deleteUploadCrisisAttachment(id: any) {
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
        this.uploadedAttachments = this.uploadedAttachments.filter((x: any) => x.FileContentID !== id);
      }
    });
  }
  //Upload Crisis Attachment -- Methods - end

  //download Crisis Attachment -- Methods -start
  downloadFile(atchmtId: any) {
    let data = { "attachmentId": atchmtId }
    this.post('/business-continuity-management/crisis-communications/download-crisis-attachment', { data }).subscribe(res => {
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

  // Send Communications -- Method - starts
  SendCommunications(communicationData: any) {
    let data = {
      communicationId: Number(communicationData.CommunicationID),
      statusId: communicationData.StatusID + 1,
    }
    return this.post("/business-continuity-management/crisis-communications/send-crisis-communication", { "data": data });
  }
  // Send Communications -- Methods - end

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

  //Format Attachment Dates

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





