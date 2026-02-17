import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ControlFrequencyScoreService } from 'src/app/services/rcsa/master/control-environment/control-frequency-score.service';
import { ControlInPaceService } from 'src/app/services/rcsa/master/control-environment/control-in-pace.service';
import { ControlNatureScoreService } from 'src/app/services/rcsa/master/control-environment/control-nature-score.service';
import { ControlAutomationScoreService } from 'src/app/services/rcsa/master/control-environment/control-automation-score.service';
import { SelfAssessmentsService } from 'src/app/services/rcsa/self-assessments/self-assessments.service';
import { ScheduleAssessmentsService } from 'src/app/services/rcsa/schedule-assessments/schedule-assessments.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { ConfigScoreRatingService } from 'src/app/services/rcsa/master/common/config-score-rating.service';
import { numberFormat } from 'highcharts';
import * as saveAs from 'file-saver';
import { fileNamePattern } from 'src/app/core-shared/commonFunctions';

@Component({
    selector: 'app-new-schedule-self-assessments',
    templateUrl: './new-schedule-self-assessments.component.html',
    styleUrls: ['./new-schedule-self-assessments.component.scss']
})
export class NewScheduleSelfAssessmentsComponent {
    displayedColumns: string[] = ['RCSACode', 'Risk', 'GroupName', 'UnitName', 'RiskCategoryName', 'ProcessName', 'InherentLikelihoodName', 'InherentImpactRatingName', 'OverallInherentRiskRating'];
    dataSource!: MatTableDataSource<any>;
    dataEvidencesSource!: MatTableDataSource<any>;
    dataSourceActionTrail!: MatTableDataSource<any>;
    Evidences: any;
    formData: any;
    saveerror: any;
    reviewerFormDisabled: boolean = false;
    controlAssessmentFormDisabled: boolean = false;
    residualRiskFormDisabled: boolean = false;
    controlTestingFormDisabled: boolean = false;
    actionImplementationFormDisabled: boolean = false;
    savingFormDisabled: boolean = false;
    iSReviewerPanelEnabled: any;
    reqScheduleAssessmentID: any;
    validFileNameErr: boolean = false;

    reviewerForm = new FormGroup({
        txtReviewerRemark: new FormControl('')
    });


    controlAssessmentForm = new FormGroup({
        //ddlControlAssessment: new FormControl(null, [Validators.required]),
        txtControlDescription: new FormControl(null, [Validators.required]),
        ddlControlType: new FormControl(null, [Validators.required]),
        ddlControlinPlace: new FormControl(null, [Validators.required]),
        ddlNatureofControl: new FormControl(null, [Validators.required]),
        ddlAutomation: new FormControl(null, [Validators.required]),
        ddlFrequency: new FormControl(null, [Validators.required]),
    });
    //formValidation = this.controlAssessmentForm.valid;
    residualRiskForm = new FormGroup({
        // ddlRiskResponse: new FormControl(''),
        // ddlResidualRiskResponsePerson: new FormControl(''),
        ddlRiskResponse: new FormControl(null, [Validators.required]),
        ddlResidualRiskResponsePerson: new FormControl(null, [Validators.required]),
    });

    formValidation = this.controlAssessmentForm.valid && this.residualRiskForm.valid;


    controlTestingForm = new FormGroup({
        ddlControlTestResul: new FormControl(''),
        txtcontrolTestingComment: new FormControl(''),
    });

    actionImplementationForm = new FormGroup({

        txtIdentifiedActionComment: new FormControl(null, [Validators.required]),
        txtTimeline: new FormControl(null, [Validators.required]),
        ddlResponsiblePerson: new FormControl(null, [Validators.required]),
        ddlStatus: new FormControl(null, [Validators.required]),
        ddlComments: new FormControl(null, [Validators.required]),
        ddlConfirmation: new FormControl(null, [Validators.required])
    });

    savingForm = new FormGroup({
        txtSavingComment: new FormControl('')
    });

    ScheduleAssessmentId: number = 0;
    controlInPlaceDS: any;
    NatureofControlDS: any;
    AutomationDS: any;
    FrequencyDS: any;
    TimelineDS: any;
    ActionStatusDS: any[] = [];
    ConfirmationDS: any[] = [];
    ControlTestResultDS: any[] = [];
    ResidualRiskResponseDS: any[] = [];
    ResidualRiskResponsePersonDS: any[] = [];
    ActionResponsePersonDS: any[] = [];
    controlTypeDS: any;
    ScheduleInherentRiskIDs: any;
    CurrentArry: number = 0;
    saveFlag: boolean = false;
    selfAssessment: any = [];
    ScheduleInherentRiskStatusIDDB: any;
    UnitNameDB: any;

    constructor(private selfAssessmentsService: SelfAssessmentsService,
        private scheduleAssessmentsService: ScheduleAssessmentsService,
        private configScoreRatingService: ConfigScoreRatingService,

        public utils: UtilsService,
        public dialog: MatDialog,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        @Inject(DOCUMENT) private _document: any
    ) { }

    ngOnInit(): void {

        this.ScheduleAssessmentId = Number(this.activatedRoute.snapshot.params['id'] ?? 0);
        this.pageLoadData();
        console.log(Number(this.ScheduleAssessmentId ?? 0));
        this.ScheduleInherentRiskIDs = JSON.parse(localStorage.getItem('SelfAssessmentDetailsScheduleInherentRiskIDs') ?? '');
        this.CurrentArry = this.ScheduleInherentRiskIDs.indexOf(this.ScheduleAssessmentId);



    }



    Prev() {

        if (this.CurrentArry == 0) {
            this.CurrentArry = this.ScheduleInherentRiskIDs.length - 1;
        }
        else {
            this.CurrentArry--;
        }
        if (this.Evidences > 0) {
            this.saveFlag = true
            console.log("this.saveFlag", this.saveFlag)
        } else {
            this.saveFlag = false
        }
        this.reviewerForm.reset();
        this.ScheduleAssessmentId = this.ScheduleInherentRiskIDs[this.CurrentArry]
        this.pageLoadData();
    }

