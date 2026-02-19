import { DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Inject, Input, Output, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { BusinessContinuityPlansService } from 'src/app/services/business-continuity-plans/business-continuity-plans.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-impact-assessment',
  templateUrl: './impact-assessment.component.html',
  styleUrls: ['./impact-assessment.component.scss']
})

export class ImpactAssessmentComponent {

  @Input() impactAsseFlag: any;
  @Output() dataImpactSaved = new EventEmitter<boolean>();
  @Output() checkImpactAssessmentDataChanges = new EventEmitter<any>();
  impactForm !: FormGroup;
  processActivity: any;
  impactList: any;
  impactMasterData: any;
  reviewList: any;
  reviewSubProcess: any;
  currentStatus: any;
  workFlowStatus: any;
  workFlowStatusID: any;
  IsBCCValidUser: any;
  impactCount: any;
  subProcessList: any[] = [];
  impactAssementList: any[] = [];
  isBCPListing: boolean = false;
  isAllExpanded: boolean = false;
  isViewMode: boolean = true
  isDisable: boolean = true;
  submitted: boolean = false;
  isSavedPro: boolean = false;
  saveerror = "";

  impactPeriod = [
    { Period: "<2 hrs", PeriodDesc: "LessThanTwoHours" },
    { Period: "2-4 hrs", PeriodDesc: "TwoToFourHours" },
    { Period: "4-8 hrs", PeriodDesc: "FourToEightHours" },
    { Period: "1 day", PeriodDesc: "OneDay" },
    { Period: "2 days", PeriodDesc: "TwoDays" },
    { Period: "3-5 days", PeriodDesc: "ThreeToFiveDays" },
    { Period: ">5 days", PeriodDesc: "GreaterThanFiveDays" }
  ]

  impactProcessData: any = [];
  impactAssementData :any =[];
  
  constructor(
    @Inject(DOCUMENT) private _document: any,
    public utils: UtilsService,
    public service: BusinessContinuityPlansService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    this.service.getImpactAssesmentDetails(localStorage.getItem("BusinessFunctionID"), localStorage.getItem("BusinessContinuityPlanID"), 4);
    this.service.impactAssSubj.subscribe((value: any) => {
      if (value) {
        this.processActivity      = this.service.impactAssObj.businessProcessList || [];
        this.impactList           = this.service.impactAssObj.impactDropDownList || [];
        this.impactMasterData     = this.service.impactAssObj.impactMasterList || [];
        this.impactCount          = this.impactMasterData.length
        this.reviewList           = this.service.impactAssObj.ListingImpactAssessment || [];
        this.subProcessList       = this.service.impactAssObj.subProcessList || [];
        this.isBCPListing         = this.service.listingPageDetails;
        this.impactAssementList   = this.service.impactAssObj.impactAssementList[0].ImpactMasterData || [];
        this.impactAssementData   = this.service.impactAssObj.impactAssementList[0].ImpactMasterData || [];

        this.isSavedPro           = this.impactAssementList[0]?.IsSaved
        this.dataImpactSaved.emit(this.service.dataImpactSaved);
        this.currentStatus        = Number(localStorage.getItem("CurrentWorkFlowStatusID"));
        this.IsBCCValidUser       = Number(localStorage.getItem("IsBCCValidUser"))

        if (this.IsBCCValidUser == 1 && (this.currentStatus == 7 || this.currentStatus == 2 || this.currentStatus == 1)) {
          this.isBCPListing = false;
        } else {
          this.isBCPListing = true;
        }

        if (this.impactAssementList.length == 0) {
          this.initializeForm()
        } else {
          this.patchValue();
        }
      }
    })
    this.workFlowStatus = localStorage.getItem("WorkFlowStatus")
    this.workFlowStatusID = localStorage.getItem("WorkFlowStatusID")
  }

  initializeForm() {
    const formGroup: { [key: string]: any } = {};
    this.processActivity.forEach((item: any) => {
      this.impactMasterData.forEach((master: any) => {
        this.impactPeriod.forEach(period => {
          formGroup['Impact_' + item.BusinessProcessId + '_' + master.ImpactMasterDataID + '_' + period.PeriodDesc] = new FormControl('');
        });
      })
    })
    this.impactForm = this.fb.group(formGroup);
  }

  patchValue() {
    this.initializeForm();
    setTimeout(() => {
      this.impactAssementList.forEach(i => {
        this.impactForm.patchValue({
          ['Impact_' + i.BusinessProcessID + '_' + i.ImpactId + '_' + "LessThanTwoHours"]: this.getImpactID(i.LessThanTwoHours),
          ['Impact_' + i.BusinessProcessID + '_' + i.ImpactId + '_' + "TwoToFourHours"]: this.getImpactID(i.TwoToFourHours),
          ['Impact_' + i.BusinessProcessID + '_' + i.ImpactId + '_' + "FourToEightHours"]: this.getImpactID(i.FourToEightHours),
          ['Impact_' + i.BusinessProcessID + '_' + i.ImpactId + '_' + "OneDay"]: this.getImpactID(i.OneDay),
          ['Impact_' + i.BusinessProcessID + '_' + i.ImpactId + '_' + "TwoDays"]: this.getImpactID(i.TwoDays),
          ['Impact_' + i.BusinessProcessID + '_' + i.ImpactId + '_' + "ThreeToFiveDays"]: this.getImpactID(i.ThreeToFiveDays),
          ['Impact_' + i.BusinessProcessID + '_' + i.ImpactId + '_' + "GreaterThanFiveDays"]: this.getImpactID(i.GreaterThanFiveDays)
        });
      });
    }, 500)
  }

