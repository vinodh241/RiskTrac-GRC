import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { BusinessContinuityPlansService } from 'src/app/services/business-continuity-plans/business-continuity-plans.service';
import { InitiateBCPComponent } from './initiate-bcp/initiate-bcp.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth/auth.service';
import { addIndex, formatTimeZone, searchBy, sortBy } from 'src/app/includes/utilities/commonFunctions';
import { Router } from '@angular/router';
import { CommentsPopupComponent } from 'src/app/core-shared/comments-popup/comments-popup.component';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { SubmitReviewCommentsComponent } from 'src/app/core-shared/submit-review-comments/submit-review-comments.component';
import { ConsolidatedReportService } from 'src/app/services/common-module/consolidated-report/consolidated-report.service';
import { ConsolidatedReportComponent } from 'src/app/core-shared/consolidated-report/consolidated-report.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-business-continuity-listing',
  templateUrl: './business-continuity-listing.component.html',
  styleUrls: ['./business-continuity-listing.component.scss']
})

export class BusinessContinuityListingComponent {

  dataSource = new MatTableDataSource<Element>();
  displayedColumns: string[] = ['Index', 'businessFunction', 'group', 'mtpd', 'rto', 'rpo', 'bcc', 'docStatus', 'nextReview', 'ReviewStatus', 'biaRating', 'action'];
  assessmentStatusIds: any[] = [];
  customFilterFields: any[] = ['DocStatusID'];
  allData: any;
  publishedCount: any;
  dueCount: any;
  inProgressCount: any;
  overdue: any;
  filterValue: any;
  searchFields: any;
  IsBCManager: any;
  IsBusinessOwner: any;
  IsBCCUser: any;
  BusinessContinuityPlanID: any;
  BusinessFunctionName: any;
  FBCCName: any;
  BusinessGroup: any;
  BCCName: any;
  commentList: any;
  scheduled: any;
  exportedFileLimit: any

  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    public businessContinuityService: BusinessContinuityPlansService,
    private router: Router,
    public consolidatedService: ConsolidatedReportService,
    private translate: TranslateService
  ) {
    this.authService.activeTab.next("BC");
    this.authService.activeSubTab$.next("business-continuity-plan");
    this.businessContinuityService.getBusinessContinuityList();
    this.businessContinuityService.gotMaster.subscribe((value) => {
      this.dataSource = this.businessContinuityService.masterData?.BusinessContinuityPlansList.filter((ele:any)=> ele.DocStatusID == 3) || [];
      console.log('this.dataSource: ', this.dataSource);
      this.allData = this.businessContinuityService.masterData?.BusinessContinuityPlansList || [];
      this.IsBCManager = this.businessContinuityService.masterData?.IsBCManager;
      this.IsBCCUser = this.businessContinuityService.masterData?.IsBCCUser;
      this.IsBusinessOwner = this.businessContinuityService.masterData?.IsBusinessOwner;
      this.publishedCount = this.allData?.filter((ele: any) => ele.DocStatusID == 3)?.length
      this.scheduled = this.allData?.filter((ele: any) => ele.DocStatusID == 1)?.length
      this.inProgressCount = this.allData?.filter((ele: any) => ele.DocStatusID == 2)?.length
      this.overdue = this.allData?.filter((ele: any) => ele.DocStatusID == 1)?.length
      this.exportedFileLimit = this.businessContinuityService.masterData?.ExportFileLimit || null
    })
  }

  initiateBCP() {
    const dialog = this.dialog.open(InitiateBCPComponent, {
      disableClose: true,
      maxWidth: '63vw',
      panelClass: ['bussfun', 'full-screen-modal'],
      data: {},
    });
    dialog.afterClosed().subscribe((result) => { });
  }

  applyFilter(event: Event) {
    let allData = this.businessContinuityService.masterData['BusinessContinuityPlansList'].filter((ele:any)=> ele.DocStatusID == 3) || []
    const filterValue = (event.target as HTMLInputElement).value;
    const searchFields: any = [
      'BusinessFunctionName',
      'BusinessGroup',
      'MTPDValue',
      'RTOValue',
      'RPOValue',
      'FBCCName',
      'BCCName',
      'DocStatus',
      'NextReviewDate',
      'FinalDate',
      'BIARating',
      'CurrentWorkflowStatus'
    ];
    this.dataSource = addIndex(JSON.parse(JSON.stringify(searchBy(filterValue, searchFields, allData, this.customFilterFields, this.assessmentStatusIds))), false)
    console.log('this.dataSource: ', this.dataSource);
  }

  underReview() {
    this.router.navigate(['business-continuity-plan/bcp-under-review'])
  }

  select(item?: any) {
    this.businessContinuityService.selectedBusinessContinuityID.next(item.BusinessContinuityPlanID);

    localStorage.setItem('IsBCCUser', (this.IsBCCUser))
    localStorage.setItem('IsBCManager', (this.IsBCManager))
    localStorage.setItem('IsBusinessOwner', (this.IsBusinessOwner))

    localStorage.setItem('BusinessContinuityPlanID', (item.BusinessContinuityPlanID))
    localStorage.setItem('CurrentWorkFlowStatusID', (item.CurrentWorkflowStatusID))
    localStorage.setItem('BCCNotFound', (item.BCCNotFound))
    localStorage.setItem('LastReviewed', (item.LastReviewDate))
    localStorage.setItem('IsBCCValidUser', (item.IsBCCValidUser))

    localStorage.setItem('MTPDValue', (item.MTPDValue))
    localStorage.setItem('RPOValue', (item.RPOValue))
    localStorage.setItem('RTOValue', (item.RTOValue))
    localStorage.setItem('MACValue', (item.MACValue))
    localStorage.setItem('MNPRValue', (item.MNPRValue))

    this.BusinessFunctionName = localStorage.setItem('BusinessFunctionName', (item.BusinessFunctionName))
    this.FBCCName = localStorage.setItem('FBCCName', (item.FBCCName))
    this.BusinessGroup = localStorage.setItem('BusinessGroup', (item.BusinessGroup))
    this.BCCName = localStorage.setItem('BCCName', (item.BCCName))
    this.businessContinuityService.selectedBusinessFunction.next(item.BCCName);
    this.businessContinuityService.selectedBCC.next(item.BCCNotFound);
    localStorage.setItem('BusinessFunctionID', (item.BusinessFunctionID))
    this.router.navigate(['business-continuity-plan/review-business-function'])
  }

  filterStatus(id: any) {
    if (this.assessmentStatusIds.includes(id)) {
      const index = this.assessmentStatusIds.findIndex((x: any) => x == id);
      this.assessmentStatusIds.splice(index, 1);
    } else {
      this.assessmentStatusIds.push(Number(id));
    }
    this.dataSource = addIndex(JSON.parse(JSON.stringify(searchBy(this.filterValue, this.searchFields, this.businessContinuityService.masterData['BusinessContinuityPlansList'], this.customFilterFields, this.assessmentStatusIds))), false);
  }

  reviewComments(data: any) {
    let payload = {
      "BusinessContinuityPlanID": data.BusinessContinuityPlanID,
      "BusinessFunctionID": data.BusinessFunctionID
    }
    this.businessContinuityService.reviewComment(payload).subscribe((res) => {
      if (res.success == 1) {

        this.commentList = res.result.ReviewComments.filter((ele: any) => ele.CommentBody != null)

        const info = this.dialog.open(CommentsPopupComponent, {
          disableClose: true,
          minWidth: "35vw",
          maxWidth: "60vw",
          minHeight: "60vh",
          maxHeight: "70vh",
          panelClass: "commentdark",
          data: {
            title: this.translate.instant('common.previousComments'),
            commentData: this.commentList?.length > 0 ? this.commentList : []
          }
        });
      }
      error: console.log('err::', 'error');
    });
  }

  getViewAccess(rowData: any) {
    if (this.IsBCManager && [8].includes(rowData.CurrentWorkflowStatusID)) {
      return false;
    } else {
      return true;
    }
  }

  onReviewPublish(data: any) {
    let reviewData = {
      isDecision: {
        required: true, isDropdown: { required: false }, optionData: [{ id: 1, value: this.translate.instant('bcp.publish.publishOption'), class: "greenRadio" }],
      },
      dropdownLable: this.translate.instant('bcp.publish.dropdownLabel'),
      modalTitle: this.translate.instant('bcp.publish.modalTitle'),
      modalBodyTitle: this.translate.instant('bcp.publish.modalBodyTitle'),
      commentLabel: this.translate.instant('bcp.publish.commentLabel'),
      buttonLabel: this.translate.instant('common.submit'),
      getCommentsURL: "/business-continuity-management/business-continuity-planning/get-business-continuity-plans-list",
      commentsPayload: {
        BusinessContinuityPlanID: data?.BusinessContinuityPlanID,
        BusinessFunctionID: data?.BusinessFunctionID
      },
      submitReviewURL: "/business-continuity-management/business-continuity-planning/publish-BCP",
      payload: {
        BusinessContinuityPlanID: data.BusinessContinuityPlanID,
        BusinessFunctionID: data.BusinessFunctionID
      }
    }
    const dialog = this.dialog.open(SubmitReviewCommentsComponent, {
      maxWidth: '100vw',
      width: '89.5vw',
      panelClass: ['assessmentList', 'full-screen-modal'],
      data: {
        data: reviewData,
        currentStep: data.CurrentWorkflowStatus,
      }
    });
    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.saveSuccess(this.translate.instant('bcp.publish.successMessage'));
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
        title: this.translate.instant('common.success'),
        content: content
      }
    });

    confirm.afterOpened().subscribe((result: any) => {
      setTimeout(() => {
        confirm.close();
        this.businessContinuityService.getBusinessContinuityList();
      }, timeout)
    });
  }

  sortData(event: any) {
    this.dataSource = addIndex(sortBy(event, this.dataSource));
  }

  getTimeFormat(date: any) {
    let dateFormat = formatTimeZone(date)
    let dateData = dateFormat + "T00:00:00.000Z";
    return this.dateToYMd(dateData)
  }

  dateToYMd(date: string) {
    const inputDate = new Date(date);
    return inputDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: '2-digit' });
  }

  openConsolidatedReport() {
    console.log('Exported File Limit : ', this.exportedFileLimit);
    const dialog = this.dialog.open(ConsolidatedReportComponent, {
      disableClose: true,
      maxWidth: '100vw',
      width: '89.5vw',
      panelClass: ['full-screen-modal', 'incident-comments'],
      data: {
        popupHeader: this.translate.instant('bcp.consolidatedReport.popupHeader'),
        notes: this.exportedFileLimit != null ? this.translate.instant('bcp.consolidatedReport.maxReports', { limit: this.exportedFileLimit }) : '',
        exportFileLimit: this.exportedFileLimit,
        tableData: [
          {columnDefs: 'BusinessFunction', header: this.translate.instant('bcp.columns.businessFunction'), property: 'BusinessFunctionName', columnStyle: 'w-10', sort: false},
          {columnDefs: 'Group', header: this.translate.instant('bcp.consolidatedReport.businessDepartment'), property: 'BusinessGroup', columnStyle: 'w-10', sort: false},
          {columnDefs: 'MTPD', header: this.translate.instant('bcp.columns.mtpd'), property: 'MTPDValue', columnStyle: 'w-10', sort: false},
          {columnDefs: 'RTO', header: this.translate.instant('bcp.columns.rto'), property: 'RTOValue', columnStyle: 'w-10', sort: false},
          {columnDefs: 'RPO', header: this.translate.instant('bcp.columns.rpo'), property: 'RPOValue', columnStyle: 'w-10', sort: false},
          // {columnDefs: 'BCC', header: 'BCC', property: 'BCCName', columnStyle: 'w-10 text-center', sort: false},
          {columnDefs: 'CompletionDate', header: this.translate.instant('bcp.columns.reviewCompletion'), property: 'FinalDate', columnStyle: 'w-10 text-center', sort: false},
          {columnDefs: 'BIARating', header: this.translate.instant('bcp.columns.biaRating'), property: 'BIARating', columnStyle: 'w-10 text-center', sort: false},
        ],
        idPropertyName: 'BusinessContinuityPlanID',
        rowsData: this.businessContinuityService.masterData?.BusinessContinuityPlansList.filter((bcp: any) => bcp.DocStatusID == 3),
        from: 2 // Business Continuity Plans
      },
    });
    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.businessContinuityService.getBusinessContinuityList();
      }
    });
  }
}
