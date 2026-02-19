import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { MasterBusinessFunctionService } from 'src/app/services/master-data/master-business-function/master-business-function.service';
import { RestService } from 'src/app/services/rest/rest.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-business-function-popup',
  templateUrl: './business-function-popup.component.html',
  styleUrls: ['./business-function-popup.component.scss']
})

export class BusinessFunctionPopupComponent implements OnInit {

  addBusinessFunForm!: FormGroup;
  mod: any;
  bussFunData: any;
  bussFbccList: any
  bussGroupList: any
  fbcclist: any;
  siteList: any;
  unitList: any;
  filteredGroup: any;
  filteredCode: any;
  errorMsg: any;
  submitted: boolean = false;
  isFbccExists: boolean = false;
  isUnitExist: boolean = false;
  saveerror = "";
  filteredUserList: any[] = [];

  constructor(
    @Inject(DOCUMENT) private _document: any,
    @Inject(MAT_DIALOG_DATA) public parent: any,
    public dialog: MatDialog,
    private fb: FormBuilder,
    public service: MasterBusinessFunctionService,
    public utils: UtilsService,
    public dialogRef: MatDialogRef<BusinessFunctionPopupComponent>,
    private rest: RestService
  ) {
    this.rest.openWait("Fetching Data ...");
    this.service.getBusinessFunList();
    this.addNewBussFun();
  }

  ngOnInit(): void {
    this.mod = this.parent.mod;
    this.bussFunData = this.parent.selectedBussFun;
    this.service.businessSubj.subscribe((value: any) => {
      if (value) {
        this.bussGroupList = this.service.BusinessFun.groupInfo
        this.siteList = this.service.BusinessFun.siteList
        this.fbcclist = this.service.BusinessFun.FBCCList
        this.unitList = this.service.BusinessFun.unitInfo
        if (this.mod == "Edit") {
          this.addNewBussFun();
          this.patchValue(this.bussFunData);
          this.rest.closeWait();
        } else {
          this.addNewBussFun();
          this.rest.closeWait();
        }
      }
    });
  }

  addNewBussFun() {
    this.addBusinessFunForm = this.fb.group({
      unitID: ['', Validators.required],
      name: [''],
      shortCode: ['', Validators.required],
      businessId: ['', Validators.required],
      fbccId: ['', Validators.required],
      fbccName: ['', Validators.required],
      sitesId: ['', Validators.required]
    })
  }

  patchValue(bussFun: any) {
    let sites = bussFun.SiteList.map((site: any) => site.SiteID);
    this.filteredGroup = this.unitList?.filter((unit: any) => unit.GroupID == bussFun.BusinessGroupID)
    this.filteredGroup.push({
      "UnitID": this.bussFunData.UnitID,
      "GroupID": this.bussFunData.GroupID,
      "Name": this.bussFunData.Name,
      "Abbreviation": this.bussFunData.ShortCode
    })
    this.filteredCode = this.filteredGroup?.filter((code: any) => code.UnitID == bussFun.UnitID)

    this.addBusinessFunForm.patchValue({
      unitID: bussFun.UnitID,
      name: bussFun.Name,
      shortCode: bussFun.ShortCode,
      businessId: bussFun.BusinessGroupID,
      fbccId: bussFun.FBCC_ID,
      fbccName: bussFun.FBCC_Name,
      sitesId: sites
    });
    // this.filteredGroup = this.unitList.filter((unit: any) => unit.GroupID == this.addBusinessFunForm.get('unitID')?.value)
    //  this.filteredCode = this.filteredGroup.filter((code: any) => code.UnitID == this.addBusinessFunForm.get('unitID')?.value)
     this.filteredUserList = this.fbcclist.filter((ob: any) => ob.UnitID == this.addBusinessFunForm.get('unitID')?.value)
  }

  filterFbcc(event: any): void {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredUserList = this.service.BusinessFun.FBCCList.filter((fbcc: any) => fbcc.FBCCName.toLowerCase().includes(searchTerm));
    this.addBusinessFunForm.controls['fbccId'].setValue("");
    this.isFbccExists = false;
    this.filteredUserList = this.fbcclist.filter((ob: any) => ob.UnitID == this.addBusinessFunForm.get('unitID')?.value)
  }

  setFbccID(fbcc: any, event: any) {
    if (event?.isUserInput || undefined) {
    this.addBusinessFunForm.controls['fbccId'].setValue(fbcc.FBCCID);
    }
  }

