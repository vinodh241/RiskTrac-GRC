import { AfterViewInit, Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { KriPopupComponent } from './kri-popup/kri-popup.component';
import { DOCUMENT } from '@angular/common';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { KriMigrationUnitComponent } from './kri-migration-unit/kri-migration-unit.component';
import { filter } from 'rxjs';


export interface KriData {
  Date: string,
  Frequency: string,
  FrequencyID: number,
  Indicator: string,
  KRICode: string,
  KRI_Target: string,
  KRI_Type: string,
  KRI_Value: string,
  MeasurmentFrequency: string,
  MeasurmentID: string,
  MeasurmentValue: number,
  MetricID: string,
  Period: string,
  Quater: string,
  Remark: string,
  ThresholdID: number,
  ThresholdValue1: number
  ThresholdValue2: number
  ThresholdValue3: number
  ThresholdValue4: number
  ThresholdValue5: number
  Unit: string,
  UnitID: number
}

export interface kriRedZone {
  unit: string,
  count: number,
  percent: number
}


const KriData = [
  {
    Date: "2023-01-31T13:36:52.990Z",
    Frequency: "Monthly",
    FrequencyID: 1,
    Indicator: "% of AML investigation not completed",
    KRICode: "KRI-CM-001",
    KRIStatus: "Measured",
    KRI_Target: "100%",
    KRI_Type: "Process",
    KRI_Value: 1,
    MeasurementFrequency: "Monthly",
    MeasurementID: "1",
    MeasurementValue: 8,
    MetricID: "159",
    Period: "Jan 2023",
    Quater: "Q1-23",
    Remark: "sxsdsada",
    ThresholdID: 1,
    ThresholdValue1: 70,
    ThresholdValue2: 70,
    ThresholdValue3: 80,
    ThresholdValue4: 90,
    ThresholdValue5: 100,
    Unit: "Compliance",
    UnitID: 10,
  }
]

@Component({
  selector: 'app-kri',
  templateUrl: './kri.component.html',
  styleUrls: ['./kri.component.scss']
})

export class KriDashboardComponent implements OnInit {
  // colorData: any[] = [{ 'color': 'linear-gradient(to bottom right, #F84B4B, #FFE0E0)' },
  // { 'color': 'linear-gradient(to bottom right, #FEAF39, #FFF1DC)' },
  // { 'color': 'linear-gradient(to bottom right, #34BDE9, #C3F1FF)' },
  // { 'color': 'linear-gradient(to bottom right, #C2C611, #FDFFB9)' },
  // { 'color': 'linear-gradient(to bottom right, #39FEB7, #02981A)' },
  // ]

  kriScoreData: any = [
    {
      "KRIValue": 1,
      "KriID": 1,
      "KriScore": 10,
      "ColorCode": 1,

    },
    {
      "KRIValue": 2,
      "KriID": 1,
      "KriScore": 20,
      "ColorCode": 2,
    },
    {
      "KRIValue": 3,
      "KriID": 1,
      "KriScore": 30,
      "ColorCode": 3,
    },
    {
      "KRIValue": 4,
      "KriID": 1,
      "KriScore": 40,
      "ColorCode": 4,
    },
    {
      "KRIValue": 5,
      "KriID": 1,
      "KriScore": 50,
      "ColorCode": 5,
    },
  ]
  colorCode: any[] = [{ 'colorCode': '#991313' }, { 'colorCode': '#A06000' }, { 'colorCode': '#00526C' }, { 'colorCode': '#6D7007' }, { 'colorCode': '#045C19' },]
  KeyRiskIndicatorCycleReporting: any
  cycleReport: any[] = [{ "bgColor": '#FF5473' }, { "bgColor": '#096826' }, { "bgColor": '#FFB26B' }]
  kriScore: any[] = [];
  unitData: any;
  color1: any
  color2: any
  color3: any
  color4: any
  color5: any
  totalDaysinQuater:any;
  chartData: any;
  container: any;
  countData: any;
  hiddenVal: boolean = true;
  unitsListData: any;
  currentQuarter: any;
  colorData: any;
  displayedColumns1: string[] = ['unit', 'count', 'percent']
  dataSource: MatTableDataSource<KriData> | any = new MatTableDataSource();
  dataSource1:MatTableDataSource<KriData> | any = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | undefined;
  countOfKri: any;
  totalCountOfKri:any;
  quaterDateRange: any;
  unitDataAmber:any;
  yearData: any;
  quaterData: any;
  KRICode: any;


  period: any;
  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    approved: any;
    rejected: any;
    approvedData: any;
    rejectedData: any;
    quarterFilter: any;


  constructor(
    private utils: UtilsService,
    @Inject(DOCUMENT) private _document: any,
    public DashboardService: DashboardService,
    public dialog: MatDialog,


  ) {
    this.DashboardService.getKeyRiskIndicator();
    this.DashboardService.getYearQuarterData();

    this.DashboardService.gotMasterIndicator.subscribe((values) => {
      if(values){

        this.DashboardService.gotYearQuater.subscribe((value) => {

          if(value==true){
            this.yearData = this.DashboardService.yearValue
            this.quaterData = this.DashboardService.quaterValue
          }
          let currentDate = new Date();
          let currMonth = currentDate.getMonth() + 1;
          let currQuarter = Math.ceil(currMonth / 3);
          this.quarterFilter = 'Q' + ((this.quaterData !== undefined && this.quaterData > 0) ? this.quaterData : currQuarter) + '-' + this.yearData.toString().substr(2, 2);
          this.currentQuarter=
          // this.DashboardService.getKeyRiskIndicator()
          // .subscribe(res => {
          //   next:
          //   if (res.success == 1) {
              this.currentQuaterData(this.yearData,this.quaterData)
              let result = [];
              result = JSON.parse(this.DashboardService.masterIndicatorNew);


              let sss:any
                if (this.DashboardService.quaterValue == 1) {
                 sss = `3/31/${this.DashboardService.yearValue}`
                } else if (this.DashboardService.quaterValue == 2) {
                  sss = `6/30/${this.DashboardService.yearValue}`
                } else if (this.DashboardService.quaterValue== 3) {
                  sss = `9/30/${this.DashboardService.yearValue}`
                } else if (this.DashboardService.quaterValue == 4) {
                  sss = `12/31/${this.DashboardService.yearValue}`
                }
                let startDate = new Date(sss).getTime();
                this.kriScore=result.filter((d:any) => {
                  var time = new Date(d.KRICreatedDate).getTime();
                  return (time <= startDate);
                });


              // var vardata = new Date().getFullYear();

              //   let selectedQuarter = 'Q' + currQuarter + '-' + vardata.toString().substr(2, 2); // Q1-23 KRICreatedDate

              //     if(selectedQuarter != this.quarterFilter){
              //       var PreviousQuarterData:any = [];
              //       this.kriScore=result.forEach((item: any) => {
              //         if(item.PreviousQuarterData != "Not Measured"){
              //           PreviousQuarterData.push(item)
              //           var arrayData = item.PreviousQuarterData;
              //           for(let i = 0; i<arrayData?.length; i++){
              //             arrayData[i].Quarter = arrayData[i].MeasurementQuater ? arrayData[i].MeasurementQuater : this.quarterFilter;
              //             PreviousQuarterData.push(arrayData[i])
              //           }
              //         }else{
              //           PreviousQuarterData.push(item)
              //         }
              //       });

              //       this.kriScore = PreviousQuarterData.filter((data: any) => (data.Quater == this.quarterFilter));
              //     }else{
              //       this.kriScore=result;
              //     }


              var vardata = new Date().getFullYear();
              let selectedQuarter1 = 'Q' + currQuarter + '-' + vardata.toString().substr(2, 2); // Q1-23 KRICreatedDate

                if(selectedQuarter1 != this.quarterFilter){
                  var PreviousQuarterData:any = [];
                  this.kriScore.forEach((item: any) => {
                    if(item.PreviousQuarterData != "Not Measured"){
                      // PreviousQuarterData.push(item)
                      var arrayData = item.PreviousQuarterData;
                      var id = 0;
                      var ind = undefined;
                      for(let i = 0; i<arrayData?.length; i++){
                        if(id < arrayData[i].MeasurementID && arrayData[i].Quater == this.quarterFilter){
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
                    }else if(item.PreviousQuarterData == "Not Measured" && item.Quater == this.quarterFilter){
                      PreviousQuarterData.push(item)
                    }else{
                        item.Date = null;
                        item.Period = null
                        item.KRI_Status = "Not Measured";
                        item.IsReported = "false";
                        item.MeasurementValue = null;
                        item.Remark = null;
                        item.Quater = null
                        item.KRI_Value = null;
                        PreviousQuarterData.push(item)
                    }
                  });


                  PreviousQuarterData.forEach((item: any) => {
                    if(item.Quater != this.quarterFilter){
                      item.Date = null;
                      item.Period = null
                      item.KRI_Status = "Not Measured";
                      item.IsReported = "false";
                      item.MeasurementValue = null;
                      item.Remark = null;
                      item.Quater = null
                      item.KRI_Value = null;
                    }
                  });


                  // PreviousQuarterData.forEach((item: any) => {
                  //   if(item.MeasurementID == "71579"){
                  //     alert(item.Measurement)
                  //   }
                  // });


                  this.kriScore = PreviousQuarterData
                  console.log(this.kriScore)
                  for (let i = 0; i < this.kriScore.length; i++) {
                    if (this.kriScore[i].KRI_Status === null) {
                        this.kriScore[i].KRI_Status = "Not Measured";
                    }
                }
                  // .filter((data: any) => ((data.Quater == this.quarterFilter) || data.KRI_Defined_Quater == this.quarterFilter || data.Quater == null));

                }else{
                  this.KRICode = this.DashboardService.masterKRICode;

                  this.kriScore= JSON.parse(this.DashboardService.masterIndicatorNew);

                  if(selectedQuarter1 == this.quarterFilter){
                    var ReportingFrequencyID;
                    if(this.kriScore[0].Frequency == 'Monthly'){
                        ReportingFrequencyID = 1
                    }else if(this.kriScore[0].Frequency == 'Quarterly'){
                        ReportingFrequencyID = 2
                    }else if(this.kriScore[0].Frequency == 'Semi Annual'){
                        ReportingFrequencyID = 3
                    }else{
                        ReportingFrequencyID = 4
                    }
                    this.getPeriod(ReportingFrequencyID);
                    this.kriScore.forEach((kri: any) => {
                        var singlePerid;
                        var date = kri.Date;

                        var currentDateObj = new Date(date);
                        var numberOfMlSeconds = currentDateObj.getTime();
                        // var addMlSeconds = 60 * 60 * 1000;
                        // var newDateObj = new Date(numberOfMlSeconds - addMlSeconds);
                        var newDateObj = new Date(numberOfMlSeconds);
                        let month = new Date(newDateObj).getMonth();
                        let year = ' ' + new Date(date).getFullYear() + ' '
                        if(this.kriScore[0].Frequency == 'Monthly'){
                            singlePerid = this.months[month] + year;
                        }else if(this.kriScore[0].Frequency == 'Quarterly'){
                            singlePerid =  this.getQuarternew(newDateObj)
                        }else if(this.kriScore[0].Frequency == 'Semi Annual'){
                            singlePerid =  month < 6 ? 'Jan-Jun' + year : 'Jul-Dec ' + year;
                        }else{
                            singlePerid = 'Jan-Dec ' + year;
                        }
                        if(this.period != singlePerid){
                            kri.Period = null;
                            kri.Date = null;
                            kri.IsReported = null;
                            kri.Measurement = null;
                            kri.ThresholdValue = null;
                            kri.Remark = null;
                            kri.KRI_Value = null;
                            kri.KRI_Status = "Not Measured";
                            kri.evidences = null;
                            kri.ColorCode =  "#FFFFFF"
                        }


                    });
                  }

                  // this.kriScore = result;

                }
                // this.kriScore.forEach((kri: any) => {
                //   if(kri.Measurement != null && kri.Measurement != undefined){
                //     kri.MeasurementValue = kri.Measurement
                //   }
                //   if (kri.IsReported == "True") {
                //     kri.KRIStatus = 'Reported';
                //   } else if (kri.Date != null && kri.MeasurementValue != null && kri.Remark != '' && kri.Remark != null) {
                //     kri.KRIStatus = "Measured";
                //   } else{
                //     kri.KRIStatus = "Not Measured";
                //     kri.Period = null;
                //     kri.Date = null;
                //     if(kri.MeasurementValue == null || kri.MeasurementValue == 0){
                //       kri.KRI_Value = null
                //     }

                //     if(kri.Remark == null || kri.Remark == ""){
                //       kri.StatusName = "Not Measured";
                //       kri.Date = null;
                //       kri.Period = null;
                //   }
                //   }




                // })

                this.chartData = this.kriScore;
                this.KRICode.forEach((kri: any) => {
                    if(kri.KRI_Value == 1){
                        this.color1 = kri.ColorCode
                    }else if(kri.KRI_Value == 2){
                        this.color2 = kri.ColorCode
                    }else if(kri.KRI_Value == 3){
                        this.color3 = kri.ColorCode
                    }else if(kri.KRI_Value == 4){
                        this.color4 = kri.ColorCode
                    }else if(kri.KRI_Value == 5){
                        this.color5 = kri.ColorCode
                    }
                });

              // result.filter((da: any) => da.Quater == this.currentQuarter)
              // this.kriScore =  result.filter((da: any) => da.KRI_Defined_Quater == this.currentQuarter)
            //   this.color1 = this.KRICode.find((da: any) => da.KRI_Value === 1).ColorCodekri
            //   this.color2 = this.KRICode.find((da: any) => da.KRI_Value === 2).ColorCode != null ? result.find((da: any) => da.KRI_Value === 2).ColorCode : "#FFBF00"
            //   this.color3 = this.KRICode.find((da: any) => da.KRI_Value === 3).ColorCode != null ? result.find((da: any) => da.KRI_Value === 3).ColorCode : "#FFA500"
            //   this.color4 = result.find((da: any) => da.KRI_Value === 4).ColorCode != null ? result.find((da: any) => da.KRI_Value === 4).ColorCode : "#FFFF00"
            //   this.color5 = result.find((da: any) => da.KRI_Value === 5).ColorCode != null ? result.find((da: any) => da.KRI_Value === 5).ColorCode : "#008000"
              // this.kriScore = result
            //   this.totalCountOfKri = this.kriScore?.filter((da: any) => da.Quater == this.currentQuarter).length
            this.approved = this.kriScore.filter((ele:any)=> ele.KRI_Status == "Approved").length
            console.log("🚀 ~ file: kri.component.ts:411 ~ KriDashboardComponent ~ this.DashboardService.gotYearQuater.subscribe ~ this.approved:", this.approved)
            this.rejected = this.kriScore.filter((ele:any)=> ele.KRI_Status == "Rejected").length
            console.log("🚀 ~ file: kri.component.ts:413 ~ KriDashboardComponent ~ this.DashboardService.gotYearQuater.subscribe ~ this.rejected:", this.rejected)
            this.totalCountOfKri = this.kriScore.length
              // this.countOfKri = result.filter((da: any) => da.Quater == this.currentQuarter).length
              // if(this.kriScore?.length > 0){
                var MainData = this.kriScore.length> 0 ? this.kriScore : [];
                this.getAllKriScoreData(JSON.stringify(MainData),this.DashboardService.masterIndicatorNew)
                this.getAllkriAmber(JSON.stringify(MainData),this.DashboardService.masterIndicatorNew)
                this.getMigrationData(JSON.stringify(MainData),this.DashboardService.masterIndicatorNew)
                this.getReportingCycle(JSON.stringify(MainData),this.DashboardService.masterIndicatorNew)
              // }
              if (this.kriScore.length > 11) {
                this.hiddenVal = false
              }

            // } else {
            //   if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
            //     this.utils.relogin(this._document);
            //   else
            //     this.popupInfo("Unsuccessful", res.error.errorMessage)
            // }
          // })
        })
      }
    });
  }

  getQuarternew(newDateObj:any) {
    var finaltype;
    var date = new Date(newDateObj);
    var month = Math.floor(date.getMonth() / 3) + 1;
    month -= month > 4 ? 4 : 0;
    var year = date.getFullYear();
    switch(month) {
        case 1:
            finaltype =  "Jan-Mar " + year;
            break;
        case 2:
            finaltype =  "Apr-Jun " + year;
            break;
        case 3:
            finaltype =  "Jul-Sep " + year
            break;
        case 4:
            finaltype =  "Oct-Dec " + year
            break;
        default:
            break;
    }
    return finaltype;
  }

  getPeriod(id:any) {
    let frequencyId = id;
    var currentDateObj = new Date();
    var numberOfMlSeconds = currentDateObj.getTime();
    var addMlSeconds = 60 * 60 * 1000;
    var newDateObj = new Date(numberOfMlSeconds - addMlSeconds);
    let month = new Date(newDateObj).getMonth();
    let year = ' ' + new Date().getFullYear() + ' '
    switch (frequencyId) {
      case 1:
        this.period = this.months[month] + year;
        break;
      case 2:
        this.period = this.getQuarter();
        break;
      case 3:
        this.period = month < 6 ? 'Jan-Jun ' + year : 'Jul-Dec ' + year
        break;
      case 4:
        this.period = 'Jan-Dec ' + year
        break;
    };
  }


  getQuarter() {
    var finaltype;
    var date = new Date();
    var month = Math.floor(date.getMonth() / 3) + 1;
    month -= month > 4 ? 4 : 0;
    var year = date.getFullYear();
    switch(month) {
        case 1:
            finaltype =  "Jan-Mar " + year;
            break;
        case 2:
            finaltype =  "Apr-Jun " + year;
            break;
        case 3:
            finaltype =  "Jul-Sep " + year
            break;
        case 4:
            finaltype =  "Oct-Dec " + year
            break;
        default:
            break;
    }
    return finaltype;
  }
  getColorCode(va: any) {
    let datQuater = this.kriScore.filter((da: any) => da.Quater == this.currentQuarter)
    let val = datQuater.filter((da: any) => da.KRI_Value == va)
    return val[0].ColorCode
  }

  getColorCodeData(val: any) {
    if (val == 1) {
      return this.color1
    } else if (val == 2) {
      return this.color2
    } else if (val == 3) {
      return this.color3
    } else if (val == 4) {
      return this.color4
    } else if (val == 5) {
      return this.color5
    }
  }



  getAllFourData(source: any) {
    let dt=source.sort(function(a:any,b:any){return b.Count - a.Count})
    const list = []
    for (let i in [1, 2, 3]) {
      list.push(dt[i])
    }

    return list
  }

  ngOnInit(): void {


  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getKriScoreData(i: any) {
    // const result = this.kriScore.filter(da => da.KRI_Value == i && da.Quater === this.currentQuarter)
    const result = this.kriScore.filter(da => da.KRI_Value == i)
    return this.removeDummyDtNew(result).length
  }

  getDifferene(p1: any, p2: any): any {
    let value = {}
    if (p1 == p2) {
      value = { 'data': 0, 'color': 'green','currentData':p1,'previousData':p2}
    }
    else if (p1 > 0 && p2 == 0) {
      let d = 100
      value = { 'data': Math.ceil(d), 'color': 'green','currentData':p1,'previousData':p2,}
    }
    else if (p2 > 0 && p1 == 0) {
      let d = p2 * 100
      value = { 'data': Math.ceil(d), 'color': 'red','currentData':p1,'previousData':p2,}
    }
    else if (p1 == 0 || p2 == 0) {
      value = { 'data': -1, 'color': '', 'currentData':p1,'previousData':p2, }
    }
    else if (p1 > p2) {
      let vt = p1 - p2
      let t = p1
      let d = (vt / t) * 100
      value = { 'data': Math.ceil(d), 'color': 'green', 'currentData':p1,'previousData':p2, }
    } else if (p1 < p2) {
      let vt = p2 - p1
      let t = p1
      let d = (vt / t) * 100
      value = { 'data': Math.ceil(d), 'color': 'red', 'currentData':p1,'previousData':p2, }
    }
    return value
  }

  getSymbol(el: any) {
    if (el == -1) {
      return '-'
    } else {
      return el + '%'
    }
  }

  getPercentageNew(dt: any) {
    let currentData = dt.filter((dt: any) => dt.KRI_Value == 1).length;
    let previewData = dt.filter((dt: any) => dt.KRI_Value_last == 1).length;
    return this.getDifferene(previewData, currentData)
  }
  getPercentage(dt: any, pt: any) {
    let currentData = dt.filter((dt: any) => dt.KRI_Value == 1).length;
    let previewData = pt.filter((pt: any) => pt.KRI_Value == 1).length;
    return this.getDifferene(previewData, currentData)
  }
  getPercentageamber(dt:any,pt: any){
    let currentData = dt.filter((dt: any) => dt.KRI_Value == 2).length;
    let previewData = pt.filter((pt: any) => pt.KRI_Value == 2).length;
    return this.getDifferene(previewData, currentData)

  }

  getAllkriAmber(data:any, completedata:any){
    var Prdata = this.filterQData(JSON.parse(completedata));
    var data = JSON.parse(data);

    const UnitAmberData = []
    let dt = []
    for (let i of data) {
      dt.push(i.Unit)
    }
    let setv = new Set(dt)
    for (let i of setv) {
      let list
      let obj = {}
      for (let j of data) {
        // let start = data.filter((da: any) => da.Unit == i && da.Quater === this.currentQuarter)
        let start = data.filter((da: any) => da.Unit == i)
        let start1 = Prdata.filter((da: any) => da.Unit == i)
        obj = {
          Unit: i,
          // Count: data.filter((da: any) => da.Quater == this.currentQuarter && da.Unit == i && da.KRI_Value == 2).length,
          Count: data.filter((da: any) =>  da.Unit == i && da.KRI_Value == 2).length,
          Percent: this.getPercentageamber(start,start1).data,
          color: this.getPercentageamber(start,start1).color,
          current:this.getPercentageamber(start,start1).currentData,
          previous:this.getPercentageamber(start,start1).previousData
        }
        list = obj
      }
      UnitAmberData.push(list)
    }
    this.unitDataAmber = UnitAmberData
    if(data.length > 0){
      this.dataSource1.data = this.getAllFourData(UnitAmberData)
    }else{
      this.dataSource1.data = [];
    }

  }

  getAllKriScoreData(data: any, completedata:any) {
    var Prdata = this.filterQData(JSON.parse(completedata));
    var data = JSON.parse(data);


    const UnitData = []
    let dt = []
    for (let i of data) {
      dt.push(i.Unit)
    }
    let setv = new Set(dt)
    for (let i of setv) {
      let list
      let obj = {}
      for (let j of data) {
        // let start = data.filter((da: any) => da.Unit == i && da.Quater === this.currentQuarter)
        var start = data.filter((da: any) => da.Unit == i)
        var start1 = Prdata.filter((da: any) => da.Unit == i)
        if(i == "Compliance"){
        }
        obj = {
          Unit: i,
          // Count: data.filter((da: any) => da.Quater == this.currentQuarter && da.Unit == i && da.KRI_Value == 1).length,
          Count: data.filter((da: any) =>  da.Unit == i && da.KRI_Value == 1).length,
          Percent: this.getPercentage(start,start1).data,
          color: this.getPercentage(start,start1).color,
          current:this.getPercentageamber(start,start1).currentData,
          previous:this.getPercentageamber(start,start1).previousData
        }
        list = obj
      }
      UnitData.push(list)
    }
    this.unitData = UnitData
    if(data.length > 0){
      this.dataSource.data = this.getAllFourData(UnitData)
    }else{
      this.dataSource.data = [];
    }
  }




  getIndex(dt: any) {
    let index = 1
    let list = []
    for (let i of dt) {
      i.sno = index
      list.push(i)
      index++
    }
    return list
  }

  filterQData(data:any){
    var Totaldata:any;
    var Prdata:any
    Totaldata = data;
    var prevQuarter:any;
    let currentDate = new Date();
    let currMonth = currentDate.getMonth() + 1;
    let currQuarter = Math.ceil(currMonth / 3);
    let curQuarterFilter = 'Q' + ((this.quaterData !== undefined && this.quaterData > 0) ? this.quaterData : currQuarter) + '-' + this.yearData.toString().substr(2, 2);
    this.currentQuarter=curQuarterFilter;
    if(this.quaterData == 1){
      var yearPrev = this.yearData - 1;
      let prevQuarterFilter = 'Q' + ((this.quaterData !== undefined && this.quaterData > 0) ? 4 : 4) + '-' + yearPrev.toString().substr(2, 2);
    prevQuarter=prevQuarterFilter;
    }else{
      let prevQuarterFilter = 'Q' + ((this.quaterData !== undefined && this.quaterData > 0) ? this.quaterData - 1 : currQuarter - 1) + '-' + this.yearData.toString().substr(2, 2);
      prevQuarter=prevQuarterFilter;
    }

    var curQ;
    if(this.quaterData == 1){
      curQ = 5
    }else{
      curQ = this.quaterData
    }

    let sss:any
    if (curQ-1 == 1) {
      sss = `3/31/${this.yearData}`
    } else if (curQ-1 == 2) {
      sss = `6/30/${this.yearData}`
    } else if (curQ-1== 3) {
      sss = `9/30/${this.yearData}`
    } else if (curQ-1 == 4) {
      sss = `12/31/${this.yearData-1}`
    }

      // alert(curQ)
      let startDate = new Date(sss).getTime();
      Prdata=Totaldata.filter((d:any) => {
        var time = new Date(d.KRICreatedDate).getTime();
        return (time <= startDate);
      });



     var PreviousQuarterData:any = [];
     Totaldata.forEach((item: any) => {
        if(item.PreviousQuarterData != "Not Measured"){
          var arrayData = item.PreviousQuarterData;
          var id = 0;
          var ind = undefined;
          for(let i = 0; i<arrayData?.length; i++){
            if(id < arrayData[i].MeasurementID && arrayData[i].Quater == prevQuarter){
              id = arrayData[i].MeasurementID;
              ind = i
            }
          }
          if(ind != undefined && ind != null){
            PreviousQuarterData.push(arrayData[ind])
          }else{
            item.KRI_Value = null;
            PreviousQuarterData.push(item)
          }
          // item.PreviousQuarterData = []
        }else if(item.PreviousQuarterData == "Not Measured" && item.Quater == prevQuarter){
          item.KRI_Value = null;
          PreviousQuarterData.push(item)
        }else{
          item.Date = null;
          item.Period = null
          item.KriStatus = "Not Measured";
          item.IsReported = "false";
          item.MeasurementValue = null;
          item.Quater = null
          item.KRI_Value = null;
          PreviousQuarterData.push(item)
        }
     });

     PreviousQuarterData.forEach((itemData: any) => {
      if(!itemData.Remark){
        itemData.StatusName = "Not Measured";
        itemData.Date = null;
        itemData.Period = null;
        itemData.KRI_Value = null;
    }
  })

     PreviousQuarterData.forEach((itemData: any) => {
      if(itemData.Quater != prevQuarter ){
        itemData.Date = null;
        itemData.Period = null
        itemData.KriStatus = "Not Measured";
        itemData.IsReported = "false";
        itemData.MeasurementValue = null;
        itemData.Quater = null
        itemData.KRI_Value = null;
      }
    });

    Prdata = PreviousQuarterData
    // .filter((data: any) => ((data.Quater == prevQuarter) || data.KRI_Defined_Quater == prevQuarter && data.Quater == null));
    Prdata.forEach((kri: any) => {
      if(kri.Measurement != null && kri.Measurement != undefined){
        kri.MeasurementValue = kri.Measurement
      }
      if (kri.IsReported == "True") {
        kri.KRIStatus = 'Reported';
      } else if (kri.Date != null && kri.MeasurementValue != null && kri.Remark != '' && kri.Remark != null) {
        kri.KRIStatus = "Measured";
      } else{
        kri.KRIStatus = "Not Measured";
        kri.Period = null;
        kri.Date = null;
      }
    });
    return Prdata;
  }

  removeDummyDt(result: any) {
    var Totaldata:any;
    var Prdata:any
    Totaldata = result;

    var prevQuarter:any;
    let currentDate = new Date();
    let currMonth = currentDate.getMonth() + 1;
    let currQuarter = Math.ceil(currMonth / 3);
    let curQuarterFilter = 'Q' + ((this.quaterData !== undefined && this.quaterData > 0) ? this.quaterData : currQuarter) + '-' + this.yearData.toString().substr(2, 2);
    this.currentQuarter=curQuarterFilter;
    if(this.quaterData == 1){
      var yearPrev = this.yearData - 1;
      let prevQuarterFilter = 'Q' + ((this.quaterData !== undefined && this.quaterData > 0) ? 4 : 4) + '-' + yearPrev.toString().substr(2, 2);
    prevQuarter=prevQuarterFilter;
    }else{
      let prevQuarterFilter = 'Q' + ((this.quaterData !== undefined && this.quaterData > 0) ? this.quaterData - 1 : currQuarter - 1) + '-' + this.yearData.toString().substr(2, 2);
      prevQuarter=prevQuarterFilter;
    }
     var PreviousQuarterData:any = [];
     Totaldata.forEach((item: any) => {
      if(item.PreviousQuarterData != null && item.PreviousQuarterData != undefined){
        if(item.PreviousQuarterData != "Not Measured"){
          var arrayData = item.PreviousQuarterData;
          var id = 0;
          var ind = undefined;
          for(let i = 0; i<arrayData?.length; i++){
            if(id < arrayData[i].MeasurementID && arrayData[i].Quater == prevQuarter){
              id = arrayData[i].MeasurementID;
              ind = i
            }
          }
          if(ind != undefined && ind != null){
            PreviousQuarterData.push(arrayData[ind])
          }else{
            PreviousQuarterData.push(item)
          }
        }else if(item.PreviousQuarterData == "Not Measured" && item.Quater == prevQuarter){
          PreviousQuarterData.push(item)
        }else{
          item.Date = null;
          item.Period = null
          item.KriStatus = "Not Measured";
          item.IsReported = "false";
          item.MeasurementValue = null;
          item.Remark = null;
          item.Quater = null
          item.KRI_Value = null;
          PreviousQuarterData.push(item)
        }
      }
     });
     PreviousQuarterData.forEach((item: any) => {
      if(item.Quater != prevQuarter){
        item.Date = null;
        item.Period = null
        item.KriStatus = "Not Measured";
        item.IsReported = "false";
        item.MeasurementValue = null;
        item.Remark = null;
        item.Quater = null
        item.KRI_Value = null;
      }
    });
    Prdata = PreviousQuarterData
    // .filter((data: any) => ((data.Quater == prevQuarter) || data.KRI_Defined_Quater == prevQuarter || data.Quater == null));
    Prdata.forEach((kri: any) => {
      if(kri.Measurement != null && kri.Measurement != undefined){
        kri.MeasurementValue = kri.Measurement
      }
      if (kri.IsReported == "True") {
        kri.KRIStatus = 'Reported';
      } else if (kri.Date != null && kri.MeasurementValue != null && kri.Remark != '' && kri.Remark != null) {
        kri.KRIStatus = "Measured";
      } else{
        kri.KRIStatus = "Not Measured";
        kri.Period = null;
        kri.Date = null;
          kri.KRI_Value = null
      }
    });

    const UnitData = []
    let dt = []
    for (let i of result) {
      dt.push(i.Unit)
    }
    let setv = new Set(dt)
    for (let i of setv) {
      let list
      let obj = {}
      for (let j of result) {
        // let start = result.filter((da: any) => da.Unit == i && da.Quater === this.currentQuarter)
        let start = result.filter((da: any) => da.Unit == i)
        let start1 = Prdata.filter((da: any) => da.Unit == i)
        obj = {
          Unit: i,
          Count: result.filter((da: { Unit: any; }) => da.Unit == i).length,
          Percent: this.getPercentage(start,start1).data,
          color: this.getPercentage(start,start1).color
        }
        list = obj
      }
      UnitData.push(list)
    }

    return UnitData

  }

  removeDummyDtNew(result: any) {

    const UnitData = []
    let dt = []
    for (let i of result) {
      dt.push(i.Unit)
    }
    let setv = new Set(dt)
    for (let i of setv) {
      let list
      let obj = {}
      for (let j of result) {
        // let start = result.filter((da: any) => da.Unit == i && da.Quater === this.currentQuarter)
        let start = result.filter((da: any) => da.Unit == i)
        obj = {
          Unit: i,
          Count: result.filter((da: { Unit: any; }) => da.Unit == i).length,
          Percent: this.getPercentageNew(start).data,
          color: this.getPercentageNew(start).color
        }
        list = obj
      }
      UnitData.push(list)
    }

    return UnitData

  }

  getName(ad:any){
    let dts
    if(ad==1){
      dts=' Unit - List of KRI in Red Zone'
    }else if (ad==2){
      dts=' Unit - List of KRI in Amber Zone'
    }
    return dts
  }

  getRow(row: any,id:any) { const result = this.kriScore.filter(da => da.Unit == row.Unit && da.KRI_Value == id)
    const data = this.getIndex(result)
    const kriPopup = this.dialog.open(KriPopupComponent, {
      disableClose: false,
      height: '80vh',
      width: '70vw',
      data: { data: data, name: row.Unit+this.getName(id) }
    })
  }




  openPopUp(va: any): void {
    const result = this.kriScore.filter(da => da.KRI_Value == va)
    const data = this.getIndex(this.removeDummyDtNew(result))
    const kriPopup = this.dialog.open(KriMigrationUnitComponent, {
      disableClose: false,
      height: '80vh',
      width: '50vw',
      data: { mode: 'unit-1', value: data, kri:result, name: 'Under KRI Score - '+va }
    })
  }

  popupInfo(title: string, message: string) {
    const timeout = 3000; // 3 seconds
    const confirm = this.dialog.open(InfoComponent, {
      id: "InfoComponent",
      disableClose: true,
      minWidth: "300px",
      panelClass: "dark",
      data: {
        title: title,
        content: message
      }
    });

    confirm.afterOpened().subscribe(result => {
      setTimeout(() => {
        confirm.close();
        // this.router.navigate(['']);
      }, timeout)
    });
  }

  removeDuplicateValue(data: any) {
    const UnitData = []
    let dt = []
    for (let i of data) {
      dt.push(i.Unit)
    }
    let setv = new Set(dt)
    for (let i of setv) {
      let list
      let obj = {}
      for (let j of data) {
        obj = {
          Unit: i,
          // Count: data.filter((da: any) => da.Unit == i && da.Quater === this.currentQuarter).length,

          Count: data.filter((da: any) => da.Unit == i).length,// Percent:(data.filter((da: { Unit: any; }) => da.Unit == i).length/data.length)*100
        }
        list = obj
      }
      UnitData.push(list)
    }
    return UnitData

  }

  getMigrationData(data: any,completedata: any) {
    // data = data.filter((da: any) => da.Quater === this.currentQuarter)

    var Totaldata:any;
    Totaldata = JSON.parse(data);
    var Prdata = this.filterQData(JSON.parse(completedata));

     let list = []
     let listRedZone = []
     let listgreenYellowZone = []

      for (var i = 0; i < Totaldata.length; i++) {
        for (var y = 0; y < Prdata.length; y++) {
          if(Totaldata[i].KRICode == Prdata[y].KRICode){
            // if (Totaldata[i].Date != null && Totaldata[i].MeasurementValue != null && Totaldata[i].Remark != '' && Totaldata[i].Remark != null) {
              // if (Prdata[y].IsReported == true) {
                if ((Prdata[y].KRI_Value == 2 || Prdata[y].KRI_Value == 3 || Prdata[y].KRI_Value == 4 || Prdata[y].KRI_Value == 5) && Totaldata[i].KRI_Value == 1){
                  listRedZone.push(Totaldata[i])
                }else if ((Prdata[y].KRI_Value == 1 || Prdata[y].KRI_Value == 2 || Prdata[y].KRI_Value == 3)  && (Totaldata[i].KRI_Value == 4 || Totaldata[i].KRI_Value == 5)){
                  listgreenYellowZone.push(Totaldata[i])
                }
              // }
            // }
            // } else if (Totaldata[i].Date != null && Totaldata[i].MeasurementValue != null && Totaldata[i].Remark != '' && Totaldata[i].Remark != null) {
            //   if (Totaldata[i].IsReported == true) {
            //     if ((Prdata[y].KRI_Value == 4 || Prdata[y].KRI_Value == 5) && Totaldata[i].KRI_Value == 1){
            //       listRedZone.push(Totaldata[i])
            //     }
            //     if (Prdata[y].KRI_Value == 1 && (Totaldata[i].KRI_Value == 4 || Totaldata[i].KRI_Value == 5)){
            //       listgreenYellowZone.push(Totaldata[i])
            //     }
            //   }
            // }
          }
        }
      }

      // let list = []
      // let listRedZone = []
      // let listgreenYellowZone = []
      // for (let i of Caldata) {
      //   if (i.KRI_Value == 1) {
      //     listRedZone.push(i)
      //   }
      //   if (i.KRI_Value == 4 || i.KRI_Value == 5) {
      //     listgreenYellowZone.push(i)
      //   }
      // }
      if(listgreenYellowZone.length>0){
        list.push({ 'idx': 1, 'value': 'Yellow/Green', "dat": this.removeDuplicateValue(listgreenYellowZone), "data": listgreenYellowZone })
      }
      if(listRedZone.length>0){
        list.push({ 'idx': 2, 'value': 'Red', "dat": this.removeDuplicateValue(listRedZone), "data": listRedZone })
      }
      this.unitsListData = list
  }



  unitPopUp(id:any): void {
    let dt ,abc
    let name
    // let dts=this.kriScore.filter((as:any)=>as.Quater==this.currentQuarter)
    let dts=this.kriScore
    if (id==1){
      abc=1
      dt=this.unitData.sort(function(a:any,b:any){return b.Count - a.Count})
      name='Top Units having # of KRIs in the RED Zone'
    }else if (id==2){
      abc=2
      dt=this.unitDataAmber.sort(function(a:any,b:any){return b.Count - a.Count})
      name='Top Units having # of KRIs in the AMBER Zone'
    }
    // let dt=this.unitData.sort(function(a:any,b:any){return a.Count -b.Count})
    const kriPopup = this.dialog.open(KriMigrationUnitComponent, {
      disableClose: false,
      height: '80vh',
      width: '60vw',
      data: { mode: 'unit-2', value: this.getIndex(dt), kri:dts, name: name,abc:abc },
    })

  }


  getReportingCycle(kri: any,completedata: any): any {
    let result = [];
    let Prdata = []
    result = JSON.parse(this.DashboardService.masterIndicatorNew);



    var prevQuarter:any;
    let currentDate = new Date();
    let currMonth = currentDate.getMonth() + 1;
    let currQuarter = Math.ceil(currMonth / 3);
    let curQuarterFilter = 'Q' + ((this.quaterData !== undefined && this.quaterData > 0) ? this.quaterData : currQuarter) + '-' + this.yearData.toString().substr(2, 2);
    this.currentQuarter=curQuarterFilter;
    if(this.quaterData == 1){
      var yearPrev = this.yearData - 1;
      let prevQuarterFilter = 'Q' + ((this.quaterData !== undefined && this.quaterData > 0) ? 4 : 4) + '-' + yearPrev.toString().substr(2, 2);
    prevQuarter=prevQuarterFilter;
    }else{
      let prevQuarterFilter = 'Q' + ((this.quaterData !== undefined && this.quaterData > 0) ? this.quaterData - 1 : currQuarter - 1) + '-' + this.yearData.toString().substr(2, 2);
      prevQuarter=prevQuarterFilter;
    }

    var curQ;
    if(this.quaterData == 1){
      curQ = 5
    }else{
      curQ = this.quaterData
    }

    let sss:any
    if (curQ-1 == 1) {
      sss = `3/31/${this.yearData}`
    } else if (curQ-1 == 2) {
      sss = `6/30/${this.yearData}`
    } else if (curQ-1== 3) {
      sss = `9/30/${this.yearData}`
    } else if (curQ-1 == 4) {
      sss = `12/31/${this.yearData-1}`
    }

      // alert(curQ)
      let startDate = new Date(sss).getTime();
      Prdata=result.filter((d:any) => {
        var time = new Date(d.KRICreatedDate).getTime();
        return (time <= startDate);
      });


      var PreviousQuarterData:any = [];
      Prdata.forEach((item: any) => {
        if(item.PreviousQuarterData != "Not Measured"){
          // PreviousQuarterData.push(item)
          var arrayData = item.PreviousQuarterData;
          var id = 0;
          var ind = undefined;
          for(let i = 0; i<arrayData?.length; i++){
            if(id < arrayData[i].MeasurementID && arrayData[i].Quater == prevQuarter){
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
        }else if(item.PreviousQuarterData == "Not Measured" && item.Quater == prevQuarter){
          PreviousQuarterData.push(item)
        }else{
          item.Date = null;
          item.Period = null
          item.KriStatus = "Not Measured";
          item.IsReported = "false";
          item.MeasurementValue = null;
          item.Remark = null;
          item.Quater = null
          item.KRI_Value = null;
          PreviousQuarterData.push(item)
        }
      });


      PreviousQuarterData.forEach((item: any) => {
        if(item.Quater != prevQuarter){
          item.Date = null;
          item.Period = null
          item.KriStatus = "Not Measured";
          item.IsReported = "false";
          item.MeasurementValue = null;
          item.Remark = null;
          item.Quater = null
          item.KRI_Value = null;
        }
        if(item.Remark == null){
          item.KRI_Value = null;
        }


      });

      Prdata = PreviousQuarterData


      console.log("Prdata", Prdata)

    // var Prdata = this.filterQData();
    var curdata = JSON.parse(kri);
    // Prdata = Prdata.filter((da: any) => da.Quater === this.currentQuarter)
    this.KeyRiskIndicatorCycleReporting = [
      { cycle: this.getVal(Prdata,curdata,1).data, cycleText: this.getVal(Prdata,curdata,1).dif, zone: 'in Red Zone',color:this.color1 },
      { cycle: this.getVal(Prdata,curdata,5).data, cycleText: this.getVal(Prdata,curdata,5).dif, zone: 'in Green Zone',color:this.color5 },
      { cycle: this.getUnchanged(Prdata,curdata).data, cycleText: this.getUnchanged(Prdata,curdata).dif, zone: '', color:'#FFB26B' }]
    let list = []

  }


  getVal(Prdata: any, curdata:any, i:any): any {
    let val = {};
    let preData = Prdata.filter((da: any) => (da.KRI_Value === i)).length;
    let curData = curdata.filter((da: any) => da.KRI_Value === i).length;
    console.log("preData"+i,preData);
    console.log("curData"+i,curData);
    if (preData == curData) {
      val = { data: 0, dif: 'unchanged' }
    } else if (curData > 0 && preData == 0) {
      val = { data: 100, dif: 'Increase' }
    }else if (preData > 0 && curData == 0) {
      val = { data: 100, dif: 'Decrease' }
    }else if (curData > preData) {
      let vt = curData - preData
      let t = preData
      let d = (vt / t) * 100
      val = { data: Math.ceil(d), dif: 'Increase' }
    } else if (curData < preData) {
      let vt = preData - curData
      let t = preData
      let d = (vt / t) * 100
      val = { data: Math.ceil(d), dif: 'Decrease' }
    }
    return val
  }


  // getValred(Prdata: any, curdata:any): any {
  //   let val = {};
  //   let preData = Prdata.filter((da: any) => da.KRI_Value === 1).length;
  //   let curData = curdata.filter((da: any) => da.KRI_Value === 1).length;

  //   console.log("preData",preData);
  //   console.log("curData",curData);

  //   if (preData == curData) {
  //     val = { data: 0, dif: 'Increase' }
  //   } else if (curData > 0 && preData == 0) {
  //     val = { data: 100, dif: 'Decrease' }
  //   } else if (preData == 0 || curData == 0) {
  //     val = { data: 0, dif: '' }
  //   } else if (curData > preData) {
  //     let vt = curData - preData
  //     let t = preData
  //     let d = (vt / t) * 100
  //     val = { data: Math.ceil(d), dif: 'Increase' }

  //   } else if (curData < preData) {
  //     let vt = preData - curData
  //     let t = preData
  //     let d = (vt / t) * 100
  //     val = { data: Math.ceil(d), dif: 'Decrease' }
  //   }
  //   return val
  // }

  getUnchanged(Prdata: any, curdata:any,) {
    // let val=(unchange / Prdata.length) * 100
    let dts
    let unchange:any = 0

    for (var i = 0; i < curdata.length; i++) {
      for (var y = 0; y < Prdata.length; y++) {
        if(curdata[i].KRICode == Prdata[y].KRICode){
            if (Prdata[y].KRI_Value == curdata[i].KRI_Value){
              unchange =  unchange+1;
            }
        }
      }
    }
    let val = ((unchange / (Prdata.length)) * 100)
    if(unchange==0 || Prdata.length==0){
      dts=0
    }else{
      dts=val
    }

    return { data: Math.ceil(dts), dif: 'Unchanged' }
  }

   getCountOfSchedule(dts: any) {
    let date_1 = new Date();
    let date_2 = new Date(dts);
    let difference = date_2.getTime() - date_1.getTime();
    let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
    if(TotalDays>1){
      this.totalDaysinQuater="Approaching due date in "+TotalDays+" days"
    }else if(TotalDays==1){
      this.totalDaysinQuater="Approaching due date in "+TotalDays+" day"
    }else if(TotalDays==0){
      this.totalDaysinQuater="This quarter ends today"
    }else{
      this.totalDaysinQuater="This quarter has been completed"
    }

  }

  currentQuaterData(year:any,quater:any) {
    let currentDate = new Date(); // Get the current date
    //  let currentQuarter = 'Q' + Math.ceil((currentDate.getMonth() + 1) / 3) + '-' + currentDate.getFullYear().toString().substr(2, 2); // Get the current quarter
    // let vale = Math.ceil((currentDate.getMonth() + 1) / 3)
    if (quater == 1) {
      this.quaterDateRange = `Jan ${year} - Mar ${year}`
      let dts=`3/31/${year}`
      this.getCountOfSchedule(dts)
    } else if (quater == 2) {
      this.quaterDateRange = `Apr ${year} - Jun ${year}`
      let dts=`6/30/${year}`
      this.getCountOfSchedule(dts)
    } else if (quater == 3) {
      this.quaterDateRange = `Jul ${year} - Sep ${year}`
      let dts=`9/30/${year}`
      this.getCountOfSchedule(dts)
    } else if (quater == 4) {
      this.quaterDateRange = `Oct ${year} - Dec ${year}`
      let dts=`12/31/${year}`
      this.getCountOfSchedule(dts)
    }

  }

  approve(){
   this.approvedData = this.kriScore.filter((ele:any)=> ele.KRI_Status == "Approved")
   const kriPopup = this.dialog.open(KriPopupComponent, {
    disableClose: false,
    height: '80vh',
    width: '70vw',
    data: {
        data: this.approvedData,
        name: "Approved"
    },
});
  }

  reject(){
    this.rejectedData = this.kriScore.filter((ele:any)=> ele.KRI_Status == "Rejected")
    const kriPopup = this.dialog.open(KriPopupComponent, {
     disableClose: false,
     height: '80vh',
     width: '70vw',
     data: {
         data: this.rejectedData,
         name: "Rejected"
     },
 });
  }


}


