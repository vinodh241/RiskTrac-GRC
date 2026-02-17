import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { KriService } from 'src/app/services/kri/kri.service';
import { ReportsService } from 'src/app/services/reports/reports.service';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { utils } from 'xlsx';
import { IncidentService } from 'src/app/services/incident/incident.service';

@Component({
  selector: 'app-report-incident',
  templateUrl: './report-incident.component.html',
  styleUrls: ['./report-incident.component.scss']
})
export class ReportIncidentComponent implements OnInit {
  displayedColumns: string[] = [
    'SNo', 'incidentCode', 'incidentTitle', 'reportingDate', 'incidentDate', 'incidentType', 'incidentUnit', 'criticality',
    'incidentStatus', 'recommendations', 'open', 'claimedClosed', 'closed'
  ];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  globalSearchValue: any = ''
  incidents: any = [];
  tableData: any;
  filterData: any
  selectedModule: any;
  criticality: any;
  open: number = 0;
  closed: number = 0;
  claimClosed: number = 0;
  incidentCount: number = 0;
  recommedationCount: number = 0;
  incidentStatus: any;
  incidentUnits: any;
  @Input() startDate: any;
  @Input() endDate: any;
  @Input() selectedCriticality: any;
  @Input() selectedIncidentStatus: any;
  @Input() selectedUnit: any;
  @Input() yearValue: any;
  @Input() quarterValue: any;
  @ViewChild('incidentTable') tableElement!: ElementRef;


  constructor(
    private service: ReportsService,
    public kriService: KriService,
    public utilsService: UtilsService,
    public incidentService: IncidentService

  ) {
    service.gotIncidents.subscribe(value => {
      console.log(value);
      this.dataSource.data = [];

      if (value == true) {


        this.incidents = Object.keys(service.incidents);

        this.tableData = service.incidents;


        this.getTableData();

        // Load criticality master data for tooltips (DB-driven descriptions)
        // Called after getIncidentMaster completes to avoid concurrent API calls
        // which can cause session timeout due to token race condition
        this.incidentService.getIncidentInfo();

      }
    })
  }

  ngOnInit(): void {
    console.log("incident");
    this.service.getIncidentMaster();
  }
  ngOnChanges(): void {
    this.updateTable();
  }
  getTableData() {

    if (this.incidents) {
      this.dataSource.data = this.tableData.IncidentData.filter((data: any) =>(data.StatusId != 1 && data.StatusId != 11 && data.StatusId != 12 && data.StatusId != 17 && data.StatusId != 18 && data.StatusId != 13  && data.StatusId != 16 && data.StatusId != 14 && data.StatusId != 15))
      console.log('this.dataSource.data: ', this.dataSource.data);
      this.criticality = this.dataSource.data.map((itr:any)=> itr.CriticalityName)
      this.incidentStatus = this.dataSource.data.map((itr:any)=> itr.StatusName)
      this.incidentUnits = this.dataSource.data.map((itr:any)=> itr.IncidentUnitName)
      this.criticality = [...new Set(this.criticality)];
      this.incidentStatus = [...new Set(this.incidentStatus)];
      this.incidentUnits = [...new Set(this.incidentUnits)];
    }
    let dropDowns = {
      criticality: this.criticality.length > 0 ? this.criticality : 0,
      incidentStatus: this.incidentStatus.length > 0 ? this.incidentStatus : 0,
      incidentUnits: this.incidentUnits.length > 0 ? this.incidentUnits : 0,
    }
    this.service.incidentValues.next(dropDowns);

    this.filterData = this.dataSource.data;
    this.updateStatusCounts();
    this.updateTable();
  }
  updateTable() {
    this.dataSource.data = this.filterData ? this.filterData : [];

    if (this.globalSearchValue && this.dataSource.data) {
      this.dataSource.data = this.dataSource.data.filter((i: any) => {
        return Object.values(i).join("").toLowerCase().includes(this.globalSearchValue.toLowerCase())
      })
    }
    if (this.endDate && this.dataSource.data) {
      this.dataSource.data = this.dataSource.data.filter((i: { CriticalityName: any; IncidentDate: string | number | Date; StatusName: any; }) =>{
        // console.log("(new Date(i.IncidentDate)",(new Date(i.IncidentDate).setHours(0,0,0,0) >= new Date(this.startDate).setHours(0,0,0,0) && new Date(i.IncidentDate).setHours(0,0,0,0) <= new Date(this.endDate).setHours(0,0,0,0)),new Date(i.IncidentDate).setHours(0,0,0,0),new Date(this.endDate).setHours(0,0,0,0))
      return (new Date(i.IncidentDate).setHours(0,0,0,0) >= new Date(this.startDate).setHours(0,0,0,0) && new Date(i.IncidentDate).setHours(0,0,0,0) <= new Date(this.endDate).setHours(0,0,0,0))}
      );
    }
    if (this.selectedCriticality && this.selectedCriticality != 'All' && this.dataSource.data) {
      this.dataSource.data = this.dataSource.data.filter((i: { CriticalityName: any; IncidentDate: string | number | Date; StatusName: any; }) =>
        (i.CriticalityName == this.selectedCriticality)
      );
    }
    if (this.selectedIncidentStatus && this.selectedIncidentStatus != 'All' && this.dataSource.data) {
      this.dataSource.data = this.dataSource.data.filter((i: { CriticalityName: any; IncidentDate: string | number | Date; StatusName: any; }) =>
        (i.StatusName == this.selectedIncidentStatus)
      );
    }
    if (this.selectedUnit && this.selectedUnit != 'All' && this.dataSource.data) {
      this.dataSource.data = this.dataSource.data.filter((i: {
        IncidentUnitName: any; CriticalityName: any; IncidentDate: string | number | Date; StatusName: any;
      }) =>
        (i.IncidentUnitName == this.selectedUnit));
    }
    if (this.filterData) {
      this.updateStatusCounts();
    }
  }
  updateStatusCounts() {
    if (this.dataSource.data.length > 0) {
      console.log('this.dataSource.data --->', this.dataSource.data);
      this.open = this.dataSource.data.map((item) => item.NoOfOpen)?.reduce((a, b) => a + b);
      this.closed = this.dataSource.data.map((item) => item.NoOfClosed)?.reduce((a, b) => a + b);
      this.claimClosed = this.dataSource.data.map((item) => item.NoOfClaimClosed)?.reduce((a, b) => a + b);
      this.recommedationCount = this.dataSource.data.map((item) => item.NoOfRecommendations)?.reduce((a, b) => a + b);
      this.incidentCount = this.dataSource.data.length
      console.log('this.incidentCount: ', this.incidentCount);
    }
    else {
      this.open = 0
      this.closed = 0
      this.claimClosed = 0
      this.recommedationCount = 0
      this.incidentCount = 0
    }
  }
  generateExcel() {
    this.kriService.exportAsExcelFromTableId('incidentTable', `IncidentReport_${new Date().toISOString()}`);
  }

