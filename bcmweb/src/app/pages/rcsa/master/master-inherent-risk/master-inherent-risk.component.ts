import { LiveAnnouncer } from '@angular/cdk/a11y';
import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { ConfigScoreRatingService } from 'src/app/services/rcsa/master/common/config-score-rating.service';
import { InherentImpactRateService } from 'src/app/services/rcsa/master/inherent-risk/inherent-impact-rate.service';
import { InherentLikelihoodRankService } from 'src/app/services/rcsa/master/inherent-risk/inherent-likelihood-rate.service';
import { OverAllInherentRiskRatingService } from 'src/app/services/rcsa/master/inherent-risk/over-all-inherent-risk-rating.service';
import { OverAllInherentRiskScoreService } from 'src/app/services/rcsa/master/inherent-risk/over-all-inherent-risk-score.service';
import { ProcessService } from 'src/app/services/rcsa/master/inherent-risk/process.service';
import { RiskCategoryService } from 'src/app/services/rcsa/master/inherent-risk/risk-category.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { environment } from 'src/environments/environment';

export interface TagDataModel {
    ConfigField: string,
    ConfigDisplay: string;
    RowNumber: string;
    ConfigScoreAndRatingID?: number;
    IsOperator: boolean;
}
@Component({
    selector: 'app-master-inherent-risk',
    templateUrl: './master-inherent-risk.component.html',
    styleUrls: ['./master-inherent-risk.component.scss']
})
export class MasterInherentRiskComponent implements OnInit {

    displayedRiskCategoryColumns: string[] = ['RowNumber', 'Category', 'Action', 'Status'];
    dataSourceRiskCategory = new MatTableDataSource<any>();
    addRiskCategorydg: boolean = false;
    gridDataSourceRiskCategory: any;
    riskCategoryForm = new FormGroup({
        txtRiskCategoryName: new FormControl('', [Validators.required, Validators.minLength(2)]),
        txtRiskCategoryID: new FormControl(0)
    });

    displayedProcessRiskColumns: string[] = ['Index', 'Name', 'Action', 'Status'];
    dataSourceProcessRisk = new MatTableDataSource<any>();
    addProcessRiskdg: boolean = false;
    processRiskForm = new FormGroup({
        txtratename: new FormControl('', [Validators.required, Validators.minLength(2)]),
        txtrateid: new FormControl(0)
    });
    gridDataSourceProcessRisk: any;
    GridFormsProcessRisk!: FormGroup;

    RiskCategoryGridForms!: FormGroup;
    isEditableNew: boolean = true;
    saveRiskCategoryerror: String = "";
    saveProcessRiskerror: string = "";
    showText: number = 1;
    exceedCharLenErr: any;
    duplicate:any
    type: any;
    // @ts-ignore
    @ViewChild(MatSort) sort: MatSort;

    constructor(
        private _liveAnnouncer: LiveAnnouncer,
        private configScoreRatingService: ConfigScoreRatingService,
        private riskCategoryService: RiskCategoryService,
        private processService: ProcessService,
        private inherentLikelihoodRankService: InherentLikelihoodRankService,
        private inherentImpactRateService: InherentImpactRateService,
        private overAllInherentRiskScoreService: OverAllInherentRiskScoreService,
        private overAllInherentRiskRatingService: OverAllInherentRiskRatingService,
        private configService: ConfigScoreRatingService,
        public utils: UtilsService,
        public dialog: MatDialog,
        private fb: FormBuilder,
        private _formBuilder: FormBuilder,
        @Inject(DOCUMENT) private _document: any
    ) {

    }

    ngAfterViewInit() {

    }
    ngOnInit(): void {

        this.RiskCategoryGridForms = this._formBuilder.group({
            GridRows: this._formBuilder.array([])
        });

        this.GridFormsProcessRisk = this._formBuilder.group({
            GridRows: this._formBuilder.array([])
        });

        this.GridFormsInherentLikelihoodRating = this._formBuilder.group({
            GridRows: this._formBuilder.array([])
        });

        this.GridFormsInherentImpactRate = this._formBuilder.group({
            GridRows: this._formBuilder.array([])
        });
        this.getpageloaddata();
    }

