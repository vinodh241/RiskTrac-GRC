import { Component, Input, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { UtilsService } from 'src/app/services/utils/utils.service';


@Component({
  selector: 'app-risk-appetite-graph',
  templateUrl: './risk-appetite-graph.component.html',
  styleUrls: ['./risk-appetite-graph.component.scss'],
  styles: ['a { color: red; }']
})
export class RiskAppetiteGraphComponent implements OnInit {
  raChartColors: any;
  rachartFirst: any;
  listdata: any;
  totalCriticaldata: any;
  exportedData:any
  totalModeratedata: any;
  raoptionsFirst: any;
  RiskData: any;
  critical: any;
  low: any;
  moderate: any;
  //@Input() 
  totalLowdata:any;
  RawData: any;
  isFunctionalAdmin:boolean=false;
  criticColor: any;
  lowcolor: any;
  modcolor: any;
  backgroundColor = 'rgb(204, 204, 204)'
  isFirst:boolean = true;
  levelData : any[]=[];
  formattedData: any;
  yearData: any;
  quaterData: any;
  quarterFilter: any;
  
  constructor(
    public dashboardservice: DashboardService,
    private utilsService:UtilsService,
  ) {


  }

  ngOnInit(): void {
    this.dashboardservice.gotRAMaster.subscribe((value) => {
      if (value == true) 
      {            
          this.formattedData = this.dashboardservice.RAMaster.Formatted_DATA; 
          this.RawData = this.formattedData.filter((item:any) => item.CollectionStatusName !== "Not Started" && item.StatusID !== null && item.StatusID !== 1 && item.StatusID !== 2 ); 
          const colorData        = this.dashboardservice.RAMaster.RISK_COLOR_DATA;     
          this.exportedData      = colorData;         
          let currentDate        = new Date(); // Get the current date
          this.dashboardservice.gotYearQuater.subscribe((value) => {
            this.yearData = this.dashboardservice.yearValue
            this.quaterData = this.dashboardservice.quaterValue
        


        let currentDate = new Date(); // Get the current date
        let currMonth = currentDate.getMonth() + 1;
        let currQuarter = Math.ceil(currMonth / 3);
        // console.log("currQuarter",currQuarter)

        this.quarterFilter = 'Q' + ((this.quaterData !== undefined && this.quaterData > 0) ? this.quaterData : currQuarter) + '-' + this.yearData.toString().substr(2, 2);   
          // let currentQuarter     = "Q" + Math.ceil((currentDate.getMonth() + 1) / 3) + "-" + currentDate.getFullYear().toString().substr(2,2); // Get the current quarter
          this.RiskData          = this.RawData.filter((data:any) => data.Quater === this.quarterFilter); 
          // console.log(' this.RiskData : ', this.RiskData );
          this.dataGraph();
          this.pieGraph();
          this.display(); 
          this.levelData=[];
          })
      }
    });     
  }

  dataGraph(){              
    let uniqueCombination: any = {}; 
    let level: any = {};
    this.levelData=[];
    if (this.RiskData.length){
      this.RiskData.forEach((item: any) => {
        // const combinationKey = `${item.NodeID}_${item.FWID}_${item.RiskMetricLevelID}`;
        // if (!uniqueCombination[combinationKey]) {
        //   uniqueCombination[combinationKey] = true;
          
        // }
        level[item.LevelName] = level[item.LevelName] ? level[item.LevelName] + 1 : 1;
      });
      
      for (let key in level) {
        this.levelData.push({ levelName: key, levelCount: level[key] });
      }
        // console.log('levelData: graph', this.levelData);
        const lowData = this.levelData.find(data => data.levelName === 'Low Risk Level');
        const moderateData = this.levelData.find(data => data.levelName === 'Moderate Risk Level');
        const criticalData = this.levelData.find(data => data.levelName === 'Critical Risk Level');
       
        this.totalLowdata      = lowData !== undefined    ?   lowData.levelCount : 0;
        this.totalModeratedata = moderateData !== undefined  ? moderateData.levelCount : 0;
        this.totalCriticaldata = criticalData !== undefined  ? criticalData.levelCount : 0;
        this.lowcolor          =  this.exportedData[0].ColorCode;
        this.modcolor          =  this.exportedData[1].ColorCode;
        this.criticColor       =  this.exportedData[2].ColorCode;
    } else {
            this.totalLowdata      = 0
            this.totalModeratedata = 0
            this.totalCriticaldata = 0 
        } 
    
   
  }

  pieGraph(){ 
    this.raoptionsFirst = {
      chart: {
        type: 'pie'
      },
      title: {
        verticalAlign: 'middle',
        align: 'center',
        y: 22, 
        text: "<div style='text-align: center;'><span style='color: #7E7E7E; font-size: 120%;   font-weight: bold;font-family: Roboto Condensed;'>Risk Level</span><br><span style='color: #7E7E7E;font-size: 100%;   font-weight: bold;font-family: Roboto Condensed;'>wise</span><br><strong><span style='color: #000000;font-size: 90%;font-family: Roboto Condensed;   font-weight: bold;'>RA Count</span></strong></div>"
      },       
      tooltip: { 
        enabled: true,
        pointFormat: '<b>{point.name}: {point.y}</b><br/>',
        headerFormat: '',
        footerFormat: ''
      },
      plotOptions: {
        pie: {
          innerSize: 130,
          depth: 0,
          dataLabels: {
            enabled: false
          },
          cursor: 'pointer',
          colors: ['#ffb26a','#dddddd']
        }
      }, 
      series: [{
        data: [
          ['Critical Risk Level', this.totalCriticaldata],
          ['Low Risk Level', this.totalLowdata],
          ['Moderate Risk Level', this.totalModeratedata]
        ],       
        colors: [this.criticColor, this.lowcolor,this.modcolor ],
      }],
      };
  }


  display(){
    this.rachartFirst = Highcharts.chart("raFirstContainer", this.raoptionsFirst);
  }

}
