import { DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Inject, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatTableDataSource } from '@angular/material/table';
import { addIndex } from 'src/app/includes/utilities/commonFunctions';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { BusinessContinuityPlansService } from 'src/app/services/business-continuity-plans/business-continuity-plans.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-dependencies',
  templateUrl: './dependencies.component.html',
  styleUrls: ['./dependencies.component.scss']
})

export class DependenciesComponent {

  @ViewChildren(MatExpansionPanel)
  panels!: QueryList<MatExpansionPanel>;
  @Input() dependencyFlag: any
  @Output() dataDepSaved = new EventEmitter<boolean>();
  @Output() checkDependencyDataChanges = new EventEmitter<any>();

  dependencyForm!: FormGroup
  displayedColumnsTD = ['Index', 'BusinessApplication', 'Description', 'Action'];
  displayedColumnsIP = ['Index', 'Activity', 'Dependency', 'Function', 'Type', 'Action'];
  displayedColumnsSD = ['Index', 'Activity', 'Dependency', 'Supplier', 'Type', 'Action'];
  displayedColumnsTDV = ['Index', 'BusinessApplication', 'Description'];
  displayedColumnsIPV = ['Index', 'Activity', 'Dependency', 'Function', 'Type'];
  displayedColumnsSDV = ['Index', 'Activity', 'Dependency', 'Supplier', 'Type'];
  suplierProcessData: any[] = [];
  processData: any[] = [];
  dependencyData: any[] = []
  techDependencyExits: boolean = false;
  blockEdit: boolean = false;
  isAllExpanded: boolean = false;
  controlMode: string = "Add";
  controlData: any = '';
  businessProcess: any;
  businessApplication: any;
  dependencyType: any;
  technology: any;
  criticalData: any;
  criticalExists: any;
  description: any;
  businessProcessID: any;
  subProcess: any;
  alldata: any;
  dependentFunctions: any;
  supplierList: any;
  listingBCP: any;
  allViewDetails: any;
  technologyDetails: any;
  dependency: any;
  saveerror: any;
  allPatchData: any;
  workFlowStatus: any;
  workFlowStatusID: any;
  processID: any;
  currentStatus: any;
  tableDataIntedependent: any;
  tableDataSupplier: any;
  tableDataTech: any;
  wait: any;
  isavedPara: any;
  dependencyDetails:any;

