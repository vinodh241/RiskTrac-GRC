import { Component, Inject, Input, OnInit } from '@angular/core';
import { UpdateRiskComponent } from './update-risk/update-risk.component';
import { MatDialog } from '@angular/material/dialog';
import { AssessmentRiskListing } from 'src/app/services/site-risk-assessments/assessment-risk-listing.service';
import { AddThreatComponent } from 'src/app/pages/master-data/threat-library/add-threat/add-threat.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { DOCUMENT } from '@angular/common';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { addIndex, dateToYMd, formatTimeZone, stripHtml } from 'src/app/includes/utilities/commonFunctions';
import { SubmitReviewComponent } from 'src/app/core-shared/submit-review/submit-review.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ConfirmDialogComponent } from 'src/app/includes/utilities/popups/confirm/confirm-dialog.component';
import { CommentsPopupComponent } from 'src/app/core-shared/comments-popup/comments-popup.component';

export interface riskListing {
  i: number;
  RiskTitle: string;
  RiskImpactCode: string;
  CategoryName: string;
  InherentRiskName: string;
  ExistingControls: string;
  ResidualRiskName: string;
  TreatmentName: any;
}

export interface threatCategory {
  ThreatCategory: string;
  Responded: number;
}

@Component({
  selector: 'app-assessment-risk-listing',
  templateUrl: './assessment-risk-listing.component.html',
  styleUrls: ['./assessment-risk-listing.component.scss']
})

export class AssessmentRiskListingComponent implements OnInit {
Number(arg0: any) {
throw new Error('Method not implemented.');
}

