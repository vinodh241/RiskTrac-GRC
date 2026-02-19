import { DOCUMENT } from '@angular/common';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SubmitReviewComponent } from 'src/app/core-shared/submit-review/submit-review.component';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { BcmsTestingService } from 'src/app/services/bcms-testing/bcms-testing.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CkEditorConfigService } from 'src/app/services/ck-editor/ck-editor-config.service';
import { FileUploadComponent } from 'src/app/core-shared/file-upload/file-upload.component';

@Component({
  selector: 'app-test-participant-report',
  templateUrl: './test-participant-report.component.html',
  styleUrls: ['./test-participant-report.component.scss']
})
export class TestParticipantReportComponent implements OnInit, OnDestroy {
  payload : any;
  BCMSTest: any;

  submitted: boolean = false;
  allSections: any;
  participantForm: FormGroup = new FormGroup({});
  orginalData: any = {};
  updatedData: any = {};

  // ckeditor config -- declarations
  ckeConfig: any;
  disabledCkeConfig: any;
  intializeCKEditor: boolean = false;

  // Upload -- Declarations
  fileUploadData: object = {}

  saveerror: any;   // DB Error Massage

  constructor(
    private route: Router,
    private dialog: MatDialog,
    private utils: UtilsService,
    public authService: AuthService,
    public service: BcmsTestingService,
    private activatedRoute: ActivatedRoute,
    @Inject(DOCUMENT) private _document: any,
    private ckEditorService: CkEditorConfigService,
  ) {
    this.authService.activeTab.next("BC");
    this.authService.activeSubTab$.next("bcms-testing");

    this.ckeConfig = JSON.parse(JSON.stringify(this.ckEditorService.getCKEditorConfig()));
    this.disabledCkeConfig = JSON.parse(JSON.stringify(this.ckEditorService.getReadOnlyCKEditorConfig()));
  };

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params: any) => {
      if (params['testAssessmentId'] && params['testParticipantId'] && params['scheduledTestId']) {
        this.payload = {testAssessmentId: params['testAssessmentId'], testParticipantId: params['testParticipantId'], scheduledTestId: params['scheduledTestId']}
        this.service.getParticipantReportData(this.payload);
      };
    });

    this.service.gotBCMSTestDetails$.subscribe((value: any) => {
      if (value) {
        this.BCMSTest = this.service.testDetails;
      };
    });

    this.service.gotParticipantReportData$.subscribe((value: any) => {
      if (value) {
        this.allSections = this.service.testParticipantsReportQuestions.ParticipantReportData;
        this.initiatParticipantForm();
        this.fileUploadData = {
          buttonName  : ' Upload',
          apiURL      : '/business-continuity-management/bcms-testing/upload-bcmstest-evidence'
        }
        this.fileUploadData = Object.assign(this.fileUploadData, this.service.participantMasterData?.AttachmentConfiguration[0]);
      };
    });
  };

  ngOnDestroy() {
    this.payload = {};
    this.BCMSTest = {};
    this.submitted = false;
    this.allSections = [];
    this.participantForm = new FormGroup({});
    this.orginalData = {};
    this.updatedData = {};
    this.service.gotBCMSTestDetails$.next(false);
    this.service.gotParticipantReportData$.next(false);
  }

  initiatParticipantForm(): void {
    const group: any = {};
    this.allSections.forEach((question: any) => {
      question.QuestionsList.forEach((subQ: any) => {
        if (subQ.hasOwnProperty('CommentType')) {
          if (subQ.CommentType == 'ckeditor') {
            group['CommentType' + subQ.QuestionID] = new FormControl(subQ.Responses[0].Comment || '', Validators.required);
          } else {
            group['CommentType' + subQ.QuestionID] = new FormControl(subQ.Responses[0].Comment || '');
          }
        }
        if (subQ.hasOwnProperty('Options')) {
          const optionControl = new FormControl(Number(subQ.Responses[0].SelectedValue) || '', Validators.required);
          optionControl.valueChanges.subscribe(selectedOptionID => {
            const selectedOption = subQ.Options.find((op: any) => op.OptionID === selectedOptionID);
            const commentControl = this.participantForm.get('CommentType' + subQ.QuestionID);

            if (commentControl) {
              if (selectedOption && selectedOption.isCommentMandotory) {
                commentControl.setValidators([Validators.required]);
              } else {
                commentControl.clearValidators();
              }
              commentControl.updateValueAndValidity();
            }
          });

          group['Options' + subQ.QuestionID] = optionControl;
        }
      });
    });
    this.participantForm = new FormGroup(group);
    this.orginalData = JSON.parse(JSON.stringify(this.participantForm.value));
    this.orginalData.uploadEvidence = JSON.parse(JSON.stringify(this.service.participateUploadedAttachments.map((x: any) => Number(x.AttachmentID))));
    setTimeout(() => {
      this.intializeCKEditor = true;
    }, 500);

    if(![1,3,11].includes(this.service.testParticipantDetails.TestWorkflowStatusID) || (this.service.testParticipantDetails.BusinessOwnerGUID == this.service.loggedUser) || this.service.isBCManager)
      this.participantForm.disable();
  }

  get formControls() {
    return this.participantForm.controls;
  }

  checkPropertyExists(obj: {}, property: string) {
    return obj.hasOwnProperty(property);
  }

  saveReportData(from?: any) {
    this.submitted = true;
    if (this.participantForm.invalid) {
      this.markFormGroupTouched(this.participantForm);
      return;
    };

    this.updatedData = JSON.parse(JSON.stringify(this.participantForm.value));
    this.updatedData.uploadEvidence = JSON.parse(JSON.stringify(this.service.participateUploadedAttachments.map((x: any) => Number(x.AttachmentID))));
    if (!this.isFormValueChanged(this.orginalData, this.updatedData)) {
      this.popupInfo("Unsuccessful", "No changes to save");
      return;
    }

    this.service.saveParticipantReport(this.payload, this.participantForm.value).subscribe((res: any) => {
      next:
      if (res.success == 1) {
        this.saveSuccess("Report Saved Successfully");
        this.service.processParticipantReportData(res);
        if(from == 1) this.scrollIntoView('topSave');
        this.saveerror = '';
      } else {
        if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
          this.utils.relogin(this._document);
        else
          this.saveerror = res.error.errorMessage;
      };
    });
  };

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      };
    });
  };

  isFormValueChanged(initialFormValues: any, updatedFormValues: any): boolean {
    for (const key in updatedFormValues) {
      if (updatedFormValues.hasOwnProperty(key)) {
        if ((updatedFormValues[key] !== initialFormValues[key]) && (key !== 'uploadEvidence')) {
          return true;
        } else if (updatedFormValues[key] !== initialFormValues[key] && key === 'uploadEvidence') {
          if (initialFormValues[key].length !== updatedFormValues[key].length || initialFormValues[key].some((item: any) => !updatedFormValues[key].includes(item)) || updatedFormValues[key].some((item: any) => !initialFormValues[key].includes(item)))
            return true;
        }
      }
    }
    return false;
  }

  submitParticipantReport() {
    this.updatedData = this.participantForm.value;
    this.updatedData.uploadEvidence = JSON.parse(JSON.stringify(this.service.participateUploadedAttachments.map((x: any) => Number(x.AttachmentID))));
    if (this.isFormValueChanged(this.orginalData, this.updatedData) || this.participantForm.invalid) {
      this.popupInfo("Unsuccessful", "Please save report data before submit");
    } else {
      let reviewData = {}
      reviewData = {
        isDecision: { required: false, isDropdown: { required: false } },
        modalTitle: `${this.BCMSTest?.TestName} - Participant Report Submission`,
        modalBodyTitle: "Please submit the participant feedback report for review by Business Owner. If there are corrections, you will receive notification to update the report with the relevant details.",
        commentLabel: "Comment",
        buttonLabel: "Submit for Review",
        getCommentsURL: "/business-continuity-management/bcms-testing/get-bcms-review-comments",
        commentsPayload: JSON.parse(JSON.stringify(this.payload)),
        submitReviewURL: "/business-continuity-management/bcms-testing/submit-participant-report",
        payload: Object.assign(JSON.parse(JSON.stringify(this.payload)),{templateId: this.service.testParticipantsReportQuestions.TemplateID}),
        confirmationRequired: true
      }

      const dialog = this.dialog.open(SubmitReviewComponent, {
        maxWidth: '100vw',
        width: '89.5vw',
        panelClass: ['assessmentList', 'full-screen-modal'],
        data: reviewData,
        disableClose: true,
      });
      dialog.afterClosed().subscribe((result) => {
        if (result) {
          this.saveSuccess("Report Submitted Successfully");
          this.scrollUp('ParticipantReport')
          this.service.getParticipantReportData(this.payload);
        }
      });
    };
  }

  navigateToTestBCMData(): void {
    this.route.navigate(['bcms-testing/bcms-assessment-details'], { queryParams: { 'BCMSTestID':  this.service.testDetails.TestAssessmentID} });
  };

  sucessScrollUP(){
    this.scrollUp('ParticipantReport');
  }

  // file upload Method- starts
  openFileUploadPopup() {
    const dialog = this.dialog.open(FileUploadComponent, {
      disableClose: true,
      maxWidth: '50vw',
      width: '50vw',
      panelClass: ['full-screen-modal'],
      data: {
        moduleName: 'participantReport',
        config    : this.fileUploadData
      },
    });
    dialog.afterClosed().subscribe((result) => { });
  }
  // file upload Method- ends

  // Common Methods below (Popup Info, Save Sucess, Auto Scroll) -- start
  popupInfo(title: string, message: string) {
    const timeout = 3000; // 3 seconds
    const confirm = this.dialog.open(InfoComponent, {
      disableClose: true,
      minWidth: "5vh",
      panelClass: "dark",
      data: {
        title: title,
        content: message
      }
    });

    confirm.afterOpened().subscribe(result => {
      setTimeout(() => {
        confirm.close();
      }, timeout)
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

  scrollIntoView(id: any) {
    setTimeout(() => {
      const itemToScrollTo = document.getElementById(id);
      if (itemToScrollTo) {
        itemToScrollTo.scrollIntoView({
          block: 'center',
        });
      }
    }, 100);
  }

  formatedDate(date?:any){
    return this.service.dateToStringWithTimeStamp(date);
  }
}