  constructor(
    public businessContinuityService: BusinessContinuityPlansService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    @Inject(DOCUMENT) private _document: any,
    public utils: UtilsService,
    private cdr: ChangeDetectorRef
  ) {
    this.businessContinuityService.getDependenciesInfo(Number(localStorage.getItem("BusinessContinuityPlanID")), Number(localStorage.getItem("BusinessFunctionID")))
    this.businessContinuityService.processDependencySubj.subscribe((value) => {
      if (value) {
        this.businessProcess      = this.businessContinuityService.processDependenciesData.BusinessProcesslist || []
        this.businessApplication  = this.businessContinuityService.processDependenciesData.BusinessApplicationsList || []
        this.dependencyType       = this.businessContinuityService.processDependenciesData.DependencyTypeList || []
        this.subProcess           = this.businessContinuityService.processDependenciesData.BusinessSubActivityLists || []
        this.allPatchData         = this.businessContinuityService.processDependenciesData.OriginalDependenciesDetails || []
        this.dependentFunctions   = this.businessContinuityService.processDependenciesData.DependentFunctionsList || []
        this.supplierList         = this.businessContinuityService.processDependenciesData.SupplierList || []
        this.technologyDetails    = this.businessContinuityService.processDependenciesData?.DependenciesDetails || []
        this.isavedPara           = this.businessContinuityService.processDependenciesData.OriginalDependenciesDetails[0]?.InterDependentProcess[0]?.IsSaved
        this.dataDepSaved.emit(this.businessContinuityService.dataDepSaved)
        let IsBCCValidUser        = Number(localStorage.getItem("IsBCCValidUser"))
        this.currentStatus        = Number(localStorage.getItem("CurrentWorkFlowStatusID"));
        this.dependencyDetails    = this.businessContinuityService.processDependenciesData?.DependenciesDetails || []

        if (IsBCCValidUser == 1 && (this.currentStatus == 7 || this.currentStatus == 2 || this.currentStatus == 1)) {
          this.listingBCP = false;
        } else {
          this.listingBCP = true;
        }
        if (!this.businessContinuityService.TableIP) {
          this.businessContinuityService.TableIP = new MatTableDataSource();
        }

        if (!this.businessContinuityService.TableIP.data) {
          this.businessContinuityService.TableIP.data = [];
        }
        for (let data of this.businessProcess) {
          for (let sub of this.subProcess) {
            if (data.BusinessActivityID == sub.BusinessProcessID) {
              this.businessContinuityService.TableIP.data.push({
                "SubActivity": sub.SubActivityName, 'SubActivityID': sub.SubActivityID,
                "ProcessID": data.BusinessActivityID, Index: 0, Activity: null, Dependency: '', Function: '', Type: null
              })
            }
          }
        }
        this.processData = this.businessContinuityService.TableIP.data

        if (!this.businessContinuityService.TableSD) {
          this.businessContinuityService.TableSD = new MatTableDataSource();
        }

        if (!this.businessContinuityService.TableSD.data) {
          this.businessContinuityService.TableSD.data = [];
        }
        for (let data of this.businessProcess) {
          for (let sub of this.subProcess) {
            if (data.BusinessActivityID == sub.BusinessProcessID) {
              this.businessContinuityService.TableSD.data.push({
                "SubActivity": sub.SubActivityName, 'SubActivityID': sub.SubActivityID,
                "ProcessID": data.BusinessActivityID, Index: 0, Dependency: '', Supplier: '', Type: null
              })
            }
          }
        }
        if (this.technologyDetails.length > 0) {
          this.initialze()
          this.businessContinuityService.TableTD = new MatTableDataSource();
          this.businessContinuityService.TableIP = new MatTableDataSource();
          this.businessContinuityService.TableSD = new MatTableDataSource();
          this.patchValue(this.allPatchData)
        }
        this.suplierProcessData = this.businessContinuityService.TableSD.data
        this.businessContinuityService.TableTDV = this.technologyDetails    //   [0].InterdependentProcesses
      }
      this.workFlowStatus = localStorage.getItem("WorkFlowStatus")
      this.workFlowStatusID = localStorage.getItem("WorkFlowStatusID")
    })
  }

  ngOnInit() {
    this.businessContinuityService.TableTD = new MatTableDataSource();
    this.businessContinuityService.TableTDV = new MatTableDataSource();
    this.businessContinuityService.TableTDV = this.technologyDetails;
    this.businessContinuityService.TableIP = new MatTableDataSource();
    this.businessContinuityService.TableIPV = new MatTableDataSource();
    this.workFlowStatus = localStorage.getItem("WorkFlowStatus")
    this.workFlowStatusID = localStorage.getItem("WorkFlowStatusID")
    this.initialze()
  }

  initialze() {
    this.dependencyForm = this.fb.group({
      Application: ['', Validators.required],
      Description: ['', [Validators.required, this.validateDescriptionLength]],
      Activity: ['', Validators.required],
      Dependency: ['',[Validators.required, this.validateDescriptionLength]],
      Function: ['', Validators.required],
      Type: ['', Validators.required],
      Supplier: ['', Validators.required]
    });
  }
  validateDescriptionLength(control: AbstractControl): ValidationErrors | null {
    return control.value && control.value.length > 500 ? { 'maxlength': true } : null;
  }


  patchValue(dataPatch: any) {
    setTimeout(() => {
      this.businessContinuityService.TableTD = new MatTableDataSource(this.businessContinuityService.addIndex(dataPatch[0]?.TechnologyDependencies, true))
      this.businessContinuityService.TableSD = new MatTableDataSource(this.businessContinuityService.addIndex(dataPatch[0]?.SupplierDependencies, true))
      this.suplierProcessData = this.businessContinuityService.TableSD.data
      this.businessContinuityService.TableIP = new MatTableDataSource(this.businessContinuityService.addIndex(dataPatch[0]?.InterDependentProcess, true))
      this.processData = this.businessContinuityService.TableIP.data
    }, 1000);
  }

