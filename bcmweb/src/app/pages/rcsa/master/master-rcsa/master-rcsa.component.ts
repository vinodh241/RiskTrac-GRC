import { LiveAnnouncer } from '@angular/cdk/a11y';
import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { RcsaMasterService } from 'src/app/services/rcsa/master/rcsa-master/rcsa-master.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { partition } from 'rxjs';

export interface TagDataModel {
    ConfigField: string,
    ConfigDisplay: string;
    RowNumber: string;
    ConfigScoreAndRatingID?: number;
    IsOperator: boolean;
}

@Component({
    selector: 'app-master-rcsa',
    templateUrl: './master-rcsa.component.html',
    styleUrls: ['./master-rcsa.component.scss']
})
export class MasterRcsaComponent implements OnInit {

    // @ts-ignore
    @ViewChild(MatSort) sort: MatSort;

    displayResidualRiskResponseColumns: string[] = ['RowNumber', 'ResidualRisk', 'Action', 'Status'];
    displayRiskResponsiblePerson: string[] = ['RowNumber', 'ResponsiblePerson', 'Status'];
    displayControlTestResult: string[] = ['RowNumber', 'ControlTestingResult', 'Action', 'Status'];
    displayActionPlanStatus: string[] = ['RowNumber', 'ActionPlanStatus', 'Action', 'Status'];
    displayActionPlanResponsiblePerson: string[] = ['RowNumber', 'ActionResponsiblePerson', 'Status'];
    displayActionPlanVerification: string[] = ['RowNumber', 'ActionVerification', 'Action', 'Status'];
    displayReviewer: string[] = ['RowNumber', 'Reviewer', 'Status'];
    // codeFilter = new FormControl();

    // start of residual Risk Response
    ResidualRiskResponseGridForms!: FormGroup;
    dataSourceResidualRiskResponse = new MatTableDataSource<any>();
    gridDataSourceResidualRiskResponse: any;
    addResidualRiskResponse: boolean = false;
    residualRiskResponseForm = new FormGroup({
        residualRiskResponse: new FormControl('', [Validators.required]),
        residualRiskResponseID: new FormControl(0)
    });
    saveResidualRiskResponseError: String = "";
    // end of residual Risk Response

    // start of Residual Risk Responsible Person
    ResidualRiskResponsibleForms!: FormGroup;
    DefaultResidualRiskResponsibleForms!: FormGroup;
    dataSourceResidualRiskResponsible = new MatTableDataSource<any>();
    gridDataSourceResidualRiskResponsiblePerson: any;
    addResidualRiskResponsiblePerson: boolean = false;
    residualRiskResponsiblePersonForm = new FormGroup({
        ResponsiblePerson: new FormControl('', [Validators.required]),
        ResidualRiskResponsiblePersonID: new FormControl(0)
    });
    saveResidualRiskResponsiblePersonError: String = "";
    residualResponsiblePersonDropdownData: any[] = [];
    actionResponsiblePersonDropdownData: any[] = [];
    selectedResponsiblePerson: any = null;
    residualResponsiblePersonFilter = new FormControl();
    filteredResidualPersonData: any[] = [];
    // end of Residual Risk Responsible Person

    // start of control test Result
    ControlTestResultForms!: FormGroup;
    dataSourceControlTestResult = new MatTableDataSource<any>();
    gridDataSourceControlTestResult: any;
    addControlTestResult: boolean = false;
    controlTestResultForm = new FormGroup({
        ControlTestingResult: new FormControl('', [Validators.required]),
        ControlTestingResultID: new FormControl(0)
    });
    saveControlTestResultError: String = "";
    // end of control test Result

    // start of Action plan Status
    ActionPlanStatusForms!: FormGroup;
    dataSourceActionPlanStatus = new MatTableDataSource<any>();
    gridDataSourceActionPlanStatus: any;
    addActionPlanStatus: boolean = false;
    actionPlanStatusForm = new FormGroup({
        ActionPlanStatus: new FormControl('', [Validators.required]),
        ActionPlanStatusID: new FormControl(0)
    });
    saveActionPlanStatusError: String = "";
    // end of action plan status

    // start of action plan responsible person
    ActionPlanResponsiblePersonForms!: FormGroup;
    DefualtActionPlanResponsiblePersonForms!: FormGroup;
    dataSourceActionPlanResponsiblePerson = new MatTableDataSource<any>();
    gridDataSourceActionPlanResponsiblePerson: any;
    addActionPlanResponsiblePerson: boolean = false;
    actionPlanRespnsiblePersonForm = new FormGroup({
        Description: new FormControl('', [Validators.required]),
        ActionResponsiblePersonID: new FormControl(0)
    });
    saveActionPlanResponsiblePersonError: String = "";
    selectedActionResponsiblePerson: any = null;
    actionResponsiblePersonFilter = new FormControl();
    // end of  action plan responsible person

    // start of action plan Verification
    ActionPlanVerificationForms!: FormGroup;
    dataSourceActionPlanVerification = new MatTableDataSource<any>();
    gridDataSourceActionPlanVerification: any;
    addActionPlanVerification: boolean = false;
    actionPlanVerificationForm = new FormGroup({
        ControlVerificationClosure: new FormControl('', [Validators.required]),
        ControlVerificationClosureID: new FormControl(0)
    });
    saveActionPlanVerificationError: String = "";
    // end of action plan verification

    // start of Reviewer
    ReviewerForms!: FormGroup;
    DefaultDataReviewerForms!: FormGroup;
    dataSourceReviewer = new MatTableDataSource<any>();
    gridDataSourceReviewer: any;
    addReviewer: boolean = false;
    reviewerForm = new FormGroup({
        Description: new FormControl('', [Validators.required]),
        ReviewerID: new FormControl(0)
    });
    saveReviewerError: String = "";
    selectedReviewer: any = null;
    reviewerFilter = new FormControl();
    reviewersDropdownData: any[] = [];
    exceedCharLenErr: any;
    type: any;
    duplicate:any
    // end of reviewer
    constructor(public rcsaMasterService: RcsaMasterService,
        public utils: UtilsService,
        @Inject(DOCUMENT) private _document: any,
        private fb: FormBuilder,
        private _formBuilder: FormBuilder,
        public dialog: MatDialog
    ) {

    }

    getPageLoadData(): void {
        this.rcsaMasterService.getRcsaMaster().subscribe(data => {
            next: {
                if (data.success == 1) {
                    this.processResidualRiskResponse(data);
                    this.processResidualRiskResponsiblePerson(data);
                    this.processControlTestResult(data);
                    this.processActionPlanStatus(data);
                    this.processActionPlanResponsiblePerson(data);
                    this.processActionPlanVerification(data);
                    this.processReviewer(data);
                    this.responsiblePersonForDropdown(data);
                } else {
                    if (data.error.errorCode == "TOKEN_EXPIRED")
                        this.utils.relogin(this._document);
                }
            }

        });
    }

