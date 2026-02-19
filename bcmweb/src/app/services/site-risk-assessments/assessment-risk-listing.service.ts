import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UtilsService } from '../utils/utils.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { DOCUMENT, DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { MatTableDataSource } from '@angular/material/table';
import { RestService } from '../rest/rest.service';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { addIndex, dateToYMd } from 'src/app/includes/utilities/commonFunctions';
import * as XLSX from 'xlsx-js-style';
import * as saveAs from 'file-saver';
import { ConfirmDialogComponent } from 'src/app/includes/utilities/popups/confirm/confirm-dialog.component';

export interface currentControlsList {
  Index: number;
  ThreatLibraryControlsID: any;
  Description: string;
  isEdit: boolean;
}

export interface actionPlanList {
  Index: number;
  actionID: any;
  actionItem: string;
  startDate: any;
  targetDate: string;
  actionItemOwnerID: number;
  actionItemOwner: string;
}

export interface consolidateList {
  Index: number;
  SiteName: string;
  AssessmentName: string;
  BCSiteChampionName: string;
  StartDate: any;
  EndDate: any;
}

@Injectable({
  providedIn: 'root'
})

export class AssessmentRiskListing extends RestService {
  public selectedSiteAssessment: BehaviorSubject<string> = new BehaviorSubject<string>('');

  // Update-risk - Declarations - start
  public currentThreatRiskID: any;
  public currentScheduleRiskID: any;
  public riskMasterList: any;
  public selectedRiskData: any;
  public TableAP!: MatTableDataSource<actionPlanList>;
  public TableCC!: MatTableDataSource<currentControlsList>;
  public gotMasterRiskInfoData: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public riskUploadedAttachments: any[] = [];
  // Update-risk - Declarations - end

  //Listing page declaration
  public allRiskData: any;
  public masterData: any
  public gotMasterSiteData: BehaviorSubject<boolean> = new BehaviorSubject(false)
  public gotInfoMaster: BehaviorSubject<boolean> = new BehaviorSubject(false)

  // Assessment Risk List
  public riskList: any;
  public gotRiskListSubj: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public revcomment: any;
  public gotReviewSubj: BehaviorSubject<boolean> = new BehaviorSubject(false);

  // Consolidated Risks - start
  public TableConsolidated!: MatTableDataSource<consolidateList>;
  public consolidatedMaster: any;
  public FormatedReportData: any[] = [];
  public FormatedReportHeader: any[] = [];
  public gotConsolidatedReport: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public gotDraftReport: BehaviorSubject<boolean> = new BehaviorSubject(false);
  // Consolidated Risks - end

  constructor(
    private datePipe: DatePipe,
    private utils: UtilsService,
    private _http: HttpClient,
    private _dialog: MatDialog,
    @Inject(DOCUMENT) private _document: any) {
    super(_http, _dialog);
  }

  // Update-risk - Methods - start

  getRiskData(scheduleRiskAssessmentId: any, threatRiskID: any) {
    if (environment.dummyData) {
      this.processRiskData({
        "success": 1,
        "message": "Data fetch from DB successful.",
        "result": {
          "RiskData": [{
            "SiteRiskAssessmentID": 1,
            "AssessmentName": "test",
            "AssessmentCode": "XYS",
            "SiteID": 1,
            "SiteName": "test",
            "ShortCode": "FDF",
            "StartDate": "",
            "EndDate": "",
            "ThreatRiskID": 3,
            "RiskTitle": "test risk",
            "RiskDescription": "test risk description",
            "Controls": "[{\"ThreatLibraryControlsID\":1,\"Description\":\"test control1\"},{\"ThreatLibraryControlsID\":2,\"Description\":\"test control2\"}]",
            "ThreatCategoryID": 1,
            "ThreatCategory": "Category1",
            "RiskImpact": "[{\"ImpactID\":1,\"ImpactID\":\"Confidentiality\"}]",
            "RiskOwnerID": "C83496D1-4267-EE11-B013-000C296CF4F3",
            "RiskOwner": "Sinchana  Raj",
            "BCSiteChampionName": "gjjh",
            "ExistingControls": 0,
            "ControlEffectivenessID": 1,
            "ControlEffectiveness": "High",
            "RiskTreatmentStrategyID": 1,
            "RiskTreatmentStrategyName": "Treat",
            "OverallResidualRiskRatingID": 1,
            "OverallResidualRiskRating": "High",
            "OverallInherentRiskRatingID": 1,
            "OverallInherentRiskRating": "High",
            "InherentLikelihoodRatingID": 1,
            "InherentLikelihoodRating": "High",
            "InherentImpactRatingID": 1,
            "InherentImpactRating": "Major",
            "ResidualLikelihoodRatingID": 1,
            "ResidualLikelihoodRating": "High",
            "ResidualImpactRatingID": 1,
            "ResidualImpactRating": "Major",
            "IsRiskOwner": 1,
            "IsReviewer": 0,
            "ResidualRiskDescription": "dfdfdf",
            "TolerateDescription": "fdfdf",
            "ActionPlans": [{ "actionID": 1, "actionItem": "fdff", "startDate": "", "targetDate": "2024-01-10T13:23:28.490Z", "actionItemOwnerID": 1, "actionItemOwner": "dfddfd" }]
          }],
          "MasterList":											//please provide this masters in different procedure ,API will be this.
          {
            "ResidualLikelihoodMasterList":
              [{
                "ResidualLikelihoodRatingID": 1,
                "ResidualLikelihoodRating": "High"
              },
              {
                "ResidualLikelihoodRatingID": 2,
                "ResidualLikelihoodRating": "Medium"
              },
              {
                "ResidualLikelihoodRatingID": 3,
                "ResidualLikelihoodRating": "Low"
              }],
            "ResidualImpactMasterList":
              [{
                "ResidualImpactRatingID": 1,
                "ResidualImpactRating": "Major"
              },
              {
                "ResidualImpactRatingID": 2,
                "ResidualImpactRating": "Moderate"
              },
              {
                "ResidualImpactRatingID": 3,
                "ResidualImpactRating": "Minor"
              }],
            "InherentLikelihoodMasterList":
              [{
                "InherentLikelihoodRatingID": 1,
                "InherentLikelihoodRating": "High"
              },
              {
                "InherentLikelihoodRatingID": 2,
                "InherentLikelihoodRating": "Medium"
              },
              {
                "InherentLikelihoodRatingID": 3,
                "InherentLikelihoodRating": "Low"
              }],
            "InherentImpactMasterList":
              [{
                "InherentImpactRatingID": 1,
                "InherentImpactRating": "Major"
              },
              {
                "InherentImpactRatingID": 2,
                "InherentImpactRating": "Moderate"
              },
              {
                "InherentImpactRatingID": 3,
                "InherentImpactRating": "Minor"
              }],
            "CurrentControlEffectivenessList":
              [{
                "ControlEffectivenessID": 1,
                "ControlEffectiveness": "High"
              },
              {
                "ControlEffectivenessID": 2,
                "ControlEffectiveness": "Medium"
              },
              {
                "ControlEffectivenessID": 3,
                "ControlEffectiveness": "Low"
              }],
            "RiskTreatmentStrategyList":
              [{
                "RiskTreatmentStrategyID": 1,
                "RiskTreatmentStrategyName": "Treat"
              },
              {
                "RiskTreatmentStrategyID": 2,
                "RiskTreatmentStrategyName": "Tolerate"
              }],
            "ThreatCategoryList":
              [{
                "ThreatCategoryID": 1,
                "ThreatCategory": "ThreatCategory1"
              },
              {
                "ThreatCategoryID": 2,
                "ThreatCategory": "ThreatCategory2"
              }],
            "ThreatImpactMaster": [{
              "ThreatImpactID": 1,
              "ThreatImpact": "Confidentiality",
              "ThreatImpactCode": "C",
            },
            {
              "ThreatImpactID": 2,
              "ThreatImpact": "Integrity",
              "ThreatImpactCode": "I",
            },
            {
              "ThreatImpactID": 3,
              "ThreatImpact": "Availability",
              "ThreatImpactCode": "A",
            }],
            "ActionItemOwnerList":
              [{
                "ActionItemOwnerID": 1,
                "ActionItemOwnerName": "fdfdfdf"
              },
              {
                "ActionItemOwnerID": 2,
                "ActionItemOwnerName": "fdfdff"
              }]
          }

        },
        "error": {
          "errorCode": null,
          "errorMessage": null
        },
        "token": ""
      });
    }
    else {
      this.post("/business-continuity-management/site-risk-assessments/get-risk-data", { data: { siteRiskAssessmentId: Number(this.selectedSiteAssessment.value), scheduleRiskAssessmentId: Number(scheduleRiskAssessmentId), threatRiskId: Number(threatRiskID) } }).subscribe(res => {
        next:
        if (res.success == 1) {
          this.processRiskData(res)
        } else {
          if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
          else
            this.popupInfo("Unsuccessful", res.error.errorMessage)
        }
      });
    }
  }

  calculateRiskRatings(id?: any) {
    // Calculate Inherent Risk Rating (formula-based: Likelihood x Impact)
    if (this.selectedRiskData.InherentLikelihoodRatingID && this.selectedRiskData.InherentImpactRatingID && id == 1) {
      let payload = {
        "riskRatingType": 1,				            //Inherent == 1
        "inherentLikelihoodRatingId": this.selectedRiskData.InherentLikelihoodRatingID,
        "inherentImpactRatingId": this.selectedRiskData.InherentImpactRatingID,
        "siteRiskAssessmentId": Number(this.selectedRiskData.SiteRiskAssessmentID)
      }
      let res = this.post("/business-continuity-management/site-risk-assessments/get-overall-risk-rating", { "data": payload });
      res.subscribe((res: any) => {
        let Overall = res.result.OverAllRiskRating[0];
        this.selectedRiskData['OverallInherentRiskRating'] = Overall.OverallInherentRiskRating;
        this.selectedRiskData['OverallInherentRiskRatingID'] = Overall.OverallInherentRiskRatingID;
        // After inherent risk is calculated, attempt to derive residual risk from matrix
        this.calculateResidualRiskFromMatrix();
      });
    }

    // If control effectiveness changed (id == 3), trigger matrix-based residual risk recalculation
    if (id == 3) {
      this.calculateResidualRiskFromMatrix();
    }
  }