  onChange(e: any, id: any) {
    this.technology = e.target.value;
    this.processID = id
    let techDepDet = this.dependencyForm.value.Application.trim().toLowerCase()
    this.techDependencyExits = this.businessContinuityService.TableTD.data.filter((ele: any) => ele.ID == id).some((x: any) => (x.BusinessApplication.trim().toLowerCase() === techDepDet) && (!x.isEdit))
  }

  onChangeDes(e: any) {
    this.description = e.target.value;
    this.techDependencyExits = this.businessContinuityService.TableTD.data.some((x: any) => (x.Description.trim().toLowerCase() === this.technology.trim().toLowerCase()) && (!x.isEdit))
  }

  deleteTech(Critical: any) {
    this.dependencyFlag = true
    const index = this.businessContinuityService.TableTD.data.findIndex(item => item.Index === Critical.Index);
    if (index !== -1) {
      this.businessContinuityService.TableTD.data.splice(index, 1);
    }
    this.businessContinuityService.TableTD.data = addIndex(this.businessContinuityService.TableTD.data, false);
    this.businessContinuityService.TableTD._updateChangeSubscription();
  }

  saveTech(critical: any) {
    this.dependencyFlag = true
    if (this.criticalExists) return;
    this.blockEdit = false;
    critical.isEdit = false;

    for (let business of this.businessProcess) {
      if (critical.ID == business.BusinessActivityID) {
        let busAppId = this.businessApplication.filter((ele: any) => ele.BusinessApplication == this.dependencyForm.value.Application)[0].BusinessApplicationID
        this.businessContinuityService.TableTD.data =
          this.businessContinuityService.TableTD.data.map((x: any) =>
            x.Index === critical.Index
              ? {
                ...x,
                Id: this.businessProcessID,
                BusinessAppId: busAppId,
                BusinessApplication: this.dependencyForm.value.Application,
                Description: this.dependencyForm.value.Description,
              }
              : x
          );
      }
    }
    this.dependencyForm.get('Application')?.reset();
    this.dependencyForm.get('Description')?.reset();
  }

  isSaveDisable() {
    const actionItems = this.dependencyForm?.value;
    if (this.techDependencyExits) {
      return
    }
    if (actionItems) {
      if ((actionItems.Application?.length > 0) && (actionItems.Description.trim()?.length > 0 && actionItems.Description.trim()?.length <= 500)) {
        return true;
      }
    }
    return false;
  }

  cancel(Critical: any) {
    this.blockEdit = false;
    this.techDependencyExits = false
    this.dependencyFlag = true

    this.businessContinuityService.TableTD.data.forEach((x: any) => {
      x.isEdit = false;
    });

    if (this.controlMode == "Edit") {
      this.businessContinuityService.TableTD._updateChangeSubscription();
    } else {
      const index = this.businessContinuityService.TableTD.data.indexOf(Critical.index);
      this.businessContinuityService.TableTD.data.splice(index, 1);
      this.businessContinuityService.TableTD._updateChangeSubscription();
    }
  }

  addtech(id: any) {
    this.dependencyFlag = true
    this.businessProcessID = id
    this.techDependencyExits = false
    this.blockEdit = true;
    this.controlMode = "Add"
    this.businessContinuityService.TableTD.data.push({ "ID": this.businessProcessID, "Index": this.businessContinuityService.TableTD.data.length + 1, 'BusinessApplication': '', "Description": "", "isEdit": true });
    this.dependencyForm.get('Application')?.setValue("");
    this.dependencyForm.get('Description')?.setValue("");
    this.businessContinuityService.TableTD._updateChangeSubscription();
  }

  filterData(businessID: any) {
    let filteredData = this.businessContinuityService.TableTD.data.filter((ele: any) => ele.ID == businessID);
    return filteredData
  }

