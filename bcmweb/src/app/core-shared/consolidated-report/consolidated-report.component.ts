import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { addIndex, sortBy } from 'src/app/includes/utilities/commonFunctions';
import { ConsolidatedReportService } from 'src/app/services/common-module/consolidated-report/consolidated-report.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-consolidated-report',
  templateUrl: './consolidated-report.component.html',
  styleUrls: ['./consolidated-report.component.scss']
})
export class ConsolidatedReportComponent implements OnInit{
  consolidatedReport! : MatTableDataSource<any>;
  displayedColumns    : any[] = ['Action', 'Index'];
  reportData          : any;
  storedIds           : any[] = [];
  download            : boolean = false;
  selectExceeded      : boolean = false;

  constructor(
    public utils: UtilsService,
    @Inject(DOCUMENT) private _document: any,
    @Inject(MAT_DIALOG_DATA) public parent: any,
    public localService: ConsolidatedReportService,
    public dialogRef: MatDialogRef<ConsolidatedReportComponent>
  ) {
    this.reportData       = parent;
    this.displayedColumns = this.displayedColumns.concat(this.reportData.tableData.map((x: any) => x.columnDefs));
    this.consolidatedReport = new MatTableDataSource(addIndex(this.reportData.rowsData, false))
  }

  ngOnInit(): void {

  }

  sortData(event: any) {
    this.consolidatedReport.data = addIndex(sortBy(event, this.consolidatedReport.data));
  }

  storeIds(rowData: any) {
    if (!this.storedIds.includes(Number(rowData[this.reportData.idPropertyName]))) {
      this.storedIds.push(Number(rowData[this.reportData.idPropertyName]));
      this.parent.exportFileLimit != null? this.checkCountStoredIds() : '';
    } else {
      const index = this.storedIds.findIndex((x: any) => x == rowData[this.reportData.idPropertyName]);
      this.storedIds.splice(index, 1);
      this.parent.exportFileLimit != null? this.checkCountStoredIds() : '';
    };
  };

  checkCountStoredIds() {
    if (this.storedIds.length > this.parent.exportFileLimit)
      this.selectExceeded = true;
    else
      this.selectExceeded = false;
  }

  exportConsolidatedReport() {
    this.download = true;

    if (this.selectExceeded) {
      this.localService.popupInfo("Unsuccessful", this.parent.notes);
      return;
    }

    if (this.storedIds && this.storedIds.length == 0)
      return

    // 1 == "Incident Report"
    if (this.reportData.from == 1) {
      let payload = {
        incidentIds: this.storedIds.join(",")
      }
      this.localService.getIncidentConsolidatedReportData(payload, '/business-continuity-management/incident-reports/download-incident-consolidated-reports');

      this.localService.gotIncidentReportData$.subscribe((value) => {
        if (value) {
          this.localService.DownloadIncidentReport('Consolidated_Report');
          this.download = false;
          this.localService.gotIncidentReportData$.next(false)
          this.dialogRef.close();
        }
      });
    };

    // 2 == 'Business Continuity Plan Report'
    if (this.reportData.from == 2) {
      let payload = {
        BusinessContinuityPlanID: this.storedIds.join(",")
      }
      this.localService.getBCPConsolidatedReportData(payload, '/business-continuity-management/business-continuity-planning/get-bcp-consolidated-report');

      this.localService.gotBCPReportData$.subscribe((value) => {
        if (value) {
          this.localService.DownloadBCPReport('Consolidated_Report');
          this.download = false;
          this.localService.gotBCPReportData$.next(false)
          this.dialogRef.close();
        }
      });
    };
  };

  cancelConsolidated() {
    this.download = false;
  }
}
