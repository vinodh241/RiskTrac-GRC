import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AssessmentRiskListing } from 'src/app/services/site-risk-assessments/assessment-risk-listing.service';
import { MatTableDataSource } from '@angular/material/table';
import { addIndex, dateToYMd } from 'src/app/includes/utilities/commonFunctions';

@Component({
  selector: 'app-sra-consolidated-report',
  templateUrl: './sra-consolidated-report.component.html',
  styleUrls: ['./sra-consolidated-report.component.scss']
})
export class SraConsolidatedReportComponent {
  displayedColumns = ['Action', 'Index', 'Site', 'Assessment', 'BCSiteChampion', 'StartDate', 'EndDate'];
  EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  EXCEL_EXTENSION = '.xlsx';
  siteIds: any[] = [];
  download: boolean = false;
  selectExceeded: boolean = false;

  constructor(
    public service: AssessmentRiskListing,
    @Inject(MAT_DIALOG_DATA) public parent: any,
    public dialogRef: MatDialogRef<SraConsolidatedReportComponent>,
  ) {
    this.service.TableConsolidated = new MatTableDataSource(addIndex(this.parent.sites.filter((x: any) => x.StatusID == 3), false));
  }

  resetForm() {
  }

  getDateFormat(date: any) {
    return dateToYMd(date);
  }

  storeSiteIds(rowData: any) {
    if (!this.siteIds.includes(Number(rowData.SiteRiskAssessmentID))) {
      this.siteIds.push(Number(rowData.SiteRiskAssessmentID));
      this.parent.exportFileLimit != null? this.checkCountSiteIds() : '';
    } else {
      const index = this.siteIds.findIndex((x: any) => x == rowData.SiteRiskAssessmentID);
      this.siteIds.splice(index, 1);
      this.parent.exportFileLimit != null? this.checkCountSiteIds() : '';
    }
  }

  checkCountSiteIds() {
    if (this.siteIds.length > this.parent.exportFileLimit)
      this.selectExceeded = true;
    else
      this.selectExceeded = false;
  }

  exportConsolidatedReport() {
    this.download = true

    if (this.selectExceeded) {
      this.service.popupInfo("Unsuccessful", `Maximum ${this.parent.exportFileLimit} Reports can be generated at once.`);
      return;
    }

    if (this.siteIds && this.siteIds.length == 0)
      return

    this.service.getConsolidatedReportData((this.siteIds).join(','), null, null, '/business-continuity-management/site-risk-assessments/get-site-assessments-for-report', 1);

    this.service.gotConsolidatedReport.subscribe((value) => {
      if (value) {
        this.service.DownloadReport('Consolidated_Report');
        this.download = false;
        this.dialogRef.close();
      }
    });
  }
}
