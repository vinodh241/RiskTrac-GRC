import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { KriService } from 'src/app/services/kri/kri.service';
import { ReportsService } from 'src/app/services/reports/reports.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-risk-appetite',
  templateUrl: './risk-appetite.component.html',
  styleUrls: ['./risk-appetite.component.scss']
})
export class RiskAppetiteComponent implements OnInit {
  displayedColumns: string[] = [
    'SNo', 'frameworkname', 'startDate', 'endDate', 'quarter', 'unit','riskMatric', 'score',
    'status',
  ];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  @Input() selectedStartDate: any;
  @Input() selectedEndDate: any;
  @Input() selectedStatus: any;
  @Input() selectedUnits: any;
  @Input() yearValue: any;
  @Input() quarterValue: any;

  globalSearchValue: any = '';
  filterData: any;
  assementUnits: any;
  schedule: number = 0;
  inProgress: number = 0;
  approved: number = 0;
  partiallySubmitted: number = 0;
  submitted: number = 0;
  assessmentCount: number = 0;
  reviewed:number=0;
  notStarted:number=0;
  rejected:number=0;

  constructor(private service: ReportsService,
     public kriService: KriService,
    private utilsService: UtilsService) {
    service.gotRA.subscribe(value => {
      this.dataSource.data = [];

      if (value == true) {
        this.filterData = service.RAResults;
        //console.log(this.filterData);
        this.getTableData();
      }

    });
  }

