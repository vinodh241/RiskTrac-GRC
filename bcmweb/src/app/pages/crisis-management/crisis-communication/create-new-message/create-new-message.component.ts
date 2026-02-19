import { DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FileUploadComponent } from 'src/app/core-shared/file-upload/file-upload.component';
import { extentedTitle } from 'src/app/includes/utilities/commonFunctions';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { CkEditorConfigService } from 'src/app/services/ck-editor/ck-editor-config.service';
import { CrisisCommunicationService } from 'src/app/services/crisis-communication/crisis-communication.service';
import { RestService } from 'src/app/services/rest/rest.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-create-new-message',
  templateUrl: './create-new-message.component.html',
  styleUrls: ['./create-new-message.component.scss']
})

export class CreateNewMessageComponent implements OnInit {
  // Drop-down position - Auto-update  -- delcarations
  @ViewChild('autoCompleteSpecificSite', { read: MatAutocompleteTrigger })
  autoCompleteSpecificSite!: MatAutocompleteTrigger;
  @ViewChild('autoCompleteBusinessFun', { read: MatAutocompleteTrigger })
  autoCompleteBusinessFun!: MatAutocompleteTrigger;
  @ViewChild('autoCompleteSites', { read: MatAutocompleteTrigger })
  autoCompleteSites!: MatAutocompleteTrigger;
  @ViewChild('autoCompleteCustomRecipients', { read: MatAutocompleteTrigger })
  autoCompleteCustomRecipients!: MatAutocompleteTrigger;
  @ViewChild('autoCompleteCategory', { read: MatAutocompleteTrigger })
  autoCompleteCategory!: MatAutocompleteTrigger;
  @ViewChild('autoCompleteEmailTemplate', { read: MatAutocompleteTrigger })
  autoCompleteEmailTemplate!: MatAutocompleteTrigger;

  // FormGroups   -- declarations
  submitted            : boolean = false;
  submittedPG          : boolean = false;
  defineCrisisCommForm!: FormGroup;

  //communication title  -- declarations
  titleExists         : boolean = false;

  // Participants -- declarations
  filteredSpecificSites     : any[] = [];
  isSpecificSiteExists      : boolean = false;
  recipentOptionID          : any = null;
  filteredBusiness          : any[] = [];
  selectedBusiness          : any[] = [];
  filteredSites             : any[] = [];
  selectedSites             : any[] = [];
  filteredFBCCAndFBCTs      : any[] = [];
  selectedFBCCAndFBCTs      : any[] = [];

  // categories  -- declarations
  filteredCrisisCategoryList: any[]   = [];
  isCategoryExists          : boolean = false;

  // Incidents  -- declarations
  incidentMaster            : any[] = [];
  filteredRelatedIncidents  : any[] = [];

  //Email Templates --declarations
  filteredTemplateList    : any[]     = [];
  isTemplateExists        : boolean   = false

  //File upload --declarations
  moduleName  : string = 'Crisis';

  // DB error -- Declaration
  saveerror   : any = '';

  // ckeditor config -- declarations
  ckeConfig: any;
  disabledCkeConfig: any;
  intializeCKEditor: boolean = false;

  // Upload -- Declarations
  fileUploadData: object = {}

  constructor(
    private fb: FormBuilder,
    public utils: UtilsService,
    public rest : RestService,
    public dialog: MatDialog,
    public service: CrisisCommunicationService,
    @Inject(DOCUMENT) private _document: any,
    @Inject(MAT_DIALOG_DATA) public parent: any,
    private ckEditorService: CkEditorConfigService,
    public dialogRef: MatDialogRef<CreateNewMessageComponent>
  ) {
    this.rest.openWait("Fetching Data ...");
    this.initializeCrisisCommForm();        // Initalization of Form Group
    this.ckeConfig = JSON.parse(JSON.stringify(this.ckEditorService.getCKEditorConfig()));
    this.disabledCkeConfig = JSON.parse(JSON.stringify(this.ckEditorService.getReadOnlyCKEditorConfig()));
  }

