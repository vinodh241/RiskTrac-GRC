import { DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { addIndex } from 'src/app/includes/utilities/commonFunctions';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { BusinessContinuityPlansService } from 'src/app/services/business-continuity-plans/business-continuity-plans.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-staff-contact-details',
  templateUrl: './staff-contact-details.component.html',
  styleUrls: ['./staff-contact-details.component.scss']
})

export class StaffContactDetailsComponent {

  @Input() staffConFlag: any
  @Output() dataStaffSaved = new EventEmitter<boolean>();
  @Output() checkStaffContactDataChanges = new EventEmitter<any>();

  staffDetailsForm!: FormGroup
  roleList: any;
  blockEdit: boolean = false;
  displayedColumnsSCD = ['Index', 'CallID', 'CallOrder', 'Role', 'CallInitiator', 'DesignationC', 'Mobile', 'Residence', 'CallReceiver', 'DesignationR', 'MobileR', 'ResidenceR', 'Action']
  displayedColumnsSCDV = ['Index', 'CallID', 'CallOrder', 'Role', 'CallInitiator', 'DesignationC', 'Mobile', 'Residence', 'CallReceiver', 'DesignationR', 'MobileR', 'ResidenceR']
  callOrder: any;
  staffList: any;
  staffUserData: any
  designation: any;
  staffListData: any;
  staffReceiver: any;
  staffDetails: any;
  residenceR: any;
  mobileR: any;
  designationR: any;
  callReceiver: any;
  listingBCP: any;
  StaffContactView: any;
  designationC: any;
  mobNumberIni: any;
  mobNumberRec: any;
  callInitiator: any;
  callID: any;
  saveerror: any;
  staffInitiatorGUID: any;
  callReceiverGUID: any;
  receiverGUID: any;
  callOrder1: any;
  callDropdown: any = [];
  callOrderDropdown: any = []
  finalDataArray: any = [];
  callIDData: any = [];
  callFilter: any = [];
  orderDetails: any;
  orderInitiate: any;
  callvalue: any;
  callFirstID: any;
  editOrder: boolean = false
  controlMode: string = "Add";
  workFlowStatus: any;
  workFlowStatusID: any;
  currentStatus: any;
  wait: any;
  isavedParam: any;
  StaffContactData :any[] =[];

  constructor(
    public businessContinuityService: BusinessContinuityPlansService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    @Inject(DOCUMENT) private _document: any,
    public utils: UtilsService,
  ) { }

  ngOnInit() {
    this.businessContinuityService.getStaffInfo(Number(localStorage.getItem("BusinessContinuityPlanID")), Number(localStorage.getItem("BusinessFunctionID")))
    this.businessContinuityService.processStaffSubj.subscribe((value) => {
      if (value) {
        this.roleList           = this.businessContinuityService.processStaffData.RoleList || [];
        this.staffList          = this.businessContinuityService.processStaffData.StaffUserDetails || [];
        this.staffListData      = this.businessContinuityService.processStaffData.StaffUserDetails || [];
        this.StaffContactView   = this.businessContinuityService.processStaffData.StaffContactLists || [];
        this.StaffContactData   = this.businessContinuityService.processStaffData.StaffContactLists || [];

        this.isavedParam        = this.businessContinuityService.processStaffData.StaffContactLists[0]?.IsSaved
        this.dataStaffSaved.emit(this.businessContinuityService.dataStaffSaved)
        let IsBCCValidUser      = Number(localStorage.getItem("IsBCCValidUser"))
        this.currentStatus      = Number(localStorage.getItem("CurrentWorkFlowStatusID"));
        if (IsBCCValidUser == 1 && (this.currentStatus == 7 || this.currentStatus == 2 || this.currentStatus == 1)) {
          this.listingBCP = false;
        } else {
          this.listingBCP = true;
        }
        if (this.StaffContactView?.length > 0) {
          this.patchValue(this.StaffContactView)
        }
      }
      this.workFlowStatus = localStorage.getItem("WorkFlowStatus")
      this.workFlowStatusID = localStorage.getItem("WorkFlowStatusID")
    })
    this.businessContinuityService.TableSCD = new MatTableDataSource();
    this.businessContinuityService.TableSCDV = new MatTableDataSource();
    this.initialze()
  }

