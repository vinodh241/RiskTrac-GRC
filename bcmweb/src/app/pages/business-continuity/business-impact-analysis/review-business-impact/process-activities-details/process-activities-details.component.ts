import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatTableDataSource } from '@angular/material/table';
import { addIndex } from 'src/app/includes/utilities/commonFunctions';
import { AlertComponent } from 'src/app/includes/utilities/popups/alert/alert.component';
import { ConfirmDialogComponent } from 'src/app/includes/utilities/popups/confirm/confirm-dialog.component';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { BusinessContinuityPlansService } from 'src/app/services/business-continuity-plans/business-continuity-plans.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-process-activities-details',
  templateUrl: './process-activities-details.component.html',
  styleUrls: ['./process-activities-details.component.scss']
})

export class ProcessActivitiesDetailsComponent implements OnInit {

  displayedColumns = ['Index', 'Name', 'Description', 'Action'];
  displayedColumns1 = ['Index', 'Name', 'Description'];
  @Input() processActivityFlag: any;
  @Output() dataProcessSaved = new EventEmitter<boolean>();
  @Output() allProcessActivities = new EventEmitter<any>();
  @Output() tabsEnableData = new EventEmitter<any>();
  @Output() checkProcessActivityDataChanges = new EventEmitter<any>();


  processActivityForm!: FormGroup;
  viewAllDetails: any[] = [];
  subProcess: any = [];
  newProcess: any[] = [];
  processData: any = '';
  processName: any = '';
  saveerror = "";
  errorMsg = '';
  processMode: string = "Add";
  @ViewChildren(MatExpansionPanel)
  panels!: QueryList<MatExpansionPanel>;
  processExists: boolean = false;
  blockEdit: boolean = false;
  submitted: boolean = false;
  isBCPListing: boolean = false;
  isAllExpanded: boolean = false;
  processSubmit: boolean = false;
  isDisable: boolean = false;
  duplicateErr: boolean = false;
  isSavedPro: boolean = false;
  facilityDetails: any;
  processActivitiyDetails: any;
  BusinessProcessList: any;
  subProcessList: any;
  pushedValue: any;
  IsBCManager: any;
  IsBusinessOwner: any;
  IsBCC: any;
  currentStatus: any;
  BusinessProcessDetailsID: any;
  workFlowStatus: any;
  workFlowStatusID: any;
  existingData: any;
  checkProcess: any;
  IsBCCValidUser: any;

  MTPDList: any[] = [
    {
      'MTPDId': 1,
      'MTPDIName': "Hours"
    },
    {
      'MTPDId': 2,
      'MTPDIName': "Day(s)"
    }]

  RTOList: any[] = [
    {
      'RTOId': 1,
      'RTOName': "Hours"
    },
    {
      'RTOId': 2,
      'RTOName': "Day(s)"
    }]

  RPOList: any[] = [
    {
      'RPOId': 1,
      'RPOName': "Hours"
    },
    {
      'RPOId': 2,
      'RPOName': "Day(s)"
    }]
  allIDsIncluded: any;
  processDetails:any;
  constructor(
    @Inject(DOCUMENT) private _document: any,
    public utils: UtilsService,
    public dialog: MatDialog,
    public service: BusinessContinuityPlansService,
    private fb: FormBuilder,
    private el: ElementRef
  ) { }