  ngOnInit(): void {
    if (this.parent.crisisMode == 'Add'){
      this.resetForm();
      this.service.getCrisisCommCreateInfo();
    }
    else{
      this.service.getCrisisCommunicationData(this.parent.crisisData.CommunicationID);
    }
    this.service.gotMasterCrisiCommDataNInfo$.subscribe((value: any) => {
      if (value) {
        this.resetForm();
        this.filteredSpecificSites      = this.service.crisisInfoData.SitesList             || [];
        this.filteredSites              = this.service.crisisInfoData.SitesList             || [];
        this.filteredBusiness           = this.service.crisisInfoData.BusinessFunctionsList || [];
        this.filteredFBCCAndFBCTs       = this.service.crisisInfoData.FBCCAndFBCTs          || [];
        this.filteredCrisisCategoryList = this.service.crisisInfoData.CrisisCatergoryList   || [];
        this.filteredTemplateList       = this.service.crisisInfoData.EmailTemplatesList    || [];
        if(this.parent.crisisMode == 'Edit'){
          this.patchCrisisMsgDetails();
        }
        if (this.defineCrisisCommForm.get('communcationCode'))
          this.defineCrisisCommForm.get('communcationCode')!.disable();
        this.fileUploadData = {
          buttonName  : ' Upload',
          apiURL      : '/business-continuity-management/crisis-communications/upload-crisis-attachment'
        }
        this.fileUploadData = Object.assign(this.fileUploadData, this.service.crisisInfoData?.AttachmentConfiguration[0]);
        this.defineCrisisCommForm.get('emailTitle')?.disable();
        this.rest.closeWait();
      }
    });
    window.addEventListener('scroll', this.scrollEvent, true);
  }

    //-----------------------------------------------------------------------------------------------------------
  //  Drop-down position - Auto - update
  scrollEvent = (event: any): void => {
    if (this.autoCompleteSpecificSite) this.autoCompleteSpecificSite.updatePosition();
    if (this.autoCompleteBusinessFun) this.autoCompleteBusinessFun.updatePosition();
    if (this.autoCompleteSites) this.autoCompleteSites.updatePosition();
    if (this.autoCompleteCustomRecipients) this.autoCompleteCustomRecipients.updatePosition();
    if (this.autoCompleteCategory) this.autoCompleteCategory.updatePosition();
    if (this.autoCompleteEmailTemplate) this.autoCompleteEmailTemplate.updatePosition();
  };
  
    //-------------------------------------------------------------------------------------------------------------
  // Form Initialization/Updation & validations of Crisis Communication starts
  get f() {
    return this.defineCrisisCommForm?.controls;
  }

  get f1() {
    return (this.defineCrisisCommForm?.get('recipentGroup') as FormGroup)?.controls;
  }

  initializeCrisisCommForm(): void {
    this.defineCrisisCommForm = this.fb.group({
      communicationTitle    : ["", [Validators.required]],
      crisisCategory        : ["", [Validators.required]],
      crisisCategoryId      : ["", [Validators.required]],
      communcationCode      : ["", [Validators.required]],
      relatedIncidentId     : ["", [Validators.required]],
      emailTemplate         : ["", [Validators.required]],
      emailTitle            : ["", [Validators.required]],
      emailTemplateId       : ["", [Validators.required]],
      customizeEmailContent : ["", [Validators.required]],
      recipentGroup         : this.fb.group({
        recipents             : [null, [Validators.required]],
        specificSite          : [""],
        specificSiteId        : [""],
        bussinessFun          : [[]],
        customSites           : [[]],
        customRecipients      : [[]]
      }),
      attachments           : [""],
    });
    setTimeout(() => {
      this.intializeCKEditor = true;
    }, 100);
    this.setValidatorNDisable();
  }

