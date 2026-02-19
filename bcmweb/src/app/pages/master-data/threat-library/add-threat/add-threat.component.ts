import { DOCUMENT } from '@angular/common';
import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { MasterThreatLibraryService } from 'src/app/services/master-data/master-threat-library/master-threat-library.service';
import { RestService } from 'src/app/services/rest/rest.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { addIndex } from 'src/app/includes/utilities/commonFunctions';
import { AssessmentRiskListing } from 'src/app/services/site-risk-assessments/assessment-risk-listing.service';

@Component({
  selector: 'app-add-threat',
  templateUrl: './add-threat.component.html',
  styleUrls: ['./add-threat.component.scss']
})

export class AddThreatComponent implements OnInit {

  @ViewChild('autoCompleteInput', { read: MatAutocompleteTrigger })
  autoComplete!: MatAutocompleteTrigger;
  mode: any = '';
  threadData: any = {};
  defineThreatLibraryForm!: FormGroup;
  selectedImpactIDs: any = [];
  displayedColumnsCC = ['Index', 'Description', 'Action'];
  controlData: any = '';
  blockEdit: boolean = false;
  submitted: boolean = false;
  saveerror = "";
  filteredOwners: any[] = [];
  threadList: any[] = [];
  isOwnerExists: boolean = false;
  isThreadExists: boolean = false;
  controlExists: boolean = false;
  controlMode: string = "Add";
  isIssueExists: boolean = false;
  controlSubmit: boolean = false;

  constructor(
    private fb: FormBuilder,
    public utils: UtilsService,
    public dialog: MatDialog,
    @Inject(DOCUMENT) private _document: any,
    @Inject(MAT_DIALOG_DATA) public parent: any,
    public service: MasterThreatLibraryService,
    public riskService: AssessmentRiskListing,
    public dialogRef: MatDialogRef<AddThreatComponent>,
    private rest: RestService
  ) {
    this.rest.openWait("Fetching Data ...");
    this.service.getThreatMasterInfo();
    this.initializeForm();
  }

  ngOnInit(): void {
    this.mode = this.parent.mode;
    this.threadData = this.parent.selectedThread;
    this.service.gotMasterThreatInfoData.subscribe((value: any) => {
      if (value) {
        this.filteredOwners = this.service.infoData.RiskOwnersList;
        this.threadList = this.service.infoData.ThreatCategoryMaster;
        if (this.mode == 'Edit') {
          this.service.TableCC = new MatTableDataSource(addIndex((this.threadData.Controls || []), true));
          this.selectedImpactIDs = (this.threadData.RiskImpact || []).map((threat: any) => threat.ImpactID);
          this.initializeForm();
          this.patchData();
          this.rest.closeWait();
        } else {
          this.service.TableCC = new MatTableDataSource();
          if (this.parent.from == 2) {
            this.patchRiskUser();
          }
          setTimeout(() => {
            this.rest.closeWait();
          }, 1000);
        }
        if (this.parent.from == 1 && this.service.TableCC.data?.length == 0) {
          this.defineThreatLibraryForm.get('effectivenessCC')!.disable();
          this.defineThreatLibraryForm.get('effectivenessCC')!.reset();
        } else {
          this.defineThreatLibraryForm.get('effectivenessCC')!.enable();
        }
      }
    })
    window.addEventListener('scroll', this.scrollEvent, true);
  }

  scrollEvent = (event: any): void => {
    // if (this.autoComplete.panelOpen) this.autoComplete.closePanel();  // dropdown will get closed on scroll
    if (this.autoComplete) this.autoComplete.updatePosition(); // update the postion on scroll
  };

  patchData() {
    setTimeout(() => {
      this.defineThreatLibraryForm.patchValue({
        riskTitle: this.threadData.RiskTitle,
        riskCode: this.threadData.RiskCode,
        threadCategoryId: this.threadData.ThreatCategoryID,
        threadCategory: this.threadData.ThreatCategory,
        riskDescription: this.threadData.RiskDescription,
        riskOwnerId: this.threadData.RiskOwnerID,
        riskOwnerName: this.threadData.RiskOwner,
        effectivenessCC: this.threadData.ControlEffectivenessID
      });
    }, 1000);

    if (this.mode == "Edit" && this.defineThreatLibraryForm.get('riskCode')) {
      this.defineThreatLibraryForm.get('riskCode')!.disable();
    }

    if (this.parent.from == 1 && this.threadData.isThreatLinkedToAssessment) {
      this.defineThreatLibraryForm.disable();
      this.defineThreatLibraryForm.get('riskOwnerName')!.enable();
    }
  }