    processResidualRiskResponse(data: any) {
        if (data.success == 1) {
            if (data.result.residualRiskResponse.length > 0) {
                let residualRiskResponse: any = this.gridDataSourceResidualRiskResponse = data.result.residualRiskResponse;
                residualRiskResponse = residualRiskResponse.sort((a: { IsActive: number; }, b: { IsActive: number; }) => b.IsActive - a.IsActive);
                if (residualRiskResponse) {
                    this.ResidualRiskResponseGridForms = this.fb.group({
                        GridRows: this.fb.array(residualRiskResponse.map((val: any) => this.fb.group({
                            RiskResponse: new FormControl(val.RiskResponse, [Validators.required]),
                            ResidualRiskResponseID: new FormControl(val.ResidualRiskResponseID),
                            IsActive: new FormControl(val.IsActive),
                            isEditable: new FormControl(true),
                            isNewRow: new FormControl(false),
                        })
                        ))
                    });
                    this.dataSourceResidualRiskResponse = new MatTableDataSource((
                        this.ResidualRiskResponseGridForms.get('GridRows') as FormArray).controls);
                    this.dataSourceResidualRiskResponse.sort = this.sort;
                }
            }
        }
    }

    processResidualRiskResponsiblePerson(data: any) {
        if (data.success == 1) {
            if (data.result.riskResponsiblePerson.length > 0) {
                let residualRiskResponsiblePerson: any = this.gridDataSourceResidualRiskResponsiblePerson = data.result.riskResponsiblePerson;
                residualRiskResponsiblePerson = residualRiskResponsiblePerson.sort((a: { IsActive: number; }, b: { IsActive: number; }) => b.IsActive - a.IsActive);
                if (residualRiskResponsiblePerson) {
                    this.ResidualRiskResponsibleForms = this.fb.group({
                        GridRows: this.fb.array(residualRiskResponsiblePerson.map((val: any) => this.fb.group({
                            ResponsiblePerson: new FormControl(val.ResponsiblePerson, [Validators.required]),
                            ResidualRiskResponsiblePersonID: new FormControl(val.ResidualRiskResponsiblePersonID),
                            IsActive: new FormControl(val.IsActive),
                            isEditable: new FormControl(true),
                            isNewRow: new FormControl(false),
                            UserGUID: val.UserGUID,
                            IsDeleted: new FormControl(val.IsDeleted)
                        })
                        ))
                    });
                    this.DefaultResidualRiskResponsibleForms = this.ResidualRiskResponsibleForms;
                    this.dataSourceResidualRiskResponsible = new MatTableDataSource((
                        this.ResidualRiskResponsibleForms.get('GridRows') as FormArray).controls);
                    // this.dataSourceResidualRiskResponsible.sort = this.sort;
                    this.residualResponsiblePersonFilter.valueChanges.subscribe((codeValue) => {
                        this.ResidualRiskResponsibleForms = this.DefaultResidualRiskResponsibleForms;
                        let testdata;
                        if (codeValue.trim() != "") {
                            testdata = (this.ResidualRiskResponsibleForms.get('GridRows') as FormArray).value.filter((value: any) => {
                                return value.ResponsiblePerson.toLowerCase().includes(codeValue.toLowerCase());
                            });
                            this.ResidualRiskResponsibleForms = this.fb.group({
                                GridRows: this.fb.array(testdata.map((val: any) => this.fb.group({
                                    ResponsiblePerson: new FormControl(val.ResponsiblePerson, [Validators.required]),
                                    ResidualRiskResponsiblePersonID: new FormControl(val.ResidualRiskResponsiblePersonID),
                                    IsActive: new FormControl(val.IsActive),
                                    isEditable: new FormControl(val.isEditable),
                                    isNewRow: new FormControl(val.isNewRow),
                                })
                                ))
                            });
                            this.dataSourceResidualRiskResponsible = new MatTableDataSource((
                                this.ResidualRiskResponsibleForms.get('GridRows') as FormArray).controls);
                        } else {
                            this.dataSourceResidualRiskResponsible = new MatTableDataSource((
                                this.DefaultResidualRiskResponsibleForms.get('GridRows') as FormArray).controls);
                        }
                    });
                }
            }
        }
    }

    processControlTestResult(data: any) {
        if (data.success == 1) {
            if (data.result.controlTestingResult.length > 0) {
                let constrolTestResult: any = this.gridDataSourceControlTestResult = data.result.controlTestingResult;
                constrolTestResult = constrolTestResult.sort((a: { IsActive: number; }, b: { IsActive: number; }) => b.IsActive - a.IsActive);
                if (constrolTestResult) {
                    this.ControlTestResultForms = this.fb.group({
                        GridRows: this.fb.array(constrolTestResult.map((val: any) => this.fb.group({
                            ControlTestingResult: new FormControl(val.ControlTestingResult, [Validators.required]),
                            ControlTestingResultID: new FormControl(val.ControlTestingResultID),
                            IsActive: new FormControl(val.IsActive),
                            isEditable: new FormControl(true),
                            isNewRow: new FormControl(false),
                        })
                        ))
                    });
                    this.dataSourceControlTestResult = new MatTableDataSource((
                        this.ControlTestResultForms.get('GridRows') as FormArray).controls);
                    this.dataSourceControlTestResult.sort = this.sort;
                }
            }
        }
    }

    processActionPlanStatus(data: any) {
        if (data.success == 1) {
            if (data.result.actionPlanStatus.length > 0) {
                let actionPlanStatus: any = this.gridDataSourceActionPlanStatus = data.result.actionPlanStatus;
                actionPlanStatus = actionPlanStatus.sort((a: { IsActive: number; }, b: { IsActive: number; }) => b.IsActive - a.IsActive);
                if (actionPlanStatus) {
                    this.ActionPlanStatusForms = this.fb.group({
                        GridRows: this.fb.array(actionPlanStatus.map((val: any) => this.fb.group({
                            ActionPlanStatus: new FormControl(val.ActionPlanStatus, [Validators.required]),
                            ActionPlanStatusID: new FormControl(val.ActionPlanStatusID),
                            IsActive: new FormControl(val.IsActive),
                            isEditable: new FormControl(true),
                            isNewRow: new FormControl(false),
                        })
                        ))
                    });
                    this.dataSourceActionPlanStatus = new MatTableDataSource((
                        this.ActionPlanStatusForms.get('GridRows') as FormArray).controls);
                    this.dataSourceActionPlanStatus.sort = this.sort;
                }
            }
        }
    }