  ngOnChanges() {
    if (this.StaffContactView?.length > 0) {
      this.patchValue(this.StaffContactView)
    }
  }

  initialze() {
    this.staffDetailsForm = this.fb.group({
      CallID: ['', [Validators.required, Validators.maxLength(10)]],
      CallOrder: ['', Validators.required],
      CallOrder1: ['', Validators.required],
      CallIniOrder: ['', Validators.required],
      Role: ['', [Validators.required, Validators.maxLength(20)]],
      CallInitiator: ['', Validators.required],
      Mobile: ['', [Validators.required, Validators.pattern("^((\\+98-?)|(\\+93-?)|(\\+91-?)|0)?[0-9]*$"), Validators.maxLength(15), Validators.minLength(10)]],
      Residence: ['', [Validators.required, Validators.maxLength(15)]],
      CallReceiver: ['', Validators.required],
      DesignationC: ['', [Validators.required, Validators.maxLength(20)]],
      DesignationR: ['', [Validators.required, Validators.maxLength(20)]],
      MobileR: ['', [Validators.required, Validators.pattern("^((\\+98-?)|(\\+93-?)|(\\+91-?)|0)?[0-9]*$"), Validators.maxLength(15), Validators.minLength(10)]],
      ResidenceR: ['', [Validators.required, Validators.maxLength(20)]]
    });
  }

  patchValue(data: any) {
    setTimeout(() => {
      this.callOrder1 = data[0].CallOrder
      this.callFirstID = data[0]?.CallOrder1
      this.businessContinuityService.TableSCD = new MatTableDataSource(this.businessContinuityService.addIndex(data, true))
    }, 2000);
    this.getCallData();
  }

  editRisk(control: any) {
    this.blockEdit = true;
    control.isEdit = true;
    this.controlMode = "Edit"
    this.staffDetailsForm.get('Role')?.reset();
    if (control.Index == 1) {
      this.editOrder = true
    } else {
      this.editOrder = false
    }

    setTimeout(() => {
      this.staffDetailsForm.patchValue({
        CallID: control.CallID,
        CallOrder: control.CallOrder,
        Role: control.Role,
        CallInitiator: control.CallInitiator,
        CallIniOrder: control.Index == 1 ? "" : control.CallOrder1,
        Mobile: control.Mobile,
        Residence: control.Residence,
        CallReceiver: control.CallReceiver,
        DesignationC: control.DesignationC,
        DesignationR: control.DesignationR,
        MobileR: control.MobileR,
        ResidenceR: control.ResidenceR
      })
      if(control.Index == 1){
      this.callOrder1 = control.CallOrder
          console.log("this.callOrder1",this.callOrder1)
      }
      this.callFirstID = control?.CallOrder1
    }, 1000);
    this.getCallData();
  }

  deleteRisk(row: any) {
    const index = this.businessContinuityService.TableSCD.data.findIndex(item => item.Index === row.Index);
    if (index !== -1) {
      this.businessContinuityService.TableSCD.data.splice(index, 1);
    }
    this.businessContinuityService.TableSCD.data = addIndex(this.businessContinuityService.TableSCD.data, false);
    this.businessContinuityService.TableSCD._updateChangeSubscription();

    this.callOrder1 = this.businessContinuityService.TableSCD.data[0]?.CallOrder
  }

