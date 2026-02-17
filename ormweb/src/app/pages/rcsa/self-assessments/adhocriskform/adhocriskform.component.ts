import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GroupService } from 'src/app/services/rcsa/inherent-risk/group.service';
import { ProcessService } from 'src/app/services/rcsa/master/inherent-risk/process.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { RiskCategoryService } from 'src/app/services/rcsa/master/inherent-risk/risk-category.service';
import { InherentLikelihoodRankService } from 'src/app/services/rcsa/master/inherent-risk/inherent-likelihood-rate.service';
import { InherentImpactRateService } from 'src/app/services/rcsa/master/inherent-risk/inherent-impact-rate.service';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { ConfigScoreRatingService } from 'src/app/services/rcsa/master/common/config-score-rating.service';
import { SelfAssessmentsService } from 'src/app/services/rcsa/self-assessments/self-assessments.service';


@Component({
  selector: 'app-adhocriskform',
  templateUrl: './adhocriskform.component.html',
  styleUrls: ['./adhocriskform.component.scss']
})
export class AdhocriskformComponent implements OnInit {
  copy: any;
  groupDS: any;
  unitDS: any;
  unitsDS: any;
  processDS: any;
  riskCategoryDS: any;
  inherentLikelihoodDS: any;
  inherentImpactRatingDS: any;
  inherentRiskRatingDS: any;

  saveerror: string = "";
  masterForm = new FormGroup({
    ddlGroup: new FormControl(null, [Validators.required]),
    ddlUnit: new FormControl(null, [Validators.required]),
    ddlProcess: new FormControl(null),
    ddlRiskCategory: new FormControl(null, [Validators.required]),
    ddlInherentLikelihood: new FormControl(null, [Validators.required]),
    ddlInherentImpactRating: new FormControl(null, [Validators.required]),
    txtRisk: new FormControl('', [Validators.required]),
    txtRateId: new FormControl('')
  });
  constructor(
    private selfAssessmentsService: SelfAssessmentsService,
    private configScoreRatingService: ConfigScoreRatingService,
    private groupService: GroupService,
    private processService: ProcessService,
    private riskCategoryService: RiskCategoryService,
    private inherentLikelihoodRankService: InherentLikelihoodRankService,
    private inherentImpactRateService: InherentImpactRateService,
    public utils: UtilsService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AdhocriskformComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(DOCUMENT) private _document: any

  ) {
    if (data) {
      this.copy = JSON.parse(JSON.stringify(data));
    }
  }

  ngOnInit(): void {
    this.getPageLoadData();
  }

  getPageLoadData(): void {
    let obj = {};
    this.configScoreRatingService.getInherentRiskScreen(obj).subscribe(data => {
      next: {

        this.processGroup(data);
        this.processUnits(data);
        this.processProcessData(data);
        this.processRiskCategory(data);
        this.processInherentLikelihoodRating(data);
        this.processInherentImpactRating(data);
        if (this.copy.mode == "edit") {
          this.processUnit(data, false);
          this.setEditData();
        }
      }
    });

  }
  ngAfterViewInit(): void {

  }

  groupOnChange(data: any) {
    this.getActiveUnit(this.masterForm.get('ddlGroup')?.value ?? 0, 0);
    this.masterForm.patchValue({
      ddlUnit: null
    });
  }

  getActiveGroup(): void {
    this.groupService.getActive().subscribe(res => {
      next:
      this.processGroup(res);
    });

  }

  processUnits(data: any): void {
    if (data.success == 1) {
      if (data.result.recordset.Unit.length > 0) {
        this.unitsDS = data.result.recordset.Unit;
      }
    } else {
      if (data.error.errorCode == "TOKEN_EXPIRED")
        this.utils.relogin(this._document);
    }
  }

  processGroup(data: any): void {
    if (data.success == 1) {
      if (data.result.recordset.Group.length > 0) {
        this.groupDS = data.result.recordset.Group;
      }
    } else {
      if (data.error.errorCode == "TOKEN_EXPIRED")
        this.utils.relogin(this._document);
    }
  }

  getActiveUnit(id: number, defaultId: number): void {
    let obj = { "groupID": id };
    let uData = this.unitsDS.filter((s: any) => s.GroupID === id);
    this.processUnit(uData, true);
    if (defaultId > 0) {
      this.masterForm.patchValue({
        ddlUnit: this.copy.UnitID
      });
    }
  }

