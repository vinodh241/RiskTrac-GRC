import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog,MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { addIndex, searchBy } from 'src/app/includes/utilities/commonFunctions';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { AssessmentRiskListing } from 'src/app/services/site-risk-assessments/assessment-risk-listing.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-add-edit-site-risk',
  templateUrl: './add-edit-site-risk.component.html',
  styleUrls: ['./add-edit-site-risk.component.scss'],
})
export class AddEditSiteRiskComponent {
  addSiteRisk!: FormGroup;
  allMasterData: any;
  sectionname = 'Details';
  detailSection: boolean = false;
  siteList: any;
  categoryList: any;
  mode: any;
  data: any;
  saveerror = '';
  submitted: boolean = false;
  riskList: any[] = [];
  ThreatData = new MatTableDataSource<Element>();
  displayedColumns: string[] = ['Checkbox','Position','ThreatCategory'];
  searchFields: any = ['ThreatCategory']
  threatCategoryIds: any[] = [];
  threatCategoryId: any[] = [];
  siteName: any;

  showValidationMessage: boolean = false;
  minStartDate: any;
  maxEndDate: any;

  selectedStartDate: any;
  selectedEndDate: any;

  selectedThreatIDs: any = [];
  editFlag: boolean = false;
  allThreatData: any;
  endDateError: boolean = false;
  endDateErrorValid:boolean = false;
  startDateError:boolean = false
  mindate:any
  date: any;
  filteredSiteList: any;
  dateError:boolean = false
  endDateError1:boolean = false
  assessmentName: any;
  selectedSites: any;
  futureDateError:boolean = false
  showArrow: boolean = false;
  filterValue: any = '';


  constructor(
    public dialog: MatDialog,
    @Inject(DOCUMENT) private _document: any,
    @Inject(MAT_DIALOG_DATA) public parent: any,
    public siteRiskAssessment: AssessmentRiskListing,
    public utils: UtilsService,
    public dialogRef: MatDialogRef<AddEditSiteRiskComponent>,
    private fb: FormBuilder
  ) {
    this.siteRiskAssessment.getSiteRiskMasterInfo();
    this.initialze();
  }

  ngOnInit(): void {
    this.mode = this.parent.mode;
    this.data = this.parent.data;
    this.siteRiskAssessment.gotInfoMaster.subscribe((value) => {
      if (value) {
        this.allMasterData = this.siteRiskAssessment.masterData;
         if (this.mode == 'add'){
         this.ThreatData = this.allMasterData.ThreatCategoryList;
         }
        this.allThreatData = this.allMasterData.ThreatCategoryList;
        this.filteredSiteList = this.allMasterData.SiteMasterList.filter((ele: any) => (ele.IsActive != true && ele.IsDeleted != false && (ele.SiteRiskAssessmentStatusID !=1 ||  ele.SiteRiskAssessmentStatusID !=2) ||  (ele.IsActive != false && ele.IsDeleted != true && (ele.SiteRiskAssessmentStatusID == 3))));
         this.siteList = this.allMasterData.SiteMasterList.filter((ele: any) => (ele.IsActive != true && ele.IsDeleted != false && (ele.SiteRiskAssessmentStatusID !=1 ||  ele.SiteRiskAssessmentStatusID !=2) ||  (ele.IsActive != false && ele.IsDeleted != true && (ele.SiteRiskAssessmentStatusID == 3))));

       if(this.mode == 'edit'){
        this.siteList = this.allMasterData.SiteMasterList;
       }
        this.categoryList = this.allMasterData.RisksList;
        if (this.mode == 'edit') {
          this.editFlag = true;
          this.threatCategoryIds = JSON.parse(this.data.ThreatCategories).map((threat: any) => threat.ThreatCategoryID);
          const filteredThreatData = this.allMasterData.ThreatCategoryList.filter((ele:any) =>this.threatCategoryIds.includes(ele.ThreatCategoryID) );
          const filteredThreatData1 = this.allMasterData.ThreatCategoryList.filter((ele:any) =>!this.threatCategoryIds.includes(ele.ThreatCategoryID) );
          this.ThreatData.data = [...filteredThreatData, ...filteredThreatData1];
          this.riskList = this.categoryList.filter((x: any) =>this.threatCategoryIds.includes(x.ThreatCategoryID));
          this.setValidatorNDisable();
          this.isChecked(this.data);
          this.patchValue(this.data);
        } else {
          this.initialze();
        }
      }
    });
  }

  initialze() {
    this.addSiteRisk = this.fb.group({
      selectedSites: ['', Validators.required],
      assessmentName: [''],
      assessmentCode: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });
  }

  patchValue(data: any) {
    this.selectedSites= data.SiteName,
    this.assessmentName = data.AssessmentName;
    this.addSiteRisk.patchValue({
      selectedSites: data.SiteName,
      assessmentName: data.AssessmentName,
      assessmentCode: data.AssessmentCode,
      startDate: data.StartDate,
      endDate: data.EndDate,
    });
  }

  siteData(data: any) {
    this.siteName = data.SiteName;

    this.addSiteRisk.patchValue({
      assessmentName: data.AssessmentName,
      assessmentCode: data.AssessmentCode,
    });
  }

  get f() {
    return this.addSiteRisk.controls;
  }

  next() {
    this.sectionname = 'Risk';
  }

  previous() {
    this.sectionname = 'Details';
  }

  onSelectSection() {
    this.sectionname = 'Details';
    this.detailSection = true;
  }