    Next() {
        if (this.CurrentArry == this.ScheduleInherentRiskIDs.length - 1) {
            this.CurrentArry = 0
        }
        else {
            this.CurrentArry++;
        }

        if (this.Evidences > 0) {
            this.saveFlag = true
            console.log("this.saveFlag", this.saveFlag)
        } else {
            this.saveFlag = false
        }
        this.reviewerForm.reset();
        this.ScheduleAssessmentId = this.ScheduleInherentRiskIDs[this.CurrentArry]
        this.pageLoadData();
    }
    pageLoadData(isupload: boolean = false) {
        if (environment.dummyData) {
            let data = {
                "success": 1,
                "message": "Data fetch from DB successful.",
                "result": {
                    "status": 1,
                    "recordset": {
                        "ControlType": [
                            {
                                "ControlTypeID": 1,
                                "ControlType": "Policy",
                                "IsActive": true,
                                "IsDeleted": false,
                                "CreatedDate": "2022-12-13T11:59:21.757Z",
                                "CreatedBy": "Base Scripts",
                                "LastUpdatedDate": "2022-12-13T11:59:21.757Z",
                                "LastUpdatedBy": null
                            },
                            {
                                "ControlTypeID": 2,
                                "ControlType": "Process",
                                "IsActive": true,
                                "IsDeleted": false,
                                "CreatedDate": "2022-12-13T11:59:28.310Z",
                                "CreatedBy": "Base Scripts",
                                "LastUpdatedDate": "2022-12-13T11:59:28.310Z",
                                "LastUpdatedBy": null
                            },
                            {
                                "ControlTypeID": 3,
                                "ControlType": "System",
                                "IsActive": true,
                                "IsDeleted": false,
                                "CreatedDate": "2022-12-13T11:59:21.757Z",
                                "CreatedBy": "Base Scripts",
                                "LastUpdatedDate": "2022-12-13T11:59:21.757Z",
                                "LastUpdatedBy": null
                            },
                            {
                                "ControlTypeID": 4,
                                "ControlType": "People",
                                "IsActive": true,
                                "IsDeleted": false,
                                "CreatedDate": "2022-12-13T11:59:28.310Z",
                                "CreatedBy": "Base Scripts",
                                "LastUpdatedDate": "2022-12-13T11:59:28.310Z",
                                "LastUpdatedBy": null
                            },
                            {
                                "ControlTypeID": 5,
                                "ControlType": "NA",
                                "IsActive": true,
                                "IsDeleted": false,
                                "CreatedDate": "2022-12-13T11:59:28.310Z",
                                "CreatedBy": "Base Scripts",
                                "LastUpdatedDate": "2022-12-13T11:59:28.310Z",
                                "LastUpdatedBy": null
                            }
                        ],
                        "ControlInPace": [
                            {
                                "ControlInPaceID": 1,
                                "Name": "NA (Not Available)",
                                "IsActive": true,
                                "IsDeleted": false,
                                "CreatedDate": "2022-12-18T13:27:20.477Z",
                                "CreatedBy": "palani",
                                "LastUpdatedDate": "2022-12-19T17:15:16.573Z",
                                "LastUpdatedBy": "456"
                            },
                            {
                                "ControlInPaceID": 2,
                                "Name": "No",
                                "IsActive": true,
                                "IsDeleted": false,
                                "CreatedDate": "2022-12-18T13:27:31.203Z",
                                "CreatedBy": "palani",
                                "LastUpdatedDate": "2022-12-18T13:27:59.937Z",
                                "LastUpdatedBy": ""
                            },
                            {
                                "ControlInPaceID": 3,
                                "Name": "Yes",
                                "IsActive": true,
                                "IsDeleted": false,
                                "CreatedDate": "2022-12-18T13:27:51.833Z",
                                "CreatedBy": "palani",
                                "LastUpdatedDate": "2022-12-19T16:30:58.320Z",
                                "LastUpdatedBy": "456"
                            },
                            {
                                "ControlInPaceID": 4,
                                "Name": "TBD1",
                                "IsActive": true,
                                "IsDeleted": false,
                                "CreatedDate": "2022-12-19T16:59:04.477Z",
                                "CreatedBy": "456",
                                "LastUpdatedDate": "2022-12-24T13:28:53.517Z",
                                "LastUpdatedBy": "456"
                            },
                            {
                                "ControlInPaceID": 5,
                                "Name": "NO",
                                "IsActive": true,
                                "IsDeleted": false,
                                "CreatedDate": "2022-12-21T02:10:22.413Z",
                                "CreatedBy": "456",
                                "LastUpdatedDate": "2022-12-21T02:10:22.413Z",
                                "LastUpdatedBy": null
                            }
                        ],
                        "ControlNatureScore": [
                            {
                                "ControlNatureID": 1,
                                "NatureofControl": "NA (Not Available)",
                                "Score": 1,
                                "IsActive": true,
                                "IsDeleted": false,
                                "CreatedDate": "2022-12-18T13:28:11.943Z",
                                "CreatedBy": "palani",
                                "LastUpdatedDate": "2022-12-19T17:15:20.533Z",
                                "LastUpdatedBy": "456"
                            },
                            {
                                "ControlNatureID": 2,
                                "NatureofControl": "Corrective",
                                "Score": 1,
                                "IsActive": true,
                                "IsDeleted": false,
                                "CreatedDate": "2022-12-18T13:28:22.073Z",
                                "CreatedBy": "palani",
                                "LastUpdatedDate": "2022-12-18T13:28:22.073Z",
                                "LastUpdatedBy": null
                            },
                            {
                                "ControlNatureID": 3,
                                "NatureofControl": "Detective",
                                "Score": 2,
                                "IsActive": true,
                                "IsDeleted": false,
                                "CreatedDate": "2022-12-18T13:28:29.190Z",
                                "CreatedBy": "palani",
                                "LastUpdatedDate": "2022-12-19T16:31:09.073Z",
                                "LastUpdatedBy": "456"
                            },
                            {
                                "ControlNatureID": 4,
                                "NatureofControl": "Preventive",
                                "Score": 3,
                                "IsActive": true,
                                "IsDeleted": false,
                                "CreatedDate": "2022-12-18T13:28:35.453Z",
                                "CreatedBy": "palani",
                                "LastUpdatedDate": "2022-12-18T13:28:48.150Z",
                                "LastUpdatedBy": ""
                            }
                        ],
                        "ControlAutomationScore": [
                            {
                                "ControlAutomationID": 1,
                                "LevelOfControl": "NA (Not Available)",
                                "Score": 1,
                                "IsActive": true,
                                "IsDeleted": false,
                                "CreatedDate": "2022-12-18T13:29:08.737Z",
                                "CreatedBy": "palani",
                                "LastUpdatedDate": "2022-12-21T02:14:23.360Z",
                                "LastUpdatedBy": "456"
                            },
                            {
                                "ControlAutomationID": 2,
                                "LevelOfControl": "Automation is not applicable",
                                "Score": 3,
                                "IsActive": true,
                                "IsDeleted": false,
                                "CreatedDate": "2022-12-18T13:29:16.007Z",
                                "CreatedBy": "palani",
                                "LastUpdatedDate": "2022-12-22T10:39:28.263Z",
                                "LastUpdatedBy": "456"
                            },
                            {
                                "ControlAutomationID": 3,
                                "LevelOfControl": "Manual",
                                "Score": 1,
                                "IsActive": true,
                                "IsDeleted": false,
                                "CreatedDate": "2022-12-18T13:29:24.660Z",
                                "CreatedBy": "palani",
                                "LastUpdatedDate": "2022-12-19T18:43:53.957Z",
                                "LastUpdatedBy": "456"
                            },
                            {
                                "ControlAutomationID": 4,
                                "LevelOfControl": "Semi Automation",
                                "Score": 2,
                                "IsActive": true,
                                "IsDeleted": false,
                                "CreatedDate": "2022-12-18T13:29:36.103Z",
                                "CreatedBy": "palani",
                                "LastUpdatedDate": "2022-12-18T13:35:20.420Z",
                                "LastUpdatedBy": ""
                            },
                            {
                                "ControlAutomationID": 5,
                                "LevelOfControl": "Full Automation",
                                "Score": 3,
                                "IsActive": true,
                                "IsDeleted": false,
                                "CreatedDate": "2022-12-18T13:29:45.363Z",
                                "CreatedBy": "palani",
                                "LastUpdatedDate": "2022-12-18T13:30:53.017Z",
                                "LastUpdatedBy": ""
                            },
                            {
                                "ControlAutomationID": 6,
                                "LevelOfControl": "Automate 123",
                                "Score": 6,
                                "IsActive": true,
                                "IsDeleted": false,
                                "CreatedDate": "2022-12-18T13:36:01.690Z",
                                "CreatedBy": "456",
                                "LastUpdatedDate": "2022-12-24T13:29:16.237Z",
                                "LastUpdatedBy": "456"
                            }
                        ],
                        "ControlFrequencyScore": [
                            {
                                "ControlFrequencyID": 1,
                                "Frequency": "NA (Not Available)1",
                                "Score": 0,
                                "IsActive": true,
                                "IsDeleted": false,
                                "CreatedDate": "2022-12-18T13:29:55.937Z",
                                "CreatedBy": "palani",
                                "LastUpdatedDate": "2022-12-19T17:14:49.350Z",
                                "LastUpdatedBy": "456"
                            },
                            {
                                "ControlFrequencyID": 2,
                                "Frequency": "No",
                                "Score": 0,
                                "IsActive": true,
                                "IsDeleted": false,
                                "CreatedDate": "2022-12-18T13:30:05.310Z",
                                "CreatedBy": "palani",
                                "LastUpdatedDate": "2022-12-18T13:36:42.843Z",
                                "LastUpdatedBy": ""
                            },
                            {
                                "ControlFrequencyID": 3,
                                "Frequency": "Yes",
                                "Score": 1,
                                "IsActive": true,
                                "IsDeleted": false,
                                "CreatedDate": "2022-12-18T13:30:18.710Z",
                                "CreatedBy": "palani",
                                "LastUpdatedDate": "2022-12-18T13:30:30.933Z",
                                "LastUpdatedBy": ""
                            }
                        ],
                        "ActionPlanStatus": [
                            {
                                "ActionPlanStatusID": 1,
                                "ActionPlanStatus": "Open",
                                "IsActive": true,
                                "IsDeleted": false,
                                "CreatedDate": "2022-12-13T11:59:21.757Z",
                                "CreatedBy": "Base Scripts",
                                "LastUpdatedDate": "2022-12-13T11:59:21.757Z",
                                "LastUpdatedBy": null
                            },
                            {
                                "ActionPlanStatusID": 2,
                                "ActionPlanStatus": "Closed",
                                "IsActive": true,
                                "IsDeleted": false,
                                "CreatedDate": "2022-12-13T11:59:28.310Z",
                                "CreatedBy": "Base Scripts",
                                "LastUpdatedDate": "2022-12-13T11:59:28.310Z",
                                "LastUpdatedBy": null
                            },
                            {
                                "ActionPlanStatusID": 3,
                                "ActionPlanStatus": "On-hold",
                                "IsActive": true,
                                "IsDeleted": false,
                                "CreatedDate": "2022-12-13T11:59:36.447Z",
                                "CreatedBy": "Base Scripts",
                                "LastUpdatedDate": "2022-12-13T11:59:36.447Z",
                                "LastUpdatedBy": null
                            }
                        ],
                        "ActionResponsiblePerson": [
                            {
                                "ActionResponsiblePersonID": 1,
                                "UserGUID": "A9A14500-E163-ED11-AA60-000C2990EBB7",
                                "Description": "test@lucidspire.com",
                                "IsActive": true,
                                "IsDeleted": false,
                                "CreatedDate": "2022-12-12T10:29:41.717Z",
                                "CreatedBy": "Base Script",
                                "LastUpdatedDate": "2022-12-12T10:29:41.717Z",
                                "LastUpdatedBy": null
                            },
                            {
                                "ActionResponsiblePersonID": 2,
                                "UserGUID": "AAA14500-E163-ED11-AA60-000C2990EBB7",
                                "Description": "OpsSecurEyes02@lucidspire.com",
                                "IsActive": true,
                                "IsDeleted": false,
                                "CreatedDate": "2022-12-12T10:29:41.717Z",
                                "CreatedBy": "Base Script",
                                "LastUpdatedDate": "2022-12-12T10:29:41.717Z",
                                "LastUpdatedBy": null
                            },
                            {
                                "ActionResponsiblePersonID": 3,
                                "UserGUID": "F492A38B-8265-ED11-AA60-000C2990EBB7",
                                "Description": "harish@lucidspire.com",
                                "IsActive": true,
                                "IsDeleted": false,
                                "CreatedDate": "2022-12-12T10:29:41.717Z",
                                "CreatedBy": "Base Script",
                                "LastUpdatedDate": "2022-12-12T10:29:41.717Z",
                                "LastUpdatedBy": null
                            },
                            {
                                "ActionResponsiblePersonID": 4,
                                "UserGUID": "DF260FCA-8565-ED11-AA60-000C2990EBB7",
                                "Description": "vamshiv@lucidspire.com",
                                "IsActive": true,
                                "IsDeleted": false,
                                "CreatedDate": "2022-12-12T10:29:41.717Z",
                                "CreatedBy": "Base Script",
                                "LastUpdatedDate": "2022-12-12T10:29:41.717Z",
                                "LastUpdatedBy": null
                            },
                            {
                                "ActionResponsiblePersonID": 5,
                                "UserGUID": "233D96CC-8865-ED11-AA60-000C2990EBB7",
                                "Description": "palanis@lucidspire.com",
                                "IsActive": true,
                                "IsDeleted": false,
                                "CreatedDate": "2022-12-12T10:29:41.717Z",
                                "CreatedBy": "Base Script",
                                "LastUpdatedDate": "2022-12-12T10:29:41.717Z",
                                "LastUpdatedBy": null
                            },
                            {
                                "ActionResponsiblePersonID": 6,
                                "UserGUID": "AE98A237-8965-ED11-AA60-000C2990EBB7",
                                "Description": "sangeethar@lucidspire.com",
                                "IsActive": true,
                                "IsDeleted": false,
                                "CreatedDate": "2022-12-12T10:29:41.717Z",
                                "CreatedBy": "Base Script",
                                "LastUpdatedDate": "2022-12-12T10:29:41.717Z",
                                "LastUpdatedBy": null
                            },
                            {
                                "ActionResponsiblePersonID": 7,
                                "UserGUID": "5C8B264D-8E65-ED11-AA60-000C2990EBB7",
                                "Description": "manohar@lucidspire.com",
                                "IsActive": true,
                                "IsDeleted": false,
                                "CreatedDate": "2022-12-12T10:29:41.717Z",
                                "CreatedBy": "Base Script",
                                "LastUpdatedDate": "2022-12-12T10:29:41.717Z",
                                "LastUpdatedBy": null
                            },
                            {
                                "ActionResponsiblePersonID": 8,
                                "UserGUID": "A9A14500-E163-ED11-AA60-000C2990EBB7",
                                "Description": "test@lucidspire.com",
                                "IsActive": true,
                                "IsDeleted": false,
                                "CreatedDate": "2022-12-12T10:29:41.717Z",
                                "CreatedBy": "Base Script",
                                "LastUpdatedDate": "2022-12-12T10:29:41.717Z",
                                "LastUpdatedBy": null
                            },
                            {
                                "ActionResponsiblePersonID": 9,
                                "UserGUID": "AAA14500-E163-ED11-AA60-000C2990EBB7",
                                "Description": "OpsSecurEyes02@lucidspire.com",
                                "IsActive": true,
                                "IsDeleted": false,
                                "CreatedDate": "2022-12-12T10:29:41.717Z",
                                "CreatedBy": "Base Script",
                                "LastUpdatedDate": "2022-12-12T10:29:41.717Z",
                                "LastUpdatedBy": null
                            },
                            {
                                "ActionResponsiblePersonID": 10,
                                "UserGUID": "F492A38B-8265-ED11-AA60-000C2990EBB7",
                                "Description": "harish@lucidspire.com",
                                "IsActive": true,
                                "IsDeleted": false,
                                "CreatedDate": "2022-12-12T10:29:41.717Z",
                                "CreatedBy": "Base Script",
                                "LastUpdatedDate": "2022-12-12T10:29:41.717Z",
                                "LastUpdatedBy": null
                            },
                            {
                                "ActionResponsiblePersonID": 11,
                                "UserGUID": "DF260FCA-8565-ED11-AA60-000C2990EBB7",
                                "Description": "vamshiv@lucidspire.com",
                                "IsActive": true,
                                "IsDeleted": false,
                                "CreatedDate": "2022-12-12T10:29:41.717Z",
                                "CreatedBy": "Base Script",
                                "LastUpdatedDate": "2022-12-12T10:29:41.717Z",
                                "LastUpdatedBy": null
                            },
                            {
                                "ActionResponsiblePersonID": 12,
                                "UserGUID": "233D96CC-8865-ED11-AA60-000C2990EBB7",
                                "Description": "palanis@lucidspire.com",
                                "IsActive": true,
                                "IsDeleted": false,
                                "CreatedDate": "2022-12-12T10:29:41.717Z",
                                "CreatedBy": "Base Script",
                                "LastUpdatedDate": "2022-12-12T10:29:41.717Z",
                                "LastUpdatedBy": null
                            },
                            {
                                "ActionResponsiblePersonID": 13,
                                "UserGUID": "AE98A237-8965-ED11-AA60-000C2990EBB7",
                                "Description": "sangeethar@lucidspire.com",
                                "IsActive": true,
                                "IsDeleted": false,
                                "CreatedDate": "2022-12-12T10:29:41.717Z",
                                "CreatedBy": "Base Script",
                                "LastUpdatedDate": "2022-12-12T10:29:41.717Z",
                                "LastUpdatedBy": null
                            },
                            {
                                "ActionResponsiblePersonID": 14,
                                "UserGUID": "5C8B264D-8E65-ED11-AA60-000C2990EBB7",
                                "Description": "manohar@lucidspire.com",
                                "IsActive": true,
                                "IsDeleted": false,
                                "CreatedDate": "2022-12-12T10:29:41.717Z",
                                "CreatedBy": "Base Script",
                                "LastUpdatedDate": "2022-12-12T10:29:41.717Z",
                                "LastUpdatedBy": null
                            }
                        ],
                        "ControlVerificationClosure": [
                            {
                                "ControlVerificationClosureID": 1,
                                "ControlVerificationClosure": "Yes",
                                "IsActive": true,
                                "IsDeleted": false,
                                "CreatedDate": "2022-12-13T11:59:21.757Z",
                                "CreatedBy": "Base Scripts",
                                "LastUpdatedDate": "2022-12-13T11:59:21.757Z",
                                "LastUpdatedBy": null
                            },
                            {
                                "ControlVerificationClosureID": 2,
                                "ControlVerificationClosure": "No",
                                "IsActive": true,
                                "IsDeleted": false,
                                "CreatedDate": "2022-12-13T11:59:28.310Z",
                                "CreatedBy": "Base Scripts",
                                "LastUpdatedDate": "2022-12-13T11:59:28.310Z",
                                "LastUpdatedBy": null
                            }
                        ],
                        "ResidualRiskResponse": [
                            {
                                "ResidualRiskResponseID": 1,
                                "RiskResponse": "Tolerate",
                                "IsActive": true,
                                "IsDeleted": false,
                                "CreatedDate": "2022-12-13T11:59:21.757Z",
                                "CreatedBy": "Base Scripts",
                                "LastUpdatedDate": "2022-12-13T11:59:21.757Z",
                                "LastUpdatedBy": null
                            },
                            {
                                "ResidualRiskResponseID": 2,
                                "RiskResponse": "Treat",
                                "IsActive": true,
                                "IsDeleted": false,
                                "CreatedDate": "2022-12-13T11:59:28.310Z",
                                "CreatedBy": "Base Scripts",
                                "LastUpdatedDate": "2022-12-13T11:59:28.310Z",
                                "LastUpdatedBy": null
                            },
                            {
                                "ResidualRiskResponseID": 3,
                                "RiskResponse": "Transfer",
                                "IsActive": true,
                                "IsDeleted": false,
                                "CreatedDate": "2022-12-13T11:59:21.757Z",
                                "CreatedBy": "Base Scripts",
                                "LastUpdatedDate": "2022-12-13T11:59:21.757Z",
                                "LastUpdatedBy": null
                            },
                            {
                                "ResidualRiskResponseID": 4,
                                "RiskResponse": "Terminate",
                                "IsActive": true,
                                "IsDeleted": false,
                                "CreatedDate": "2022-12-13T11:59:28.310Z",
                                "CreatedBy": "Base Scripts",
                                "LastUpdatedDate": "2022-12-13T11:59:28.310Z",
                                "LastUpdatedBy": null
                            }
                        ],
                        "ResidualRiskResponsiblePerson": [
                            {
                                "ResidualRiskResponsiblePersonID": 1,
                                "ResponsiblePerson": "Vice President",
                                "IsActive": true,
                                "IsDeleted": false,
                                "CreatedDate": "2022-12-12T10:29:41.717Z",
                                "CreatedBy": "Base Script",
                                "LastUpdatedDate": "2022-12-12T10:29:41.717Z",
                                "LastUpdatedBy": null
                            },
                            {
                                "ResidualRiskResponsiblePersonID": 2,
                                "ResponsiblePerson": "Senior Vice President",
                                "IsActive": true,
                                "IsDeleted": false,
                                "CreatedDate": "2022-12-12T10:29:41.717Z",
                                "CreatedBy": "Base Script",
                                "LastUpdatedDate": "2022-12-12T10:29:41.717Z",
                                "LastUpdatedBy": null
                            },
                            {
                                "ResidualRiskResponsiblePersonID": 3,
                                "ResponsiblePerson": "Director",
                                "IsActive": true,
                                "IsDeleted": false,
                                "CreatedDate": "2022-12-12T10:29:41.717Z",
                                "CreatedBy": "Base Script",
                                "LastUpdatedDate": "2022-12-12T10:29:41.717Z",
                                "LastUpdatedBy": null
                            },
                            {
                                "ResidualRiskResponsiblePersonID": 4,
                                "ResponsiblePerson": "Senior Director",
                                "IsActive": true,
                                "IsDeleted": false,
                                "CreatedDate": "2022-12-12T10:29:41.717Z",
                                "CreatedBy": "Base Script",
                                "LastUpdatedDate": "2022-12-12T10:29:41.717Z",
                                "LastUpdatedBy": null
                            },
                            {
                                "ResidualRiskResponsiblePersonID": 5,
                                "ResponsiblePerson": "Lead",
                                "IsActive": true,
                                "IsDeleted": false,
                                "CreatedDate": "2022-12-12T10:29:41.717Z",
                                "CreatedBy": "Base Script",
                                "LastUpdatedDate": "2022-12-12T10:29:41.717Z",
                                "LastUpdatedBy": null
                            }
                        ],
                        "ControlTestingResult": [
                            {
                                "ControlTestingResultID": 1,
                                "ControlTestingResult": "Successful",
                                "IsActive": true,
                                "IsDeleted": false,
                                "CreatedDate": "2022-12-13T11:59:21.757Z",
                                "CreatedBy": "Base Scripts",
                                "LastUpdatedDate": "2022-12-13T11:59:21.757Z",
                                "LastUpdatedBy": null
                            },
                            {
                                "ControlTestingResultID": 2,
                                "ControlTestingResult": "Unsuccessful",
                                "IsActive": true,
                                "IsDeleted": false,
                                "CreatedDate": "2022-12-13T11:59:28.310Z",
                                "CreatedBy": "Base Scripts",
                                "LastUpdatedDate": "2022-12-13T11:59:28.310Z",
                                "LastUpdatedBy": null
                            }
                        ],
                        "ActionTrailSummary": [
                            {
                                "ScheduleInherentActionTrailID": 31,
                                "ScheduleInherentRiskID": 4,
                                "ScheduleInherentRiskStatusID": 5,
                                "ScheduleInherentStatus": "Approved",
                                "ActionComment": "test",
                                "CreatedBy": "DF260FCA-8565-ED11-AA60-000C2990EBB7",
                                "CreatedDate": "2022-12-25T22:35:15.980Z"
                            }
                        ],
                        "SelfAssessmentInfo": [
                            {
                                "ScheduleAssessmentID": 2,
                                "RCSACode": "RCSA-002",
                                "ScheduleInherentRiskID": 4,
                                "Risk": "Budgets may not be reliable due to lack of periodic review to reflect any vital or unexpected situations that may occur during the year.",
                                "RCSAStatusID": 2,
                                "RCSAStatusName": "In-Progress",
                                "GroupID": 5,
                                "GroupName": "Finance",
                                "UnitID": 10,
                                "UnitName": "Financial Reporting & Planning",
                                "RiskCategoryID": 3,
                                "RiskCategoryName": "Operational",
                                "ProcessID": 6,
                                "ProcessName": "Reporting",
                                "InherentLikelihoodID": 10,
                                "InherentLikelihoodName": "Very Likely",
                                "InherentImpactRatingID": 3,
                                "InherentImpactRatingName": "Moderate",
                                "OverallInherentRiskID": "Moderate Risk",
                                "OverallInherentRiskScore": 12,
                                "OverallInherentRiskRating": "Moderate Risk",
                                "OverallInherentRiskColor": "#ffffff",
                                "ScheduleControlAssessmentAndResidualRiskID": 4,
                                "ControlDescription": "Test",
                                "ControlInPaceID": 3,
                                "ControlInPaceName": "Yes",
                                "ControlTypeID": 1,
                                "ControlTypeName": "Policy",
                                "ControlNatureID": 2,
                                "ControlNatureName": "Corrective",
                                "ControlAutomationID": 6,
                                "ControlAutomationName": "Automate 123",
                                "ControlFrequencyID": 3,
                                "ControlFrequencyName": "Yes",
                                "OverallControlTotalScore": 8,
                                "OverallControlEnvironmentRiskRating": "Ineffective",
                                "OverallControlEnvironmentRatingColourCode": null,
                                "ResidualRiskRating": null,
                                "ResidualRiskRatingColourCode": null,
                                "ResidualRiskResponseID": 2,
                                "ResidualRiskResponseName": "Treat",
                                "ResidualRiskResponsiblePersonID": 1,
                                "ResidualRiskResponsiblePersonName": "Vice President",
                                "ScheduleActionPlanID": 4,
                                "IdentifiedAction": "",
                                "ActionResponsiblePersonID": null,
                                "ActionResponsiblePersonName": null,
                                "Timeline": null,
                                "ActionPlanStatusID": null,
                                "ActionPlanStatusName": null,
                                "ActionPlanComments": "",
                                "ControlVerificationClosureID": null,
                                "ControlVerificationClosureName": null,
                                "ScheduleControlTestingID": 4,
                                "ControlTestingResultID": 1,
                                "ControlTestingResultName": "Successful",
                                "ControlTestingResultComment": "ok",
                                "IsActive": true,
                                "IsDeleted": false,
                                "CreatedBy": "456",
                                "CreatedDate": "2022-12-18T00:45:00.450Z",
                                "LastUpdatedBy": null,
                                "LastUpdatedDate": "2022-12-18T00:45:00.450Z",
                                "MasterInherentRiskID": 4,
                                "SLNO": "FR-004",
                                "ScheduleInherentRiskStatusID": 5,
                                "ScheduleInherentRiskStatusName": "Approved",
                                "ISSubmitEnabled": false,
                                "ISReviewerPanelEnabled": false
                            }
                        ]
                    },
                    "errorMsg": null,
                    "procedureSuccess": true,
                    "procedureMessage": "Self Assessment Summary fetched successfully"
                },
                "token": "q1w2e3r4",
                "error": {
                    "errorCode": null,
                    "errorMessage": null
                }
            };
            if (!isupload) {
                this.getGridData(data);
                this.getControlInPlace(data);
                this.getNatureofControl(data);
                this.getFrequency(data);
                this.getAutomation(data);
                this.getControlType(data);
                //this.getTimeline();
                this.getActionStatus(data);
                this.getActionResponsePerson(data);
                this.getControlTestResult(data);
                this.getActionConfirmation(data);
                this.getResidualRiskResponse(data);
                this.getResidualRiskResponsePerson(data);
                this.getActionTrail(data);
            }
            this.getEvidence(data);
        }
        else {
            let obj = { "id": this.ScheduleAssessmentId };
            this.configScoreRatingService.getDataForManageSelfAssessmentScreen(obj).subscribe(data => {
                next: {
                    if (data.success == 1) {
                        if (!isupload) {
                            this.getGridData(data);
                            this.getControlInPlace(data);
                            this.getNatureofControl(data);
                            this.getFrequency(data);
                            this.getAutomation(data);
                            this.getControlType(data);
                            //this.getTimeline();
                            this.getActionStatus(data);
                            this.getActionResponsePerson(data);
                            this.getControlTestResult(data);
                            this.getActionConfirmation(data);
                            this.getResidualRiskResponse(data);
                            this.getResidualRiskResponsePerson(data);
                            this.getActionTrail(data);

                            // condition to populate previous quarter data/current quarter data.
                            if (
                                data.result.recordset.SelfAssessmentInfo[0].ScheduleInherentRiskStatusName == "New") {

                                this.loadPreviousData();
                            }
                            console.log('data of self assessment : ', data);
                        }
                        this.getEvidence(data);
                    } else {
                        if (data.error.errorCode == "TOKEN_EXPIRED")
                            this.utils.relogin(this._document);
                    }

                }
            });
        }
    }