  get f() {
    return this.addBusinessFunForm.controls;
  }

  close() {
    this.dialog.closeAll();
    this.filteredGroup = this.filteredGroup?.filter((unit: any) => unit.UnitID !== this.bussFunData?.UnitID);
  }

  addUpdateBussFun() {
    this.submitted = true;

    if (this.addBusinessFunForm.get('fbccId')?.value.length == 0 && this.addBusinessFunForm.get('fbccName')?.value.length > 0) {
      this.isFbccExists = true;
      return;
    }

    if (this.addBusinessFunForm.invalid)
      return;

    const BussFunData = {
      BusinessFunctionID: this.mod == "Add" ? null : this.bussFunData.BusinessFunctionID,
      FBCC_ID: this.addBusinessFunForm.value.fbccId,
      BusinessGroupID: this.addBusinessFunForm.value.businessId,
      ShortCode: this.addBusinessFunForm.value.shortCode,
      BusinessFunctionName: this.addBusinessFunForm.value.name,
      UnitId: this.filteredCode[0].UnitID,
      SiteID: this.addBusinessFunForm.value.sitesId.map((siteID: any) => ({ "SiteID": siteID })),
      FBCC: this.addBusinessFunForm.value.fbccName,
    };

    this.service.addUpdateBusinessFun(BussFunData).subscribe(res => {
      if (res.success == 1) {
        this.dialogRef.close(true);
        this.saveSuccess(this.mod == 'Add' ? "Business Function is added Successfully" : "Business Function is updated Successfully");
        this.service.processBusinessFunList(res)
      } else {
        if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
          this.utils.relogin(this._document);
        else
          this.saveerror = res.error.errorMessage;
      }
      error:
      console.log("err::", "error");
    })

    if (this.mod == "Edit") {
      this.filteredGroup = this.filteredGroup.filter((unit: any) => unit.UnitID !== this.bussFunData.UnitID);
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

    confirm.afterOpened().subscribe((result: any) => {
      setTimeout(() => {
        confirm.close();
        this.service.getBusinessFunMaster();
      }, timeout)
    });
  }

  filterGroup(rowData: any) {
    this.filteredGroup = this.unitList.filter((unit: any) => unit.GroupID == rowData)
    this.addBusinessFunForm.controls['shortCode'].setValue("");
    this.addBusinessFunForm.controls['fbccName'].setValue("");
  }

  filterCode(rowData: any) {
    this.addBusinessFunForm.controls['fbccName'].setValue("");
    this.filteredCode = this.filteredGroup.filter((code: any) => code.UnitID == rowData)
    this.filteredUserList = this.fbcclist.filter((ob: any) => ob.UnitID == rowData)
    this.addBusinessFunForm.patchValue({
      shortCode: this.filteredCode[0].Abbreviation
    });
  }

  getErrorMessage() {
    const fbccNameErrors = this.addBusinessFunForm.get('fbccName')?.errors;
    const fbccNameTouched = this.addBusinessFunForm.get('fbccName')?.touched;
    const groupTouched = this.addBusinessFunForm.get('businessId')?.touched;
    const unitTouched = this.addBusinessFunForm.get('unitID')?.touched;

    if (this.mod == 'Add' && ((this.filteredUserList?.length === 0 && this.addBusinessFunForm.get('unitID')?.value != "" && this.addBusinessFunForm.get('businessId')?.value != ""))) {
      return 'No user found for the selected Business Function in user management.';
    }
    else if (this.mod == 'Edit' && fbccNameErrors && fbccNameTouched && (groupTouched || unitTouched) && (this.filteredUserList?.length === 0 && this.addBusinessFunForm.get('unitID')?.value != "" && this.addBusinessFunForm.get('businessId')?.value != "")) {
      return 'No user found for the selected Business Function in user management.';
    }
    else if (this.mod == 'Edit' && !this.submitted) {
      return null;
    }
    else if (this.submitted && this.isFbccExists) {
      return 'Please select derived Business Owner';
    }
    else if ((this.submitted || fbccNameTouched) && fbccNameErrors || (this.submitted && this.filteredUserList?.length && this.addBusinessFunForm.get('fbccName')?.value == "")) {
      return 'Select Business Owner';
    }
    else {
      return null;
    }
  }
}