  getImpactID(val: any) {
    return this.impactList.filter((ob: any) => ob.ImpactName == val)[0]?.ImpactID
  }

  transformImpactData(impactObject: any) {
    let ImpactAssessment: any = [];
    let pairs: any = {};

    for (let key in impactObject) {
      let parts = key.split('_');
      let businessProcessID = parts[1];
      let impactId = parts[2];
      let timeFrame = parts[3];
      let pairKey = `Impact_${businessProcessID}_${impactId}`;
      if (!pairs[pairKey]) {
        pairs[pairKey] = { BusinessProcessID: parseInt(businessProcessID), ImpactId: parseInt(impactId) };
      }
      pairs[pairKey][timeFrame] = this.getImpactLevelValue(impactObject[key]);
    }
    for (let pair in pairs) {
      let p = pairs[pair]
      ImpactAssessment.push(p);
    }

    if (this.impactAssementList.length == 0) {
      ImpactAssessment.forEach((ob: any) => {
        let { assmt } = ob
        ob.ImpactAssessmentID = null;
        return { ...assmt, ob }
      })
    } else {
      ImpactAssessment.forEach((ob: any) => {
        this.impactAssementList.forEach(it => {
          if (ob.BusinessProcessID == it.BusinessProcessID && ob.ImpactId == it.ImpactId) {
            ob.ImpactAssessmentId = it.ImpactAssessmentId;
            for (let key in ob) {
              if (ob[key] == "") {
                ob[key] = it[key];
              }
            }
          } 
        });
      });
    }

    ImpactAssessment.forEach((obj: any) => {
      if (!obj.hasOwnProperty('ImpactAssessmentId')) {
          obj.ImpactAssessmentId = null;
      }
    });
    return ImpactAssessment;
  }

  getImpactLevelValue(val: any) {
    return this.impactList.filter((ob: any) => ob.ImpactID == val)[0].ImpactName
  }

  getSubActivity(id: any) {
    return this.subProcessList.filter((x: any) => x.BusinessProcessId == id);
  }

  saveImpact() {
    let output = this.transformImpactData(this.impactForm.value)
    console.log('✌️output --->', output);

    let obj = {
      BusinessContinuityPlanId: Number(localStorage.getItem("BusinessContinuityPlanID")),
      BusinessFunctionID: Number(localStorage.getItem("BusinessFunctionID")),
      ImpactAssessment: output,
    }

    this.submitted = true;

    this.service.addUpdateImpactAss(obj).subscribe(res => {
      if (res.success == 1) {
        this.saveSuccess("Impact is saved Successfully");
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
        this.service.getImpactAssesmentDetails(localStorage.getItem("BusinessFunctionID"), localStorage.getItem("BusinessContinuityPlanID"), 4);
      }, timeout)
    });
  }

  isAnyControlInvalid(): boolean {
    for (const controlName in this.impactForm?.controls) {
      const control = this.impactForm?.get(controlName);
      if (control && !control.value) {
        return true;
      }
    }
    return false;
  }

  onImpactChange(event: any, element: any): void {
    const selectedOption = event.target.options[event.target.selectedIndex];
    const backgroundColor = selectedOption.style.backgroundColor;
    this.renderer.setStyle(element, 'backgroundColor', backgroundColor);
  }

  getBackgroundColor(id: any) {
    let dropdownValue = Number(this.impactForm.get(id)?.value);
    let statecssclass = '';
    if (dropdownValue !== undefined && dropdownValue !== null) {
      switch (dropdownValue) {
        case 1:
          statecssclass = '#ffffff';
          break;
        case 2:
          statecssclass = '#D6FDFF';
          break;
        case 3:
          statecssclass = '#FFF1D6';
          break;
        case 4:
          statecssclass = '#FFDBDB';
          break;
        default:
          statecssclass = '#ffffff';
          break
      }
    }
    return statecssclass;
  }

  async compareImpactAssessmentData() {
    let formData = [this.impactForm.value];  
    let allFieldsFilled = formData.every(obj => {
        return Object.values(obj).every(value => value !== ""); 
    }); 

    if (allFieldsFilled) {    
        let output = this.transformImpactData(this.impactForm.value)

        let result : boolean = this.isDataChanged(output,this.impactAssementData)
        this.checkImpactAssessmentDataChanges.emit(result);

        return result; 
    } else {
      let someFieldsFilled = formData.some(obj => {
        return Object.values(obj).some(value => value !== ""); 
      });
      this.checkImpactAssessmentDataChanges.emit(someFieldsFilled);  
      return someFieldsFilled; 
    }   
  }

  isDataChanged(newData: any, oldData: any): boolean {
    if (newData.length !== oldData.length) {
      return true;
    }
    
    oldData.sort((a:any, b:any) => a.ImpactAssessmentId - b.ImpactAssessmentId);
    newData.sort((a:any, b:any) => a.ImpactAssessmentId - b.ImpactAssessmentId);

    for (let i = 0; i < newData.length; i++) {
      const newItem = newData[i];
      const oldItem = oldData[i];
      if (newItem.LessThanTwoHours !== oldItem.LessThanTwoHours || newItem.TwoToFourHours !== oldItem.TwoToFourHours || newItem.FourToEightHours !== oldItem.FourToEightHours 
        || newItem.OneDay !== oldItem.OneDay || newItem.TwoDays !== oldItem.TwoDays || newItem.ThreeToFiveDays !== oldItem.ThreeToFiveDays || newItem.GreaterThanFiveDays !== oldItem.GreaterThanFiveDays) {
        return true; 
      }
    }
    return false;
  }
}
