import { DOCUMENT } from '@angular/common';
import { Component, Directive, ElementRef, EventEmitter, HostListener, Inject, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatTableDataSource } from '@angular/material/table';
import { addIndex } from 'src/app/includes/utilities/commonFunctions';
import { AlertComponent } from 'src/app/includes/utilities/popups/alert/alert.component';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { BusinessContinuityPlansService } from 'src/app/services/business-continuity-plans/business-continuity-plans.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-resource-requirements',
  templateUrl: './resource-requirements.component.html',
  styleUrls: ['./resource-requirements.component.scss']
})

export class ResourceRequirementsComponent {

  @Directive({
    selector: '[appNoDecimal]'
  })

  displayedColumnsVR = ['Index', 'SubProcessActivity', 'RecordType', 'MediaType', 'AlternateSource', 'Action'];
  displayedColumnsVR1 = ['Index', 'SubProcessActivity', 'RecordType', 'MediaType', 'AlternateSource'];
  displayedColumnsCE = ['Index', 'Equipment', 'Description', 'TotalCount', 'MinimumCount', 'Action'];
  displayedColumnsCE1 = ['Index', 'Equipment', 'Description', 'TotalCount', 'MinimumCount'];
  @Input() resourceFlag: any
  @Output() dataResourceSaved = new EventEmitter<boolean>();
  @Output() checkResourceRequirementsDataChanges = new EventEmitter<any>();

  resourceReqForm!: FormGroup;
  processActivity: any;
  processData: any[] = [];
  rowCounts: any[] = [];
  mediaList: any;
  altSourceList: any;
  equipmentList: any;
  subProcess: any;
  ProcessID: any;
  listResourceReq: any;
  vitalRecord: any;
  altSourceId: any;
  mediaId: any;
  equipId: any;
  vitalId: any;
  criticalId: any;
  listResourceReqVital: any;
  IsBCManager: any;
  IsBusinessOwner: any;
  IsBCC: any;
  currentStatus: any;
  workFlowStatus: any;
  workFlowStatusID: any;
  IsBCCValidUser: any;
  errMsg: any;
  sixthReport: any;
  controlMode: string = "Add";
  saveerror = "";
  @ViewChildren(MatExpansionPanel)
  panels!: QueryList<MatExpansionPanel>;
  blockEdit: boolean = false;
  isBCPListing: boolean = false;
  isAllExpanded: boolean = false;
  submitted: boolean = false;
  isDisable: boolean = true;
  enteredValue: boolean = false;
  isSavedPro: boolean = false;
  resourceList:any;
  rowClicked: boolean = false;
  criticalEquipmentSuppliesRespData :any [] =[];
  constructor(
    public service: BusinessContinuityPlansService,
    @Inject(DOCUMENT) private _document: any,
    public utils: UtilsService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private el: ElementRef) {
    this.initialize();
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const e = <KeyboardEvent>event;
    if (e.key === '.' || e.key === 'Decimal') {
      e.preventDefault();
    }
  }

  ngOnInit() {
    this.service.getResourceReqDetails(localStorage.getItem("BusinessFunctionID"), localStorage.getItem("BusinessContinuityPlanID"), 6);
    this.service.resourceReqSubj.subscribe((value: any) => {
      if (value) {
        this.processActivity  = this.service.resourceReqObj.businessProcessList || [];
        this.subProcess       = this.service.resourceReqObj.subProcessList || [];
        this.mediaList        = this.service.resourceReqObj.mediaTypeList || [];
        this.altSourceList    = this.service.resourceReqObj.alternateSourceList || [];
        this.equipmentList    = this.service.resourceReqObj.equipmentList || [];
        this.isBCPListing     = this.service.listingPageDetails;
        this.listResourceReq  = this.service.resourceReqObj.criticalEquipmentList || [];
        this.resourceList     = this.service.resourceReqObj.criticalEquipmentList || [];
        this.criticalEquipmentSuppliesRespData = this.resourceList[0].CriticalEquipmentSupplies;

        this.isSavedPro       = this.service.resourceReqObj.criticalEquipmentList[0]?.CriticalEquipmentSupplies[0]?.IsSaved;
        this.dataResourceSaved.emit(this.service.dataResourceSaved)
        this.currentStatus    = Number(localStorage.getItem("CurrentWorkFlowStatusID"));
        this.IsBCManager      = localStorage.getItem("IsBCManager");
        this.IsBusinessOwner  = localStorage.getItem("IsBusinessOwner");
        this.IsBCC            = localStorage.getItem("IsBCCUser");
        this.IsBCCValidUser   = Number(localStorage.getItem("IsBCCValidUser"))

        if (this.IsBCCValidUser == 1 && (this.currentStatus == 7 || this.currentStatus == 2 || this.currentStatus == 1)) {
          this.isBCPListing = false;
        } else {
          this.isBCPListing = true;
        }

        if (!this.service.TableVR) {
          this.service.TableVR = new MatTableDataSource();
        }
        if (!this.service.TableVR.data) {
          this.service.TableVR.data = [];
        }

        for (let data of this.processActivity) {
          for (let sub of this.subProcess) {
            if (data.BusinessProcessID == sub.BusinessProcessID) {
              this.service.TableVR.data.push({
                "Index": this.service.TableVR.data.length + 1, "SubBusinessProcessName": sub.SubBusinessProcessName, "SubActivityID": sub.SubBusinessProcessID,
                "BusinessProcessId": data.BusinessProcessID, "RecordType": "", "MediaType": "", "AlternateSource": "", "vitalId": "", "isEdit": false
              })
            }
          }
        }

        this.processData = this.service.TableVR.data;
        this.processData = Array.from(new Set(this.processData.map(ob => ob.SubActivityID))).map(SubActivityID => this.processData.find(ob => ob.SubActivityID === SubActivityID));
        this.initialize();
        this.patchValue(this.listResourceReq);
      }
      this.workFlowStatus = localStorage.getItem("WorkFlowStatus")
      this.workFlowStatusID = localStorage.getItem("WorkFlowStatusID")
    })
    this.service.TableVR = new MatTableDataSource();
    this.service.TableCE = new MatTableDataSource();
  }