  ngOnInit() {
    this.service.getRA();
  }
  ngOnChanges() {
    this.updateTable();
  }
  generateExcel() {
    var filteredData = this.dataSource.filteredData.map(function (item: any, index: any) {

      return {'SL No':index+1,
      'Framework Name':item.FrameworkName,
      'Start Date': new Date(item.StartDate).toLocaleDateString(),
      'End Date': new Date(item.EndDate).toLocaleDateString(),
      'Quarter':item.Quater,
      'Unit':item .UnitName,
      'Risk Metric':item .Risks,
      'Score':item .MetricScore,
      //'Risk Metric':item .Risks,
      'Status':item.CollectionStatusName,
    };
     //only for Ra this method 2 is used for converting into excel
  });
    this.kriService.exportAsExcelFile(filteredData, 'reportFIle');
  }
  getTableData() {
    this.dataSource.data = this.filterData;
     let status = this.filterData.map((i: { CollectionStatusName: any; }) => i.CollectionStatusName);
     status = status.filter(function (elem: any, index: any, self: string | any[]) {
       return elem != null && index === self.indexOf(elem);
     })
    // let units = this.filterData.map((i: { UnitName: any; }) => i.UnitName); //i.units
    // units = units.filter(function (elem: any, index: any, self: string | any[]) {
    //   return elem != null && index === self.indexOf(elem);
    // })
    // let dropdowns = {
    //   status: status.length > 0 ? status : [],
    //   //units: units.length > 0 ? units : [],
    // }
     this.service.assessmentValues.next(null);
    this.updateStatusCounts();
    this.updateTable();
  }
  updateTable() {
    this.dataSource.data = this.filterData;
    // console.log("this.dataSource.data",this.dataSource.data)
    if(this.yearValue && this.quarterValue && this.filterData){
      let selectedQuarter = "Q" + this.quarterValue+ "-" + this.yearValue.toString().substr(2, 2); // Q2-23  Q1-23
console.log('✌️selectedQuarter --->', selectedQuarter);
      this.dataSource.data = this.filterData.filter((data: any) => data.Quater == selectedQuarter);
      console.log("this.dataSource.data1",this.dataSource.data)
    }
    if (this.globalSearchValue && this.dataSource.data) {
      this.dataSource.data = this.dataSource.data.filter((i: any) => {
        return Object.values(i).join("").toLowerCase().includes(this.globalSearchValue.toLowerCase())
      })
      console.log("this.dataSource.data2",this.dataSource.data)
    }
    if (this.selectedStartDate && this.dataSource.data) {
      this.dataSource.data = this.dataSource.data.filter((i: any) =>
        new Date(i.StartDate) >= new Date(this.selectedStartDate)
      );
      console.log("this.dataSource.data3",this.dataSource.data)
    }
    // if (this.selectedEndDate && this.dataSource.data) {
    //     let date = new Date(this.selectedEndDate).getDate().toString();
    //     let month = (new Date(this.selectedEndDate).getMonth() + 1).toString();
    //     let year = new Date(this.selectedEndDate).getFullYear().toString();
    //     let fullDate = year+'-'+month+'-'+ date;
    //     console.log(fullDate, new Date(fullDate).getTime());
    // //   let endDate = new Date(this.selectedEndDate).getTime() + (1000 * 60 * 60 * 24);
    // // console.log("this.selectedEndDate",new Date(this.selectedEndDate).toISOString().split('T')[0])
    // // let endDate = new Date(this.selectedEndDate).getTime()
    // //   console.log("new Date(this.selectedEndDate).getTime()",new Date(this.selectedEndDate).getTime())
    //   this.dataSource.data = this.dataSource.data.filter((i: any) =>
    //   console.log(i.EndDate.split('T')[0], new Date(i.EndDate.split('T')[0]).getTime())
    // //   console.log("new Date(i.EndDate).getTime()",new Date(i.EndDate).getTime())
    //     // new Date(i.EndDate).getTime() <= new Date(this.selectedEndDate).getTime()
    //   );
    //   console.log("this.dataSource.data4",this.dataSource.data)
    // }
    if (this.selectedEndDate && this.dataSource.data) {
        let selectDate = new Date(this.selectedEndDate).getDate();
        let selectMonth = new Date(this.selectedEndDate).getMonth();
        let selectYear = new Date(this.selectedEndDate).getFullYear();
        let selectedTime = new Date(selectYear, selectMonth, selectDate).getTime();
        this.dataSource.data = this.dataSource.data.filter((i: any) => {
            // console.log(i.EndDate,i.StartDate)
          let responseTime = new Date(Number((i.EndDate).substring(0, 4)), (Number((i.EndDate).substring(5, 7)) - 1), Number((i.EndDate).substring(8, 10))).getTime();
         return responseTime <= selectedTime;
        })
        console.log("this.dataSource.data4",this.dataSource.data)
      }


    // if (this.selectedStatus && this.selectedStatus != 'All' && this.dataSource.data) {
    //     console.log("this.selectedStatus",this.selectedStatus)
    //   this.dataSource.data = this.dataSource.data.filter((i: any) =>
    //     i.CollectionStatusName.trim() == this.selectedStatus
    //   );
    //   console.log("this.dataSource.data5",this.dataSource.data)
    // }
    // if (this.selectedStatus && this.selectedStatus.trim() == "Reviewed" && this.dataSource.data) {
    //     console.log("this.selectedStatus",this.selectedStatus)
    //   this.dataSource.data = this.dataSource.data.filter((i: any) => i.IsReviewed === true
    //   );
    //   console.log("this.dataSource.data5",this.dataSource.data)
    // }
    if (this.selectedStatus && this.dataSource.data) {
        if (this.selectedStatus.trim() === "Reviewed") {
            console.log("this.selectedStatus", this.selectedStatus);
            this.dataSource.data = this.dataSource.data.filter((i: any) => i.IsReviewed === true);
        } else if (this.selectedStatus.trim() !== "All") {
            console.log("this.selectedStatus", this.selectedStatus);
            this.dataSource.data = this.dataSource.data.filter((i: any) =>
                i.CollectionStatusName.trim() === this.selectedStatus
            );
        }
        console.log("this.dataSource.data5", this.dataSource.data);
    }

    if (this.selectedUnits && this.selectedUnits != 'All' && this.dataSource.data) {
      this.dataSource.data = this.dataSource.data.filter((i: any) =>
        i.UnitName.trim() == this.selectedUnits//i.Units
      );
      console.log("this.dataSource.data6",this.dataSource.data)
    }
    this.updateStatusCounts();
  }
  updateStatusCounts() {
    this.inProgress = this.dataSource.data.filter((item: any) => item.CollectionStatusName.trim() === "In Progress").length;
    this.approved = this.dataSource.data.filter((item: any) => item.CollectionStatusName.trim() === "Approved").length;
    // let reviewed = this.dataSource.data.filter((item: any) => (item.IsReviewed === true) ? (item.IsReviewed == null) : '')
    this.reviewed = this.dataSource.data.filter((item: any) =>
    item.IsReviewed === true
).length

    console.log("🚀 ~ file: risk-appetite.component.ts:161 ~ RiskAppetiteComponent ~ updateStatusCounts ~ this.reviewed:", this.reviewed)
    this.notStarted = this.dataSource.data.filter((item: any) => item.CollectionStatusName.trim() === "Not Started").length;
    this.rejected = this.dataSource.data.filter((item: any) => item.CollectionStatusName.trim() === "Rejected").length;
    this.submitted = this.dataSource.data.filter((item: any) => item.CollectionStatusName.trim() === "Submitted").length;
    console.log("this.submitted",this.submitted)
    this.assementUnits = this.dataSource.data.map((i: { UnitName: any; }) => i.UnitName);
    this.assessmentCount = this.dataSource.data.length;
  }