    processActionPlanResponsiblePerson(data: any) {
        if (data.success == 1) {
            if (data.result.actionResponsiblePerson.length > 0) {
                let actionPlanResponsiblePerson: any = this.gridDataSourceActionPlanResponsiblePerson = data.result.actionResponsiblePerson;
                actionPlanResponsiblePerson = actionPlanResponsiblePerson.sort((a: { IsActive: number; }, b: { IsActive: number; }) => b.IsActive - a.IsActive);
                if (actionPlanResponsiblePerson) {
                    this.ActionPlanResponsiblePersonForms = this.fb.group({
                        GridRows: this.fb.array(actionPlanResponsiblePerson.map((val: any) => this.fb.group({
                            Description: new FormControl(val.Description, [Validators.required]),
                            ActionResponsiblePersonID: new FormControl(val.ActionResponsiblePersonID),
                            IsActive: new FormControl(val.IsActive),
                            isEditable: new FormControl(true),
                            isNewRow: new FormControl(false),
                            UserGUID: val.UserGUID,
                            IsDeleted: new FormControl(val.IsDeleted)
                        })
                        ))
                    });
                    this.DefualtActionPlanResponsiblePersonForms = this.ActionPlanResponsiblePersonForms;
                    this.dataSourceActionPlanResponsiblePerson = new MatTableDataSource((
                        this.ActionPlanResponsiblePersonForms.get('GridRows') as FormArray).controls);
                    // this.dataSourceActionPlanResponsiblePerson.sort = this.sort;
                    this.actionResponsiblePersonFilter.valueChanges.subscribe((codeValue) => {
                        this.ActionPlanResponsiblePersonForms = this.DefualtActionPlanResponsiblePersonForms;
                        let testdata;
                        if (codeValue.trim() != "") {
                            testdata = (this.ActionPlanResponsiblePersonForms.get('GridRows') as FormArray).value.filter((value: any) => {
                                console.log("value", value);
                                return value.Description.toLowerCase().includes(codeValue.toLowerCase());
                            });
                            console.log("testdata", testdata);
                            this.ActionPlanResponsiblePersonForms = this.fb.group({
                                GridRows: this.fb.array(testdata.map((val: any) => this.fb.group({
                                    Description: new FormControl(val.Description, [Validators.required]),
                                    ActionResponsiblePersonID: new FormControl(val.ActionResponsiblePersonID),
                                    IsActive: new FormControl(val.IsActive),
                                    isEditable: new FormControl(val.isEditable),
                                    isNewRow: new FormControl(val.isNewRow),
                                })
                                ))
                            });
                            this.dataSourceActionPlanResponsiblePerson = new MatTableDataSource((
                                this.ActionPlanResponsiblePersonForms.get('GridRows') as FormArray).controls);
                        } else {
                            this.dataSourceActionPlanResponsiblePerson = new MatTableDataSource((
                                this.DefualtActionPlanResponsiblePersonForms.get('GridRows') as FormArray).controls);
                        }
                    });
                }
            }
        }
    }

    processActionPlanVerification(data: any) {
        if (data.success == 1) {
            if (data.result.controlVerificationClosure.length > 0) {
                let actionPlanVerification: any = this.gridDataSourceActionPlanVerification = data.result.controlVerificationClosure;
                actionPlanVerification = actionPlanVerification.sort((a: { IsActive: number; }, b: { IsActive: number; }) => b.IsActive - a.IsActive);
                if (actionPlanVerification) {
                    this.ActionPlanVerificationForms = this.fb.group({
                        GridRows: this.fb.array(actionPlanVerification.map((val: any) => this.fb.group({
                            ControlVerificationClosure: new FormControl(val.ControlVerificationClosure, [Validators.required]),
                            ControlVerificationClosureID: new FormControl(val.ControlVerificationClosureID),
                            IsActive: new FormControl(val.IsActive),
                            isEditable: new FormControl(true),
                            isNewRow: new FormControl(false),
                        })
                        ))
                    });
                    this.dataSourceActionPlanVerification = new MatTableDataSource((
                        this.ActionPlanVerificationForms.get('GridRows') as FormArray).controls);
                    this.dataSourceActionPlanVerification.sort = this.sort;
                }
            }
        }
    }

    processReviewer(data: any) {
        if (data.success == 1) {
            if (data.result.reviewers.length > 0) {
                let reviewer: any = this.gridDataSourceReviewer = data.result.reviewers;
                reviewer = reviewer.sort((a: { IsActive: number; }, b: { IsActive: number; }) => b.IsActive - a.IsActive);
                if (reviewer) {
                    this.ReviewerForms = this.fb.group({
                        GridRows: this.fb.array(reviewer.map((val: any) => this.fb.group({
                            Description: new FormControl(val.Description, [Validators.required]),
                            ReviewerID: new FormControl(val.ReviewerID),
                            IsActive: new FormControl(val.IsActive),
                            isEditable: new FormControl(true),
                            isNewRow: new FormControl(false),
                            UserGUID: val.UserGUID,
                            IsDeleted: new FormControl(val.IsDeleted),
                            isLinked: val.isLinked,
                            ScheduleAssessmentCodes: val.ScheduleAssessmentCodes
                        })
                        ))
                    });
                    this.DefaultDataReviewerForms = this.ReviewerForms;
                    this.dataSourceReviewer = new MatTableDataSource((this.ReviewerForms.get('GridRows') as FormArray).controls);

                    this.reviewerFilter.valueChanges.subscribe((codeValue) => {
                        this.ReviewerForms = this.DefaultDataReviewerForms;
                        let testdata;
                    
                        if (codeValue.trim() !== "") {
                            testdata = (this.ReviewerForms.get('GridRows') as FormArray).value.filter((value: any) => {
                                return value.Description.toLowerCase().includes(codeValue.toLowerCase());
                            });
                    
                            this.ReviewerForms = this.fb.group({
                                GridRows: this.fb.array(testdata.map((val: any) => {
                                    let rowGroup = this.fb.group({
                                        Description : new FormControl(val.Description, [Validators.required]),
                                        ReviewerID  : new FormControl(val.ReviewerID),
                                        IsActive    : new FormControl(val.IsActive),
                                        isEditable  : new FormControl(val.isEditable),
                                        isNewRow    : new FormControl(val.isNewRow),
                                        IsDeleted   : new FormControl(val.IsDeleted),
                                        isLinked    : new FormControl(val.isLinked),
                                        ScheduleAssessmentCodes : new FormControl(val.ScheduleAssessmentCodes),
                                    });
                    
                                    if ((!val.IsActive && val.IsDeleted) || val.isLinked) {
                                        rowGroup.get("IsActive")?.disable();
                                    }
                                    return rowGroup;
                                }))
                            });
                    
                            this.dataSourceReviewer = new MatTableDataSource((this.ReviewerForms.get('GridRows') as FormArray).controls);
                        } else {
                            this.dataSourceReviewer = new MatTableDataSource((this.DefaultDataReviewerForms.get('GridRows') as FormArray).controls);
                        }
                    });
                }
            }
        }
    }

