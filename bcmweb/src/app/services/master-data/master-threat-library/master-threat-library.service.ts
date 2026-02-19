import { Inject, Injectable, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RestService } from '../../rest/rest.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { UtilsService } from '../../utils/utils.service';
import { DOCUMENT } from '@angular/common';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { addIndex } from 'src/app/includes/utilities/commonFunctions';
import { MatSort } from '@angular/material/sort';

export interface ThreatLibraryList {
  Index: number;
  Code: string;
  Issue: string;
  ThreatCategory: string;
  ImpactOnCIA: string;
  RiskOwner: string;
}

export interface currentControlsList {
  Index: number;
  ThreatLibraryControlsID: any;
  Description: string;
  isEdit: boolean;
}

@Injectable({
  providedIn: 'root'
})

export class MasterThreatLibraryService extends RestService {
  public master!: any;
  public TableTL!: MatTableDataSource<ThreatLibraryList>;
  public TableCC!: MatTableDataSource<currentControlsList>;
  @ViewChild(MatSort) sort!: MatSort;

  public infoData!: any;
  public riskCodeFormat!: any;

  public gotMaster: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public gotMasterThreatInfoData: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private utils: UtilsService,
    private _http: HttpClient,
    private _dialog: MatDialog,
    @Inject(DOCUMENT) private _document: any) {
    super(_http, _dialog);
  }

  getThreatMaster(): void {
    if (environment.dummyData) {
      this.processThreatLibraryList({
        "success": 1,
        "message": "Data fetch from DB successful.",
        "result": {
          "ThreatMasterList":
            [{
              "RiskID": "3",
              "RiskTitle": "test risk",
              "RiskDescription": "test risk description",
              "RiskCode": "2024-Q1-01",
              "Controls": "[{\"ThreatLibraryControlsID\":1,\"Description\":\"test control1\"},{\"ThreatLibraryControlsID\":2,\"Description\":\"test control2\"}]",
              "ThreatCategoryID": 1,
              "ThreatCategory": "Category1",
              "RiskImpact": "[{\"ImpactID\":1,\"Impact\":\"Confidentiality\"}]",
              "RiskOwnerID": "C83496D1-4267-EE11-B013-000C296CF4F3",
              "RiskOwner": "Sinchana  Raj"
            }]
        }
      });
    }
    else {
      this.post("/business-continuity-management/master/threat-library/get-threat-master", {}).subscribe(res => {
        next:
        if (res.success == 1) {
          this.processThreatLibraryList(res)
        } else {
          if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
          else
            this.popupInfo("Unsuccessful", res.error.errorMessage)
        }
      });
    }
  }

  processThreatLibraryList(response: any): void {
    this.master = response.result;
    this.master.ThreatMasterList = this.master.ThreatMasterList.map((x: any) => {
      x.RiskImpact = ((JSON.parse(x.RiskImpact) || []).sort((a:any,b:any) => a.ImpactID - b.ImpactID));
      x.RiskImpactCode = (x.RiskImpact || []).map((c: any) => c.Code).join('');
      x.Controls = (JSON.parse(x.Controls) || []);
      return x;
    });
    this.TableTL = new MatTableDataSource(addIndex(this.master.ThreatMasterList, false));
    this.TableTL.sort = this.sort;
    this.gotMaster.next(true);
  }

  deleteThreatLibrary(threat: any) {
    return this.post("/business-continuity-management/master/threat-library/delete-threat-master", {
      "data": {
        "riskId": threat.RiskID,
      },
    });
  }

  getThreatMasterInfo() {
    if (environment.dummyData) {
      this.processAddEditThreat({
        "success": 1,
        "message": "Data fetch from DB successful.",
        "result": {
          "ThreatCategoryMaster": [{
            "ThreatCategoryID": 1,
            "ThreatCategory": "Information Security Controls",
          },
          {
            "ThreatCategoryID": 2,
            "ThreatCategory": "Category2",
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
          "riskOwnersList": [{
            "riskOwnerID": 1,
            "riskOwnerName": "IT",
          },
          {
            "riskOwnerID": 2,
            "riskOwnerName": "Cyber",
          }],
          "RiskCodeDetails": [{						//Based on CurrentDate sent from UI
            "Year": 2024,
            "Quater": 1,
            "ThreatsCount": 5
          }]
        }
      })
    } else {
      let data = {
        'currentDate': new Date()
      }
      this.post("/business-continuity-management/master/threat-library/get-threat-master-info", { data }).subscribe(res => {
        next:
        if (res.success == 1) {
          this.processAddEditThreat(res)
        } else {
          if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
          else
            this.popupInfo("Unsuccessful", res.error.errorMessage)
        }
      });
    }
  }

  processAddEditThreat(response: any): void {
    this.infoData = response.result;
    this.riskCodeFormat = this.infoData.RiskCodeDetails;
    this.infoData.ThreatImpactMaster = ((this.infoData.ThreatImpactMaster || []).sort((a:any,b:any) => a.ThreatImpactID - b.ThreatImpactID));
    this.gotMasterThreatInfoData.next(true)
  }

  addOrUpdateThreatLibrary(riskId: any, formData: any, controls: any, selectedImpacts: any, mode: any, from: any, assessmentId:any, ThreatRiskID: any) {
    let Impacts = this.infoData.ThreatImpactMaster.filter((x: any) => selectedImpacts.includes(x.ThreatImpactID)).map((y: any) => ({ "ImpactID": y.ThreatImpactID, "ImpactName": y.ThreatImpact }));
    let impacts = controls.map((x: any) => ({ "ControlID": x.ThreatLibraryControlsID, "Control": x.Description }));
    let data = {
      "riskId":  (from != 2 ? riskId : ThreatRiskID),
      "riskTitle": formData.riskTitle.value,
      "threatCategoryId": formData.threadCategoryId.value,
      "impacts": Impacts,
      "riskDescription": formData.riskDescription.value,
      "controls": impacts,
      "riskOwnerId": formData.riskOwnerId.value,
      "riskCode": from != 2 ? formData.riskCode.value : null,
      "controlEffectivenessId": from != 2 ? formData.effectivenessCC.value : null
    } as any
    if(from == 2){
      data["siteRiskAssessmentId"] = assessmentId;
    }
    return this.post(from == 1 ? (mode == "Add" ? "/business-continuity-management/master/threat-library/add-threat-master" : "/business-continuity-management/master/threat-library/update-threat-master"): (mode == "Add" ? "/business-continuity-management/site-risk-assessments/add-new-custom-threat" : "/business-continuity-management/site-risk-assessments/update-new-custom-threat"), { "data": data });
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