  patchCrisisMsgDetails():void{
    let selectedCrisis = this.service?.crisisCommData;
    setTimeout(() => {
      this.defineCrisisCommForm.patchValue({
        communicationTitle    : selectedCrisis.CommunicationTitle,
        crisisCategory        : selectedCrisis.CrisisCategory,
        crisisCategoryId      : selectedCrisis.CrisisCategoryID,
        communcationCode      : selectedCrisis.CommunicationID,
        emailTemplate         : selectedCrisis.EmailTemplateName,
        emailTitle            : selectedCrisis.EmailTitle,
        emailTemplateId       : selectedCrisis.EmailTemplateID,
        customizeEmailContent : selectedCrisis.EmailContent,
      });
      this.recipentOptionID = selectedCrisis.RecipentOptionID;
      this.service.uploadedAttachments = selectedCrisis.Attachments;

      if (selectedCrisis.RecipentOptionID == 1) {
        this.filterRecipientsIncidents(selectedCrisis.RecipentOptionID);
      }
      if (selectedCrisis.RecipentOptionID == 2) {
        this.selectRecipentOption(2);
        this.defineCrisisCommForm.get('recipentGroup.specificSiteId')!.patchValue(selectedCrisis.Sites[0].SiteID);
        this.defineCrisisCommForm.get('recipentGroup.specificSite')!.patchValue(selectedCrisis.Sites[0].SiteName);
      }
      if (selectedCrisis.RecipentOptionID == 3) {
        this.selectedBusiness = [];
        Array.prototype.push.apply(this.selectedBusiness, selectedCrisis.BussinessFunctions);
        this.filteredBusiness = this.service.crisisInfoData.BusinessFunctionsList.filter((business:any) => !this.selectedBusiness.map(x=>x.BusinessFunctionsName).includes(business.BusinessFunctionsName));
        this.selectRecipentOption(3);
      }
      if (selectedCrisis.RecipentOptionID == 4) {
        this.selectedSites = [];
        Array.prototype.push.apply(this.selectedSites, selectedCrisis.Sites);
        this.filteredSites = this.service.crisisInfoData.SitesList.filter((sites:any) => !this.selectedSites.map(x=>x.SiteName).includes(sites.SiteName));
        this.selectRecipentOption(4);
      }
      if (selectedCrisis.RecipentOptionID == 5) {
        this.selectedFBCCAndFBCTs = [];
        Array.prototype.push.apply(this.selectedFBCCAndFBCTs, selectedCrisis.FBCCsAndFBCTs);
        this.filteredFBCCAndFBCTs = this.service.crisisInfoData.FBCCAndFBCTs.filter((user:any) => !this.selectedFBCCAndFBCTs.map(x=>x.UserName).includes(user.UserName));
        this.selectRecipentOption(5);
      }
      if(!(this.service.isBCManager || this.service.isFBCCUser) || selectedCrisis?.StatusID == 2){
        this.defineCrisisCommForm.disable();
        this.defineCrisisCommForm.get('recipentGroup.recipents')?.disable();
        this.setValidatorNDisable();
      } else {
         this.defineCrisisCommForm.enable();
         this.defineCrisisCommForm.get('communcationCode')!.disable();
         this.defineCrisisCommForm.get('emailTitle')?.disable();
         this.setValidatorNDisable();
         this.selectRecipentOption(selectedCrisis.RecipentOptionID);
      }

      this.defineCrisisCommForm.patchValue({
        relatedIncidentId     : selectedCrisis.IncidentID?.split(",")
      });
    }, 1000);
  }

  // Recipients selection -- Methods - start
  setValidatorNDisable() {
    this.defineCrisisCommForm.get('recipentGroup.specificSite')?.disable();
    this.defineCrisisCommForm.get('recipentGroup.bussinessFun')?.disable();
    this.defineCrisisCommForm.get('recipentGroup.customSites')?.disable();
    this.defineCrisisCommForm.get('recipentGroup.customRecipients')?.disable();
  }

  selectRecipentOption(recipentId: any) {
    this.submittedPG = false;
    this.setValidatorNDisable();
    this.defineCrisisCommForm.get('recipentGroup.recipents')!.setValue(recipentId);
    this.filterRecipientsIncidents(recipentId);

    if (recipentId == 2) {
      this.defineCrisisCommForm.get('recipentGroup.specificSite')?.enable();
    }
    if (recipentId == 3) {
      this.defineCrisisCommForm.get('recipentGroup.bussinessFun')?.enable();
    }
    if (recipentId == 4) {
      this.defineCrisisCommForm.get('recipentGroup.customSites')?.enable();
    }
    if (recipentId == 5) {
      this.defineCrisisCommForm.get('recipentGroup.customRecipients')?.enable();
    }
    this.defineCrisisCommForm.get('recipentGroup')!.updateValueAndValidity();
  }