  dateToString(dateo: String, includeDate = true, includeTime = true) {
    if (dateo) {
      const ary = dateo.split('T');
      const aryd = ary[0].split('-');
      const aryt = ary[1].split('.')[0].split(':');
      let date = "";
      if (includeDate)
        date = aryd[2] + '-' + aryd[1] + '-' + aryd[0];
      if (includeTime) {
        if (date != "")
          date += " ";
        date += aryt[0] + ':' + aryt[1] + ':' + aryt[2];
      }
      return date;
    } else {
      return null;
    }
  }

  generatePDF1(){
    // let data = document.getElementById('SNo') as HTMLElement;
    // let fileName = `RiskAppetitteReport_${new Date().toISOString()}.pdf`;
    // this.utilsService.generateHtmlAsImageInPDF(data, fileName);
    const pdfsize = 'a4';
    const pdf = new jsPDF('l', 'pt', pdfsize);
    let pageWidth = pdf.internal.pageSize.getWidth() - 50;

    let styles = { overflow: 'linebreak', fontSize: 10, minCellHeight: 10, columnWidth: pageWidth * 0.125 };
    let data = document.getElementById('SNo') as HTMLElement;

    //   const tableElement: HTMLElement = this.reportKRITable.nativeElement;
      const tableRows = Array.from(data.querySelectorAll('tr'));

      const tableHeader:any = Array.from(tableRows[0].querySelectorAll('th')).map(th => th.textContent);
      console.log("🚀 ~ file: report-kri.component.ts:470 ~ ReportKriComponent ~ generatePdf ~ tableHeader:", tableHeader)
      const tableData = tableRows.slice(1).map(row => Array.from(row.querySelectorAll('td')).map(cell => cell.textContent));
      console.log("🚀 ~ file: report-kri.component.ts:472 ~ ReportKriComponent ~ generatePdf ~ tableData:", tableData)
      autoTable(pdf, {
        startY: 60,
        head: [tableHeader],  // Pass an array of arrays
        body: tableData,
        columns: tableHeader,
        headStyles: { overflow: 'linebreak', fillColor: [140, 180, 156], fontStyle: 'bold', textColor: [255, 255, 255] },
        bodyStyles: { textColor: [80, 80, 80] },
        columnStyles: { values: { overflow: 'linebreak', fontSize: 5, minCellHeight: 10, cellWidth: pageWidth * 0.5, textColor: '#505050' } },
      });

      pdf.save(`RiskAppetitteReport_${new Date().toISOString()}.pdf`);
  }

  generatePDF() {
    // let data = document.getElementById('rcsaTable') as HTMLElement;
    // let fileName = `RCSAReport_${new Date().toISOString()}.pdf`;
    // this.utilsService.generateHtmlAsImageInPDF(data, fileName);
    this.utilsService.generatePdf('SNo',[], 'RaReport');
  }

}