    getGridData(data: any): void {
        if (data.success == 1) {
            if (data.result.recordset.SelfAssessmentInfo.length > 0) {
                this.iSReviewerPanelEnabled = data.result.recordset.SelfAssessmentInfo[0].ISReviewerPanelEnabled;
                this.reqScheduleAssessmentID = data.result.recordset.SelfAssessmentInfo[0].ScheduleAssessmentID;
                this.ScheduleInherentRiskStatusIDDB = data.result.recordset.SelfAssessmentInfo[0].ScheduleInherentRiskStatusID;
                this.UnitNameDB = data.result.recordset.SelfAssessmentInfo[0].UnitName

                console.log('data.result.recordset.SelfAssessmentInfo[0]: UnitName' + data.result.recordset.SelfAssessmentInfo[0].UnitName)

                if (this.ScheduleInherentRiskStatusIDDB == 5 || this.ScheduleInherentRiskStatusIDDB == 3) {
                    console.log('stayspojsaoish ScheduleInherentRiskStatusIDDB' + this.ScheduleInherentRiskStatusIDDB)
                    this.savingForm.disable();
                    this.controlAssessmentForm.disable();
                    this.residualRiskForm.disable();
                    this.actionImplementationForm.disable();
                    this.actionImplementationForm.disable();
                    this.FileuploadForm.disable();
                    this.controlTestingForm.disable();
                } else {
                    this.savingForm.enable();
                    this.controlAssessmentForm.enable();
                    this.residualRiskForm.enable();
                    this.actionImplementationForm.enable();
                    this.actionImplementationForm.enable();
                    this.FileuploadForm.enable();
                    this.controlTestingForm.enable();
                }

                let docs: any = data.result.recordset.SelfAssessmentInfo;
                if (docs) {
                    this.dataSource = new MatTableDataSource(docs);
                    this.formData = data.result.recordset.SelfAssessmentInfo[0];
                    this.setFormValue();
                    this.savingForm.disabled;
                }
            }
        }
        else {
            if (data.error.errorCode == "TOKEN_EXPIRED")
                this.utils.relogin(this._document);
        }
    }