  /**
   * Matrix-based Residual Risk Derivation
   * Derives OverallResidualRiskRating from: OverallInherentRiskRating + ControlEffectiveness
   * Aligns with ORM RCSA approach using BCM.SRA_ResidualRiskMatrix lookup table
   */
  calculateResidualRiskFromMatrix() {
    if (this.selectedRiskData.OverallInherentRiskRatingID && this.selectedRiskData.ControlEffectivenessID) {
      let payload = {
        "riskRatingType": 3,                          // Matrix-based Residual Risk == 3
        "overallInherentRiskRatingId": this.selectedRiskData.OverallInherentRiskRatingID,
        "controlEffectivenessId": this.selectedRiskData.ControlEffectivenessID,
        "siteRiskAssessmentId": Number(this.selectedRiskData.SiteRiskAssessmentID)
      }
      let res = this.post("/business-continuity-management/site-risk-assessments/get-overall-risk-rating", { "data": payload });
      res.subscribe((res: any) => {
        if (res.success == 1 && res.result?.OverAllRiskRating?.length > 0) {
          let Overall = res.result.OverAllRiskRating[0];
          this.selectedRiskData['OverallResidualRiskRating'] = Overall.OverallResidualRiskRating;
          this.selectedRiskData['OverallResidualRiskRatingID'] = Overall.OverallResidualRiskRatingID;
        } else {
          // Clear residual risk if matrix lookup fails
          this.selectedRiskData['OverallResidualRiskRating'] = null;
          this.selectedRiskData['OverallResidualRiskRatingID'] = null;
        }
      });
    } else {
      // Clear residual risk if inputs are incomplete
      this.selectedRiskData['OverallResidualRiskRating'] = null;
      this.selectedRiskData['OverallResidualRiskRatingID'] = null;
    }
  }

  processRiskData(response: any) {
    this.riskMasterList = response.result.MasterList;
    this.selectedRiskData = response.result.RiskData[0];
    this.selectedRiskData.ResidualRiskDescription = !!this.selectedRiskData.ResidualRiskDescription ? this.selectedRiskData.ResidualRiskDescription : '';
    this.selectedRiskData.Controls = (!!this.selectedRiskData.Controls && (this.selectedRiskData.Controls?.length > 0)) ? JSON.parse(this.selectedRiskData.Controls) : [];
    this.selectedRiskData.ActionPlans = (!!this.selectedRiskData.ActionPlans && (this.selectedRiskData.ActionPlans?.length > 0)) ? JSON.parse(this.selectedRiskData.ActionPlans) : [];
    this.selectedRiskData.RiskImpact = JSON.parse(this.selectedRiskData.RiskImpact).sort((a: any, b: any) => a.ImpactID - b.ImpactID) || [];
    this.TableCC = new MatTableDataSource(addIndex(this.selectedRiskData.Controls, true));
    this.TableAP = new MatTableDataSource(addIndex(this.selectedRiskData.ActionPlans, true));
    this.riskUploadedAttachments = [];
    this.riskUploadedAttachments = JSON.parse(JSON.stringify(response.result.RiskData[0].RiskEvidences));
    this.gotMasterRiskInfoData.next(true)
  }

  saveRisk(riskdata: any, actionItems: any, tolerateData: any, controlsData: any) {
    let ActionItems  = actionItems.map((action: any) => ({actionID: action.actionID, actionItem: action.actionItem, startDate: this.utils.formatTimeZone(action.startDate), targetDate: this.utils.formatTimeZone(action.targetDate), actionItemOwnerID: action.actionItemOwnerID, scheduleRiskAssessmentID: Number(this.selectedRiskData.ScheduleRiskAssessmentID) }))
    let Controls     = controlsData.map((control: any) => ({ControlID: control.ThreatLibraryControlsID, Control: control.Description }))

    let data = {
      scheduleRiskAssessmentId    :    Number(riskdata.ScheduleRiskAssessmentID),
      threatRiskId                :    Number(riskdata.ThreatRiskID),
      siteRiskAssessmentId        :    this.selectedSiteAssessment.value,
      controlEffectivenessId      :    riskdata.ControlEffectivenessID,
      inherentLikelihoodRatingId  :    riskdata.InherentLikelihoodRatingID,
      inherentImpactRatingId      :    riskdata.InherentImpactRatingID,
      residualLikelihoodRatingId  :    riskdata.ResidualLikelihoodRatingID || null,   // Optional: now derived from matrix
      residualImpactRatingId      :    riskdata.ResidualImpactRatingID || null,       // Optional: now derived from matrix
      overallResidualRiskRatingId :    riskdata.OverallResidualRiskRatingID,          // System-derived from matrix
      overallInherentRiskRatingId :    riskdata.OverallInherentRiskRatingID,
      riskRatingComment           :    riskdata.ResidualRiskDescription,
      riskTreatmentStrategyId     :    riskdata.RiskTreatmentStrategyID,
      actionPlans                 :    (riskdata.RiskTreatmentStrategyID == 1) ? ActionItems  : [],    //if strategyId=1 else empty array
      riskTolerateDescription     :    (riskdata.RiskTreatmentStrategyID == 2) ? tolerateData : null,  //if strategyIdId = 2 else null
      controls                    :    Controls,	//need to be inserted for particular risk and site
      evidenceIds                 :    (this.riskUploadedAttachments || []).map((ele: any) => ele.AttachmentID).join(","),
    }
    return this.post("/business-continuity-management/site-risk-assessments/save-risk-response", { "data": data });
  }

  bcmReview(data: any) {
    return this.post("/business-continuity-management/site-risk-assessments/review-risk-response", {
      "data": {
        "siteId": Number(data.siteId),
        "scheduleRiskAssessmentID": Number(data.scheduledRiskAssessmentId),
        "siteRiskAssessmentId": Number(data.siteRiskAssessmentId),
        "reviewStatus": Number(data.reviewStatus),
        "riskReviewComment": data.comments
      }
    });
  }

  //Upload Crisis Attachment -- Methods - start
  processUploadSRAAttachment(response: any): void {
    if (this.riskUploadedAttachments == null || this.riskUploadedAttachments == undefined)
      this.riskUploadedAttachments = [];
    this.riskUploadedAttachments.push(response?.result?.attachmentDetails[0]);
  }