  save(data: any) {
    this.blockEdit = false;
    data.isEdit = false;
    this.callOrder1 = this.businessContinuityService.TableSCD?.data[0]?.CallOrder
    this.staffInitiatorGUID = this.staffList.filter((ele: any) => ele.UserName == this.staffDetailsForm.value?.CallInitiator)[0]?.UserGUID
    this.receiverGUID = this.staffList.filter((ele: any) => ele.UserName == this.staffDetailsForm.value.CallReceiver)[0]?.UserGUID
    if (this.businessContinuityService.TableSCD.data.length == 1) {
      this.businessContinuityService.TableSCD.data =
        this.businessContinuityService.TableSCD.data.map((x: any) =>
          x.Index === data.Index
            ? {
              ...x,
              CallID: this.staffDetailsForm.value.CallID,
              callID1: this.staffDetailsForm.value.CallID,
              CallOrder: this.callOrder1 ? this.callOrder1 : this.staffDetailsForm.value.CallOrder,
              CallOrder1: this.staffDetailsForm.value.CallIniOrder ? this.staffDetailsForm.value.CallIniOrder : this.orderInitiate,
              Role: this.staffDetailsForm.value.Role,
              CallInitiator: this.staffDetailsForm.value.CallInitiator,
              CallInitiatorGUID: this.staffInitiatorGUID,
              Mobile: this.staffDetailsForm.value.Mobile,
              Residence: this.staffDetailsForm.value.Residence,
              CallReceiver: this.staffDetailsForm.value.CallReceiver,
              CallReceiverGUID: this.receiverGUID,
              DesignationC: this.staffDetailsForm.value.DesignationC,
              DesignationR: this.staffDetailsForm.value.DesignationR,
              MobileR: this.staffDetailsForm.value.MobileR,
              ResidenceR: this.staffDetailsForm.value.ResidenceR,
            }
            : x
        );
      this.callFirstID = this.businessContinuityService.TableSCD.data[0]?.CallID
      this.callOrder1 = this.staffDetailsForm.value.CallOrder
    } else if (this.businessContinuityService.TableSCD.data.length > 1) {
      this.businessContinuityService.TableSCD.data =
        this.businessContinuityService.TableSCD.data.map((x: any) =>
          x.Index === data.Index
            ? {
              ...x,
              CallID: this.staffDetailsForm.value.CallID,
              CallOrder: this.staffDetailsForm.value.CallOrder ? this.staffDetailsForm.value.CallOrder : this.orderDetails,
              CallOrder1: this.staffDetailsForm.value.CallIniOrder ? this.staffDetailsForm.value.CallIniOrder : this.orderInitiate,
              Role: this.staffDetailsForm.value.Role,
              CallInitiator: this.staffDetailsForm.value.CallInitiator,
              CallInitiatorGUID: this.staffInitiatorGUID,
              Mobile: this.staffDetailsForm.value.Mobile,
              Residence: this.staffDetailsForm.value.Residence,
              CallReceiver: this.staffDetailsForm.value.CallReceiver,
              CallReceiverGUID: this.receiverGUID,
              DesignationC: this.staffDetailsForm.value.DesignationC,
              DesignationR: this.staffDetailsForm.value.DesignationR,
              MobileR: this.staffDetailsForm.value.MobileR,
              ResidenceR: this.staffDetailsForm.value.ResidenceR,
            }
            : x
        );
    }
    this.businessContinuityService.TableSCD._updateChangeSubscription();
  }

  onSelect(data: any) {
    this.orderDetails = data
  }

  onSelectOrder(data: any) {
    this.orderInitiate = data
  }

