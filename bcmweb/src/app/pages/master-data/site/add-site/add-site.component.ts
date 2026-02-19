import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, PatternValidator, Validators } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fileNamePattern } from 'src/app/includes/utilities/commonFunctions';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { MasterSiteService, SiteTableColumns } from 'src/app/services/master-data/master-site/master-site.service';
import { RestService } from 'src/app/services/rest/rest.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-add-site',
  templateUrl: './add-site.component.html',
  styleUrls: ['./add-site.component.scss']
})
export class AddSiteComponent implements OnInit {
  // Drop-Down Position - Auto Update Delcarations
  @ViewChild('autoCompleteCountryInput', { read: MatAutocompleteTrigger })
  autoCompleteCountryInput!: MatAutocompleteTrigger;
  @ViewChild('autoCompleteStateInput', { read: MatAutocompleteTrigger })
  autoCompleteStateInput!: MatAutocompleteTrigger;
  @ViewChild('autoCompleteCityInput', { read: MatAutocompleteTrigger })
  autoCompleteCityInput!: MatAutocompleteTrigger;
  @ViewChild('autoCompleteSiteBCCInput', { read: MatAutocompleteTrigger })
  autoCompleteSiteBCCInput!: MatAutocompleteTrigger;
  @ViewChild('autoCompleteSiteAHInput', { read: MatAutocompleteTrigger })
  autoCompleteSiteAHInput!: MatAutocompleteTrigger;

  mode: any = '';
  siteData: any = {};
  defineSiteForm!: FormGroup;
  submitted: boolean = false;
  filteredStateList: any = [];
  filteredCityList: any = [];
  seletedSiteBCChamp: string | null = null;
  filteredChampList: any = [];
  filteredAdminHead: any = [];
  filteredCountryList: any = [];
  filteredStates: any = [];
  filteredCities: any = [];
  saveerror: any;
  isBCChampExists: boolean = false;
  isAdminExists: boolean = false;
  isShortCodeExists: boolean = false;
  isSiteNameExists: boolean = false;
  isCountryExists: boolean = false;
  isStateExists: boolean = false;
  isCityExists: boolean = false;
  validSiteErr: boolean = false;

  constructor(
    private fb: FormBuilder,
    public utils: UtilsService,
    public dialog: MatDialog,
    @Inject(DOCUMENT) private _document: any,
    @Inject(MAT_DIALOG_DATA) public parent: any,
    public service: MasterSiteService,
    public dialogRef: MatDialogRef<AddSiteComponent>,
    private rest: RestService
  ) {
    this.rest.openWait("Fetching Data ...");
    this.initializeForm();
  }

  ngOnInit(): void {
    this.service.getSiteMasterInfo();
    this.mode = this.parent.mode;
    this.siteData = this.parent.selectedSite;
    this.service.gotMasterSiteInfoData.subscribe((value) => {
      if (value) {
        this.filteredChampList = this.service.siteInfoData.BCChampionList || [];
        this.filteredAdminHead = this.service.siteInfoData.SiteAdminList || [];
        this.filteredCountryList = this.service.siteInfoData?.CountryList || [];
        if (this.mode == 'Edit') {
          this.patchData();
        } else {
          this.defineSiteForm.get('state')!.disable();
          this.defineSiteForm.get('city')!.disable();
        }
        this.rest.closeWait();
      }
    });
    window.addEventListener('scroll', this.scrollEvent, true);
  }

  // Drop-Down Position - Auto Update
  scrollEvent = (event: any): void => {
    if (this.autoCompleteCountryInput) this.autoCompleteCountryInput.updatePosition();
    if (this.autoCompleteStateInput) this.autoCompleteStateInput.updatePosition();
    if (this.autoCompleteCityInput) this.autoCompleteCityInput.updatePosition();
    if (this.autoCompleteSiteBCCInput) this.autoCompleteSiteBCCInput.updatePosition();
    if (this.autoCompleteSiteAHInput) this.autoCompleteSiteAHInput.updatePosition();
  };