    getControlInPlace(data: any): void {
        if (data.success == 1) {
            if (data.result.recordset.ControlInPace != null && data.result.recordset.ControlInPace != '' && data.result.recordset.ControlInPace.length > 0) {
                this.controlInPlaceDS = data.result.recordset.ControlInPace;
            }
        } else {
            if (data.error.errorCode == "TOKEN_EXPIRED")
                this.utils.relogin(this._document);
        }
    }

    getNatureofControl(data: any): void {
        if (data.success == 1) {
            if (data.result.recordset.ControlNatureScore != null && data.result.recordset.ControlNatureScore != '' && data.result.recordset.ControlNatureScore.length > 0) {
                this.NatureofControlDS = data.result.recordset.ControlNatureScore;
            }
        } else {
            if (data.error.errorCode == "TOKEN_EXPIRED")
                this.utils.relogin(this._document);
        }
    }

    getFrequency(data: any): void {
        if (data.success == 1) {
            if (data.result.recordset.ControlFrequencyScore != null && data.result.recordset.ControlFrequencyScore != '' && data.result.recordset.ControlFrequencyScore.length > 0) {
                this.FrequencyDS = data.result.recordset.ControlFrequencyScore;
            }
        } else {
            if (data.error.errorCode == "TOKEN_EXPIRED")
                this.utils.relogin(this._document);
        }
    }

    getAutomation(data: any): void {
        if (data.success == 1) {
            if (data.result.recordset.ControlAutomationScore != null && data.result.recordset.ControlAutomationScore != '' && data.result.recordset.ControlAutomationScore.length > 0) {
                this.AutomationDS = data.result.recordset.ControlAutomationScore;
            }
        } else {
            if (data.error.errorCode == "TOKEN_EXPIRED")
                this.utils.relogin(this._document);
        }
    }

    getControlType(data: any): void {
        if (data.success == 1) {
            if (data.result.recordset.ControlType != null && data.result.recordset.ControlType != '' && data.result.recordset.ControlType.length > 0) {
                this.controlTypeDS = data.result.recordset.ControlType;
            }
        } else {
            if (data.error.errorCode == "TOKEN_EXPIRED")
                this.utils.relogin(this._document);
        }
    }

    getActionStatus(data: any): void {

        let selfAssessmentSummaryInfo = {
            CreatedBy: data.result.recordset.SelfAssessmentInfo[0].CreatedBy,
            CreatedDate: data.result.recordset.SelfAssessmentInfo[0].CreatedDate,
            IsActive: data.result.recordset.SelfAssessmentInfo[0].IsActive,
            IsDeleted: data.result.recordset.SelfAssessmentInfo[0].IsDeleted,
            LastUpdatedBy: data.result.recordset.SelfAssessmentInfo[0].LastUpdatedBy,
            LastUpdatedDate: data.result.recordset.SelfAssessmentInfo[0].LastUpdatedDate,
            ActionPlanStatusID: data.result.recordset.SelfAssessmentInfo[0].ActionPlanStatusID,
            ActionPlanStatus: data.result.recordset.SelfAssessmentInfo[0].ActionPlanStatusName
        }

        if (data.success == 1) {
            if (data.result.recordset.SelfAssessmentInfo[0].ScheduleInherentRiskStatusName === "New") {
                this.ActionStatusDS = [];
                if (data.result.recordset.MasterActionPlanStatus != null && data.result.recordset.MasterActionPlanStatus != '' && data.result.recordset.MasterActionPlanStatus.length > 0) {

                    data.result.recordset.MasterActionPlanStatus.forEach((element: any) => {

                        if (element.IsActive == true) {
                            this.ActionStatusDS.push(element);
                            // console.log("Element:" + this.ActionStatusDS)
                        }
                    });

                    // console.log('ActionStatusDS', this.ActionStatusDS);
                }
            } else if (data.result.recordset.SelfAssessmentInfo[0].ScheduleInherentRiskStatusName === "Draft" || data.result.recordset.SelfAssessmentInfo[0].ScheduleInherentRiskStatusName === "Rejected") {
                if (data.result.recordset.MasterActionPlanStatus != null && data.result.recordset.MasterActionPlanStatus != '' && data.result.recordset.MasterActionPlanStatus.length > 0) {
                    this.ActionStatusDS = [];
                    data.result.recordset.MasterActionPlanStatus.forEach((element: any) => {
                        if (element.IsActive == true) {
                            this.ActionStatusDS.push(element);
                        }
                    });
                    var filterActionStatus = this.ActionStatusDS.find(x => x.ActionPlanStatus == selfAssessmentSummaryInfo.ActionPlanStatus);
                    if (filterActionStatus == undefined) {
                        this.ActionStatusDS.push(selfAssessmentSummaryInfo);
                    }


                    console.log('ActionStatusDS', this.ActionStatusDS);
                }


            } else {
                if (data.result.recordset.SelfAssessmentInfo != null && data.result.recordset.SelfAssessmentInfo != '' && data.result.recordset.SelfAssessmentInfo.length > 0) {
                    this.ActionStatusDS.push(selfAssessmentSummaryInfo);
                    console.log('ActionStatusDS', this.ActionStatusDS);
                }

            }
        } else {
            if (data.error.errorCode == "TOKEN_EXPIRED")
                this.utils.relogin(this._document);
        }
    }

