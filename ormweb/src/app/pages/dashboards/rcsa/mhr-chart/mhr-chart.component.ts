import { Component, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
declare var require: any;
import * as Highcharts from "highcharts";
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { HighRiskPopupComponent } from '../popups/highrisk-popups/highrisk-popups.component';
import { MatDialog } from '@angular/material/dialog';
import { RscaPopupComponent } from '../popups/rsca-popups/rsca-popups.component';
let Boost = require("highcharts/modules/boost");
let noData = require("highcharts/modules/no-data-to-display");
let More = require("highcharts/highcharts-more");
Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);
require("highcharts/modules/networkgraph")(Highcharts);

@Component({
  selector: 'app-mhr-chart',
  templateUrl: './mhr-chart.component.html',
  styleUrls: ['./mhr-chart.component.scss']
})
export class MhrDashboardComponent implements OnInit {
  maxHighRiskchart: any;
  maxHighRiskoptions: any;
  inherentData: any;
  residualData: any;
  category: any;
  total: any;
  viewall: any = "inherent";
  listData: any;
  listDataOriginal: any;
  onclick = false;
  yearData: any;
  quaterData: any;
  currentQuarter: any;

  constructor(
    private dashboardService: DashboardService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.dashboardService.gotYearQuater.subscribe((value) => {
      if (value == true) {
        this.yearData = this.dashboardService.yearValue
        this.quaterData = this.dashboardService.quaterValue
      }
      let currentDate = new Date();
      let currMonth = currentDate.getMonth() + 1;
      let currQuarter = Math.ceil(currMonth / 3);
      let quarterFilter = 'Q' + ((this.quaterData !== undefined && this.quaterData > 0) ? this.quaterData : currQuarter) + '-' + this.yearData.toString().substr(2, 2);
      this.currentQuarter = quarterFilter;
      setTimeout(() => {
        this.listData = (this.dashboardService.master && Array.isArray(this.dashboardService.master))
          ? this.dashboardService.master.filter((item: any) => item.Quater === this.currentQuarter && item.ResidualRiskRating !== null)
          : [];
        this.setChart(this.viewall);
      }, 2000)
    });
  }

  toggleValues(event: MatSlideToggleChange) {
    if (event.checked) {
      this.viewall = "residual";
      this.setChart(this.viewall);
    } else {
      this.viewall = "inherent";
      this.setChart(this.viewall)
    }
  }

  openPopUp() {
    const rsca = this.dialog.open(HighRiskPopupComponent, {
      disableClose: false,
      width: '70vw',
      data: this.listDataOriginal
    })
  }

  setChart(value: any) {
    var data: any;
    var highRisk: any;
    if (value == "inherent") {
      highRisk = this.listData.filter(
        (ele: any) => (ele.InherentRiskRating == "High" || ele.InherentRiskRating == "Severe" || ele.InherentRiskRating == "Catastrophic")
      )
    } else {
      highRisk = this.listData.filter(
        (ele: any) => (ele.ResidualRiskRating == "High" || ele.ResidualRiskRating == "Severe" || ele.ResidualRiskRating == "Catastrophic")
      )
    }

    const RiskData = []
    let dt = []
    for (let i of highRisk) {
      dt.push(i.Units)
    }
    let setv = new Set(dt)
    for (let i of setv) {
      let list
      let obj = {}
      for (let j of highRisk) {
        let start = highRisk.filter((da: { Units: any; }) => da.Units == i)
        obj = {
          name: i,
          y: highRisk.filter((da: { Units: any; }) => da.Units == i).length,
          data: start
        }
        list = obj
      }
      RiskData.push(list)
    }
    RiskData.sort((a: any, b: any) => 0 - (a.y > b.y ? 1 : -1));
    this.listDataOriginal = RiskData;
    data = RiskData.slice(0, 5);
    this.total = data?.length;
    this.category = [];
    for (let i = 0; i <= data?.length; i++) {
      this.category.push(data[i]?.name)
    }
    let self = this;
    this.maxHighRiskoptions = {
      chart: {
        type: "bar"
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
      xAxis: {
        spacingBottom: 100,
        categories: this.category,
        title: {
          text: ""
        },
        lineColor: '#ffffff',
      },
      yAxis: {
        spacingBottom: 100,
        min: 0,
        title: {
          text: "",
        },
        gridLineColor: '#ffffff',
        crosshair: false,
        tickLength: 0,
        labels: {
          enabled: false
        },
      },
      plotOptions: {
        bar: {
          borderRadius: 7,
          borderWidth: 0.8,
          minPointLength: 3,
          dataLabels: {
            enabled: true
          }
        },
        series: {
          shadow: true,
          cursor: 'pointer',
          color: {
            linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
            stops: [
              [0, '#ffffdd'],
              [1, '#F76C83']
            ]
          },
          point: {
            events: {
              click: (event: any) => {
                if (event.point) {
                  if ((self.onclick = true)) {
                    let barID = event.point.data;
                    let barName = event.point.name;
                    this.openPopUpData(barID, barName)
                  }
                }
              }
            }
          }
        }
      },
      series: [
        {
          showInLegend: false,
          marker: {
            enabled: false
          },
          pointWidth: 15,
          data: data
        }
      ]
    };
    this.maxHighRiskchart = Highcharts.chart("rcsaMaxHighRiskContainer", this.maxHighRiskoptions);
  }

  openPopUpData(data: any, name: any) {
    if (data?.length > 0) {
      const rsca = this.dialog.open(RscaPopupComponent, {
        disableClose: false,
        width: '70vw',
        data: {
          data: data,
          title: name + " - High Risk"
        }
      })
    }
    else {
      this.dashboardService.popupInfo(name + " - High Risk", 'No Records Available')
    }
  }
}