  // Form Initialization/Updation & validations of Crisis Communication ends
      //-------------------------------------------------------------------------------------------------------------
  //Communication Title -- Methods - start

  checkTitleExists(e: any) {
    if (this.parent.crisisData)
      this.titleExists = (this.parent.allCrisis || []).some((x: any) => x.CommunicationTitle.toLowerCase().trim() == (e.target.value).toLowerCase().trim() && (x.CommunicationID !== this.parent.crisisData.CommunicationID));
    else
      this.titleExists = (this.parent.allCrisis || []).some((x: any) => x.CommunicationTitle.toLowerCase().trim() == (e.target.value).toLowerCase().trim());
  }

  //Communication Title -- Methods - end
      //-------------------------------------------------------------------------------------------------------------
    filterSpecificSites(event: any) {
      const searchTerm = event.target.value.toLowerCase();
      this.defineCrisisCommForm.get('recipentGroup.specificSiteId')?.reset();
      this.filteredSpecificSites = (this.service.crisisInfoData.SitesList || []).filter((site: any) => site.SiteName.toLowerCase().includes(searchTerm));
      this.isSpecificSiteExists = false;
    }

    setSpecificSiteID(site: any, event: any) {
     if (event.isUserInput)
      this.defineCrisisCommForm.get('recipentGroup.specificSiteId')!.patchValue(site.SiteID);
    }
  // Participant-Sites List -- Methods - starts

    filterSitesList(event:any){
      const searchTerm = event.target.value.toLowerCase();
      this.defineCrisisCommForm.controls['recipentGroup.customSites']?.setValue("");
      if(this.selectedSites.length == 0){
        this.filteredSites = this.service.crisisInfoData.SitesList.filter((site: any) => site.SiteName.toLowerCase().includes(searchTerm));
      }else{
        let remainingSites = this.service.crisisInfoData.SitesList.filter((sites:any) => !this.selectedSites.map(x=>x.SiteName).includes(sites.SiteName));
        this.filteredSites = remainingSites.filter((site: any) => site.SiteName.toLowerCase().includes(searchTerm));
      }
    }

    setSelectedSite(site:any){
      this.defineCrisisCommForm.controls['recipentGroup.customSites']?.setValue(site);
      this.defineCrisisCommForm.get('recipentGroup.customSites')?.reset();
      this.selectedSites.push(site);
      this.filteredSites = this.service.crisisInfoData.SitesList.filter((sites:any) => !this.selectedSites.map(x=>x.SiteName).includes(sites.SiteName));
    }

    removeSelectedSites(site:any){
      const index = this.selectedSites.indexOf(site);
      if (index !== -1){
        this.selectedSites.splice(index, 1);
        this.filteredSites = this.service.crisisInfoData.SitesList.filter((sites:any) => !this.selectedSites.map(x=>x.SiteName).includes(sites.SiteName));
      }
    }

  // Participant-Sites List -- Methods - end
       //-------------------------------------------------------------------------------------------------------------
  // Participant-Business List -- Methods - starts
  filterBusinessList(event:any){
    const searchTerm = event.target.value.toLowerCase();
    this.defineCrisisCommForm.controls['recipentGroup.bussinessFun']?.setValue("");
    if(this.selectedBusiness.length == 0){
      this.filteredBusiness = this.service.crisisInfoData.BusinessFunctionsList.filter((business: any) => business.BusinessFunctionsName.toLowerCase().includes(searchTerm));
    }else{
      let remainingBusinessFunc = this.service.crisisInfoData.BusinessFunctionsList.filter((business:any) => !this.selectedBusiness.map(x=>x.BusinessFunctionsName).includes(business.BusinessFunctionsName));
      this.filteredBusiness = remainingBusinessFunc.filter((business: any) => (business.BusinessFunctionsName).toLowerCase().includes(searchTerm));
    }
  }