    responsiblePersonForDropdown(data: any) {
        if (data.success == 1) {
            if (data.result.PUActionResponsiblePerson.length > 0) {
                let filteredResidualPersonData: any[] = [];
                let filteredActionPersonData: any[] = [];
                if (data.result.riskResponsiblePerson.length > 0) {
                    filteredResidualPersonData = data.result.PUActionResponsiblePerson.filter((element: any) => {
                        return !this.gridDataSourceResidualRiskResponsiblePerson.some((ele: any) => ele.UserGUID === element.UserGUID);
                    });
                    this.residualResponsiblePersonDropdownData = filteredResidualPersonData;
                } else {
                    this.residualResponsiblePersonDropdownData = data.result.PUActionResponsiblePerson;
                }
                if (data.result.actionResponsiblePerson.length > 0) {
                    filteredActionPersonData = data.result.PUActionResponsiblePerson.filter((element: any) => {
                        return !this.gridDataSourceActionPlanResponsiblePerson.some((ele: any) => ele.UserGUID === element.UserGUID);
                    });
                    this.actionResponsiblePersonDropdownData = filteredActionPersonData;
                } else {
                    this.actionResponsiblePersonDropdownData = data.result.PUActionResponsiblePerson;
                }
            }
            if (data.result.reviewersusersList.length > 0) {
                let filteredReviewerData: any[] = [];
                if (data.result.reviewers.length > 0) {
                    filteredReviewerData = data.result.reviewersusersList.filter((element: any) => {
                        return !this.gridDataSourceReviewer.some((ele: any) => ele.UserGUID === element.UserGUID);
                    });
                    this.reviewersDropdownData = filteredReviewerData;
                } else {
                    this.reviewersDropdownData = data.result.reviewersusersList;
                }
            }
        }
    }

    initiatAddResidualRiskResponse(): void {
        this.addResidualRiskResponse = true;
    }

    initiatAddResidualRiskResponsiblePerson(): void {
        this.addResidualRiskResponsiblePerson = true;
    }

    initiatAddControlTestResult(): void {
        this.addControlTestResult = true;
    }

    initiatAddActionStatus(): void {
        this.addActionPlanStatus = true;
    }

    initiatAddActionResponsiblePerson(): void {
        this.addActionPlanResponsiblePerson = true;
    }

    initiatAddActionVerification(): void {
        this.addActionPlanVerification = true;
    }

    initiatAddReviewer(): void {
        this.addReviewer = true;
    }

    saveResidualRiskResponseData(): void {
        if (this.residualRiskResponseForm.get('residualRiskResponseID')?.value == 0 || this.residualRiskResponseForm.get('residualRiskResponseID')?.value == null) {
            const rowValue = this.residualRiskResponseForm.get('residualRiskResponse')?.value
            // this.checkCharLength(rowValue, 'RiskResponse')
            this.checkCharLengthDuplicate(rowValue, 'RiskResponse',this.gridDataSourceResidualRiskResponse).then((allowToSave) => {
                if (allowToSave) {
                    return;
                }
                let data = {
                    "residualRiskResponse":
                        [{
                            "residualriskresponseID": this.residualRiskResponseForm.get('residualRiskResponseID')?.value,
                            "riskresponse": this.residualRiskResponseForm.get('residualRiskResponse')?.value,
                            "isActive": true
                        }]
                }
                this.rcsaMasterService.addNew(data).subscribe(res => {
                    next:
                    if (res.success == 1) {
                        // this.cancelRiskCategory();
                        this.addResidualRiskResponse = false;
                        this.saveSuccess("Record added successfully");
                        this.residualRiskResponseForm.reset();
                    } else {
                        if (res.error.errorCode == "TOKEN_EXPIRED")
                            this.utils.relogin(this._document);
                        else
                            this.saveResidualRiskResponseError = res.error.errorMessage;
                    }
                    error:
                    console.log("err::", "error");
                });
            })
        }
    }

    saveResidualRiskResponsiblePersonData(): void {
        console.log("data", this.selectedResponsiblePerson);
        if (this.selectedResponsiblePerson?.UserGUID != null) {
            let data = {
                "residualRiskResponsiblePerson": [{
                    "userguID": this.selectedResponsiblePerson?.UserGUID,
                    "responsibleperson": this.selectedResponsiblePerson?.FullName,
                    "isActive": true
                }]
            }
            this.rcsaMasterService.addNew(data).subscribe(res => {
                next:
                if (res.success == 1) {
                    // this.cancelRiskCategory();
                    this.addResidualRiskResponsiblePerson = false;
                    this.saveSuccess("Record added successfully");
                    this.residualRiskResponsiblePersonForm.reset();
                } else {
                    if (res.error.errorCode == "TOKEN_EXPIRED")
                        this.utils.relogin(this._document);
                    else
                        this.saveResidualRiskResponsiblePersonError = res.error.errorMessage;
                }
                error:
                console.log("err::", "error");
            });
        }
    }

    saveControlTestResultData(): void {
        if (this.controlTestResultForm.get('ControlTestingResultID')?.value == 0 || this.controlTestResultForm.get('ControlTestingResultID')?.value == null) {
            const rowValue = this.controlTestResultForm.get('ControlTestingResult')?.value
            this.checkCharLengthDuplicate(rowValue, 'ControlTestingResult',this.gridDataSourceControlTestResult).then((allowToSave) => {
                if (allowToSave) {
                    return;
                }
                let data = {
                    "controltestingresult": [{
                        "controltestingresultID" : this.controlTestResultForm.get('ControlTestingResultID')?.value,
                        "controltestingresult"   : rowValue,
                        "isActive"               : true
                    }]
                }
                this.rcsaMasterService.addNew(data).subscribe(res => {
                    next:
                    if (res.success == 1) {
                        this.addControlTestResult = false;
                        this.saveSuccess("Record added successfully");
                        this.controlTestResultForm.reset();
                    } else {
                        if (res.error.errorCode == "TOKEN_EXPIRED")
                            this.utils.relogin(this._document);
                        else
                            this.saveControlTestResultError = res.error.errorMessage;
                    }
                    error:
                    console.log("err::", "error");
                });
            });
        }
    }

