import { Component, EventEmitter, Output } from '@angular/core';
import { SraConsolidatedReportComponent } from './sra-consolidated-report/sra-consolidated-report.component';
import { MatDialog } from '@angular/material/dialog';
import { AddEditSiteRiskComponent } from './add-edit-site-risk/add-edit-site-risk.component';
import { AssessmentRiskListing } from 'src/app/services/site-risk-assessments/assessment-risk-listing.service';
import { MatTableDataSource } from '@angular/material/table';
import { addIndex, searchBy } from 'src/app/includes/utilities/commonFunctions';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from 'src/app/includes/utilities/popups/confirm/confirm-dialog.component';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-site-risk-assessment-listing',
  templateUrl: './site-risk-assessment-listing.component.html',
  styleUrls: ['./site-risk-assessment-listing.component.scss']
})

export class SiteRiskAssessmentListingComponent {

  @Output() itemClick: EventEmitter<any> = new EventEmitter<any>();
  displayedColumns: string[] = ['Index', 'assessmentCode', 'assessmentName', 'site', 'startDate', 'endDate', 'status', 'progress', 'siteChampion', 'reviwer', 'action'];
  searchFields: any = ['SiteName', 'AssessmentName', 'AssessmentCode', 'FramworkName', 'StartDate', 'EndDate', 'Status', 'BCSiteChampionName'];
  dataSource = new MatTableDataSource<Element>();
  allData: any;
  inProgressCount: any;
  completedCount: any;
  bcManager:any
  scheduled:any
  filterValue: any = '';
  customFilterFields: any[] = ['StatusID'];
  assessmentStatusIds: any[] = [];

  constructor(
    private router: Router,
    public dialog: MatDialog,
    public authService: AuthService,
    public siteRiskAssessment: AssessmentRiskListing,
    private translate: TranslateService,
  ) {
    this.authService.activeTab.next("BC");
    this.authService.activeSubTab$.next("site-risk-assessments");
    this.siteRiskAssessment.getSiteListData();
  }

  ngOnInit() {
    this.siteRiskAssessment.gotMasterSiteData.subscribe((value) => {
      if (value) {
        this.dataSource = this.siteRiskAssessment.allRiskData.SiteRiskAssessments;
        this.allData = this.siteRiskAssessment.allRiskData.SiteRiskAssessments;
        this.bcManager = this.siteRiskAssessment.allRiskData.IsBCManager[0].isBCManager
        this.completedCount = this.allData.filter((ele: any) => ele.StatusID == 3).length
        this.inProgressCount = this.allData.filter((ele: any) => ele.StatusID == 2).length
        this.scheduled = this.allData.filter((ele: any) => ele.StatusID == 1).length
      }
    });
  }

  directToAssessmentRisks(item: any): void {
    this.router.navigate(['site-risk-assessments/risk-listing'], { queryParams: { 'SRAID': item.SiteRiskAssessmentID } });
  }

  openConsolidatedReportPopUp() {
    const dialog = this.dialog.open(SraConsolidatedReportComponent, {
      disableClose: true,
      maxWidth: '100vw',
      width: '90vw',
      panelClass: ['full-screen-modal'],
      data: {
        sites: this.dataSource,
        exportFileLimit: this.siteRiskAssessment.allRiskData.ExportFileLimit
      },
    });
    dialog.afterClosed().subscribe(() => { });
  }

  addEdit(mod: any, row?: any) {
    const dialog = this.dialog.open(AddEditSiteRiskComponent, {
      disableClose: true,
      maxWidth: '100vw',
      width: '90vw',
      panelClass: ['site', 'full-screen-modal'],
      data: {
        mode: mod,
        data: row,
      },
    });
    dialog.afterClosed().subscribe(() => { });
  }

  getColor(progress:any): string {
    progress = Number(progress?.replace('%', ''));
    if (progress <= 25) {
      return 'color-class-1';
    } else if (progress <= 50) {
      return 'color-class-2';
    } else if (progress <= 75) {
      return 'color-class-3';
    } else {
      return 'color-class-4';
    }
  }

  applyFilter(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value;
    this.dataSource = addIndex(JSON.parse(JSON.stringify(searchBy(this.filterValue, this.searchFields, this.siteRiskAssessment.allRiskData['SiteRiskAssessments'], this.customFilterFields, this.assessmentStatusIds))), false);
  }

  getBgColor(status: any): any {
    if (status == 1) {
      return 'statusInprogress';
    } else if (status == 2) {
      return 'draft';
    }
  }

  filterStatus(id: any) {
    if (this.assessmentStatusIds.includes(id)) {
      const index = this.assessmentStatusIds.findIndex((x: any) => x == id);
      this.assessmentStatusIds.splice(index, 1);
    } else {
      this.assessmentStatusIds.push(Number(id));
    }
    this.dataSource = addIndex(JSON.parse(JSON.stringify(searchBy(this.filterValue, this.searchFields, this.siteRiskAssessment.allRiskData['SiteRiskAssessments'], this.customFilterFields, this.assessmentStatusIds))), false);
  }

  deleteSiteAssessment(data?: any) {
    const confirm = this.dialog.open(ConfirmDialogComponent, {
      id: 'ConfirmDialogComponent',
      disableClose: true,
      minWidth: '300px',
      panelClass: 'dark',
      data: {
        title: this.translate.instant('common.confirmDeletion'),
        content: this.translate.instant('sra.deleteConfirm'),
      },
    });
    confirm.afterClosed().subscribe((result) => {
      if (result) {
        this.siteRiskAssessment.deletesiteriskassessment(data).subscribe(
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
      id: 'InfoComponent',
      disableClose: true,
      minWidth: '300px',
      panelClass: 'success',
      backdropClass: 'static',
      data: {
        title: this.translate.instant('common.success'),
        content: this.translate.instant('sra.deleteSuccess'),
      },
    });

    confirm.afterOpened().subscribe((result) => {
      setTimeout(() => {
        confirm.close();
        this.siteRiskAssessment.getSiteListData();
      }, timeout);
    });
  }

  isDisabled(row: any): boolean {
    // return row.StatusID !== 1 || row.isBCManager === 0 ||
    //        row.IsRiskOwner === 1 || row.IsBCSiteChampionID === 1 ||
    //        row.IsSiteAdminHead === 1 || row.IsReviewer === 1;

  if(row.StatusID == 1 && row.isBCManager == 1){
    return false
  }else{
    return true
  }
}

}
