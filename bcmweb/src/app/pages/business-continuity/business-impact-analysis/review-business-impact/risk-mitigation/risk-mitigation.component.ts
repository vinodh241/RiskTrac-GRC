import { DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { BusinessContinuityPlansService } from 'src/app/services/business-continuity-plans/business-continuity-plans.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-risk-mitigation',
  templateUrl: './risk-mitigation.component.html',
  styleUrls: ['./risk-mitigation.component.scss']
})

export class RiskMitigationComponent {

  @Input() riskMitigationFlag: any
  @Output() dataRiskSaved = new EventEmitter<boolean>();
  @Output() checkRiskMitigationDataChanges = new EventEmitter<any>();

  riskForm!: FormGroup
  affectedProcess: any;
  impactListData: any;
  likelihood: any;
  blockEdit: boolean = false;
  criticalData: any;
  criticalExists: any;
  description: any;
  businessProcessID: any;
  disableSave: boolean = false
  displayedColumnsRM = ['Index', 'Potential', 'AffectedProcess', 'ImpactData', 'Likelihood', 'Risk', 'Contingency', 'Treatment', 'Action'];
  displayedColumnsRMV = ['Index', 'Potential', 'AffectedProcess', 'ImpactData', 'Likelihood', 'Risk', 'Contingency', 'Treatment'];
  impactID: any;
  riskRating: any;
  listingBCP: any;
  allViewDetails: any;
  saveerror: any;
  controlMode: string = "Add";
  workFlowStatus: any;
  workFlowStatusID: any;
  currentStatus: any;
  likelyhoodFlag: boolean = false;
  isavedParam: any;
  riskData:any[] =[];
  riskID:any
  editData:any
  constructor(
    public businessContinuityService: BusinessContinuityPlansService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    @Inject(DOCUMENT) private _document: any,
    public utils: UtilsService,
  ) {
    this.businessContinuityService.getRiskInfo(Number(localStorage.getItem("BusinessContinuityPlanID")), Number(localStorage.getItem("BusinessFunctionID")))
    this.businessContinuityService.processRiskSubj.subscribe((value) => {
      if (value) {
        this.affectedProcess  = this.businessContinuityService.processRiskData.AffectedProcesslist || []
        this.impactListData   = this.businessContinuityService.processRiskData.ImpactList || []
        this.likelihood       = this.businessContinuityService.processRiskData.LikelihoodList || []
        let IsBCCValidUser    = Number(localStorage.getItem("IsBCCValidUser"))
        this.allViewDetails   = this.businessContinuityService.processRiskData.RiskMitigationLists || []
        this.riskData         = this.businessContinuityService.processRiskData.RiskMitigationLists || [];
        this.isavedParam      = this.businessContinuityService.processRiskData.RiskMitigationLists[0]?.IsSaved
        this.dataRiskSaved.emit(this.businessContinuityService.dataRiskSaved)
        this.currentStatus    = Number(localStorage.getItem("CurrentWorkFlowStatusID"));
        if (IsBCCValidUser == 1 && (this.currentStatus == 7 || this.currentStatus == 2 || this.currentStatus == 1)) {
          this.listingBCP = false;
        } else {
          this.listingBCP = true;
        }
        if (this.allViewDetails?.length > 0) {
          this.patchValue(this.allViewDetails)
        }
      }
    })
    this.workFlowStatus = localStorage.getItem("WorkFlowStatus")
    this.workFlowStatusID = localStorage.getItem("WorkFlowStatusID")

  }

  ngOnInit() {
    this.businessContinuityService.TableRMBIA = new MatTableDataSource();
    this.businessContinuityService.TableRMV = this.allViewDetails
    this.businessContinuityService.TableRMV = new MatTableDataSource();
    this.initialze()
  }