    saveActionStatusData(): void {
        if (this.actionPlanStatusForm.get('ActionPlanStatusID')?.value == 0 || this.actionPlanStatusForm.get('ActionPlanStatusID')?.value == null) {
            const rowvalue = this.actionPlanStatusForm.get('ActionPlanStatus')?.value;
            this.checkCharLengthDuplicate(rowvalue, 'ActionPlanStatus',this.gridDataSourceActionPlanStatus).then((allowToSave) => {
                if (allowToSave) {
                    return;
                }
                let data = {
                    "actionPlanStatus": [{
                        "actionplanstatusID": this.actionPlanStatusForm.get('ActionPlanStatusID')?.value,
                        "actionplanstatus": rowvalue,
                        "isActive": true
                    }]
                }
                this.rcsaMasterService.addNew(data).subscribe(res => {
                    next:
                    if (res.success == 1) {
                        this.addActionPlanStatus = false;
                        this.saveSuccess("Record added successfully");
                        this.actionPlanStatusForm.reset();
                    } else {
                        if (res.error.errorCode == "TOKEN_EXPIRED")
                            this.utils.relogin(this._document);
                        else
                            this.saveActionPlanStatusError = res.error.errorMessage;
                    }
                    error:
                    console.log("err::", "error");
                });

            })
            
        }
    }

    saveActionResponsiblePersonData(): void {
        console.log("selectedActionResponsiblePerson", this.selectedActionResponsiblePerson);
        if (this.selectedActionResponsiblePerson?.UserGUID != null) {
            let data = {
                "actionResponsiblePerson": [{
                    "userguID": this.selectedActionResponsiblePerson?.UserGUID,
                    "description": this.selectedActionResponsiblePerson?.FullName,
                    "isActive": true
                }]
            }
            this.rcsaMasterService.addNew(data).subscribe(res => {
                next:
                if (res.success == 1) {
                    this.addActionPlanResponsiblePerson = false;
                    this.saveSuccess("Record added successfully");
                    this.actionPlanRespnsiblePersonForm.reset();
                } else {
                    if (res.error.errorCode == "TOKEN_EXPIRED")
                        this.utils.relogin(this._document);
                    else
                        this.saveActionPlanResponsiblePersonError = res.error.errorMessage;
                }
                error:
                console.log("err::", "error");
            });
        }
    }

    saveActionVerificationData(): void {
        if (this.actionPlanVerificationForm.get('ControlVerificationClosureID')?.value == 0 || this.actionPlanVerificationForm.get('ControlVerificationClosureID')?.value == null) {
            const rowvalue = this.actionPlanVerificationForm.get('ControlVerificationClosure')?.value;
            this.checkCharLengthDuplicate(rowvalue, 'ControlVerificationClosure',this.gridDataSourceActionPlanVerification).then((allowToSave) => {
                if (allowToSave) {
                    return;
                }
                let data = {
                    "controlVerificationClosure": [{
                        "controlverificationclosureID": this.actionPlanVerificationForm.get('ControlVerificationClosureID')?.value,
                        "controlverificationclosure"  : rowvalue,
                        "isActive": true
                    }]
                }
                this.rcsaMasterService.addNew(data).subscribe(res => {
                    next:
                    if (res.success == 1) {
                        this.addActionPlanVerification = false;
                        this.saveSuccess("Record added successfully");
                        this.actionPlanVerificationForm.reset();
                    } else {
                        if (res.error.errorCode == "TOKEN_EXPIRED")
                            this.utils.relogin(this._document);
                        else
                            this.saveActionPlanVerificationError = res.error.errorMessage;
                    }
                    error:
                    console.log("err::", "error");
                });

            })
            
        }
    }

    saveReviewerData(): void {
        if (this.selectedReviewer?.UserGUID != null) {
            let data = {
                "reviewers": [{
                    "userguID": this.selectedReviewer?.UserGUID,
                    "description": this.selectedReviewer?.FullName,
                    "isActive": true
                }]
            }
            this.rcsaMasterService.addNew(data).subscribe(res => {
                next:
                if (res.success == 1) {
                    this.addReviewer = false;
                    this.saveSuccess("Record added successfully");
                    this.reviewerForm.reset();
                } else {
                    if (res.error.errorCode == "TOKEN_EXPIRED")
                        this.utils.relogin(this._document);
                    else
                        this.saveReviewerError = res.error.errorMessage;
                }
                error:
                console.log("err::", "error");
            });
        }
    }

    editResidualRiskResponseData(formValue: any, index: number): void {
        formValue.get('GridRows').at(index).get('isEditable').patchValue(false);
    }

    editRiskResppnsiblePesonData(formValue: any, index: number): void {
        formValue.get('GridRows').at(index).get('isEditable').patchValue(false);
    }

    editControlTestResultData(formValue: any, index: number): void {
        formValue.get('GridRows').at(index).get('isEditable').patchValue(false);
    }

    editActionPlanStatus(formValue: any, index: number): void {
        formValue.get('GridRows').at(index).get('isEditable').patchValue(false);
    }

    editActionPlanResponsiblePerson(formValue: any, index: number): void {
        formValue.get('GridRows').at(index).get('isEditable').patchValue(false);
    }

    editActionPlanVerification(formValue: any, index: number): void {
        formValue.get('GridRows').at(index).get('isEditable').patchValue(false);
    }

    editReviewer(formValue: any, index: number): void {
        formValue.get('GridRows').at(index).get('isEditable').patchValue(false);
    }

    cancelResidualRiskResponseTable(formValue: any, i: any) {
        let obj = this.gridDataSourceResidualRiskResponse.find((a: any) => a.ResidualRiskResponseID == formValue.get('GridRows').at(i).get('ResidualRiskResponseID')?.value)
        formValue.get('GridRows').at(i).get('RiskResponse').patchValue(obj?.RiskResponse);
        formValue.get('GridRows').at(i).get('isEditable').patchValue(true);
        this.clearMessage();
    }

    cancelRiskResponsiblePersonTable(formValue: any, i: any) {
        let obj = this.gridDataSourceResidualRiskResponsiblePerson.find((a: any) => a.ResidualRiskResponsiblePersonID == formValue.get('GridRows').at(i).get('ResidualRiskResponsiblePersonID')?.value)
        formValue.get('GridRows').at(i).get('ResponsiblePerson').patchValue(obj?.ResponsiblePerson);
        formValue.get('GridRows').at(i).get('isEditable').patchValue(true);
    }

    cancelControlTestResultTable(formValue: any, i: any) {
        let obj = this.gridDataSourceControlTestResult.find((a: any) => a.ControlTestingResultID == formValue.get('GridRows').at(i).get('ControlTestingResultID')?.value)
        formValue.get('GridRows').at(i).get('ControlTestingResult').patchValue(obj?.ControlTestingResult);
        formValue.get('GridRows').at(i).get('isEditable').patchValue(true);
        this.clearMessage();
    }

    cancelActionPlanStatusTable(formValue: any, i: any) {
        let obj = this.gridDataSourceActionPlanStatus.find((a: any) => a.ActionPlanStatusID == formValue.get('GridRows').at(i).get('ActionPlanStatusID')?.value)
        formValue.get('GridRows').at(i).get('ActionPlanStatus').patchValue(obj?.ActionPlanStatus);
        formValue.get('GridRows').at(i).get('isEditable').patchValue(true);
        this.clearMessage();
    }