  addRisk() {
    this.blockEdit = true;
    this.controlMode = "Add"
    if (this.StaffContactView?.length > 0) {
      this.callFirstID = this.StaffContactView[0]?.CallOrder
    }
    if (this.businessContinuityService.TableSCD.data[0]?.Index == 1) {
      this.editOrder = true
    } else {
      this.editOrder = false
    }
    this.callID = this.businessContinuityService.TableSCD.data[this.businessContinuityService.TableSCD.data.length - 1]?.CallID
    this.callOrder = this.businessContinuityService.TableSCD.data[this.businessContinuityService.TableSCD.data.length - 1]?.CallOrder
    this.callFirstID = this.businessContinuityService.TableSCD.data[0]?.CallID
    this.callReceiver = this.businessContinuityService.TableSCD.data[this.businessContinuityService.TableSCD.data.length - 1]?.CallReceiver;
    this.callReceiverGUID = this.staffList.filter((ele: any) => ele.UserName == this.callReceiver)[0]?.UserGUID;
    this.designationC = this.businessContinuityService.TableSCD.data[this.businessContinuityService.TableSCD.data.length - 1]?.DesignationC
    this.designationR = this.businessContinuityService.TableSCD.data[this.businessContinuityService.TableSCD.data.length - 1]?.DesignationR
    this.mobileR = this.businessContinuityService.TableSCD.data[this.businessContinuityService.TableSCD.data.length - 1]?.MobileR
    this.callInitiator = this.businessContinuityService.TableSCD.data[this.businessContinuityService.TableSCD.data.length - 1]?.CallInitiator
    this.residenceR = this.businessContinuityService.TableSCD.data[this.businessContinuityService.TableSCD.data.length - 1]?.ResidenceR
    this.staffDetailsForm.get('CallID')?.reset();
    this.staffDetailsForm.get('CallOrder')?.reset();
    this.staffDetailsForm.get('CallOrder1')?.reset();
    this.staffDetailsForm.get('CallOrder')?.setValue('');
    this.staffDetailsForm.get('CallOrder1')?.setValue('');
    this.staffDetailsForm.get('CallIniOrder')?.setValue('');
    this.staffDetailsForm.get('Role')?.reset();
    this.staffDetailsForm.get('CallInitiator')?.reset();
    this.staffDetailsForm.get('Mobile')?.reset();
    this.staffDetailsForm.get('Residence')?.reset();
    this.staffDetailsForm.get('CallReceiver')?.reset();
    this.staffDetailsForm.get('DesignationC')?.reset();
    this.staffDetailsForm.get('DesignationR')?.reset();
    this.staffDetailsForm.get('MobileR')?.reset();
    this.staffDetailsForm.get('ResidenceR')?.reset();
    this.businessContinuityService.TableSCD.data.push({
      Index: this.businessContinuityService.TableSCD.data.length + 1,
      CallID: null,
      CallOrder: '',
      CallOrder1: '',
      Role: '',
      CallInitiator: '',
      Mobile: '',
      Residence: '',
      CallReceiver: '',
      DesignationC: '',
      DesignationR: '',
      MobileR: '',
      ResidenceR: '',
      isEdit: true,
    });
    if (this.businessContinuityService.TableSCD.data[0].Index == 1) {
      this.editOrder = true
    } else {
      this.editOrder = false
    }
    this.getCallData();
    this.businessContinuityService.TableSCD._updateChangeSubscription();
  }

  getCallOrder1() {
    return this.staffDetailsForm.get('CallID')?.value
  }

  onCallIDInput(event: Event) {
    const input = event.target as HTMLTextAreaElement;
    this.callvalue = input.value;
    this.staffDetailsForm.get('CallIniOrder')?.setValue('');
    this.staffDetailsForm?.get('CallID')?.setValue(this.callvalue);
    this.getCallData();
  }

  getCallData() {
  let data = this.businessContinuityService.TableSCD.data;
  this.callIDData = this.callvalue;
  let callData: any[] = [];

  // Collect CallID from data
  for (let data1 of data) {
    if (data1?.CallID) {
      callData = callData.concat(data1.CallID);
    }
  }

  // Combine collected CallID data with callIDData
  let callvalue = callData.concat(this.callIDData);
  // Initialize dropdown arrays
  this.callDropdown = [];
  this.callOrderDropdown = [];
  let ID: number = 0;

  // Add unique names to callDropdown
  callvalue.forEach(call => {
    this.callDropdown.push({ name: call, id: ++ID });
  });

  // Ensure uniqueness for callDropdown
  this.callDropdown = this.getUnique(this.callDropdown, 'name');

  // Reset ID for callOrderDropdown
  ID = 0;

  // Add unique orderNames to callOrderDropdown
  callvalue.forEach(call => {
    this.callOrderDropdown.push({ orderName: call, id: ++ID });
  });

  // Ensure uniqueness for callOrderDropdown
  this.callOrderDropdown = this.getUnique(this.callOrderDropdown, 'orderName');

  // Filter out null or empty values in both dropdowns
  this.callDropdown = this.callDropdown.filter((ele: any) => ele.name != null && ele.name != '');
  this.callOrderDropdown = this.callOrderDropdown.filter((ele: any) => ele.orderName != null && ele.orderName != '');
}

// Utility function to get unique values based on key
getUnique(arr: any[], key: string) {
  const seen = new Set();
  return arr.filter(item => {
    const val = item[key];
    if (seen.has(val)) {
      return false;
    }
    seen.add(val);
    return true;
  });
}