  @Input() selectedSiteAssessment: any;
  Columnsdisplayed: string[] = ['ThreatCategory', 'Responded']
  columnsDisplayedBC: string[] = ['Index', 'RiskOwner', 'Responded', 'ReviewStatus']
  actionTrail: any[] = []
  riskData = new MatTableDataSource<riskListing>;
  categoryData = new MatTableDataSource<threatCategory>;
  overallCompletedStatus: boolean = false
  isButton: boolean = true;
  displayedColumnsRO: any
  displayedColumns: any
  currentStep: any;
  nextStep: any;
  dueDate: any;
  completedDate: any
  overallStatusId: any;
  overallStatusName: any;
  WorkflowButton: any;
  siteName: any;
  overallProgress: any;
  reviwerStatus: any;
  publishStatus: any;
  TakeReviewStatus: any;
  RevcomntDetails: any;
  assessmentCode: any;
  IsReviewer: any;
  IsSiteAdminHead:any;
  IsBCChampion:any;
  viewAcess:boolean = false;
  viewAcessRisk:boolean = false;
  enableSubmitRiskOwner : boolean = false;
  constructor(
    public dialog: MatDialog,
    public service: AssessmentRiskListing,
    public router: Router,
    public utils: UtilsService,
    public authService: AuthService,
    private readonly activatedRoute: ActivatedRoute,
    @Inject(DOCUMENT) private _document: any
  ) {
    this.authService.activeTab.next("BC");
    this.authService.activeSubTab$.next("site-risk-assessments");
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['SRAID'])
        this.service.selectedSiteAssessment.next(params['SRAID'])
      this.service.getRiskListData();
    });
    this.service.gotRiskListSubj.subscribe((value: any) => {
      if (value) {
        this.riskData = new MatTableDataSource(addIndex(this.service.riskList.siteRiskAssessments, false));
        this.categoryData = new MatTableDataSource(addIndex(this.service.riskList.summary, false));
        console.log('this.categoryData: ', this.categoryData);
        this.siteName               = this.service.riskList?.siteRiskAssessments[0]?.SiteName + '-' + this.service.riskList?.siteRiskAssessments[0]?.AssessmentCode;
        this.overallProgress        = this.service.riskList.overAllProgress[1]?.OverallPercentage
        this.currentStep            = this.service.riskList.workFlowStatus[0]?.CurrentStep;
        this.nextStep               = this.service.riskList.workFlowStatus[0]?.NextStep;
        this.dueDate                = dateToYMd(this.service.riskList.overAllProgress[0].EndDate)
        this.completedDate          = formatTimeZone(dateToYMd(this.service.riskList.overAllProgress[0].CompletedDate))
        this.reviwerStatus          = this.service.riskList.riskOwner[0]?.IsRiskOwner
        this.IsBCChampion           = this.service.riskList.IsBCChampion[0]?.IsBCChampion
        this.IsSiteAdminHead        = this.service.riskList.IsSiteAdminHead[0]?.IsSiteAdminHead
        this.WorkflowButton         = this.service.riskList.workFlowStatus[0]?.WorkFlowButtonName;
        this.overallStatusId        = this.service.riskList.siteRiskAssessments[0]?.StatusID;
        this.overallStatusName      = this.service.riskList.siteRiskAssessments[0]?.Status;
        this.overallCompletedStatus = this.service.riskList.siteRiskAssessments?.every((ob: any) => ob.StatusID == 3)
        this.publishStatus          = this.service.riskList?.summary?.every((x: any) => (x.WorkflowButton == "Publish Risks"))
        this.TakeReviewStatus       = this.service.riskList?.summary?.every((x: any) => (x.WorkflowButton == null || x.WorkflowButton == "Submit Review"))
        this.IsReviewer             = this.service.riskList.reviewer[0]?.IsReviewer;
        this.enableSubmitRiskOwner  = this.service.riskList.IsSubmitForRiskOwner

        if(this.reviwerStatus && this.IsBCChampion){
          this.viewAcessRisk = true
          this.viewAcess = false
        }else if(this.reviwerStatus &&  this.IsSiteAdminHead){
          this.viewAcessRisk = true
          this.viewAcess = false
        }else if(this.reviwerStatus){
          this.viewAcess = true
          this.viewAcessRisk = false
        }else{
          this.viewAcessRisk = true
          this.viewAcess = false
        }

        this.displayedColumns   = ['Position', 'RiskTitle', 'CIA', 'Category', 'InherentRisk', 'ExistingControls', 'ResidualRisk', 'Treatment', 'RiskOwner', 'Responded'];
      }
    })
  }

  get isBtnDisable(): boolean {
    return this.service.riskList?.workFlowStatus?.some((x: any) => (x.NextStep == ''))
  }

  get isAddNewRisk(): boolean {
    return (this.service.riskList && (this.service.riskList?.siteRiskAssessments?.some((x: any) => [1, 2, 5].includes(x.RiskAssessmentStatusID))))
  }

  get isBtnEnableRiskOwner(): boolean {
    return (this.service.riskList && this.service.riskList?.siteRiskAssessments?.some((x: any) => (x.RiskAssessmentStatusID == 2)) && this.enableSubmitRiskOwner)
  }

  get isBtnEnableBCMang(): boolean {
    if(this.IsReviewer){
    let filteredRejectedList: any[] = this.service.riskList?.siteRiskAssessments?.filter((x: any) => !(x.RiskAssessmentStatusID == 6 && x.IsReviewed == true))
    return ((filteredRejectedList?.some((x: any) => [5, 6].includes(x.RiskAssessmentStatusID) && x.IsReviewed == true)) || (filteredRejectedList?.some((x: any) => [1, 2, 3, 4, 7].includes(x.RiskAssessmentStatusID))))
    }else{
      return true
    };
  }

  get isBtnEnabBCMangPublish(): boolean {
    if(this.IsReviewer){
    return (this.service.riskList && this.service.riskList?.summary?.every((x: any) => (x.WorkflowButton == "Publish Risks")))
    }else{
      return false
    }
  }

  // Site Risk Assessment - start

  updateSiteRisk(rowData: any) {
    const dialog = this.dialog.open(UpdateRiskComponent, {
      disableClose: true,
      maxWidth: '100vw',
      width: '89.5vw',
      height: '85vh',
      panelClass: ['site', 'full-screen-modal'],
      data: {
        ThreatRiskIDList: this.riskData.data.map((x: any) => x.ThreatRiskID),
        ScheduleRiskIDList: this.riskData.data.map((x: any) => x.ScheduleRiskAssessmentID),
        allRiskData: this.riskData.data,
        clickedRisk: rowData
      },
    });
    dialog.afterClosed().subscribe((result) => {
      if (result)
        this.service.getRiskListData();
    });
  }

  // Site Risk Assessment - end

  addUpdateRisk(Mode: any, riskdata?: any) {
    const dialog = this.dialog.open(AddThreatComponent, {
      disableClose: true,
      maxWidth: '100vw',
      width: '89.5vw',
      panelClass: ['assessmentList', 'full-screen-modal'],
      data: {
        mode: Mode,
        headerName: (`Site Risk Assessment - ${this.siteName} : ${Mode} Custom Risk`),
        selectedThread: riskdata,
        allTreats: (this.service.riskList['siteRiskAssessments'] || []),
        from: 2
      },
    });
    dialog.afterClosed().subscribe((result) => { });
  }

  navigateToSiteRiskListing() {
    this.service.selectedSiteAssessment.next('');
    this.router.navigate(['site-risk-assessments/site-risk-listing'])
  }

  openSubmitForReview() {
    let reviewData: any;
    let loggedInUserGUID : any = localStorage.getItem("userguid")
    if (this.WorkflowButton == 'Submit For Review') {
      reviewData = {
        isDecision: { required: false, isDropdown: { required: false } },
        dropdownLable: "Review Decision for",
        modalTitle: `Site Risk Assessment - ${this.siteName} : Submit Response for Review`,
        modalBodyTitle: "Please submit the assessment responses for review. Once approved, the site risk assessment report will be published and the action items will become live.",
        commentLabel: "Comment",
        buttonLabel: "Submit for Review",
        getCommentsURL: "/business-continuity-management/site-risk-assessments/get-risk-assessment-action-trail",
        commentsPayload: {
          siteRiskAssessmentId: Number(this.service.selectedSiteAssessment.value)
        },
        submitReviewURL: "/business-continuity-management/site-risk-assessments/submit-risk-response",
        payload: {
          scheduleRiskAssessmentIds: this.riskData.data.filter((x: any) => x.RiskAssessmentStatusID != 6 && loggedInUserGUID == x.RiskOwnerID).map((y: any) => y.ScheduleRiskAssessmentID).join(','),
          siteRiskAssessmentId: Number(this.service.selectedSiteAssessment.value)
        }
      }
    } else if (this.WorkflowButton == 'Take Review Action') {
      reviewData = {
        isDecision: { required: false, isDropdown: { required: false } },
        dropdownLable: "Review Decision for",
        modalTitle: "Site Risk Assessment - Take Review Action",
        modalBodyTitle: "Please provide review decision for this Assessment. If approved, the report will be published and will be accessible to every one. If returned, the Site Champion will receive a notification and will be able to make further changes and submit again",
        commentLabel: "Decision Justification /",
        buttonLabel: "Submit",
        getCommentsURL: "/business-continuity-management/site-risk-assessments/get-risk-assessment-action-trail",
        commentsPayload: {
          siteRiskAssessmentId: Number(this.service.selectedSiteAssessment.value)
        },
        submitReviewURL: "/business-continuity-management/site-risk-assessments/submit-review-risk-response",
        payload: {
          scheduleRiskAssessmentId: Number(this.riskData.data.map((x: any) => x.ScheduleRiskAssessmentID)),
          siteRiskAssessmentId: Number(this.service.selectedSiteAssessment.value)
        }
      }
    } else if (this.WorkflowButton == 'Publish Assessment') {
      reviewData = {
        isDecision: {
          required: true, isDropdown: { required: false }, optionData: [{ id: 1, value: "Publish Site Risk Assessment", class: "greenRadio" }],
        },
        dropdownLable: "Review Decision for",
        modalTitle: "Site Risk Assessment - Finalize",
        modalBodyTitle: "Please provide review decision for this Assessment. If approved, the report will be published and will be accessible to every one. If returned, the Site Champion will receive a notification and will be able to make further changes and submit again",
        commentLabel: "Decision Justification /",
        buttonLabel: "Submit",
        getCommentsURL: "/business-continuity-management/site-risk-assessments/get-risk-assessment-action-trail",
        commentsPayload: {
          siteRiskAssessmentId: Number(this.service.selectedSiteAssessment.value)
        },
        submitReviewURL: "/business-continuity-management/site-risk-assessments/publish-site-assessment",
        payload: {
          scheduleRiskAssessmentId: Number(this.riskData.data.map((x: any) => x.ScheduleRiskAssessmentID)),
          siteRiskAssessmentId: Number(this.service.selectedSiteAssessment.value)
        }
      }
    }
    const dialog = this.dialog.open(SubmitReviewComponent, {
      maxWidth: '100vw',
      width: '89.5vw',
      panelClass: ['assessmentList', 'full-screen-modal'],
      data: reviewData
    });
    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.saveSuccess(this.WorkflowButton == 'Submit For Review' ? "Submitted for Review" : (this.WorkflowButton == 'Take Review Action' ? "Submitted Successfully" : "Published Successfully"));
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
        this.service.getRiskListData();
      }, timeout)
    });
  }

  getStatusColorRiskOwner(status: any): string {
    let statecssclass = '';
    switch (status) {
      case 'New':
        statecssclass = 'deepwhite default';
        break;
      case 'Draft':
        statecssclass = 'deepwhite common';
        break;
      case 'Responded':
        statecssclass = 'deepwhite responded';
        break;
      case 'Approved':
        statecssclass = 'deepwhite responded';
        break;
      case 'Returned With Comment':
        statecssclass = 'deepwhite rejected';
        break;
      case 'Publish Risk':
        statecssclass = 'deepwhite responded';
        break;
      default:
        statecssclass = 'deepwhite';
        break
    }
    return statecssclass;
  }

  getStatusColorBCMang(status: any, data: any): string {
    let statecssclass = '';
    switch (status) {
      case 'New':
        statecssclass = 'deepwhite default';
        break;
      case 'Draft':
        statecssclass = 'deepwhite default';
        break;
      case 'Responded':
        statecssclass = 'deepwhite default';
        break;
      case 'Approved':
        if (status === 'Approved' && data.IsReviewed == false) {
          statecssclass = 'deepwhite responded';
        } else {
          statecssclass = 'deepwhite responded';
        }
        break;
      case 'Returned With Comment':
        if (status === 'Approved' && data.IsReviewed == false) {
          statecssclass = 'deepwhite common';
        } else {
          statecssclass = 'deepwhite rejected';
        }
        break;
      case 'Publish Risk':
        statecssclass = 'deepwhite responded';
        break;
      default:
        statecssclass = 'deepwhite';
        break
    }
    return statecssclass;
  }

  getStatusColor(statusName: string): string {
    if (statusName === 'Review Pending') {
      return 'orange';
    } else if (statusName === 'Approved' || statusName === 'Responded') {
      return 'green';
    } else if (statusName === 'Delayed Response') {
      return 'red';
    } else {
      return 'black';
    }
  }

  getColor(percentage: any) {
   if (percentage <= 25) {
        return 'color-class-1';
    } else if (percentage <= 50) {
        return 'color-class-2';
    } else if (percentage <= 75) {
        return 'color-class-3';
    } else {
        return 'color-class-4';
    }
}


  deleteRisk(data?: any) {
    const confirm = this.dialog.open(ConfirmDialogComponent, {
      id: 'ConfirmDialogComponent',
      disableClose: true,
      minWidth: '300px',
      panelClass: 'dark',
      data: {
        title: 'Confirm Deletion',
        content:
          'This action will permanently delete the record.\nYou may not be able to retrieve it.\n\nDo you still want to delete it?',
      },
    });
    confirm.afterClosed().subscribe((result) => {
      if (result) {
        this.service.deleteRisk(data).subscribe(
          (res: any) => {
            next: this.deleteSuccess();
            error: console.log('err::', 'error');
          }
        );
      }
    });
  }

  deleteSuccess(): any {
    const timeout = 1000; // 1 Seconds
    const confirm = this.dialog.open(InfoComponent, {
      id: "InfoComponent",
      disableClose: true,
      minWidth: "300px",
      panelClass: "success",
      backdropClass: 'static',
      data: {
        title: "Success",
        content: "Threat Library is deleted successfully"
      }
    });
    confirm.afterOpened().subscribe(result => {
      setTimeout(() => {
        confirm.close();
        this.service.getRiskListData();
      }, timeout)
    });
  }

  reviewComments() {
    this.actionTrail = []
    this.service.getReviewComment();
    this.service.gotReviewSubj.subscribe((value: any) => {
      if (value) {
        this.actionTrail = this.service.revcomment.actionTrailList[0]?.CommentsHistory
      }
    });
    setTimeout(() => {
      const info = this.dialog.open(CommentsPopupComponent, {
        disableClose: true,
        minWidth: "35vw",
        maxWidth: "60vw",
        minHeight: "60vh",
        maxHeight: "70vh",
        panelClass: "commentdark",
        data: {
          title: "Review Comments",
          commentData: this.actionTrail.length > 0 ? this.actionTrail : []
        }
      });
    }, 500);
  }

  exportDraft() {
    let ThreatRiskIDList = this.riskData.data.map((x: any) => x.ThreatRiskID);
    let scheduledRiskAssessmentIds = this.riskData.data.map((y: any) => y.ScheduleRiskAssessmentID).join(',')
    this.service.getConsolidatedReportData(this.service.selectedSiteAssessment.value.toString(), ThreatRiskIDList.join(','), scheduledRiskAssessmentIds, '/business-continuity-management/site-risk-assessments/get-site-risk-assessments-draft-report', 2);

    this.service.gotDraftReport.subscribe((value) => {
      if (value) {
        this.service.DownloadReport('Draft_Report');
      }
    });
  }

  getMessage(ele: any) {
    return `Risk owner (${ele.RiskOwner}) is no more in the system. Please reassign the risk (${ele.RiskTitle}) to some active risk owner`;
  }

  getSiteName() {
    return this.siteName
  }

  stripSite(value: any) {
    return value ? stripHtml(value).substring(0, 150) : '';
  }

}