  deleteUploadSRAAttachment(id: any) {
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
        this.riskUploadedAttachments = this.riskUploadedAttachments.filter((x: any) => x.FileContentID !== id);
      }
    });
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
  //Upload Crisis Attachment -- Methods - end

  //download SRA Attachment -- Methods -start
  downloadFile(atchmtId: any) {
    let data = { "fileContentId": atchmtId }
    this.post('/business-continuity-management/site-risk-assessments/download-risk-evidence', { data }).subscribe((res: any) => {
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
  //download SRA Attachment -- Methods -end

  // Update-risk - Methods - end

  //Listing page site risk assessment - start

  getSiteListData() {
    if (environment.dummyData) {
      this.processSiteListData({
        "success": 1,
        "message": "Data fetch from DB successful.",
        "result": {
          "SiteRiskAssessments": [
            {
              "SiteRiskAssessmentID": 4,
              "SiteID": 10010,
              "ShortCode": "RBO",
              "SiteName": "Riyadh Branch Office Updated",
              "AssessmentName": "Riyadh Branch Office Updated-SRA-01",
              "AssessmentCode": "RBO-SRA-01",
              "StartDate": "2024-07-12T00:00:00.000Z",
              "EndDate": "2024-07-30T00:00:00.000Z",
              "StatusID": 2,
              "Status": "InProgress",
              "BCSiteChampionID": "BB47EB6A-178C-ED11-BAC7-000C29A8F9E1",
              "BCSiteChampionName": "mo_bank_16  ",
              "ReviewerID": "6EA8FAFB-22E4-ED11-BB42-000C29A8F9E1",
              "ReviewerName": "BC Manager user",
              "OverallCompletionPercentage": "0%",
              "ThreatCategories": "[{\"ThreatCategoryID\":14,\"ThreatCategory\":\"Information Security Controls\"}]",
              "AssessmentData": "[{\"SiteRiskAssessmentID\":4,\"ReviewerID\":\"6EA8FAFB-22E4-ED11-BB42-000C29A8F9E1\",\"SchdeduleRiskAssessment\":[{\"ScheduleRiskAssessmentID\":13,\"ThreatRiskID\":10022,\"RiskOwnerID\":\"71B7F09A-758A-ED11-BAC5-000C29A8F9E1\"},{\"ScheduleRiskAssessmentID\":14,\"ThreatRiskID\":50030,\"RiskOwnerID\":\"C75F5011-BF68-EE11-BBF5-000C29A8F9E1\"},{\"ScheduleRiskAssessmentID\":15,\"ThreatRiskID\":60032,\"RiskOwnerID\":\"2091ADC8-C068-EE11-BBF5-000C29A8F9E1\"},{\"ScheduleRiskAssessmentID\":16,\"ThreatRiskID\":60033,\"RiskOwnerID\":\"71B7F09A-758A-ED11-BAC5-000C29A8F9E1\"},{\"ScheduleRiskAssessmentID\":17,\"ThreatRiskID\":60034,\"RiskOwnerID\":\"72B7F09A-758A-ED11-BAC5-000C29A8F9E1\"}]}]",
              "IsRiskOwner": 0,
              "IsReviewer": 0,
              "RiskOwnerIDs": [
                "71B7F09A-758A-ED11-BAC5-000C29A8F9E1",
                "C75F5011-BF68-EE11-BBF5-000C29A8F9E1",
                "2091ADC8-C068-EE11-BBF5-000C29A8F9E1",
                "72B7F09A-758A-ED11-BAC5-000C29A8F9E1"
              ]
            },
            {
              "SiteRiskAssessmentID": 3,
              "SiteID": 140034,
              "ShortCode": "SEO",
              "SiteName": "Secureyes Office",
              "AssessmentName": "Secureyes Office-SRA-03",
              "AssessmentCode": "SEO-SRA-03",
              "StartDate": "2024-07-11T00:00:00.000Z",
              "EndDate": "2024-07-30T00:00:00.000Z",
              "StatusID": 3,
              "Status": "Published",
              "BCSiteChampionID": "6139E61B-EFAD-EE11-BC50-000C29A8F9E1",
              "BCSiteChampionName": "mo_bank_24_AUTO  Test Observer",
              "ReviewerID": "87BEB379-EFAD-EE11-BC50-000C29A8F9E1",
              "ReviewerName": "mo_bank_26 AUTO BCManager",
              "OverallCompletionPercentage": "100%",
              "ThreatCategories": "[{\"ThreatCategoryID\":4015,\"ThreatCategory\":\"Trojan Threat\"},{\"ThreatCategoryID\":6018,\"ThreatCategory\":\"spyware\"},{\"ThreatCategoryID\":7017,\"ThreatCategory\":\"Backdoor attacks\"}]",
              "AssessmentData": "[{\"SiteRiskAssessmentID\":3,\"ReviewerID\":\"87BEB379-EFAD-EE11-BC50-000C29A8F9E1\",\"SchdeduleRiskAssessment\":[{\"ScheduleRiskAssessmentID\":9,\"ThreatRiskID\":60030,\"RiskOwnerID\":\"5BEB0CD6-844C-EE11-BBCD-000C29A8F9E1\"},{\"ScheduleRiskAssessmentID\":10,\"ThreatRiskID\":60035,\"RiskOwnerID\":\"5BEB0CD6-844C-EE11-BBCD-000C29A8F9E1\"},{\"ScheduleRiskAssessmentID\":11,\"ThreatRiskID\":80054,\"RiskOwnerID\":\"5BEB0CD6-844C-EE11-BBCD-000C29A8F9E1\"},{\"ScheduleRiskAssessmentID\":12,\"ThreatRiskID\":3,\"RiskOwnerID\":\"5BEB0CD6-844C-EE11-BBCD-000C29A8F9E1\"}]}]",
              "IsRiskOwner": 0,
              "IsReviewer": 0,
              "RiskOwnerIDs": [
                "5BEB0CD6-844C-EE11-BBCD-000C29A8F9E1"
              ]
            },
            {
              "SiteRiskAssessmentID": 2,
              "SiteID": 140034,
              "ShortCode": "SEO",
              "SiteName": "Secureyes Office",
              "AssessmentName": "Secureyes Office-SRA-02",
              "AssessmentCode": "SEO-SRA-02",
              "StartDate": "2024-07-11T00:00:00.000Z",
              "EndDate": "2024-07-30T00:00:00.000Z",
              "StatusID": 3,
              "Status": "Published",
              "BCSiteChampionID": "6139E61B-EFAD-EE11-BC50-000C29A8F9E1",
              "BCSiteChampionName": "mo_bank_24_AUTO  Test Observer",
              "ReviewerID": "87BEB379-EFAD-EE11-BC50-000C29A8F9E1",
              "ReviewerName": "mo_bank_26 AUTO BCManager",
              "OverallCompletionPercentage": "100%",
              "ThreatCategories": "[{\"ThreatCategoryID\":4015,\"ThreatCategory\":\"Trojan Threat\"},{\"ThreatCategoryID\":6018,\"ThreatCategory\":\"spyware\"},{\"ThreatCategoryID\":7017,\"ThreatCategory\":\"Backdoor attacks\"}]",
              "AssessmentData": "[{\"SiteRiskAssessmentID\":2,\"ReviewerID\":\"87BEB379-EFAD-EE11-BC50-000C29A8F9E1\",\"SchdeduleRiskAssessment\":[{\"ScheduleRiskAssessmentID\":5,\"ThreatRiskID\":60030,\"RiskOwnerID\":\"5BEB0CD6-844C-EE11-BBCD-000C29A8F9E1\"},{\"ScheduleRiskAssessmentID\":6,\"ThreatRiskID\":60035,\"RiskOwnerID\":\"5BEB0CD6-844C-EE11-BBCD-000C29A8F9E1\"},{\"ScheduleRiskAssessmentID\":7,\"ThreatRiskID\":80054,\"RiskOwnerID\":\"5BEB0CD6-844C-EE11-BBCD-000C29A8F9E1\"},{\"ScheduleRiskAssessmentID\":8,\"ThreatRiskID\":2,\"RiskOwnerID\":\"5BEB0CD6-844C-EE11-BBCD-000C29A8F9E1\"}]}]",
              "IsRiskOwner": 0,
              "IsReviewer": 0,
              "RiskOwnerIDs": [
                "5BEB0CD6-844C-EE11-BBCD-000C29A8F9E1"
              ]
            },
            {
              "SiteRiskAssessmentID": 1,
              "SiteID": 140034,
              "ShortCode": "SEO",
              "SiteName": "Secureyes Office",
              "AssessmentName": "Secureyes Office-SRA-01",
              "AssessmentCode": "SEO-SRA-01",
              "StartDate": "2024-07-11T00:00:00.000Z",
              "EndDate": "2024-07-30T00:00:00.000Z",
              "StatusID": 3,
              "Status": "Published",
              "BCSiteChampionID": "6139E61B-EFAD-EE11-BC50-000C29A8F9E1",
              "BCSiteChampionName": "mo_bank_24_AUTO  Test Observer",
              "ReviewerID": "87BEB379-EFAD-EE11-BC50-000C29A8F9E1",
              "ReviewerName": "mo_bank_26 AUTO BCManager",
              "OverallCompletionPercentage": "100%",
              "ThreatCategories": "[{\"ThreatCategoryID\":4015,\"ThreatCategory\":\"Trojan Threat\"},{\"ThreatCategoryID\":6018,\"ThreatCategory\":\"spyware\"},{\"ThreatCategoryID\":7017,\"ThreatCategory\":\"Backdoor attacks\"}]",
              "AssessmentData": "[{\"SiteRiskAssessmentID\":1,\"ReviewerID\":\"87BEB379-EFAD-EE11-BC50-000C29A8F9E1\",\"SchdeduleRiskAssessment\":[{\"ScheduleRiskAssessmentID\":1,\"ThreatRiskID\":60030,\"RiskOwnerID\":\"5BEB0CD6-844C-EE11-BBCD-000C29A8F9E1\"},{\"ScheduleRiskAssessmentID\":2,\"ThreatRiskID\":60035,\"RiskOwnerID\":\"5BEB0CD6-844C-EE11-BBCD-000C29A8F9E1\"},{\"ScheduleRiskAssessmentID\":3,\"ThreatRiskID\":80054,\"RiskOwnerID\":\"5BEB0CD6-844C-EE11-BBCD-000C29A8F9E1\"},{\"ScheduleRiskAssessmentID\":4,\"ThreatRiskID\":1,\"RiskOwnerID\":\"5BEB0CD6-844C-EE11-BBCD-000C29A8F9E1\"}]}]",
              "IsRiskOwner": 0,
              "IsReviewer": 0,
              "RiskOwnerIDs": [
                "5BEB0CD6-844C-EE11-BBCD-000C29A8F9E1"
              ]
            }
          ],
          "ExportFileLimit": null,
          "StatusData": [
            {
              "SiteRiskAssessmentStatusID": 1,
              "WorkflowID": 1,
              "SiteRiskAssessmentStatus": "Scheduled",
              "QualifiedStatusName": "Scheduled",
              "Description": "Scheduled",
              "IsActive": true,
              "IsDeleted": false,
              "CreatedDate": "2024-02-08T15:59:31.110Z",
              "CreatedBy": "BASE SCRIPT",
              "LastUpdatedDate": "2024-02-29T16:29:06.253Z",
              "LastUpdatedBy": "BASE SCRIPT"
            },
            {
              "SiteRiskAssessmentStatusID": 2,
              "WorkflowID": 2,
              "SiteRiskAssessmentStatus": "InProgress",
              "QualifiedStatusName": "InProgress",
              "Description": "InProgress",
              "IsActive": true,
              "IsDeleted": false,
              "CreatedDate": "2024-02-08T15:59:31.110Z",
              "CreatedBy": "BASE SCRIPT",
              "LastUpdatedDate": "2024-02-29T16:29:06.253Z",
              "LastUpdatedBy": "BASE SCRIPT"
            },
            {
              "SiteRiskAssessmentStatusID": 3,
              "WorkflowID": 3,
              "SiteRiskAssessmentStatus": "Published",
              "QualifiedStatusName": "Published",
              "Description": "Published",
              "IsActive": true,
              "IsDeleted": false,
              "CreatedDate": "2024-02-08T15:59:31.110Z",
              "CreatedBy": "BASE SCRIPT",
              "LastUpdatedDate": "2024-02-29T16:29:06.253Z",
              "LastUpdatedBy": "BASE SCRIPT"
            }
          ],
          "BCManagersList": [
            {
              "AdminGUID": "C83496D1-4267-EE11-B013-000C296CF4F3",
              "AdminName": "Sinchana  Raj"
            },
            {
              "AdminGUID": "4D9CD6F4-A7BA-EE11-B085-000C296CF4F3",
              "AdminName": "Anupam BC manager"
            },
            {
              "AdminGUID": "9A96313E-02CC-EE11-B09E-000C296CF4F3",
              "AdminName": "Navya  Shree"
            },
            {
              "AdminGUID": "BFC732F4-68D4-EE11-B0A9-000C296CF4F3",
              "AdminName": "BC Manager One"
            },
            {
              "AdminGUID": "0DDE8C05-788A-ED11-BAC5-000C29A8F9E1",
              "AdminName": "Nandan  "
            },
            {
              "AdminGUID": "30D1817D-8F8A-ED11-BAC5-000C29A8F9E1",
              "AdminName": "mo_bank_9 PT User 9"
            },
            {
              "AdminGUID": "2E8C222A-578B-ED11-BAC6-000C29A8F9E1",
              "AdminName": "devtest1  devtest1last"
            },
            {
              "AdminGUID": "89224892-6BC9-ED11-BB1D-000C29A8F9E1",
              "AdminName": "mo_bank_22  "
            },
            {
              "AdminGUID": "6EA8FAFB-22E4-ED11-BB42-000C29A8F9E1",
              "AdminName": "mo_bank_30  "
            },
            {
              "AdminGUID": "FBF9B6CA-11F0-EE11-9F20-000C29AAA2A1",
              "AdminName": "devtest5  devtest5last"
            }
          ],
          "IsBCManager": [
            {
              "isBCManager": 1
            }
          ],
          "RiskOwnersList": [
            {
              "RiskOwnerGUID": "E10F1050-578B-ED11-BAC6-000C29A8F9E1",
              "RiskOwnerName": "devtest2  devtest2last"
            },
            {
              "RiskOwnerGUID": "D20497F9-11F0-EE11-9F20-000C29AAA2A1",
              "RiskOwnerName": "devtest6 shwetha "
            },
            {
              "RiskOwnerGUID": "D2ED8DC1-98C4-ED11-BB17-000C29A8F9E1",
              "RiskOwnerName": "mo_bank_18 Middle Name"
            },
            {
              "RiskOwnerGUID": "0187D64A-1FE4-ED11-BB42-000C29A8F9E1",
              "RiskOwnerName": "mo_bank_23  User 3"
            },
            {
              "RiskOwnerGUID": "6EA8FAFB-22E4-ED11-BB42-000C29A8F9E1",
              "RiskOwnerName": "mo_bank_30  "
            },
            {
              "RiskOwnerGUID": "75B7F09A-758A-ED11-BAC5-000C29A8F9E1",
              "RiskOwnerName": "mo_bank_7 PT  User 7"
            },
            {
              "RiskOwnerGUID": "C36C2AB8-50D5-EE11-B0AA-000C296CF4F3",
              "RiskOwnerName": "Shwetha  "
            }
          ],
          "BCMUnitUsersList": [
            {
              "BCMUnitUserGUID": "C83496D1-4267-EE11-B013-000C296CF4F3",
              "BCMUnitUserName": "Sinchana  Raj"
            },
            {
              "BCMUnitUserGUID": "4D9CD6F4-A7BA-EE11-B085-000C296CF4F3",
              "BCMUnitUserName": "Anupam BC manager"
            },
            {
              "BCMUnitUserGUID": "9A96313E-02CC-EE11-B09E-000C296CF4F3",
              "BCMUnitUserName": "Navya  Shree"
            },
            {
              "BCMUnitUserGUID": "BFC732F4-68D4-EE11-B0A9-000C296CF4F3",
              "BCMUnitUserName": "BC Manager One"
            },
            {
              "BCMUnitUserGUID": "74B7F09A-758A-ED11-BAC5-000C29A8F9E1",
              "BCMUnitUserName": "mo_bank_6 mid_name User 6"
            },
            {
              "BCMUnitUserGUID": "0DDE8C05-788A-ED11-BAC5-000C29A8F9E1",
              "BCMUnitUserName": "Nandan  "
            },
            {
              "BCMUnitUserGUID": "30D1817D-8F8A-ED11-BAC5-000C29A8F9E1",
              "BCMUnitUserName": "mo_bank_9 PT User 9"
            },
            {
              "BCMUnitUserGUID": "1FD8BAC4-3B8B-ED11-BAC6-000C29A8F9E1",
              "BCMUnitUserName": "Steering  Committee  mo_bank_10"
            },
            {
              "BCMUnitUserGUID": "DE3A62E5-3B8B-ED11-BAC6-000C29A8F9E1",
              "BCMUnitUserName": "mo_bank_11  "
            },
            {
              "BCMUnitUserGUID": "2E8C222A-578B-ED11-BAC6-000C29A8F9E1",
              "BCMUnitUserName": "devtest1  devtest1last"
            },
            {
              "BCMUnitUserGUID": "BB47EB6A-178C-ED11-BAC7-000C29A8F9E1",
              "BCMUnitUserName": "mo_bank_16  "
            },
            {
              "BCMUnitUserGUID": "395C012B-EC8F-ED11-BACC-000C29A8F9E1",
              "BCMUnitUserName": "mo_bank_17  "
            },
            {
              "BCMUnitUserGUID": "89224892-6BC9-ED11-BB1D-000C29A8F9E1",
              "BCMUnitUserName": "mo_bank_22  "
            },
            {
              "BCMUnitUserGUID": "19AF5BAD-2FD9-ED11-BB34-000C29A8F9E1",
              "BCMUnitUserName": "mo_bank_20  "
            },
            {
              "BCMUnitUserGUID": "6EA8FAFB-22E4-ED11-BB42-000C29A8F9E1",
              "BCMUnitUserName": "mo_bank_30  "
            },
            {
              "BCMUnitUserGUID": "FBF9B6CA-11F0-EE11-9F20-000C29AAA2A1",
              "BCMUnitUserName": "devtest5  devtest5last"
            },
            {
              "BCMUnitUserGUID": "6513981B-4714-EF11-9F4E-000C29AAA2A1",
              "BCMUnitUserName": "devtest7  "
            },
            {
              "BCMUnitUserGUID": "78F1BCF7-F938-EF11-9F7F-000C29AAA2A1",
              "BCMUnitUserName": "Amrutanshu  Nandini Sahoo"
            }
          ]
        },
        "token": "",
        "error": {
            "errorCode": null,
            "errorMessage": null
        }
    });
    }
    else {
      this.post("/business-continuity-management/site-risk-assessments/get-site-risk-assessments-list", {}).subscribe(res => {
        next:
        if (res.success == 1) {
          this.processSiteListData(res)
        } else {
          if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
          else
            this.popupInfo("Unsuccessful", res.error.errorMessage)
        }
      });
    }
  }

  processSiteListData(res: any) {
    this.allRiskData = res.result
    this.gotMasterSiteData.next(true)
  }

  deletesiteriskassessment(data: any) {
    return this.post("/business-continuity-management/site-risk-assessments/delete-site-risk-assessment", {
      "data": {
        "SiteRiskAssessmentID": Number(data.SiteRiskAssessmentID)
      },
    });
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
        // this.router.navigate(['']);
      }, timeout)
    });
  }

  getSiteRiskMasterInfo() {
    if (environment.dummyData) {
      this.processSiteRiskService({
        "success": 1,
        "message": "Data fetch from DB successful.",
        "result": {
          "SiteMasterList": [{
            "SiteID": 1,
            "SiteName": "AMLAK HO",
            "AssessmentName": "AMLAK HO - Site Risk Assessment - 03",
            "AssessmentCode": "AMHO-SRA-03"
          },
          {
            "SiteID": 2,
            "SiteName": "AMLAK",
            "AssessmentName": "AMLAK - Site Risk Assessment - 01",
            "AssessmentCode": "AMLK-SRA-01"
          }],

          "ThreatCategoryList": [{
            "ThreatCategoryID": 1,
            "ThreatCategory": "Natural Disasters",
          },
          {
            "ThreatCategoryID": 2,
            "ThreatCategory": "Man-made Disasters",
          }],

          "RisksList": [{
            "ThreatCategoryID": 1,
            "ThreatCategory": "Natural Disasters",
            "RiskID": 1,
            "RiskTitle": "Building evacuation procedures are not known to staff",
          },
          {
            "ThreatCategoryID": 1,
            "ThreatCategory": "Natural Disasters",
            "RiskID": 2,
            "RiskTitle": "Building location subject to - hurricane/cyclone/sand storm",
          },
          {
            "ThreatCategoryID": 2,
            "ThreatCategory": "Man-made Disasters",
            "RiskID": 3,
            "RiskTitle": "Fire Hazard",
          },
          {
            "ThreatCategoryID": 2,
            "ThreatCategory": "Man-made Disasters",
            "RiskID": 4,
            "RiskTitle": "Man made poisoning",
          }],


        },
        "error": {
          "errorCode": null,
          "errorMessage": null
        },
      })
    } else {
      this.post("/business-continuity-management/site-risk-assessments/get-site-risk-assessments-info", {}).subscribe(res => {
        next:
        if (res.success == 1) {
          this.processSiteRiskService(res)
        } else {
          if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
          else
            this.popupInfo("Unsuccessful", res.error.errorMessage)
        }
      });

    }
  }

  processSiteRiskService(response: any): void {
    this.masterData = response.result;
    this.gotInfoMaster.next(true);
  }

  addEditSiteDetails(mode: any, data: any, threatData: any, siteName: any, siteAssessmentID?: any) {
    let SiteID = (this.masterData.SiteMasterList || []).filter((x: any) => x.SiteName.trim().toLowerCase() == data.selectedSites.value.trim().toLowerCase())[0].SiteID;
    let requestData: any = {}; // Create an empty object to hold request data
    if (mode == 'add') {
      requestData = {
        "data": {
          "SiteID": SiteID,
          "SiteName": siteName,
          "AssessmentName": data.assessmentName.value,
          "AssessmentCode": data.assessmentCode.value,
          "StartDate": this.utils.formatTimeZone(data.startDate.value),
          "EndDate": this.utils.formatTimeZone(data.endDate.value),
          "ReviewerID": localStorage.getItem("userguid"),
          "Risks": threatData
        }
      };
    } else {
      requestData = {
        "data": {
          "SiteRiskAssessmentID": siteAssessmentID,
          "StartDate":  this.utils.formatTimeZone(data.startDate.value),
          "EndDate": this.utils.formatTimeZone(data.endDate.value),
          "Risks": threatData
        }
      };
    }
    const endpoint = (mode == 'add') ? "/business-continuity-management/site-risk-assessments/add-site-risk-assessment" : "/business-continuity-management/site-risk-assessments/update-site-risk-assessment";

    return this.post(endpoint, requestData);
  }
  //Listing page site risk assessment - end

  //Assessment Risk Listing Page 65 - Start
  getRiskListData() {
    if (environment.dummyData) {
      this.processRiskListData({
        "success": 1,
        "message": "Data fetch from DB successful.",
        "result": {
          "siteRiskAssessments": [{
            "RiskTitle": "Building evacuation procedures are not known to staff",
            "RiskID": 1,
            "RiskDescription": "test risk description",
            "Controls": [{ ThreatLibraryControlsID: 1, Description: "test control1" }, { ThreatLibraryControlsID: 2, Description: "test control2" }],
            "RiskImpact": [{ ImpactID: 1, Impact: "Confidentiality" }],
            "CategoryName": "Natural Disasters",
            "CategoryID": 1,
            "InherentRiskName": "Medium",
            "InherentRiskID": 1,
            "ExistingControls": "Y",
            "ResidualRiskID": 1,
            "ResidualRiskName": "Low",
            "TreatmentID": 1,
            "TreatmentName": "Treat",
            "RespondedStatusID": 1,
            "RespondedStatusName": "",
            "ThreatCategoryID": 1,
            "ThreatCategory": "Natural Disasters",
            "RiskOwnerID": "C83496D1-4267-EE11-B013-000C296CF4F3",
            "RiskOwner": "Sinchana  Raj",
            "SiteID": 1,
            "RiskCode": "2024-Q1-01"
          },
          {
            "RiskTitle": "Disclosure of sensitive information",
            "RiskID": 2,
            "RiskDescription": "test risk description",
            "Controls": [{ ThreatLibraryControlsID: 1, Description: "test control1" }, { ThreatLibraryControlsID: 2, Description: "test control2" }],
            "RiskImpact": [{ ImpactID: 1, Impact: "Confidentiality" }, { ImpactID: 2, Impact: "Integrity" }],
            "CategoryName": "Natural Disasters",
            "CategoryID": 1,
            "InherentRiskName": "Medium",
            "InherentRiskID": 1,
            "ExistingControls": "Y",
            "ResidualRiskID": 1,
            "ResidualRiskName": "Low",
            "TreatmentID": 1,
            "TreatmentName": "Treat",
            "RespondedStatusID": 1,
            "RespondedStatusName": "",
            "ThreatCategoryID": 1,
            "ThreatCategory": "Natural Disasters",
            "RiskOwnerID": "C83496D1-4267-EE11-B013-000C296CF4F3",
            "RiskOwner": "Sinchana  Raj",
            "SiteID": 1,
            "RiskCode": "2024-Q1-02"
          }],
          "riskDetails": [
            {
              "CurrentStep": "Response in Progress (BC Site Champ)",
              "NextStep": "Review Responses (BCM Manager)",
              "DueDate": "15/3/2023",
              "NextWorkFlowActionBy": "Subit for Review",
              "OverallStatusID": 1,
              "OverallStatusName": "In Progress"
            }
          ],
          "threatCategoryList": [
            {
              "ThreatCategoryID": 1,
              "ThreatCategory": "Category1"
            },
            {
              "ThreatCategoryID": 2,
              "ThreatCategory": "Category2"
            },
            {
              "ThreatCategoryID": 3,
              "ThreatCategory": "Category3"
            }
          ]
        },
        "error": {
          "errorCode": null,
          "errorMessage": null
        },
        "token": ""
      });
    } else {
      this.post("/business-continuity-management/site-risk-assessments/get-site-risk-assessments-details", { data: { siteRiskAssessmentId: this.selectedSiteAssessment.value }, }).subscribe(res => {
        next:
        if (res.success == 1) {
          this.processRiskListData(res)
        } else {
          if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
          else
            this.popupInfo("Unsuccessful", res.error.errorMessage)
        }
      });
    }
  }

  processRiskListData(response: any): void {
    this.riskList = response.result
    this.riskList.ThreatMasterList = this.riskList.siteRiskAssessments?.map((x: any) => {
      x.RiskImpactCode = x.RiskImpact.map((c: any) => c.Code).join('');
      return x;
    });
    this.gotRiskListSubj.next(true);
  }

  deleteRisk(risk: any) {
    return this.post("/business-continuity-management/site-risk-assessments/delete-custom-threat", {
      "data": {
        "customThreatRiskID": risk.ThreatRiskID,
        "siteRiskAssessmentID": risk.SiteRiskAssessmentID
      },
    });
  }

  getReviewComment() {
    if (environment.dummyData) {
      this.processReviewComment({
        "success": 1,
        "message": "Data fetch from DB successful.",
        "result": {
          "actionTrailList": [
            {
              "BCManagerID": "9A96313E-02CC-EE11-B09E-000C296CF4F3",
              "BCManagerName": "Navya Shree"
            }
          ],
          "CommentsHistoryArr": [
            {
              "ActionTrailID": 4,
              "CommentBody": "risk owner approved",
              "CommentUserName": "2024-03-06T15:06:54.693",
              "IsVisible": true,
              "SiteRiskAssessmentID": 15,
              "UserGUID": "C36C2AB8-50D5-EE11-B0AA-000C296CF4F3"
            }
          ]
        },
        "error": {
          "errorCode": null,
          "errorMessage": null
        },
        "token": ""
      });
    } else {
      this.post("/business-continuity-management/site-risk-assessments/get-risk-assessment-action-trail", { data: { siteRiskAssessmentId: this.selectedSiteAssessment.value }, }).subscribe(res => {
        next:
        if (res.success == 1) {
          this.processReviewComment(res)
        } else {
          if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
          else
            this.popupInfo("Unsuccessful", res.error.errorMessage)
        }
      });
    }
  }

  processReviewComment(res: any) {
    this.revcomment = res.result
    this.gotReviewSubj.next(true);
  }

  getStatusRiskOwner(status: any): string {
    let text = '';
    switch (status) {
      case 'New':
        text = 'Not started';
        break;
      case 'Draft':
        text = 'Drafted & Not Submitted';
        break;
      case 'Responded':
        text = 'Submitted for Review';
        break;
      case 'Returned With Comment':
        text = 'Rejected';
        break;
      case 'Approved':
        text = 'Approved';
        break;
      case 'Publish Risk':
        text = 'Published';
        break;
      default:
        text = 'Default Not started';
        break
    }
    return text;
  }

  getStatusBCMang(status: any, data: any): string {
    console.log('status: ', status);
    let text = '';
    switch (status) {
      case 'New':
        text = 'Not started';
        break;
      case 'Draft':
        text = 'Drafted & Not Submitted';
        break;
      // case 'Draft':
      //   text = 'Submitted by Risk Owner for Review';
      //   break;
      case 'Responded':
        text = 'Risk Owner Responded';
        break;
      case 'Returned With Comment':
        if (status === 'Returned With Comment' && data.IsReviewed == false) {
          text = 'Rejected and Review not submitted';
        } else {
          text = 'Rejected and Review submitted';
        }
        break;
      case 'Approved':
        if (status === 'Approved' && data.IsReviewed == false) {
          text = 'Approved and Review not Submitted';
        } else {
          text = 'Approved and Review Submitted';
        }
        break;
      case 'Publish Risk':
        text = 'Published';
        break;
      default:
        text = 'Default Not started';
        break
    }
    return text;
  }

  //Assessment Risk Listing - End

  getConsolidatedReportData(assessmentIds: any, threatRiskIDs: any = null,scheduledRiskAssessmentIds: any = null, url: any, from: any) {
    if (environment.dummyData) {
      this.processConsolidatedReportData({
        "success": 1,
        "message": "Data fetch from DB successful.",
        "result": {
            "SiteAssessmentsDetails": [
                {
                    "SiteRiskAssessmentID": 20015,
                    "AssessmentName": "Riyadh Branch Office-SRA-01",
                    "AssessmentCode": "RBO-SRA-01",
                    "SiteID": 10010,
                    "SiteName": "Riyadh Branch Office",
                    "ShortCode": "RBO",
                    "StartDate": "2024-03-28T00:00:00.000Z",
                    "EndDate": "2024-03-31T00:00:00.000Z",
                    "SiteRiskAssessmentStatusID": 3,
                    "SiteRiskAssessmentStatus": "Published",
                    "Risks": [
                        {
                            "SiteRiskAssessmentID": 20015,
                            "AssessmentName": "Riyadh Branch Office-SRA-01",
                            "AssessmentCode": "RBO-SRA-01",
                            "StartDate": "2024-03-28T00:00:00.000Z",
                            "EndDate": "2024-03-31T00:00:00.000Z",
                            "SiteRiskAssessmentStatusID": 3,
                            "SiteRiskAssessmentStatus": "Published",
                            "SiteID": 10010,
                            "SiteName": "Riyadh Branch Office",
                            "ShortCode": "RBO",
                            "ScheduleRiskAssessmentID": 20053,
                            "ThreatRiskID": 19,
                            "RiskTitle": "Use of removable media to store/transfer sensitive information updatated FY2024-25",
                            "RiskCode": "2024-Q1-02",
                            "RiskDescription": "Description of Use of removable media to store/transfer sensitive information updatated FY2024-25",
                            "Controls": [
                                {
                                    "ThreatLibraryControlsID": 36,
                                    "Description": "Current Control of Use of removable media to store/transfer sensitive information",
                                    "IsVisible": 1
                                },
                                {
                                    "ThreatLibraryControlsID": 37,
                                    "Description": "Dummy current controls",
                                    "IsVisible": 1
                                },
                                {
                                    "ThreatLibraryControlsID": 10018,
                                    "Description": "Custom mo bank -4 - Description of Use of removable media to store/transfer sensitive information",
                                    "IsVisible": 1
                                }
                            ],
                            "RiskImpact": [
                                {
                                    "ImpactID": 2,
                                    "Impact": "Integrity",
                                    "Code": "I"
                                }
                            ],
                            "ThreatCategoryID": 16,
                            "ThreatCategory": "NCAA Compliance Control",
                            "RiskOwnerID": "2091ADC8-C068-EE11-BBF5-000C29A8F9E1",
                            "RiskOwnerName": "mo_bank_4 PT User  4",
                            "IsCustomRisk": 0,
                            "RiskTreatmentStrategyID": 1,
                            "RiskTreatmentStrategyName": "Treat",
                            "OverallResidualRiskRatingID": 1,
                            "OverallResidualRiskRating": "Low",
                            "OverallInherentRiskRatingID": 2,
                            "OverallInherentRiskRating": "Medium",
                            "StatusID": 7,
                            "Status": "Publish Risk",
                            "ControlEffectivenessID": 3,
                            "ControlEffectiveness": "Low",
                            "ResidualLikelihoodRatingID": 3,
                            "ResidualLikelihoodRating": "High",
                            "ResidualImpactRatingID": 1,
                            "ResidualImpactRating": "Minor",
                            "InherentLikelihoodRatingID": 2,
                            "InherentLikelihoodRating": "Medium",
                            "InherentImpactRatingID": 2,
                            "InherentImpactRating": "Moderate",
                            "ResidualRiskDescription": "",
                            "ActionPlans": [
                                {
                                    "actionID": 1017,
                                    "actionItem": "AT 1- Risk Treatment- Description of Use of removable media to store/transfer sensitive information.",
                                    "startDate": "2024-03-28T00:00:00",
                                    "targetDate": "2024-03-31T00:00:00",
                                    "actionItemOwnerID": "73B7F09A-758A-ED11-BAC5-000C29A8F9E1",
                                    "actionItemOwner": "mo_bank_5 PT User 5"
                                },
                                {
                                    "actionID": 1018,
                                    "actionItem": "AT 2- Risk Treatment-  Description of Use of removable media to store/transfer sensitive information",
                                    "startDate": "2024-03-31T00:00:00",
                                    "targetDate": "2024-03-31T00:00:00",
                                    "actionItemOwnerID": "5BEB0CD6-844C-EE11-BBCD-000C29A8F9E1",
                                    "actionItemOwner": "mo_bank_28  "
                                }
                            ]
                        },
                        {
                            "SiteRiskAssessmentID": 20015,
                            "AssessmentName": "Riyadh Branch Office-SRA-01",
                            "AssessmentCode": "RBO-SRA-01",
                            "StartDate": "2024-03-28T00:00:00.000Z",
                            "EndDate": "2024-03-31T00:00:00.000Z",
                            "SiteRiskAssessmentStatusID": 3,
                            "SiteRiskAssessmentStatus": "Published",
                            "SiteID": 10010,
                            "SiteName": "Riyadh Branch Office",
                            "ShortCode": "RBO",
                            "ScheduleRiskAssessmentID": 20054,
                            "ThreatRiskID": 18,
                            "RiskTitle": "Exposure sensitive information to unauthorized parties ",
                            "RiskCode": "2024-Q1-01",
                            "RiskDescription": "Description of Exposure sensitive information to unauthorized parties ",
                            "Controls": [
                                {
                                    "ThreatLibraryControlsID": 18,
                                    "Description": "Dummy Control Custom - mo_bank_3",
                                    "IsVisible": 1
                                },
                                {
                                    "ThreatLibraryControlsID": 34,
                                    "Description": "Description of Exposure sensitive information to unauthorized parties Description of Exposure sensitive information to unauthorized parties Description of Exposure sensitive information to unauthorized parties - End",
                                    "IsVisible": 1
                                }
                            ],
                            "RiskImpact": [
                                {
                                    "ImpactID": 2,
                                    "Impact": "Integrity",
                                    "Code": "I"
                                },
                                {
                                    "ImpactID": 3,
                                    "Impact": "Availability",
                                    "Code": "A"
                                }
                            ],
                            "ThreatCategoryID": 15,
                            "ThreatCategory": "Cyber Security Control",
                            "RiskOwnerID": "71B7F09A-758A-ED11-BAC5-000C29A8F9E1",
                            "RiskOwnerName": "mo_bank_3 PT User 3",
                            "IsCustomRisk": 0,
                            "RiskTreatmentStrategyID": 1,
                            "RiskTreatmentStrategyName": "Treat",
                            "OverallResidualRiskRatingID": 2,
                            "OverallResidualRiskRating": "Medium",
                            "OverallInherentRiskRatingID": 3,
                            "OverallInherentRiskRating": "High",
                            "StatusID": 7,
                            "Status": "Publish Risk",
                            "ControlEffectivenessID": 3,
                            "ControlEffectiveness": "Low",
                            "ResidualLikelihoodRatingID": 3,
                            "ResidualLikelihoodRating": "High",
                            "ResidualImpactRatingID": 2,
                            "ResidualImpactRating": "Moderate",
                            "InherentLikelihoodRatingID": 3,
                            "InherentLikelihoodRating": "High",
                            "InherentImpactRatingID": 3,
                            "InherentImpactRating": "Major",
                            "ResidualRiskDescription": "Residual Risk : Brief explanation for the rating",
                            "ActionPlans": [
                                {
                                    "actionID": 17,
                                    "actionItem": "Riyadh Branch Office : Action Plan 001",
                                    "startDate": "2024-03-28T00:00:00",
                                    "targetDate": "2024-03-31T00:00:00",
                                    "actionItemOwnerID": "5BEB0CD6-844C-EE11-BBCD-000C29A8F9E1",
                                    "actionItemOwner": "mo_bank_28  "
                                },
                                {
                                    "actionID": 18,
                                    "actionItem": "Riyadh Branch Office : Action Plan 002",
                                    "startDate": "2024-03-29T00:00:00",
                                    "targetDate": "2024-04-03T00:00:00",
                                    "actionItemOwnerID": "73B7F09A-758A-ED11-BAC5-000C29A8F9E1",
                                    "actionItemOwner": "mo_bank_5 PT User 5"
                                },
                                {
                                    "actionID": 2023,
                                    "actionItem": "Riyadh Branch Office : Action Plan 003 Deleted - Created 004",
                                    "startDate": "2024-03-29T00:00:00",
                                    "targetDate": "2024-04-23T00:00:00",
                                    "actionItemOwnerID": "BC49274E-EFAD-EE11-BC50-000C29A8F9E1",
                                    "actionItemOwner": "mo_bank_25  "
                                }
                            ]
                        },
                        {
                            "SiteRiskAssessmentID": 20015,
                            "AssessmentName": "Riyadh Branch Office-SRA-01",
                            "AssessmentCode": "RBO-SRA-01",
                            "StartDate": "2024-03-28T00:00:00.000Z",
                            "EndDate": "2024-03-31T00:00:00.000Z",
                            "SiteRiskAssessmentStatusID": 3,
                            "SiteRiskAssessmentStatus": "Published",
                            "SiteID": 10010,
                            "SiteName": "Riyadh Branch Office",
                            "ShortCode": "RBO",
                            "ScheduleRiskAssessmentID": 20055,
                            "ThreatRiskID": 20,
                            "RiskTitle": "Printed sensitive information remains in the print tray",
                            "RiskCode": "2024-Q1-03",
                            "RiskDescription": "Description of Printed sensitive information remains in the print tray",
                            "Controls": [
                                {
                                    "ThreatLibraryControlsID": 38,
                                    "Description": "Current Controls Description of Printed sensitive information remains in the print tray",
                                    "IsVisible": 1
                                },
                                {
                                    "ThreatLibraryControlsID": 10021,
                                    "Description": "Custom Printed sensitive information remains in the print tray",
                                    "IsVisible": 1
                                }
                            ],
                            "RiskImpact": [
                                {
                                    "ImpactID": 1,
                                    "Impact": "Confidentiality",
                                    "Code": "C"
                                },
                                {
                                    "ImpactID": 2,
                                    "Impact": "Integrity",
                                    "Code": "I"
                                }
                            ],
                            "ThreatCategoryID": 16,
                            "ThreatCategory": "NCAA Compliance Control",
                            "RiskOwnerID": "5BEB0CD6-844C-EE11-BBCD-000C29A8F9E1",
                            "RiskOwnerName": "mo_bank_28  ",
                            "IsCustomRisk": 0,
                            "RiskTreatmentStrategyID": 1,
                            "RiskTreatmentStrategyName": "Treat",
                            "OverallResidualRiskRatingID": 3,
                            "OverallResidualRiskRating": "High",
                            "OverallInherentRiskRatingID": 1,
                            "OverallInherentRiskRating": "Low",
                            "StatusID": 7,
                            "Status": "Publish Risk",
                            "ControlEffectivenessID": 3,
                            "ControlEffectiveness": "Low",
                            "ResidualLikelihoodRatingID": 3,
                            "ResidualLikelihoodRating": "High",
                            "ResidualImpactRatingID": 3,
                            "ResidualImpactRating": "Major",
                            "InherentLikelihoodRatingID": 3,
                            "InherentLikelihoodRating": "High",
                            "InherentImpactRatingID": 1,
                            "InherentImpactRating": "Minor",
                            "ResidualRiskDescription": "1. Printed sensitive information remains in the print tray Brief explanation for the rating 29th March",
                            "ActionPlans": [
                                {
                                    "actionID": 2020,
                                    "actionItem": "1. Printed sensitive information remains in the print tray",
                                    "startDate": "2024-03-29T00:00:00",
                                    "targetDate": "2024-03-31T00:00:00",
                                    "actionItemOwnerID": "70B7F09A-758A-ED11-BAC5-000C29A8F9E1",
                                    "actionItemOwner": "mo_bank_2  UserNew"
                                }
                            ]
                        },
                        {
                            "SiteRiskAssessmentID": 20015,
                            "AssessmentName": "Riyadh Branch Office-SRA-01",
                            "AssessmentCode": "RBO-SRA-01",
                            "StartDate": "2024-03-28T00:00:00.000Z",
                            "EndDate": "2024-03-31T00:00:00.000Z",
                            "SiteRiskAssessmentStatusID": 3,
                            "SiteRiskAssessmentStatus": "Published",
                            "SiteID": 10010,
                            "SiteName": "Riyadh Branch Office",
                            "ShortCode": "RBO",
                            "ScheduleRiskAssessmentID": 20056,
                            "ThreatRiskID": 21,
                            "RiskTitle": "Some supplier do not have formal service level agreements with organization.  Supplier contracts does not contain information security and business continuity requirements of the  organization such as compliance to IS & BCM policies.",
                            "RiskCode": "2024-Q1-04",
                            "RiskDescription": "Some supplier do not have formal service level agreements with organization. \nSupplier contracts does not contain information security and business continuity requirements of the \norganization such as compliance to IS & BCM policies.",
                            "RiskImpact": [
                                {
                                    "ImpactID": 1,
                                    "Impact": "Confidentiality",
                                    "Code": "C"
                                },
                                {
                                    "ImpactID": 2,
                                    "Impact": "Integrity",
                                    "Code": "I"
                                }
                            ],
                            "ThreatCategoryID": 17,
                            "ThreatCategory": "SAMA Regulatory Controls",
                            "RiskOwnerID": "2091ADC8-C068-EE11-BBF5-000C29A8F9E1",
                            "RiskOwnerName": "RiskTrac_PU_RM1  ",
                            "IsCustomRisk": 0,
                            "RiskTreatmentStrategyID": 1,
                            "RiskTreatmentStrategyName": "Treat",
                            "OverallResidualRiskRatingID": 2,
                            "OverallResidualRiskRating": "Medium",
                            "OverallInherentRiskRatingID": 2,
                            "OverallInherentRiskRating": "Medium",
                            "StatusID": 7,
                            "Status": "Publish Risk",
                            "ControlEffectivenessID": 3,
                            "ControlEffectiveness": "Low",
                            "ResidualLikelihoodRatingID": 2,
                            "ResidualLikelihoodRating": "Medium",
                            "ResidualImpactRatingID": 3,
                            "ResidualImpactRating": "Major",
                            "InherentLikelihoodRatingID": 3,
                            "InherentLikelihoodRating": "High",
                            "InherentImpactRatingID": 2,
                            "InherentImpactRating": "Moderate",
                            "ResidualRiskDescription": "Control deleted Some supplier do not have formal service level agreements with organization. Supplier contracts does not contain information security and business",
                            "ActionPlans": [
                                {
                                    "actionID": 2021,
                                    "actionItem": "Control deleted Some supplier do not have formal service level agreements with organization. \nSupplier contracts does not contain information security and business continuity requirements of the \norganization such as compliance to IS & BCM policies.",
                                    "startDate": "2024-03-29T00:00:00",
                                    "targetDate": "2024-03-31T00:00:00",
                                    "actionItemOwnerID": "73B7F09A-758A-ED11-BAC5-000C29A8F9E1",
                                    "actionItemOwner": "mo_bank_5 PT User 5"
                                }
                            ]
                        },
                        {
                            "SiteRiskAssessmentID": 20015,
                            "AssessmentName": "Riyadh Branch Office-SRA-01",
                            "AssessmentCode": "RBO-SRA-01",
                            "StartDate": "2024-03-28T00:00:00.000Z",
                            "EndDate": "2024-03-31T00:00:00.000Z",
                            "SiteRiskAssessmentStatusID": 3,
                            "SiteRiskAssessmentStatus": "Published",
                            "SiteID": 10010,
                            "SiteName": "Riyadh Branch Office",
                            "ShortCode": "RBO",
                            "ScheduleRiskAssessmentID": 30061,
                            "ThreatRiskID": 10010,
                            "RiskTitle": "SAMA Regulatory Custom Risk By mo Bank 28 with No controls - Edited",
                            "RiskDescription": "Description of-SAMA Regulatory Custom Risk By MO Bank 28 - Edited",
                            "RiskImpact": [
                                {
                                    "ImpactID": 1,
                                    "Impact": "Confidentiality",
                                    "Code": "C"
                                },
                                {
                                    "ImpactID": 2,
                                    "Impact": "Integrity",
                                    "Code": "I"
                                }
                            ],
                            "ThreatCategoryID": 17,
                            "ThreatCategory": "SAMA Regulatory Controls",
                            "RiskOwnerID": "5BEB0CD6-844C-EE11-BBCD-000C29A8F9E1",
                            "RiskOwnerName": "mo_bank_28  ",
                            "IsCustomRisk": 1,
                            "RiskTreatmentStrategyID": 1,
                            "RiskTreatmentStrategyName": "Treat",
                            "OverallResidualRiskRatingID": 1,
                            "OverallResidualRiskRating": "Low",
                            "OverallInherentRiskRatingID": 1,
                            "OverallInherentRiskRating": "Low",
                            "StatusID": 7,
                            "Status": "Publish Risk",
                            "ControlEffectivenessID": 1,
                            "ControlEffectiveness": "High",
                            "ResidualLikelihoodRatingID": 1,
                            "ResidualLikelihoodRating": "Low",
                            "ResidualImpactRatingID": 1,
                            "ResidualImpactRating": "Minor",
                            "InherentLikelihoodRatingID": 3,
                            "InherentLikelihoodRating": "High",
                            "InherentImpactRatingID": 1,
                            "InherentImpactRating": "Minor",
                            "ResidualRiskDescription": "",
                            "ActionPlans": [
                                {
                                    "actionID": 2024,
                                    "actionItem": "Action plan newly created post 2nd rejection owner mo_bank_2",
                                    "startDate": "2024-03-29T00:00:00",
                                    "targetDate": "2024-03-31T00:00:00",
                                    "actionItemOwnerID": "5BEB0CD6-844C-EE11-BBCD-000C29A8F9E1",
                                    "actionItemOwner": "mo_bank_28  "
                                }
                            ]
                        },
                        {
                            "SiteRiskAssessmentID": 20015,
                            "AssessmentName": "Riyadh Branch Office-SRA-01",
                            "AssessmentCode": "RBO-SRA-01",
                            "StartDate": "2024-03-28T00:00:00.000Z",
                            "EndDate": "2024-03-31T00:00:00.000Z",
                            "SiteRiskAssessmentStatusID": 3,
                            "SiteRiskAssessmentStatus": "Published",
                            "SiteID": 10010,
                            "SiteName": "Riyadh Branch Office",
                            "ShortCode": "RBO",
                            "ScheduleRiskAssessmentID": 30062,
                            "ThreatRiskID": 10011,
                            "RiskTitle": "Description of-SAMA Regulatory Custom Risk By MO Bank 28 Custom Risk 002 - Edit",
                            "RiskDescription": "Dsec- Description of-SAMA Regulatory Custom Risk By MO Bank 28 Custom Risk 002 - Edit",
                            "Controls": [
                                {
                                    "ThreatLibraryControlsID": 10024,
                                    "Description": "Current control created post rejection -Description of-SAMA Regulatory Custom Risk By MO Bank 28 Custom Risk 002 - Edit - Deleted",
                                    "IsVisible": 1
                                },
                                {
                                    "ThreatLibraryControlsID": 10026,
                                    "Description": "Current control created post 2nd time rejection -Description of-SAMA Regulatory Custom Risk By MO Bank 28 Custom Risk 002 - Edit - Deleted",
                                    "IsVisible": 1
                                }
                            ],
                            "RiskImpact": [
                                {
                                    "ImpactID": 3,
                                    "Impact": "Availability",
                                    "Code": "A"
                                }
                            ],
                            "ThreatCategoryID": 14,
                            "ThreatCategory": "Information Security Controls",
                            "RiskOwnerID": "5BEB0CD6-844C-EE11-BBCD-000C29A8F9E1",
                            "RiskOwnerName": "mo_bank_28  ",
                            "IsCustomRisk": 1,
                            "RiskTreatmentStrategyID": 2,
                            "RiskTreatmentStrategyName": "Tolerate",
                            "OverallResidualRiskRatingID": 2,
                            "OverallResidualRiskRating": "Medium",
                            "OverallInherentRiskRatingID": 3,
                            "OverallInherentRiskRating": "High",
                            "StatusID": 7,
                            "Status": "Publish Risk",
                            "ControlEffectivenessID": 3,
                            "ControlEffectiveness": "Low",
                            "ResidualLikelihoodRatingID": 3,
                            "ResidualLikelihoodRating": "High",
                            "ResidualImpactRatingID": 2,
                            "ResidualImpactRating": "Moderate",
                            "InherentLikelihoodRatingID": 3,
                            "InherentLikelihoodRating": "High",
                            "InherentImpactRatingID": 3,
                            "InherentImpactRating": "Major",
                            "ResidualRiskDescription": "Brief explanation for the rating 3rd risk",
                            "RiskTolerateExplanation": "All Action plan hidden",
                            "ActionPlans": []
                        },
                        {
                            "SiteRiskAssessmentID": 20015,
                            "AssessmentName": "Riyadh Branch Office-SRA-01",
                            "AssessmentCode": "RBO-SRA-01",
                            "StartDate": "2024-03-28T00:00:00.000Z",
                            "EndDate": "2024-03-31T00:00:00.000Z",
                            "SiteRiskAssessmentStatusID": 3,
                            "SiteRiskAssessmentStatus": "Published",
                            "SiteID": 10010,
                            "SiteName": "Riyadh Branch Office",
                            "ShortCode": "RBO",
                            "ScheduleRiskAssessmentID": 30063,
                            "ThreatRiskID": 10012,
                            "RiskTitle": "Custom Risk Post 2nd Rejection to address Governance Related controls",
                            "RiskDescription": "Desc Custom Risk Post 2nd Rejection to address Governance Related controls",
                            "RiskImpact": [
                                {
                                    "ImpactID": 2,
                                    "Impact": "Integrity",
                                    "Code": "I"
                                }
                            ],
                            "ThreatCategoryID": 15,
                            "ThreatCategory": "Cyber Security Control",
                            "RiskOwnerID": "5BEB0CD6-844C-EE11-BBCD-000C29A8F9E1",
                            "RiskOwnerName": "mo_bank_28  ",
                            "IsCustomRisk": 1,
                            "RiskTreatmentStrategyID": 2,
                            "RiskTreatmentStrategyName": "Tolerate",
                            "OverallResidualRiskRatingID": 3,
                            "OverallResidualRiskRating": "High",
                            "OverallInherentRiskRatingID": 2,
                            "OverallInherentRiskRating": "Medium",
                            "StatusID": 7,
                            "Status": "Publish Risk",
                            "ControlEffectivenessID": 3,
                            "ControlEffectiveness": "Low",
                            "ResidualLikelihoodRatingID": 3,
                            "ResidualLikelihoodRating": "High",
                            "ResidualImpactRatingID": 3,
                            "ResidualImpactRating": "Major",
                            "InherentLikelihoodRatingID": 2,
                            "InherentLikelihoodRating": "Medium",
                            "InherentImpactRatingID": 3,
                            "InherentImpactRating": "Major",
                            "ResidualRiskDescription": "Brief explanation for the rating - Desc Custom Risk Post 2nd Rejection to address Governance Related controls",
                            "RiskTolerateExplanation": "Tolerate - Explanation *Please provide an explanation for why this risk can be tolerated.",
                            "ActionPlans": []
                        }
                    ]
                }
            ]
        },
        "token": null,
        "error": {
            "errorCode": null,
            "errorMessage": null
        }
    }, from);
    }
    else {
      this.post(url, { data: { siteRiskAssessmentIds: assessmentIds, threatRiskIDs: threatRiskIDs, scheduleRiskAssessmentIDs:  scheduledRiskAssessmentIds } }).subscribe(res => {
        next:
        if (res.success == 1) {
          this.processConsolidatedReportData(res, from)
        } else {
          if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
          else
            this.popupInfo("Unsuccessful", res.error.errorMessage)
        }
      });
    }
  }

  processConsolidatedReportData(response: any, from: any): void {
    this.consolidatedMaster = response.result.SiteAssessmentsDetails;
    this.consolidatedMaster = this.consolidatedMaster.map((each: any) => {
      each.Risks = addIndex(each.Risks, false);
      each.Risks.map((x: any) => {
        x.RiskImpact          = ((x.RiskImpact  || []).sort((a: any, b: any) => a.ImpactID - b.ImpactID));
        x.RiskImpactIds       = x.RiskImpact.map((y: any) => y.ImpactID)
        x.ControlDescriptions = ((x.Controls    || []).map((y: any) => y.Description)).join();
        x.ActionPlanItems     = ((x.ActionPlans || []).map((y: any) => y.actionItem)).join();
        x.ActionItemOwner     = ((x.ActionPlans || []).map((y: any) => y.actionItemOwner)).join();
        return x;
      });
      return each;
    });
    this.FormatedReportHeader = [
      ['Sl. No.', 'Assessment Name', 'Name of Issue', 'Threat category', 'Threat description', 'Impact on CIA (Indicate with "y")', '', '', 'Risk Owner', 'Likelihood (Gross Risk) Inherent Risk', 'Value', 'Impact (Gross Risk) Inherent Risk', 'Value',
        'Gross Risk Rating - Inherent Risk', 'Control Description', 'Effectiveness of Current Controls', 'Likelihood (Residual Risk)', 'Value', 'Impact (Residual Risk)', 'Value', 'Residual Risk Rating', 'Risk Treatment Option', 'Action Plan',
        'Action Plan Owner', 'Estimated Start Date', 'Estimated End Date', 'Progress', 'Reviewer Comments', 'Responded Status'],
      ['', '', '', '', '', 'C', 'I', 'A', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']
    ]
    this.consolidatedMaster.forEach((y: any, index: any) => {
      this.FormatedReportData.push({});
      this.FormatedReportData[index].AssessmentName = y.AssessmentName;
      this.FormatedReportData[index].AssessmentCode = y.AssessmentCode;
      this.FormatedReportData[index].risks = [];
      (y.Risks || []).map((x: any) => {
        this.FormatedReportData[index].risks.push(
          [x.Index, (x.AssessmentName || ''), (x.RiskTitle || ''), (x.ThreatCategory || ''), (x.RiskDescription || ''),
          x.RiskImpactIds.includes(1) ? 'Y' : '-', x.RiskImpactIds.includes(2) ? 'Y' : '-', x.RiskImpactIds.includes(3) ? 'Y' : '-',
          (x.RiskOwnerName || ''), (x.InherentLikelihoodRating || ''), (x.InherentLikelihoodRatingID || ''),
          (x.InherentImpactRating || ''), (x.InherentImpactRatingID || ''), (x.OverallInherentRiskRating || ''),
          (x.ControlDescriptions || ''), (x.ControlEffectiveness || ''), (x.ResidualLikelihoodRating || ''), (x.ResidualLikelihoodRatingID || ''),
          (x.ResidualImpactRating || ''), (x.ResidualImpactRatingID || ''), (x.OverallResidualRiskRating || ''),
          (x.RiskTreatmentStrategyName || ''), x.RiskTreatmentStrategyID == 1 ?((x.ActionPlanItems || '')) : (x.RiskTolerateExplanation || ''),
          x.RiskTreatmentStrategyID == 1 ? (x.ActionItemOwner || ''): '', x.StartDate? dateToYMd(x.StartDate) : '', x.EndDate? dateToYMd(x.EndDate) : '',
          (x.SiteRiskAssessmentStatus || ''), x.CommentsHistory?.length > 0? (x.CommentsHistory[0].CommentBody || '') : '',
          x.IsRiskOwner ? this.getStatusRiskOwner(x.RiskAssessmentStatus) : this.getStatusBCMang(x.RiskAssessmentStatus, x)]
        );
      });
    });

    if (from == 1) this.gotConsolidatedReport.next(true);
    else this.gotDraftReport.next(true);
  }

  DownloadReport(ReportName: string) {
    this.openWait("Downloading...");
    const wb = XLSX.utils.book_new();
    let wbReady: BehaviorSubject<boolean> = new BehaviorSubject(false)

    this.FormatedReportData.forEach((eachA: any, dataIndex: any) => {
      const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.FormatedReportHeader.concat(eachA.risks));

      // ws['!freeze'] = { xSplit: 3, ySplit: 1 }

      ws["!merges"] = [
        XLSX.utils.decode_range("A1:A2"),
        XLSX.utils.decode_range("B1:B2"),
        XLSX.utils.decode_range("B3:B" + String(eachA.risks.length + 2)),
        XLSX.utils.decode_range("C1:C2"),
        XLSX.utils.decode_range("D1:D2"),
        XLSX.utils.decode_range("E1:E2"),
        XLSX.utils.decode_range("F1:H1"),
        XLSX.utils.decode_range("I1:I2"),
        XLSX.utils.decode_range("J1:J2"),
        XLSX.utils.decode_range("K1:K2"),
        XLSX.utils.decode_range("L1:L2"),
        XLSX.utils.decode_range("M1:M2"),
        XLSX.utils.decode_range("N1:N2"),
        XLSX.utils.decode_range("O1:O2"),
        XLSX.utils.decode_range("P1:P2"),
        XLSX.utils.decode_range("Q1:Q2"),
        XLSX.utils.decode_range("R1:R2"),
        XLSX.utils.decode_range("S1:S2"),
        XLSX.utils.decode_range("T1:T2"),
        XLSX.utils.decode_range("U1:U2"),
        XLSX.utils.decode_range("V1:V2"),
        XLSX.utils.decode_range("W1:W2"),
        XLSX.utils.decode_range("X1:X2"),
        XLSX.utils.decode_range("Y1:Y2"),
        XLSX.utils.decode_range("Z1:Z2"),
        XLSX.utils.decode_range("AA1:AA2"),
        XLSX.utils.decode_range("Y3:Y"   + String(eachA.risks.length + 2)),
        XLSX.utils.decode_range("Z3:Z"   + String(eachA.risks.length + 2)),
        XLSX.utils.decode_range("AA3:AA" + String(eachA.risks.length + 2)),
        XLSX.utils.decode_range("AB1:AB2"),
        XLSX.utils.decode_range("AC1:AC2")
      ];

      const centerAlignmentStyle = {
        alignment: { vertical: 'center' }
      };

      ws['!merges'].forEach((range: XLSX.Range) => {
        for (let R = range.s.r; R <= range.e.r; ++R) {
          for (let C = range.s.c; C <= range.e.c; ++C) {
            const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
            ws[cellAddress].s = centerAlignmentStyle;
          }
        }
      });

      const headerCellStyle = {
        font: { bold: true },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { rgb: 'C4D79B' } },  // Header background color
        alignment: { vertical: 'top' },
        border: {
          top: { style: 'thin', color: { rgb: '000000' } }, // Top border
          bottom: { style: 'thin', color: { rgb: '000000' } }, // Bottom border
          left: { style: 'thin', color: { rgb: '000000' } }, // Left border
          right: { style: 'thin', color: { rgb: '000000' } }, // Right border
        },
      };

      this.FormatedReportHeader.forEach((headers: any, rows: any) => {
        this.FormatedReportHeader[rows].forEach((header: any, i: any) => {
          const cellAddress = XLSX.utils.encode_cell({ r: rows, c: i });
          ws[cellAddress].s = headerCellStyle;
        });
      });

      const wscols = this.FormatedReportHeader[0].map((col: string, i: number) => {
        const dataWidth = Math.max(
          col.length,
          ...this.FormatedReportData.map((row: any) => (row[i] ? String(row[i]).length : 0))
        );

        const columnWidth = dataWidth > 45 ? 45 : dataWidth;

        return {
          wch: columnWidth,
          s: {
            ...(dataWidth > 45 && { alignment: { wrapText: true } }),
          },
        };
      });
      ws['!cols'] = wscols;

      const wscols1 = this.FormatedReportHeader[1].map((col: string, i: number) => {
        if (col && col.length > 0) {
          return {
            wch: 10,
            alignment: { vertical: 'top' }
          };
        }
        return wscols[i]
      });

      ws['!cols'] = wscols1;

      const wrapTextColumnIndices = [1, 2, 3, 4, 8, 14, 22, 23, 27, 28];

      const wscols2 = this.FormatedReportHeader[0].map((col: any, i: any) => {
        const isWrapTextColumn = wrapTextColumnIndices.includes(i);
        const maxColumnWidth = isWrapTextColumn
          ? Math.min(
            50,
            eachA.risks.reduce((maxWidth: any, row: any) => {
              const cellValue = row[i];
              const cellWidth = cellValue ? String(cellValue).length : 0;
              return Math.max(maxWidth, cellWidth);
            }, col.length)
          )
        : ![5, 6, 7].includes(i) ? Math.max(col.length, ...eachA.risks.map((row: any) => (row[i] ? String(row[i]).length : 0))) : 10;
        return {
          wch: maxColumnWidth,
          s: { alignment: { vertical: 'top' } }
        };
      });

      ws['!cols'] = wscols2;

      const statusStyles: any = [{ fill: { type: 'pattern', pattern: 'solid', fgColor: { rgb: 'da260b' } } }, {fill: { type: 'pattern', pattern: 'solid', fgColor: { rgb: 'f5991e' }}},{fill: { type: 'pattern', pattern: 'solid', fgColor: { rgb: '149d0b' }}}]
      for (var i in ws) {
        if (typeof ws[i] != 'object') continue;
        let cell = XLSX.utils.decode_cell(i);

        if (cell.r >= 2) {
          if (cell.c == 13 || cell.c == 9 || cell.c == 11 || cell.c == 15 || cell.c == 16 || cell.c == 18 || cell.c == 20) {
            if (ws[i].v == 'High' || ws[i].v == 'Major') {
              ws[i].s = statusStyles[0];
            } else if (ws[i].v == 'Medium' || ws[i].v == 'Moderate') {
              ws[i].s = statusStyles[1];
            } else if (ws[i].v == 'Minor' || ws[i].v == 'Low'){
              ws[i].s = statusStyles[2];
            }
          }

          if (!ws[i].s) {
            ws[i].s = {};
          }
          ws[i].s.alignment = {
            ...(ws[i].s.alignment || {}),
            wrapText: true,
          };
        }
      }

      ws['!protect'] = { selectLockedCells: true, selectUnlockedCells: true };
      XLSX.utils.book_append_sheet(wb, ws, ((dataIndex+1) + '-' + eachA.AssessmentName.substring(0,25)+'...'));

      if(this.FormatedReportData.length === (dataIndex + 1)) {
        wbReady.next(true);
      }
    });

    wbReady.subscribe((check: any) => {
      if (check) {
        let FullReportName = ReportName + '_'
          + this.datePipe.transform(new Date(), 'dd-MM-yyyy') + '_' + new Date().toLocaleTimeString() + '.xlsx'
        XLSX.writeFile(wb, FullReportName)
        this.closeWait();

        this.FormatedReportHeader = [];
        this.FormatedReportData = [];
        this.gotConsolidatedReport.next(false);
        this.gotDraftReport.next(false);
        wbReady.next(false);
      } else {
        this.closeWait();
      };
    });
  }
  // Consolidated Risks - end

  convertTime(timeString: any) {
    const [hours, minutes] = timeString.split(':').map(Number);
    const period = hours >= 12 ? 'pm' : 'am';
    const hour12 = (hours % 12) || 12;
    return `${hour12.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
  }
}