    cancelActionPlanResponsiblePersonTable(formValue: any, i: any) {
        let obj = this.gridDataSourceActionPlanResponsiblePerson.find((a: any) => a.ActionResponsiblePersonID == formValue.get('GridRows').at(i).get('ActionResponsiblePersonID')?.value)
        formValue.get('GridRows').at(i).get('Description').patchValue(obj?.Description);
        formValue.get('GridRows').at(i).get('isEditable').patchValue(true);
    }

    cancelActionPlanVerificationTable(formValue: any, i: any) {
        let obj = this.gridDataSourceActionPlanVerification.find((a: any) => a.ControlVerificationClosureID == formValue.get('GridRows').at(i).get('ControlVerificationClosureID')?.value)
        formValue.get('GridRows').at(i).get('ControlVerificationClosure').patchValue(obj?.ControlVerificationClosure);
        formValue.get('GridRows').at(i).get('isEditable').patchValue(true);
        this.clearMessage();
    }

    cancelReviewerTable(formValue: any, i: any) {
        let obj = this.gridDataSourceReviewer.find((a: any) => a.ReviewerID == formValue.get('GridRows').at(i).get('ReviewerID')?.value)
        formValue.get('GridRows').at(i).get('Description').patchValue(obj?.Description);
        formValue.get('GridRows').at(i).get('isEditable').patchValue(true);
    }

    cancelResidualRiskResponse(): void {
        this.residualRiskResponseForm.reset();
        this.addResidualRiskResponse = false;
        this.saveResidualRiskResponseError = "";
        this.clearMessage();
    }

    cancelResidualRiskResponsiblePerson(): void {
        this.residualRiskResponsiblePersonForm.reset();
        this.addResidualRiskResponsiblePerson = false;
        this.saveResidualRiskResponsiblePersonError = "";
        this.selectedResponsiblePerson = null;
    }

    cancelControlTestResult(): void {
        this.controlTestResultForm.reset();
        this.addControlTestResult = false;
        this.saveControlTestResultError = "";
        this.clearMessage();
    }

    cancelActionPlanStatus(): void {
        this.actionPlanStatusForm.reset();
        this.addActionPlanStatus = false;
        this.saveActionPlanStatusError = "";
        this.clearMessage();
    }

    cancelActionPlanResponsiblePerson(): void {
        this.actionPlanRespnsiblePersonForm.reset();
        this.addActionPlanResponsiblePerson = false;
        this.saveActionPlanResponsiblePersonError = ""
        this.selectedActionResponsiblePerson = null;
    }

    cancelActionPlanVerification(): void {
        this.actionPlanVerificationForm.reset();
        this.addActionPlanVerification = false;
        this.saveActionPlanVerificationError = "";
        this.clearMessage();
    }

    cancelReviewer(): void {
        this.reviewerForm.reset();
        this.addReviewer = false;
        this.saveReviewerError = "";
        this.selectedReviewer = null;
    }

    saveEditedResidualRiskResponseData(formValue: any, index: number): void {
        const rowValue = formValue.get('GridRows').at(index).get('RiskResponse')?.value;
        let filteredRecords = this.gridDataSourceResidualRiskResponse.filter((ob:any, inx:any) => inx != index);
        this.checkCharLengthDuplicate(rowValue, 'RiskResponse',filteredRecords).then((allowToSave) => {
            if (allowToSave) {
                return;
            }

            formValue.get('GridRows').at(index).get('isEditable').patchValue(true);

            let data = {
                "residualRiskResponse": [{
                    "residualriskresponseID": formValue.get('GridRows').at(index).get('ResidualRiskResponseID')?.value,
                    "riskresponse": rowValue,
                    "isActive": formValue.get('GridRows').at(index).get('IsActive')?.value
                }]
            };

            this.rcsaMasterService.addNew(data).subscribe(res => {
                if (res.success === 1) {
                    this.cancelRiskCategory();
                    this.addResidualRiskResponse = false;
                    this.saveSuccess("Record updated successfully");
                } else {
                    if (res.error.errorCode === "TOKEN_EXPIRED") {
                        this.utils.relogin(this._document);
                    } else {
                        this.saveResidualRiskResponseError = res.error.errorMessage;
                    }
                    this.CancelRiskCategory(formValue, index);
                }
            }, error => {
                console.log("Error while saving:", error);
                this.saveResidualRiskResponseError = "An error occurred while saving.";
            });
        });
    }

    saveEditedRiskResponsiblePersonData(formValue: any, index: number): void {
        formValue.get('GridRows').at(index).get('isEditable').patchValue(true);
        let data = {
            "residualRiskResponsiblePerson": [{
                "residualriskresponsiblepersonID": formValue.get('GridRows').at(index).get('ResidualRiskResponsiblePersonID')?.value,
                "responsibleperson": formValue.get('GridRows').at(index).get('ResponsiblePerson')?.value,
                "isActive": formValue.get('GridRows').at(index).get('IsActive')?.value
            }]
        }
        this.rcsaMasterService.addNew(data).subscribe(res => {
            next:
            if (res.success == 1) {
                this.cancelResidualRiskResponsiblePerson();
                this.addResidualRiskResponsiblePerson = false;
                this.saveSuccess("Record updated successfully");
            } else {
                if (res.error.errorCode == "TOKEN_EXPIRED")
                    this.utils.relogin(this._document);
                else
                    this.saveResidualRiskResponsiblePersonError = res.error.errorMessage;
                this.cancelResidualRiskResponseTable(formValue, index);
            }
            error:
            console.log("err::", "error");
        });
    }

    saveEditedControlTestResultData(formValue: any, index: number): void {
        const rowvalue = formValue.get('GridRows').at(index).get('ControlTestingResult')?.value;
        let filteredRecords = this.gridDataSourceControlTestResult.filter((ob:any, inx:any) => inx != index);
        this.checkCharLengthDuplicate(rowvalue, 'ControlTestingResult',filteredRecords).then((allowToSave) => {
            if (allowToSave) {
                return;
            }
            formValue.get('GridRows').at(index).get('isEditable').patchValue(true);
            let data = {
                "controltestingresult": [{
                    "controltestingresultID": formValue.get('GridRows').at(index).get('ControlTestingResultID')?.value,
                    "controltestingresult": rowvalue,
                    "isActive": formValue.get('GridRows').at(index).get('IsActive')?.value
                }]
            }
            this.rcsaMasterService.addNew(data).subscribe(res => {
                next:
                if (res.success == 1) {
                    this.cancelControlTestResult();
                    this.addControlTestResult = false;
                    this.saveSuccess("Record updated successfully");
                } else {
                    if (res.error.errorCode == "TOKEN_EXPIRED")
                        this.utils.relogin(this._document);
                    else
                        this.saveControlTestResultError = res.error.errorMessage;
                    this.cancelControlTestResultTable(formValue, index);
                }
                error:
                console.log("err::", "error");
            });

        })
       
    }