  patchRiskUser() {
    let localUserGUID = localStorage.getItem("userguid");
    setTimeout(() => {
      this.defineThreatLibraryForm.patchValue({
        riskOwnerId: localUserGUID,
        riskOwnerName: this.service.infoData.RiskOwnersList.filter((x: any) => x.RiskOwnerID == localUserGUID)[0].RiskOwnerName
      });
    }, 1000);
  }

  initializeForm() {
    this.defineThreatLibraryForm = this.fb.group({
      riskTitle: ["", [Validators.required]],
      riskCode: [{ value: "", disabled: true }, [Validators.required]],
      threadCategoryId: ["", [Validators.required]],
      threadCategory: ["", [Validators.required]],
      riskDescription: ["", [Validators.required]],
      riskOwnerId: ["", [Validators.required]],
      riskOwnerName: ["", [Validators.required]],
      effectivenessCC: [null]
    });
    if (this.parent.from == 2) {
      this.defineThreatLibraryForm.get('riskCode')!.clearValidators();
      this.defineThreatLibraryForm.get('riskOwnerName')?.disable();
    }
  }

  checkIssueExist(e: any) {
    if (this.threadData)
      this.isIssueExists = this.parent.allTreats.some((x: any) => x.RiskTitle.toLowerCase().trim() == (e.target.value).toLowerCase().trim() && (x.RiskID !== this.threadData.RiskID));
    else
      this.isIssueExists = this.parent.allTreats.some((x: any) => x.RiskTitle.toLowerCase().trim() == (e.target.value).toLowerCase().trim());
  }

  filterOwners(event: any): void {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredOwners = (this.service.infoData.RiskOwnersList || []).filter((owner: any) => owner.RiskOwnerName.toLowerCase().includes(searchTerm));
    this.defineThreatLibraryForm.controls['riskOwnerId'].setValue("");
    this.isOwnerExists = false;
  }

  setOwnerID(owner: any) {
    this.defineThreatLibraryForm.controls['riskOwnerId'].setValue(owner.RiskOwnerID);
  }

  filterThread(event: any): void {
    const searchTerm = event.target.value.toLowerCase();
    this.threadList = (this.service.infoData.ThreatCategoryMaster || []).filter((x: any) => x.ThreatCategory.toLowerCase().includes(searchTerm));
    this.defineThreatLibraryForm.controls['threadCategoryId'].setValue("");
    this.isThreadExists = false;
  }

  setThreadID(thread: any) {
    this.defineThreatLibraryForm.controls['threadCategoryId'].setValue(thread.ThreatCategoryID);
  }

  get f() {
    return this.defineThreatLibraryForm.controls
  }

  isImpactChecked(impactId: any) {
    if (this.mode == 'Edit')
      return this.selectedImpactIDs.includes(impactId);
    else
      return false
  }

  storeImpact(impactId: any) {
    if ((this.selectedImpactIDs || []).includes(impactId)) {
      const index = this.selectedImpactIDs.indexOf(impactId);
      this.selectedImpactIDs.splice(index, 1);
    } else {
      this.selectedImpactIDs.push(impactId)
    }
  }

  editControl(control: any) {
    this.controlMode = "Edit"
    this.blockEdit = true;
    control.isEdit = true;
    this.controlData = control.Description;
  }

  deleteControl(control: any) {
    const index = this.service.TableCC.data.findIndex(item => item.Index === control.Index);
    if (index !== -1) {
      this.service.TableCC.data.splice(index, 1);
    }
    this.service.TableCC.data = addIndex(this.service.TableCC.data, false);
    this.service.TableCC._updateChangeSubscription();
    this.addEffectivenessCCValiation();
  }

  addControl() {
    this.controlData = "";
    this.blockEdit = true;
    this.controlMode = "Add";
    this.service.TableCC.data.push({ "Index": this.service.TableCC.data.length + 1, "ThreatLibraryControlsID": null, "Description": "", "isEdit": true });
    this.service.TableCC._updateChangeSubscription();
    this.scrollDown('controlsDiv')
  }

  cancel(control: any) {
    this.blockEdit = false;
    this.controlExists = false;
    this.controlSubmit = false;
    this.service.TableCC.data.forEach((x: any) => {
      x.isEdit = false;
    });
    if (this.controlMode == "Edit" || control.ThreatLibraryControlsID) {
      this.service.TableCC._updateChangeSubscription();
    } else {
      const index = this.service.TableCC.data.indexOf(control.index);
      this.service.TableCC.data.splice(index, 1);
      this.service.TableCC._updateChangeSubscription();
    }
    this.controlMode = "";
    this.addEffectivenessCCValiation();
  }