    getpageloaddata(): void {

        if (environment.dummyData) {
            let data = {
                "success": 1,
                "message": "Data fetch from DB successful.",
                "result": {
                    "recordset": {
                        "RiskCategory": [
                            {
                                "Category": "Rate Name1",
                                "IsActive": false,
                                "RiskCategoryID": 1

                            },
                            {
                                "Category": "Rate Name2",
                                "IsActive": true,
                                "RiskCategoryID": 2
                            }
                        ],
                        "Process": [
                            {
                                "Name": "Low Risk",
                                "IsActive": "1",
                                "ProcessID": 1
                            },
                            {
                                "Name": "Moderate Risk",
                                "IsActive": "0",
                                "ProcessID": 2
                            },
                            {
                                "Name": "High Risk",
                                "IsActive": "0",
                                "ProcessID": 3
                            }
                        ],
                        "InherentLikelihoodRating": [
                            {
                                "Rating": "Rare",
                                "Score": 1,
                                "IsActive": false,
                                "InherentLikelihoodRatingID": 1
                            },
                            {
                                "Rating": "Rate2",
                                "Score": 2,
                                "IsActive": true,
                                "InherentLikelihoodRatingID": 2
                            }
                        ],
                        "InherentImpactRating": [
                            {
                                "Rating": "Rate",
                                "Score": 1,
                                "IsActive": false,
                                "InherentImpactRatingID": 1
                            },
                            {
                                "Rating": "Rate2",
                                "Score": 2,
                                "IsActive": true,
                                "InherentImpactRatingID": 2
                            }
                        ],
                        "InherentRiskScoreConfig": [
                            {
                                "ConfigScoreAndRatingID": 1,
                                "ConfigField": "+",
                                "ConfigDisplay": "+",
                                "IsOperator": true,
                                "ConfigScoreAndRatingScreenMappingID": 1,
                                "ConfigScreen": "ControlTotalScore"
                            },
                            {
                                "ConfigScoreAndRatingID": 2,
                                "ConfigField": "-",
                                "ConfigDisplay": "-",
                                "IsOperator": true,
                                "ConfigScoreAndRatingScreenMappingID": 2,
                                "ConfigScreen": "ControlTotalScore"
                            },
                            {
                                "ConfigScoreAndRatingID": 3,
                                "ConfigField": "*",
                                "ConfigDisplay": "*",
                                "IsOperator": true,
                                "ConfigScoreAndRatingScreenMappingID": 3,
                                "ConfigScreen": "ControlTotalScore"
                            },
                            {
                                "ConfigScoreAndRatingID": 4,
                                "ConfigField": "/",
                                "ConfigDisplay": "/",
                                "IsOperator": true,
                                "ConfigScoreAndRatingScreenMappingID": 4,
                                "ConfigScreen": "ControlTotalScore"
                            },
                            {
                                "ConfigScoreAndRatingID": 5,
                                "ConfigField": "InherentImpactRatingID",
                                "ConfigDisplay": "InherentImpactRatingID",
                                "IsOperator": false,
                                "ConfigScoreAndRatingScreenMappingID": 5,
                                "ConfigScreen": "ControlTotalScore"
                            },
                            {
                                "ConfigScoreAndRatingID": 6,
                                "ConfigField": ")",
                                "ConfigDisplay": ")",
                                "IsOperator": true,
                                "ConfigScoreAndRatingScreenMappingID": 6,
                                "ConfigScreen": "ControlTotalScore"
                            }
                        ],
                        "OverallInherentRiskScore": [
                            {
                                "OverallInherentRiskScoreID": 1,
                                "Computation": "InherentImpactRatingID + (InherentLikelihoodRatingID)",
                                "ComputationCode": "1",
                                "IsActive": true,
                                "IsDeleted": false,
                                "CreatedDate": "2022-11-26T22:08:26.090Z",
                                "CreatedBy": "vamshi",
                                "LastUpdatedDate": "2022-11-26T22:08:26.090Z",
                                "LastUpdatedBy": null
                            }
                        ],
                        "InherentRiskRatingConfig": [
                            {
                                "ConfigScoreAndRatingID": 1,
                                "ConfigField": "+",
                                "ConfigDisplay": "+",
                                "IsOperator": true,
                                "ConfigScoreAndRatingScreenMappingID": 1,
                                "ConfigScreen": "ControlTotalScore"
                            },
                            {
                                "ConfigScoreAndRatingID": 2,
                                "ConfigField": "-",
                                "ConfigDisplay": "-",
                                "IsOperator": true,
                                "ConfigScoreAndRatingScreenMappingID": 2,
                                "ConfigScreen": "ControlTotalScore"
                            },
                            {
                                "ConfigScoreAndRatingID": 3,
                                "ConfigField": "*",
                                "ConfigDisplay": "*",
                                "IsOperator": true,
                                "ConfigScoreAndRatingScreenMappingID": 3,
                                "ConfigScreen": "ControlTotalScore"
                            },
                            {
                                "ConfigScoreAndRatingID": 4,
                                "ConfigField": "/",
                                "ConfigDisplay": "/",
                                "IsOperator": true,
                                "ConfigScoreAndRatingScreenMappingID": 4,
                                "ConfigScreen": "ControlTotalScore"
                            },
                            {
                                "ConfigScoreAndRatingID": 5,
                                "ConfigField": "(",
                                "ConfigDisplay": "(",
                                "IsOperator": true,
                                "ConfigScoreAndRatingScreenMappingID": 5,
                                "ConfigScreen": "ControlTotalScore"
                            },
                            {
                                "ConfigScoreAndRatingID": 6,
                                "ConfigField": ")",
                                "ConfigDisplay": ")",
                                "IsOperator": true,
                                "ConfigScoreAndRatingScreenMappingID": 6,
                                "ConfigScreen": "ControlTotalScore"
                            }
                        ],
                        "OverallInherentRiskRating": [
                            {
                                "OverallInherentRiskRatingID": 1,
                                "RiskRating": "Low Risk",
                                "Computation": "Overall Inherent Risk Score <=4",
                                "ComputationCode": null,
                                "ColourName": null,
                                "ColourCode": "Green",
                                "IsActive": true,
                                "IsDeleted": false,
                                "CreatedDate": "2022-11-20T22:28:12.360Z",
                                "CreatedBy": "vamshi",
                                "LastUpdatedDate": "2022-11-26T22:16:34.723Z",
                                "LastUpdatedBy": "venu"
                            },
                            {
                                "OverallInherentRiskRatingID": 2,
                                "RiskRating": "Moderate Risk",
                                "Computation": "",
                                "ComputationCode": null,
                                "ColourName": null,
                                "ColourCode": "Amber",
                                "IsActive": true,
                                "IsDeleted": false,
                                "CreatedDate": "2022-11-20T22:29:29.617Z",
                                "CreatedBy": "vamshi",
                                "LastUpdatedDate": "2022-11-20T22:29:29.617Z",
                                "LastUpdatedBy": null
                            },
                            {
                                "OverallInherentRiskRatingID": 3,
                                "RiskRating": "High Risk",
                                "Computation": "14 > Overall Inherent Risk Score",
                                "ComputationCode": null,
                                "ColourName": null,
                                "ColourCode": "Red",
                                "IsActive": false,
                                "IsDeleted": false,
                                "CreatedDate": "2022-11-20T22:30:10.063Z",
                                "CreatedBy": "vamshi",
                                "LastUpdatedDate": "2022-11-21T20:42:48.740Z",
                                "LastUpdatedBy": "venu"
                            },
                            {
                                "OverallInherentRiskRatingID": 4,
                                "RiskRating": "Very High Risk",
                                "Computation": "",
                                "ComputationCode": null,
                                "ColourName": null,
                                "ColourCode": "Purple",
                                "IsActive": true,
                                "IsDeleted": false,
                                "CreatedDate": "2022-11-21T20:46:08.777Z",
                                "CreatedBy": "vamshi",
                                "LastUpdatedDate": "2022-11-21T20:46:08.777Z",
                                "LastUpdatedBy": null
                            },
                            {
                                "OverallInherentRiskRatingID": 5,
                                "RiskRating": "Very High Risk",
                                "Computation": "24 > Overall Inherent Risk Score",
                                "ComputationCode": null,
                                "ColourName": null,
                                "ColourCode": "Purple",
                                "IsActive": true,
                                "IsDeleted": false,
                                "CreatedDate": "2022-11-21T20:46:33.490Z",
                                "CreatedBy": "vamshi",
                                "LastUpdatedDate": "2022-11-21T20:46:33.490Z",
                                "LastUpdatedBy": null
                            },
                            {
                                "OverallInherentRiskRatingID": 6,
                                "RiskRating": "Critical High Risk",
                                "Computation": "Overall Inherent Risk Score > 30",
                                "ComputationCode": null,
                                "ColourName": null,
                                "ColourCode": "Red",
                                "IsActive": true,
                                "IsDeleted": false,
                                "CreatedDate": "2022-11-26T22:17:20.663Z",
                                "CreatedBy": "vamshi",
                                "LastUpdatedDate": "2022-11-26T22:17:20.663Z",
                                "LastUpdatedBy": null
                            }
                        ]

                    }
                },
                "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1",
                "error": {
                    "errorCode": null,
                    "errorMessage": null
                }
            };
            this.processRiskCategory(data);
            this.processRisk(data);
            this.processInherentLikelihoodRate(data);
            this.processInherentImpactRate(data);
            this.processInherentRiskScoreMasterData(data);
            this.processInherentRiskScore(data);
            this.processInherentRiskRatingMasterData(data);
            this.processInherentRiskRating(data);
        } else {
            this.configScoreRatingService.getMasterInherentRiskScreen().subscribe(data => {
                next: {
                    if (data.success == 1) {
                        this.processRiskCategory(data);
                        this.processRisk(data);
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
                }
            });
        }
    }
    //#region RiskCategory


    processRiskCategory(data: any): void {

        if (data.success == 1) {
            if (data.result.recordset.RiskCategory.length > 0) {
                let docs: any = this.gridDataSourceRiskCategory = data.result.recordset.RiskCategory;
                if (docs) {
                    let id = 0;
                    docs.forEach((doc: any) => {
                        id++;
                        doc.RowNumber = id;
                    });
                    this.RiskCategoryGridForms = this.fb.group({
                        GridRows: this.fb.array(docs.map((val: any) => this.fb.group({
                            Category: new FormControl(val.Category, [Validators.required]),
                            RiskCategoryID: new FormControl(val.RiskCategoryID),
                            IsActive: new FormControl(val.IsActive),
                            RowNumber: new FormControl(val.RowNumber),
                            action: new FormControl('existingRecord'),
                            isEditable: new FormControl(true),
                            isNewRow: new FormControl(false),
                        })
                        )) //end of fb array
                    }); // end of form group cretation

                    this.dataSourceRiskCategory = new MatTableDataSource((
                        this.RiskCategoryGridForms.get('GridRows') as FormArray).controls);
                    this.dataSourceRiskCategory.sort = this.sort;
                }
            }
        } else {
            if (data.error.errorCode == "TOKEN_EXPIRED")
                this.utils.relogin(this._document);
        }
    }
    editRiskCategoryData(GridFormElement: any, i: number) {
        GridFormElement.get('GridRows').at(i).get('isEditable').patchValue(false);
    }

    // On click of correct button in table (after click on edit) this method will call
    saveEditRiskCategoryData(GridFormElement: any, i: any) {
        const rowValue = (GridFormElement.get('GridRows').at(i).get('Category')?.value).trim();        
        this.checkCharLength(rowValue, 'RiskCategory').then((allowToSave) => {
            if (allowToSave) {
                return;
            }
            GridFormElement.get('GridRows').at(i).get('isEditable').patchValue(true);
            let data = {
                "category": (GridFormElement.get('GridRows').at(i).get('Category')?.value).trim(),
                "createdBy": "palani",
                "id": GridFormElement.get('GridRows').at(i).get('RiskCategoryID')?.value
            }
            this.riskCategoryService.updateData(data).subscribe(res => {
                next:
                if (res.success == 1) {

                    this.cancelRiskCategory();
                    this.addRiskCategorydg = false;
                    this.saveSuccess(res.message);
                } else {
                    if (res.error.errorCode == "TOKEN_EXPIRED")
                        this.utils.relogin(this._document);
                    else
                        this.saveRiskCategoryerror = res.error.errorMessage;
                    this.CancelRiskCategory(GridFormElement, i);
                }
                error:
                console.log("err::", "error");
            });
        })

        
    }

    // On click of cancel button in the table (after click on edit) this method will call and reset the previous data
    CancelRiskCategory(GridFormElement: any, i: any) {
        let obj = this.gridDataSourceRiskCategory.find((a: any) => a.RiskCategoryID == GridFormElement.get('GridRows').at(i).get('RiskCategoryID')?.value)
        GridFormElement.get('GridRows').at(i).get('Category').patchValue(obj?.Category);
        GridFormElement.get('GridRows').at(i).get('isEditable').patchValue(true);
        this.clearMessage();
    }

    initiatAddRiskCategory(): void {
        this.addRiskCategorydg = true;
    }

    cancelRiskCategory(): void {
        this.riskCategoryForm.reset();
        this.addRiskCategorydg = false;
        this.saveRiskCategoryerror = "";
        this.clearMessage();
    }

    saveRiskCategoryData(): void {
        if (this.riskCategoryForm.get('txtRiskCategoryID')?.value == 0 || this.riskCategoryForm.get('txtRiskCategoryID')?.value == null) {
            const rowValue = (this.riskCategoryForm.get('txtRiskCategoryName')?.value)?.trim();        
            this.checkCharLength(rowValue, 'RiskCategory').then((allowToSave) => {
                if (allowToSave) {
                    return;
                }
                let data = { "category": rowValue, "createdBy": "palani" }
                this.riskCategoryService.addNew(data).subscribe(res => {
                    next:
                    if (res.success == 1) {

                        this.cancelRiskCategory();
                        this.addRiskCategorydg = false;
                        this.saveSuccess(res.message);
                    } else {
                        if (res.error.errorCode == "TOKEN_EXPIRED")
                            this.utils.relogin(this._document);
                        else
                            this.saveRiskCategoryerror = res.error.errorMessage;
                    }
                    error:
                    console.log("err::", "error");
                });
            })
            
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
                this.saveProcessRiskerror = this.saveRiskCategoryerror = this.saveInherentLikelihoodRateerror = this.saveInherentImpactRateerror = this.saveinherentRiskScoreerror = this.saveInherentRiskRatingerror = "";
                this.getpageloaddata();
            }, timeout)
        });
    }

    editRiskCategory(row: any): void {
        this.resetRiskCategory();
        this.setRiskCategoryValue(row);
        this.addRiskCategorydg = true;
        console.log("row", row);
    }

    setRiskCategoryValue(data: any): void {
        this.riskCategoryForm.patchValue({ txtRiskCategoryName: data.Category, txtRiskCategoryID: data.RatingCategoryID });
    }
    resetRiskCategory(): void {
        this.riskCategoryForm.reset();
    }

    changedRiskCategory(data: any, event: any): void {
        let obj = {
            "id": data.get('RiskCategoryID')?.value,
            "isActive": !data.get('IsActive')?.value
        }
        this.riskCategoryService.updateStatus(obj).subscribe(res => {
            next:
            this.saveRiskCategoryerror = "";
            if (res.success == 1) {
                this.saveSuccess(res.message);
            } else {
                if (res.error.errorCode == "TOKEN_EXPIRED")
                    this.utils.relogin(this._document);
                else
                    this.saveRiskCategoryerror = res.error.errorMessage;
                event.source.checked = !event.source.checked;
            }
            error:
            console.log("err::", "error");
        });
    }

    // #endregion


    //#region ProcessRisk

    // @ts-ignore
    @ViewChild(MatSort) sortProcess: MatSort;


    processRisk(data: any): void {

        if (data.success == 1) {
            if (data.result.recordset.Process.length > 0) {
                let docs: any = this.gridDataSourceProcessRisk = data.result.recordset.Process;
                if (docs) {
                    let id = 0;
                    docs.forEach((doc: any) => {
                        id++;
                        doc.Index = id;
                    });
                    this.GridFormsProcessRisk = this.fb.group({
                        GridRows: this.fb.array(docs.map((val: any) => this.fb.group({
                            Name: new FormControl(val.Name, [Validators.required]),
                            ProcessID: new FormControl(val.ProcessID),
                            IsActive: new FormControl(val.IsActive),
                            Index: new FormControl(val.Index),
                            action: new FormControl('existingRecord'),
                            isEditable: new FormControl(true),
                            isNewRow: new FormControl(false),
                        })
                        )) //end of fb array
                    }); // end of form group cretation

                    this.dataSourceProcessRisk = new MatTableDataSource((
                        this.GridFormsProcessRisk.get('GridRows') as FormArray).controls);
                    this.dataSourceProcessRisk.sort = this.sortProcess

                }
            }
        } else {
            if (data.error.errorCode == "TOKEN_EXPIRED")
                this.utils.relogin(this._document);
        }
    }
    editProcessRiskData(GridFormElement: any, i: number) {
        GridFormElement.get('GridRows').at(i).get('isEditable').patchValue(false);
    }

    //On click of correct button in table (after click on edit) this method will call
    saveEditProcessRiskData(GridFormElement: any, i: any) {
        const rowValue =(GridFormElement.get('GridRows').at(i).get('Name')?.value).trim();
        this.checkCharLength(rowValue, 'Process').then((allowToSave) => {
            if (allowToSave) {
                return;
            }
            GridFormElement.get('GridRows').at(i).get('isEditable').patchValue(true);
            let data = {
                "name": rowValue,
                "createdBy": "palani",
                "id": GridFormElement.get('GridRows').at(i).get('ProcessID')?.value
            }
            this.processService.updateData(data).subscribe(res => {
                next:
                if (res.success == 1) {

                    this.cancelProcessRisk();
                    this.addProcessRiskdg = false;
                    this.saveSuccess(res.message);
                } else {
                    if (res.error.errorCode == "TOKEN_EXPIRED")
                        this.utils.relogin(this._document);
                    else
                        this.saveProcessRiskerror = res.error.errorMessage;
                    this.CancelProcessRisk(GridFormElement, i);
                }
                error:
                console.log("err::", "error");
            });

        })
        
    }

    //On click of cancel button in the table (after click on edit) this method will call and reset the previous data
    CancelProcessRisk(GridFormElement: any, i: any) {
        let obj = this.gridDataSourceProcessRisk.find((a: any) => a.ProcessID == GridFormElement.get('GridRows').at(i).get('ProcessID')?.value)
        GridFormElement.get('GridRows').at(i).get('Name').patchValue(obj?.Name);
        GridFormElement.get('GridRows').at(i).get('isEditable').patchValue(true);
        this.clearMessage();
    }

    initiatAddProcessRisk(): void {
        this.addProcessRiskdg = true;
    }

    cancelProcessRisk(): void {
        this.processRiskForm.reset();
        this.addProcessRiskdg = false;
        this.saveProcessRiskerror = "";
        this.clearMessage();
    }

    saveProcessRiskData(): void {
        if (this.processRiskForm.get('txtrateid')?.value == 0 || this.processRiskForm.get('txtrateid')?.value == null) {
            const rowValue = (this.processRiskForm.get('txtratename')?.value)?.trim();
            this.checkCharLength(rowValue, 'Process').then((allowToSave) => {
                if (allowToSave) {
                    return;
                }
                let data = { "name": rowValue, "createdBy": "palani" }
                this.processService.addNew(data).subscribe(res => {
                    next:
                    if (res.success == 1) {

                        this.cancelProcessRisk();
                        this.addProcessRiskdg = false;
                        this.saveSuccess(res.message);
                    } else {
                        if (res.error.errorCode == "TOKEN_EXPIRED")
                            this.utils.relogin(this._document);
                        else
                            this.saveProcessRiskerror = res.error.errorMessage;
                    }
                    error:
                    console.log("err::", "error");
                });

            })
            
        }

    }
    editProcessRisk(row: any): void {
        this.resetProcessRisk();
        this.setProcessRiskValue(row);
        this.addProcessRiskdg = true;
        console.log("row", row);
    }

    setProcessRiskValue(data: any): void {
        this.processRiskForm.patchValue({ txtratename: data.Name, txtrateid: data.ProcessID });
    }
    resetProcessRisk(): void {
        this.processRiskForm.reset();
    }

    changedProcessRisk(data: any, event: any): void {
        let obj = {
            // "id": data.ProcessRiskID,
            // "isActive": !data.IsActive
            "id": data.get('ProcessID')?.value,
            "isActive": !data.get('IsActive')?.value
        }
        this.processService.updateStatus(obj).subscribe(res => {
            next:
            if (res.success == 1) {
                this.saveSuccess(res.message);
            } else {
                if (res.error.errorCode == "TOKEN_EXPIRED")
                    this.utils.relogin(this._document);
                else
                    this.saveProcessRiskerror = res.error.errorMessage;
                event.source.checked = !event.source.checked;

            }
            error:
            console.log("err::", "error");
        });
        console.log(obj);
    }
    // #endregion

    //#region "InherentLikelihoodRate"

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

    processInherentLikelihoodRate(data: any): void {
        if (data.success == 1) {
            if (data.result.recordset.InherentLikelihoodRating.length > 0) {
                let docs: any = this.gridDataSourceInherentLikelihoodRate = data.result.recordset.InherentLikelihoodRating;
                if (docs) {
                    let id = 0;
                    docs.forEach((doc: any) => {
                        id++;
                        doc.RowNumber = id;
                    });
                    this.GridFormsInherentLikelihoodRating = this.fb.group({
                        GridRows: this.fb.array(docs.map((val: any) => this.fb.group({
                            Rating: new FormControl(val.Rating, [Validators.required]),
                            Score: new FormControl(val.Score, [Validators.required]),
                            InherentLikelihoodRatingID: new FormControl(val.InherentLikelihoodRatingID),
                            IsActive: new FormControl(val.IsActive),
                            RowNumber: new FormControl(val.RowNumber),
                            action: new FormControl('existingRecord'),
                            isEditable: new FormControl(true),
                            isNewRow: new FormControl(false),
                        })
                        )) //end of fb array
                    }); // end of form group cretation
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

    // On click of correct button in table (after click on edit) this method will call
    saveEditInherentLikelihoodRateData(GridFormElement: any, i: any) {
        const rowvalue = (GridFormElement.get('GridRows').at(i).get('Rating')?.value).trim();
        // this.checkCharLength(rowvalue, 'InherentLikelihoodRating')
        let filteredRecords = this.gridDataSourceInherentLikelihoodRate.filter((ob:any, inx:any) => inx != i);
        this.checkCharLengthDuplicate(rowvalue, 'Rating',filteredRecords).then((allowToSave) => {
            if (allowToSave) {
                return;
            }
            GridFormElement.get('GridRows').at(i).get('isEditable').patchValue(true);
            let data = {
                "rating"    : rowvalue,
                "score"     : GridFormElement.get('GridRows').at(i).get('Score')?.value,
                "id"        : GridFormElement.get('GridRows').at(i).get('InherentLikelihoodRatingID')?.value,
                "createdBy" : "palani"
            }
            this.inherentLikelihoodRankService.updateData(data).subscribe(res => {
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
        let obj = this.gridDataSourceInherentLikelihoodRate.find((a: any) => a.InherentLikelihoodRatingID == GridFormElement.get('GridRows').at(i).get('InherentLikelihoodRatingID')?.value)
        GridFormElement.get('GridRows').at(i).get('Rating').patchValue(obj?.Rating);
        GridFormElement.get('GridRows').at(i).get('Score').patchValue(obj?.Score);
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
        
        let obj = {
            // "id": data.InherentLikelihoodRatingID,
            // "isActive": !data.IsActive
            "id": data.get('InherentLikelihoodRatingID')?.value,
            "isActive": !data.get('IsActive')?.value
        }
        this.inherentLikelihoodRankService.updateStatus(obj).subscribe(res => {
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
        if (this.inherentLikelihoodRateForm.get('txtInherentLikelihoodRateID')?.value == 0 || this.inherentLikelihoodRateForm.get('txtInherentLikelihoodRateID')?.value == null) {
            const rowvalue = (this.inherentLikelihoodRateForm.get('txtInherentLikelihoodRate')?.value)?.trim();
            // this.checkCharLength(rowvalue, 'InherentLikelihoodRating')
            this.checkCharLengthDuplicate(rowvalue, 'Rating',this.gridDataSourceInherentLikelihoodRate).then((allowToSave) => {
                if (allowToSave) {
                    return;
                }
                let data = {
                    "rating": rowvalue,
                    "score": this.inherentLikelihoodRateForm.get('txtInherentLikelihoodScore')?.value,
                    "createdBy": "palani"
                }
                this.inherentLikelihoodRankService.addNew(data).subscribe(res => {
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
            this.checkCharLengthDuplicate(rowvalue, 'Rating',this.gridDataSourceInherentLikelihoodRate).then((allowToSave) => {
                if (allowToSave) {
                    return;
                }
                let data = {
                    "rating"    : rowvalue,
                    "score"     : this.inherentLikelihoodRateForm.get('txtInherentLikelihoodScore')?.value,
                    "id"        : this.inherentLikelihoodRateForm.get('txtInherentLikelihoodRateID')?.value,
                    "createdBy" : "palani"
                }
                this.inherentLikelihoodRankService.updateData(data).subscribe(res => {
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
    // #endregion 

    // #region inherent-impact-rate
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

    processInherentImpactRate(data: any): void {
        if (data.success == 1) {
            if (data.result.recordset.InherentImpactRating.length > 0) {
                let docs: any = this.gridDataSourceInherentImpactRate = data.result.recordset.InherentImpactRating;
                if (docs) {
                    let id = 0;
                    docs.forEach((doc: any) => {
                        id++;
                        doc.RowNumber = id;
                    });
                    this.GridFormsInherentImpactRate = this.fb.group({
                        GridRows: this.fb.array(docs.map((val: any) => this.fb.group({
                            Rating: new FormControl(val.Rating, [Validators.required]),
                            Score: new FormControl(val.Score, [Validators.required]),
                            InherentImpactRatingID: new FormControl(val.InherentImpactRatingID),
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
        GridFormElement.get('GridRows').at(i).get('isEditable').patchValue(false);
    }

    // On click of correct button in table (after click on edit) this method will call
    saveEditInherentImpactRateData(GridFormElement: any, i: any) {
        const rowvalue = (GridFormElement.get('GridRows').at(i).get('Rating')?.value)?.trim();
        this.checkCharLength(rowvalue, 'InherentImpactRating').then((allowToSave) => {
            if (allowToSave) {
                return;
            }
            GridFormElement.get('GridRows').at(i).get('isEditable').patchValue(true);
            let data = {
                "rating"    : rowvalue,
                "score"     : GridFormElement.get('GridRows').at(i).get('Score')?.value,
                "id"        : GridFormElement.get('GridRows').at(i).get('InherentImpactRatingID')?.value,
                "createdBy" : "palani"
            }
            this.inherentImpactRateService.updateData(data).subscribe(res => {
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
        let obj = this.gridDataSourceInherentImpactRate.find((a: any) => a.InherentImpactRatingID == GridFormElement.get('GridRows').at(i).get('InherentImpactRatingID')?.value)
        GridFormElement.get('GridRows').at(i).get('Rating').patchValue(obj?.Rating);
        GridFormElement.get('GridRows').at(i).get('Score').patchValue(obj?.Score);
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
        console.log("row", row);
    }

    setInherentImpactRateValue(data: any): void {
        this.inherentImpactRateForm.patchValue({ txtInherentImpactRate: data.Rating, txtInherentImpactScore: data.Score, txtInherentImpactRateID: data.InherentImpactRatingID });
    }

    changedInherentImpactRate(data: any, event: any): void {
        let obj = {
            // "id": data.InherentImpactRatingID,
            // "isActive": !data.IsActive
            "id": data.get('InherentImpactRatingID')?.value,
            "isActive": !data.get('IsActive')?.value
        }
        this.inherentImpactRateService.updateStatus(obj).subscribe(res => {
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
        if (this.inherentImpactRateForm.get('txtInherentImpactRateID')?.value == 0 || this.inherentImpactRateForm.get('txtInherentImpactRateID')?.value == null) {
            const rowvalue = (this.inherentImpactRateForm.get('txtInherentImpactRate')?.value)?.trim();
            this.checkCharLength(rowvalue, 'InherentImpactRating').then((allowToSave) => {
                if (allowToSave) {
                    return;
                }
                let data = {
                    "rating": rowvalue,
                    "score": this.inherentImpactRateForm.get('txtInherentImpactScore')?.value,
                    "createdBy": "palani"
                }
                this.inherentImpactRateService.addNew(data).subscribe(res => {
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
            const rowvalue = (this.inherentImpactRateForm.get('txtInherentImpactRate')?.value)?.trim();
            this.checkCharLength(rowvalue, 'InherentImpactRating').then((allowToSave) => {
                if (allowToSave) {
                    return;
                }
                let data = {
                    "rating"    : (this.inherentImpactRateForm.get('txtInherentImpactRate')?.value)?.trim(),
                    "score"     : this.inherentImpactRateForm.get('txtInherentImpactScore')?.value,
                    "id"        : this.inherentImpactRateForm.get('txtInherentImpactRateID')?.value,
                    "createdBy" : "palani"
                }
                this.inherentImpactRateService.updateData(data).subscribe(res => {
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
    // #endregion 

    // #region overallinherentRiskScore
    iseditinherentRiskScoredg: boolean = false;
    txttag = new FormControl('');
    inherentRiskScoreTags: Array<TagDataModel> = [];
    sourcedata: Array<TagDataModel> = [];
    sourcedatainherentRiskScore: Array<TagDataModel> = [];
    sourcedatainherentRiskScoreoperator: Array<TagDataModel> = [];
    beforetags: Array<TagDataModel> = [];
    saveinherentRiskScoreerror: string = "";
    IsLastEnteredOperator: boolean = false;

    processInherentRiskScoreMasterData(data: any): void {
        if (data.success == 1) {
            if (data.result.recordset.InherentRiskScoreConfig.length > 0) {
                let docs: Array<TagDataModel> = data.result.recordset.InherentRiskScoreConfig
                let id = 0;
                if (data.result.recordset.InherentRiskScoreConfig.length > 0) {
                    let docs: Array<TagDataModel> = data.result.recordset.InherentRiskScoreConfig
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
            if (data.result.recordset.OverallInherentRiskScore.length > 0) {
                let docs = data.result.recordset.OverallInherentRiskScore[0].ComputationCode.split(',');
                this.inherentRiskScoreTags = [];
                let lineitem: any;
                if (docs) {
                    let id = 0;
                    docs.forEach((doc: any) => {
                        id++;
                        lineitem = { ...this.sourcedata.find(value => value.ConfigScoreAndRatingID?.toString() == doc) };
                        lineitem.RowNumber = id.toString();
                        this.inherentRiskScoreTags.push(lineitem);
                    });
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

        let data: any = {
            "computation": computation,
            "computationCode": computationCode,
            "createdBy": "palani"
        };
        this.overAllInherentRiskScoreService.addNew(data).subscribe(res => {
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


    // #endregion 

    // #region overallinherentRiskrating

    displayedInherentRiskRatingColumns: string[] = ['RowNumber', 'RatingName', 'Computation', 'ColorCode', 'Action', 'Status'];
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

    processInherentRiskRatingMasterData(data: any): void {

        if (data.success == 1) {

            let id = 0;
            if (data.result.recordset.InherentRiskRatingConfig.length > 0) {
                let docs: Array<TagDataModel> = data.result.recordset.InherentRiskRatingConfig
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
            if (data.result.recordset.OverallInherentRiskRating.length > 0) {
                let lineitem: any;
                if (data.result.recordset.OverallInherentRiskRating) {
                    let id = 0;
                    let customText: string;
                    let temptext: string;
                    let computationarray;
                    let docs: Array<any> = data.result.recordset.OverallInherentRiskRating;
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
        this.masterInherentRiskRatingForm.patchValue({ txtrateid: data.OverallInherentRiskRatingID, txtcolorcode: data.ColourCode, txtratename: data.RiskRating, txtcolorname: data.ColourName });
    }

    addInherentRiskRatingtagitem(data: TagDataModel): void {
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

        let lineitem: any = { ...this.sourcedataInherentRiskRating.find(value => value.ConfigField === "Custom") };
        lineitem.ConfigDisplay = data;
        this.inherentRiskRatingTags.push(lineitem);
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
            if (item.ConfigField === "Custom") {
                computationCode += (computationCode == "" ? "" : ",") + item.ConfigScoreAndRatingID + "-" + item.ConfigDisplay;
                computation += " '" + item.ConfigDisplay + "'";
            }
            else {
                computationCode += (computationCode == "" ? "" : ",") + item.ConfigScoreAndRatingID;
                computation += " " + item.ConfigField;
            }
        });
        if (this.masterInherentRiskRatingForm.get('txtrateid')?.value == null || this.masterInherentRiskRatingForm.get('txtrateid')?.value == 0) {
            
            const rowvalue = (this.masterInherentRiskRatingForm.get('txtratename')?.value)?.trim();
            this.checkCharLength(rowvalue, 'OverallInherentRiskRating').then((allowToSave) => {
                if (allowToSave) {
                    return;
                }
                let data = {
                    "riskRating"        : rowvalue,
                    "colourName"        : this.masterInherentRiskRatingForm.get('txtcolorname')?.value,
                    "colourCode"        : this.masterInherentRiskRatingForm.get('txtcolorcode')?.value,
                    "computation"       : computation,
                    "computationCode"   : computationCode,
                    "createdBy"         : "palani"
                }
                this.overAllInherentRiskRatingService.addNew(data).subscribe(res => {
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
        else {
            const rowvalue = (this.masterInherentRiskRatingForm.get('txtratename')?.value)?.trim();
            this.checkCharLength(rowvalue, 'OverallInherentRiskRating').then((allowToSave) => {
                if (allowToSave) {
                    return;
                }
                let data = {
                    "riskRating"        : rowvalue,
                    "colourName"        : this.masterInherentRiskRatingForm.get('txtcolorname')?.value,
                    "colourCode"        : this.masterInherentRiskRatingForm.get('txtcolorcode')?.value,
                    "id"                : this.masterInherentRiskRatingForm.get('txtrateid')?.value,
                    "computation"       : computation,
                    "computationCode"   : computationCode,
                    "lastUpdatedBy"     : "palani"
                }
                this.overAllInherentRiskRatingService.updateData(data).subscribe(res => {
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

    }

    changedInherentRiskRating(data: any, event: any): void {
        let obj = {
            "id": data.OverallInherentRiskRatingID,
            "isActive": !data.IsActive
        }
        this.overAllInherentRiskRatingService.updateStatus(obj).subscribe(res => {
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
        console.log(obj);
    }

    // #endregion 
    keyPressNumber(event: any) {
        const pattern = /[0-9\ ]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (event.keyCode != 8 && !pattern.test(inputChar)) {
            event.preventDefault();
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
    clearMessage() {
        this.exceedCharLenErr = '';
        this.type = '';
    }

    async checkCharLengthDuplicate(data: any, type: string,allData:any): Promise<boolean> {
        this.duplicate = Object.values(allData)
        ?.filter((ele: any) => !ele.EditMode)
        .some((ele: any) => ele[type]?.trim().toLowerCase() === data.trim().toLowerCase());
        if (data.length > 500) {
            this.exceedCharLenErr = 'Length should not exceeds more than 500 characters';
            this.type = type;
            return true;
        } else if (this.duplicate) {
            this.exceedCharLenErr = 'Record already exists';
            console.log("this.exceedCharLenErr",this.exceedCharLenErr)
            this.type = type;
            return this.duplicate ?  this.exceedCharLenErr : false
        } else {
            this.clearMessage();
            return false;
        }
    }
}
