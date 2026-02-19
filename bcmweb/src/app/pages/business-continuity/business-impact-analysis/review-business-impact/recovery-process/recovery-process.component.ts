import { DOCUMENT } from '@angular/common';
import { Component, Directive, EventEmitter, HostListener, Inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AlertComponent } from 'src/app/includes/utilities/popups/alert/alert.component';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { BusinessContinuityPlansService } from 'src/app/services/business-continuity-plans/business-continuity-plans.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-recovery-process',
  templateUrl: './recovery-process.component.html',
  styleUrls: ['./recovery-process.component.scss']
})

export class RecoveryProcessComponent {

  @Directive({
    selector: '[appNoDecimal]'
  })

  displayedColumns = ['Index', 'Business', 'Who', 'When', 'Where', 'How', 'Action'];
  displayedColumns1 = ['Index', 'Business', 'Who', 'When', 'Where', 'How'];
  @Input() recoveryFlag: any;
  @Output() dataRecoverySaved = new EventEmitter<boolean>();
  @Output() checkRecoveryProcessDataChanges = new EventEmitter<any>();
  @Output() allDataOP = new EventEmitter();
  @Output() isEdit: EventEmitter<any> = new EventEmitter<boolean>();
  recoveryForm!: FormGroup
  businessProcess: any;
  siteList: any;
  recoveryStrategy: any;
  userList: any;
  recoveryViewList: any;
  daysViewList: any;
  userId: any;
  premise: any;
  remote: any;
  siteId: any;
  buttonName: any;
  subProcessList: any;
  currentStatus: any
  workFlowStatus: any;
  IsBCCValidUser: any;
  workFlowStatusID: any;
  msg: any;
  controlMode: string = "Add";
  saveerror = ''
  blockEdit: boolean = false;
  isUserExists: boolean = false;
  isAlternate: boolean = false;
  isBCPListing: boolean = false;
  submitted: boolean = false;
  isDisable: boolean = true;
  totError: boolean = false;
  isSavedPro: boolean = false;
  resourceData:any[] =[];
  recoveryData:any[] =[];
  siteDetails: any[] = [
    {
      'Id': 1,
      'Name': "Alternate Site"
    },
    {
      'Id': 2,
      'Name': "Remote Work"
    }]

  constructor(
    public service: BusinessContinuityPlansService,
    public fb: FormBuilder,
    @Inject(DOCUMENT) private _document: any,
    public utils: UtilsService,
    public dialog: MatDialog) {
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
    this.service.getRecoveryProcessDetails(localStorage.getItem("BusinessFunctionID"), localStorage.getItem("BusinessContinuityPlanID"), 8);
    this.service.recoveryProSubj.subscribe((value: any) => {
      if (value) {
        this.businessProcess    = this.service.recoveryProObj.processList || [];
        this.siteList           = this.service.recoveryProObj.siteList || [];
        this.userList           = this.service.recoveryProObj.userList || [];
        this.recoveryViewList   = this.service.recoveryProObj.recoveryProcessList[0].RecoveryStrategies || [];
        this.daysViewList       = this.service.recoveryProObj.staffRequirementDetails[0] || [];
        this.resourceData       = this.service.recoveryProObj.staffRequirementDetails[0] || [];
        this.recoveryData       = this.service.recoveryProObj.recoveryProcessList[0].RecoveryStrategies || [];

        this.isSavedPro         = this.service.recoveryProObj.staffRequirementDetails[0]?.IsSaved;
        this.isBCPListing       = this.service.listingPageDetails;
        this.subProcessList     = this.service.recoveryProObj.subProcessList || [];
        this.currentStatus      = this.service.recoveryProObj.currentWorkflowStatusID;
        this.dataRecoverySaved.emit(this.service.dataRecoverySaved);
        this.allDataOP.emit(this.service.recoveryProObj);
        this.IsBCCValidUser     = Number(localStorage.getItem("IsBCCValidUser"));

        if (this.IsBCCValidUser == 1 && (this.service.recoveryProObj.currentWorkflowStatusID == 7 ||
          this.service.recoveryProObj.currentWorkflowStatusID == 2 ||
          this.service.recoveryProObj.currentWorkflowStatusID == 1)) {
          this.isBCPListing = false;
        } else {
          this.isBCPListing = true;
        }

        if (!this.service.TableRS) {
          this.service.TableRS = new MatTableDataSource();
        }
        if (!this.service.TableRS.data) {
          this.service.TableRS.data = [];
        }
        console.log("this.businessProcess", this.businessProcess)
        for (let data of this.businessProcess) {
          this.service.TableRS.data.push({
            "Index": this.service.TableRS.data.length + 1, "BusinessProcessName": data.BusinessProcessName, "BusinessProcessId": data.BusinessProcessID,
            "Who": data.Who, "WhoId": "", "When": data.When, "Where": "", "SubBusinessProcesses": data.SubBusinessProcesses, "isEdit": false
          })
        }
        const uniqueObjects = Array.from(new Map(this.service.TableRS.data.map(obj => [obj['BusinessProcessId'], obj])).values());
        this.recoveryStrategy = uniqueObjects;
        if (this.daysViewList.length == 0) {
          this.initialize();
        } else {
          this.patchValue(this.daysViewList, this.recoveryViewList);
        }
      }
      this.workFlowStatus = localStorage.getItem("WorkFlowStatus")
      this.workFlowStatusID = localStorage.getItem("WorkFlowStatusID")
    })
    this.service.TableRS = new MatTableDataSource();
  }