  initialze() {
    this.riskForm = this.fb.group({
      Potential: ['', [Validators.required, Validators.maxLength(500)]],
      Process: ['', Validators.required],
      Impact: ['', Validators.required],
      Likelihood: ['', Validators.required],
      Measures: ['', [Validators.required, Validators.maxLength(500)]],
      Treatment: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  patchValue(data: any) {
    setTimeout(() => {
      this.businessContinuityService.TableRMBIA = new MatTableDataSource(this.businessContinuityService.addIndex(data, true))
    }, 1000);
  }

  cancel(Critical: any) {
    this.editData = [];
    this.blockEdit = false;
    this.businessContinuityService.TableRMBIA.data.forEach((x: any) => {
      x.isEdit = false;
    });

    if (this.controlMode == "Edit") {
      this.businessContinuityService.TableRMBIA._updateChangeSubscription();
    } else {
      const index = this.businessContinuityService.TableRMBIA.data.indexOf(Critical.index);
      this.businessContinuityService.TableRMBIA.data.splice(index, 1);
      this.businessContinuityService.TableRMBIA._updateChangeSubscription();
    }
  }

  save(data: any) {
    console.log('data: ', data);
    this.blockEdit = false;
    data.isEdit = false;
    let procID = this.affectedProcess.filter((ele: any) => ele.BusinessActivity == this.riskForm.value.Process)[0].BusinessActivityID
    let impTypeID = this.impactListData.filter((ele: any) => ele.Impact == this.riskForm.value.Impact)[0].ImpactID
    let likelihoodID = this.likelihood.filter((ele: any) => ele.Likelihood == this.riskForm.value.Likelihood)[0].LikelihoodID

    this.businessContinuityService.TableRMBIA.data =
      this.businessContinuityService.TableRMBIA.data.map((x: any) =>
        x.Index === data.Index
          ? {
            ...x,
            PotentialData: this.riskForm.value.Potential,
            AffectedProcess: this.riskForm.value.Process,
            AffectedProcID: procID,
            ImpactID: impTypeID,
            Likelihood: this.riskForm.value.Likelihood,
            LikelyhoodID: likelihoodID,
            Impact: this.riskForm.value.Impact,
            Risk: this.riskRating,
            RiskID: this.riskID,
            Contingency: this.riskForm.value.Measures,
            Treatment: this.riskForm.value.Treatment,
          }
          : x
      );
    this.riskMitigationFlag = true
    console.log('this.businessContinuityService.TableRMBIA: ', this.businessContinuityService.TableRMBIA);

    this.businessContinuityService.TableRMBIA._updateChangeSubscription();
  }

  addRisk() {
    this.blockEdit = true;
    this.controlMode = "Add"
    this.riskForm.get('Likelihood')?.disable();
    this.riskForm.get('Potential')?.reset();
    this.riskForm.get('Process')?.reset();
    this.riskForm.get('Impact')?.reset();
    this.riskForm.get('Likelihood')?.reset();
    this.riskForm.get('Measures')?.reset();
    this.riskForm.get('Treatment')?.reset();
    this.businessContinuityService.TableRMBIA.data.push({ "Index": this.businessContinuityService.TableRMBIA.data.length + 1, "PotentialData": null, "AffectedProcess": '', 'Impact': '', 'Likelihood': '', 'RiskRating': '','Risk':'', 'Contingency': '', 'Treatment': '', "isEdit": true });
    this.businessContinuityService.TableRMBIA._updateChangeSubscription();
    this.riskMitigationFlag = true
    this.riskRating = ""
  }

  onSelectLikelihood(id: any) {
    let data = {
      "riskRatingType": 1,
      "LikelihoodRatingId": id,
      "ImpactRatingId": this.impactID
    }

    this.businessContinuityService.getOverallRiskRating(data).subscribe(res => {
      if (res.success == 1) {
        this.riskRating = res.result.RiskRating
        this.riskID = res.result.OverallRiskRatingID
        this.saveerror =''
      }else{
      this.saveerror = res.error.errorMessage;
      this.riskRating = ""
      this.riskID = ''
      }
    })
    this.riskMitigationFlag = true
  }

  onSelectImpact(id: any) {
    this.impactID = id
    this.likelyhoodFlag = false
    this.riskForm.controls["Likelihood"]?.enable()
    this.riskForm.controls["Likelihood"].reset();
    this.riskRating = ""
  }

  editRisk(control: any) {

    this.editData = [control];
    console.log('✌️control --->', control);
    this.blockEdit = true;
    control.isEdit = true;
    this.controlMode = "Edit"
    setTimeout(() => {
      this.riskForm.patchValue({
        Potential: control.PotentialData,
        Process: control.AffectedProcess,
        Impact: control.Impact,
        Likelihood: control.Likelihood,
        Measures: control.Contingency,
        Treatment: control.Treatment,
      })
      this.riskRating = control.Risk
    }, 1000);
    this.riskMitigationFlag = true
  }

  onSubmit() {
    let output = this.modifyData(this.businessContinuityService.TableRMBIA.data, Number(localStorage.getItem("BusinessContinuityPlanID")));
    this.businessContinuityService.addRiskMitigation(output).subscribe((res) => {
      if (res.success == 1) {
        // this.dialog.close(true);
        this.saveSuccess('Risk Mitigation saved successfully');
      } else {
        if (res.error.errorCode && res.error.errorCode == 'TOKEN_EXPIRED')
          this.utils.relogin(this._document);
        else this.saveerror = res.error.errorMessage;
      }
      error: console.log('err::', 'error');
    });
    this.riskMitigationFlag = true
  }

  modifyData(inputData: any, businessContinuityID: any) {
    console.log('inputData: ', inputData);
    let payload = {
      BusinessContinuityPlanID: businessContinuityID,
      BusinessFunctionID: Number(localStorage.getItem("BusinessFunctionID")),
      RiskMitigationData: inputData.map((item: any) => {
        return {
          RiskMitigartionId: item.RiskMitigatonID ? item.RiskMitigatonID : null,
          PotentialFailure: item.PotentialData,
          BusinessProcessID: item.AffectedProcID ? item.AffectedProcID : item.AffectedProcessID,
          ImpactId: item.ImpactID,
          LikelihoodID: item.LikelyhoodID ? item.LikelyhoodID : item.LikelihoodID,
          Risk: item.RiskID,
          ContingencyMeasures: item.Contingency,
          TreatmentPlan: item.Treatment
        };
      }),
    }
    return payload;
  }

  saveSuccess(content: string): void {
    const timeout = 3000; // 3 Seconds
    const confirm = this.dialog.open(InfoComponent, {
      id: 'InfoComponent',
      disableClose: true,
      minWidth: '5vh',
      panelClass: 'success',
      data: {
        title: 'Success',
        content: content,
      },
    });

    confirm.afterOpened().subscribe((result: any) => {
      setTimeout(() => {

        this.businessContinuityService.getRiskInfo(localStorage.getItem("BusinessContinuityPlanID"), Number(localStorage.getItem("BusinessFunctionID")))
        confirm.close();
      }, timeout);
    });
    this.riskMitigationFlag = true
  }

  isAnyTableInvalid(): boolean {
    let allIDsIncluded = this.businessContinuityService.TableRMBIA.data.some(entry => entry.PotentialData !== "" && entry.AffectedProcess !== "" && entry.Impact !== "" && entry.Likelihood !== "" && entry.Risk !== "" && entry.Contingency !== "" && entry.Treatment !== "");

    if (allIDsIncluded && !this.blockEdit) {
      return false
    }
    return true;
  }

  isSaveDisable() {
    const actionItems = this.riskForm?.value;
    if (actionItems) {
      if ((actionItems.Potential?.length > 0) && (actionItems.Potential?.length <= 500) && (actionItems.Process?.length > 0) &&
        (actionItems.Impact?.length > 0) && (actionItems.Likelihood?.length > 0) && (actionItems.Treatment?.length > 0) && (actionItems.Treatment?.length <= 500) && (actionItems.Measures?.length > 0) && (actionItems.Measures?.length <= 500)) {
        return true;
      }
    }
    return false;
  }

  async compareRiskMitigationData() {
    const responseData = this.riskData.filter((record:any) =>
      Object.values(record).every(value => value !== "" && value !== null && value !== undefined)
    );

    if(this.businessContinuityService.TableRMBIA.data.length != responseData.length) {
      this.checkRiskMitigationDataChanges.emit(true);
      return true;
    }
    if (this.businessContinuityService.TableRMBIA.data.length === 0 && responseData.length === 0) {
      this.checkRiskMitigationDataChanges.emit(false);
      return false;
    }

    let hasChanges   = this.isDataChanged(this.businessContinuityService.TableRMBIA.data, responseData);
    this.checkRiskMitigationDataChanges.emit(hasChanges);
    return hasChanges;
  }

  private isDataChanged(newData: any, oldData: any): boolean {

    if(this.blockEdit)  {
      return true
    }

    if(newData.length != oldData.length) {
      return true;
    }

    oldData.sort((a:any, b:any) => a.RiskMitigatonID - b.RiskMitigatonID);
    newData.sort((a:any, b:any) => a.RiskMitigatonID - b.RiskMitigatonID);

    for (let i = 0; i < newData.length; i++) {
      const newItem = newData[i];
      const oldItem = oldData[i];
      if (newItem.AffectedProcessID !== oldItem.AffectedProcessID || newItem.Contingency !== oldItem.Contingency || newItem.ImpactID !== oldItem.ImpactID
        || newItem.LikelihoodID !== oldItem.LikelihoodID || newItem.PotentialData !== oldItem.PotentialData || newItem.Risk !== oldItem.Risk || newItem.Treatment !== oldItem.Treatment) {
        return true;
      }
    }

    return false;
  }

}