  filterInitiator(id: any) {
    const searchTerm = id.target.value.toLowerCase();
    this.staffListData =
      this.staffList
  }

  filterReceiver() {
    let staffFilter = this.staffList.filter((owner: any) => owner.UserGUID != this.staffInitiatorGUID)
    this.staffReceiver =
      staffFilter
  }

  getStaffData(id: any) {
    this.staffInitiatorGUID = id
    this.staffUserData = this.staffList.filter((ele: any) => ele.UserGUID == id)
    this.mobNumberIni = this.staffUserData[0]?.MobileNumber
    this.staffDetailsForm.patchValue({
      Mobile: this.mobNumberIni,
    })
    this.filterReceiver()
  }

  getDesig(name: any, id: any) {
    this.designation = this.staffList.filter((ele: any) => ele.UserName == name)
    if (id == 1) {
      return this.designation[0]?.Designation
    } else if (id == 2) {
      return this.designation[0]?.Mobile
    } if (id == 3) {
      return this.designation[0]?.Residence
    }
  }

  getRecData(id: any) {
    this.receiverGUID = id;
    this.staffUserData = this.staffList.filter((ele: any) => ele.UserGUID == id)
    this.mobNumberRec = this.staffUserData[0]?.MobileNumber
    this.staffDetailsForm.patchValue({
      MobileR: this.mobNumberRec,
    })
  }

  onSubmit() {
    let output = this.modifyData(this.businessContinuityService.TableSCD.data, Number(localStorage.getItem("BusinessContinuityPlanID")));
    this.businessContinuityService.addStaffContact(output).subscribe((res) => {
      if (res.success == 1) {
        this.saveSuccess('Staff Contact Details saved successfully');
      } else {
        if (res.error.errorCode && res.error.errorCode == 'TOKEN_EXPIRED')
          this.utils.relogin(this._document);
        else this.saveerror = res.error.errorMessage;
      }
      error: console.log('err::', 'error');
    });

  }

  modifyData(inputData: any, businessContinuityID: any) {
    let payload = {
      BusinessContinuityPlanID: businessContinuityID,
      BusinessFunctionID: Number((localStorage).getItem("BusinessFunctionID")),
      StaffContactLists: inputData.map((item: any) => {
        return {
          CallTreeId: item.StaffContactID ? item.StaffContactID : null,
          BusinessContinuityPlanID: businessContinuityID,
          CallID: item.CallID,
          CallOrderInitiator: item.CallOrder,
          CallOrderReceiver: item.CallOrder1 ? item.CallOrder1 : item.CallID,
          RoleID: item.Role,
          CallInitiator: item.CallInitiatorGUID ? item.CallInitiatorGUID : item.CallInitiatorGUID,
          Designation: item.DesignationC,
          Mobile: item.Mobile,
          Residence: item.Residence,
          CallReceiver: item.CallReceiverGUID ? item.CallReceiverGUID : item.CallReceiverGUID,
          ReceiverDesignation: item.DesignationR,
          ReceiverMobile: item.MobileR,
          ReceiverResidence: item.ResidenceR
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

        this.businessContinuityService.getStaffInfo(Number(localStorage.getItem("BusinessContinuityPlanID")), 7)
        confirm.close();
      }, timeout);
    });
  }

