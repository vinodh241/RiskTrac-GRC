import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FileUploadComponent } from 'src/app/core-shared/file-upload/file-upload.component';
import { SubmitReviewComponent } from 'src/app/core-shared/submit-review/submit-review.component';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { BcmsTestingService } from 'src/app/services/bcms-testing/bcms-testing.service';
import { CkEditorConfigService } from 'src/app/services/ck-editor/ck-editor-config.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-test-observer-report',
  templateUrl: './test-observer-report.component.html',
  styleUrls: ['./test-observer-report.component.scss']
})

export class TestObserverReportComponent implements OnDestroy{
  payload : any;
  BCMSTest: any;

  submitted: boolean = false;
  allSections: any;
  observerForm: FormGroup = new FormGroup({});
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
      if (params['testAssessmentId'] && params['testObserverId'] && params['scheduledTestId']) {
        this.payload = {testAssessmentId: params['testAssessmentId'], testObserverId: params['testObserverId'], scheduledTestId: params['scheduledTestId']}
        this.service.getObserverReportData(this.payload);
      };
    });

    this.service.gotBCMSTestDetails$.subscribe((value: any) => {
      if (value) {
        this.BCMSTest = this.service.testDetails;
      };
    });

    this.service.gotObserverReportData$.subscribe((value: any) => {
      if (value) {
        this.allSections = this.service.testObserverReportQuestions.ObserverReportData;
        this.initiatObserverForm();
        this.fileUploadData = {
          buttonName  : ' Upload',
          apiURL      : '/business-continuity-management/bcms-testing/upload-bcmstest-evidence'
        }
        this.fileUploadData = Object.assign(this.fileUploadData, this.service.testObserverMaster?.AttachmentConfiguration[0]);
      };
    });
  };

  formatedDate(date?:any){
    return this.service.dateToStringWithTimeStamp(date);
  }

  ngOnDestroy() {
    this.payload      = {};
    this.BCMSTest     = {};
    this.submitted    = false;
    this.allSections  = [];
    this.orginalData  = {};
    this.updatedData  = {};
    this.saveerror    = '';
    this.observerForm = new FormGroup({});
    this.service.gotBCMSTestDetails$.next(false);
    this.service.gotObserverReportData$.next(false);
  }

  initiatObserverForm(): void {
    const group: any = {};
    this.allSections.forEach((question: any) => {
      question.QuestionsList.forEach((subQ: any) => {
        if (subQ.hasOwnProperty('CommentType') && subQ.CommentType != null) {
          if (subQ.CommentType == 'ckeditor') {
            group['CommentType' + subQ.QuestionID] = new FormControl(subQ.Responses[0].Comment || '', Validators.required);
          } else {
            group['CommentType' + subQ.QuestionID] = new FormControl(subQ.Responses[0].Comment || '');
          }
        }
        if (subQ.hasOwnProperty('Options') && subQ.Options?.length > 0) {
          const optionControl = new FormControl(Number(subQ.Responses[0].SelectedValue) || '', Validators.required);
          optionControl.valueChanges.subscribe(selectedOptionID => {
            const selectedOption = subQ.Options.find((op: any) => op.OptionID === selectedOptionID);
            const commentControl = this.observerForm.get('CommentType' + subQ.QuestionID);

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
        if (subQ.IsSupportTeam) {
          subQ.SupportTeamList.forEach((team: any) => {
            group['teamsOptions' + team.BusinessApplicationsLNID] = new FormControl(team.SupportLeadRating || null, Validators.required);
          });
        }
      });
    });
    this.observerForm = new FormGroup(group);
    this.orginalData = JSON.parse(JSON.stringify(this.observerForm.value));
    this.orginalData.uploadEvidence = JSON.parse(JSON.stringify(this.service.observerUploadedAttachments.map((x: any) => Number(x.AttachmentID))));
    setTimeout(() => {
      this.intializeCKEditor = true;
    }, 500);

    if(!([2,4,12].includes(this.service.testObserverDetails.TestWorkflowStatusID) && (this.service.testObserverDetails.TestObserverID == this.service.loggedUser)))
      this.observerForm.disable();
  }

  get formControls() {
    return this.observerForm.controls;
  }

  checkPropertyExists(obj: {}, property: string) {
    return obj.hasOwnProperty(property);
  }

  getAlphabet(index: number): string {
    return String.fromCharCode(97 + index);
  }

  saveReportData(from?: any) {
    this.submitted = true;
    if (this.observerForm.invalid) {
      this.markFormGroupTouched(this.observerForm);
      return;
    };

    this.updatedData = JSON.parse(JSON.stringify(this.observerForm.value));
    this.updatedData.uploadEvidence = JSON.parse(JSON.stringify(this.service.observerUploadedAttachments.map((x: any) => Number(x.AttachmentID))));
    if (!this.isFormValueChanged(this.orginalData, this.updatedData)) {
      this.popupInfo("Unsuccessful", "No changes to save");
      return;
    }

    this.service.saveObserverReport(this.payload, this.observerForm.value).subscribe((res: any) => {
      next:
      if (res.success == 1) {
        this.saveSuccess("Report Saved Successfully");
        this.service.processObserverReportData(res);
        if (from == 1) this.scrollIntoView('topSave');
        this.saveerror = '';
      } else {
        if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
          this.utils.relogin(this._document);
        else
          this.saveerror = res.error.errorMessage;
      }
    })
  }

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

  submitObserverReport(user: any) {
    let reviewData = {};
    if (user != 'observer') {            // Reviewer
      let changedPayload = Object.assign(this.payload, {testObserverLnkId: this.service.testObserverDetails.TestObserverLNID, templateId: this.service.testObserverReportQuestions.TemplateID})
      reviewData = {
        isDecision: { required: true, isDropdown: { required: false },
          optionData: [
            { id: 1, value: "Approve and Publish Observer Report", class: "greenRadio" },
            { id: 2, value: "Return with comment", class: "redRadio mt-2" }
          ]
        },
        dropdownLable: "Review Decision",
        modalTitle: `${this.BCMSTest?.TestName} - Observer Report Review`,
        modalBodyTitle: "Please provide review decision for this draft observer report. If approved, the report will be published and will be accessible to everyone. If returned, the Test Observer will receive a notification and will be able to make further changes and submit again.",
        commentLabel: "Decision Justification /",
        buttonLabel: "Submit",
        getCommentsURL: "/business-continuity-management/bcms-testing/get-bcms-review-comments",
        commentsPayload: JSON.parse(JSON.stringify(this.payload)),
        submitReviewURL: "/business-continuity-management/bcms-testing/review-observer-report",
        payload: JSON.parse(JSON.stringify(changedPayload)),
        confirmationRequired: true
      }
    } else {
      this.updatedData = this.observerForm.value;
      this.updatedData.uploadEvidence = JSON.parse(JSON.stringify(this.service.observerUploadedAttachments.map((x: any) => Number(x.AttachmentID))));
      if (this.isFormValueChanged(this.orginalData, this.updatedData) || this.observerForm.invalid) {
        this.popupInfo("Unsuccessful", "Please save report data before submit");
        return;
      } else {
        let changedPayload = Object.assign(this.payload, {testObserverLnkId: this.service.testObserverDetails.TestObserverLNID, templateId: this.service.testObserverReportQuestions.TemplateID});
        reviewData = {
          isDecision: { required: false, isDropdown: { required: false } },
          modalTitle: `${this.BCMSTest?.TestName} - Observer Report Submission`,
          modalBodyTitle: "Please submit the observer report for review by BC Manager. If there are corrections, you will receive notification to update the report with the relevant details.",
          commentLabel: "Comment",
          buttonLabel: "Submit for Review",
          getCommentsURL: "/business-continuity-management/bcms-testing/get-bcms-review-comments",
          commentsPayload: JSON.parse(JSON.stringify(this.payload)),
          submitReviewURL: "/business-continuity-management/bcms-testing/submit-observer-report",
          payload: JSON.parse(JSON.stringify(changedPayload)),
          confirmationRequired: true
        }
      }
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
        this.saveSuccess(!this.service.isBCManager ? "Report Submitted Successfully" : "Provided Review Decision");
        this.service.getObserverReportData(this.payload);
        this.scrollUp('observerReport');
      }
    });
  }

  navigateToTestBCMData(): void {
    this.route.navigate(['bcms-testing/bcms-assessment-details'], { queryParams: { 'BCMSTestID':  this.service.testDetails.TestAssessmentID} });
  };

  // file upload Method- starts
  openFileUploadPopup() {
    const dialog = this.dialog.open(FileUploadComponent, {
      disableClose: true,
      maxWidth: '50vw',
      width: '50vw',
      panelClass: ['full-screen-modal'],
      data: {
        moduleName: 'observerReport',
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
}