  initialize() {
    this.resourceReqForm = this.fb.group({
      RecordType: ['', [Validators.required, this.validateDescriptionLength]],
      MediaType: ['', Validators.required],
      AlternateSource: ['', Validators.required],
      Equipment: ['', Validators.required],
      Description: ['', [Validators.required, this.validateDescriptionLength]],
      TotalCount: ['', Validators.required],
      MinimumCount: ['', Validators.required]
    })
  }
validateDescriptionLength(control: AbstractControl): ValidationErrors | null {
    return control.value && control.value.length > 500 ? { 'maxlength': true } : null;
  }
  patchValue(data: any) {
    this.initialize();
    setTimeout(() => {
      this.service.TableVR = new MatTableDataSource(this.service.addIndex(data[0].VitalRecords, true))
      this.processData = this.service.TableVR.data
      this.service.TableCE = new MatTableDataSource(this.service.addIndex(data[0].CriticalEquipmentSupplies, true))
    }, 1000)
  }

  filterDataVR(id: any) {
    let x = 0;
    this.service.TableVR.data = this.processData.filter((ele: any) => ele.BusinessProcessId == id);
    return this.service.TableVR.data;
  }

  saveProcess(control: any, id: any) {
    this.blockEdit = false;
    control.isEdit = false;
    for (let business of this.processActivity) {
      if (id == business.BusinessProcessID) {
        this.processData = this.processData.map((x: any) =>
          x.Index === control.Index && x.BusinessProcessId === id
            ? {
              ...x,
              Id: id,
              RecordType: this.resourceReqForm.value.RecordType,
              MediaType: this.resourceReqForm.value.MediaType,
              AlternateSource: this.resourceReqForm.value.AlternateSource,
              MediaTypeID: this.mediaId ? this.mediaId : control.MediaTypeID,
              AlternateSourceID: this.altSourceId ? this.altSourceId : control.AlternateSourceID,
            }
            : x
        );
      }
    }
    this.service.TableVR._updateChangeSubscription();
  }

  cancelProcess(process: any) {
    this.blockEdit = false;
    this.rowClicked = false;

    this.processData.forEach((x: any) => {
      x.isEdit = false;
    });
    if (this.controlMode == "Edit" || process.BusinessProcessId) {
      this.service.TableRS._updateChangeSubscription();
    } else {
      const index = this.service.TableRS.data.indexOf(process.index);
      this.service.TableRS.data.splice(index, 1);
      this.service.TableRS._updateChangeSubscription();
    }
    this.controlMode = "";
  }

  editProcess(control: any) {
    this.controlMode = "Edit"
    this.blockEdit = true;
    this.rowClicked = true;
    control.isEdit = true;

    setTimeout(() => {
      this.resourceReqForm.patchValue({
        RecordType: control.RecordType,
        MediaType: control.MediaType,
        AlternateSource: control.AlternateSource,
        MediaTypeID: control.MediaTypeID,
        AlternateSourceID: control.AlternateSourceID
      })
    }, 1000);
  }

  altSource(id: any) {
    this.altSourceId = id;
  }