  selectRisk(category: any) {
    if (!this.threatCategoryIds.includes(category.ThreatCategoryID)) {
      this.threatCategoryIds.push(category.ThreatCategoryID);
    } else {
      const index = this.threatCategoryIds.findIndex((x: any) => x == category.ThreatCategoryID);
      this.threatCategoryIds.splice(index, 1);
    }

    this.riskList = this.categoryList.filter((x: any) => this.threatCategoryIds.includes(x.ThreatCategoryID));
    this.showValidationMessage = false;
    this.scrollDown("ScrollID")
  }

  submit() {
    this.submitted = true;

    if (this.addSiteRisk.invalid) return;

    let atLeastOneChecked = false;

    if (!this.threatCategoryIds?.length) {
      this.showValidationMessage = true;
      this.scrollDown("ScrollThreat")
    } else {
      this.showValidationMessage = false;

    this.threatCategoryIds.forEach((id: any) => {
      this.threatCategoryId.push({ThreatCategoryID: id});
    });

    this.siteRiskAssessment.addEditSiteDetails(this.mode, this.addSiteRisk.controls, this.threatCategoryId, this.siteName, this.data?.SiteRiskAssessmentID).subscribe((res) => {
      if (res.success == 1) {
        this.dialogRef.close(true);
        this.saveSuccess( this.mode == 'add' ? 'Assessment scheduled successfully' : 'Assessment updated successfully');
        this.siteRiskAssessment.processSiteListData(res);
      } else {
        if (res.error.errorCode && res.error.errorCode == 'TOKEN_EXPIRED')
          this.utils.relogin(this._document);
        else this.saveerror = res.error.errorMessage;
      }
      error: console.log('err::', 'error');
    });
    }
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
        this.siteRiskAssessment.getSiteListData();
      }, timeout);
    });
  }

updateSelecedStartDate(event?: any) {
  this.selectedStartDate = new Date(event.value);
  this.minStartDate     = this.selectedStartDate;
  let currentDate       = this.formatTimeZone(new Date()); // Get today's date
  this.date             = new Date(event.value);
  let formActionValue   = this.addSiteRisk.value;
  let onlyCurrentDate   = this.formatTimeZone(formActionValue.startDate);
  let endDate           = this.formatTimeZone(formActionValue.endDate);
  currentDate           = currentDate + "T00:00:00.000Z";
  onlyCurrentDate       = onlyCurrentDate + "T00:00:00.000Z";
  endDate               = endDate + "T00:00:00.000Z";

  if (onlyCurrentDate < currentDate) {
    this.dateError = true;
  } else {
    this.dateError = false;
  }

  if (onlyCurrentDate > endDate) {
    this.endDateError = true;
  } else {
    this.endDateError = false;
  }

  if (onlyCurrentDate == endDate) {
    this.endDateErrorValid = true;
  } else {
    this.endDateErrorValid = false;
  }
}

//to remove +5:30 and format the date like - "2023-08-21T00:00:00.000Z"
formatTimeZone(dateval: any) {
  let date = null;
  if (dateval instanceof Date) {
    const d = dateval.getDate();
    let dd = '';
    if (d < 10) {
      dd = '0' + d;
    } else {
      dd = '' + d;
    }
    let m = dateval.getMonth() + 1;
    let mm = '';
    if (m < 10) {
      mm = '0' + m;
    } else {
      mm = '' + m;
    }
    const y = dateval.getFullYear();
    const Timeval = "00:00:00.000Z"
    let val = y + '-' + mm + '-' + dd ;
    date = val
  } else if (typeof dateval === 'string' || dateval instanceof String) {
    const dateval2 = dateval.split('T')[0];
    const Timeval = "00:00:00.000Z"
    date = dateval2;
  } else {
    return null;
  }
  return date;
}

  updateSelectedEndDate(event?: any) {
    let formActionValue = this.addSiteRisk.value;

    let currentDate1       =  this.formatTimeZone(formActionValue.startDate); // Get today's date

    let onlyCurrentDate1   = this.formatTimeZone(formActionValue.endDate);
    currentDate1           = currentDate1 + "T00:00:00.000Z";
    onlyCurrentDate1       = onlyCurrentDate1 + "T00:00:00.000Z";

    if (formActionValue.endDate && formActionValue.endDate instanceof Date) {
    if (onlyCurrentDate1 < currentDate1){
      this.endDateErrorValid = false
      this.endDateError = true;
      this.scrollDown("ScrollID")
    }else if(onlyCurrentDate1 == currentDate1){
      this.endDateError = false;
    this.endDateErrorValid = true;
    this.scrollDown("ScrollID")
     } else{
    this.endDateError = false
    this.endDateErrorValid = false
    }
  }
  }

  onSelectTab(tab: any) {
    this.sectionname = tab;
  }

  isChecked(ele: any) {
    return this.threatCategoryIds.includes(ele.ThreatCategoryID);
  }

  setValidatorNDisable() {
    this.addSiteRisk.get('selectedSites')!.disable();
  }
  scrollDown(id: any) {
    let el = document.getElementById(id)!;
    if (el)
      el.scrollTop = el.scrollHeight;
  }

  siteListData(event: any) {
    const searchTerm = event.target?.value.toLowerCase();

    this.filteredSiteList = this.siteList.filter((user: any) =>
      user.SiteName.toLowerCase().includes(searchTerm)
    );
  }

  applyFilter(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value;
    this.ThreatData = addIndex(JSON.parse(JSON.stringify(searchBy(this.filterValue, this.searchFields, this.allMasterData.ThreatCategoryList))), false);
  }

}