    //
    getActionResponsePerson(data: any): void {
        let selfAssessmentSummaryInfo = {
            CreatedBy: data.result.recordset.SelfAssessmentInfo[0].CreatedBy,
            CreatedDate: data.result.recordset.SelfAssessmentInfo[0].CreatedDate,
            IsActive: data.result.recordset.SelfAssessmentInfo[0].IsActive,
            IsDeleted: data.result.recordset.SelfAssessmentInfo[0].IsDeleted,
            LastUpdatedBy: data.result.recordset.SelfAssessmentInfo[0].LastUpdatedBy,
            LastUpdatedDate: data.result.recordset.SelfAssessmentInfo[0].LastUpdatedDate,
            ActionResponsiblePersonID: data.result.recordset.SelfAssessmentInfo[0].ActionResponsiblePersonID,
            Description: data.result.recordset.SelfAssessmentInfo[0].ActionResponsiblePersonName
        }

        console.log('selfAssessmentSummaryInfo', selfAssessmentSummaryInfo);
        if (data.success == 1) {
            console.log(data.result.recordset.SelfAssessmentInfo[0].ScheduleInherentRiskStatusName)
            if (data.result.recordset.SelfAssessmentInfo[0].ScheduleInherentRiskStatusName === "New") {
                this.ActionResponsePersonDS = []
                if (data.result.recordset.MasterActionResponsiblePerson != null && data.result.recordset.MasterActionResponsiblePerson != '' && data.result.recordset.MasterActionResponsiblePerson.length > 0) {
                    data.result.recordset.MasterActionResponsiblePerson.forEach((element: any) => {
                        if (element.IsActive == true) {
                            this.ActionResponsePersonDS.push(element);
                        }
                    });
                }
            } else if (data.result.recordset.SelfAssessmentInfo[0].ScheduleInherentRiskStatusName === "Draft" || data.result.recordset.SelfAssessmentInfo[0].ScheduleInherentRiskStatusName === "Rejected") {
                if (data.result.recordset.MasterActionResponsiblePerson != null && data.result.recordset.MasterActionResponsiblePerson != '' && data.result.recordset.MasterActionResponsiblePerson.length > 0) {
                    this.ActionResponsePersonDS = []
                    data.result.recordset.MasterActionResponsiblePerson.forEach((element: any) => {
                        if (element.IsActive == true) {
                            this.ActionResponsePersonDS.push(element);
                        }
                    });
                    var filterActionResponsiblePerson = this.ActionResponsePersonDS.find(x => x.Description == selfAssessmentSummaryInfo.Description);

                    if (filterActionResponsiblePerson == undefined) {
                        this.ActionResponsePersonDS.push(selfAssessmentSummaryInfo);
                    }
                }
            } else {
                if (data.result.recordset.SelfAssessmentInfo != null && data.result.recordset.SelfAssessmentInfo != '' && data.result.recordset.SelfAssessmentInfo.length > 0) {
                    this.ActionResponsePersonDS.push(selfAssessmentSummaryInfo);
                    console.log('ActionResponsiblePerson', this.ActionResponsePersonDS);
                }
            }
        } else {
            if (data.error.errorCode == "TOKEN_EXPIRED")
                this.utils.relogin(this._document);
        }
    }

    getControlTestResult(data: any): void {

        let selfAssessmentSummaryInfo = {
            CreatedBy: data.result.recordset.SelfAssessmentInfo[0].CreatedBy,
            CreatedDate: data.result.recordset.SelfAssessmentInfo[0].CreatedDate,
            IsActive: data.result.recordset.SelfAssessmentInfo[0].IsActive,
            IsDeleted: data.result.recordset.SelfAssessmentInfo[0].IsDeleted,
            LastUpdatedBy: data.result.recordset.SelfAssessmentInfo[0].LastUpdatedBy,
            LastUpdatedDate: data.result.recordset.SelfAssessmentInfo[0].LastUpdatedDate,
            ControlTestingResultID: data.result.recordset.SelfAssessmentInfo[0].ControlTestingResultID,
            ControlTestingResult: data.result.recordset.SelfAssessmentInfo[0].ControlTestingResultName
        }

        if (data.success == 1) {
            if (data.result.recordset.SelfAssessmentInfo[0].ScheduleInherentRiskStatusName === "New") {
                this.ControlTestResultDS = []
                if (data.result.recordset.MasterControlTestingResult != null && data.result.recordset.MasterControlTestingResult != '' && data.result.recordset.MasterControlTestingResult.length > 0) {

                    data.result.recordset.MasterControlTestingResult.forEach((element: any) => {

                        if (element.IsActive == true) {
                            this.ControlTestResultDS.push(element);
                            // console.log("Element:" + this.ControlTestResultDS)
                        }
                    });

                    // console.log('ControlTestResultDS', this.ControlTestResultDS);
                }
            } else if (data.result.recordset.SelfAssessmentInfo[0].ScheduleInherentRiskStatusName === "Draft" || data.result.recordset.SelfAssessmentInfo[0].ScheduleInherentRiskStatusName === "Rejected") {
                if (data.result.recordset.MasterControlTestingResult != null && data.result.recordset.MasterControlTestingResult != '' && data.result.recordset.MasterControlTestingResult.length > 0) {
                    this.ControlTestResultDS = []
                    data.result.recordset.MasterControlTestingResult.forEach((element: any) => {
                        if (element.IsActive == true) {
                            this.ControlTestResultDS.push(element);
                        }
                    });
                    var filterControlTestResult = this.ControlTestResultDS.find(x => x.ControlTestingResult == selfAssessmentSummaryInfo.ControlTestingResult);
                    if (filterControlTestResult == undefined) {
                        this.ControlTestResultDS.push(selfAssessmentSummaryInfo);
                    }


                    console.log('ControlTestResultDS', this.ControlTestResultDS);
                }


            } else {
                if (data.result.recordset.SelfAssessmentInfo != null && data.result.recordset.SelfAssessmentInfo != '' && data.result.recordset.SelfAssessmentInfo.length > 0) {
                    this.ControlTestResultDS.push(selfAssessmentSummaryInfo);
                    console.log('ControlTestResultDS', this.ControlTestResultDS);
                }

            }
        } else {
            if (data.error.errorCode == "TOKEN_EXPIRED")
                this.utils.relogin(this._document);
        }
    }

    getActionConfirmation(data: any): void {

        let selfAssessmentSummaryInfo = {
            CreatedBy: data.result.recordset.SelfAssessmentInfo[0].CreatedBy,
            CreatedDate: data.result.recordset.SelfAssessmentInfo[0].CreatedDate,
            IsActive: data.result.recordset.SelfAssessmentInfo[0].IsActive,
            IsDeleted: data.result.recordset.SelfAssessmentInfo[0].IsDeleted,
            LastUpdatedBy: data.result.recordset.SelfAssessmentInfo[0].LastUpdatedBy,
            LastUpdatedDate: data.result.recordset.SelfAssessmentInfo[0].LastUpdatedDate,
            ControlVerificationClosureID: data.result.recordset.SelfAssessmentInfo[0].ControlVerificationClosureID,
            ControlVerificationClosure: data.result.recordset.SelfAssessmentInfo[0].ControlVerificationClosureName
        }

        if (data.success == 1) {
            if (data.result.recordset.SelfAssessmentInfo[0].ScheduleInherentRiskStatusName === "New") {
                this.ConfirmationDS = []
                if (data.result.recordset.MasterControlVerificationClosure != null && data.result.recordset.MasterControlVerificationClosure != '' && data.result.recordset.MasterControlVerificationClosure.length > 0) {

                    data.result.recordset.MasterControlVerificationClosure.forEach((element: any) => {
                        if (element.IsActive == true) {
                            this.ConfirmationDS.push(element);
                            // console.log("Element:" + this.ConfirmationDS)
                        }
                    });
                    // console.log('ConfirmationDS', this.ConfirmationDS);
                }
            } else if (data.result.recordset.SelfAssessmentInfo[0].ScheduleInherentRiskStatusName === "Draft" || data.result.recordset.SelfAssessmentInfo[0].ScheduleInherentRiskStatusName === "Rejected") {
                if (data.result.recordset.MasterControlVerificationClosure != null && data.result.recordset.MasterControlVerificationClosure != '' && data.result.recordset.MasterControlVerificationClosure.length > 0) {
                    this.ConfirmationDS = []
                    data.result.recordset.MasterControlVerificationClosure.forEach((element: any) => {
                        if (element.IsActive == true) {
                            this.ConfirmationDS.push(element);
                        }
                    });
                    var filterConfirmation = this.ConfirmationDS.find(x => x.ControlVerificationClosure == selfAssessmentSummaryInfo.ControlVerificationClosure);
                    if (filterConfirmation == undefined) {
                        this.ConfirmationDS.push(selfAssessmentSummaryInfo);
                    }
                    console.log('ConfirmationDS', this.ConfirmationDS);
                }
            } else {
                if (data.result.recordset.SelfAssessmentInfo != null && data.result.recordset.SelfAssessmentInfo != '' && data.result.recordset.SelfAssessmentInfo.length > 0) {
                    this.ConfirmationDS.push(selfAssessmentSummaryInfo);
                    console.log('ConfirmationDS', this.ConfirmationDS);
                }
            }
        } else {
            if (data.error.errorCode == "TOKEN_EXPIRED")
                this.utils.relogin(this._document);
        }
    }

    getResidualRiskResponse(data: any): void {
        let selfAssessmentSummaryInfo = {
            CreatedBy: data.result.recordset.SelfAssessmentInfo[0].CreatedBy,
            CreatedDate: data.result.recordset.SelfAssessmentInfo[0].CreatedDate,
            IsActive: data.result.recordset.SelfAssessmentInfo[0].IsActive,
            IsDeleted: data.result.recordset.SelfAssessmentInfo[0].IsDeleted,
            LastUpdatedBy: data.result.recordset.SelfAssessmentInfo[0].LastUpdatedBy,
            LastUpdatedDate: data.result.recordset.SelfAssessmentInfo[0].LastUpdatedDate,
            ResidualRiskResponseID: data.result.recordset.SelfAssessmentInfo[0].ResidualRiskResponseID,
            RiskResponse: data.result.recordset.SelfAssessmentInfo[0].ResidualRiskResponseName
        }

        if (data.success == 1) {
            if (data.result.recordset.SelfAssessmentInfo[0].ScheduleInherentRiskStatusName === "New") {
                this.ResidualRiskResponseDS = []
                if (data.result.recordset.MasterResidualRiskResponse != null && data.result.recordset.MasterResidualRiskResponse != '' && data.result.recordset.MasterResidualRiskResponse.length > 0) {

                    data.result.recordset.MasterResidualRiskResponse.forEach((element: any) => {

                        if (element.IsActive == true) {
                            this.ResidualRiskResponseDS.push(element);
                            // console.log("Element:" + this.ResidualRiskResponseDS)
                        }
                    });

                    // console.log('ResidualRiskResponseDS', this.ResidualRiskResponseDS);
                }
            } else if (data.result.recordset.SelfAssessmentInfo[0].ScheduleInherentRiskStatusName === "Draft" || data.result.recordset.SelfAssessmentInfo[0].ScheduleInherentRiskStatusName === "Rejected") {
                if (data.result.recordset.MasterResidualRiskResponse != null && data.result.recordset.MasterResidualRiskResponse != '' && data.result.recordset.MasterResidualRiskResponse.length > 0) {
                    this.ResidualRiskResponseDS = []
                    data.result.recordset.MasterResidualRiskResponse.forEach((element: any) => {
                        if (element.IsActive == true) {
                            this.ResidualRiskResponseDS.push(element);
                        }
                    });
                    var filterRiskResponse = this.ResidualRiskResponseDS.find(x => x.RiskResponse == selfAssessmentSummaryInfo.RiskResponse);
                    if (filterRiskResponse == undefined) {
                        this.ResidualRiskResponseDS.push(selfAssessmentSummaryInfo);
                    }


                    console.log('ResidualRiskResponse', this.ResidualRiskResponseDS);
                }


            } else {
                if (data.result.recordset.SelfAssessmentInfo != null && data.result.recordset.SelfAssessmentInfo != '' && data.result.recordset.SelfAssessmentInfo.length > 0) {
                    this.ResidualRiskResponseDS.push(selfAssessmentSummaryInfo);
                    console.log('ResidualRiskResponse', this.ResidualRiskResponseDS);
                }

            }
        } else {
            if (data.error.errorCode == "TOKEN_EXPIRED")
                this.utils.relogin(this._document);
        }
    }