  mediaType(id: any) {
    this.mediaId = id;
  }

  equip(id: any) {
    this.equipId = id;
  }

  filterDataCE(id: any) {
    return this.service.TableCE.data.filter((ele: any) => ele.BusinessProcessId == id);
  }

  maxValue() {
    if ((this.resourceReqForm.get('MinimumCount')?.value == null) || (this.resourceReqForm.get('TotalCount')?.value == null)) {
      this.enteredValue = true;
    } else if (this.resourceReqForm.get('MinimumCount')?.value > this.resourceReqForm.get('TotalCount')?.value) {
      this.errMsg = `Minimum count must be less than Total count`
      this.showPopup()
      this.resourceReqForm.get('MinimumCount')?.setValue(null);
      this.enteredValue = true;
    } else {
      this.enteredValue = false;
    }
  }

  showPopup() {
    return this.dialog.open(AlertComponent, {
      panelClass: 'full-screen-modal',
      data: {
        title: `Error Message`,
        content: this.errMsg
      }
    });
  }

  addCritical(id: any) {
    const criticalEquipmentSuppliesCopy = [...this.resourceList[0].CriticalEquipmentSupplies];
    this.ProcessID = id
    this.blockEdit = true;
    this.rowClicked = true;
    this.service.TableCE.data.push({ "BusinessProcessId": this.ProcessID, "Index": this.service.TableCE.data.length + 1, "Equipment": "", "Description": "", "TotalCount": "", "MinimumCount": "", "criticalId": "", "isEdit": true });
    this.resourceReqForm.get('Equipment')?.reset();
    this.resourceReqForm.get('Description')?.reset();
    this.resourceReqForm.get('TotalCount')?.reset();
    this.resourceReqForm.get('MinimumCount')?.reset();
    this.service.TableCE._updateChangeSubscription();

    this.criticalEquipmentSuppliesRespData = criticalEquipmentSuppliesCopy;
  }

  saveCritical(critical: any, id: any) {
    this.blockEdit = false;
    critical.isEdit = false;
    for (let business of this.processActivity) {
      if (id == business.BusinessProcessID) {
        this.service.TableCE.data =
          this.service.TableCE.data.map((x: any) =>
            x.Index === critical.Index
              ? {
                ...x,
                Id: id,
                Equipment: this.resourceReqForm.value.Equipment,
                Description: this.resourceReqForm.value.Description,
                TotalCount: this.resourceReqForm.value.TotalCount,
                MinimumCount: this.resourceReqForm.value.MinimumCount,
                EquipmentID: this.equipId ? this.equipId : critical.EquipmentID
              }
              : x
          );
      }
    }
    this.service.TableCE._updateChangeSubscription();
  }

  cancel(critical: any) {
    this.blockEdit = false;
    this.rowClicked = false;
    this.service.TableCE.data.forEach((x: any) => {
      x.isEdit = false;
    });
    const index = this.service.TableCE.data.indexOf(critical.index);
    this.service.TableCE.data.splice(index, 1);
    this.service.TableCE._updateChangeSubscription();
  }

  editCritical(critical: any) {
    const criticalEquipmentSuppliesCopy = [...this.resourceList[0].CriticalEquipmentSupplies];

    this.controlMode = "Edit"
    this.blockEdit = true;
    critical.isEdit = true;
    setTimeout(() => {
      this.resourceReqForm.patchValue({
        Equipment: critical.Equipment,
        Description: critical.Description,
        TotalCount: critical.TotalCount,
        MinimumCount: critical.MinimumCount,
        EquipmentID: critical.EquipmentID
      })
    }, 1000);
    this.criticalEquipmentSuppliesRespData = criticalEquipmentSuppliesCopy;

  }

  deleteCritical(critical: any) {
    const criticalEquipmentSuppliesCopy = [...this.resourceList[0].CriticalEquipmentSupplies];
    const index = this.service.TableCE.data.findIndex(item => item.Index === critical.Index);

    if (index !== -1) {
      this.service.TableCE.data.splice(index, 1);
    }
    this.service.TableCE.data = addIndex(this.service.TableCE.data, false);
    this.service.TableCE._updateChangeSubscription();
    this.criticalEquipmentSuppliesRespData = criticalEquipmentSuppliesCopy;
  }


