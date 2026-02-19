import { DOCUMENT } from '@angular/common';
import { Component, Inject ,ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { MasterInherentLikelyhoodService } from 'src/app/services/master-data/master-inherent-likelyhood/master-inherent-likelyhood.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { MatSort } from '@angular/material/sort';

export interface TagDataModel {
  OverallRiskScoreID: any;
  ConfigField: string,
  ConfigDisplay: string;
  RowNumber: string;
  ConfigScoreAndRatingID?: number;
  IsOperator: boolean;
}

@Component({
  selector: 'app-inherent-likelyhood',
  templateUrl: './inherent-likelyhood.component.html',
  styleUrls: ['./inherent-likelyhood.component.scss']
})
export class InherentLikelyhoodComponent {

  displayedRiskCategoryColumns: string[] = ['RowNumber', 'Category', 'Action', 'Status'];
  displayedProcessRiskColumns: string[] = ['Index', 'Name', 'Action', 'Status'];

  dataSourceRiskCategory = new MatTableDataSource<any>();
  addRiskCategorydg: boolean = false;
  gridDataSourceRiskCategory: any;

  saveInherentLikelihoodRateerror: string = "";
  displayedInherentLikelihoodRateColumns: string[] = ['Index', 'RatingName', 'RatingScore', 'Action', 'Status'];
  dataSourceInherentLikelihoodRate = new MatTableDataSource<any>();
  addInherentLikelihoodRatedg: boolean = false;
  inherentLikelihoodRateForm = new FormGroup({
      txtInherentLikelihoodRate: new FormControl('', [Validators.required, Validators.minLength(2)]),
      txtInherentLikelihoodScore: new FormControl('', [Validators.required, Validators.minLength(1)]),
      txtInherentLikelihoodRateID: new FormControl(0)
  });

  GridFormsInherentLikelihoodRating!: FormGroup;
  gridDataSourceInherentLikelihoodRate: any;
  // @ts-ignore
  @ViewChild(MatSort) sortInherentLikelihoodRate: MatSort;
  saveInherentImpactRateerror: string = "";
  displayedInherentImpactRateColumns: string[] = ['Index', 'RatingName', 'RatingScore', 'Action', 'Status'];
  dataSourceInherentImpactRate = new MatTableDataSource<any>();
  addInherentImpactRatedg: boolean = false;
  gridDataSourceInherentImpactRate: any;
  inherentImpactRateForm = new FormGroup({
      txtInherentImpactRate: new FormControl('', [Validators.required, Validators.minLength(2)]),
      txtInherentImpactScore: new FormControl('', [Validators.required, Validators.minLength(1)]),
      txtInherentImpactRateID: new FormControl(0)
  });

  GridFormsInherentImpactRate!: FormGroup;
  // @ts-ignore
  @ViewChild(MatSort) sortInherentImpactRate: MatSort;

  exceedCharLenErr: any;
  duplicate:any
  type: any;

  iseditinherentRiskScoredg: boolean = false;
  txttag = new FormControl('');
  inherentRiskScoreTags: Array<TagDataModel> = [];
  sourcedata: Array<TagDataModel> = [];
  sourcedatainherentRiskScore: Array<TagDataModel> = [];
  sourcedatainherentRiskScoreoperator: Array<TagDataModel> = [];
  beforetags: Array<TagDataModel> = [];
  saveinherentRiskScoreerror: string = "";
  IsLastEnteredOperator: boolean = false;

  displayedInherentRiskRatingColumns: string[] = ['RowNumber', 'RatingdataName', 'Computation','ActionScore', 'Status'];
  dataSourceInherentRiskRating!: MatTableDataSource<any>;
  masterInherentRiskRatingForm = new FormGroup({
      txtratename: new FormControl('', [Validators.required, Validators.minLength(2)]),
      txtcolorcode: new FormControl('', [Validators.required, Validators.minLength(1)]),
      txtcolorname: new FormControl('', [Validators.required, Validators.minLength(1)]),
      txtrateid: new FormControl(0)
  });
  iseditInherentRiskRatingdg: boolean = false;
  isCustomTextEnabledInherentRiskRating: boolean = false;
  inherentRiskRatingTags: Array<TagDataModel> = [];
  sourcedataInherentRiskRating: Array<TagDataModel> = [];
  //sourcedataInherentRiskRatingScore: any;
  sourcedataInherentRiskRatingScore: Array<TagDataModel> = [];
  //sourcedatascore: Array<TagDataModel> = [];
  sourcedataInherentRiskRatingoperator: Array<TagDataModel> = [];
  beforeInherentRiskRatingTags: Array<TagDataModel> = [];
  overallInherentRiskID: number = 0;
  color: string = '';
  saveInherentRiskRatingerror: string = "";
  beforeEditedFormulatext: string = "";
  record:any
  alldataRisk:any
  currentRisk: string = '';
  allDataRate:any;

  constructor(
    public dialog: MatDialog,
    public service: MasterInherentLikelyhoodService,
    public authService: AuthService,
    public utils: UtilsService,
    private fb: FormBuilder,
    private _formBuilder: FormBuilder,
    @Inject(DOCUMENT) private _document: any,
    private router: Router) {
    if (this.utils.isSCUserNBCMUnitUser()) {
      this.authService.activeTab.next('master-data');
    } else {
      this.router.navigate(['/business-continuity-plan'])
    }
  }

  ngOnInit(): void {
    this.GridFormsInherentLikelihoodRating = this._formBuilder.group({
        GridRows: this._formBuilder.array([])
    });
    this.GridFormsInherentImpactRate = this._formBuilder.group({
        GridRows: this._formBuilder.array([])
    });
    this.getpageloaddata();
  }

  getpageloaddata(): void {
    this.service.getMasterInherentRiskScreen().subscribe(data => {
      if (data.success == 1) {
        this.processInherentLikelihoodRate(data);
        this.processInherentImpactRate(data);
        this.processInherentRiskScoreMasterData(data);
        this.processInherentRiskScore(data);
        this.processInherentRiskRatingMasterData(data);
        this.processInherentRiskRating(data);
      } else {
        if (data.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
      }
    });
  }

  processInherentLikelihoodRate(data: any): void {
    if (data.success == 1) {
      if (data.result.LikelihoodRatingData.length > 0) {
          let docs: any = this.gridDataSourceInherentLikelihoodRate = data.result.LikelihoodRatingData;
          if (docs) {
              let id = 0;
              docs.forEach((doc: any) => {
                  id++;
                  doc.RowNumber = id;
              });
              this.GridFormsInherentLikelihoodRating = this.fb.group({
                  GridRows: this.fb.array(docs.map((val: any) => this.fb.group({
                      Rating: new FormControl(val.NAME, [Validators.required]),
                      Score: new FormControl(val.Value, [Validators.required]),
                      InherentLikelihoodRatingID: new FormControl(val.ID),
                      IsActive: new FormControl(val.IsActive),
                      RowNumber: new FormControl(val.RowNumber),
                      action: new FormControl('existingRecord'),
                      isEditable: new FormControl(true),
                      isNewRow: new FormControl(false),
                  })
                  )) //end of fb array
              });
              console.log('this.GridFormsInherentLikelihoodRating: ', this.GridFormsInherentLikelihoodRating);

              this.dataSourceInherentLikelihoodRate = new MatTableDataSource((
              this.GridFormsInherentLikelihoodRating.get('GridRows') as FormArray).controls);
              this.dataSourceInherentLikelihoodRate.sort = this.sortInherentLikelihoodRate
          }
      }
    } else {
        if (data.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
    }
  }

  editInherentLikelihoodRateData(GridFormElement: any, i: number) {
      GridFormElement.get('GridRows').at(i).get('isEditable').patchValue(false);
  }

  saveEditInherentLikelihoodRateData(GridFormElement: any, i: any) {
    const rowvalue = (GridFormElement.get('GridRows').at(i).get('Rating')?.value).trim();
    let LikelihoodRatingData:any[] = []
    let filteredRecords = this.gridDataSourceInherentLikelihoodRate.filter((ob:any, inx:any) => inx != i);
    this.checkCharLengthDuplicate(rowvalue, 'NAME',filteredRecords,"Likelihood").then((allowToSave) => {
      if (allowToSave) {
          return;
      }
      GridFormElement.get('GridRows').at(i).get('isEditable').patchValue(true);
      LikelihoodRatingData.push({
        "Name"      : rowvalue,
        "Value"     : GridFormElement.get('GridRows').at(i).get('Score')?.value,
        "ID"        : GridFormElement.get('GridRows').at(i).get('InherentLikelihoodRatingID')?.value,
        "IsActive"  : 1
      })
      this.service.updateData(LikelihoodRatingData).subscribe(res => {
          next:
          if (res.success == 1) {
              this.cancelInherentLikelihoodRate();
              this.addInherentLikelihoodRatedg = false;
              this.saveSuccess(res.message);
          } else {
              if (res.error.errorCode == "TOKEN_EXPIRED")
                  this.utils.relogin(this._document);
              else
                  this.saveInherentLikelihoodRateerror = res.error.errorMessage;
              this.CancelInherentLikelihoodRate(GridFormElement, i);
          }
          error:
          console.log("err::", "error");
      });
    })
  }

// On click of cancel button in the table (after click on edit) this method will call and reset the previous data
  CancelInherentLikelihoodRate(GridFormElement: any, i: any) {
    let obj = this.gridDataSourceInherentLikelihoodRate.find((a: any) => a.ID == GridFormElement.get('GridRows').at(i).get('InherentLikelihoodRatingID')?.value)
    GridFormElement.get('GridRows').at(i).get('Rating').patchValue(obj?.NAME);
    GridFormElement.get('GridRows').at(i).get('Score').patchValue(obj?.Value);
    GridFormElement.get('GridRows').at(i).get('isEditable').patchValue(true);
    this.clearMessage();
  }

  initiatAddInherentLikelihoodRate(): void {
    this.addInherentLikelihoodRatedg = true;
  }

  cancelInherentLikelihoodRate(): void {
    this.inherentLikelihoodRateForm.reset();
    this.addInherentLikelihoodRatedg = false;
    this.saveInherentLikelihoodRateerror = "";
    this.clearMessage();
  }

  editInherentLikelihoodRate(row: any): void {
    this.resetInherentLikelihoodRate();
    this.setInherentLikelihoodRateValue(row);
    this.addInherentLikelihoodRatedg = true;
  }

  setInherentLikelihoodRateValue(data: any): void {
    this.inherentLikelihoodRateForm.patchValue({ txtInherentLikelihoodRate: data.Rating, txtInherentLikelihoodScore: data.Score, txtInherentLikelihoodRateID: data.InherentLikelihoodRatingID });
  }
  resetInherentLikelihoodRate(): void {
    this.inherentLikelihoodRateForm.reset();
  }

  changedInherentLikelihoodRate(data: any, event: any): void {
      let LikelihoodRatingData:any[] = []
      LikelihoodRatingData.push({
        "ID"        : data.value.InherentLikelihoodRatingID,
        "IsActive"  :  !data.get('IsActive')?.value,
        "Name"      : data.value.Rating,
        "Value"     : data.value.Score
    })

      this.service.updateStatus(LikelihoodRatingData).subscribe(res => {
          next:
          if (res.success == 1) {
              this.saveSuccess(res.message);
          } else {
              if (res.error.errorCode == "TOKEN_EXPIRED")
                  this.utils.relogin(this._document);
              else
                  this.saveInherentLikelihoodRateerror = res.error.errorMessage;
              event.source.checked = !event.source.checked;
          }
          error:
          console.log("err::", "error");
      });
  }

  saveInherentLikelihoodRate(): void {
    let LikelihoodRatingData:any[] = []

      if (this.inherentLikelihoodRateForm.get('txtInherentLikelihoodRateID')?.value == 0 || this.inherentLikelihoodRateForm.get('txtInherentLikelihoodRateID')?.value == null) {
          const rowvalue = (this.inherentLikelihoodRateForm.get('txtInherentLikelihoodRate')?.value)?.trim();
          // this.checkCharLength(rowvalue, 'InherentLikelihoodRating')
          this.checkCharLengthDuplicate(rowvalue, 'NAME',this.gridDataSourceInherentLikelihoodRate,"Likelihood").then((allowToSave) => {
              if (allowToSave) {
                  return;
              }
              // let data = {
              //     "rating": rowvalue,
              //     "score": this.inherentLikelihoodRateForm.get('txtInherentLikelihoodScore')?.value,
              //     "createdBy": "palani"
              // }
              LikelihoodRatingData.push({
                "Name"       : rowvalue,
                "Value"     : this.inherentLikelihoodRateForm.get('txtInherentLikelihoodScore')?.value,
                "ID"        : "",
                "IsActive"  : 1
            })

              this.service.addNew(LikelihoodRatingData).subscribe(res => {
                  next:
                  if (res.success == 1) {

                      this.cancelInherentLikelihoodRate();
                      this.addInherentLikelihoodRatedg = false;
                      this.saveSuccess(res.message);
                  } else {
                      if (res.error.errorCode == "TOKEN_EXPIRED")
                          this.utils.relogin(this._document);
                      else
                          this.saveInherentLikelihoodRateerror = res.error.errorMessage;
                  }
                  error:
                  console.log("err::", "error");
              });

          });
      }
      else {

          const rowvalue = (this.inherentLikelihoodRateForm.get('txtInherentLikelihoodRate')?.value)?.trim();
          this.checkCharLengthDuplicate(rowvalue, 'Rating',this.gridDataSourceInherentLikelihoodRate,"Likelihood").then((allowToSave) => {
              if (allowToSave) {
                  return;
              }
              let data = {
                  "rating"    : rowvalue,
                  "score"     : this.inherentLikelihoodRateForm.get('txtInherentLikelihoodScore')?.value,
                  "id"        : this.inherentLikelihoodRateForm.get('txtInherentLikelihoodRateID')?.value,
                  "createdBy" : "palani"
              }
              this.service.updateData(data).subscribe(res => {
                  next:
                  if (res.success == 1) {

                      this.cancelInherentLikelihoodRate();
                      this.addInherentLikelihoodRatedg = false;
                      this.saveSuccess(res.message);
                  } else {
                      if (res.error.errorCode == "TOKEN_EXPIRED")
                          this.utils.relogin(this._document);
                      else
                          this.saveInherentLikelihoodRateerror = res.error.errorMessage;
                  }
                  error:
                  console.log("err::", "error");
              });
          })
      }
  }

  clearMessage() {
    this.exceedCharLenErr = '';
    this.type = '';
  }

   async checkDuplicateRiskRating(data: any, type: string,allData:any,from:any): Promise<boolean> {
    console.log('type: ', type);
    console.log('data: ', data);
    console.log('allData: ', allData);
    let duplicateFound :any

    if(allData?.length){
    this.duplicate = Object?.values(allData)?.filter((ele: any) => ele.RiskRating != this.currentRisk)
    console.log('this.duplicate: ', this.duplicate);

    if(this.currentRisk != '') {
      duplicateFound =  Object?.values(allData)?.filter((ele: any) => ele.RiskRating != this.currentRisk).some((ele: any) => ele[type]?.trim().toLowerCase() == data.trim().toLowerCase());
    } else {
      duplicateFound = Object?.values(allData)?.some((ele: any) => ele[type]?.trim().toLowerCase() == data.trim().toLowerCase());
    }
    if (data.length > 500) {
        this.exceedCharLenErr = 'Length should not exceeds more than 500 characters';
        this.type = type;
        return true;
    } else if (duplicateFound) {
        this.exceedCharLenErr = 'Record already exists';
        this.record = from
        this.type = type;
        return this.duplicate ?  this.exceedCharLenErr : false
    } else {
        this.clearMessage();
        return false;
    }
  }else{
    return false
  }
  }
  async checkCharLengthDuplicate(data: any, type: string,allData:any,from:any): Promise<boolean> {
    console.log('type: ', type);
    console.log('data: ', data);
    console.log('allData: ', allData);
    this.duplicate = Object?.values(allData)
    ?.filter((ele: any) => !ele.isEditable)
    .some((ele: any) => ele[type]?.trim().toLowerCase() == data.trim().toLowerCase());
    console.log('this.duplicate: ', this.duplicate);

    if (data.length > 500) {
        this.exceedCharLenErr = 'Length should not exceeds more than 500 characters';
        this.type = type;
        return true;
    } else if (this.duplicate) {
        this.exceedCharLenErr = 'Record already exists';
        this.record = from
        this.type = type;
        return this.duplicate ?  this.exceedCharLenErr : false
    } else {
        this.clearMessage();
        return false;
    }
  }

  async checkCharLengthDuplicateImpact(data: any, type: string,allData:any,from:any): Promise<boolean> {
    if(allData?.length){
    this.duplicate = Object?.values(this.allDataRate)
    .some((ele: any) => ele.NAME?.trim().toLowerCase() == data.trim().toLowerCase());
    if (data.length > 500) {
        this.exceedCharLenErr = 'Length should not exceeds more than 500 characters';
        this.type = type;
        return true;
    } else if (this.duplicate) {
        this.exceedCharLenErr = 'Record already exists';
        this.record = from
        this.type = type;
        return this.duplicate ?  this.exceedCharLenErr : false
    } else {
        this.clearMessage();
        return false;
    }
  }else{
    return false
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

    confirm.afterOpened().subscribe(result => {
        setTimeout(() => {
            confirm.close();
            this.saveInherentLikelihoodRateerror = this.saveInherentImpactRateerror = "";
            this.getpageloaddata();
            this.currentRisk= ''
        }, timeout)
    });
  }
  keyPressNumber(event: any) {
    const pattern = /[0-9\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
        event.preventDefault();
    }
  }

  processInherentImpactRate(data: any): void {
    if (data.success == 1) {
        if (data.result.ImpactRatingData.length > 0) {
            let docs: any = this.gridDataSourceInherentImpactRate = data.result.ImpactRatingData;
            if (docs) {
                let id = 0;
                docs.forEach((doc: any) => {
                    id++;
                    doc.RowNumber = id;
                });
                this.GridFormsInherentImpactRate = this.fb.group({
                    GridRows: this.fb.array(docs.map((val: any) => this.fb.group({
                        Rating: new FormControl(val.NAME, [Validators.required]),
                        Score: new FormControl(val.Value, [Validators.required]),
                        InherentImpactRatingID: new FormControl(val.ID),
                        IsActive: new FormControl(val.IsActive),
                        RowNumber: new FormControl(val.RowNumber),
                        action: new FormControl('existingRecord'),
                        isEditable: new FormControl(true),
                        isNewRow: new FormControl(false),
                    })
                    )) //end of fb array
                }); // end of form group cretation
                this.dataSourceInherentImpactRate = new MatTableDataSource((
                    this.GridFormsInherentImpactRate.get('GridRows') as FormArray).controls);
                this.dataSourceInherentImpactRate.sort = this.sortInherentImpactRate
            }
        }
    } else {
        if (data.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
    }
  }

  editInherentImpactRateData(GridFormElement: any, i: number) {
    console.log('i: ', i);
    this.allDataRate = this.gridDataSourceInherentImpactRate.filter((ele:any, index:any) => index != i)
    console.log('allDataRate: ', this.allDataRate);
    this.currentRisk = GridFormElement.get('GridRows').at(i).Rating
    console.log('GridFormElement.get( ', GridFormElement.value.GridRows);
    console.log('GridFormElement: ', GridFormElement);
    GridFormElement.get('GridRows').at(i).get('isEditable').patchValue(false);
  }

  // On click of correct button in table (after click on edit) this method will call
  saveEditInherentImpactRateData(GridFormElement: any, i: any) {
    let ImpactRatingData:any[] = []
    const rowvalue = (GridFormElement.get('GridRows').at(i).get('Rating')?.value)?.trim();
    this.checkCharLengthDuplicateImpact(rowvalue, 'NAME',this.allDataRate ,"ImpactRating").then((allowToSave) => {
      if (allowToSave) {
          return;
      }
    // this.checkCharLength(rowvalue, 'InherentImpactRating').then((allowToSave) => {
    //     if (allowToSave) {
    //         return;
    //     }
        GridFormElement.get('GridRows').at(i).get('isEditable').patchValue(true);
        // let data = {
        //     "rating"    : rowvalue,
        //     "score"     : GridFormElement.get('GridRows').at(i).get('Score')?.value,
        //     "id"        : GridFormElement.get('GridRows').at(i).get('InherentImpactRatingID')?.value,
        //     "createdBy" : "palani"
        // }

        ImpactRatingData.push({
          "Name"       : rowvalue,
          "Value"     : GridFormElement.get('GridRows').at(i).get('Score')?.value,
          "ID"        : GridFormElement.get('GridRows').at(i).get('InherentImpactRatingID')?.value,
          "IsActive"  : 1
      })
        this.service.updateDatainherentimpact(ImpactRatingData).subscribe(res => {
            next:
            if (res.success == 1) {

                this.cancelInherentImpactRate();
                this.addInherentImpactRatedg = false;
                this.saveSuccess(res.message);
            } else {
                if (res.error.errorCode == "TOKEN_EXPIRED")
                    this.utils.relogin(this._document);
                else
                    this.saveInherentImpactRateerror = res.error.errorMessage;
                this.CancelInherentImpactRate(GridFormElement, i);
            }
            error:
            console.log("err::", "error");
        });
    })
  }

  // On click of cancel button in the table (after click on edit) this method will call and reset the previous data
  CancelInherentImpactRate(GridFormElement: any, i: any) {
    let obj = this.gridDataSourceInherentImpactRate.find((a: any) => a.ID == GridFormElement.get('GridRows').at(i).get('InherentImpactRatingID')?.value)
    GridFormElement.get('GridRows').at(i).get('Rating').patchValue(obj?.NAME);
    GridFormElement.get('GridRows').at(i).get('Score').patchValue(obj?.Value);
    GridFormElement.get('GridRows').at(i).get('isEditable').patchValue(true);
    this.clearMessage();
  }

  initiatAddInherentImpactRate(): void {
    this.addInherentImpactRatedg = true;
  }

  cancelInherentImpactRate(): void {
    this.resetIngerentImpactRate();
    this.addInherentImpactRatedg = false;
    this.saveInherentImpactRateerror = "";
    this.clearMessage();
  }

  resetIngerentImpactRate(): void {
    this.inherentImpactRateForm.reset();
  }

  editInherentImpactRate(row: any): void {
    this.resetIngerentImpactRate();
    this.setInherentImpactRateValue(row);
    this.addInherentImpactRatedg = true;
  }

  setInherentImpactRateValue(data: any): void {
    this.inherentImpactRateForm.patchValue({ txtInherentImpactRate: data.Rating, txtInherentImpactScore: data.Score, txtInherentImpactRateID: data.InherentImpactRatingID });
  }

  changedInherentImpactRate(data: any, event: any): void {
    let ImpactRatingData:any[] = []
    ImpactRatingData.push({
      "Name"       : data.value?.Rating,
      "Value"     : data.value?.Score,
      "ID"        : data.value?.InherentImpactRatingID,
      "IsActive"  : !data.get('IsActive')?.value
  })

    this.service.updateStatusinherentimpact(ImpactRatingData).subscribe(res => {
        next:
        if (res.success == 1) {
            this.saveSuccess(res.message);
        } else {
            if (res.error.errorCode == "TOKEN_EXPIRED")
                this.utils.relogin(this._document);
            else
                this.saveInherentImpactRateerror = res.error.errorMessage;
            event.source.checked = !event.source.checked;
        }
        error:
        console.log("err::", "error");
    });
  }

  saveInherentImpactRate(): void {
    let ImpactRatingData:any[] = []
    if (this.inherentImpactRateForm.get('txtInherentImpactRateID')?.value == 0 || this.inherentImpactRateForm.get('txtInherentImpactRateID')?.value == null) {
        const rowvalue = (this.inherentImpactRateForm.get('txtInherentImpactRate')?.value)?.trim();

        this.checkCharLengthDuplicate(rowvalue, 'NAME',this.gridDataSourceInherentImpactRate,"ImpactRating").then((allowToSave) => {
            if (allowToSave) {
                return;
            }
            // let data = {
            //     "rating": rowvalue,
            //     "score": this.inherentImpactRateForm.get('txtInherentImpactScore')?.value,
            //     "createdBy": "palani"
            // }
            ImpactRatingData.push({
              "Name"       : rowvalue,
              "Value"     : this.inherentImpactRateForm.get('txtInherentImpactScore')?.value,
              "ID"        : "",
              "IsActive"  : 1
          })

            this.service.addNewinherentimpact(ImpactRatingData).subscribe(res => {
                next:
                if (res.success == 1) {

                    this.cancelInherentImpactRate();
                    this.addInherentImpactRatedg = false;
                    this.saveSuccess(res.message);
                } else {
                    if (res.error.errorCode == "TOKEN_EXPIRED")
                        this.utils.relogin(this._document);
                    else
                        this.saveInherentImpactRateerror = res.error.errorMessage;
                }
                error:
                console.log("err::", "error");
            });
        })
    }
    else {
      let ImpactRatingData:any[] = []
        const rowvalue = (this.inherentImpactRateForm.get('txtInherentImpactRate')?.value)?.trim();
        this.checkCharLengthDuplicate(rowvalue, 'NAME',this.gridDataSourceInherentImpactRate,"ImpactRating").then((allowToSave) => {
            if (allowToSave) {
                return;
            }

            // let data = {
            //     "rating"    : (this.inherentImpactRateForm.get('txtInherentImpactRate')?.value)?.trim(),
            //     "score"     : this.inherentImpactRateForm.get('txtInherentImpactScore')?.value,
            //     "id"        : this.inherentImpactRateForm.get('txtInherentImpactRateID')?.value,
            //     "createdBy" : "palani"
            // }

            ImpactRatingData.push({
              "Name"       : (this.inherentImpactRateForm.get('txtInherentImpactRate')?.value)?.trim(),
              "Value"     : this.inherentImpactRateForm.get('txtInherentImpactScore')?.value,
              "ID"        : this.inherentImpactRateForm.get('txtInherentImpactRateID')?.value,
              "IsActive"  : 1
          })

            this.service.updateDatainherentimpact(ImpactRatingData).subscribe(res => {
                next:
                if (res.success == 1) {

                    this.cancelInherentImpactRate();
                    this.addInherentImpactRatedg = false;
                    this.saveSuccess(res.message);
                } else {
                    if (res.error.errorCode == "TOKEN_EXPIRED")
                        this.utils.relogin(this._document);
                    else
                        this.saveInherentImpactRateerror = res.error.errorMessage;
                }
                error:
                console.log("err::", "error");
            });
        })

    }

  }
  async checkCharLength(data: any, type: string): Promise<boolean> {
    if (data.length > 500) {
        this.exceedCharLenErr = 'Length should not exceeds more than 500 characters';
        this.type = type;
        return true;
    } else {
        this.clearMessage();
        return false;
    }
  }


  processInherentRiskScoreMasterData(data: any): void {
    if (data.success == 1) {
        if (data.result.ConfigRiskScores.length > 0) {
            let docs: Array<TagDataModel> = data.result.ConfigRiskScores
            let id = 0;
            if (data.result.ConfigRiskScores.length > 0) {
                let docs: Array<TagDataModel> = data.result.ConfigRiskScores
                if (docs) {
                    this.sourcedata = docs;
                    id = 0;
                    this.sourcedatainherentRiskScore = [];
                    let falseFilterData = docs.filter((s: any) => s.IsOperator === false);
                    if (falseFilterData != null && falseFilterData.length > 0) {
                        docs.filter((s: any) => s.IsOperator === false).forEach((doc: any) => {
                            id++;
                            doc.RowNumber = id.toString();
                            this.sourcedatainherentRiskScore.push(doc);
                        });
                    }
                    id = 0;
                    this.sourcedatainherentRiskScoreoperator = [];
                    let trueFilterData = docs.filter((s: any) => s.IsOperator === true);
                    if (trueFilterData != null && trueFilterData.length > 0) {
                        docs.filter((s: any) => s.IsOperator === true).forEach((doc: any) => {
                            id++;
                            doc.RowNumber = id.toString();
                            this.sourcedatainherentRiskScoreoperator.push(doc);
                        });
                    }

                }
            }
            //this.getInherentRiskScoredata();
        }

    }
    else {
        if (data.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
    }
  }

  processInherentRiskScore(data: any): void {
    if (data.success == 1) {
        if (data.result.ComputeRiskFormula.length > 0) {
            let docs = data.result.ComputeRiskFormula[0].ComputationCode.split(',');
            this.inherentRiskScoreTags = [];
            let lineitem: any;
            if (docs) {
                let id = 0;
                docs.forEach((doc: any) => {
                    id++;
                    lineitem = { ...this.sourcedata.find(value => value.ConfigScoreAndRatingID?.toString() == doc) };
                    lineitem.RowNumber = id.toString();
                    this.inherentRiskScoreTags.push(lineitem); });
            }

        }
    } else {
        if (data.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
    }
  }

  addInherentRiskScoretagitem(data: TagDataModel): void {
    if (this.iseditinherentRiskScoredg) {
        data.RowNumber = (this.inherentRiskScoreTags.length + 1).toString();
        this.inherentRiskScoreTags.push(data);
    }
  }

  editInherentRiskScoreinitiate(): void {
    this.beforetags = { ...this.inherentRiskScoreTags };
    this.iseditinherentRiskScoredg = true;
  }

  CancelInherentRiskScore() {
    this.inherentRiskScoreTags = Object.assign(new Array<TagDataModel>, this.beforetags);
    this.iseditinherentRiskScoredg = false;
    this.saveinherentRiskScoreerror = "";
  }

  RemoveInherentRiskScoreData(data: TagDataModel): void {
    let n: number = 0;
    let tempdata: Array<TagDataModel> = [];
    this.inherentRiskScoreTags.forEach((doc: any) => {
        if (doc.RowNumber != data.RowNumber) {
            n += 1;
            doc.RowNumber = n.toString();
            tempdata.push(doc);
        }

    });
    this.inherentRiskScoreTags = tempdata;
  }

  saveInherentRiskScoreData(): void {
    // const rowvalue = formValue.get('GridRows').at(index).get('ControlVerificationClosure')?.value;
    // this.checkCharLength(rowvalue, 'ConfirmationVerificationClosure').then((allowToSave) => {
    //     if (allowToSave) {
    //         return;
    //     }


    // })
    let computation: string = "";
    let computationCode: string = "";
    let OverallRiskScore:any[] = [];
    this.inherentRiskScoreTags.forEach((item: any) => {
        if (item.ConfigField === "Custom Value") {
            computationCode += (computationCode == "" ? "" : ",") + item.ConfigScoreAndRatingID + "-" + item.ConfigField;
            computation += " '" + item.Description + "'";
        }
        else {
            computationCode += (computationCode == "" ? "" : ",") + item.ConfigScoreAndRatingID;
            computation += " " + item.ConfigField;
        }
    });

    OverallRiskScore.push( {
                    "OverallRiskScoreID": "",
                    "Computation": computation,
                    "ComputationCode": computationCode,
                    "IsActive": 1
                })


    this.service.addNewoverallinherentriskscore(OverallRiskScore).subscribe(res => {
        next:
        if (res.success == 1) {
            this.CancelInherentRiskScore();
            // this.getInherentRiskScoredata();
            this.saveSuccess(res.message);
        } else {
            if (res.error.errorCode == "TOKEN_EXPIRED")
                this.utils.relogin(this._document);
            else
                this.saveinherentRiskScoreerror = res.error.errorMessage;
        }
        error:
        console.log("err::", "error");
    });
  }

  processInherentRiskRatingMasterData(data: any): void {
    if (data.success == 1) {
       let id = 0;
        if (data.result.ConfigRiskRatingScores.length > 0) {
            let docs: Array<TagDataModel> = data.result.ConfigRiskRatingScores
            if (docs) {
                this.sourcedataInherentRiskRating = docs;
                id = 0;
                this.sourcedataInherentRiskRatingScore = [];
                let filterData = docs.filter((s: any) => s.IsOperator === false);
                if (filterData != null && filterData.length > 0) {
                    docs.filter((s: any) => s.IsOperator === false).forEach((doc: any) => {
                        id++;
                        doc.RowNumber = id.toString();
                        this.sourcedataInherentRiskRatingScore.push(doc);
                    });
                }
                id = 0;
                this.sourcedataInherentRiskRatingoperator = [];
                let falseFilterData = docs.filter((s: any) => s.IsOperator === true);
                if (falseFilterData != null && falseFilterData.length > 0) {
                    docs.filter((s: any) => s.IsOperator === true).forEach((doc: any) => {
                        id++;
                        doc.RowNumber = id.toString();
                        this.sourcedataInherentRiskRatingoperator.push(doc);
                    });
                }
            }
        }
    }
    else {
        if (data.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
    }
  }

  processInherentRiskRating(data: any): void {
    if (data.success == 1) {
        if (data.result.ComputeRiskRatingFormula?.length > 0) {
          this.alldataRisk = data.result.ComputeRiskRatingFormula
            let lineitem: any;
            if (data.result.ComputeRiskRatingFormula) {
                let id = 0;
                let customText: string;
                let temptext: string;
                let computationarray;
                let docs: Array<any> = data.result.ComputeRiskRatingFormula;
                docs.forEach((doc: any) => {
                    id++;
                    //lineitem = {...this.sourcedata.find(value => value.Id?.toString() == doc)};
                    doc.RowNumber = id.toString();
                    computationarray = doc.ComputationCode?.split(',');
                    customText = '';
                    computationarray?.forEach((item: any) => {
                        temptext = item.split('-');
                        if (temptext.length > 1) {

                            lineitem = { ...this.sourcedataInherentRiskRating.find(value => value.ConfigScoreAndRatingID?.toString() == temptext[0]) };
                            customText += " '" + temptext[1] + "'";
                        }
                        else {
                            lineitem = { ...this.sourcedataInherentRiskRating.find(value => value.ConfigScoreAndRatingID?.toString() == item) };
                            customText += " " + lineitem.ConfigDisplay;
                        }
                    });
                    doc['isEditable'] = true;
                    doc.Computationtext = customText;
                });
                this.dataSourceInherentRiskRating = new MatTableDataSource(docs);
            }
        }
    } else {
        if (data.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
    }
  }
  editInherentRiskRating(data: any): void {

    this.currentRisk = data.RiskRating
    console.log('data: edit', data);
    data['isEditable'] = false
    this.iseditInherentRiskRatingdg = true;
    this.inherentRiskRatingTags = [];
    this.overallInherentRiskID = data.OverallInherentRiskRatingID;
    let computationarray = data.ComputationCode?.split(',');
    let lineitem: any;
    let id = 0;
    this.beforeEditedFormulatext = data.Computationtext;
    computationarray?.forEach((item: any) => {
        id += 1;
        let temptext = item.split('-');
        if (temptext.length > 1) {

            lineitem = { ...this.sourcedataInherentRiskRating.find(value => value.ConfigScoreAndRatingID?.toString() == temptext[0]) };
            lineitem.ConfigDisplay = temptext[1];
        }
        else {
            lineitem = { ...this.sourcedataInherentRiskRating.find(value => value.ConfigScoreAndRatingID?.toString() == item) };
        }
        lineitem.RowNumber = id;
        this.inherentRiskRatingTags.push(lineitem);
    });
    this.color = data.ColorCode;
    this.masterInherentRiskRatingForm.patchValue({ txtrateid: data.OverallRiskRatingID,txtratename: data.RiskRating });
  }

  addInherentRiskRatingtagitem(data: any): void {

    if (this.iseditInherentRiskRatingdg) {
        data.RowNumber = (this.inherentRiskRatingTags.length + 1).toString();
      if (data.ConfigField != "Custom") {
          this.inherentRiskRatingTags.push(data);
      }
      else {
          this.isCustomTextEnabledInherentRiskRating = !this.isCustomTextEnabledInherentRiskRating;
      }
    }
  }

  addCustomTextInherentRiskRating(data: any) {
    console.log('data: ', data);
    let lineitem: any = { ...this.sourcedataInherentRiskRating.find(value => value.ConfigField === "Custom") };
    console.log('lineitem: ', lineitem);
    lineitem.ConfigDisplay = data;
    this.inherentRiskRatingTags.push(lineitem);
    console.log('this.inherentRiskRatingTags: ', this.inherentRiskRatingTags);
    this.isCustomTextEnabledInherentRiskRating = false;
  }
  initiateInherentRiskRatingAdd(): void {
    this.inherentRiskRatingTags = [];
    this.iseditInherentRiskRatingdg = true;
    this.masterInherentRiskRatingForm.reset();
    this.overallInherentRiskID = 0;
    this.beforeEditedFormulatext = "";
    this.isCustomTextEnabledInherentRiskRating = false;

  }
  editInherentRiskRatinginitiate(): void {
    this.beforeInherentRiskRatingTags = { ...this.inherentRiskRatingTags };
    this.iseditInherentRiskRatingdg = true;
  }

  CancelInherentRiskRating() {
    this.inherentRiskRatingTags = Object.assign(new Array<TagDataModel>, this.beforeInherentRiskRatingTags);
    this.iseditInherentRiskRatingdg = false;
    this.saveInherentRiskRatingerror = "";
    this.clearMessage();
  }

  RemoveInherentRiskRatingData(data: TagDataModel): void {
    let n: number = 0;
    let tempdata: Array<TagDataModel> = [];
    this.inherentRiskRatingTags.forEach((doc: any) => {
        if (doc.RowNumber != data.RowNumber) {
            n += 1;
            doc.RowNumber = n.toString();
            tempdata.push(doc);
        }

    });
    this.inherentRiskRatingTags = tempdata;
  }
  CancelCustomtext(){
    this.isCustomTextEnabledInherentRiskRating = false;
  }

  colorchangedInherentRiskRating(): void {
    this.masterInherentRiskRatingForm.patchValue({ txtcolorcode: this.color });
  }
  saveInherentRiskRatingData(): void {
    let computation: string = "";
    let computationCode: string = "";
    this.inherentRiskRatingTags.forEach((item: any) => {
      console.log('item: ', item);
        if (item.ConfigField === "Custom") {
            computationCode += (computationCode == "" ? "" : ",") + item.ConfigScoreAndRatingID + "-" + item.ConfigDisplay;
            computation += " '" + item.ConfigDisplay + "'";
        }
        else {
            computationCode += (computationCode == "" ? "" : ",") + item.ConfigScoreAndRatingID;
            computation += " " + item.ConfigField;
        }
    });
    let RiskRatingData:any[] = []
      const rowvalue = (this.masterInherentRiskRatingForm.get('txtratename')?.value)?.trim();
      this.checkDuplicateRiskRating(rowvalue, 'RiskRating',this.alldataRisk,"riskRating").then((allowToSave) => {
        if (allowToSave) {
            return;
        }
        RiskRatingData.push({
            "OverallRiskRatingID": this.masterInherentRiskRatingForm.get('txtrateid')?.value ? this.masterInherentRiskRatingForm.get('txtrateid')?.value : "",
            "RiskRating": rowvalue,
            "Computation": computation,
            "ComputationCode": computationCode,
            "IsActive": 1
        })
        this.service.addNewoverallinherentriskrating(RiskRatingData).subscribe(res => {
            next:
            if (res.success == 1) {

                this.CancelInherentRiskRating();
                this.iseditInherentRiskRatingdg = false;
                this.saveSuccess(res.message);
            } else {
                if (res.error.errorCode == "TOKEN_EXPIRED")
                    this.utils.relogin(this._document);
                else
                    this.saveInherentRiskRatingerror = res.error.errorMessage;
            }
            error:
            console.log("err::", "error");
        });
      })
  }

  changedInherentRiskRating(data: any, event: any): void {
    let RiskRatingData:any[] = []
    RiskRatingData.push({
      "OverallRiskRatingID": data.OverallRiskRatingID,
      "RiskRating": data.RiskRating,
      "Computation": data.Computation,
      "ComputationCode": data.ComputationCode,
      "IsActive": !data.IsActive
    })
    this.service.updateStatusoverallinherentriskrating(RiskRatingData).subscribe(res => {
        next:
        if (res.success == 1) {
            this.saveSuccess(res.message);
        } else {
            if (res.error.errorCode == "TOKEN_EXPIRED")
                this.utils.relogin(this._document);
            else
                this.saveInherentRiskRatingerror = res.error.errorMessage;
            event.source.checked = !event.source.checked;
        }
        error:
        console.log("err::", "error");
    });
  }

}