  removeSelectedBusiness(business: any): void {
    const index = this.selectedBusiness.indexOf(business);
    if (index !== -1){
      this.selectedBusiness.splice(index, 1);
      this.filteredBusiness = this.service.crisisInfoData.BusinessFunctionsList.filter((business:any) => !this.selectedBusiness.map(x=>x.BusinessFunctionsName).includes(business.BusinessFunctionsName));
    }
  }

  setSelectedBusiness(business: any): void {
    this.defineCrisisCommForm.controls['recipentGroup.bussinessFun']?.setValue(business);
    this.defineCrisisCommForm.get('recipentGroup.bussinessFun')?.reset();
    this.selectedBusiness.push(business);
    this.filteredBusiness = this.service.crisisInfoData.BusinessFunctionsList.filter((business:any) => !this.selectedBusiness.map(x=>x.BusinessFunctionsName).includes(business.BusinessFunctionsName));
  }
  // Participant-Business List -- Methods - end
      //-------------------------------------------------------------------------------------------------------------
  // Participant-FBCCsAndFBCTs List -- Methods - starts

  filterRecipientsList(event: any){
    const searchTerm = event.target.value.toLowerCase();
    this.defineCrisisCommForm.controls['recipentGroup.customRecipients']?.setValue("");
    if(this.selectedFBCCAndFBCTs.length == 0){
      this.filteredFBCCAndFBCTs = this.service.crisisInfoData.FBCCAndFBCTs.filter((item: any) => item.UserName.toLowerCase().includes(searchTerm));
    }else{
      let remainingFBCCAndFBCTs = this.service.crisisInfoData.FBCCAndFBCTs.filter((items:any) => !this.selectedFBCCAndFBCTs.map(x=>x.UserName).includes(items.UserName));
      this.filteredFBCCAndFBCTs = remainingFBCCAndFBCTs.filter((item: any) => item.UserName.toLowerCase().includes(searchTerm));
    }
  }

  setSelectedRecipient(item: any){
    this.defineCrisisCommForm.controls['recipentGroup.customRecipients']?.setValue(item);
    this.defineCrisisCommForm.get('recipentGroup.customRecipients')?.reset();
    this.selectedFBCCAndFBCTs.push(item);
    this.filteredFBCCAndFBCTs = this.service.crisisInfoData.FBCCAndFBCTs.filter((items:any) => !this.selectedFBCCAndFBCTs.map(x=>x.UserName).includes(items.UserName));
  }

  removeRecipientSites(item: any){
    const index = this.selectedFBCCAndFBCTs.findIndex(item => item.Index === item.Index);
    if (index !== -1){
      this.selectedFBCCAndFBCTs.splice(index, 1);
      this.filteredFBCCAndFBCTs = this.service.crisisInfoData.FBCCAndFBCTs.filter((items:any) => !this.selectedFBCCAndFBCTs.map(x=>x.UserName).includes(items.UserName));
    }
  }
  // Participant-FBCCsAndFBCTs List -- Methods - starts
      //---------------------------------------------------------------------------------------------------------------------
  // Categries List -- Methods -- start
  filterCrisisCategroryList(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.defineCrisisCommForm.controls['crisisCategoryId'].setValue("");
    this.filteredCrisisCategoryList = (this.service.crisisInfoData.CrisisCatergoryList || []).filter((categroy: any) => categroy.CrisisCategory.toLowerCase().includes(searchTerm));
    this.isCategoryExists = false;
  }

  setCrisiCategory(category: any) {
    this.defineCrisisCommForm.controls['crisisCategoryId'].setValue(category.CrisisCategoryID);
  }
  // Categries List -- Methods -- end


  // Incident List -- Methods -- start
  clearIncidents() {
    this.defineCrisisCommForm.get('relatedIncidentId')?.setValue('');
    this.filteredRelatedIncidents = [];
    this.incidentMaster = [];
  }

