import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApplList, MasterVendorsService } from 'src/app/services/master-data/master-vendor-service/master-vendors.service'
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { DOCUMENT } from '@angular/common';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { addIndex } from 'src/app/includes/utilities/commonFunctions';

@Component({
  selector: 'app-add-edit-serviceprovider',
  templateUrl: './add-edit-serviceprovider.component.html',
  styleUrls: ['./add-edit-serviceprovider.component.scss']
})

export class AddEditServiceproviderComponent implements OnInit {

  filteredData = new MatTableDataSource<ApplList>();
  addServiceProviderForm!: FormGroup;
  addVendorForm!: FormGroup;
  vendorID: any;
  mod: any;
  serviceData: any;
  editedApplId: any;
  saveerror = "";
  applList: any;
  allRecords: any;
  isVendorNameExists: boolean = false;
  isEdited: boolean = false;
  submitted: boolean = false;
  tablesubmitted: boolean = false;
  applicationList: any = []
  displayedColumns: string[] = ['Position', 'Application', 'PrimaryContact', 'AlternateContact', 'ContractTAT', 'Action'];

  ContractDetails: any[] = [
    {
      'TATTimeUnitID': 1,
      'TATTimeUnit': "Hours"
    },
    {
      'TATTimeUnitID': 2,
      'TATTimeUnit': "Day"
    }]

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(MAT_DIALOG_DATA) public parent: any,
    @Inject(DOCUMENT) private _document: any,
    public dialog: MatDialog,
    public vendorService: MasterVendorsService,
    private fb: FormBuilder,
    public utils: UtilsService,
    public dialogRef: MatDialogRef<AddEditServiceproviderComponent>
  ) {
    this.vendorService.getVendorAppl();
    this.addVendor();
    this.addNewService();
  }

  ngOnInit(): void {
    this.mod = this.parent.mod;
    this.serviceData = this.parent.data;
    this.allRecords = this.parent.allRecords
    this.vendorService.gotVendors.subscribe((value: any) => {
      if (value) {
        this.applList = this.vendorService.Vendors.ApplicationSupportList;
        if (this.filteredData.data.length || this.applList.length) {
          let filteredDropdown: any = []
          filteredDropdown = Array.from(this.filteredData.data.map((n: any) => n.ApplicationID))
          this.applicationList = this.applList?.filter((n: any) => !filteredDropdown.includes(n.ApplicationID))
        }
        if (this.mod == "Edit") {
          this.filteredData = this.allRecords.filter((x: any) => x.Vendor_Id === this.serviceData.Vendor_Id);
          this.filteredData = new MatTableDataSource(addIndex(this.allRecords.filter((x: any) => x.Vendor_Id === this.serviceData.Vendor_Id), false));
          this.addVendor();
          this.addNewService();
          this.patchVendorValue();
        } else {
          this.filteredData.data = [];
          this.addVendor();
          this.addNewService();
        }
      }
    });
  }

  patchVendorValue() {
    setTimeout(() => {
      this.addVendorForm.patchValue({
        vendorName: this.serviceData.Vendor_Name
      });
    }, 1000);
  }

  addVendor() {
    this.addVendorForm = this.fb.group({
      vendorName: ['', [Validators.required]]
    })
  }

  addNewService() {
    this.addServiceProviderForm = this.fb.group({
      applId: ['', [Validators.required]],
      contract: ['', Validators.required],
      name: ['', [Validators.required, Validators.pattern("[a-zA-Z0-9_]+.*$")]],
      email: ['', [Validators.required, Validators.pattern("^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@" + "[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$")]],
      altname: ['', [Validators.required, Validators.pattern("[a-zA-Z0-9_]+.*$")]],
      altemail: ['', [Validators.required, Validators.pattern("^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@" + "[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$")]],
      mob: ['', [Validators.required, Validators.pattern("^((\\+98-?)|(\\+93-?)|(\\+91-?)|0)?[0-9]{10}$")]],
      mob1: ['', [Validators.required, Validators.pattern("^((\\+98-?)|(\\+93-?)|(\\+91-?)|0)?[0-9]{10}$")]],
      ofc: ['', [Validators.pattern("^((\\+98-?)|(\\+93-?)|(\\+91-?)|0)?[0-9]{10}$")]],
      ofc1: ['', [Validators.pattern("^((\\+98-?)|(\\+93-?)|(\\+91-?)|0)?[0-9]{10}$")]],
      contractId: ['', [Validators.required]]
    })

    if (this.filteredData.data.length) {
      let filteredDropdown: any = []
      filteredDropdown = Array.from(this.filteredData.data?.map((n: any) => n.ApplicationID))
      this.applicationList = this.applList.filter((n: any) => !filteredDropdown.includes(n.ApplicationID))
    }
  }

  editService(data: any) {
    this.isEdited = true;
    this.editedApplId = data.ApplicationID;
    this.addServiceProviderForm.patchValue({
      applId: data.ApplicationID,
      contract: data.ContractTAT,
      contractId: data.TATTimeUnitID,
      name: data.PrimaryContactFullName,
      email: data.PrimaryContactEmailID,
      altname: data.AlternateContactFullName,
      altemail: data.AlternateContactEmailID,
      mob: data.PrimaryContactMobileNumber,
      mob1: data.AlternateContactMobileNumber,
      ofc: data.PrimaryContactOfficePhone,
      ofc1: data.AlternateContactOfficePhone
    });
    if (this.filteredData.data.length) {
      let filteredDropdown: any = []
      filteredDropdown = Array.from(this.filteredData.data.filter((nn: any) => nn.ApplicationID != data.ApplicationID).map((n: any) => n.ApplicationID))
      this.applicationList = this.applList.filter((n: any) => !filteredDropdown.includes(n.ApplicationID))
    }

    this.scrollDown('applDetails')
  }

  scrollDown(id: any) {
    let el = document.getElementById(id)!;
    setTimeout(() => {
      if (el) el.scrollTop = el.scrollHeight;
    }, 100);
  }

  get f() {
    return this.addServiceProviderForm.controls;
  }

  get f1() {
    return this.addVendorForm.controls;
  }

  checkVendorExist(e: any) {
    if (this.serviceData)
      this.isVendorNameExists = this.allRecords.some((x: any) => x.Vendor_Name.toLowerCase().trim() == (e.target.value).toLowerCase().trim() && (x.Vendor_Id !== this.serviceData.Vendor_Id));
    else
      this.isVendorNameExists = this.allRecords.some((x: any) => x.Vendor_Name.toLowerCase().trim() == (e.target.value).toLowerCase().trim());
  }

  addUpdateService() {
    if (this.addServiceProviderForm.invalid){
      this.isEdited = true;
    } else {
      this.isEdited = false;
    }

    if (this.mod == 'Add') {
      this.addNewAppl();
    } else {
      this.updateApplTable();
    }
  }

  addNewAppl() {
    this.tablesubmitted = true;

    if (this.addServiceProviderForm.invalid)
      return

    let ApplName = this.applList.find((x: any) => x.ApplicationID === this.addServiceProviderForm.value.applId)
    let TaTUnit = this.ContractDetails.find((y: any) => y.TATTimeUnitID === this.addServiceProviderForm.value.contractId)
    let temp = {
      ApplicationName: ApplName.ApplicationName,
      AlternateContactEmailID: this.addServiceProviderForm.value.altemail,
      AlternateContactMobileNumber: this.addServiceProviderForm.value.mob1,
      AlternateContactFullName: this.addServiceProviderForm.value.altname,
      AlternateContactOfficePhone: this.addServiceProviderForm.value.ofc1,
      ApplicationID: this.addServiceProviderForm.value.applId,
      ContractTAT: this.addServiceProviderForm.value.contract,
      TATTimeUnitID: this.addServiceProviderForm.value.contractId,
      TATTimeUnit: TaTUnit.TATTimeUnit,
      PrimaryContactEmailID: this.addServiceProviderForm.value.email,
      PrimaryContactMobileNumber: this.addServiceProviderForm.value.mob,
      PrimaryContactFullName: this.addServiceProviderForm.value.name,
      PrimaryContactOfficePhone: this.addServiceProviderForm.value.ofc
    };


    if (this.editedApplId == undefined) {
      (this.filteredData.data as any).push({ "Index": this.filteredData.data.length + 1, ...temp })
      this.filteredData._updateChangeSubscription();
      this.addServiceProviderForm.reset();
      this.tablesubmitted = false;

      if (this.filteredData.data.length) {
        let filteredDropdown: any = []
        filteredDropdown = Array.from(this.filteredData.data.map((n: any) => n.ApplicationID))
        this.applicationList = this.applList.filter((n: any) => !filteredDropdown.includes(n.ApplicationID))
      }
    } else {
      this.updateApplTable();
    }
  }

  updateApplTable() {
    this.tablesubmitted = true;

    if (this.addServiceProviderForm.invalid)
      return

    let controlIndex = (this.filteredData.data as any).findIndex((x: any) => x.ApplicationID == this.editedApplId);
    let TaTUnit = this.ContractDetails.find((y: any) => y.TATTimeUnitID === this.addServiceProviderForm.value.contractId)
    if (controlIndex !== -1) {
      let temp = {
        AlternateContactEmailID: this.addServiceProviderForm.value.altemail,
        AlternateContactMobileNumber: this.addServiceProviderForm.value.mob1,
        AlternateContactFullName: this.addServiceProviderForm.value.altname,
        AlternateContactOfficePhone: this.addServiceProviderForm.value.ofc1,
        ApplicationID: this.addServiceProviderForm.value.applId,
        ContractTAT: this.addServiceProviderForm.value.contract,
        PrimaryContactEmailID: this.addServiceProviderForm.value.email,
        PrimaryContactMobileNumber: this.addServiceProviderForm.value.mob,
        PrimaryContactFullName: this.addServiceProviderForm.value.name,
        PrimaryContactOfficePhone: this.addServiceProviderForm.value.ofc,
        TATTimeUnitID: this.addServiceProviderForm.value.contractId,
        TATTimeUnit: TaTUnit.TATTimeUnit
      };
      this.filteredData.data = this.filteredData.data.map((x: any) =>
        x.ApplicationID === this.editedApplId ? { ...x, ...temp } : x
      );
      this.addServiceProviderForm.reset();
      this.tablesubmitted = false;
      this.editedApplId = null
    } else {
      this.addNewAppl();
    }
  }

  deleteService(data: any) {
    const index = (this.filteredData.data as any).findIndex((item: any) => item.Index === data.Index);
    if (index !== -1) {
      this.filteredData.data.splice(index, 1);
    }
    this.filteredData.data = addIndex(this.filteredData.data, false);
    this.filteredData._updateChangeSubscription();
  }

  onSubmit() {
    this.submitted = true;

    if ((this.filteredData.data && this.filteredData.data.length == 0) && (this.isVendorNameExists))
      return

    if (this.addVendorForm.invalid)
      return

    this.vendorService.addVendorDetails(this.addVendorForm.value.vendorName, this.filteredData.data, this.mod).subscribe(res => {
      if (res.success == 1) {
        this.dialogRef.close(true);
        this.saveSuccess(this.mod == 'Add' ? "Vendor is added Successfully." : "Vendor is updated Successfully");
        this.vendorService.processVendorsList(res)
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
        this.vendorService.getVendorMasterData();
      }, timeout)
    });
  }

  close() {
    this.dialog.closeAll()
  }

}
