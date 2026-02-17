import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as Highcharts from 'highcharts';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { RscaPopupComponent } from '../popups/rsca-popups/rsca-popups.component';

@Component({
    selector: 'app-inherit-risk-chart',
    templateUrl: './inherit-risk-chart.component.html',
    styleUrls: ['./inherit-risk-chart.component.scss']
})
export class InheritRiskChartChartComponent implements OnInit {

  InheritRiskChart: any;
  InheritRiskChartoptions: any;
  inheritRiskSecondStep:any;
  inheritRiskFirstStep:any;
  analysisData:any;
  legendsFordata:any;

  onclick = false;
  listData: any;
  listDataOriginal:any;

  prevQuarterData: any;
  curQuarterData: any;
  yearData: any;
  quaterData: any;
  currentQuarter: any;
  prevQuarter: any;



    constructor( private dashboardService: DashboardService,public dialog: MatDialog

    ) {

    }

    ngOnInit(): void {

       this.dashboardService.gotYearQuater.subscribe((value) => {
          if(value==true){
            this.yearData = this.dashboardService.yearValue
            this.quaterData = this.dashboardService.quaterValue
          }
          setTimeout(()=>{
            this.listData = this.dashboardService.master;
            this.handleData();
          }, 2000)
        });
    }

    handleData(){
        var highRisk:any;
        highRisk = this.listData;
        this.listDataOriginal = highRisk;

        let currentDate = new Date();
        let currMonth = currentDate.getMonth() + 1;
        let currQuarter = Math.ceil(currMonth / 3);
        let curQuarterFilter = 'Q' + ((this.quaterData !== undefined && this.quaterData > 0) ? this.quaterData : currQuarter) + '-' + this.yearData.toString().substr(2, 2);
        this.currentQuarter=curQuarterFilter;

         if(this.quaterData == 1){
          var yearPrev = this.yearData - 1;
          let prevQuarterFilter = 'Q' + ((this.quaterData !== undefined && this.quaterData > 0) ? 4 : 4) + '-' + yearPrev.toString().substr(2, 2);
          this.prevQuarter=prevQuarterFilter;
         }else{
          let prevQuarterFilter = 'Q' + ((this.quaterData !== undefined && this.quaterData > 0) ? this.quaterData - 1 : currQuarter - 1) + '-' + this.yearData.toString().substr(2, 2);
          this.prevQuarter=prevQuarterFilter;
         }

        this.prevQuarterData = this.listDataOriginal.filter((item: any) => item.Quater === this.prevQuarter);

        this.curQuarterData = this.listDataOriginal.filter((item: any) => item.Quater === this.currentQuarter);


        this.createChart()
    }