  patchData() {
    if (this.defineSiteForm) {
      this.filterState(this.siteData.CountryID);
      this.filterCity(this.siteData.StateID);
      this.defineSiteForm.patchValue({
        siteName: this.siteData.SiteName,
        shortCode: this.siteData.ShortCode,
        siteAdress: this.siteData.SiteAddress,
        countryId: this.siteData.CountryID,
        country: this.siteData.Country,
        stateId: this.siteData.StateID,
        state: this.siteData.State,
        cityId: this.siteData.CityID,
        city: this.siteData.City,
        siteBCChamp: this.siteData.BCChampionName,
        siteBCChampionGUID: this.siteData.BCChampionGUID,
        siteAdminHead: this.siteData.AdminName,
        siteAdminGUID: this.siteData.AdminGUID
      });
      if (this.mode == "Edit" ) { 
        if(this.defineSiteForm.get('shortCode')) {
          this.defineSiteForm.get('shortCode')!.disable();
        }
        this.defineSiteForm.get('siteName')!.disable();
        this.defineSiteForm.get('country')!.disable();
        this.defineSiteForm.get('state')!.disable();
        this.defineSiteForm.get('city')!.disable();
      }
    }
  }

  initializeForm() {
    this.defineSiteForm = this.fb.group({
      siteName: ["", [Validators.required]],
      shortCode: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(6), Validators.pattern('^[A-Z][A-Z0-9]*$')]],
      siteAdress: ["", [Validators.required]],
      country: ["", [Validators.required]],
      countryId: ["", [Validators.required]],
      city: ["", [Validators.required]],
      cityId: ["", [Validators.required]],
      state: ["", [Validators.required]],
      stateId: ["", [Validators.required]],
      siteBCChamp: ["", [Validators.required]],
      siteBCChampionGUID: ["", [Validators.required]],
      siteAdminHead: ["", [Validators.required]],
      siteAdminGUID: ["", [Validators.required]]
    });
  }

  get f() {
    return this.defineSiteForm?.controls;
  }

  getPatternError() {
    let splitValue = this.defineSiteForm?.get('shortCode')?.value.split('');
    if (splitValue.some((x: any) => x === ' ' || !/[a-zA-Z0-9]/.test(x)))
      return 'Special Characters & Space are not allowed';

    if (!isNaN(parseInt(splitValue[0])))
      return 'Code should not start with number'

    if (!splitValue.every((x: any) => x === x.toUpperCase()))
      return 'Code should be in upper case'

    return '';
  }

  getSitePatternErr() {
    const match = /[\^`\;@\&\+\$\%\!\#\{}\~\[\]\*\()\_\=\|\:\"\.\'\<>\?\/]/;
    if (match.test(this.defineSiteForm?.get('siteName')?.value)) {
      this.validSiteErr = true;
      return 'Special Characters are not allowed';
    }
    this.validSiteErr = false;
    return '';
  }

  checkCodeExist(e: any) {
    this.isShortCodeExists = this.parent.allSites.some((x: any) => x.ShortCode.toLowerCase().trim() == (e.target.value).toLowerCase().trim());
  }

  checkSiteNameExist(e: any) {
    if (this.siteData)
      this.isSiteNameExists = this.parent.allSites.some((x: any) => x.SiteName.toLowerCase().trim() == (e.target.value).toLowerCase().trim() && (x.SiteID !== this.siteData.SiteID));
    else
      this.isSiteNameExists = this.parent.allSites.some((x: any) => x.SiteName.toLowerCase().trim() == (e.target.value).toLowerCase().trim());
  }

  filterCountryList(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.defineSiteForm.controls['countryId'].setValue("");
    this.filteredCountryList = (this.service.siteInfoData.CountryList || []).filter((item: any) => item.Country.toLowerCase().includes(searchTerm));
    this.isCountryExists = false;
  }

  filterState(id: any, event?: any) {
    if (event?.isUserInput || event == undefined) {
      this.defineSiteForm.controls['countryId'].setValue(id);
      this.isCountryExists = false;
      this.filteredStates = JSON.parse(JSON.stringify((this.service.siteInfoData.StateList || []).filter((city: any) => city.CountryID == id)));
      this.filteredStateList = JSON.parse(JSON.stringify(this.filteredStates || []));
      this.defineSiteForm.get('city')?.reset();
      this.defineSiteForm.get('state')?.reset();
      this.filteredCityList = [];
      this.defineSiteForm.get('state')!.enable();
      if (!this.defineSiteForm.get('city')?.value) {
        this.defineSiteForm.get('city')!.disable();
      }
    }
  }

  filterStateList(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.defineSiteForm.controls['stateId'].setValue("");
    this.filteredStateList = (this.filteredStates || []).filter((item: any) => item.State.toLowerCase().includes(searchTerm));
    this.isStateExists = false;
  }

  filterCity(id: any, event?: any) {
    if (event?.isUserInput || event == undefined) {
      this.defineSiteForm.controls['stateId'].setValue(id);
      this.isStateExists = false;
      this.filteredCities = JSON.parse(JSON.stringify((this.service.siteInfoData.CityList || []).filter((city: any) => city.StateID == id)));
      this.filteredCityList = JSON.parse(JSON.stringify(this.filteredCities || []));
      this.defineSiteForm.get('city')?.reset();
      this.defineSiteForm.get('city')!.enable();
    }
  }

  filterCityList(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.defineSiteForm.controls['cityId'].setValue("");
    this.filteredCityList = (this.filteredCities || []).filter((item: any) => item.City.toLowerCase().includes(searchTerm));
    this.isCityExists = false;
  }

  setCityID(id: any, event?: any) {
    if (event?.isUserInput || undefined) {
      this.defineSiteForm.controls['cityId'].setValue(id);
      this.isCityExists = false;
    }
  }

  filterBCChampList(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.defineSiteForm.controls['siteBCChampionGUID'].setValue("");
    this.filteredChampList = (this.service.siteInfoData.BCChampionList || []).filter((champ: any) => champ.BCChampionName.toLowerCase().includes(searchTerm));
    this.isBCChampExists = false;
  }

  setBCChampID(champ: any, event: any) {
    if (event?.isUserInput || undefined) {
      this.defineSiteForm.controls['siteBCChampionGUID'].setValue(champ.BCChampionGUID);
      this.isBCChampExists = false;
    }
  }

  filterAdminHeadList(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.defineSiteForm.controls['siteAdminGUID'].setValue("");
    this.filteredAdminHead = (this.service.siteInfoData.SiteAdminList || []).filter((admin: any) => admin.AdminName.toLowerCase().includes(searchTerm));
    this.isAdminExists = false;
  }

  setAdminHeadID(admin: any, event: any) {
    if (event?.isUserInput || undefined) {
      this.defineSiteForm.controls['siteAdminGUID'].setValue(admin.AdminGUID);
      this.isAdminExists = false;
    }
  }

  resetForm() {
    this.defineSiteForm.reset();
    this.seletedSiteBCChamp = '';
    this.filteredStateList = [];
    this.filteredCityList = [];
    this.filteredChampList = [];
    this.filteredAdminHead = [];
    this.isShortCodeExists = false;
    this.isSiteNameExists = false;
  }

  checkChampDerivedSelected() {
    if (!this.defineSiteForm.get('siteBCChampionGUID')?.value && this.defineSiteForm.get('siteBCChamp')?.value.length > 0) {
      this.isBCChampExists = true;
      return true;
    }
    return false;
  }

  checkAdimDerivedSelected() {
    if (!this.defineSiteForm.get('siteAdminGUID')?.value && this.defineSiteForm.get('siteAdminHead')?.value.length > 0) {
      this.isAdminExists = true;
      return true;
    }
    return false;
  }

  checkCountrySelected() {
    if (!this.defineSiteForm.get('countryId')?.value && this.defineSiteForm.get('country')?.value.length > 0) {
      this.isCountryExists = true;
      return true;
    }
    return false;
  }

  checkStateSelected() {
    if (!this.defineSiteForm.get('stateId')?.value && this.defineSiteForm.get('state')?.value.length > 0) {
      this.isStateExists = true;
      return true;
    }
    return false;
  }

  checkCitySelected() {
    if (!this.defineSiteForm.get('cityId')?.value && this.defineSiteForm.get('city')?.value.length > 0) {
      this.isCityExists = true;
      return true;
    }
    return false;
  }

  onSubmit() {
    this.submitted = true;

    this.checkChampDerivedSelected();
    this.checkAdimDerivedSelected();
    this.checkCountrySelected();
    this.checkStateSelected();
    this.checkCitySelected();


    if (this.defineSiteForm.invalid || this.isShortCodeExists || this.isBCChampExists || this.isAdminExists || this.isSiteNameExists
      || this.isCountryExists || this.isStateExists || this.isCityExists || this.validSiteErr == true) {
      return;
    }

    this.service.addOrUpdateSite(this.mode == "Add New" ? null : this.siteData.SiteID, this.defineSiteForm.controls, this.mode).subscribe((res: any) => {
      next:
      if (res.success == 1) {
        this.dialogRef.close(true);
        this.resetForm();
        this.saveSuccess(this.mode == "Add New" ? "Site Added Successfully" : "Site Updated Successfully");
        this.service.processSiteList(res);
      } else {
        if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
          this.utils.relogin(this._document);
        else
          this.saveerror = res.error.errorMessage;
      }
    });
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
        this.service.getSiteMaster();
      }, timeout)
    });
  }
}