  filterUser(event: any): void {
    const searchTerm = event.target.value.toLowerCase();
    this.userList = this.service.recoveryProObj.userList.filter((user: any) => user.UserName.toLowerCase().includes(searchTerm));
    this.recoveryForm.controls['WhoId'].setValue("");
    this.isUserExists = false;
  }

  setUserID(user: any, event: any) {
    if (event.isUserInput) {
      this.recoveryForm.controls['Who'].setValue(user.UserName);
      this.recoveryForm.controls['WhoId'].setValue(user.UserGUID);
      this.userId = user.UserGUID
    }
  }

  initialize() {
    this.recoveryForm = this.fb.group({
      day1: ['', Validators.required],
      day2: ['', Validators.required],
      day3: ['', Validators.required],
      day4: ['', Validators.required],
      day5: ['', Validators.required],
      total: ['', Validators.required],
      workingRemote: ['', Validators.required],
      onPremise: ['', Validators.required],
      Who: [''],
      WhoId: [''],
      Where: [''],
      Site: [''],
    })
  }

  get f() {
    return this.recoveryForm.controls;
  }

  patchValue(list: any, table: any) {
    this.initialize();
    setTimeout(() => {
      this.recoveryForm.patchValue({
        day1: list.Day1,
        day2: list.Day2,
        day3: list.Day3,
        day4: list.Day4,
        day5: list.Day5,
        total: list.Total,
        workingRemote: list.Remote,
        onPremise: list.OnPremise,
      })
      this.service.TableRS = new MatTableDataSource(this.service.addIndex(table, true))
      this.recoveryStrategy = this.service.TableRS.data;
    }, 1000)
  }

  onSelect(name: any) {
    console.log(name)
    if (name == 'Alternate Site') {
      this.isAlternate = true;
    } else {
      this.isAlternate = false;
      this.recoveryForm.controls['Site'].reset();
    }
  }

  selectedSite(id: any) {
    this.siteId = id;
  }

  editRecovery(recovery: any) {
    this.controlMode = "Edit"
    this.blockEdit = true;
    this.isEdit.emit(this.blockEdit);
    recovery.isEdit = true;
    setTimeout(() => {
      this.recoveryForm.patchValue({
        Who: recovery.Who,
        Where: recovery.Where,
        Site: recovery.Site,
        WhoId: recovery.WhoGUID ? recovery.WhoGUID : this.userId
      })
    }, 1000);
  }

  saveRecovery(recovery: any) {
    this.blockEdit = false;

    recovery.isEdit = false;
    for (let business of this.businessProcess) {
      if (recovery.BusinessProcessId == business.BusinessProcessID) {
        this.recoveryStrategy = this.recoveryStrategy.map((x: any) =>
          x.Index === recovery.Index
            ? {
              ...x,
              Id: recovery.BusinessProcessId,
              Who: this.recoveryForm.value.Who,
              Where: this.recoveryForm.value.Where,
              Site: this.recoveryForm.value.Site,
              SiteId: this.siteId ? this.siteId : null,
              WhoId: this.userId ? this.userId : recovery.WhoGUID
            }
            : x
        );
      }
    }
    this.service.TableRS._updateChangeSubscription();
  }