  ngOnInit(): void {
    this.service.getProcessActivityDetails(localStorage.getItem("BusinessFunctionID"), localStorage.getItem("BusinessContinuityPlanID"), 2);
    this.service.processActivitySubj.subscribe((value: any) => {
      if (value) {
        this.BusinessProcessList      = this.service.processActivity.businessProcessListInfo;
        this.processActivitiyDetails  = this.service.processActivity.ReviewBusinessProcessDetails;
        this.facilityDetails          = this.service.processActivity.siteListInfo;
        this.isBCPListing             = this.service.listingPageDetails;
        this.viewAllDetails           = this.service.processActivity.BusinessProcessDetailsView || [];
        this.isSavedPro               = this.viewAllDetails[0]?.IsSaved;
        this.existingData             = this.service.processActivity.valueList || [];
        this.dataProcessSaved.emit(this.service.dataProcessSaved)
        this.currentStatus            = Number(localStorage.getItem("CurrentWorkFlowStatusID"));
        this.IsBCManager              = localStorage.getItem("IsBCManager");
        this.IsBusinessOwner          = localStorage.getItem("IsBusinessOwner");
        this.IsBCC                    = localStorage.getItem("IsBCCUser");
        this.IsBCCValidUser           = Number(localStorage.getItem("IsBCCValidUser"));
        this.processDetails           = this.service.processActivity.BusinessProcessDetailsView || [];


        if (this.IsBCCValidUser == 1 && (this.currentStatus == 7 || this.currentStatus == 2 || this.currentStatus == 1)) {
          this.isBCPListing = false;
        } else {
          this.isBCPListing = true;
        }

        if (this.viewAllDetails.length === 0) {
          this.createForm();
          this.patchFewValues(this.existingData, this.BusinessProcessList);
        } else if (this.viewAllDetails && this.viewAllDetails[0]?.BusinessProcessDesc != null) {
          this.patchFormValues(this.viewAllDetails)
        }
        const detailsViewIds = new Set(this.viewAllDetails.map(item => item.BusinessProcessID));
        const unmatchedData = this.BusinessProcessList.filter((x: any) => !detailsViewIds.has(x.BusinessProcessID));
        if (unmatchedData.length) {
          this.patchFewValues(this.existingData, unmatchedData);
        }
      }
      this.workFlowStatus = localStorage.getItem("WorkFlowStatus")
      this.workFlowStatusID = localStorage.getItem("WorkFlowStatusID")

    })
    this.service.TablePA = new MatTableDataSource();
  }

  createForm() {
    const formGroup: { [key: string]: any } = {};
    this.BusinessProcessList.forEach((activiity: any) => {
      formGroup['desc_' + activiity.BusinessProcessID] = new FormControl('');
      formGroup['facility_' + activiity.BusinessProcessID] = new FormControl('');
      formGroup['normalWH_' + activiity.BusinessProcessID] = new FormControl('');
      formGroup['normalWHTO_' + activiity.BusinessProcessID] = new FormControl('');
      formGroup['peakWH_' + activiity.BusinessProcessID] = new FormControl('');
      formGroup['peakWHTO_' + activiity.BusinessProcessID] = new FormControl('');
      formGroup['MTPD_' + activiity.BusinessProcessID] = new FormControl('');
      formGroup['MTPDUnit_' + activiity.BusinessProcessID] = new FormControl('');
      formGroup['RTO_' + activiity.BusinessProcessID] = new FormControl('');
      formGroup['RTOUnit_' + activiity.BusinessProcessID] = new FormControl('');
      formGroup['RPO_' + activiity.BusinessProcessID] = new FormControl('');
      formGroup['RPOUnit_' + activiity.BusinessProcessID] = new FormControl('');
      formGroup['MAC_' + activiity.BusinessProcessID] = new FormControl('');
      formGroup['remote_' + activiity.BusinessProcessID] = new FormControl('');
      formGroup['ofc_' + activiity.BusinessProcessID] = new FormControl('');
      formGroup['ofc_' + activiity.BusinessProcessID] = new FormControl('');
    });
    this.processActivityForm = this.fb.group(formGroup);
  }

  patchFewValues(data: any, processDetail: any) {
    setTimeout(() => {
      processDetail.forEach((rec: any) => {
        const businessProcessID = rec.BusinessProcessID;
        this.processActivityForm.patchValue({
          ['RTO_' + businessProcessID]: data[0].RTO,
          ['RTOUnit_' + businessProcessID]: data[0].RTOUnit,
          ['RPO_' + businessProcessID]: data[0].RPO,
          ['RPOUnit_' + businessProcessID]: data[0].RPOUnit,
        });
      });
    }, 1000)
  }