    getResidualRiskResponsePerson(data: any): void {
        let selfAssessmentSummaryInfo = {
            CreatedBy: data.result.recordset.SelfAssessmentInfo[0].CreatedBy,
            CreatedDate: data.result.recordset.SelfAssessmentInfo[0].CreatedDate,
            IsActive: data.result.recordset.SelfAssessmentInfo[0].IsActive,
            IsDeleted: data.result.recordset.SelfAssessmentInfo[0].IsDeleted,
            LastUpdatedBy: data.result.recordset.SelfAssessmentInfo[0].LastUpdatedBy,
            LastUpdatedDate: data.result.recordset.SelfAssessmentInfo[0].LastUpdatedDate,
            ResidualRiskResponsiblePersonID: data.result.recordset.SelfAssessmentInfo[0].ResidualRiskResponsiblePersonID,
            ResponsiblePerson: data.result.recordset.SelfAssessmentInfo[0].ResidualRiskResponsiblePersonName
        }

        console.log('selfAssessmentSummaryInfo', selfAssessmentSummaryInfo);

        if (data.success == 1) {
            console.log(data.result.recordset.SelfAssessmentInfo[0].ScheduleInherentRiskStatusName)
            if (data.result.recordset.SelfAssessmentInfo[0].ScheduleInherentRiskStatusName === "New") {
                this.ResidualRiskResponsePersonDS = []
                if (data.result.recordset.MasterRiskResponsiblePerson != null && data.result.recordset.MasterRiskResponsiblePerson != '' && data.result.recordset.MasterRiskResponsiblePerson.length > 0) {

                    data.result.recordset.MasterRiskResponsiblePerson.forEach((element: any) => {

                        if (element.IsActive == true) {
                            this.ResidualRiskResponsePersonDS.push(element);
                            // console.log("Element:" + this.ResidualRiskResponsePersonDS)
                        }
                    });

                    // console.log('ResidualRiskResponsePersonDS', this.ResidualRiskResponsePersonDS);
                }
            } else if (data.result.recordset.SelfAssessmentInfo[0].ScheduleInherentRiskStatusName === "Draft" || data.result.recordset.SelfAssessmentInfo[0].ScheduleInherentRiskStatusName === "Rejected") {
                if (data.result.recordset.MasterRiskResponsiblePerson != null && data.result.recordset.MasterRiskResponsiblePerson != '' && data.result.recordset.MasterRiskResponsiblePerson.length > 0) {
                    this.ResidualRiskResponsePersonDS = []
                    data.result.recordset.MasterRiskResponsiblePerson.forEach((element: any) => {
                        if (element.IsActive == true) {
                            this.ResidualRiskResponsePersonDS.push(element);
                        }
                    });
                    var filterResponsiblePerson = this.ResidualRiskResponsePersonDS.find(x => x.ResponsiblePerson == selfAssessmentSummaryInfo.ResponsiblePerson);
                    if (filterResponsiblePerson == undefined) {
                        this.ResidualRiskResponsePersonDS.push(selfAssessmentSummaryInfo);
                    }


                    console.log('ResidualRiskResponsiblePerson', this.ResidualRiskResponsePersonDS);
                }


            } else {
                if (data.result.recordset.SelfAssessmentInfo != null && data.result.recordset.SelfAssessmentInfo != '' && data.result.recordset.SelfAssessmentInfo.length > 0) {
                    this.ResidualRiskResponsePersonDS.push(selfAssessmentSummaryInfo);
                    console.log('ResidualRiskResponsiblePerson', this.ResidualRiskResponsePersonDS);
                }

            }

        } else {
            if (data.error.errorCode == "TOKEN_EXPIRED")
                this.utils.relogin(this._document);
        }
    }

    getActionTrail(data: any): void {

        if (data.success == 1) {
            if (data.result.recordset.ActionTrailSummary != null && data.result.recordset.ActionTrailSummary != '' && data.result.recordset.ActionTrailSummary.length > 0) {
                this.dataSourceActionTrail = data.result.recordset.ActionTrailSummary;
            }
            else {
                this.dataSourceActionTrail = new MatTableDataSource<any>;
            }
        } else {
            if (data.error.errorCode == "TOKEN_EXPIRED")
                this.utils.relogin(this._document);
        }
    }

    setPreviousQuaterData(data: any): void {
        if (data.success == 1 && data.result.recordset.prevQuarter.length > 0 && data.result.recordset.SelfAssessmentInfo[0].ScheduleInherentRiskStatusName === "New") {
            console.log('data.result.recordset.prevQuarter[0]: ' + JSON.stringify(data.result.recordset.prevQuarter[0]))
            if (data.result.recordset.prevQuarter[0]?.ControlTypeID) {
                this.controlAssessmentForm.patchValue({ ddlControlType: data.result.recordset.prevQuarter[0].ControlTypeID })
            }
            if (data.result.recordset.prevQuarter[0]?.ControlDescription) {
                this.controlAssessmentForm.patchValue({ txtControlDescription: data.result.recordset.prevQuarter[0]?.ControlDescription })
            }
            // if(data.result.recordset.prevQuarter[0]?.OverallControlEnvironmentRiskRating) {
            //   this.controlAssessmentForm.patchValue({})
            // }
            if (data.result.recordset.prevQuarter[0]?.ControlInPaceID) {
                this.controlAssessmentForm.patchValue({ ddlControlinPlace: data.result.recordset.prevQuarter[0].ControlInPaceID })
            }
            if (data.result.recordset.prevQuarter[0]?.ControlNatureID) {
                this.controlAssessmentForm.patchValue({ ddlNatureofControl: data.result.recordset.prevQuarter[0]?.ControlNatureID })
            }
            if (data.result.recordset.prevQuarter[0].ControlAutomationID) {
                this.controlAssessmentForm.patchValue({ ddlAutomation: data.result.recordset.prevQuarter[0].ControlAutomationID })
            }
            if (data.result.recordset.prevQuarter[0].ControlFrequencyID) {
                this.controlAssessmentForm.patchValue({ ddlFrequency: data.result.recordset.prevQuarter[0].ControlFrequencyID })
            }
            if (data.result.recordset.prevQuarter[0].ResidualRiskResponseID) {
                this.residualRiskForm.patchValue({ ddlRiskResponse: data.result.recordset.prevQuarter[0].ResidualRiskResponseID })
            }
            if (data.result.recordset.prevQuarter[0].ResidualRiskResponsiblePersonID) {
                this.residualRiskForm.patchValue({ ddlResidualRiskResponsePerson: data.result.recordset.prevQuarter[0].ResidualRiskResponsiblePersonID })
                console.log('ddlResidulaRiskResponsePerson : ', data.result.recordset.prevQuarter[0].ResidualRiskResponsiblePersonID);

                // this.controlTestingForm.patchValue({ ddlControlTestResul: data.result.recordset.prevQuarter[0].ControlTestingResultID })
                // console.log('ddlControlTestResul prev : ', data.result.recordset.prevQuarter[0].ControlTestingResultID);
            }
            if (data.result.recordset.prevQuarter[0].ControlTestingResultID) {
                this.controlTestingForm.patchValue({ ddlControlTestResul: data.result.recordset.prevQuarter[0].ControlTestingResultID })
                console.log('ddlControlTestResul prev : ', data.result.recordset.prevQuarter[0].ControlTestingResultID);
            } else {
                this.controlTestingForm.patchValue({ ddlControlTestResul: data.result.recordset.prevQuarter[0].ControlTestingResultID })
                console.log('ddlControlTestResul prev :1 ', data.result.recordset.prevQuarter[0].ControlTestingResultID);
            }
            if (data.result.recordset.prevQuarter[0].ControlTestingResultComment) {
                this.controlTestingForm.patchValue({ txtcontrolTestingComment: data.result.recordset.prevQuarter[0].ControlTestingResultComment })
            }
            if (data.result.recordset.prevQuarter[0].IdentifiedAction) {
                this.actionImplementationForm.patchValue({ txtIdentifiedActionComment: data.result.recordset.prevQuarter[0].IdentifiedAction })
            }
            if (data.result.recordset.prevQuarter[0].Timeline) {
                this.actionImplementationForm.patchValue({ txtTimeline: data.result.recordset.prevQuarter[0].Timeline })
            }
            if (data.result.recordset.prevQuarter[0].ActionPlanStatusID) {
                this.actionImplementationForm.patchValue({ ddlStatus: data.result.recordset.prevQuarter[0].ActionPlanStatusID })
            }
            if (data.result.recordset.prevQuarter[0].ActionResponsiblePersonID) {
                this.actionImplementationForm.patchValue({ ddlResponsiblePerson: data.result.recordset.prevQuarter[0].ActionResponsiblePersonID })
            }
            if (data.result.recordset.prevQuarter[0].ControlVerificationClosureID) {
                this.actionImplementationForm.patchValue({ ddlConfirmation: data.result.recordset.prevQuarter[0].ControlVerificationClosureID })
            }
            if (data.result.recordset.prevQuarter[0].ActionPlanComments) {
                this.actionImplementationForm.patchValue({ ddlComments: data.result.recordset.prevQuarter[0].ActionPlanComments })
            }
            if (data.result.recordset.prevQuarter[0].SelfComment) {
                this.savingForm.patchValue({ txtSavingComment: data.result.recordset.prevQuarter[0].SelfComment })
            }
            if (data.result.recordset.prevQuarter[0].OverallControlEnvironmentRiskRating) {
                this.formData.OverallControlEnvironmentRiskRating = data.result.recordset.prevQuarter[0].OverallControlEnvironmentRiskRating;
                this.formData.OverallControlEnvironmentRatingColourCode = data.result.recordset.prevQuarter[0].OverallControlEnvironmentRatingColourCode;
            }
            if (data.result.recordset.prevQuarter[0].ResidualRiskRating) {
                this.formData.ResidualRiskRating = data.result.recordset.prevQuarter[0].ResidualRiskRating;
                this.formData.ResidualRiskRatingColourCode = data.result.recordset.prevQuarter[0].ResidualRiskRatingColourCode;
            }
        }
        else {
            if (data.result.recordset.SelfAssessmentInfo[0]?.ControlTypeID) {
                this.controlAssessmentForm.patchValue({ ddlControlType: data.result.recordset.SelfAssessmentInfo[0].ControlTypeID })
            }
            if (data.result.recordset.SelfAssessmentInfo[0]?.ControlDescription) {
                this.controlAssessmentForm.patchValue({ txtControlDescription: data.result.recordset.SelfAssessmentInfo[0]?.ControlDescription })
            }

            if (data.result.recordset.SelfAssessmentInfo[0]?.ControlInPaceID) {
                this.controlAssessmentForm.patchValue({ ddlControlinPlace: data.result.recordset.SelfAssessmentInfo[0].ControlInPaceID })
            }
            if (data.result.recordset.SelfAssessmentInfo[0]?.ControlNatureID) {
                this.controlAssessmentForm.patchValue({ ddlNatureofControl: data.result.recordset.SelfAssessmentInfo[0]?.ControlNatureID })
            }
            if (data.result.recordset.SelfAssessmentInfo[0].ControlAutomationID) {
                this.controlAssessmentForm.patchValue({ ddlAutomation: data.result.recordset.SelfAssessmentInfo[0].ControlAutomationID })
            }
            if (data.result.recordset.SelfAssessmentInfo[0].ControlFrequencyID) {
                this.controlAssessmentForm.patchValue({ ddlFrequency: data.result.recordset.SelfAssessmentInfo[0].ControlFrequencyID })
            }
            if (data.result.recordset.SelfAssessmentInfo[0].ResidualRiskResponseID) {
                this.residualRiskForm.patchValue({ ddlRiskResponse: data.result.recordset.SelfAssessmentInfo[0].ResidualRiskResponseID })
            }
            if (data.result.recordset.SelfAssessmentInfo[0].ResidualRiskResponsiblePersonID) {
                this.residualRiskForm.patchValue({ ddlResidualRiskResponsePerson: data.result.recordset.SelfAssessmentInfo[0].ResidualRiskResponsiblePersonID })
                console.log('ddlResidulaRiskResponsePerson : else', data.result.recordset.SelfAssessmentInfo[0].ResidualRiskResponsiblePersonID);
            }
            if (data.result.recordset.SelfAssessmentInfo[0].ControlTestingResultID) {
                this.controlTestingForm.patchValue({ ddlControlTestResul: data.result.recordset.SelfAssessmentInfo[0].ControlTestingResultID })
                console.log('ddlControlTestResul : else', data.result.recordset.SelfAssessmentInfo[0].ControlTestingResultID);
            } else {
                this.controlTestingForm.patchValue({ ddlControlTestResul: data.result.recordset.prevQuarter[0].ControlTestingResultID })
                console.log('ddlControlTestResul prev :1 ', data.result.recordset.prevQuarter[0].ControlTestingResultID);
            }
            if (data.result.recordset.SelfAssessmentInfo[0].ControlTestingResultComment) {
                this.controlTestingForm.patchValue({ txtcontrolTestingComment: data.result.recordset.SelfAssessmentInfo[0].ControlTestingResultComment })
            }
            if (data.result.recordset.SelfAssessmentInfo[0].IdentifiedAction) {
                this.actionImplementationForm.patchValue({ txtIdentifiedActionComment: data.result.recordset.SelfAssessmentInfo[0].IdentifiedAction })
            }
            if (data.result.recordset.SelfAssessmentInfo[0].Timeline) {
                this.actionImplementationForm.patchValue({ txtTimeline: data.result.recordset.SelfAssessmentInfo[0].Timeline })
            }
            if (data.result.recordset.SelfAssessmentInfo[0].ActionPlanStatusID) {
                this.actionImplementationForm.patchValue({ ddlStatus: data.result.recordset.SelfAssessmentInfo[0].ActionPlanStatusID })
            }
            if (data.result.recordset.SelfAssessmentInfo[0].ActionResponsiblePersonID) {
                this.actionImplementationForm.patchValue({ ddlResponsiblePerson: data.result.recordset.SelfAssessmentInfo[0].ActionResponsiblePersonID })
            }
            if (data.result.recordset.SelfAssessmentInfo[0].ControlVerificationClosureID) {
                this.actionImplementationForm.patchValue({ ddlConfirmation: data.result.recordset.SelfAssessmentInfo[0].ControlVerificationClosureID })
            }
            if (data.result.recordset.SelfAssessmentInfo[0].ActionPlanComments) {
                this.actionImplementationForm.patchValue({ ddlComments: data.result.recordset.SelfAssessmentInfo[0].ActionPlanComments })
            }
            if (data.result.recordset.SelfAssessmentInfo[0].SelfComment) {
                this.savingForm.patchValue({ txtSavingComment: data.result.recordset.SelfAssessmentInfo[0].SelfComment })
            }
            if (data.result.recordset.SelfAssessmentInfo[0].OverallControlEnvironmentRiskRating) {
                this.formData.OverallControlEnvironmentRiskRating = data.result.recordset.SelfAssessmentInfo[0].OverallControlEnvironmentRiskRating;
                this.formData.OverallControlEnvironmentRatingColourCode = data.result.recordset.SelfAssessmentInfo[0].OverallControlEnvironmentRatingColourCode;
            }
            if (data.result.recordset.SelfAssessmentInfo[0].ResidualRiskRating) {
                this.formData.ResidualRiskRating = data.result.recordset.SelfAssessmentInfo[0].ResidualRiskRating;
                this.formData.ResidualRiskRatingColourCode = data.result.recordset.SelfAssessmentInfo[0].ResidualRiskRatingColourCode;
            }
        }
    }

