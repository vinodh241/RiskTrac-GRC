import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as Highcharts from "highcharts";
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { DOCUMENT } from '@angular/common';
import { RaPopupComponent } from '../../Popups/ra-popup/ra-popup.component';
import { CmPopupComponent } from '../../Popups/cm-popup/cm-popup.component';
let Boost = require("highcharts/modules/boost");
let noData = require("highcharts/modules/no-data-to-display");
let More = require("highcharts/highcharts-more");

Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);
require("highcharts/modules/networkgraph")(Highcharts);

@Component({
  selector: 'app-ra-bar-graph',
  templateUrl: './ra-bar-graph.component.html',
  styleUrls: ['./ra-bar-graph.component.scss']
})
export class RaBarGraphComponent implements OnInit {
  majorRAOptions: any;
  majorRiskOptions: any;
  criticalData: any;
  totalRiskMetrics: any;
  quaterData: any;
  totalRiskMetrics1: any;
  quaterData1: any;
  RiskData: any;
  totalLowdata: any;
  totalCriticaldata: any;
  totalModeratedata: any;
  uniqueValues: Set<any> = new Set();
  totQuater: any = [];
  totRisk: any;
  count: any;
  quarterData: any = [];
  qData: any;
  totCriticallevel: any;
  RawData: any;
  prevQuarterData: any;
  totCrirical: any;
  formattedData: any;
  yearData: any;
  quaterSelectedValue: any;
  allData: any;


  constructor(
    private dashboardservice: DashboardService,
    public dialog: MatDialog,
    @Inject(DOCUMENT) private _document: any,
  ) { }

  ngOnInit(): void {
    this.dashboardservice.gotRAMaster.subscribe((value) => {
      if (value == true) {
        this.formattedData = this.dashboardservice.RAMaster?.Formatted_DATA; 
        this.RiskData = (this.formattedData && Array.isArray(this.formattedData)) 
          ? this.formattedData.filter((item:any) => item.CollectionStatusName !== "Not Started" && item.StatusID !== null && item.StatusID !== 1 && item.StatusID !== 2 )
          : []; 
        // console.log('this.RiskData : ',this.RiskData )
         



        this.dashboardservice.gotYearQuater.subscribe((value) => {
          this.yearData = this.dashboardservice.yearValue;
          this.quaterSelectedValue =
              this.dashboardservice.quaterValue;
          // console.log('this.yearData', this.yearData);
          // console.log('this.quaterData', this.quaterSelectedValue);
         
          this.quarterData = [];
          const currentDate = new Date();

          const currentQuarter = Math.ceil(
              (currentDate.getMonth() + 1) / 3
          );
          let currQuarter    = "Q" + Math.ceil((currentDate.getMonth() + 1) / 3) + "-" + currentDate.getFullYear().toString().substr(2,2); // Get the current quarter
          const previousQuarters = [];
          let quarter : any;
          let year:any
          let obj: any = {};
          for (let i = 0; i <= 3; i++) {
              if (this.quaterSelectedValue == undefined ) {
                  quarter = currentQuarter - i;
                  year = currentDate.getFullYear();
              } else {
                  quarter = this.quaterSelectedValue - i;
                  year = this.yearData;
              }
              if (quarter <= 0) {
                  quarter += 4;
                  year--;
                  obj[`Q${quarter}-${year}`] = `Q${quarter}-${year
                      .toString()
                      .slice(-2)}`;
              }
              previousQuarters.push(
                  `Q${quarter}-${year.toString().slice(-2)}`
              );
          }

          // console.log('previousQuarters', previousQuarters);

          for (const quarter of previousQuarters) {
            const filteredData = (this.RiskData && Array.isArray(this.RiskData))
              ? this.RiskData.filter((item: any) => item.Quater === quarter && item.RiskMetricLevel === 3)
              : [];
            this.quarterData.push({
              name: quarter,
              y: filteredData.length,
              countdata: filteredData,
            });
          }

         
          this.barGraph();
          setTimeout(() => {
              this.display();
          }, 1000);
      });
    }
  })

  // this.barGraph();
  // setTimeout(() => { this.display() }, 2000)
}



















        // let uniqueQuarter = [];
        // const uniqueCombination: any = {};
        
        // this.totCrirical = this.RiskData.filter((obj: any) => obj.RiskMetricLevel == 3);


