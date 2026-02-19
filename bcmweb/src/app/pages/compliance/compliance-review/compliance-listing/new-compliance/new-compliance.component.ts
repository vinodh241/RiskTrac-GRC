import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ComplianceService } from 'src/app/services/compliance-review/compliance.service';

@Component({
  selector: 'app-new-compliance',
  templateUrl: './new-compliance.component.html',
  styleUrls: ['./new-compliance.component.scss']
})

export class NewComplianceComponent {

  displayedColumns: string[] = ['Radio', 'Index', 'Framework'];
  domainColumns: string[] = ['Checkbox', 'Index', 'Domain', 'Controls'];
  dataSource = new MatTableDataSource<Element>();
  addEditCompliance!: FormGroup;
  assessmentTypeList: any;
  assessmentCode: any;
  domainList: any;
  submitted: boolean = false;
  endDateError: boolean = false;
  endDateErrorValid:boolean = false;
  startDateError:boolean = false
  mindate = new Date();
  date: any;
  minStartDate: any;
  maxEndDate: any;
  sectionname = 'Details';
  filteredBusiness: any[] = [];
  selectedBusiness: any[] = [];

  constructor(public complianceService: ComplianceService,
    private fb: FormBuilder,
    public dialog: MatDialog
  ) {
    this.complianceService.getComplianceInfoData();
    this.initailze()
  }

  ngOnInit() {
    this.complianceService.gotMasterComplainceInfo.subscribe((value) => {
      if (value) {
        this.assessmentCode = this.complianceService.allComplainceInfo.AssessmentCode || [];
        this.dataSource = this.complianceService.allComplainceInfo.FrameworkList || [];
        this.filteredBusiness = this.complianceService.allComplainceInfo.BusinessFunctionsList || [];

        setTimeout(() => {
          this.addEditCompliance.patchValue({
            assessmentCode: this.assessmentCode,
          });
        }, 1000);
      }
    });
  }

  initailze() {
    this.addEditCompliance = this.fb.group({
      assessmentCode: [''],
      assessmentType:['',Validators.required],
      assessmentName:['',Validators.required],
      startDate:['',Validators.required],
      endDate:['',Validators.required],
      description:['',Validators.required],
      businessFun:['',Validators.required]
    })
  }

  selectFramework(ele: any){
    this.domainList = this.complianceService.allComplainceInfo.FrameworkDomainList.filter((x:any)=>x.FrameworkID == ele.FrameworkID)
  }

  get f() {
    return this.addEditCompliance.controls;
  }

  submit() {
    this.submitted = true
  }

  close() {
    this.dialog.closeAll();
  }

  updateSelectedEndDate(event?: any) {
    // this.maxEndDate = this.selectedEndDate;
    // let date = new Date();
    let formActionValue = this.addEditCompliance.value;

    if (formActionValue.endDate.getTime() < formActionValue.startDate.getTime()){
      this.endDateError = true;
      this.scrollDown("ScrollID")
    }else if(formActionValue.endDate.getTime() == formActionValue.startDate.getTime()){
      this.endDateError = false;
    this.endDateErrorValid = true;
    this.scrollDown("ScrollID")
     } else{
    this.endDateError = false
    this.endDateErrorValid = false
    }
  }

  scrollDown(id: any) {
    let el = document.getElementById(id)!;
    if (el)
      el.scrollTop = el.scrollHeight;
  }

  updateSelecedStartDate(event?: any) {
    // this.selectedStartDate = new Date(event.value);
    // this.minStartDate = this.selectedStartDate;
    this.date = new Date(event.value);
    let formActionValue = this.addEditCompliance.value;
 if (!!formActionValue.endDate) {
      if (formActionValue.endDate.getTime() < formActionValue.startDate.getTime()){
        this.endDateError = true;
        this.scrollDown("ScrollID")
      }
      else{
      this.startDateError = false
      }
    }
  }

  onSelectTab(tab: any) {
    this.sectionname = tab;
  }

  next() {
    if(this.sectionname = 'Details'){
      this.sectionname = 'Frameworks';
    }else if(this.sectionname = 'Frameworks'){
      this.sectionname = 'Participants';
    }
  }

  previous() {
    this.sectionname = 'Details';
  }

  selectReviewOption(id:any){
    if (id == 1) {
      this.addEditCompliance.get('businessFun')?.enable();
      // this.defineBCMSTestForm.get('participantGroup.specificSite')?.setValidators([Validators.required]);
    }
    if (id == 2) {
      this.addEditCompliance.get('participantGroup.bussinessFun')?.enable();
      // this.defineBCMSTestForm.get('participantGroup.bussinessFun')?.setValidators([Validators.required]);
    }
  }

  filterBusinessList(event:any){
    const searchTerm = event.target.value.toLowerCase();
    this.addEditCompliance.controls['businessFun']?.setValue("");
    if(this.selectedBusiness.length == 0){
      this.filteredBusiness = this.complianceService.allComplainceInfo.BusinessFunctionsList.filter((business: any) => business.BusinessFunction.toLowerCase().includes(searchTerm));
    }else{
      let remainingBusinessFunc = this.complianceService.allComplainceInfo.BusinessFunctionsList.filter((business:any) => !this.selectedBusiness.map(x=>x.BusinessFunction).includes(business.BusinessFunction));
      this.filteredBusiness = remainingBusinessFunc.filter((business: any) => business.BusinessFunction.toLowerCase().includes(searchTerm));
    }
  }

  removeSelectedBusiness(business: any): void {
    const index = this.selectedBusiness.indexOf(business);
    if (index !== -1){
      this.selectedBusiness.splice(index, 1);
      this.filteredBusiness = this.complianceService.allComplainceInfo.BusinessFunctionsList.filter((business:any) => !this.selectedBusiness.map(x=>x.BusinessFunction).includes(business.BusinessFunction));
    }
  }

  setSelectedBusiness(business: any): void {
    this.addEditCompliance.controls['businessFun']?.setValue(business);
    this.addEditCompliance.get('businessFun')?.reset();
    this.selectedBusiness.push(business);
    this.filteredBusiness = this.complianceService.allComplainceInfo.BusinessFunctionsList.filter((business:any) => !this.selectedBusiness.map(x=>x.BusinessFunction).includes(business.BusinessFunction));
  }

}
