import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth/auth.service';
import { IncidentReportService } from 'src/app/services/incident-report/incident-report.service';
import { ReportNewIncidentComponent } from './report-new-incident/report-new-incident.component';
import { addIndex, searchBy, sortBy } from 'src/app/includes/utilities/commonFunctions';
import { ConsolidatedReportComponent } from 'src/app/core-shared/consolidated-report/consolidated-report.component';
import { ConsolidatedReportService } from 'src/app/services/common-module/consolidated-report/consolidated-report.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-incident-reports-list',
  templateUrl: './incident-reports-list.component.html',
  styleUrls: ['./incident-reports-list.component.scss']
})
export class IncidentReportsListComponent implements OnInit{
  displayedColumns = ['Index', 'IncidentID', 'Title', 'ReportedTime', 'Location', 'NaturalIncident', 'Classification', 'Status', 'Action'];

  // filter functionality declarations
  filterFields          : any[]  = ['IncidentCode', 'IncidentTitle', 'FormatedDate', 'Location', 'IncidentNature', 'Classification', 'ActualStatus'];
  customFilterFields    : any[]  = ['FilterStatusID'];
  tableHeaderColumns    : any[]  = ['ActualStatus'];
  filterValue           : any    = '';
  reportedCount         : number = 0 ;
  reviewInProgressCount : number = 0 ;
  reviewDelayedCount    : number = 0 ;
  incidentStatusIds     : any[]  = [];
  statusFilter    = new FormControl();
  filteredValues  = {
    ActualStatus: ''
  };

  constructor(
    public dialog     : MatDialog,
    public authService: AuthService,
    public service    : IncidentReportService,
    public consolidatedService: ConsolidatedReportService
  ) {
    this.authService.activeTab.next("CrisisManagement");
    this.authService.activeSubTab$.next("incident-report");
    this.service.getIncidentList();
  }

  ngOnInit(): void {
    this.service.gotMasterIncidentList$.subscribe((value: any) => {
      if (value) {
      }
    });

    this.statusFilter.valueChanges.subscribe((statusValue) => {
      this.filteredValues['ActualStatus'] = (statusValue || '');
      this.service.TableIncident.data = addIndex(JSON.parse(JSON.stringify(searchBy(this.filterValue, this.filterFields, this.service.masterIncidentList, this.customFilterFields, this.incidentStatusIds, this.tableHeaderColumns, this.filteredValues))), false);
    });
  }

  getViewAccess(rowData: any) {
    if (this.service.isBCManager && [2].includes(rowData.ActualStatusID)) {
      return false;
    } else if (rowData.ReporterGUID != localStorage.getItem('userguid')) {
      return true;
    } else if (rowData.ReporterGUID == localStorage.getItem('userguid') && [1].includes(rowData.ActualStatusID)){
      return false;
    } else {
      return true;
    }
  }

  sortData(event: any) {
    this.service.TableIncident.data = addIndex(sortBy(event, this.service.TableIncident.data));
  }

  getStatusCount(id: any) {
    return this.service.masterIncidentList && this.service.masterIncidentList.filter((x: any) => x.FilterStatusID == id)?.length;
  }

  searchFilter(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value;
    this.service.TableIncident.data = addIndex(JSON.parse(JSON.stringify(searchBy(this.filterValue, this.filterFields, this.service.masterIncidentList, this.customFilterFields, this.incidentStatusIds, this.tableHeaderColumns, this.filteredValues))), false);
  }

  filterIncidentStatus(id: any) {
    if (this.incidentStatusIds.includes(id)) this.incidentStatusIds.splice(this.incidentStatusIds.findIndex((x: any) => x == id), 1);
    else this.incidentStatusIds.push(Number(id));
    this.service.TableIncident.data = addIndex(JSON.parse(JSON.stringify(searchBy(this.filterValue, this.filterFields, this.service.masterIncidentList, this.customFilterFields, this.incidentStatusIds, this.tableHeaderColumns, this.filteredValues))), false);
  }

  addUpdateIncidentReport(mode: any, rowData: any) {
    const dialog = this.dialog.open(ReportNewIncidentComponent, {
      disableClose: true,
      maxWidth: '100vw',
      width: '89.5vw',
      panelClass: ['full-screen-modal', 'incident-comments'],
      data: {
        incidentMode: mode,
        selectedIncident: JSON.parse(JSON.stringify(rowData)),
        modelTitle: mode == 'Add'? 'Report New Incident' : 'Update Incident Report',
        allIncidents: JSON.parse(JSON.stringify(this.service.TableIncident.data || []))
      },
    });
    dialog.afterClosed().subscribe((result) => {
      if (result)
        this.service.getIncidentList();
    });
  }

  openConsolidatedReport() {
    const dialog = this.dialog.open(ConsolidatedReportComponent, {
      disableClose: true,
      maxWidth: '100vw',
      width: '89.5vw',
      panelClass: ['full-screen-modal', 'incident-comments'],
      data: {
        popupHeader: 'Choose one or more incidents from the closed incident reports listed below. The selected ones will be consolidated and summarised in the report.',
        notes: this.service.incidentListMaster.ExportFileLimit != null? `Maximum ${this.service.incidentListMaster.ExportFileLimit} report(s) can be generated at once` : '',
        exportFileLimit: this.service.incidentListMaster.ExportFileLimit,
        tableData: [
          {columnDefs: 'IncidentID', header: 'Incident ID', property: 'IncidentCode', columnStyle: 'w-10', sort: false},
          {columnDefs: 'Title', header: 'Title', property: 'IncidentTitle', columnStyle: 'w-25', sort: false},
          {columnDefs: 'ReportedDate', header: 'Reported Date', property: 'ConsolidatedReportDate', columnStyle: 'w-18', sort: true},
          {columnDefs: 'Location', header: 'Location', property: 'Location', columnStyle: 'w-10', sort: false},
          {columnDefs: 'NatureIncident', header: 'Nature of Incident', property: 'IncidentNature', columnStyle: 'w-15', sort: true},
          {columnDefs: 'Classification', header: 'Classification', property: 'Classification', columnStyle: 'w-13 text-center', sort: true},
        ],
        idPropertyName: 'IncidentID',
        rowsData: JSON.parse(JSON.stringify(this.service.masterIncidentList.filter((inc: any) => inc.ActualStatusID == 3))),
        from: 1 // Incident Report
      },
    });
    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.service.getIncidentList();
      }
    });
  }

  downloadIncidentConsolidated(rowData: any) {
    let payload = {
      incidentIds: rowData.IncidentID
    }
    this.consolidatedService.getIncidentConsolidatedReportData(payload, '/business-continuity-management/incident-reports/download-incident-consolidated-reports');

      this.consolidatedService.gotIncidentReportData$.subscribe((value: boolean) => {
        if (value) {
          this.consolidatedService.DownloadIncidentReport('Consolidated_Report');
          this.consolidatedService.gotIncidentReportData$.next(false);
        }
      });
  }
}