  generatePdf1() {
    const pdfsize = 'a4';
    const pdf = new jsPDF('l', 'pt', pdfsize);
    let pageWidth = pdf.internal.pageSize.getWidth() - 50;

    let styles = { overflow: 'linebreak', fontSize: 10, minCellHeight: 10, columnWidth: pageWidth * 0.125 };
    let data = document.getElementById('incidentTable') as HTMLElement;

    const tableRows = Array.from(data.querySelectorAll('tr'));

    const tableHeader: any = Array.from(tableRows[0].querySelectorAll('th')).map(th => th.textContent);

    // Exclude unwanted columns from the table header
    const excludedColumns = ['Recommendations', 'Claimed Closed'];
    const filteredTableHeader = tableHeader.filter((column: any) => !excludedColumns.includes(column.trim()));

    console.log("🚀 ~ file: report-kri.component.ts:470 ~ ReportKriComponent ~ generatePdf ~ tableHeader:", filteredTableHeader)

    const tableData = tableRows.slice(1).map(row => {
        // Exclude corresponding data for unwanted columns
        const rowData = Array.from(row.querySelectorAll('td')).map(cell => cell.textContent);
        return rowData.filter((_, index) => !excludedColumns.includes(filteredTableHeader[index]));
    });

    console.log("🚀 ~ file: report-kri.component.ts:472 ~ ReportKriComponent ~ generatePdf ~ tableData:", tableData)

    autoTable(pdf, {
        startY: 60,
        head: [filteredTableHeader],
        body: tableData,
        columns: filteredTableHeader,
        headStyles: { overflow: 'linebreak', fillColor: [140, 180, 156], fontStyle: 'bold', textColor: [255, 255, 255], valign:'middle', halign: 'center' },
        bodyStyles: { textColor: [80, 80, 80] },
        columnStyles: { values: { overflow: 'linebreak', fontSize: 5, minCellHeight: 10, cellWidth: pageWidth * 0.5, textColor: '#505050' } },
    });

    pdf.save(`IncidentReport_${new Date().toISOString()}.pdf`);
  }

  generatePdf() {
    const excludedColumns = ['Recommendations', 'Claimed Closed'];
    this.utilsService.generatePdf('incidentTable', excludedColumns, 'IncidentReport');
  }

  /**
   * Get the description for a criticality level by name (DB-driven)
   * Used to display info tooltips in the reports table
   */
  getCriticalityDescription(criticalityName: string): string {
    return this.incidentService.getCriticalityDescription(criticalityName);
  }
}