  onChange(e: any) {
    this.controlData = e.target.value;
    this.controlExists = this.service.TableCC.data.some((x: any) => (x.Description.trim().toLowerCase() === this.controlData.trim().toLowerCase()) && (!x.isEdit))
  }

  saveControl(control: any) {
    this.controlSubmit = false;
    if (this.controlExists)
      return
    this.blockEdit = false;
    control.isEdit = false;
    this.service.TableCC.data = this.service.TableCC.data.map((x: any) =>
      x.Index === control.Index ? { ...x, Description: this.controlData } : x
    );
    this.controlData = "";
    this.addEffectivenessCCValiation();
  }

  checkControlSave(data: any) {
    return data.some((x: any) => x.isEdit);
  }

  checkCCLenght() {
    return this.service.TableCC && this.service.TableCC.data.length > 0;
  }

  addEffectivenessCCValiation() {
    const effectivenessCCControl = this.defineThreatLibraryForm.get('effectivenessCC');

    if (this.service.TableCC && this.service.TableCC.data.length > 0) {
      effectivenessCCControl!.setValidators([Validators.required]);
    } else {
      effectivenessCCControl!.clearValidators();
    }

    effectivenessCCControl!.updateValueAndValidity();

    if (this.service.TableCC.data?.length == 0) {
      this.defineThreatLibraryForm.get('effectivenessCC')!.disable();
      this.defineThreatLibraryForm.get('effectivenessCC')!.reset();
    } else {
      this.defineThreatLibraryForm.get('effectivenessCC')!.enable();
    }
  }

  getTooltipData() {
    return (this.service.TableCC && this.service.TableCC.data?.length == 0)? `Please add the "Current Controls" if any exist, to further assess and select the "Effectiveness of Current Controls."`:'';
  }

  onSubmit() {
    this.submitted = true;
    if (this.blockEdit)
      this.controlSubmit = true;

    if (this.defineThreatLibraryForm.get('riskOwnerId')?.value.length == 0 && this.defineThreatLibraryForm.get('riskOwnerName')?.value.length > 0) {
      this.isOwnerExists = true;
      return;
    }

    if (this.defineThreatLibraryForm.invalid || this.selectedImpactIDs && this.selectedImpactIDs.length == 0 || this.blockEdit || this.isIssueExists || this.controlSubmit)
      return

    this.service.addOrUpdateThreatLibrary(this.mode == "Add" ? null : this.threadData.RiskID, this.defineThreatLibraryForm.controls, this.service.TableCC.data, this.selectedImpactIDs, this.mode, this.parent.from, this.riskService?.selectedSiteAssessment.value, this.mode == "Add" ? null : this.threadData?.ThreatRiskID).subscribe((res: any) => {
      next:
      if (res.success == 1) {
        this.dialogRef.close(true);
        this.resetThreat();
        this.saveSuccess(this.parent.from == 1 ? (this.mode == "Add" ? "Thread Library Added Successfully" : "Thread Library Updated Successfully") : (this.mode == "Add" ? "Risk Added Successfully" : "Risk Updated Successfully"));
        if (this.parent.from != 2) {
          this.service.processThreatLibraryList(res);
        } else {
          this.riskService.processRiskListData(res);
        }
      } else {
        if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
          this.utils.relogin(this._document);
        else
          this.saveerror = res.error.errorMessage;
      }
    });
  }

  resetThreat() {
    this.defineThreatLibraryForm.reset();
    this.selectedImpactIDs = [];
    this.service.TableCC = new MatTableDataSource();
    this.blockEdit = false;
    this.isOwnerExists = false;
    this.isThreadExists = false;
    this.filteredOwners = [];
    this.isIssueExists = false;
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
        if (this.parent.from != 2) {
          this.service.getThreatMaster();
        } else {
          this.riskService.getRiskListData();
        }
      }, timeout)
    });
  }

  // Auto Scroll
  scrollDown(id: any) {
    let el = document.getElementById(id)!;
    setTimeout(() => {
      if (el) el.scrollTop = el.scrollHeight;
    }, 100);
  }

  scrollUp(id: any) {
    let el = document.getElementById(id)!;
    setTimeout(() => {
      if (el) el.scrollTop = 0;
    }, 100);
  }
}