    saveEditedActionPlanStatusData(formValue: any, index: number): void {
        const rowvalue = formValue.get('GridRows').at(index).get('ActionPlanStatus')?.value;
        let filteredRecords = this.gridDataSourceActionPlanStatus.filter((ob:any, inx:any) => inx != index);
        this.checkCharLengthDuplicate(rowvalue, 'ActionPlanStatus',filteredRecords).then((allowToSave) => {
            if (allowToSave) {
                return;
            }
            formValue.get('GridRows').at(index).get('isEditable').patchValue(true);
            let data = {
                "actionPlanStatus": [{
                    "actionplanstatusID": formValue.get('GridRows').at(index).get('ActionPlanStatusID')?.value,
                    "actionplanstatus": rowvalue,
                    "isActive": formValue.get('GridRows').at(index).get('IsActive')?.value
                }]
            }
            this.rcsaMasterService.addNew(data).subscribe(res => {
                next:
                if (res.success == 1) {
                    this.cancelActionPlanStatus();
                    this.addActionPlanStatus = false;
                    this.saveSuccess("Record updated successfully");
                } else {
                    if (res.error.errorCode == "TOKEN_EXPIRED")
                        this.utils.relogin(this._document);
                    else
                        this.saveActionPlanStatusError = res.error.errorMessage;
                    this.cancelActionPlanStatusTable(formValue, index);
                }
                error:
                console.log("err::", "error");
            });
        })
        
    }

    saveEditedActionPlanResponsiblePersonData(formValue: any, index: number): void {
        formValue.get('GridRows').at(index).get('isEditable').patchValue(true);
        let data = {
            "actionResponsiblePerson": [{
                "actionresponsiblepersonID": formValue.get('GridRows').at(index).get('ActionResponsiblePersonID')?.value,
                "description": formValue.get('GridRows').at(index).get('Description')?.value,
                "isActive": formValue.get('GridRows').at(index).get('IsActive')?.value
            }]
        }
        this.rcsaMasterService.addNew(data).subscribe(res => {
            next:
            if (res.success == 1) {
                this.cancelActionPlanResponsiblePerson();
                this.addActionPlanResponsiblePerson = false;
                this.saveSuccess("Record updated successfully");
            } else {
                if (res.error.errorCode == "TOKEN_EXPIRED")
                    this.utils.relogin(this._document);
                else
                    this.saveActionPlanResponsiblePersonError = res.error.errorMessage;
                this.cancelActionPlanResponsiblePersonTable(formValue, index);
            }
            error:
            console.log("err::", "error");
        });
    }

    saveEditedActionPlanVerificationData(formValue: any, index: number): void {
        const rowvalue = formValue.get('GridRows').at(index).get('ControlVerificationClosure')?.value;
        let filteredRecords = this.gridDataSourceActionPlanVerification.filter((ob:any, inx:any) => inx != index);
        this.checkCharLengthDuplicate(rowvalue, 'ControlVerificationClosure',filteredRecords).then((allowToSave) => {
            if (allowToSave) {
                return;
            }
            formValue.get('GridRows').at(index).get('isEditable').patchValue(true);
            let data = {
                "controlVerificationClosure": [{
                    "controlverificationclosureID": formValue.get('GridRows').at(index).get('ControlVerificationClosureID')?.value,
                    "controlverificationclosure": rowvalue,
                    "isActive": formValue.get('GridRows').at(index).get('IsActive')?.value
                }]
            }
            this.rcsaMasterService.addNew(data).subscribe(res => {
                next:
                if (res.success == 1) {
                    this.cancelActionPlanVerification();
                    this.addActionPlanVerification = false;
                    this.saveSuccess("Record updated successfully");
                } else {
                    if (res.error.errorCode == "TOKEN_EXPIRED")
                        this.utils.relogin(this._document);
                    else
                        this.saveActionPlanVerificationError = res.error.errorMessage;
                    this.cancelActionPlanVerificationTable(formValue, index);
                }
                error:
                console.log("err::", "error");
            });
        })
        
    }

    saveEditedReviewerData(formValue: any, index: number): void {
        formValue.get('GridRows').at(index).get('isEditable').patchValue(true);
        let data = {
            "reviewers": [{
                "reviewerID": formValue.get('GridRows').at(index).get('ReviewerID')?.value,
                "description": formValue.get('GridRows').at(index).get('Description')?.value,
                "isActive": formValue.get('GridRows').at(index).get('IsActive')?.value
            }]
        }
        this.rcsaMasterService.addNew(data).subscribe(res => {
            next:
            if (res.success == 1) {
                this.cancelReviewer();
                this.addReviewer = false;
                this.saveSuccess("Record updated successfully");
            } else {
                if (res.error.errorCode == "TOKEN_EXPIRED")
                    this.utils.relogin(this._document);
                else
                    this.saveReviewerError = res.error.errorMessage;
                this.cancelReviewerTable(formValue, index);
            }
            error:
            console.log("err::", "error");
        });
    }

    changedResidualRiskResponse(data: any, event: any): void {
        let obj = {
            "residualRiskResponse": [{
                "residualriskresponseID": data.get('ResidualRiskResponseID')?.value,
                "riskresponse": data.get('RiskResponse')?.value,
                "isActive": !data.get('IsActive')?.value
            }]
        }
        this.rcsaMasterService.addNew(obj).subscribe(res => {
            next:
            this.saveResidualRiskResponseError = "";
            if (res.success == 1) {
                this.saveSuccess("Record updated successfully");
            } else {
                if (res.error.errorCode == "TOKEN_EXPIRED")
                    this.utils.relogin(this._document);
                else
                    this.saveResidualRiskResponseError = res.error.errorMessage;
                event.source.checked = !event.source.checked;
            }
            error:
            console.log("err::", "error");
        });
    }

    changedResidualRiskResponsiblePerson(data: any, event: any): void {
        console.log("check data", data);
        let obj = {
            "residualRiskResponsiblePerson": [{
                "residualriskresponsiblepersonID": data.get('ResidualRiskResponsiblePersonID')?.value,
                "userguID": data.get('UserGUID')?.value,
                "responsibleperson": data.get('ResponsiblePerson')?.value,
                "isActive": !data.get('IsActive')?.value
            }]
        }
        console.log("obj", obj);
        this.rcsaMasterService.addNew(obj).subscribe(res => {
            next:
            this.saveResidualRiskResponsiblePersonError = "";
            if (res.success == 1) {
                this.saveSuccess("Record updated successfully");
            } else {
                if (res.error.errorCode == "TOKEN_EXPIRED")
                    this.utils.relogin(this._document);
                else
                    this.saveResidualRiskResponsiblePersonError = res.error.errorMessage;
                event.source.checked = !event.source.checked;
            }
            error:
            console.log("err::", "error");
        });
    }

