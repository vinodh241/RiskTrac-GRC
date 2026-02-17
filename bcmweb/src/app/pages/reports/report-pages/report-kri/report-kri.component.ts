import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ReportsService } from 'src/app/services/reports/reports.service';
import { KriService } from 'src/app/services/kri/kri.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-report-kri',
  templateUrl: './report-kri.component.html',
  styleUrls: ['./report-kri.component.scss']
})
export class ReportKriComponent implements OnInit {
  @Input() selectedMeasureFreq: any;
  @Input() selectedKriType: any;
  @Input() selectedKriValue: any;
  @Input() selectedKriStatus: any;
  @Input() presentQuarter: any;
  @Input() yearValue: any;
  @Input() quarterValue: any;
  @Input() quarterNumber: any;
  @Input() qStartDate: any;
  @Input() qEndDate: any;
  //@Input() quater: any;
  displayedColumns: string[] = ['SNo', 'Unit', 'KRICode', 'Indicator', 'MeasurementFrequency', 'KRI_Target', 'KRI_Type'];
  periodColumns: string[] = ['Period', 'Date', 'Measurement', 'KRI_Value', 'Remark', 'KRI_Status'];
  thresholdColumns: string[] = ['ThresholdValue1', 'ThresholdValue2', 'ThresholdValue3', 'ThresholdValue4', 'ThresholdValue5'];
  displayedHeaders: any[] = ['header-row-first-group', 'header-row-second-group', 'header-row-third-group', 'header-row-fourth-group', 'header-row-fifth-group', 'header-row-six-group', 'header-row-seven-group', 'header-row-eight-group', 'header-row-last-group'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  KRICount: number = 0;
  filterData: any
  measured: number = 0;
  notMeasured: number = 0;
  period: any;
  periodReport: any;
  reported: number = 0;
  year: number = 0;
  excelSheet: boolean = false;
  globalSearchValue: any = '';
  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    rejected: any;
    approved: any;

    KRIStatusList = {
        "KRI_StatusData":[
            "Reported",
            "Measured",
            "Not Measured",
            "Approved",
            "Rejected"
        ]
      }




  constructor(
    private service: ReportsService,
    public kriService: KriService,
    private utilsService: UtilsService
    ) {

    service.gotKRI.subscribe(value => {
      this.dataSource.data = [];

      if (value == true) {
        this.filterData = service.KRIResults;
        // console.log('this.filterData: ', this.filterData);

        this.getTableData();
      }

    });
  }

  ngOnInit(): void {
    this.service.getKRI();

  }
  ngOnChanges() {
    this.updateTable();
  }
  generateExcel() {
    this.excelSheet = true;
    // this.kriService.exportAsExcelFromTableId('KRITable', 'reportFIle');
    this.kriService.exportKRIReportAsExcelWithColorCode('KRITable', 'reportFIle', this.dataSource.data);
  }
  getTableData() {
    this.dataSource.data = this.filterData;

    let KRIStatusData = this.KRIStatusList.KRI_StatusData

    let measurementFreq = this.filterData.map((i: { MeasurementFrequency: any; }) => i.MeasurementFrequency);
    measurementFreq = measurementFreq.filter(function (elem: any, index: any, self: string | any[]) {
      return elem != null && index === self.indexOf(elem);
    })
    let KriValue = this.filterData.map((i: { KRI_Value: any; }) => i.KRI_Value);
    KriValue = KriValue.filter(function (elem: any, index: any, self: string | any[]) {
      return elem != null && index === self.indexOf(elem);
    })
    this.updateStatusCounts();
    // const KriStatus = [...new Set(this.filterData.map((ob:any) => ob.KRI_Status))];

    // ((i: { KRIStatus: any; }) => i.KRIStatus);
    // KriStatus = KriStatus.filter(function (elem: any, index: any, self: string | any[]) {
    //   return elem != null && index === self.indexOf(elem);
    // })
    let KriType = this.filterData.map((i: { KRI_Type: any; }) => i.KRI_Type);
    KriType = KriType.filter(function (elem: any, index: any, self: string | any[]) {
      return elem != null && index === self.indexOf(elem);
    })
    let dropDowns = {
      measurementFreq: measurementFreq.length > 0 ? measurementFreq : [],
      KriValue: KriValue.length > 0 ? KriValue : [],
      KriStatus: KRIStatusData,
      KriType: KriType.length > 0 ? KriType : []
    }

    this.service.KRIValues.next(dropDowns);
    this.getPeriod();
    this.updateTable();
  }
  getPeriod() {
    let frequencyId = this.filterData[0].ReportingFrequencyID;
    let month = new Date().getMonth();
    let year = ' ' + new Date().getFullYear() + ' '
    switch (frequencyId) {
      case 1:
        this.period = this.months[month] + year;
        break;
      case 2:
        this.period = this.presentQuarter;
        break;
      case 3:
        this.period = month < 6 ? 'Jan ' + year + ' - Jun ' + year : 'Jul ' + year + ' - Dec ' + year
        break;
      case 4:
        this.period = 'Jan ' + year + ' - Dec ' + year
        break;
    }
  }
  updateTable() {
    this.dataSource.data = this.filterData;
    let result = JSON.parse(this.service.KRIResultsNew)

    // if (this.quarterValue && this.yearValue && this.filterData) {
    //   let selectedQuarter = "Q" + this.quarterValue + "-" + this.yearValue.toString().substr(2, 2);
    //   this.dataSource.data = this.filterData.filter((data: any) => data.Quater === selectedQuarter);

    // }
    this.year = new Date().getFullYear();
    let selectedQuarter = "Q" + this.quarterValue + "-" + this.yearValue.toString().substr(2, 2); // Q1-23 KRICreatedDate
    // if (this.yearValue == this.year && this.quarterNumber != this.quarterValue && this.quarterValue && this.filterData) {
      let filteredList: any[] = [];
      let startDate = new Date(this.qEndDate).getTime();
      this.dataSource.data = result.filter((d: any) => {
        var time = new Date(d.KRICreatedDate).getTime();
        return (time <= startDate);
      });

    // }




    var vardata = new Date().getFullYear();
    let currentDate = new Date();
    let currMonth = currentDate.getMonth() + 1;
    let currQuarter = Math.ceil(currMonth / 3);
    let selectedQuarter1 = 'Q' + currQuarter + '-' + vardata.toString().substr(2, 2); // Q1-23 KRICreatedDate
    let quarterFilter = 'Q' + ((this.quarterValue !== undefined && this.quarterValue > 0) ? this.quarterValue : currQuarter) + '-' + this.yearValue.toString().substr(2, 2);


      if(selectedQuarter1 != quarterFilter){
        var PreviousQuarterData:any = [];
        this.dataSource.data.forEach((item: any) => {
          if(item.PreviousQuarterData != "Not Measured"){
            // PreviousQuarterData.push(item)
            var arrayData = item.PreviousQuarterData;
            var id = 0;
            var ind = undefined;
            for(let i = 0; i<arrayData?.length; i++){
              if(id < arrayData[i].MeasurementID && arrayData[i].Quater == quarterFilter){
                id = arrayData[i].MeasurementID;
                ind = i
              }
            }
            if(ind != undefined && ind != null){
              PreviousQuarterData.push(arrayData[ind])
            }else{
              PreviousQuarterData.push(item)
            }
            // PreviousQuarterData.push())
            // item.PreviousQuarterData = []
          }else if(item.PreviousQuarterData == "Not Measured" && item.Quater == quarterFilter){
            PreviousQuarterData.push(item)
          }else{
            item.Date = null;
            item.Period = null
            item.KRI_Status = "Not Measured";
            item.IsReported = null;
            item.Measurement = null;
            item.MeasurementValue = null;
            item.Remark = null;
            item.Quater = null
            item.KRI_Value = null;
            item.ColorCode =  "#FFFFFF"
            PreviousQuarterData.push(item)
          }
        });

        // console.log('PreviousQuarterData: bfr ' + JSON.stringify(PreviousQuarterData))
        PreviousQuarterData.forEach((item: any) => {
          if   (item.Quater != quarterFilter){
            item.Date = null;
            item.Period = null;
            item.KRI_Status = "Not Measured";
            item.IsReported = null;
            item.Measurement = null;
            item.MeasurementValue = null;
            item.Remark = null;
            item.Quater = null
            item.ColorCode =  "#FFFFFF"
            item.KRI_Value = null;
          }
          else if (item.KRI_Status !== 'Not Measured'){
            // console.log('item'+ JSON.stringify(item))
            item.Date = item.Date;
            item.Period = item.Period;
            item.KRI_Status = item.KRI_Status;
            item.IsReported = item.IsReported;
            item.Measurement = item.Measurement;
            item.MeasurementValue = item.MeasurementValue;
            item.Remark = item.Remark;
            item.Quater = item.Quater
            item.ColorCode =  item.ColorCode
            item.KRI_Value = item.KRI_Value;
          }
          else if (item.KRI_Status == 'Not Measured'){
            item.Date = null;
            item.Period = null;
            item.KRI_Status = 'Not Measured';
            item.IsReported = null;
            item.Measurement = null;
            item.MeasurementValue = null;
            item.Remark = null;
            item.Quater = null
            item.ColorCode =  "#FFFFFF"
            item.KRI_Value = null;
          }



        })
        // console.log('PreviousQuarterData: aftr ' + JSON.stringify(PreviousQuarterData))

        // this.dataSource.data = PreviousQuarterData
        this.dataSource.data = PreviousQuarterData.filter((obj: any) => parseInt(obj.KRI_Defined_Quater.split('-')[1]) <= this.yearValue.toString().substr(2, 2));
        // .filter((data: any) => ((data.Quater == quarterFilter) || data.Quater == null ||  data.KRI_Defined_Quater == quarterFilter));

      }else{
        this.dataSource.data = [];
        this.dataSource.data = JSON.parse(this.service.KRIResultsNew);
        if(selectedQuarter1 == quarterFilter){
          this.dataSource.data.forEach((kri: any) => {
              var singlePerid;
              var date = kri.Date;

              var currentDateObj = new Date(date);
              var numberOfMlSeconds = currentDateObj.getTime();
              // var addMlSeconds = 60 * 60 * 1000;
              // var newDateObj = new Date(numberOfMlSeconds - addMlSeconds);
              var newDateObj = new Date(numberOfMlSeconds);
              let month = new Date(newDateObj).getMonth();
              let year = ' ' + new Date(date).getFullYear() + ' '
              if(this.dataSource.data[0].ReportingFrequency == 'Monthly'){
                  singlePerid = this.months[month] + year;
              }else if(this.dataSource.data[0].ReportingFrequency == 'Quarterly'){
                  singlePerid =  this.getQuarternew(newDateObj)
              }else if(this.dataSource.data[0].ReportingFrequency == 'Semi Annual'){
                  singlePerid = month < 6 ? 'Jan ' + year + ' - Jun ' + year : 'Jul ' + year + ' - Dec ' + year
              }else{
                  singlePerid = ' Jan-Dec ' + year;
              }
              // console.log('this.period: '+this.period)
              // console.log('this.period singlePerid: '+singlePerid)
              if(this.period != singlePerid){
                  kri.Period = null;
                  kri.Date = null;
                  kri.IsReported = null;
                  kri.Measurement = null;
                  kri.MeasurementValue = null;
                  kri.KriScore = null;
                  kri.ThresholdValue = null;
                  kri.Remark = null;
                  kri.KRI_Status = "Not Measured";
                  kri.evidences = null;
                  kri.ColorCode =  "#FFFFFF"
                  kri.KRI_Value = null;
              }
              if(kri.Remark == null || kri.Remark == ""){
                  kri.KRI_Status = "Not Measured";
                  kri.Date = null;
                  kri.Period = null;
                  kri.KRI_Value = null;
                  kri.ColorCode =  "#FFFFFF"
                  kri.MeasurementValue = null;
                  kri.Measurement = null;
              }


              // console.log('kri.KRI_Status: out'+ JSON.stringify(kri))

          });
        }

      }
    //   console.log(this.dataSource.data)
    //   this.dataSource.data.forEach((kri: any) => {
    //     if(kri.Measurement != null && kri.Measurement != undefined){
    //       kri.MeasurementValue = kri.Measurement
    //     }
    //     if (kri.IsReported == "True") {
    //       kri.KRIStatus = 'Reported';
    //     } else if (kri.Date != null && kri.MeasurementValue != null && kri.Remark != '' && kri.Remark != null) {
    //       kri.KRIStatus = "Measured";
    //     } else{
    //       kri.KRIStatus = "Not Measured";
    //       kri.Period = null;
    //       kri.Date = null;
    //       if(kri.MeasurementValue == null){
    //         kri.KRI_Value = null
    //       }
    //     }

    //   })

      // if(selectedQuarter1 != quarterFilter){
      //   var PreviousQuarterData:any = [];
      //   this.dataSource.data.forEach((item: any) => {
      //     if(item.PreviousQuarterData != "Not Measured"){
      //       // PreviousQuarterData.push(item)
      //       var arrayData = item.PreviousQuarterData;
      //       for(let i = 0; i<arrayData?.length; i++){
      //         // arrayData[i].Quarter = arrayData[i].MeasurementQuater ? arrayData[i].MeasurementQuater : quarterFilter;
      //         PreviousQuarterData.push(arrayData[i])
      //       }
      //       // PreviousQuarterData.push())
      //     }else{
      //       PreviousQuarterData.push(item)
      //     }
      //   });


      //   this.dataSource.data = PreviousQuarterData
      //   // .filter((data: any) => ((data.Quater == quarterFilter) || (data.Date == null && data.KRI_Defined_Quater == quarterFilter)));
      //   console.log(this.dataSource.data)
      // }else{
      //   this.dataSource.data = this.dataSource.data;

      // }



    // console.log(this.dataSource.data)

    // var vardata = new Date().getFullYear();
    // let currentDate = new Date();
    // let currMonth = currentDate.getMonth() + 1;
    // let currQuarter = Math.ceil(currMonth / 3);
    // let selectedQuarter = 'Q' + currQuarter + '-' + vardata.toString().substr(2, 2); // Q1-23 KRICreatedDate
    // let quarterFilter = 'Q' + ((this.quarterValue !== undefined && this.quarterValue > 0) ? this.quarterValue : currQuarter) + '-' + this.yearValue.toString().substr(2, 2);

    //   if(selectedQuarter != quarterFilter){
    //     var PreviousQuarterData:any = [];
    //     this.filterData.forEach((item: any) => {
    //       if(item.PreviousQuarterData != "Not Measured"){
    //         PreviousQuarterData.push(item)
    //         var arrayData = item.PreviousQuarterData;
    //         for(let i = 0; i<arrayData?.length; i++){
    //           arrayData[i].Quarter = arrayData[i].MeasurementQuater ? arrayData[i].MeasurementQuater : quarterFilter;
    //           PreviousQuarterData.push(arrayData[i])
    //         }
    //         // PreviousQuarterData.push())
    //       }else{
    //         PreviousQuarterData.push(item)
    //       }
    //     });


    //     this.dataSource.data = PreviousQuarterData.filter((data: any) => ((data.Quater == quarterFilter) || (data.Date == null && data.KRI_Defined_Quater == quarterFilter)));
    //     console.log(this.dataSource.data)
    //   }else{
    //     this.dataSource.data = this.filterData;

    //   }



    if (this.globalSearchValue && this.dataSource.data) {
      this.dataSource.data = this.dataSource.data.filter((i: any) => {
        return Object.values(i).join("").toLowerCase().includes(this.globalSearchValue.toLowerCase())
      });
      let table = document.getElementById("KRITable");
      setTimeout(() => {                           // <<<---using ()=> syntax
        table?.click();
      }, 100);

    }
    if (this.selectedMeasureFreq && this.selectedMeasureFreq != 'All' && this.dataSource.data) {
      this.dataSource.data = this.dataSource.data.filter((i: any) =>
        i.MeasurementFrequency == this.selectedMeasureFreq
      );
    }
    if (this.selectedKriType && this.selectedKriType != 'All' && this.dataSource.data) {
      this.dataSource.data = this.dataSource.data.filter((i: any) =>
        i.KRI_Type == this.selectedKriType
      );
    }
    if (this.selectedKriValue && this.selectedKriValue != 'All' && this.dataSource.data) {
      this.dataSource.data = this.dataSource.data.filter((i: any) =>
        i.KRI_Value == this.selectedKriValue
      );
    }
    if (this.selectedKriStatus && this.selectedKriStatus != 'All' && this.dataSource.data) {
      this.dataSource.data = this.dataSource.data.filter((i: any) =>
        i.KRI_Status == this.selectedKriStatus
      );
    }

    this.updateStatusCounts();

  }
  updateStatusCounts() {
    this.KRICount = this.dataSource.data.length;
    if (this.dataSource.data.length > 0) {
      this.getPeriod();
      this.dataSource.data.forEach(i => {
        if(i.MeasurementValue != null && i.MeasurementValue != undefined){
          i.Measurement = i.MeasurementValue
        }
        // if (i.IsReported == "True") {
        //   i.KRIStatus = 'Reported';
        // } else if (i.Date != null && i.Measurement != null && i.Remark != '' && i.Remark != null) {
        //   i.KRIStatus = "Measured";
        // } else{
        //   i.KRIStatus = "Not Measured";
        // }
        var singlePerid;
        var date = i.Date;
        var currentDateObj = new Date(date);
        var numberOfMlSeconds = currentDateObj.getTime();
        // var addMlSeconds = 60 * 60 * 1000;
        // var newDateObj = new Date(numberOfMlSeconds - addMlSeconds);
        var newDateObj = new Date(numberOfMlSeconds);
        let month = new Date(newDateObj).getMonth();
        let year = ' ' + new Date(date).getFullYear() + ' '
        if (i.ReportingFrequency == 'Monthly') {
          singlePerid = this.months[month] + year;
        } else if (i.ReportingFrequency == 'Quarterly') {
          singlePerid = this.getQuarternew(newDateObj)
        } else if (i.ReportingFrequency == 'Semi Annual') {
          singlePerid = month < 6 ? 'Jan-Jun ' + year : 'Jul-Dec ' + year;
        } else {
          singlePerid = 'Jan-Dec ' + year;
        }
        // if (this.period != singlePerid || i.MeasurementValue == null) {
        //   i.Period = null;
        //   i.Date = null;
        //   i.MeasurementValue = null;
        //   i.ThresholdValue = null;
        //   i.Remark = null;
        //   i.KRIStatus = "Not Measured";
        //   i.ColorCode = "#FFFFFF"
        // }
        // if (i.Remark == null || i.Remark == "") {
        //   i.KRIStatus = "Not Measured";
        //   i.Date = null;
        //   i.Period = null;
        // }
      });
      this.reported = this.dataSource.data.filter(i => i.KRI_Status == 'Reported').length;
      this.measured = this.dataSource.data.filter(i => i.KRI_Status == 'Measured').length;
      this.notMeasured = this.dataSource.data.filter(i => i.KRI_Status == 'Not Measured').length;
      this.rejected = this.dataSource.data.filter(i => i.KRI_Status == 'Rejected').length;
      this.approved = this.dataSource.data.filter(i => i.KRI_Status == 'Approved').length;

    }
    if(this.quarterValue == 1){
      this.periodReport ='Jan ' + this.yearValue + ' - Mar ' + this.yearValue;
    }else if(this.quarterValue == 2){
      this.periodReport ='Apr ' + this.yearValue + ' - Jun ' + this.yearValue;
    }else if(this.quarterValue == 3){
      this.periodReport ='Jul ' + this.yearValue + ' - Sep ' + this.yearValue;
    }else if(this.quarterValue === 4){
      this.periodReport ='Oct ' + this.yearValue + ' - Dec ' + this.yearValue;
    }

  }
  getQuarternew(newDateObj: any) {
    var finaltype;
    var date = new Date(newDateObj);
    var month = Math.floor(date.getMonth() / 3) + 1;
    month -= month > 4 ? 4 : 0;
    var year = date.getFullYear();
    switch (month) {
      case 1:
        finaltype = "Jan " + year + " - Mar " + year;
        break;
      case 2:
        finaltype = "Apr " + year + " - Jun " + year;
        break;
      case 3:
        finaltype = "Jul " + year + " - Sep " + year
        break;
      case 4:
        finaltype = "Oct " + year + " - Dec " + year
        break;
      default:
        break;
    }
    return finaltype;
  }

  generatePdf() {
    // let data = document.getElementById('KRITable') as HTMLElement;
    // let fileName = `KRIReport_${new Date().toISOString()}.pdf`;
    // this.utilsService.generateHtmlAsImageInPDF(data, fileName);
    this.utilsService.generatePdf('KRITable',[], 'KriReport');
  }

}