  editTech(control: any) {
    this.dependencyFlag = true
    this.businessProcessID = control?.BusinessApplicaionID
    this.controlMode = "Edit"
    this.blockEdit = true;
    control.isEdit = true;

    setTimeout(() => {
      this.dependencyForm.patchValue({
        Description: control.Description,
        Application: control.BusinessApplication
      })
    }, 1000);
    this.dependencyForm.get('Application')?.setValue("");
    this.dependencyForm.get('Description')?.setValue("");
  }

  editInterdependent(control: any, id?: any) {
    this.dependencyFlag = true
    this.controlMode = "Edit"
    this.blockEdit = true;
    control.isEdit = true;
    this.dependencyForm.get('Dependency')?.reset();
    this.dependencyForm.get('Function')?.reset();
    this.dependencyForm.get('Type')?.reset();
    for (let data of this.businessProcess) {
      for (let sub of this.subProcess) {
        this.businessContinuityService.TableIP.data.push({
          "SubActivity": sub.SubActivity, "SubActivityID": sub.SubActivityID,
          "ProcessID": data.BusinessActivityID, Index: 0, Activity: null, Dependency: '', Function: '', Type: null
        })
      }
    }
    setTimeout(() => {
      this.dependencyForm.patchValue({
        Dependency: control.Dependency,
        Function: control.Function,
        Type: control.Type
      })
    }, 1000);
  }

  saveInterdependent(critical: any, processID: any) {
    this.dependencyFlag = true
    if (this.criticalExists) return;
    this.blockEdit = false;
    critical.isEdit = false;

    for (let business of this.businessProcess) {
      if (processID == business.BusinessActivityID) {
        let depID = this.dependentFunctions.filter((ele: any) => ele.BusinessFunction == this.dependencyForm.value.Function)[0].BusinessFunctionID
        let depTypeID = this.dependencyType.filter((ele: any) => ele.DependencyType == this.dependencyForm.value.Type)[0].DependencyID
        this.processData = this.processData.map((x: any) =>
          x.Index === critical.Index && x.ProcessID === processID
            ? {
              ...x,
              Id: processID,
              Dependency: this.dependencyForm.value.Dependency,
              DependencyID: depID,
              Function: this.dependencyForm.value.Function,
              Type: this.dependencyForm.value.Type,
              TypeID: depTypeID
            }
            : x
        );
      }
    }
  }

  isSaveIPDisable() {
    const actionItems = this.dependencyForm?.value;
    if (actionItems) {
      if ((actionItems.Dependency?.trim()?.length > 0 && actionItems.Dependency?.trim()?.length <= 500) && (actionItems.Function?.length > 0) && (actionItems.Type?.length > 0)) {
        return true;
      }
    }
    return false;
  }

  cancelInterdependent(interdependent: any) {
    this.dependencyFlag = true
    this.blockEdit = false;
    this.processData.forEach((x: any) => {
      x.isEdit = false;
    });
    if (this.controlMode == "Edit") {
      this.businessContinuityService.TableIP._updateChangeSubscription();
    } else {
      const index = this.processData.indexOf(interdependent.index);
      this.processData.splice(index, 1);
      this.businessContinuityService.TableIP._updateChangeSubscription();
    }
  }

  filterDataIP(businessID: any) {
    this.processData = Array.from(new Set(this.processData.map(ob => ob.SubActivityID))).map(SubActivityID => this.processData.find(ob => ob.SubActivityID === SubActivityID));
    this.dependencyFlag = true
    let x = 0;
    this.businessContinuityService.TableIP.data = this.processData.filter((ele: any) => ele.ProcessID == businessID);
    return this.businessContinuityService.TableIP.data;
  }