  patchFormValues(output: any[]) {
    this.service.TablePA.data = []
    this.subProcess = []
    this.createForm();
    setTimeout(() => {
      output.forEach(activity => {
        const businessProcessID = activity.BusinessProcessID;
        this.processActivityForm.patchValue({
          ['desc_' + businessProcessID]: activity.BusinessProcessDesc,
          ['facility_' + businessProcessID]: activity.SiteID,
          ['normalWH_' + businessProcessID]: activity.NormalWorkingHoursStart,
          ['normalWHTO_' + businessProcessID]: activity.NormalWorkingHoursEnd,
          ['peakWH_' + businessProcessID]: activity.PeakWorkingHoursStart,
          ['peakWHTO_' + businessProcessID]: activity.PeakWorkingHoursEnd,
          ['MTPD_' + businessProcessID]: activity.MTPD,
          ['MTPDUnit_' + businessProcessID]: activity.MTPDUnit,
          ['RTO_' + businessProcessID]: activity.RTO,
          ['RTOUnit_' + businessProcessID]: activity.RTOUnit,
          ['RPO_' + businessProcessID]: activity.RPO,
          ['RPOUnit_' + businessProcessID]: activity.RPOUnit,
          ['MAC_' + businessProcessID]: activity.MAC,
          ['remote_' + businessProcessID]: activity.MNPRRemoteHeadCount,
          ['ofc_' + businessProcessID]: activity.MNPROfficeHeadCount,
        });
        this.service.TablePA.data.push(...activity.SubProcessActivities)
      });
      this.subProcess = Array.from(new Set(this.service.TablePA.data.filter((x: any) => x.BusinessContinuityPlanID == localStorage.getItem('BusinessContinuityPlanID')).map((a: any) => a.SubBusinessProcessId))).map(SubBusinessProcessId => {
        return this.service.TablePA.data.find((a: any) => a.SubBusinessProcessId === SubBusinessProcessId)
      })
      this.service.TablePA = new MatTableDataSource(addIndex(this.subProcess, true))
    }, 500)
  }

  parseInputJSON(input: any) {
    const processDetails: any[] = [];

    for (const key in input) {
      if (input.hasOwnProperty(key)) {
        const [prefix, suffix] = key.split('_');
        const index = parseInt(suffix);
        if (!isNaN(index)) {
          let processDetail = processDetails[index - 1];
          if (!processDetail) {
            processDetail = {};
            processDetails[index - 1] = processDetail;
          }
          switch (prefix) {
            case "desc":
              processDetail["BusinessActivityID"] = index;
              processDetail["ActivityDescription"] = input[key];
              break;
            case "facility":
              processDetail["FacilityID"] = input[key];
              break;
            case "normalWH":
              processDetail["NormalWorkingHours"] = input[key];
              break;
            case "normalWHTO":
              processDetail["NormalWorkingHoursTo"] = input[key];
              break;
            case "peakWH":
              processDetail["PeakWorkingHours"] = input[key];
              break;
            case "peakWHTO":
              processDetail["PeakWorkingHoursTo"] = input[key];
              break;
            case "MTPD":
              processDetail["MTPD"] = input[key];
              break;
            case "MTPDUnit":
              processDetail["MTPDUnit"] = input[key];
              break;
            case "RTO":
              processDetail["RTO"] = input[key];
              break;
            case "RTOUnit":
              processDetail["RTOUnit"] = input[key];
              break;
            case "RPO":
              processDetail["RPO"] = input[key];
              break;
            case "RPOUnit":
              processDetail["RPOUnit"] = input[key];
              break;
            case "MAC":
              processDetail["MAC"] = input[key];
              break;
            case "remote":
              processDetail["RemoteLocationID"] = input[key];
              break;
            case "ofc":
              processDetail["OfficeLocationID"] = input[key];
              break;
            default:
              break;
          }
        }
      }
    }
    return processDetails.filter(detail => Object.keys(detail).length > 0);
  }

  addProcess(id: any) {
    this.duplicateErr = false;
    this.processName = "";
    this.processData = "";
    this.blockEdit = true;
    this.processMode = "Add";
    if (this.BusinessProcessList.map((x: any) => x.BusinessProcessID).includes(id)) {
      this.service.TablePA.data.push({
        "Index": this.service.TablePA.data.length + 1,
        "BusinessProcessID": id,
        "Name": "",
        "Description": "",
        "SubBusinessProcessId": null,
        "isEdit": true
      });
    }
    this.service.TablePA._updateChangeSubscription();
  }