  cancel(staff: any) {
    this.blockEdit = false;
    this.businessContinuityService.TableSCD.data.forEach((x: any) => {
      x.isEdit = false;
    });

    if (this.controlMode == "Edit") {
      this.businessContinuityService.TableSCD._updateChangeSubscription();
    } else {
      const index = this.businessContinuityService.TableSCD.data.indexOf(staff.index);
      this.businessContinuityService.TableSCD.data.splice(index, 1);
      this.businessContinuityService.TableSCD._updateChangeSubscription();
    }

  }

  isAnyTableInvalid(): boolean {
    let allIDsIncluded = this.businessContinuityService.TableSCD.data.some(entry => entry.CallOrder !== "" &&
      (entry.Index != 0 && (entry.CallOrder1 !== "" || true)) && entry.Role !== ""
      && entry.CallInitiator !== ""
      && entry.Mobile !== ""
      && entry.Residence !== "" && entry.CallReceiver !== "" && entry.DesignationC !== "" && entry.DesignationR !== ""
      && entry.MobileR !== ""
      && entry.ResidenceR !== "");

    if (allIDsIncluded && !this.blockEdit) {
      return false
    }
    return true;
  }

  isSaveDisable(data: any) {
    console.log('data: ', data);
    const actionItems = this.staffDetailsForm?.value;
    console.log('actionItems: ', actionItems);

    if (actionItems) {
      if ((actionItems.CallID?.length > 0 && actionItems.CallID?.length <= 10) &&
          (actionItems.CallOrder?.length > 0) &&
          // (data.Index != 0 && (actionItems.CallOrder1?.length > 0)) &&
          // (data.Index != 1 && (actionItems.CallIniOrder?.length > 0 || true)) &&
          (data.Index == 1? (actionItems.CallIniOrder?.length == 0) : actionItems.CallIniOrder?.length > 0) &&
          (actionItems.Role?.length > 0) &&
          (actionItems.CallInitiator?.length > 0) &&
          (actionItems.Mobile?.length > 0) &&
          (actionItems.Mobile?.length < 13) &&
          (actionItems.Residence?.length > 0) &&
          (actionItems.CallReceiver?.length > 0) &&
          (actionItems.DesignationC?.length > 0) &&
          (actionItems.MobileR?.length < 13) &&
          (actionItems.MobileR?.length > 0) &&
          (actionItems.DesignationR?.length > 0) &&
          (actionItems.ResidenceR?.length > 0)) {
          return true;
      }
  }
  return false;
  }

  async comparestaffContactDetailsData() {
    let hasChanges   = this.isDataChanged(this.businessContinuityService.TableSCD.data,  this.StaffContactData);
    this.checkStaffContactDataChanges.emit(hasChanges);
    return hasChanges;
  }

  private isDataChanged(newData?: any, oldData?: any): boolean {
    if (this.blockEdit) {
      return true;
    }

    if (oldData.length != newData.length) {
      return true;
    }

    oldData.sort((a:any, b:any) => a.StaffContactID - b.StaffContactID);
    newData.sort((a:any, b:any) => a.StaffContactID - b.StaffContactID);

    for (let i = 0; i < newData.length; i++) {
      const newItem = newData[i];
      const oldItem = oldData[i];
      if (newItem.CallID !== oldItem.CallID || newItem.CallInitiator !== oldItem.CallInitiator || newItem.CallInitiatorGUID !== oldItem.CallInitiatorGUID
        || newItem.CallOrder !== oldItem.CallOrder || newItem.CallOrder1 !== oldItem.CallOrder1 || newItem.CallReceiver !== oldItem.CallReceiver
        || newItem.CallReceiverGUID !== oldItem.CallReceiverGUID || newItem.CallReceiverName !== oldItem.CallReceiverName || newItem.DesignationC !== oldItem.DesignationC
        || newItem.DesignationR !== oldItem.DesignationR || newItem.Mobile !== oldItem.Mobile || newItem.MobileR !== oldItem.MobileR
        || newItem.Residence !== oldItem.Residence || newItem.ResidenceR !== oldItem.ResidenceR || newItem.Role !== oldItem.Role) {
        return true;
      }
    }

    return false;
  }
}
