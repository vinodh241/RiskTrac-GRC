import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmDialogComponent } from 'src/app/includes/utilities/popups/confirm/confirm-dialog.component';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { MasterBusinessServiceService } from 'src/app/services/master-data/master-business-service/master-business-service.service';
import { RestService } from 'src/app/services/rest/rest.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
  selector: 'app-new-business-popup',
  templateUrl: './new-business-popup.component.html',
  styleUrls: ['./new-business-popup.component.scss'],
})
export class NewBusinessPopupComponent implements OnInit {
  title: any;
  addApplicationForm!: FormGroup;
  businessService: any;
  selection: boolean = true;
  list: any;
  businessData: any;
  displayedColumns: string[] = [
    'Position',
    'SupportTeam',
    'BusinessGroup',
    'Action',
  ];
  dataSource = new MatTableDataSource<any>([]);
  selectedUser: any;
  mod: any;
  hoursList = [
    {
      RecoveryPointUnit: 1,
      RecoveryPoint: 'Hours',
    },
    {
      RecoveryPointUnit: 2,
      RecoveryPoint: 'Days',
    },
  ];
  hoursListRPO = [
    {
      RecoveryTimeUnit: 1,
      RecoveryTime: 'Hours',
    },
    {
      RecoveryTimeUnit: 2,
      RecoveryTime: 'Days',
    },
  ];
  submitted: boolean = false;
  saveerror = '';
  isOwnerExists: boolean = false;
  isITOwnerExists: boolean = false;
  issupportLeadExists: boolean = false;
  filteredOwners: any;
  filteredITOwners: any;
  filteredSupportLead: any;
  filteredSupportTeamList: any[] = [];
  siteList: any;
  supportTeamData: any;
  messagedata: any;
  isNameExists: any;
  validApplication:boolean = false
  siteFilteredList: any;
  errorMsg: any;
  errorMsgRPO: any;
  errorMsgRTO:boolean = false
  errorMsgRPOF:boolean = false
  siteNotFoundError: boolean = false
  addEditError: boolean = false
  businessNotFoundError: boolean = false
  constructor(
    @Inject(MAT_DIALOG_DATA) public parent: any,
    private fb: FormBuilder,
    public dialog: MatDialog,
    public MasterBusinessService: MasterBusinessServiceService,
    public dialogRef: MatDialogRef<NewBusinessPopupComponent>,
    public utils: UtilsService,
    @Inject(DOCUMENT) private _document: any,
    private rest: RestService,
    private MatAutocompleteModule: MatAutocompleteModule
  ) {
    this.MasterBusinessService.getBusinessServiceMasterInfo();
    this.initializeData();
  }

  ngOnInit(): void {
    this.businessData = this.parent.data;
    this.title = this.parent.title
    this.mod = this.parent.mod;
    this.dataSource.data = [];
    this.MasterBusinessService.gotInfoMaster.subscribe((value: any) => {
      if (value) {
        this.dataSource =
          this.MasterBusinessService.businessData.SupportTeamList;
        this.filteredOwners =
          this.MasterBusinessService.businessData.BusinessOwnersList;
        this.supportTeamData =
          this.MasterBusinessService.businessData.SupportTeamList;
        this.filteredITOwners =
          this.MasterBusinessService.businessData.ITOwnersList;
        this.filteredSupportLead = this.MasterBusinessService.businessData.SupportLeadList;
        this.filteredSupportTeamList = JSON.parse(JSON.stringify(this.MasterBusinessService.businessData.SupportTeamList));
        this.siteList = this.MasterBusinessService.businessData.SitesList;
        this.dataSource.data = [];
      }
    });

    this.setSupportTeam(this.dataSource);
    if (this.mod == 'edit') {
      this.getPatternError()
      this.patchData();
    } else {
      this.getPatternError()
      this.dataSource.data = [];
      this.initializeData();
    }
    this.addApplicationForm.get('businessOwner')?.disable();
  }