  filterRecipientsIncidents(recipient: any, event?: any) {
    if (recipient == 1) {
      this.clearIncidents();
      let incidents = this.service.crisisInfoData.IncidentsList.filter((x: any) => x.AssociatedBusinessFuncitons?.length > 0);
      this.incidentMaster = JSON.parse(JSON.stringify(incidents));
    } else if (recipient == 2 && (event?.isUserInput === undefined || event?.isUserInput)) {
      if (this.defineCrisisCommForm.get('recipentGroup.specificSiteId')?.value) {
        this.clearIncidents();
        let incidents = this.service.crisisInfoData.IncidentsList.filter((x: any) => {
          return x.AssociatedSites.some((y: any) => {
            return (y.SiteID == this.defineCrisisCommForm.get('recipentGroup.specificSiteId')?.value)
          });
        });
        this.incidentMaster = JSON.parse(JSON.stringify(incidents));
      } else {
        this.clearIncidents();
      }
    } else if (recipient == 3 && (event?.isUserInput || event?.isUserInput === undefined)) {
      if (this.selectedBusiness?.length > 0) {
        this.clearIncidents();
        let incidents = this.service.crisisInfoData.IncidentsList.filter((x: any) => {
          return x.AssociatedBusinessFuncitons.some((y: any) => this.selectedBusiness.map((z: any) => Number(z.BusinessFunctionsID)).includes(y.BusinessFunctionsID));
        });
        this.incidentMaster = JSON.parse(JSON.stringify(incidents));
      } else {
        this.clearIncidents();
      }
    } else if (recipient == 4 && (event?.isUserInput || event?.isUserInput === undefined)) {
      if (this.selectedSites?.length > 0) {
        this.clearIncidents();
        let incidents = this.service.crisisInfoData.IncidentsList.filter((x: any) => {
          return x.AssociatedSites.some((y: any) => this.selectedSites.map((z: any) => Number(z.SiteID)).includes(y.SiteID));
        });
        this.incidentMaster = JSON.parse(JSON.stringify(incidents));
      } else {
        this.clearIncidents();
      }
    } else if (recipient == 5 && (event?.isUserInput || event?.isUserInput === undefined)) {
      if (this.selectedFBCCAndFBCTs?.length > 0) {
        this.incidentMaster = JSON.parse(JSON.stringify(this.service.crisisInfoData.IncidentsList));
      } else {
        this.clearIncidents();
      }
    }
    this.filteredRelatedIncidents = JSON.parse(JSON.stringify(this.incidentMaster))
  }

  getToolTipValue(from: any) {
    let tooltip = ''
    switch (from) {
      case '1':
        tooltip = this.service.crisisInfoData?.IncidentsList.filter((i: any) => (this.defineCrisisCommForm.get('relatedIncidentId')?.value || []).includes(i.IncidentID)).map((x: any) => x.IncidentCode + '-' + x.Incident).join(', ');
        break;
      case '2':
        tooltip = this.defineCrisisCommForm.get('emailTemplate')?.value;
        break;
      case '3':
        tooltip = this.defineCrisisCommForm.get('emailTitle')?.value;
        break;
      default:
        tooltip = '';
        break;
    }
    if (tooltip?.length > 100) return tooltip;
    else return ''
  }

  filterIncidentsList(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.defineCrisisCommForm.controls['relatedIncidentId'].setValue("");
    this.filteredRelatedIncidents = (this.incidentMaster || []).filter((incident: any) => incident.Incident.toLowerCase().includes(searchTerm));
  }

  setIncident(inc: any) {
    this.defineCrisisCommForm.controls['relatedIncidentId'].setValue(inc.IncidentID);
  }
  // Incident List -- Methods -- end

  // Template List -- Methods -- start
  filterEmailTemplateList(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.defineCrisisCommForm.controls['emailTemplateId'].setValue("");
    this.filteredTemplateList = (this.service.crisisInfoData.EmailTemplatesList || []).filter((template: any) => template.EmailTemplateName.toLowerCase().includes(searchTerm));
    this.isTemplateExists = false;
  }

  setTemplate(inc: any, event?: any) {
    if (event.isUserInput) {
      this.defineCrisisCommForm.controls['emailTemplateId'].setValue(inc.EmailTemplateID);
      this.defineCrisisCommForm.controls['emailTitle'].setValue(inc.EmailTitle);
      this.defineCrisisCommForm.controls['customizeEmailContent'].setValue(inc.EmailContent);
    }
  }
  // Template List -- Methods -- end