    setFormValue(): void {
        this.controlAssessmentForm.patchValue({
            txtControlDescription: this.formData.ControlDescription,
            ddlAutomation: this.formData.ControlAutomationID,
            ddlControlinPlace: this.formData.ControlInPaceID,
            ddlControlType: this.formData.ControlTypeID,
            ddlFrequency: this.formData.ControlFrequencyID,
            ddlNatureofControl: this.formData.ControlNatureID,
        });

        this.controlTestingForm.patchValue({
            ddlControlTestResul: this.formData.ControlTestingResultID,
            txtcontrolTestingComment: this.formData.ControlTestingResultComment,
        });
        this.residualRiskForm.patchValue({
            ddlResidualRiskResponsePerson: this.formData.ResidualRiskResponsiblePersonID,
            ddlRiskResponse: this.formData.ResidualRiskResponseID
        });

        this.actionImplementationForm.patchValue({
            ddlComments: this.formData.ActionPlanComments,
            ddlConfirmation: this.formData.ControlVerificationClosureID,
            ddlResponsiblePerson: this.formData.ActionResponsiblePersonID,
            ddlStatus: this.formData.ActionPlanStatusID,
            txtTimeline: this.formData.Timeline,
            txtIdentifiedActionComment: this.formData.IdentifiedAction,
        });

        this.savingForm.patchValue({
            txtSavingComment: this.formData.SelfComment
        });
    }
    setManageScheduleData(): any {
        let obj = {
            "id": this.ScheduleAssessmentId,
            "scheduleAssessmentID": this.reqScheduleAssessmentID,
            "controlDescription": this.controlAssessmentForm.get('txtControlDescription')?.value,
            "controlAssessmentAndResidualRiskJSONData": {
                "ScheduleControlAssessmentAndResidualRiskID": this.formData.ScheduleControlAssessmentAndResidualRiskID,
                "ControlInPaceID": this.controlAssessmentForm.get('ddlControlinPlace')?.value,
                "ControlAutomationID": this.controlAssessmentForm.get('ddlAutomation')?.value,
                "ControlNatureID": this.controlAssessmentForm.get('ddlNatureofControl')?.value,
                "ControlFrequencyID": this.controlAssessmentForm.get('ddlFrequency')?.value,
                // "ControlDescription": this.controlAssessmentForm.get('txtControlDescription')?.value,
                "ControlTypeID": this.controlAssessmentForm.get('ddlControlType')?.value,
                "ResidualRiskResponseID": this.residualRiskForm.get('ddlRiskResponse')?.value,
                "ResidualRiskResponsiblePersonID": this.residualRiskForm.get('ddlResidualRiskResponsePerson')?.value
            },
            "controlTestingResultComment": this.controlTestingForm.get('txtcontrolTestingComment')?.value,
            "controlTestingJSONData": {
                "ScheduleControlTestingID": this.formData.ScheduleControlTestingID,
                "ControlTestingResultID": this.controlTestingForm.get('ddlControlTestResul')?.value
            },
            "identifiedAction": this.actionImplementationForm.get('txtIdentifiedActionComment')?.value,
            "actionPlanComments": this.actionImplementationForm.get('ddlComments')?.value,
            "scheduleActionPlanJSONData": {
                "ScheduleActionPlanID": this.formData.ScheduleActionPlanID,
                // "Timeline": (this.actionImplementationForm.get('txtTimeline')?.value != null && this.actionImplementationForm.get('txtTimeline')?.value != '') ? this.utils.ignoreTimeZone(this.actionImplementationForm.get('txtTimeline')?.value) : null,
                "Timeline":this.utils.formatTimeZone(this.actionImplementationForm.get('txtTimeline')?.value),
                "ActionPlanStatusID": this.actionImplementationForm.get('ddlStatus')?.value,
                "ControlVerificationClosureID": this.actionImplementationForm.get('ddlConfirmation')?.value,
                "ActionResponsiblePersonID": this.actionImplementationForm.get('ddlResponsiblePerson')?.value
            },
            "selfComment": this.savingForm.get('txtSavingComment')?.value
        };
        return obj;
    }
    saveManageData(): void {
        if (this.controlAssessmentForm.valid && this.residualRiskForm.valid && this.actionImplementationForm.valid) {
            this.saveData(false);
        }
    }
    submitData(): void {

        this.saveData(true);

    }

    saveData(data: any) {
        if (this.canSaveSubmitAccess()) {
            let obj = this.setManageScheduleData();
            obj.unitName = this.UnitNameDB;
            obj.isSubmit = data;

            console.log('this.UnitNameDB: ' + this.UnitNameDB);
            console.log('this.UnitNameDB: obj' + JSON.stringify(obj));
            this.selfAssessmentsService.updateScheduleAssessmentDetails(obj).subscribe(res => {
                next:
                if (res.success == 1) {
                    this.saveSuccess(res.message);

                } else {
                    if (res.error.errorCode == "TOKEN_EXPIRED")
                        this.utils.relogin(this._document);
                    else
                        this.saveError(res.error.errorMessage);
                }
                error:
                console.log("err::", "error");
            });
        }
    }

    //approveScheduleAssessment(data: any) {
    approveScheduleAssessment() {

        let obj = {
            reviewerComment: this.reviewerForm.get('txtReviewerRemark')?.value,
            id: this.ScheduleAssessmentId,
            scheduleInherentRiskStatusID: this.formData.ScheduleInherentRiskStatusID
        };
        this.selfAssessmentsService.scheduleAssessmentApproved(obj).subscribe(res => {
            next:
            if (res.success == 1) {
                this.saveSuccess(res.message);
            } else {
                if (res.error.errorCode == "TOKEN_EXPIRED")
                    this.utils.relogin(this._document);
                else
                    this.saveError(res.error.errorMessage);
            }
            error:
            console.log("err::", "error");
        });
    }