  processList(processId: any) {
    return this.service.TablePA.data.filter((ele: any) => ele.BusinessProcessID == processId)
  }

  saveProcess(process: any) {
    if (this.processExists)
      return
    this.blockEdit = false;
    process.isEdit = false;
    this.service.TablePA.data = this.service.TablePA.data.map((x: any) =>
      x.Index === process.Index ? { ...x, Name: this.processName, Description: this.processData } : x
    );
    this.processName = "";
    this.processData = "";
  }

  deleteProcess(process: any) {
    this.duplicateErr = false;
    const index = this.service.TablePA.data.findIndex(item => item.Index === process.Index);

    const confirm = this.dialog.open(ConfirmDialogComponent, {
      id: 'ConfirmDialogComponent',
      disableClose: true,
      minWidth: '300px',
      panelClass: 'dark',
      data: {
        title: 'Confirmation',
        content:
          'Are you sure you want to delete the Sub Process?',
      },
    });
    confirm.afterClosed().subscribe((result) => {
      if (result) {
        if (index !== -1) {
          this.service.TablePA.data.splice(index, 1);
        }
        this.service.TablePA.data = addIndex(this.service.TablePA.data, false);
        this.service.TablePA._updateChangeSubscription();
      }
    })
  }

  cancel(process: any) {
    this.duplicateErr = false;
    this.blockEdit = false;
    this.processSubmit = false;
    this.processExists = false;
    this.service.TablePA.data.forEach((x: any) => {
      x.isEdit = false;
    });

    const index = this.service.TablePA.data.indexOf(process.index);
    this.service.TablePA.data.splice(index, 1);
    this.service.TablePA._updateChangeSubscription();
    this.processMode = "";
  }

  onChangeDesc(e: any, id: any) {
    this.processData = e.target.value;
  }

  onChangeName(e: any, id: any) {
    this.processName = e.target.value;
    this.processExists = this.service.TablePA.data.filter((y: any) => y.BusinessProcessID == id).some((x: any) => (x.Name.trim().toLowerCase() === this.processName.trim().toLowerCase()) && (!x.isEdit))
    if (this.processExists == true) {
      this.duplicateErr = true;
      this.checkProcess = id;
    } else {
      this.duplicateErr = false;
    }
  }

  checkProcessSave(data: any) {
    return data.some((x: any) => x.isEdit);
  }

