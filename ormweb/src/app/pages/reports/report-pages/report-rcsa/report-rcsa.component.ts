import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { KriService } from 'src/app/services/kri/kri.service';
import { ReportsService } from 'src/app/services/reports/reports.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-report-rcsa',
  templateUrl: './report-rcsa.component.html',
  styleUrls: ['./report-rcsa.component.scss']
})
export class ReportRcsaComponent implements OnInit {
  displayedColumns: string[] = [
    'SNo', 'code', 'group', 'unit', 'risk', 'status', 'inherentRiskRating', 'controlEnvironment',
    'residualRiskRating', 'selfComments'
  ];
  filterData: any;
  new: number = 0;
  draft: number = 0;
  underReview: number = 0;
  rejected: number = 0;
  approved: number = 0;
  assessmentCout: number = 0;
  globalSearchValue: any = '';
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  @Input() selectedRCSUnit: any;
  @Input() selectedRCSStatus: any;
  @Input() selectedInherentRating: any;
  @Input() selectedResidualRating: any;
  @Input() yearValue: any;
  @Input() quarterValue: any;
  constructor(public kriService: KriService, private service: ReportsService,private utilsService: UtilsService) {
    service.gotRCSA.subscribe(value => {
      this.dataSource.data = [];

      if (value == true) {
        this.filterData = service.RCSAResults;
        this.getTableData();
      }

    });
  }
  ngOnChanges() {
    this.updateTable();
  }
  ngOnInit(): void {
    this.service.getRCSA();
  }
  getTableData() {
    this.dataSource.data = this.filterData;
    let status = this.filterData.map((i: { ScheduleInherentRiskStatusName: any; }) => i.ScheduleInherentRiskStatusName);
    status = status.filter(function (elem: any, index: any, self: string | any[]) {
      return elem != null && index === self.indexOf(elem);
    })
    let unit = this.filterData.map((i: { Unit: any; }) => i.Unit);
    unit = unit.filter(function (elem: any, index: any, self: string | any[]) {
      return elem != null && index === self.indexOf(elem);
    })
    let inherentRating = this.filterData.map((i: { InherentRiskRating: any; }) => i.InherentRiskRating);
    inherentRating = inherentRating.filter(function (elem: any, index: any, self: string | any[]) {
      return elem != null && index === self.indexOf(elem);
    })
    let residualRating = this.filterData.map((i: { ResidualRiskRating: any; }) => i.ResidualRiskRating);
    residualRating = residualRating.filter(function (elem: any, index: any, self: string | any[]) {
      return elem != null && index === self.indexOf(elem);
    })
    let dropDowns = {
      status: status.length > 0 ? status : 0,
      unit: unit.length > 0 ? unit : 0,
      inherentRating: inherentRating.length > 0 ? inherentRating : 0,
      residualRating: residualRating.length > 0 ? residualRating : 0,
    }
    this.service.RCSValues.next(dropDowns);
    this.updateStatusCount();
    this.updateTable();
  }
  updateTable() {
    this.dataSource.data = this.filterData;
    if (this.quarterValue && this.yearValue && this.filterData) {
      let selectedQuarter = "Quarter " + this.quarterValue + ", " + this.yearValue.toString();
      this.dataSource.data = this.filterData.filter((data: any) => data.SchedulePeriod === selectedQuarter);

    }
    if (this.globalSearchValue && this.dataSource.data) {
      console.log(this.globalSearchValue);

      this.dataSource.data = this.dataSource.data.filter((i: any) => {
        return Object.values(i).join("").toLowerCase().includes(this.globalSearchValue.toLowerCase())
      })
    }
    if (this.selectedRCSUnit && this.selectedRCSUnit != 'All' && this.dataSource.data) {
      this.dataSource.data = this.dataSource.data.filter((i: any) =>
        i.Unit == this.selectedRCSUnit
      );
    }
    if (this.selectedRCSStatus && this.selectedRCSStatus != 'All' && this.dataSource.data) {
      this.dataSource.data = this.dataSource.data.filter((i: any) =>
        i.ScheduleInherentRiskStatusName == this.selectedRCSStatus
      );
    }
    if (this.selectedInherentRating && this.selectedInherentRating != 'All' && this.dataSource.data) {
      this.dataSource.data = this.dataSource.data.filter((i: any) =>
        i.InherentRiskRating == this.selectedInherentRating
      );
    }
    if (this.selectedResidualRating && this.selectedResidualRating != 'All' && this.dataSource.data) {
      this.dataSource.data = this.dataSource.data.filter((i: any) =>
        i.ResidualRiskRating == this.selectedResidualRating
      );
    }
    this.updateStatusCount();

  }
  updateStatusCount() {
    this.new = this.dataSource.data.filter((item: any) => item.ScheduleInherentRiskStatusName === "New").length;
    this.draft = this.dataSource.data.filter((item: any) => item.ScheduleInherentRiskStatusName === "Draft").length;
    this.underReview = this.dataSource.data.filter((item: any) => item.ScheduleInherentRiskStatusName === "Under Review").length;
    this.rejected = this.dataSource.data.filter((item: any) => item.ScheduleInherentRiskStatusName === "Rejected").length;
    this.approved = this.dataSource.data.filter((item: any) => item.ScheduleInherentRiskStatusName === "Approved").length;
    this.assessmentCout = this.dataSource.data.length;
  }

  generateExcel() {
    // this.kriService.exportAsExcelFromTableId('rcsaTable', 'reportFIle');
    this.kriService.exportRCSAReportAsExcelWithColorCode('rcsaTable', 'reportFIle', this.dataSource.data);
  }

  generatePdf() {
    // let data = document.getElementById('rcsaTable') as HTMLElement;
    // let fileName = `RCSAReport_${new Date().toISOString()}.pdf`;
    // this.utilsService.generateHtmlAsImageInPDF(data, fileName);
    this.utilsService.generatePdf('rcsaTable',[], 'RcsaReport');
  }
}