  formatedDate(date?:any){
    return this.service.dateToStringWithTimeStamp(date);
  }
  // Validate and add/update crisis message  -- Methods - starts
  checkSpecficSiteDerivedSelected() {
    if (this.defineCrisisCommForm.get('recipentGroup.recipents')?.value == 2) {

      if (!this.defineCrisisCommForm.get('recipentGroup.specificSiteId')?.value && this.defineCrisisCommForm.get('recipentGroup.specificSite')?.value.length > 0) {
        this.isSpecificSiteExists = true;
        return true;
      }
    }
    return false;
  }

  checkTemplateNameDerivedSelected() {
    if (!this.defineCrisisCommForm.get('emailTemplateId')?.value && this.defineCrisisCommForm.get('emailTemplate')?.value?.length > 0) {
      this.isTemplateExists = true;
      return true;
    }
    return false;
  }

  // file upload Method- starts
  openFileUploadPopup() {
    const dialog = this.dialog.open(FileUploadComponent, {
      disableClose: true,
      maxWidth: '50vw',
      width: '50vw',
      panelClass: ['full-screen-modal'],
      data: {
        moduleName: this.moduleName,
        config    : this.fileUploadData
      },
    });
    dialog.afterClosed().subscribe((result) => { });
  }
  // file upload Method- ends

  ValidateForm() : void {
    this.submitted = true;
    this.submittedPG = true;
    this.checkSpecficSiteDerivedSelected();
    this.checkTemplateNameDerivedSelected();

    if(this.defineCrisisCommForm.invalid || this.titleExists || this.isSpecificSiteExists || this.isTemplateExists)
      return;
    if((this.defineCrisisCommForm.get('recipentGroup.recipents')?.value == 3) && this.selectedBusiness?.length == 0)
      return;
    if((this.defineCrisisCommForm.get('recipentGroup.recipents')?.value == 4) && this.selectedSites?.length == 0)
      return;
      if((this.defineCrisisCommForm.get('recipentGroup.recipents')?.value == 5) && this.selectedFBCCAndFBCTs?.length == 0)
      return;

    this.addUpdateCrisisMessage();
  }

  addUpdateCrisisMessage(): void {
    this.service.addUpdateCrisisMessage(this.parent.crisisMode, this.defineCrisisCommForm.value, (this.parent.crisisMode == 'Add') ? null : this.parent.crisisData.CommunicationID, this.selectedBusiness.map((ele=> ele.BusinessFunctionsID)).join(", "), this.selectedSites.map((ele=> ele.SiteID)).join(", "), this.selectedFBCCAndFBCTs.map((ele=> ele.UserGUID)).join(", ")).subscribe((res: any) => {
      next:
      if (res.success == 1) {
        this.saveSuccess(this.parent.crisisMode == 'Add' ? "Crisis Message Drafted Successfully" : "Crisis Message Updated Successfully");
        this.dialogRef.close(true);
        this.resetForm();
      } else {
        if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
          this.utils.relogin(this._document);
        else
          this.saveerror = res.error.errorMessage;
      }
    })
  }
  // Validate and add/update crisis message -- Methods - ends

  // Reset Popup on click of close/cancel
  resetForm(): void {
    this.submitted = false;
    this.submittedPG = false;
    this.titleExists = false;
    this.isCategoryExists = false;
    this.isTemplateExists = false;
    this.isSpecificSiteExists = false;
    this.selectedBusiness = [];
    this.selectedSites = [];
    this.selectedFBCCAndFBCTs = [];
    this.filteredSpecificSites = [];
    this.service.uploadedAttachments = [];
    this.recipentOptionID = null;
    this.defineCrisisCommForm.reset();
    this.defineCrisisCommForm.get('recipentGroup')?.reset();
  }

  // Common Methods below (Save Sucess , Auto Scroll) -- start
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

  //disable the form if crisis is published and not BCM/FBCC/SiteBCC
  get isCrisisPublish(){
    return (!(this.service.isBCManager || this.service.isFBCCUser ) || this.service.crisisCommData?.StatusID == 2)
  }

  //Length Check
  checkLength(title: string, len: number) {
    return extentedTitle(title, len);
  }
}