        // console.log('this.totCrirical:bar ', this.totCrirical)
        // const currentDate = new Date();
        // const currentQuarter = Math.ceil((currentDate.getMonth() + 1) / 3);
        // const previousQuarters = [];
        // let obj: any = {};
        // for (let i = 0; i <= 3; i++) {
        //   let quarter = currentQuarter - i;
        //   let year = currentDate.getFullYear();
        //   if (quarter <= 0) {
        //     quarter += 4;
        //     year--;
        //     obj[`Q${quarter}-${year}`] = `Q${quarter}-${year.toString().slice(-2)}`;
        //   }
        //   previousQuarters.push(`Q${quarter}-${year.toString().slice(-2)}`);
        // }
        // // console.log('previousQuarters', previousQuarters);

        // for (const quarter of previousQuarters) {
        //   const filteredData = this.RiskData.filter((item: any) => item.Quater === quarter && item.RiskMetricLevel === 3);
        //   this.quarterData.push({
        //     name: quarter,
        //     y: filteredData.length,
        //     countdata: filteredData,
        //   });
        // }
        // console.log('count: ',countdata);
        // console.log("graph :this.quarterData: ", this.quarterData);
    



  barGraph() {    
    let selectedPoint: any;
    const self = this;
    this.majorRiskOptions = {
      chart: {
        type: 'column',
        events: {
          load: function (): any {
            selectedPoint = (this as any).series[0].data[0];
            // console.log('selectedPoint', selectedPoint);
            // selectedPoint.update({ color: 'red' });                
            selectedPoint.select(true, true);
          },
        },
      },
      credits: {
        enabled: false,
      },
      title: {
        text: undefined,
      },
      subtitle: {
        text: undefined,
      },
      accessibility: {
        announceNewData: {
          enabled: true,
        },
      },
      xAxis: [
        {
          type: 'category',
          lineWidth: 0,
          tickWidth: 0,
          minPadding: 0,
          maxPadding: 0,
          plotLines: [
            {
              color: '#CCCCCC',
              width: 1,
              value: -0.5, // Add plot line at the start side of the graph
              zIndex: 5,
            },
            {
              color: 'rgba(204, 204, 204, 0.3)', // Lighter color with transparency
              width: 1, // Adjust the width as desired
              value: 3.5, // Add plot line at the end side of the graph
              zIndex: 5,
            },
          ],
        },
      ],
      yAxis: [
        {
          title: {
            enabled: false,
          },
          tickInterval: 20,
        },
      ],
      legend: {
        enabled: false,
      },
      plotOptions: {

        series: {
          point: {
            events: {
              select: function () {
                (this as any).update({ color: 'red' });
              },
              unselect: function () {
                (this as any).update({ color: '' });
              },
              click: (event: any) => {
                const point = event.point;
                // console.log('point :',point.name)
                this.showBarData(point.name);                
              }
            },
          },
          pointWidth: 15,
          borderWidth: 0,
          borderRadius: 8,
          dataLabels: {
            enabled: true,
            format: '{point.y}',
          },
          style: {
            width: '20px',
          },
          states: {

            select: {
              color: {

                linearGradient: {
                  x1: 0,
                  x2: 0,
                  y1: 1,
                  y2: 0,
                },
                stops: [
                  [0, '#FFAA2E'],
                  [1, '#CB4900'],
                ],
              },
            },
          },
          allowPointSelect: true,
        },
      },
      // tooltip: {
      //   enabled: false,
      // },
      tooltip: { 
        enabled: true,
        pointFormat: '<b>Click here! for more info.</b><br/>',
        headerFormat: '',
        footerFormat: ''
      },
      series: [
        {

          color: {
            linearGradient: {
              x1: 0,
              x2: 0,
              y1: 1,
              y2: 0,
            },
            stops: [
              [0, '#CBCBCB'],
              [1, ' #F2F2F2'],
            ],
          },
          data: this.quarterData,

        },
      ],
    };



  }

  display() {
    this.majorRAOptions = Highcharts.chart("raMajorRisk", this.majorRiskOptions);
  }

  showBarData(barName:string) :void{ 
    // console.log("quarterDatagraph", this.quarterData);
    let RATitle ='Quarter Wise Critical Risk Metrics'
    let data;  
    let title = barName;
    // let data;  
    for(let key in this.quarterData){
      if (this.quarterData[key].name == barName){
        data =this.quarterData[key].countdata     
      }
    }   
    
    if(data?.length > 0){     
    const dialog = this.dialog.open(CmPopupComponent, {
      disableClose: true,
      maxWidth: '100vw',
      maxHeight: '80vh',
      panelClass: 'full-screen-modal',
      data: {
        id: data,
        RATitle:RATitle,
        title:title,
      },
    });
    dialog.afterClosed().subscribe(() => {
    })
  }
    else {      
      this.dashboardservice.popupInfo( barName+" -- No Records  Available ", '')
  }
  }

}