    createChart(){

        var prevHighRisk = this.prevQuarterData.filter(
            (ele: any) => (ele.InherentRiskRating == "High Risk")
        )

        var curHighRisk = this.curQuarterData.filter(
            (ele: any) => (ele.InherentRiskRating == "High Risk")
        )

        var prevLowMidRisk = this.prevQuarterData.filter(
            (ele: any) => (ele.InherentRiskRating == "Low Risk" || ele.InherentRiskRating == "Moderate Risk")
        )



    var curRedHigh = [];
    var curRedHighNew = [];
    for (var i = 0; i < this.prevQuarterData.length; i++) {
      for (var y = 0; y < this.curQuarterData.length; y++) {
        if (
          this.prevQuarterData[i].InherentRiskID ===
          this.curQuarterData[y].InherentRiskID
        ) {
          if (
            (this.prevQuarterData[i].InherentRiskRating == 'Low Risk' ||
              this.prevQuarterData[i].InherentRiskRating == 'Moderate Risk') &&
            this.curQuarterData[y].InherentRiskRating == 'High Risk' &&
            this.prevQuarterData[i].SLNO == this.curQuarterData[y].SLNO
          ) {
            curRedHigh.push(this.curQuarterData[y]);
          }
        }
      }
    }

    curRedHigh = [...new Set(curRedHigh)];
    curRedHighNew = curRedHigh;

    var curGreenLow = [];
    var curGreenLowNew = [];
    for (var i = 0; i < this.curQuarterData.length; i++) {
      for (var y = 0; y < this.prevQuarterData.length; y++) {
        if (
          this.prevQuarterData[y].InherentRiskID ===
          this.curQuarterData[i].InherentRiskID
        ) {
          if (
            this.prevQuarterData[y].InherentRiskRating == 'High Risk' &&
            (this.curQuarterData[i].InherentRiskRating == 'Moderate Risk' ||
              this.curQuarterData[i].InherentRiskRating == 'Low Risk')&&
              this.prevQuarterData[y].SLNO == this.curQuarterData[i].SLNO
          ) {
            curGreenLow.push(this.curQuarterData[i]);
          }
        }
      }
    }
    curGreenLow = [...new Set(curGreenLow)];
    curGreenLowNew = curGreenLow;



    const UnitsData = []
    let dt = []
    for (let i of curRedHighNew) {
    dt.push(i.Units)
    }
    let setv = new Set(dt)
    for (let i of setv) {
    let list
    let obj = {}
    for (let j of curRedHighNew) {
        let start = curRedHighNew.filter((da: { Units: any; }) => da.Units == i)
        obj = {
        name: i,
        count: curRedHighNew.filter((da: { Units: any; }) => da.Units == i).length
        }
        list = obj
    }
    UnitsData.push(list)
    }
    UnitsData.sort((a:any, b:any) =>  b.count - a.count);
    this.analysisData = UnitsData.slice(0, 4);

    let self = this;
        this.dashboardService.getInheritRiskSchedule()
        this.legendsFordata = this.dashboardService.InheritRiskmaster.legendsFordata;
        this.InheritRiskChartoptions = {
          chart: {
            type: 'column'
        },
        title: {
            text: ''
        },
        tooltip: {
          enabled: true,
          pointFormat: 'Click to view more information',
          headerFormat: '',
          footerFormat: ''
        },
        plotOptions: {
            series: {
              grouping: true,
              cursor: 'pointer',
              minPointLength: 3,
              borderWidth: 0,
              point: {
                events: {
                  click: (event: any) => {
                    if (event.point) {
                      if ((self.onclick = true)) {
                        let barID = event.point.data;
                        this.openPopUp(barID)
                      }
                    }
                  }
                }
              }
          }
        },
        legend: {
            enabled: false
        },
        xAxis: {
            type: 'category',
            accessibility: {
                description: 'Countries'
            }
        },
        yAxis: [{
            title: {
                text: ''
            },
            showFirstLabel: true,
            min: 0
        }],
        series: [{
            pointPlacement: 0.04,
            borderRadius: 4,
            pointWidth: 30,
            dataLabels: [{
                enabled: true,
                top: true,
                style: {
                    fontSize: '12px',
                    fontWeight: 100

                }
            }],
            linkedTo: 'main',
            data: [
                {
                "color": "#cfcfcf",
                "name": "High Risk </br> Count",
                "data": prevHighRisk,
                "y": prevHighRisk?.length
              }, {
                "color": "#cfcfcf",
                "name": "# of Risk migrated from Low/Med to High",
                "data": prevLowMidRisk,
                "y": prevLowMidRisk?.length
              }, {
                "color": "#cfcfcf",
                "name": "# of Risk migrated from High to Low/Med",
                "data": prevHighRisk,
                "y": prevHighRisk?.length
              }
            ],
            name: ''
        }, {
          name: '',
          id: 'main',
          borderRadius: 4,
          pointWidth: 30,
          dataLabels: [{
              enabled: true,
              top: true,
              style: {
                  fontSize: '12px',
                  fontWeight: 100
              }
          }],
          data: [
            {
                "color": "#fc7575",
                "name": "High Risk </br> Count",
                "data": curHighRisk,
                "y": curHighRisk?.length
              }, {
                "color": "#fc7575",
                "name": "# of Risk migrated from Low/Med to High",
                "data": curRedHighNew,
                "y": curRedHighNew?.length
              }, {
                "color": "#8ae6d0",
                "name": "# of Risk migrated from High to Low/Med",
                "data": curGreenLowNew,
                "y": curGreenLowNew?.length
              }
          ]
      }],
        exporting: {
            allowHTML: true
        }
          };

  this.InheritRiskChart = Highcharts.chart("inheritRiskContainer", this.InheritRiskChartoptions);


    }

    openPopUp(data:any) {
      // var highRisk = data.filter(
      //     (ele: any) => (ele.InherentRiskRating == "High Risk")
      // );
      if(data?.length > 0){
          const rsca = this.dialog.open(RscaPopupComponent, {
              disableClose: false,
              width: '70vw',
              data: {
                  data: data,
                  title: "High Risk - Inherent Risk Comparison"
              }
          })
      }
      else{
        this.dashboardService.popupInfo("High Risk - Inherent Risk Comparison", 'No Records Available')
      }
    }
}