  saveResource() {
    let output = this.service.TableCE.data
    this.submitted = true;

    if (this.enteredValue == true)
      return

    if ((this.resourceReqForm.get('MinimumCount')?.value == null) && (this.resourceReqForm.get('TotalCount')?.value == null))
      return

    this.service.addUpdateResource(localStorage.getItem("BusinessContinuityPlanID"), this.processData, localStorage.getItem("BusinessFunctionID"), output).subscribe(res => {
      if (res.success == 1) {
        this.saveSuccess("Resource is saved Successfully");
      } else {
        if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
          this.utils.relogin(this._document);
        else
          this.saveerror = res.error.errorMessage;
      }
      error:
      console.log("err::", "error");
    })
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
        this.service.getResourceReqDetails(localStorage.getItem("BusinessFunctionID"), localStorage.getItem("BusinessContinuityPlanID"), 6);
      }, timeout)
    });
  }

  toggleExpandCollapse() {
    if (this.isAllExpanded) {
      this.panels.forEach(panel => panel.close());
    } else {
      this.panels.forEach(panel => panel.open());
    }
    this.isAllExpanded = !this.isAllExpanded;
  }

  isAnyTableInvalid(): boolean {
    let BusinessProcessIDs = this.processActivity?.map((p: any) => p.BusinessProcessID);

    let allIDsIncluded = BusinessProcessIDs?.every((id: any) => {
      return this.processData?.filter((x: any) => x.BusinessProcessId === id).every(entry => entry.BusinessProcessId === id && entry.RecordType != "" && entry.MediaType != "" && entry.AlternateSource != "");
    });

    let criticalIDs = BusinessProcessIDs?.every((id: any) => {
      return this.service.TableCE.data.some(entry => entry.BusinessProcessId === id && entry.Equipment != "" && entry.Description != "" && (Number(entry.TotalCount) > 0) && (Number(entry.MinimumCount) > 0));
    });

    if (allIDsIncluded == true && criticalIDs == true && this.blockEdit != true && this.service.TableCE.data.length > 0 && this.processData.length > 0) {
      return false
    }
    return true;
  }

  isSaveDisable() {
    const vitalFields = this.resourceReqForm?.value;
    if (vitalFields) {
      if ((vitalFields.RecordType?.length > 0 && vitalFields.RecordType?.trim()?.length <= 500) && (vitalFields.MediaType?.length > 0) && (vitalFields.AlternateSource?.length > 0)) {
        return true;
      }
    }
    return false;
  }

  isSaved() {
    const criticalFields = this.resourceReqForm?.value;
    if (criticalFields) {
      if ((criticalFields.Equipment?.length > 0) && (criticalFields.Description?.length > 0  && criticalFields.Description?.trim()?.length <= 500) && (Number(criticalFields.TotalCount) > 0) && (Number(criticalFields.MinimumCount) > 0)) {
        return true;
      }
    }
    return false;
  }

  async compareResourceRequirementsData() {

    let equipmentSupplies = this.service.TableCE.data;

    if( this.criticalEquipmentSuppliesRespData.length != equipmentSupplies.length) {
      this.checkResourceRequirementsDataChanges.emit(true);
      return true;
    }

    if(this.resourceList[0].VitalRecords.length != this.processData.length) {
      this.checkResourceRequirementsDataChanges.emit(true);
      return true;
    }

    let hasChanges   = this.isDataChanged(this.processData, this.resourceList[0].VitalRecords, equipmentSupplies,  this.criticalEquipmentSuppliesRespData);
    this.checkResourceRequirementsDataChanges.emit(hasChanges);
    return hasChanges;
  }

  private isDataChanged(newData: any, oldData: any, newDataEquipment: any, oldDataEquipment: any): boolean {

    oldData.sort((a:any, b:any) => a.Index - b.Index);
    newData.sort((a:any, b:any) => a.Index - b.Index);

    for (let i = 0; i < newData.length; i++) {
      const newItem = newData[i];
      const oldItem = oldData[i];
      if (newItem.AlternateSourceID !== oldItem.AlternateSourceID || newItem.MediaTypeID !== oldItem.MediaTypeID ||
        newItem.RecordType !== oldItem.RecordType || newItem.SubBusinessProcessId !== oldItem.SubBusinessProcessId ) {
        return true;
      }
    }

    if(this.blockEdit == true) {
      return true;
    }

    newDataEquipment.sort((a:any, b:any) => a.Index - b.Index);
    oldDataEquipment.sort((a:any, b:any) => a.Index - b.Index);

    for (let i = 0; i < newDataEquipment.length; i++) {
      const newItem = newDataEquipment[i];
      const oldItem = oldDataEquipment[i];

      if (newItem.Description !== oldItem.Description || newItem.EquipmentID !== oldItem.EquipmentID || newItem.TotalCount !== oldItem.TotalCount || newItem.MinimumCount !== oldItem.MinimumCount ) {
        return true;
      }
    }

    if(newDataEquipment.length === 0) {
      return false;
    }

    return false;
  }
}

