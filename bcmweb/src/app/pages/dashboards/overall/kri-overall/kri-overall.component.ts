import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as Highcharts from 'highcharts';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { KriMigrationUnitComponent } from '../../kri/kri-migration-unit/kri-migration-unit.component';
import { KriPopupComponent } from '../../kri/kri-popup/kri-popup.component';
import { DashboardComponent } from '../../dashboard.component';

@Component({
  selector: 'app-kri-overall',
  templateUrl: './kri-overall.component.html',
  styleUrls: ['./kri-overall.component.scss']
})
export class KriOverallComponent implements OnInit {

  options: any;
  kriCharts: any;
  color1: any
  color2: any
  color3: any
  color4: any
  color5: any
  currentQuarter: any;
  yearData: any;
  quaterData: any;
  KRICode: any;
  period: any;
  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  totalCountOfKri:any;
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
  ];
  measured: any = [];
  notMeasured: any = [];
  reported: any = [];
  kriScore: any[] = [];
  KRIStatus: any;
  quaterDateRange: any;
  totalDaysinQuater:any;
  approved: any;
  rejected: any;
  approvedData: any = [];
  rejectedData: any = [];

  constructor(
    public DashboardService: DashboardService,
    public DashboardComponent: DashboardComponent,
    public dialog: MatDialog) { }

  ngOnInit(): void {


    // this.DashboardService.getOverallDashbardData();
    // this.DashboardService.getYearQuarterData();

    this.DashboardService.gotOverallDashboardMaster.subscribe((values) => {
      if(values){

        this.DashboardService.gotYearQuater.subscribe((value) => {
            this.kriScore = []

          if(value==true){
            this.yearData = this.DashboardService.yearValue
            this.quaterData = this.DashboardService.quaterValue
          }
          let currentDate = new Date();
          let currMonth = currentDate.getMonth() + 1;
          let currQuarter = Math.ceil(currMonth / 3);
          let quarterFilter = 'Q' + ((this.quaterData !== undefined && this.quaterData > 0) ? this.quaterData : currQuarter) + '-' + this.yearData.toString().substr(2, 2);
          this.currentQuarter=quarterFilter;
          // this.DashboardService.getKeyRiskIndicator()
          // .subscribe(res => {
          //   next:
          //   if (res.success == 1) {
              this.currentQuaterData(this.yearData,this.quaterData)
              let result = [];
              result = JSON.parse(this.DashboardService.dashboardKRIMaster);


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


              var vardata = new Date().getFullYear();
              let selectedQuarter1 = 'Q' + currQuarter + '-' + vardata.toString().substr(2, 2); // Q1-23 KRICreatedDate

                if(selectedQuarter1 != quarterFilter){
                  var PreviousQuarterData:any = [];
                  this.kriScore.forEach((item: any) => {
                    if(item.PreviousQuarterData != "Not Measured"){
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
                    }else if(item.PreviousQuarterData == "Not Measured" && item.Quater == quarterFilter){
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
                    if(item.Quater != quarterFilter){
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


                  this.kriScore = PreviousQuarterData;
                }else{
                  this.KRICode = this.DashboardService.masterKRICode;

                  this.kriScore= JSON.parse(this.DashboardService.dashboardKRIMaster);

                  if(selectedQuarter1 == quarterFilter){
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
                //       kri.KRIStatus = "Not Measured";
                //       kri.Date = null;
                //       kri.Period = null;
                //   }
                //   }


                // })

                this.DashboardService.dashboardKRIColorMaster.forEach((kri: any) => {
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
            this.totalCountOfKri = this.kriScore.length
            this.approved = this.kriScore.filter((ele:any)=> ele.KRI_Status == "Approved").length
            console.log("🚀 ~ file: kri.component.ts:411 ~ KriDashboardComponent ~ this.DashboardService.gotYearQuater.subscribe ~ this.approved:", this.approved)
            this.rejected = this.kriScore.filter((ele:any)=> ele.KRI_Status == "Rejected").length
            console.log("🚀 ~ file: kri.component.ts:413 ~ KriDashboardComponent ~ this.DashboardService.gotYearQuater.subscribe ~ this.rejected:", this.rejected)

               this.chartData(this.kriScore);

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

  chartData(data:any) {
    setTimeout(() => {
        this.reported = [];
        this.measured = [];
        this.notMeasured = [];
        data.forEach((kri: any) => {
            if(kri.KRI_Status == 'Reported'){
                this.reported.push(kri)
            }else if(kri.KRI_Status == 'Measured'){
                this.measured.push(kri)
            }else if(kri.KRI_Status == 'Not Measured' ){
                this.notMeasured.push(kri)
            }
        });




    this.options = {
        chart: {
            type: 'column',
            plotBorderColor: '#ccc', // Set the border color for the plot area
            plotBorderWidth: 0.5 // Set the border width for the plot area
        },
        title: {
            align: 'left',
            text: ' ',
        },
        subtitle: {
            align: 'left',
            text: '',
        },
        accessibility: {
            enabled: false,
            announceNewData: {
                enabled: true,
            },
        },
        xAxis: {
            type: 'category',
        },
        yAxis: {
            title: {
                text: '',
            },
            tickInterval: 5,
            labels: {
              style: {
                fontFamily: "Roboto Condensed"
              }
            },
        },
        legend: {
            enabled: false,
        },
        plotOptions: {
            column: { colorByPoint: true },
            series: {
                cursor: 'pointer',
                pointWidth: 15,
                borderWidth: 0,
                minPointLength: 3,
                // outerWidth: 3,
                borderRadius: 6,
                dataLabels: {
                    enabled: true,
                    format: '{point.y}',
                },
            },
        },

        tooltip: {
          enabled: false,
        },

        series: [
            // cursor: 'pointer',

            {
                data: this.getAllData(),
            },
        ],
    };
    this.kriCharts = Highcharts.chart('containercHART', this.options);
    }, 2000);
}


getAllData() {
  let measure = this.measured.length;
  let reported = this.reported.length;
  let notMeasure = this.notMeasured.length;
  return [
      {
          name: `<span style="color:black;font-family: Roboto Condensed; font-size:1.7vh;font-weight:600;">Measured</span>`,
          y: measure,
          // setInterval(()=>{})/
          color: {
              linearGradient: { x1: 1, x2: 0, y1: 0, y2: 1 },
              stops: [
                  [0, '#F2F2F2'],
                  [1, '#CBCBCB'],
              ],
          },
          cursor: 'pointer',
          events: {
              click: () => this.clickBars(this.measured),
          },
          // cursor : pointer,
      },
      {
          name: '<span style="color:red;font-family:Roboto Condensed;font-size:1.7vh;font-weight:600;">Not Measured</span>',
          y:notMeasure,
          color: {
              linearGradient: { x1: 1, x2: 0, y1: 0, y2: 1 },
              stops: [
                  [0, '#E7E7E7'],
                  [1, '#FF6868'],
              ],
          },
          events: {
              click: () => this.clickBars(this.notMeasured),
          },
      },
      {
          name: '<span style="color:#82E090;font-family:Roboto Condensed;font-size:1.7vh;font-weight:600;">Reported</span>',
          y: reported,
          color: {
              linearGradient: { x1: 1, x2: 0, y1: 0, y2: 1 },
              stops: [
                  [0, '#E7E7E7'],
                  [1, '#0FB766'],
              ],
          },
          // cursor:Highcharts.Pointer,
          events: {
              click: () => this.clickBars(this.reported),
          },
      },
  ];
}



getKriScoreData(i: any) {
    // const result = this.kriScore.filter(da => da.KRI_Value == i && da.Quater === this.currentQuarter)
    const result = this.kriScore.filter(da => da.KRI_Value == i)
    return this.removeDummyDtNew(result).length
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

  getPercentageNew(dt: any) {
    let currentData = dt.filter((dt: any) => dt.KRI_Value == 1).length;
    let previewData = dt.filter((dt: any) => dt.KRI_Value_last == 1).length;
    return this.getDifferene(previewData, currentData)
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


  getIndexOpenChart(dt: any, mst:any) {
    let index = 1;
    let list = [];
    for (let i of dt) {
        i.sno = index;
        i.KRIStatus=mst
        list.push(i);
        index++;
    }
    // console.log(list)
    return list;
}
  clickBars(m: any) {
    console.log(this.kriScore);
    if (m == this.measured) {
        m = m
        this.KRIStatus = 'Measured';
    } else if (m == this.notMeasured) {
        m = m
        this.KRIStatus = 'Not Measured';
    } else if (m == this.reported) {
        m = m
        this.KRIStatus = 'Reported';
    }
    // const result = this.values.filter((da: { KRIStatus : any;}) => da.KRIStatus== m)
    // console.log("result",result)
    // const data=this.getIndex(result)
    // console.log(m);
    const kriPopup = this.dialog.open(KriPopupComponent, {
        disableClose: false,
        height: '80vh',
        width: '70vw',
        data: { data: this.getIndexOpenChart(m,this.KRIStatus),
            name: this.KRIStatus },
    });
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


    navigatePage(){
        this.DashboardComponent.openMenu('kri','same');
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