    changedControlTestResult(data: any, event: any): void {
        let obj = {
            "controltestingresult": [{
                "controltestingresultID": data.get('ControlTestingResultID')?.value,
                "controltestingresult": data.get('ControlTestingResult')?.value,
                "isActive": !data.get('IsActive')?.value
            }]
        }
        this.rcsaMasterService.addNew(obj).subscribe(res => {
            next:
            this.saveControlTestResultError = "";
            if (res.success == 1) {
                this.saveSuccess("Record updated successfully");
            } else {
                if (res.error.errorCode == "TOKEN_EXPIRED")
                    this.utils.relogin(this._document);
                else
                    this.saveControlTestResultError = res.error.errorMessage;
                event.source.checked = !event.source.checked;
            }
            error:
            console.log("err::", "error");
        });
    }

    changedActionStatus(data: any, event: any): void {
        let obj = {
            "actionPlanStatus": [{
                "actionplanstatusID": data.get('ActionPlanStatusID')?.value,
                "actionplanstatus": data.get('ActionPlanStatus')?.value,
                "isActive": !data.get('IsActive')?.value
            }]
        }
        this.rcsaMasterService.addNew(obj).subscribe(res => {
            next:
            this.saveActionPlanStatusError = "";
            if (res.success == 1) {
                this.saveSuccess("Record updated successfully");
            } else {
                if (res.error.errorCode == "TOKEN_EXPIRED")
                    this.utils.relogin(this._document);
                else
                    this.saveActionPlanStatusError = res.error.errorMessage;
                event.source.checked = !event.source.checked;
            }
            error:
            console.log("err::", "error");
        });
    }

    changedActionResponsiblePerson(data: any, event: any): void {
        let obj = {
            "actionResponsiblePerson": [{
                "actionresponsiblepersonID": data.get('ActionResponsiblePersonID')?.value,
                "userguID": data.get('UserGUID')?.value,
                "description": data.get('Description')?.value,
                "isActive": !data.get('IsActive')?.value
            }]
        }
        this.rcsaMasterService.addNew(obj).subscribe(res => {
            next:
            this.saveActionPlanResponsiblePersonError = "";
            if (res.success == 1) {
                this.saveSuccess("Record updated successfully");
            } else {
                if (res.error.errorCode == "TOKEN_EXPIRED")
                    this.utils.relogin(this._document);
                else
                    this.saveActionPlanResponsiblePersonError = res.error.errorMessage;
                event.source.checked = !event.source.checked;
            }
            error:
            console.log("err::", "error");
        });
    }

    changedActionVerification(data: any, event: any): void {
        let obj = {
            "controlVerificationClosure": [{
                "controlverificationclosureID": data.get('ControlVerificationClosureID')?.value,
                "controlverificationclosure": data.get('ControlVerificationClosure')?.value,
                "isActive": !data.get('IsActive')?.value
            }]
        }
        this.rcsaMasterService.addNew(obj).subscribe(res => {
            next:
            this.saveActionPlanVerificationError = "";
            if (res.success == 1) {
                this.saveSuccess("Record updated successfully");
            } else {
                if (res.error.errorCode == "TOKEN_EXPIRED")
                    this.utils.relogin(this._document);
                else
                    this.saveActionPlanVerificationError = res.error.errorMessage;
                event.source.checked = !event.source.checked;
            }
            error:
            console.log("err::", "error");
        });
    }

    changedReviewer(data: any, event: any): void {
        let obj = {
            "reviewers": [{
                "reviewerID": data.get('ReviewerID')?.value,
                "userguID": data.get('UserGUID')?.value,
                "description": data.get('Description')?.value,
                "isActive": !data.get('IsActive')?.value
            }]
        }
        this.rcsaMasterService.addNew(obj).subscribe(res => {
            next:
            this.saveReviewerError = "";
            if (res.success == 1) {
                this.saveSuccess("Record updated successfully");
            } else {
                if (res.error.errorCode == "TOKEN_EXPIRED")
                    this.utils.relogin(this._document);
                else
                    this.saveReviewerError = res.error.errorMessage;
                event.source.checked = !event.source.checked;
            }
            error:
            console.log("err::", "error");
        });
    }


    CancelRiskCategory(formValue: any, i: any) {
        let obj = this.gridDataSourceResidualRiskResponse.find((a: any) => a.ResidualRiskResponseID == formValue.get('GridRows').at(i).get('ResidualRiskResponseID')?.value);
        formValue.get('GridRows').at(i).get('RiskResponse').patchValue(obj?.RiskResponse);
        formValue.get('GridRows').at(i).get('isEditable').patchValue(true);
    }

    cancelRiskCategory(): void {
        this.residualRiskResponseForm.reset();
        this.addResidualRiskResponse = false;
        this.saveResidualRiskResponseError = "";
    }

    // onChangeSelection() {
    //     let cloneData = JSON.parse(JSON.stringify(this.data));
    // }

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
                this.saveResidualRiskResponseError = "";
                this.getPageLoadData();
            }, timeout)
        });
    }

    // isRiskResponseElementTruncated(): boolean {
    //     console.log("element", this.riskResponseElement);
    //     return this.isTextTruncated(this.riskResponseElement);
    // }

    // isTextTruncated(element: ElementRef): boolean {
    //     const e = element.nativeElement;
    //     return e.scrollWidth > e.clientWidth;
    // }

    ngOnInit(): void {
        this.ResidualRiskResponseGridForms = this._formBuilder.group({
            GridRows: this._formBuilder.array([])
        });
        this.ResidualRiskResponsibleForms = this._formBuilder.group({
            GridRows: this._formBuilder.array([])
        })
        this.ControlTestResultForms = this._formBuilder.group({
            GridRows: this._formBuilder.array([])
        })
        this.ActionPlanStatusForms = this._formBuilder.group({
            GridRows: this._formBuilder.array([])
        })
        this.ActionPlanResponsiblePersonForms = this._formBuilder.group({
            GridRows: this._formBuilder.array([])
        })
        this.ActionPlanVerificationForms = this._formBuilder.group({
            GridRows: this._formBuilder.array([])
        })
        this.ReviewerForms = this._formBuilder.group({
            GridRows: this._formBuilder.array([])
        })

        this.getPageLoadData();
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

    async checkCharLengthDuplicate(data: any, type: string,allData:any): Promise<boolean> {
        console.log("allData",allData)
        console.log("data",data)


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

    clearMessage() {
        this.exceedCharLenErr = '';
        this.type = '';
    }

}