  cancel(process: any) {
    this.blockEdit = false;
    this.isEdit.emit(this.blockEdit);
    this.recoveryStrategy.forEach((x: any) => {
      x.isEdit = false;
    });
    if (this.controlMode == "Edit" || process.BusinessProcessID) {
      this.service.TableRS._updateChangeSubscription();
    } else {
      const index = this.service.TableRS.data.indexOf(process.index);
      this.service.TableRS.data.splice(index, 1);
      this.service.TableRS._updateChangeSubscription();
    }
    this.controlMode = "";
  }

  totalCount() {
    const day1 = this.recoveryForm.get('day1')?.value || 0;
    const day2 = this.recoveryForm.get('day2')?.value || 0;
    const day3 = this.recoveryForm.get('day3')?.value || 0;
    const day4 = this.recoveryForm.get('day4')?.value || 0;
    const day5 = this.recoveryForm.get('day5')?.value || 0;

    const largestNum = Math.max(day1, day2, day3, day4, day5);

    this.recoveryForm.patchValue({
      total: largestNum
    })
  }

  autoCountRemote() {
    if (this.recoveryForm.get('workingRemote')?.value >= 0) {
      if ((this.recoveryForm.get('workingRemote')?.value) <= (this.recoveryForm.get('total')?.value)) {
        this.premise = this.recoveryForm.get('total')?.value - this.recoveryForm.get('workingRemote')?.value
        this.recoveryForm.patchValue({
          onPremise: this.premise
        })
      } else {
        this.msg = `Enter value less than total count`
        this.showPopup()
        this.recoveryForm.get('workingRemote')?.reset()
        this.recoveryForm.get('onPremise')?.reset()
      }
    }
  }

  autoCountPremise() {
    if (this.recoveryForm.get('onPremise')?.value >= 0) {
      if ((this.recoveryForm.get('onPremise')?.value) <= (this.recoveryForm.get('total')?.value)) {
        this.remote = this.recoveryForm.get('total')?.value - this.recoveryForm.get('onPremise')?.value
        this.recoveryForm.patchValue({
          workingRemote: this.remote
        })
      } else {
        this.msg = `Enter value less than total count`
        this.showPopup()
        this.recoveryForm.get('workingRemote')?.reset()
        this.recoveryForm.get('onPremise')?.reset()
      }
    }
  }

  showPopup() {
    return this.dialog.open(AlertComponent, {
      panelClass: 'full-screen-modal',
      data: {
        title: `Error Message`,
        content: this.msg
      }
    });
  }

  getErrorMsg(day: any) {
    if (day < 0) {
      return 'Enter Positive Number'
    } else {
      return ''
    }
  }