  initializeData() {
    this.addApplicationForm = this.fb.group({
      applicationName: ['', [Validators.required]],
      applicationType: ['', Validators.required],
      businessFunction: ['', Validators.required],
      rtoValue: ['', Validators.required,],
      rtoUnit: ['', Validators.required],
      rpoValue: ['', Validators.required],
      rpoUnit: ['', Validators.required],
      selectedSites: ['', Validators.required],
      businessOwner: ['', Validators.required],
      businessOwnerID: ['', Validators.required],
      itOwner: ['', Validators.required],
      itOwnerID: ['', Validators.required],
      supportLead: ['', Validators.required],
      supportLeadID: ['', Validators.required],
      teamMembers: ['', Validators.required],
    });
    this.dataSource.data = [];
  }

  removeDuplicateSiteIds(arr: any[]): any[] {
    return Array.from(new Set(arr.map(item => item.SiteID))).map(id => ({ SiteID: id }));
  }

  removeDuplicateSupportTeamMembers(arr: any[]): any[] {
    return Array.from(new Set(arr.map(item => item.UserGUID))).map(id => ({ UserGUID: id }));
  }

  onSubmit() {
    this.submitted = true;
    if(this.mod == 'add' && this.addApplicationForm.value['selectedSites'].length==0){
      this.addEditError = true
      return
    }

    if(this.addApplicationForm.value.applicationName.trim().length=='' && this.validApplication == true){
      return
    }

    if(this.isNameExists == true){
      return
    }

    if(this.errorMsgRTO == true){
      return
    }
    if(this.errorMsgRPOF == true){
      return
    }
    if (this.dataSource.data.length === 0) {
      return;
    }

    const selectedSites = this.MasterBusinessService.businessData.SitesList.filter((site: any) =>
        this.addApplicationForm.value.selectedSites.includes(site.SiteID)
      ).map(({ SiteID }: { SiteID: string }) => ({ SiteID }));

    const filteredSites = this.removeDuplicateSiteIds(selectedSites);

    console.log("Application Form Data : ", this.addApplicationForm.value['selectedSites']);
    // if(this.mod == 'edit'){
    //   // this.businessData.BusinessFunctionsID
    //   let choosenSites = this.MasterBusinessService.businessData.SitesList.filter((item: any) => item.BusinessFunctionID == this.businessData.BusinessFunctionsID && this.addApplicationForm.value['selectedSites'].includes(item.SiteID));
    //   if(choosenSites.length < 1){
    //     this.siteNotFoundError = true
    //     return
    //   }else{
    //     this.siteNotFoundError = false
    //   }
    // }
    if(this.mod == 'edit'){
      // this.businessData.BusinessFunctionsID
      let choosenSites = this.MasterBusinessService.businessData.SitesList.filter((item: any) => item.BusinessFunctionID == this.businessData.BusinessFunctionsID && this.addApplicationForm.value['selectedSites'].includes(item.SiteID));
      console.log("Choosen Sites : ", choosenSites);
    if(this.businessNotFoundError && this.addApplicationForm.value['selectedSites'].length != 0){
      this.siteNotFoundError = false
      this.addEditError = false  
     } else if(choosenSites.length == 0){
        this.siteNotFoundError = true
        this.addEditError = false
        return
    }else if(this.addApplicationForm.value['selectedSites'].length == 0){
        this.siteNotFoundError = true
        this.addEditError = false
        return
    }else if (this.addApplicationForm.value['selectedSites'].length != 0){
        this.siteNotFoundError = false
        this.addEditError = false

    }else {
        this.siteNotFoundError = false
        this.addEditError = false
    }
    }
    // console.log("Business Function Site ID : ", item.BusinessFunctionsID == this.businessData.BusinessFunctionsID && this.addApplicationForm.value['selectedSites'].includes(item.SiteID))
    // let choosenSites = this.MasterBusinessService.businessData.SitesList.filter((item: any) => item.BusinessFunctionsID == this.businessData.BusinessFunctionsID && this.addApplicationForm.value['selectedSites'].includes(item.SiteID));
    // console.log("Choosen Sites : ", choosenSites);

    

    // let choosenSites = JSON.parse(this.businessData.Sites).map((site: any) => site.SiteID)
    // if(!this.siteFilteredList.includes(choosenSites)){
    //   this.addApplicationForm.controls['selectedSites'].setValue('');
    //   return
    // }

    const filteredITOwner = this.filteredITOwners.filter((itOwner: any) =>
      this.addApplicationForm.value.itOwner.includes(itOwner.OwnerName)
    );
    const filteredSupportLead = this.filteredSupportLead.filter(
      (supportLead: any) =>
        this.addApplicationForm.value.supportLead.includes(supportLead.LeadName)
    );
    const supportTeams: { UserGUID: string }[] = this.dataSource.data.map(
      (user) => ({ UserGUID: user.UserGUID })
    );

    const userGuidArray = this.removeDuplicateSupportTeamMembers(supportTeams);

    if (this.mod == 'add') {
      let businessData = {
        ApplicationID: null,
        Application_Name: this.addApplicationForm.value.applicationName,
        ApplicationTypeID: this.addApplicationForm.value.applicationType,
        BusinessFunctionID: this.addApplicationForm.value.businessFunction,
        RTO_Value: this.addApplicationForm.value.rtoValue,
        RTO_ID: this.addApplicationForm.value.rtoUnit,
        RPO_Value: this.addApplicationForm.value.rpoValue,
        RPO_ID: this.addApplicationForm.value.rpoUnit,
        Sites: filteredSites,
        BusinessOwnerID: this.siteList.find((ele:any)=> ele.BusinessFunctionID === this.addApplicationForm.value.businessFunction)?.BusinessOwnerGUID,
        ITOwnerID: filteredITOwner[0].ITOwnerID,
        SupportLeadID: filteredSupportLead[0].SupportLeadID,
        Support_Team: userGuidArray,
      };

      this.MasterBusinessService.addBusinessData(businessData).subscribe(
        (res: any) => {
          if (res.success == 1) {
            this.dialogRef.close(true);
            this.resetThreat();
            this.saveSuccess('Business Services Added Successfully.');
            this.MasterBusinessService.getBusinessData();
          } else {
            if (res.error.errorCode && res.error.errorCode == 'TOKEN_EXPIRED')
              this.utils.relogin(this._document);
            else this.saveerror = res.error.errorMessage;
          }
          console.log('err::', 'error');
        }
      );
    } else if (this.mod == 'edit') {
      console.log('this.errorMsg: ', this.errorMsg);
      console.log('this.errorMsgRPO: ', this.errorMsgRPO);

      let businessData = {
        ApplicationID: Number(this.businessData.ApplicationID),
        Application_Name: this.addApplicationForm.value.applicationName,
        ApplicationTypeID: this.addApplicationForm.value.applicationType,
        BusinessFunctionID: Number(
          this.addApplicationForm.value.businessFunction
        ),
        RTO_Value: this.addApplicationForm.value.rtoValue,
        RTO_ID: this.addApplicationForm.value.rtoUnit,
        RPO_Value: this.addApplicationForm.value.rpoValue,
        RPO_ID: this.addApplicationForm.value.rpoUnit,
        Sites: filteredSites,
        BusinessOwnerID: this.siteList.find((ele:any)=> ele.BusinessFunctionID === this.addApplicationForm.value.businessFunction)?.BusinessOwnerGUID,
        ITOwnerID: this.filteredITOwners[0].ITOwnerID ?  filteredITOwner[0].ITOwnerID : this.filteredITOwners[0].ITOwnerID,
        SupportLeadID: this.filteredSupportLead[0].SupportLeadID ? filteredSupportLead[0].SupportLeadID : this.filteredSupportLead[0].SupportLeadID,
        Support_Team: userGuidArray,
      };

      this.MasterBusinessService.updateBusinessData(businessData).subscribe(
        (res: any) => {
          if (res.success == 1) {
            this.dialogRef.close(true);
            this.resetThreat();
            this.saveSuccess('Business Services Updated Successfully.');
            this.MasterBusinessService.getBusinessData();
          } else {
            if (res.error.errorCode && res.error.errorCode == 'TOKEN_EXPIRED')
              this.utils.relogin(this._document);
            else this.saveerror = res.error.errorMessage;
          }
          console.log('err::', 'error');
        }
      );
      this.dataSource.data = [];
    }
  }

