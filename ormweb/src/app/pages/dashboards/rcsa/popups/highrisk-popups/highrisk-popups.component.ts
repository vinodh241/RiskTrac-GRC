import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DOCUMENT } from '@angular/common';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import * as Highcharts from "highcharts";
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { RscaPopupComponent } from '../rsca-popups/rsca-popups.component';

@Component({
  selector: 'app-highrisk-popups',
  templateUrl: './highrisk-popups.component.html',
  styleUrls: ['./highrisk-popups.component.scss']
})
export class HighRiskPopupComponent implements OnInit {  
  maxHighRiskchart: any; 
  maxHighRiskoptions:any;
  inherentData:any;
  residualData: any;
  category:any;
  total:any;
  onclick = false;
     
  constructor(
    private dialogRef: MatDialogRef<HighRiskPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dashboardService: DashboardService,public dialog: MatDialog
  ) { }

  ngOnInit(): void {     
    this.setChart(this.data)
  }
 

  
  setChart(data:any){
    this.total = data?.length;
    this.category = [];
    for(let i = 0; i<=data?.length; i++){
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
      xAxis: {
        categories: this.category,
        title: {
          text: ""
        },
        lineColor: '#ffffff', 
        
      },
      yAxis: {
        min: 0,
        title: {
          text: "", 
        }, 
        gridLineColor: '#ffffff',
        crosshair: false, 
        tickLength:0,
        labels: {
          enabled: false
        }
      },  
      tooltip: {       
        enabled: true,
        pointFormat: 'Click to view more information',
        headerFormat: '',
        footerFormat: ''
      },
      plotOptions: {
        bar: {
          borderWidth: 0.8,
          dataLabels: {
            enabled: true
          }
        }, 
        
        gridLineColor: '#ffffff',          
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
          lineColor: '#ffffff',         
          point: {        
            events: {
              click: (event: any) => {  
                if (event.point) { 
                  if ((self.onclick = true)) {
                    let barID = event.point.data; 
                    let barName = event.point.name; 
                    this.openPopUpData(barID,barName)
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
          borderRadius: 7,
          data: 
             data
        }
      ]
    };
      this.maxHighRiskchart = Highcharts.chart("HighRiskContainer", this.maxHighRiskoptions); 
  }
  openPopUpData(data:any,name:any) { 
    if(data?.length > 0){
        const rsca = this.dialog.open(RscaPopupComponent, {
            disableClose: false, 
            width: '70vw',         
            data: {
                data: data,
                title: name+" - High Risk"
            }   
        }) 
    }
    else{      
      this.dashboardService.popupInfo( name+" - High Risk", 'No Records Available')
    }
  }

}