  processUnit(data: any, isdropdownChanged: any): void {
    if (this.copy.mode == "edit") {
      if (isdropdownChanged) {
        this.unitDS = data;
      }
      else {
        if (data.success == 1) {
          if (data.result.recordset.Unit.length > 0) {
            this.unitDS = data.result.recordset.Unit;
            let uData = this.unitsDS.filter((s: any) => s.GroupID === this.copy.GroupID);
            if (uData.length > 0)
              this.unitDS = uData;
          }
        } else {
          if (data.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
        }
      }
    }
    else
      this.unitDS = data;
  }

  getActiveProcess(): void {
    this.processService.getActive().subscribe(res => {
      next:
      this.processProcessData(res);
    });
  }

  processProcessData(data: any): void {
    if (data.success == 1) {
      if (data.result.recordset.Process.length > 0) {
        this.processDS = data.result.recordset.Process;
      }
    } else {
      if (data.error.errorCode == "TOKEN_EXPIRED")
        this.utils.relogin(this._document);
    }
  }
  getActiveRiskCategory(): void {
    this.riskCategoryService.getActive().subscribe(res => {
      next:
      this.processRiskCategory(res);
    });

  }
  processRiskCategory(data: any): void {
    if (data.success == 1) {
      if (data.result.recordset.RiskCategory.length > 0) {
        this.riskCategoryDS = data.result.recordset.RiskCategory;
      }
    } else {
      if (data.error.errorCode == "TOKEN_EXPIRED")
        this.utils.relogin(this._document);
    }
  }
  getActiveInherentLikelihoodRating(): void {
    this.inherentLikelihoodRankService.getActive().subscribe(res => {
      next:
      this.processInherentLikelihoodRating(res);
    });

  }
  processInherentLikelihoodRating(data: any): void {
    if (data.success == 1) {
      if (data.result.recordset.InherentLikelihood.length > 0) {
        this.inherentLikelihoodDS = data.result.recordset.InherentLikelihood;
      }
    } else {
      if (data.error.errorCode == "TOKEN_EXPIRED")
        this.utils.relogin(this._document);
    }
  }
  getActiveInherentImpactRating(): void {
    this.inherentImpactRateService.getActive().subscribe(res => {
      next:
      this.processInherentImpactRating(res);
    });

  }
  processInherentImpactRating(data: any): void {
    if (data.success == 1) {
      if (data.result.recordset.InherentImpactRating.length > 0) {
        this.inherentImpactRatingDS = data.result.recordset.InherentImpactRating;
      }
    } else {
      if (data.error.errorCode == "TOKEN_EXPIRED")
        this.utils.relogin(this._document);
    }
  }

  setEditData(): void {
    this.masterForm.patchValue({
      ddlGroup: this.copy.GroupID,
      ddlUnit: this.copy.UnitID,
      ddlProcess: this.copy.ProcessID,
      ddlRiskCategory: this.copy.RiskCategoryID,
      ddlInherentLikelihood: this.copy.InherentLikelihoodID,
      ddlInherentImpactRating: this.copy.InherentImpactRatingID,
      txtRisk: this.copy.Risk,
      txtRateId: this.copy.InherentRisksID,
    });

  }


  validateSave(): void {
    let obj: any = {
      "unitID": this.masterForm.get('ddlUnit')?.value,
      "processID": this.masterForm.get('ddlProcess')?.value,
      "riskCategoryID": this.masterForm.get('ddlRiskCategory')?.value,
      "inherentLikelihoodID": this.masterForm.get('ddlInherentLikelihood')?.value,
      "inherentImpactRatingID": this.masterForm.get('ddlInherentImpactRating')?.value,
      "risk": this.masterForm.get('txtRisk')?.value,
      "scheduleAssessmentID": this.data.scheduleAssessmentID
    };
    if (this.masterForm.get('txtRateId')?.value == "" || this.masterForm.get('txtRateId')?.value == null) {
      this.selfAssessmentsService.addAdhocrisk(obj).subscribe(res => {
        next:
        if (res.success == 1) {
          this.dialogRef.close(true);
          this.saveSuccess(res.message);
        } else {
          if (res.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
          else
            this.saveerror = res.error.errorMessage;
        }
        error: (err: any) =>
        console.log("err::", err);
      });
    }
    else {
      obj.id = this.masterForm.get('txtRateId')?.value;
      this.selfAssessmentsService.updateAdhocrisk(obj).subscribe(res => {
        next:
        if (res.success == 1) {
          this.dialogRef.close(true);
          this.saveSuccess(res.message);
        } else {
          if (res.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
          else
            this.saveerror = res.error.errorMessage;
        }
        error: (err: any) =>
        console.log("err::", err);
      });
    }
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

    confirm.afterOpened().subscribe(result => {
      setTimeout(() => {
        confirm.close();
      }, timeout)
    });
  }

}