  close() {
    this.dialog.closeAll();
  }

  patchData() {
    setTimeout(() => {
      const siteList1 = JSON.parse(this.businessData.Sites);
      let siteData = siteList1.map((site: any) => site.SiteID);
      this.selectBusinessFunction(Number(this.businessData.BusinessFunctionsID));
      // let removedSites
      // let sitesArrayDropdown = [];
      // let matchedSitesList = false
      // console.log("Truthy Value : ", this.siteFilteredList.map((item: any) => item.SiteID).includes(siteData[0].SiteID));
      // if(siteData.length > 1){
      //   removedSites = siteData;
      // } else if (siteData.length == 1 && (this.siteFilteredList.map((item: any) => item.SiteID).includes(siteData[0].SiteID))){
      //   console.log("Entering for site validation");
      //   sitesArrayDropdown = this.siteFilteredList.map((item: any) => item.SiteID);
      //   matchedSitesList = sitesArrayDropdown.includes(siteData[0].SiteID);
      //     if(!matchedSitesList){
      //       removedSites = this.addApplicationForm.controls['selectedSites'].setValue('');
      //     } else {
      //       removedSites = siteData;
      //     }
      // } else {
      //   removedSites = siteData
      // }
      this.dataSource.data = this.businessData.SupportTeamList;
      const existingUsers = new Set(this.dataSource.data.map((item :any) => item.UserGUID));
      this.filteredSupportTeamList = this.supportTeamData?.filter((item :any) => !existingUsers.has(item.UserGUID));
      let removedSupportLead
      let supportLeadDropdownArray = this.MasterBusinessService.businessData.SupportLeadList.map((item: any) => item.SupportLeadID);
      let matchedSupportLead = supportLeadDropdownArray.includes(this.businessData.SupportLeadID)
      if(!matchedSupportLead){
        removedSupportLead = this.addApplicationForm.controls['supportLead'].setValue('');
      } else {
        removedSupportLead = this.businessData.LeadName;
      }
      this.addApplicationForm.patchValue({
        applicationName: this.businessData.ApplicationName,
        applicationType: this.businessData.ApplicationTypeID,
        businessFunction: Number(this.businessData.BusinessFunctionsID),
        rpoValue: this.businessData.RecoveryPoint,
        rpoUnit: this.businessData.RecoveryPointUnit,
        rtoValue: this.businessData.RecoveryTime,
        rtoUnit: this.businessData.RecoveryTimeUnit,
        selectedSites: siteData,
        businessOwner: this.businessData.BusinessOwnerName,
        businessOwnerID: this.businessData.BusinessOwnerID,
        itOwner: this.businessData.ITOwnerName,
        supportLead: removedSupportLead,
      });
    }, 1000);
  }