  editSupplier(control: any) {
    this.dependencyFlag = true
    this.controlMode = "Edit"
    this.blockEdit = true;
    control.isEdit = true;
    this.dependencyForm.get('Dependency')?.reset();
    this.dependencyForm.get('Supplier')?.reset();
    this.dependencyForm.get('Type')?.reset();
    for (let data of this.businessProcess) {
      for (let sub of this.subProcess) {
        this.businessContinuityService.TableSD.data.push({
          "SubActivity": sub.SubActivity, "SubActivityID": sub.SubActivityID,
          "ProcessID": data.BusinessActivityID, Index: 0, Dependency: '', Supplier: '', Type: null
        })
      }
    }
    setTimeout(() => {
      this.dependencyForm.patchValue({
        Dependency: control.Dependency,
        Supplier: control.Supplier,
        Type: control.Type
      })
    }, 1000);
  }

  saveSupplier(critical: any, processID: any) {
    this.dependencyFlag = true
    if (this.criticalExists) return;
    this.blockEdit = false;
    critical.isEdit = false;
    for (let business of this.businessProcess) {
      if (processID == business.BusinessActivityID) {
        let supID = this.supplierList.filter((ele: any) => ele.SupplierName == this.dependencyForm.value.Supplier)[0].SupplierID
        let supTypeID = this.dependencyType.filter((ele: any) => ele.DependencyType == this.dependencyForm.value.Type)[0].DependencyID
        this.suplierProcessData = this.suplierProcessData.map((x: any) =>
          x.Index === critical.Index && x.ProcessID === processID
            ? {
              ...x,
              Id: processID,
              Dependency: this.dependencyForm.value.Dependency,
              Supplier: this.dependencyForm.value.Supplier,
              SupplierID: supID,
              Type: this.dependencyForm.value.Type,
              TypeID: supTypeID
            }
            : x
        );
      }
    }
  }

  isSaveSuDisable() {
    const actionItems = this.dependencyForm?.value;
    if (actionItems) {
      if ((actionItems.Dependency?.trim()?.length > 0 && actionItems.Dependency?.trim()?.length <= 500) && (actionItems.Supplier?.length > 0) && (actionItems.Type?.length > 0)) {
        return true;
      }
    }
    return false;
  }

  cancelSupplier(interdependent: any) {
    this.dependencyFlag = true
    this.blockEdit = false;
    this.suplierProcessData.forEach((x: any) => {
      x.isEdit = false;
    });
    if (this.controlMode == "Edit") {
      this.businessContinuityService.TableSD._updateChangeSubscription();
    } else {
      const index = this.suplierProcessData.indexOf(interdependent.index);
      this.suplierProcessData.splice(index, 1);
      this.businessContinuityService.TableSD._updateChangeSubscription();
    }
  }

  filterDataSD(businessID: any) {
    this.dependencyFlag = true
    let x = 0;
    this.suplierProcessData = Array.from(new Set(this.suplierProcessData.map(ob => ob.SubActivityID))).map(SubActivityID => this.suplierProcessData.find(ob => ob.SubActivityID === SubActivityID));
    this.businessContinuityService.TableSD.data = this.suplierProcessData.filter((ele: any) => ele.ProcessID == businessID);
    this.businessContinuityService.TableSD.data.forEach(ob => {
      ob.Index = x + 1;
      x++;
    });
    return this.businessContinuityService.TableSD.data;
  }

  filterDataView(businessID: any) {
    return this.businessContinuityService.TableTDV.data.filter((ele: any) => ele.BusinessApplicationID == businessID)
  }

  filterDataIPView(businessID: any) {
    let x = 0;
    this.processData = Array.from(new Set(this.processData.map(ob => ob.SubActivityID))).map(SubActivityID => this.processData.find(ob => ob.SubActivityID === SubActivityID));
    this.businessContinuityService.TableIP.data = this.processData.filter((ele: any) => ele.ProcessID == businessID);
    this.businessContinuityService.TableIP.data.forEach(ob => {
      ob.Index = x + 1;
      x++;
    });
    return this.businessContinuityService.TableIP.data;
  }