  save() {
    let output = this.parseInputJSON(this.processActivityForm.value)
    this.submitted = true;
    this.processSubmit = true;

    if (this.viewAllDetails.length == 0) {
      output.forEach((ob: any) => {
        let { BusinessProcessDetailsID } = ob
        ob.BusinessProcessDetailsID = null;
      })
    } else {
      let processDetailsMap = new Map(this.viewAllDetails.map(item => [item.BusinessProcessID, item.BusinessProcessDetailsID]));
      output.forEach(activity => {
        let detailsID = processDetailsMap.get(activity.BusinessActivityID);
        activity.BusinessProcessDetailsID = detailsID !== undefined ? detailsID : null;
      });
    }

    this.service.addUpdateProcessActiviti(localStorage.getItem("BusinessContinuityPlanID"), output, this.service.TablePA.data).subscribe(res => {
      if (res.success == 1) {
        let ProcessData = (res.result)
        this.saveSuccess("Process or Activities saved Successfully", ProcessData);
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

  saveSuccess(content: string, resultData: any): void {
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
      this.tabsEnableData.emit(resultData?.completeSavedData)
      this.allProcessActivities.emit(resultData?.Section2AllProcessSaved)
      setTimeout(() => {
        confirm.close();
        this.service.getProcessActivityDetails(localStorage.getItem("BusinessFunctionID"), localStorage.getItem("BusinessContinuityPlanID"), 2);
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

  isAnyControlInvalid(): boolean {
    let val: boolean = false
    for (const controlName in this.processActivityForm?.controls) {
      if (controlName.startsWith('MAC_')) {
        const control = this.processActivityForm?.get(controlName);
        if (control && control.value == 0) {
          return val = true;
        } else if (control && !control.value) {
          return true;
        }
      } else if (controlName.startsWith('remote_')) {
        const control = this.processActivityForm?.get(controlName);
        if (control && control.value == 0) {
          return val = true;
        } else if (control && !control.value) {
          return true;
        }
      } else if (controlName.startsWith('ofc_')) {
        const control = this.processActivityForm?.get(controlName);
        if (control && control.value == 0) {
          return val = true;
        } else if (control && !control.value) {
          return true;
        }
      } else if (controlName.startsWith('RTO_') || controlName.startsWith('RPO_')) {
        // RTO and RPO fields can accept 0 as valid value
        const control = this.processActivityForm?.get(controlName);
        if (control && (control.value === null || control.value === undefined || control.value === '')) {
          return true;
        }
      }
      else {
        const control = this.processActivityForm?.get(controlName);
        if (control && !control.value) {
          return true;
        }
      }
    }
    val = false;
    return val
  }

  isAnyTableInvalid(): boolean {
    let BusinessProcessIDs = this.BusinessProcessList?.map((p: any) => p.BusinessProcessID);
    this.allIDsIncluded = BusinessProcessIDs?.every((id: any) => {
      return this.service.TablePA.data.some(entry => entry.BusinessProcessID === id && entry.Name !== "");
    });

    if (this.allIDsIncluded) {
      return false
    }
    return true;
  }

  isSaveEnable(): boolean {
    if (!this.isAnyTableInvalid() && !this.isAnyControlInvalid() && this.service.TablePA.data.length > 0 && this.blockEdit != true) {
      return false
    }
    return true
  }

  isValueInRange(event: Event, businessProcessID: number): void {
    const inputElement = event.target as HTMLInputElement;
    const value = Number(inputElement.value);
    let title = 'MAC (Minimum Acceptable Capacity)'

    if (value > 100) {
      let msg = "This value cannot exceed more than 100%."
      this.showPopup(title, msg).afterClosed().subscribe(() => {
        const formControlName = 'MAC_' + businessProcessID;
        this.processActivityForm.get(formControlName)?.setValue(null);
      });
    } else if (value < 0) {
      let msg = "This value cannot be Negative."
      this.showPopup(title, msg).afterClosed().subscribe(() => {
        const formControlName = 'MAC_' + businessProcessID;
        this.processActivityForm.get(formControlName)?.setValue(null);
      });
    }
  }

  showPopup(tit: any, msg: any) {
    return this.dialog.open(AlertComponent, {
      panelClass: 'full-screen-modal',
      data: {
        title: tit,
        content: msg
      }
    });
  }

  noDecimal(event: Event, contol: string, businessProcessID: any) {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;
    const isNumber = /^[0-9]+$/.test(value)
    if (!isNumber && value) {
      this.errorMsg = `Decimal number is not allowed`
      this.showPopup1().afterClosed().subscribe(() => {
        const formControlName = contol + businessProcessID;
        this.processActivityForm.get(formControlName)?.setValue(null);
      });
    } else if (value == '') {
      this.errorMsg = `Please enter the value`
      this.showPopup1()
    } else if (Number(value) == 0 && !contol.startsWith('RTO_') && !contol.startsWith('RPO_')) {
      // Only apply zero restriction for non-RTO/RPO fields
      this.errorMsg = `This value cannot be zero`
      this.showPopup1().afterClosed().subscribe(() => {
        const formControlName = contol + businessProcessID;
        this.processActivityForm.get(formControlName)?.setValue(null);
      });
    }
  }

  showPopup1() {
    return this.dialog.open(AlertComponent, {
      panelClass: 'full-screen-modal',
      data: {
        title: 'Error Message',
        content: this.errorMsg
      }
    });
  }

  validTimeNormalWorkingHours(event: Event, businessProcessID: any, type: any) {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;
    const startControlName = `normalWH_${businessProcessID}`;
    const endControlName = `normalWHTO_${businessProcessID}`;
    const startControl = this.processActivityForm.get(startControlName);
    const endControl = this.processActivityForm.get(endControlName);
    if (startControl && endControl) {
      const start = startControl.value !== '' ? this.parseTime(startControl.value) : null;
      const end = endControl.value !== '' ? this.parseTime(endControl.value) : null;
      if (start !== null && end !== null) {
        if (start >= end && type == 'NWHTo') {
          let title = 'Normal working hours(end time)'
          let msg = 'From time cannot be greater than To time'
          this.showPopup(title, msg).afterClosed().subscribe(() => {
            const formControlName = 'normalWHTO_' + businessProcessID;
            this.processActivityForm.get(formControlName)?.setValue(null);
          });
        } else if (start >= end && type == 'NWHFrom') {
          let title = 'Normal working hours(start time)'
          let msg = 'From time cannot be greater than To time'
          this.showPopup(title, msg).afterClosed().subscribe(() => {
            const formControlName = 'normalWH_' + businessProcessID;
            this.processActivityForm.get(formControlName)?.setValue(null);
          });
        }
      }
    }
  }

  validTimePeakWorkingHours(event: Event, businessProcessID: any, type: any) {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;
    const startControlName = `peakWH_${businessProcessID}`;
    const endControlName = `peakWHTO_${businessProcessID}`;
    const startControl = this.processActivityForm.get(startControlName);
    const endControl = this.processActivityForm.get(endControlName);
    if (startControl && endControl) {
      const start = startControl.value !== '' ? this.parseTime(startControl.value) : null;
      const end = endControl.value !== '' ? this.parseTime(endControl.value) : null;
      if (start !== null && end !== null) {
        if (start >= end && type == 'peakWHTO') {
          let title = 'Peak working hours(end time)'
          let msg = 'From time cannot be greater than To time'
          this.showPopup(title, msg).afterClosed().subscribe(() => {
            const formControlName = 'peakWHTO_' + businessProcessID;
            this.processActivityForm.get(formControlName)?.setValue(null);
          });
        } else if (start >= end && type == 'peakWH') {
          let title = 'Peak working hours(start time)'
          let msg = 'From time cannot be greater than To time'
          this.showPopup(title, msg).afterClosed().subscribe(() => {
            const formControlName = 'peakWH_' + businessProcessID;
            this.processActivityForm.get(formControlName)?.setValue(null);
          });
        }
      }
    }
  }

  parseTime(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  async compareProcessActivityData() {
    let output = this.parseInputJSON(this.processActivityForm.value)
    this.submitted = true;
    this.processSubmit = true;

    if (this.viewAllDetails.length == 0) {
      output.forEach((ob: any) => {
        let { BusinessProcessDetailsID } = ob
        ob.BusinessProcessDetailsID = null;
      })
    } else {
      let processDetailsMap = new Map(this.viewAllDetails.map(item => [item.BusinessProcessID, item.BusinessProcessDetailsID]));
      output.forEach(activity => {
        let detailsID = processDetailsMap.get(activity.BusinessActivityID);
        activity.BusinessProcessDetailsID = detailsID !== undefined ? detailsID : null;
      });
    }
    let outputData = output;
    let subProcessData =this.service.TablePA.data
    let processData:any = {
      BusinessContinuityPlanId: Number(localStorage.getItem("BusinessContinuityPlanID")),
      BusinessProcesses: [],
      BusinessProcessDescription: null,
      SubBusinessProcesses: []
    }
    outputData.forEach((item: any) => {
      processData['BusinessProcesses'].push({
        "BusinessProcessID": item.BusinessActivityID,
        "BusinessProcessDetailsID": item.BusinessProcessDetailsID,
        "BusinessProcessDesc": item.ActivityDescription,
        "SiteID": item.FacilityID,
        "SiteName": null,
        "NormalWorkingHoursStart": item.NormalWorkingHours,
        "NormalWorkingHoursEnd": item.NormalWorkingHoursTo,
        "PeakWorkingHoursStart": item.PeakWorkingHours,
        "PeakWorkingHoursEnd": item.PeakWorkingHoursTo,
        "MTPD": item.MTPD + "_" + item.MTPDUnit + "_" + ((item.MTPDUnit == "Day(s)") ? (item.MTPD * 24) : item.MTPD),
        "RTO": item.RTO + "_" + item.RTOUnit + "_" + ((item.RTOUnit == "Day(s)") ? (item.RTO * 24) : item.RTO),
        "RPO": item.RPO + "_" + item.RPOUnit + "_" + ((item.RPOUnit == "Day(s)") ? (item.RPO * 24) : item.RPO),
        "MAC": Number(item.MAC),
        "MNPRRemoteHeadCount": Number(item.RemoteLocationID),
        "MNPROfficeHeadCount": Number(item.OfficeLocationID)
      })
    });

    subProcessData.forEach((rec: any) => {
      processData['SubBusinessProcesses'].push({
        "SubProcessId": rec.SubBusinessProcessId ? rec.SubBusinessProcessId : null,
        "SubProcessName": rec.Name,
        "SubProcessDescription": rec.Description,
        "BusinessProcessID": rec.BusinessProcessID
      })
    })

    let hasChanges   = this.isDataChanged(processData,  this.processDetails);
    this.checkProcessActivityDataChanges.emit(hasChanges);
    return hasChanges;
  }

  private isDataChanged(newData: any, oldData: any): boolean {


    if (!newData || !oldData) return true;

    const newProcesses = newData.BusinessProcesses.map((p: any) => ({
        ...p,
        MTPD: p.MTPD.split("_")[0], 
        RTO: p.RTO.split("_")[0],
        RPO: p.RPO.split("_")[0],
        SiteName :  this.facilityDetails.find((nn:any) => nn.SiteID == p.SiteID)?.SiteName || ''
    }));

    const oldProcesses = oldData.map((p: any) => ({
        ...p,
        MTPD: String(p.MTPD), 
        RTO: String(p.RTO),
        RPO: String(p.RPO),        
    }));

    const newSubProcesses = newData.SubBusinessProcesses;
    const oldSubProcesses = oldData.flatMap((p:any) => p.SubProcessActivities);

    if(!oldProcesses.length) {
      const mappedOb = newProcesses.map((nn:any) => {
        let filteredItem = { ...nn };
        return filteredItem;
      });
      
      for (let i = 0; i < mappedOb.length; i++) {
        for (let key in mappedOb[i]) {
            if (mappedOb[i][key] && !['RTO', 'RPO','BusinessProcessID' ].includes(key)) {
                return true; 
            } else if(this.existingData.length && ['RTO', 'RPO'].includes(key)) {
              // Allow 0 values for RTO and RPO, so check explicitly for null/undefined/empty string
              const newValue = mappedOb[i][key];
              const existingValue = this.existingData[0][key];
              if ((newValue !== null && newValue !== undefined && newValue !== '') && 
                  String(existingValue) !== String(newValue)) {
                return true; 
              }
            }
        }
      }
      if(newSubProcesses.length) {
        return true;
      }
    }
    
    if (oldProcesses.length ) {
      for (let i = 0; i < newProcesses.length; i++) {
        const newProcess = newProcesses[i];
        const oldProcess = oldProcesses.find((p:any) => p.BusinessProcessID === newProcess.BusinessProcessID);
        if (!oldProcess) return true;   
        for (let key in newProcess) {
            if (newProcess[key] !== oldProcess[key]) {           
              return true;
            }
        }
      }

      if (newSubProcesses.length !== oldSubProcesses.length) return true;

      for (let i = 0; i < newSubProcesses.length; i++) {
          const newSub = newSubProcesses[i];
          const oldSub = oldSubProcesses.find((s:any) => s.SubBusinessProcessId === newSub.SubProcessId);
          if (!oldSub) return true;
          if (newSub.SubProcessName !== oldSub.Name || newSub.SubProcessDescription !== oldSub.Description) {
            return true;
          }
      }
      return false;
    }

    return false; 
  }

}