  deleteSupportTeam(data?: any) {
    const index = this.dataSource.data.indexOf(data);

    if (index > -1) {
      this.dataSource.data.splice(index, 1);
      this.dataSource.data = [...this.dataSource.data]; // Assign a new array to trigger change detection
    }
    const existingUsers = new Set(this.dataSource.data.map((item :any) => item.UserGUID));
    this.filteredSupportTeamList = this.supportTeamData?.filter((item :any) => !existingUsers.has(item.UserGUID));
  }

  deleteSuccess(): any {
    const timeout = 1000; // 1 Seconds
    const confirm = this.dialog.open(InfoComponent, {
      id: 'InfoComponent',
      disableClose: true,
      minWidth: '300px',
      panelClass: 'success',
      data: {
        title: 'Success',
        content: 'Support Team is deleted successfully',
      },
    });

    confirm.afterOpened().subscribe((result) => {
      setTimeout(() => {
        confirm.close();
        this.MasterBusinessService.getBusinessData();
      }, timeout);
    });
  }
  resetThreat() {
    this.addApplicationForm.reset();
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
        confirm.close();
        this.MasterBusinessService.getBusinessData();
      }, timeout);
    });
  }

  get f() {
    return this.addApplicationForm.controls;
  }

  filterOwners(data: any) {
    const searchTerm = data.target.value.toLowerCase();
    this.filteredOwners =
      this.MasterBusinessService.businessData.BusinessOwnersList.filter(
        (owner: any) =>
          owner.BusinessOwnerName.toLowerCase().includes(searchTerm)
      );
    this.addApplicationForm.controls['businessOwnerID'].setValue('');
    this.isOwnerExists = false;
  }
  setOwnerID(owner: any) {
    this.addApplicationForm.controls['businessOwnerID'].setValue(
      owner.BusinessOwnerID
    );
  }

  filterITOwners(data: any) {
    const searchTerm = data.target.value.toLowerCase();
    this.filteredITOwners =
      this.MasterBusinessService.businessData.ITOwnersList.filter(
        (owner: any) => owner.OwnerName.toLowerCase().includes(searchTerm)
      );
    this.addApplicationForm.controls['itOwnerID'].setValue('');
    this.isITOwnerExists = false;
  }
  setITOwnerID(owner: any) {
    this.addApplicationForm.controls['itOwnerID'].setValue(owner.ITOwnerID);
  }

  filterSupportLead(data: any) {
    const searchTerm = data.target.value.toLowerCase();
    this.filteredSupportLead =
      this.MasterBusinessService.businessData.SupportLeadList.filter(
        (owner: any) => owner.LeadName.toLowerCase().includes(searchTerm)
      );
    this.addApplicationForm.controls['supportLeadID'].setValue('');
    this.issupportLeadExists = false;
  }
  setSupportLeade(owner: any) {
    this.addApplicationForm.controls['supportLeadID'].setValue(
      owner.SupportLeadID
    );
  }

  setSupportTeam(user: any) {
    if (!this.dataSource.data) {
      this.dataSource.data = [];
    }
    this.dataSource.data.push(user);
    this.dataSource.data = [...this.dataSource.data];
    const existingUsers = new Set(this.dataSource.data.map((item :any) => item.UserGUID));
    this.filteredSupportTeamList = this.supportTeamData?.filter((item :any) => !existingUsers.has(item.UserGUID));
    this.addApplicationForm.controls['teamMembers'].setValue('');
  }

  supportTeam(event: any) {
    const searchTerm = event.target?.value.toLowerCase();
    if(this.dataSource.data.length == 0){
      this.filteredSupportTeamList = this.supportTeamData?.filter((user: any) =>user.TeamMember.toLowerCase().includes(searchTerm))
    }else{
      let remainingSupportTeam = this.supportTeamData?.filter((user:any) => !this.dataSource.data.map(x=>x.TeamMember).includes(user.TeamMember));
      this.filteredSupportTeamList = remainingSupportTeam.filter((user: any) =>user.TeamMember.toLowerCase().includes(searchTerm));
    }
  }

  checkApplicationNameExist(e: any) {
    if(this.businessData){
    this.isNameExists = this.parent?.allData?.some((x: any) => x.ApplicationName.toLowerCase().trim() == (e.target.value).toLowerCase().trim() && (x.ApplicationID !== this.businessData.ApplicationID));
     }else{
        this.isNameExists = this.parent?.allData?.some((x: any) => x.ApplicationName.toLowerCase().trim() == (e.target.value).toLowerCase().trim())
    }
  }

  getPatternError() {
    let splitValue = this.addApplicationForm?.get('applicationName')?.value.trim();
    this.validApplication = false
    if (splitValue === ''){
      this.validApplication = true;
      return 'Application Name is required';
    } else {
      this.validApplication = false
      return ''
    }
  }

  selectBusinessFunction(businessId:any, event?: any){
    if(event != undefined){
      if(businessId){
        this.businessNotFoundError = true;
        }
      }else {
        this.businessNotFoundError = false;
      }
      this.siteFilteredList = this.siteList?.filter((ele:any)=> ele.BusinessFunctionID === businessId );
      let businessOwner = this.siteList?.find((ele:any)=> ele.BusinessFunctionID === businessId).BusinessOwnerName;
      this.addApplicationForm.controls['businessOwner'].setValue(businessOwner);
      this.addApplicationForm.controls['selectedSites'].setValue('');
    
  }

  noDecimal(event: Event) {
    console.log('event: ', event);
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;
    console.log('value: ', value);
    const isNumber = /^[0-9]+$/.test(value)
    console.log(isNumber, value)
    if (!isNumber && Number(value) < 0) {
      this.errorMsg = `Negative number is not allowed`
      this.errorMsgRTO = true
    } else if (!isNumber && value) {
      this.errorMsg = `Decimal number is not allowed`
      this.errorMsgRTO = true
    } else if (value == '') {
      this.errorMsg = `Please enter the valid number`
      this.errorMsgRTO = true
    } else if (Number(value) == 0) {
      this.errorMsg = `This value cannot be zero`
      this.errorMsgRTO = true
    } else if (Number(value) >= 1){
      this.errorMsgRTO = false
      this.errorMsg = ""
    }
  }

  noDecimalRpo(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;
    const isNumber = /^[0-9]+$/.test(value)
    if (!isNumber && Number(value) < 0) {
      this.errorMsgRPO = `Negative number is not allowed`
      this.errorMsgRPOF = true
    } else if (!isNumber && value) {
      this.errorMsgRPO = `Decimal number is not allowed`
      this.errorMsgRPOF = true
    } else if (value == '') {
      this.errorMsgRPO = `Please enter the valid number`
      this.errorMsgRPOF = true
    } else if (Number(value) == 0) {
      this.errorMsgRPO = `This value cannot be zero`
      this.errorMsgRPOF = true
    } else if (Number(value) >= 1){
      this.errorMsgRPOF = false
      this.errorMsgRPO = ""
    }
  }

  getSelectedSites(){
    if(this.mod == 'edit'){
      // this.businessData.BusinessFunctionsID
      let choosenSites = this.MasterBusinessService.businessData.SitesList.filter((item: any) => item.BusinessFunctionID == this.businessData.BusinessFunctionsID && this.addApplicationForm.value['selectedSites'].includes(item.SiteID));
      console.log("Choosen Sites : ", choosenSites);
    if(this.businessNotFoundError && this.addApplicationForm.value['selectedSites'].length != 0){
      this.siteNotFoundError = false
      this.addEditError = false  
     } else if(choosenSites.length == 0){
        this.siteNotFoundError = true
        this.addEditError = false
        return
    }else if(this.addApplicationForm.value['selectedSites'].length == 0){
        this.siteNotFoundError = true
        this.addEditError = false
        return
    }else if (this.addApplicationForm.value['selectedSites'].length != 0){
        this.siteNotFoundError = false
        this.addEditError = false

    }else {
        this.siteNotFoundError = false
        this.addEditError = false
    }
    } else if(this.mod == 'add' && this.addApplicationForm.value['selectedSites'].length==0){
      this.addEditError = true
      this.siteNotFoundError = false
      return
    }else {
      this.addEditError = false
      this.siteNotFoundError = false
    }
  }

}