    //RejectScheduleAssessment(data: any) {
    RejectScheduleAssessment() {

        if (this.reviewerForm.get('txtReviewerRemark')?.value != '' && this.reviewerForm.get('txtReviewerRemark')?.value != null) {
            let obj = {
                reviewerComment: this.reviewerForm.get('txtReviewerRemark')?.value,
                id: this.ScheduleAssessmentId,
                scheduleInherentRiskStatusID: this.formData.ScheduleInherentRiskStatusID,
            };




            this.selfAssessmentsService.scheduleAssessmentRejected(obj).subscribe(res => {
                next:
                if (res.success == 1) {
                    this.saveSuccess(res.message);
                    this.reviewerForm.reset();
                } else {
                    if (res.error.errorCode == "TOKEN_EXPIRED")
                        this.utils.relogin(this._document);
                    else
                        this.saveerror = res.error.errorMessage;
                }
                error:
                console.log("err::", "error");
            });
        }
        else {
            this.saveError("Please enter the reviewer comments");
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
                this.pageLoadData();
                confirm.close();
            }, timeout)
        });
    }

    saveFileSuccess(content: string): void {
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
                this.pageLoadData(true);
                confirm.close();
            }, timeout)
        });
    }

    saveError(content: string): void {
        const timeout = 3000; // 3 Seconds
        const confirm = this.dialog.open(InfoComponent, {
            id: "InfoComponent",
            disableClose: true,
            minWidth: "5vh",
            panelClass: "error",
            data: {
                title: "Failed",
                content: content
            }
        });

        confirm.afterOpened().subscribe(result => {
            setTimeout(() => {
                confirm.close();

            }, timeout)
        });
    }

    ErrorResponse(content: string): void {
        const timeout = 3000; // 3 Seconds
        const confirm = this.dialog.open(InfoComponent, {
            id: "InfoComponent",
            disableClose: true,
            minWidth: "5vh",
            panelClass: "error",
            data: {
                title: "error",
                content: content
            }
        });

        confirm.afterOpened().subscribe(result => {
            setTimeout(() => {
                confirm.close();
            }, timeout)
        });
    }

    getTimeline(): void {
        if (environment.dummyData) {
            let data = {
                "success": true,
                "message": "Schedule Assessment Period fetched successfully",
                "result": {
                    "status": 1,
                    "recordset": [
                        {
                            "SchedulePeriod": "Quarter 4, 2022"
                        },
                        {
                            "SchedulePeriod": "Quarter 1, 2023"
                        },
                        {
                            "SchedulePeriod": "Quarter 2, 2023"
                        },
                        {
                            "SchedulePeriod": "Quarter 3, 2023"
                        }
                    ],
                    "errorMsg": null,
                    "procedureSuccess": true,
                    "procedureMessage": "Schedule Assessment Period fetched successfully"
                },
                "token": "q1w2e3r4",
                "error": {
                    "errorCode": null,
                    "errorMessage": null
                }
            };
            this.processTimeline(data);
        } else {
            this.scheduleAssessmentsService.getSchedulePeriod().subscribe(res => {
                next:
                this.processTimeline(res);
            });
        }

    }
    processTimeline(data: any): void {
        if (data.success == 1) {
            if (data.result.recordset.length > 0) {
                this.TimelineDS = data.result.recordset;
            }
        } else {
            if (data.error.errorCode == "TOKEN_EXPIRED")
                this.utils.relogin(this._document);
        }
    }

    canSaveSubmitAccess(): boolean {
        let result = false;
        if (this.utils.isStandardUser()) {
            result = false
        } else if (this.ScheduleInherentRiskStatusIDDB == 5 || this.ScheduleInherentRiskStatusIDDB == 3) {
            result = false
        } else {
            result = true;
        }
        //   result =  this.utils.isPowerUser() && !this.utils.isRiskManagementUnit();
        return result;
    }


    FileuploadForm = new FormGroup({
        display: new FormControl('')
    });


    file_store: any = [];
    file_list: Array<string> = [];

    selectFile(event: any): void {

        if (event.files.length) {
            const f = event.files[0];
            if (f.size < 10000 * 1024) {
                this.file_store = { ...event.files };
            }
            else {
                this.file_store = [];
                this.FileuploadForm.patchValue({ display: '' });
                this.saveError("Selected File size should not more than 10 MB. ")
            }
            if (fileNamePattern(`${f.name}`)) {
                this.validFileNameErr = true;
            } else {
                this.validFileNameErr = false;
            }
            const count = event.files.length > 1 ? `(+${event.files.length - 1} files)` : "";
            this.FileuploadForm.patchValue({ display: `${f.name}${count}` });
        } else {
            this.FileuploadForm.patchValue({ display: '' });
            this.file_store = [];
        }
        event.value = "";
    }
    // selectFile(event: any): void {
    //     if (event.files.length) {
    //       const f = event.files[0];
    //       if (f.size < 10000 * 1024) {
    //         this.file_store = { ...event.files };
    //         this.FileuploadForm.get('display')?.setErrors(null);
    //       } else {
    //         this.file_store = [];
    //         this.FileuploadForm.patchValue({ display: '' });
    //         this.saveError("Selected File size should not be more than 10 MB.");
    //         this.FileuploadForm.get('display')?.setErrors({ invalidSize: true });
    //       }
    //       const count = event.files.length > 1 ? `(+${event.files.length - 1} files)` : '';
    //       this.FileuploadForm.patchValue({ display: `${f.name}${count}` });
    //     } else {
    //       this.FileuploadForm.patchValue({ display: '' });
    //       this.file_store = [];
    //     }
    //     event.value = '';
    //   }

    upload(): void {
        var fd = new FormData();
        this.file_list = [];
        // for (let i = 0; i < this.file_store.length; i++) {
        fd.append("UploadFile", this.file_store[0], this.file_store[0].name);
        this.file_list.push(this.file_store[0].name);
        // }
        fd.append("id", this.ScheduleAssessmentId.toString())
        this.selfAssessmentsService.uploadSelfAssessmentEvidence(fd).subscribe(res => {
            next:
            if (res.success == 1) {
                this.file_store = [];
                this.saveFileSuccess(res.message);
                // this.FileuploadForm.reset();
                // this.savingForm.reset();
                // console.log(this.FileuploadForm.valid);
                console.log(this.formData?.ISSaveEnabled && this.canSaveSubmitAccess() && !(this.controlAssessmentForm.valid && this.residualRiskForm.valid && this.actionImplementationForm.valid))

            } else {
                if (res.error.errorCode == "TOKEN_EXPIRED")
                    this.utils.relogin(this._document);
                else
                    this.saveError(res.error.errorMessage);
            }
            error:
            console.log("err::", "error");
        });
    }
    downloadEvidence(fileId: any) {
        let data = { "evidenceID": fileId };
        this.selfAssessmentsService.downloadSelfAssessmentEvidence(data).subscribe(res => {
            next:
            if (res.success == 1) {
                const FileType = res["result"].fileData[0].FileContent.type;
                const TYPED_ARRAY = new Uint8Array(res.result.fileData[0].FileContent.data);
                const base64String = window.btoa(new Uint8Array(TYPED_ARRAY).reduce(function (data, byte) {
                    return data + String.fromCharCode(byte);
                }, ''));
                const fileMetaType = res.FileType;
                const blobData = this.convertBase64ToBlobData(base64String, fileMetaType);
                const blob = new Blob([blobData], { type: fileMetaType });
                saveAs(blob, res.result.fileData[0].OriginalFileName)
                this.saveFileSuccess(res.message);
            } else {
                if (res.error.errorCode == "TOKEN_EXPIRED")
                    this.utils.relogin(this._document);
                else
                    this.saveError(res.error.errorMessage);
            }
            error:
            console.log("err::", "error");
        });
    }

    convertBase64ToBlobData(base64Data: any, contentType: string) {
        contentType = contentType || '';
        let sliceSize = 1024;
        let byteCharacters = window.atob(decodeURIComponent(base64Data));
        let bytesLength = byteCharacters.length;
        let slicesCount = Math.ceil(bytesLength / sliceSize);
        let byteArrays = new Array(slicesCount);
        for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
            let begin = sliceIndex * sliceSize;
            let end = Math.min(begin + sliceSize, bytesLength);

            let bytes = new Array(end - begin);
            for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
                bytes[i] = byteCharacters[offset].charCodeAt(0);
            }
            byteArrays[sliceIndex] = new Uint8Array(bytes);
        }
        return new Blob(byteArrays, { type: contentType });
    }

    deleteEvidence(fileId: any) {
        if ((this.formData.ISSaveEnabled && this.canSaveSubmitAccess())) {
            let data = { "evidenceID": fileId };
            this.selfAssessmentsService.deleteSelfAssessmentEvidence(data).subscribe(res => {
                next:
                if (res.success == 1) {
                    this.saveFileSuccess(res.message);
                    if (this.Evidences > 0) {
                        this.saveFlag = true
                        console.log("this.saveFlag", this.saveFlag)
                    } else {
                        this.saveFlag = false
                    }
                } else {
                    if (res.error.errorCode == "TOKEN_EXPIRED")
                        this.utils.relogin(this._document);
                    else
                        this.saveError(res.error.errorMessage);
                }

                error:
                console.log("err::", "error");
            });
        }
    }

    getEvidence(data: any): void {
        this.FileuploadForm.patchValue({ display: '' });
        if (data.success == 1) {
            if (data.result.recordset.Evidence != null && data.result.recordset.Evidence != '' && data.result.recordset.Evidence.length > 0) {
                this.Evidences = data.result.recordset.Evidence;
                this.dataEvidencesSource = data.result.recordset.Evidence;
                if (data.result.recordset.Evidence.length > 0) {
                    this.saveFlag = true
                    console.log("this.saveFlag", this.saveFlag)
                } else {
                    this.saveFlag = false
                }
                console.log('evidence', this.formData?.ISSaveEnabled, this.canSaveSubmitAccess(), this.controlAssessmentForm.valid, this.residualRiskForm.valid, this.actionImplementationForm.valid, this.FileuploadForm.valid)
            }
            else {
                this.dataEvidencesSource = new MatTableDataSource<any>;
            }
        } else {
            if (data.error.errorCode == "TOKEN_EXPIRED")
                this.utils.relogin(this._document);
        }

    }

    navigateToPreviousPage() {
        this.router.navigateByUrl('self-assessments/' + this.formData.ScheduleAssessmentID);
    }

    // load previous quarter data function
    loadPreviousData() {
        let obj = { id: this.ScheduleAssessmentId };
        this.configScoreRatingService
            .getDataForManageSelfAssessmentScreen(obj)
            .subscribe((data) => {

                this.setPreviousQuaterData(data);
                this.selfAssessment = data
            });
    }

}