  filterDataSDV(businessID: any) {
    this.dependencyFlag = true
    let x = 0;
    this.suplierProcessData = Array.from(new Set(this.suplierProcessData.map(ob => ob.SubActivityID))).map(SubActivityID => this.suplierProcessData.find(ob => ob.SubActivityID === SubActivityID));
    this.businessContinuityService.TableSD.data = this.suplierProcessData.filter((ele: any) => ele.ProcessID == businessID);
    this.businessContinuityService.TableSD.data.forEach(ob => {
      ob.Index = x + 1;
      x++;
    }
    );
    return this.businessContinuityService.TableSD.data;
  }

  toggleExpandCollapse() {
    if (this.isAllExpanded) {
      this.panels.forEach(panel => panel.close());
    } else {
      this.panels.forEach(panel => panel.open());
    }
    this.isAllExpanded = !this.isAllExpanded;
  }

  onSubmit() {
    this.dependencyFlag = true
    let output = this.modifyData(this.businessContinuityService.TableTD.data, Number(localStorage.getItem("BusinessContinuityPlanID")), this.processData, this.suplierProcessData);

    this.businessContinuityService.addDependencyData(output).subscribe((res) => {
      if (res.success == 1) {
        this.saveSuccess('Dependency saved successfully');
      } else {
        if (res.error.errorCode && res.error.errorCode == 'TOKEN_EXPIRED')
          this.utils.relogin(this._document);
        else this.saveerror = res.error.errorMessage;
      }
      error: console.log('err::', 'error');
    });
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

        this.businessContinuityService.getDependenciesInfo(localStorage.getItem("BusinessContinuityPlanID"), Number(localStorage.getItem("BusinessFunctionID")))
        confirm.close();
        this.dependencyFlag = true
      }, timeout);
    });
  }

  modifyData(inputData: any, businessContinuityID: any, interdependentData: any, supplierData: any) {
    let payload = {
      BusinessContinuityPlanID: businessContinuityID,
      BusinessFunctionID: localStorage.getItem("BusinessFunctionID"),
      TechnologyDependencies: inputData.map((item: any) => {
        return {
          BusinessProcessID: item.Id ? item.Id : item.ID,
          BusinessApplicationID: item.BusinessAppId ? item.BusinessAppId : item.BusinessApplicaionID,
          Description: item.Description,
          TechnologyDependenciesId: item.TechnologyDependenciesId ? item.TechnologyDependenciesId : null
        };
      }),
      InterdependentProcesses: interdependentData.map((item: any) => {
        return {
          BusinessProcessID: item.Id ? item.Id : item.ProcessID,
          SubProcessID: item.SubActivityID,
          Description: item.Dependency,
          DependentFunctionID: item.DependencyID,
          DependencyTypeID: item.TypeID,
          InterdependentProcessesId: item.InterdependentProcessesId ? item.InterdependentProcessesId : null
        };
      }),
      SupplierDependency: supplierData.map((item: any) => {
        return {
          BusinessProcessID: item.Id ? item.Id : item.ProcessID,
          SubProcessID: item.SubActivityID,
          Description: item.Dependency,
          SupplierID: item.SupplierID,
          DependencyTypeID: item.TypeID ? item.TypeID : item.DependentTypeID,
          SupplierDependenciesId: item.SupplierDependenciesId ? item.SupplierDependenciesId : null
        };
      }),
    };
    return payload;
  }

  isAnyTableInvalid(): boolean {
    let BusinessProcessIDs = this.businessProcess?.map((p: any) => p.BusinessActivityID);
    let allIDsIncludedIP = BusinessProcessIDs?.every((id: any) => {
      return this.processData.filter((x: any) => x.ProcessID === id).every(entry => entry.ProcessID === id && entry.Dependency !== "" && entry.hasOwnProperty('Dependency') && entry.Function !== "" && entry.hasOwnProperty('Type') && entry.Type !== "");
    });
    let allIDsIncluded = BusinessProcessIDs?.every((id: any) => {
      return this.businessContinuityService.TableTD.data.some(entry => entry.ID === id && entry.Description !== "" && entry.BusinessApplication !== "");
    });
    let allIDsIncludedSD = BusinessProcessIDs?.every((id: any) => {
      return this.suplierProcessData.filter((x: any) => x.ProcessID === id).every(entry => entry.ProcessID === id && entry.hasOwnProperty('Dependency') && entry.Dependency !== "" && entry.hasOwnProperty('Supplier') && entry.Supplier !== "" && entry.hasOwnProperty('Type') && entry.Type != "");
    });
    if (allIDsIncluded == true && allIDsIncludedIP == true && allIDsIncludedSD == true && this.blockEdit != true && this.businessContinuityService.TableTD.data.length) {
      return false
    }
    return true;
  }

  async compareDependencyData() {

    let payloadData = this.modifyData(this.businessContinuityService.TableTD.data, Number(localStorage.getItem("BusinessContinuityPlanID")), this.processData, this.suplierProcessData);
    console.log('✌️payloadData --->', payloadData);

    let hasChanges   = this.isDataChanged(payloadData, this.dependencyDetails );
    console.log('✌️hasChanges --->', hasChanges);
    this.checkDependencyDataChanges.emit(hasChanges);
    return hasChanges;
  }

  private isDataChanged(newData: any, oldData: any): boolean {
    let TechnologyDependencyData      : any[] = [];
    let SupplierDependencyData        : any[] = [];
    let InterdependentProcessesData   : any[] = [];
    let newTechData                   : any[] = [];
    let oldDependentData              : any[] = [];
    let oldSupplierData               : any[] = [];
    let newDependentData              : any[] = [];
    let newSupplierData               : any[] = [];

    if (!newData || !oldData) return true;

    oldData.forEach((nn:any) => {
      TechnologyDependencyData.push(nn.TechnologyDependency)
    })
    TechnologyDependencyData = TechnologyDependencyData?.flat();

    const oldTechData = TechnologyDependencyData.map((p: any) => ({
      Description               : p.Description,
      BusinessProcessID         : p.BusinessProcessID,
      BusinessApplicationID     : this.businessApplication.find((nn:any) => nn.BusinessApplication == p.BusinessApplicationName)?.BusinessApplicationID || '',
      TechnologyDependenciesId  : p.TechnologyDependenciesId
    }));

    newData?.TechnologyDependencies.forEach((nn:any) => {
      newTechData.push({
        Description               : nn.Description,
        BusinessProcessID         : nn.BusinessProcessID,
        BusinessApplicationID     : nn.BusinessApplicationID || '',
        TechnologyDependenciesId  : nn.TechnologyDependenciesId || ''
      })
    })

    newData?.InterdependentProcesses.forEach((nn:any) => {
      newDependentData.push({
        Description                 : nn.Description || '',
        BusinessProcessID           : nn.BusinessProcessID,
        DependencyTypeID            : nn.DependencyTypeID || '',
        DependentFunctionID         : nn.DependentFunctionID || '',
        InterdependentProcessesId   : nn.InterdependentProcessesId || '',
      })
    })

    newData?.SupplierDependency.forEach((nn:any) => {
      newSupplierData.push({
        Description                 : nn.Description || '',
        BusinessProcessID           : nn.BusinessProcessID,
        DependencyTypeID            : nn.DependencyTypeID || '',
        SupplierID                  : nn.SupplierID || '',
        SupplierDependenciesId      : nn.SupplierDependenciesId || '',
      })
    })


    newTechData.sort((a, b) => a.TechnologyDependenciesId - b.TechnologyDependenciesId);
    oldTechData.sort((a, b) => a.TechnologyDependenciesId - b.TechnologyDependenciesId);

    oldData.forEach((nn:any) => {
      nn.InterdependentProcesses.forEach((process:any) => {
        InterdependentProcessesData.push({ ...process, BusinessProcessID: nn.BusinessProcessID });
      });
    });

    InterdependentProcessesData.forEach((p:any) => {
      oldDependentData.push({
        BusinessProcessID         : p.BusinessProcessID,
        DependencyTypeID          : this.dependencyType.find((nn:any) => nn.DependencyType == p.DependencyType)?.DependencyID || '',
        DependentFunctionID       : this.dependentFunctions.find((nn:any) => nn.BusinessFunction == p.DependentFunction)?.BusinessFunctionID || '',
        Description               : p.Description || '',
        InterdependentProcessesId : p.InterdependentProcessesId,
      })
    })

    oldDependentData.sort((a, b) => a.InterdependentProcessesId - b.InterdependentProcessesId);
    newDependentData.sort((a:any, b:any) => a.InterdependentProcessesId - b.InterdependentProcessesId);

    oldData.forEach((nn:any) => {
      nn.SupplierDependency.forEach((sup:any) => {
        SupplierDependencyData.push({ ...sup, BusinessProcessID: nn.BusinessProcessID });
      });
    });

    SupplierDependencyData.forEach((p:any) => {
      oldSupplierData.push({
        BusinessProcessID         : p.BusinessProcessID,
        DependencyTypeID          : p.DependentTypeID || '',
        Description               : p.Description || '',
        SupplierDependenciesId    : p.SupplierDependenciesId || '',
        SupplierID                : p.SupplierID || '',
      })
    })

    oldSupplierData.sort((a, b) => a.SupplierDependenciesId - b.SupplierDependenciesId);
    newSupplierData.sort((a:any, b:any) => a.SupplierDependenciesId - b.SupplierDependenciesId);

    if(oldSupplierData.length && oldDependentData.length && oldTechData.length) {
      if (oldSupplierData.length !== newSupplierData.length) return true;
      if (this.blockEdit) return true;

      for (let i = 0; i < newSupplierData.length; i++) {
        const newItem = newSupplierData[i];
        const oldItem = oldSupplierData[i];
        if (newItem.SupplierDependenciesId !== oldItem.SupplierDependenciesId || newItem.Description !== oldItem.Description || newItem.BusinessProcessID !== oldItem.BusinessProcessID
          || newItem.DependencyTypeID !== oldItem.DependencyTypeID || newItem.SupplierID !== oldItem.SupplierID ) {
          return true;
        }
      }

      if (oldDependentData.length !== newDependentData.length) return true;

      for (let i = 0; i < newDependentData.length; i++) {
        const newItem = newDependentData[i];
        const oldItem = oldDependentData[i];
        if (newItem.InterdependentProcessesId !== oldItem.InterdependentProcessesId || newItem.Description !== oldItem.Description || newItem.BusinessProcessID !== oldItem.BusinessProcessID || newItem.DependencyTypeID !== oldItem.DependencyTypeID || newItem.DependentFunctionID !== oldItem.DependentFunctionID) {
            return true;
        }
      }

      if (newTechData.length !== oldTechData.length) return true;

      for (let i = 0; i < newTechData.length; i++) {
        const newItem = newTechData[i];
        const oldItem = oldTechData[i];
        if(newItem.Description !== oldItem.Description || newItem.BusinessProcessID !== oldItem.BusinessProcessID || newItem.BusinessApplicationID !== oldItem.BusinessApplicationID || newItem.TechnologyDependenciesId !== oldItem.TechnologyDependenciesId) {
            return true;
        }
      }
    }

    if(!oldTechData.length) {

      if (this.blockEdit) return true;

      if(newTechData.length) return true;

      for (let i = 0; i < newDependentData.length; i++) {
        const newItem = newDependentData[i];
        const oldItem = oldDependentData[i];
        if ( newItem.Description !== oldItem.Description || newItem.DependencyTypeID !== oldItem.DependencyTypeID || newItem.DependentFunctionID !== oldItem.DependentFunctionID) {
            return true;
        }
      }

      for (let i = 0; i < newSupplierData.length; i++) {
        const newItem = newSupplierData[i];
        const oldItem = oldSupplierData[i];
        if (newItem.SupplierDependenciesId !== oldItem.SupplierDependenciesId || newItem.Description !== oldItem.Description || newItem.BusinessProcessID !== oldItem.BusinessProcessID
          || newItem.DependencyTypeID !== oldItem.DependencyTypeID || newItem.SupplierID !== oldItem.SupplierID) {
          return true;
        }
      }

    }
    return false;
  }



}