  saveRecoveryProcess() {
    let value = this.recoveryForm.value.workingRemote + this.recoveryForm.value.onPremise
    if (value != this.recoveryForm.value.total) {
      this.msg = `Total count is not matching in Remote and On premise`
      this.showPopup()
      return
    }

    let output = {
      DayOne: this.recoveryForm.value.day1,
      DayTwo: this.recoveryForm.value.day2,
      DayThree: this.recoveryForm.value.day3,
      DayFour: this.recoveryForm.value.day4,
      DayFive: this.recoveryForm.value.day5,
      WorkingRemotely: this.recoveryForm.value.workingRemote,
      Total: this.recoveryForm.value.total,
      Onpremise: this.recoveryForm.value.onPremise,
      RecoveryStaffRequirementId: this.daysViewList.RecoveryStaffRequirementId ? Number(this.daysViewList.RecoveryStaffRequirementId) : null
    }

    let sub: any = [];

    this.subProcessList.forEach((n: any) => {
      sub.push({
        "BusinessProcessId": n.BusinessProcessId,
        "SubBusinessProcessId": n.SubBusinessProcessId,
        "SubBusinessProcessName": n.SubBusinessProcessName,
        "SubBusinessProcessDescription": 'xyz'
      })
    });

    if (this.recoveryViewList.length == 0) {
      this.recoveryStrategy.forEach((ob: any) => {
        let { RecoveryStrategiesId } = ob
        ob.RecoveryStrategiesId = null;
      })
    } else {
      let processDetailsMap = new Map(this.recoveryViewList.map((item: any) => [item.BusinessProcessId, item.RecoveryStrategiesId]));
      this.recoveryStrategy.forEach((activity: any) => {
        let detailsID = processDetailsMap.get(activity.BusinessProcessId);
        activity.RecoveryStrategiesId = detailsID !== undefined ? detailsID : null;
      });
    }
    this.submitted = true;

    if (this.recoveryForm.invalid)
      return;

    this.service.addUpdateRecovery(localStorage.getItem("BusinessContinuityPlanID"), localStorage.getItem("BusinessFunctionID"), output, this.recoveryStrategy, sub).subscribe(res => {
      if (res.success == 1) {
        this.isEdit.emit(this.blockEdit);
        this.saveSuccess("Recovery is saved Successfully");
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
        this.service.getRecoveryProcessDetails(localStorage.getItem("BusinessFunctionID"), localStorage.getItem("BusinessContinuityPlanID"), 8);
      }, timeout)
    });
  }

  isAnyTableInvalid(): boolean {
    let BusinessProcessIDs = this.businessProcess?.map((p: any) => p.BusinessProcessID);
    let allIDsIncluded = BusinessProcessIDs?.every((id: any) => {
      return this.recoveryStrategy?.filter((x: any) => x.BusinessProcessId == id).every((entry: any) => entry.BusinessProcessId == id && entry.Who != "" && entry.Where != "");
    });
    if (allIDsIncluded) {
      return false
    }
    return true;
  }

  isSaveEnable(): boolean {
    if (!this.isAnyTableInvalid() && !this.recoveryForm.invalid && this.blockEdit != true && this.recoveryStrategy.length > 0) {
      return false
    }
    return true
  }

  isSaveDisable() {
    const tableFields = this.recoveryForm?.value;
    if (tableFields) {
      const { Who, Where, Site } = tableFields;
      if (Who && Where) {
        if (Where === "Alternate Site" && !Site) {
          return false;
        }
        return true;
      }
    }
    return false;
  }


  async compareRecoveryProcessData() {
    if (this.recoveryViewList.length == 0) {
      this.recoveryStrategy.forEach((ob: any) => {
        let { RecoveryStrategiesId } = ob
        ob.RecoveryStrategiesId = null;
      })
    } else {
      let processDetailsMap = new Map(this.recoveryViewList.map((item: any) => [item.BusinessProcessId, item.RecoveryStrategiesId]));
      this.recoveryStrategy.forEach((activity: any) => {
        let detailsID = processDetailsMap.get(activity.BusinessProcessId);
        activity.RecoveryStrategiesId = detailsID !== undefined ? detailsID : null;
      });
    }

    let staffCount = {
      DayOne          : this.recoveryForm.value.day1,
      DayTwo          : this.recoveryForm.value.day2,
      DayThree        : this.recoveryForm.value.day3,
      DayFour         : this.recoveryForm.value.day4,
      DayFive         : this.recoveryForm.value.day5,
      WorkingRemotely : this.recoveryForm.value.workingRemote,
      Total           : this.recoveryForm.value.total,
      Onpremise       : this.recoveryForm.value.onPremise,
      RecoveryStaffRequirementId : this.daysViewList.RecoveryStaffRequirementId ? Number(this.daysViewList.RecoveryStaffRequirementId) : null
    }

    let hasChanges   = this.isDataChanged(staffCount, this.recoveryStrategy, this.resourceData, this.recoveryData);
    this.checkRecoveryProcessDataChanges.emit(hasChanges);
    return hasChanges;
  }

  private isDataChanged(newStaffData?: any, newRecoveryData?: any, oldStaffData?: any, oldRecoveryData?: any): boolean {

    if (this.blockEdit) {
      return true;
    }

    if(newStaffData.DayFive != oldStaffData.Day5 || newStaffData.DayFour != oldStaffData.Day4 || newStaffData.DayThree != oldStaffData.Day3
      || newStaffData.DayTwo != oldStaffData.Day2 || newStaffData.DayOne != oldStaffData.Day1 || newStaffData.WorkingRemotely != oldStaffData.Remote || newStaffData.Total != oldStaffData.Total) {
      return true;
    }

    oldRecoveryData.sort((a:any, b:any) => a.RecoveryStrategiesId - b.RecoveryStrategiesId);
    newRecoveryData.sort((a:any, b:any) => a.RecoveryStrategiesId - b.RecoveryStrategiesId);

    for (let i = 0; i < newRecoveryData.length; i++) {
      const newItem = newRecoveryData[i];
      const oldItem = oldRecoveryData[i];
      if (newItem.Site !== oldItem.Site || newItem.Where !== oldItem.Where ) {
        return true;
      }
    }

    return false;
  }

}
