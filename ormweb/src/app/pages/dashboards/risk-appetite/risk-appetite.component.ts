import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { MatDialog } from '@angular/material/dialog';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { DOCUMENT } from '@angular/common';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { ViewAllComponent } from './Popups/view-all/view-all.component';
import { CmPopupComponent } from './Popups/cm-popup/cm-popup.component';
import { RaPopupComponent } from './Popups/ra-popup/ra-popup.component';
import { CmViewallComponent } from './Popups/cm-viewall/cm-viewall.component';

@Component({
    selector: 'app-risk-appetite',
    templateUrl: './risk-appetite.component.html',
    styleUrls: ['./risk-appetite.component.scss']
})
export class RiskApptiteDashboardComponent implements OnInit {
    listdata: any;
    totalCriticaldata: any;
    totalLowdata: any;
    totalModeratedata: any;
    countMetricsTotal: any;
    totalRisk: any;
    data: any;
    dataTable: any;
    RiskData: any[] = [];
    TotLevelName: any;
    Level: any;
    raCount: any;
    result: any
    legalData: any;
    creditRiskData: any;
    financeData: any;
    totalLow: any;
    legal: any;
    creditRisk: any;
    finance: any;
    totalCritical: any;
    totalModerate: any;
    Risks: any;
    totRisksTable: any;
    count: any;
    filterRisksData: any;
    criticalRisks: any;
    moderateRisks: any;
    riskTableData: any;
    viewAlldata : any
    criticalMetrics: any[] =[];
    majorRisks:any[] = [];
    displayedColumns: string[] = ['name','openCount' , 'closedCount' , 'CriticalRiskLevel', 'ModerateRiskLevel'];
    metricGroups: any[]=[];
    levelData: any[]=[];
    lowName: any;
    moderateName: any;
    criticalName: any;
    lineraData: any[] = [];
    status: any;
    statusCount: any;
    totCountRA: any;
    RawData: any;
    uniqueValues: Set<any> = new Set();
    orgViewData: Set<any> = new Set();
    RiskmetricData: any;  //Set<any> = new Set();
    count1:any;
    criticaldata:any;
    orgdata:any;
    idData:any;
    orgDataViewAll:any[]=[];
    exportedData: any;
    lowcolor: string = '';
    modcolor: string = '';
    criticColor: string = '';
    formattedData: any;
    notStarted: any;
    Open: any;
    inProgress: any;
    submitted: any;
    rejected: any;
    completed: any;
    riskMetric :any;
    closedStatus: any;
    openStatus: any;
    currentQuarter: any;
    yearData: any;
    quaterData: any
    quarterFilter:any;
    dataCMGroups:any=[];

    constructor(
        public dashboardservice: DashboardService,
        public dialog: MatDialog,
        private utils: UtilsService,
        @Inject(DOCUMENT) private _document: any,
    ) {

    }
    ngOnInit(): void {
        this.dashboardservice.getDashboardRiskAppetite();
        this.dashboardservice.getYearQuarterData();
        this.dashboardservice.gotRAMaster.subscribe((value) => {
            if (value == true) {   
                //to get the details of the current quater         
                this.formattedData  = this.dashboardservice.RAMaster.Formatted_DATA || [];
                // console.log('this.formattedData: '+ JSON.stringify(this.formattedData)) 
                               
                this.RawData        = this.formattedData.filter((item:any) => item.CollectionStatusName !== "Not Started" && item.StatusID !== null && item.StatusID !== 1 && item.StatusID !== 2 );
                this.dashboardservice.gotYearQuater.subscribe((value) => {
                    this.yearData = this.dashboardservice.yearValue;
                    this.quaterData = this.dashboardservice.quaterValue;
                    let currentDate = new Date(); // Get the current date
                    let currMonth = currentDate.getMonth() + 1;
                    let currQuarter = Math.ceil(currMonth / 3);
                    // console.log("currQuarter",currQuarter)

                    this.quarterFilter = 'Q' + ((this.quaterData !== undefined && this.quaterData > 0) ? this.quaterData : currQuarter) + '-' + this.yearData.toString().substr(2, 2);                
                    // this.quarterFilter  = "Q" + Math.ceil((currentDate.getMonth() + 1) / 3) + "-" + currentDate.getFullYear().toString().substr(2,2); // Get the current quarter
                    this.RiskData       = this.RawData.filter((data:any) => data.Quater == this.quarterFilter);                                                
                    // console.log('this.RiskData : ',this.RiskData )
                    this.notStarted     = this.formattedData.filter((item:any) =>  item.Quater == this.quarterFilter && item.CollectionStatusName == "Not Started" && item.StatusID == null).length;                 
                    this.inProgress     = this.formattedData.filter((item:any) =>  item.Quater == this.quarterFilter && item.StatusID == 2).length;
                    this.submitted      = this.formattedData.filter((item:any) =>  item.Quater == this.quarterFilter && item.StatusID == 3).length;
                    this.rejected       = this.formattedData.filter((item:any) =>  item.Quater == this.quarterFilter && item.StatusID == 4).length;
                    this.Open           = this.inProgress + this.notStarted + this.submitted + this.rejected 
                    this.completed      = this.formattedData.filter((item:any) =>  item.Quater == this.quarterFilter && item.StatusID == 5).length;   
                    
                    this.closedStatus    = this.formattedData.filter((item:any) => item.Quater == this.quarterFilter && item.StatusID == 5);
                    this.openStatus      = this.formattedData.filter((obj:any)  => obj.Quater == this.quarterFilter  && ((obj.CollectionStatusName == "Not Started" && obj.StatusID == null) || obj.StatusID === 2 || obj.StatusID === 3 || obj.StatusID === 4));
                 
                    this.orgRAMajorRisk();
                    this.countMetricGroups();
                    this.countRiskLevel();
                    const colorData     = this.dashboardservice.RAMaster.RISK_COLOR_DATA;                         
                    this.lowcolor       =  colorData?.[0]?.ColorCode || '#808080';
                    this.modcolor       =  colorData?.[1]?.ColorCode || '#FFA500';
                    this.criticColor    =  colorData?.[2]?.ColorCode || '#FF0000';

                    this.status = this.RiskData.filter((obj: any) => obj.StatusID === 1 );
                    this.statusCount    = this.status.length;
                    this.riskMetric     = this.formattedData.filter((data:any) => data.Quater == this.quarterFilter);
                    this.totCountRA     = this.riskMetric.reduce((count:any, item:any) => { 
                                            if (item.Risks) {
                                                count++;
                                            }
                                            return count;
                                            }, 0); 
                                    // console.log('this.totCountRA : ',this.totCountRA )  
                })   
                this.dataCMGroups=[];  
                this.levelData=[];
                this.metricGroups=[]; 
                // this.orgDataViewAll=[]; 
                this.viewAlldata=[]                        
                                                              
            }
        
        })       
    }

    countRiskLevel(){
        let  level :any ={}; 
        this.levelData=[];
        // console.log('this.RiskData: ',this.RiskData);
        if (this.RiskData.length > 0) {           
            const lowData          = this.RiskData.filter((itr:any) => itr.RiskMetricLevel == 1);
            const moderateData     = this.RiskData.filter((itr:any) => itr.RiskMetricLevel == 2); 
            const criticalData     = this.RiskData.filter((itr:any) => itr.RiskMetricLevel == 3);

            this.totalLowdata      = lowData.length > 0   ?   lowData.length : 0;
            this.totalModeratedata = moderateData.length > 0 ? moderateData.length : 0;
            this.totalCriticaldata = criticalData.length > 0  ? criticalData.length : 0;
        } else {
            this.totalLowdata      = 0
            this.totalModeratedata = 0
            this.totalCriticaldata = 0 
        } 
    }  

    orgRAMajorRisk(){         
        let result:any = {};
        let openLevel:any = {};
        let closedLevel:any = {};
        this.RiskData.forEach((item:any) => {
        //   let level = item.LevelName.split(" ").join("");
          
          if (item.RiskMetricLevel === 1) {
            return;
          }
          
          if (!result[item.CaptionData]) {
            result[item.CaptionData] = {
              name: item.CaptionData,
              ModerateRiskLevel: 0,
              CriticalRiskLevel: 0
            };
          }
      
          if ( item.RiskMetricLevel === 2) {
            result[item.CaptionData].ModerateRiskLevel++;
          } else if ( item.RiskMetricLevel === 3) {
            result[item.CaptionData].CriticalRiskLevel++;
          }
        });
      
        for (let key in result) {
          if (result.hasOwnProperty(key) && result[key].CriticalRiskLevel === 0 && result[key].ModerateRiskLevel > 0) {
            result[key].CriticalRiskLevel = 0;
          }
        }
        // console.log('result:--> org,',result) 

        this.openStatus.forEach((item:any) => {
            openLevel[item.CaptionData] ? openLevel[item.CaptionData]++ : openLevel[item.CaptionData] = 1;
        });
        
        this.closedStatus.forEach((item:any) => {
            closedLevel[item.CaptionData] ? closedLevel[item.CaptionData]++ : closedLevel[item.CaptionData] = 1;
        });


        let levelData:any = [];

        for (let open in openLevel) {
            let closedCount = closedLevel[open] || 0;
            levelData.push({ levelName: open, openCount: openLevel[open], closedCount });
        }
        
        for (let closed in closedLevel) {
            if (!openLevel[closed]) {
            levelData.push({ levelName: closed, openCount: 0, closedCount: closedLevel[closed] });
            }
        }
        // console.log('levelData::--> org ',levelData);

        let dataArr = Object.values(result);
        const mergedData :any= [];


        const unmatchedGroupNames:any = [];

        

        // levelData.forEach((levelItem:any) => {
        //   const groupName = levelItem.levelName;
        //   if (!result[groupName]) {
        //     unmatchedGroupNames.push(levelItem);
        //   }
        // });
        
        // Object.keys(result).forEach((groupName) => {
        //   if (!levelData.some((levelItem:any) => levelItem.levelName === groupName)) {
        //     unmatchedGroupNames.push({
        //       levelName: groupName
        //     });
        //   }
        // });

        levelData.forEach((levelItem:any) => {
            const groupName = levelItem.levelName;
            if (!dataArr.some((resultItem:any) => resultItem.name === groupName)) {
              unmatchedGroupNames.push(levelItem);
            }
          });
          
          dataArr.forEach((resultItem:any) => {
            if (!levelData.some((levelItem:any) => levelItem.levelName === resultItem.name)) {
              unmatchedGroupNames.push({
                levelName: resultItem.name,
                ModerateRiskLevel: resultItem.ModerateRiskLevel,
                CriticalRiskLevel: resultItem.CriticalRiskLevel
              });
            }
          });
        
        // console.log('unmatchedGroupNames: ',unmatchedGroupNames);        
        dataArr.forEach((item:any) => {
            const matchingData = levelData.find((dataItem:any) => dataItem.levelName === item.name);
            if (matchingData) {
                mergedData.push({
                name: matchingData.levelName,
                openCount: matchingData.openCount ? matchingData.openCount: 0,
                closedCount: matchingData.closedCount ?  matchingData.closedCount : 0,
                ModerateRiskLevel: item.ModerateRiskLevel ? item.ModerateRiskLevel : 0,
                CriticalRiskLevel: item.CriticalRiskLevel ? item.CriticalRiskLevel : 0
                });
            } 
        });
        unmatchedGroupNames.forEach((item:any) => {
            mergedData.push({
                name: item.levelName,
                openCount: item.openCount ? item.openCount : 0,
                closedCount: item.closedCount ? item.closedCount : 0,
                ModerateRiskLevel: item.ModerateRiskLevel ? item.ModerateRiskLevel : 0,
                CriticalRiskLevel: item.CriticalRiskLevel ? item.CriticalRiskLevel : 0
            });
        });
        // console.log('mergedData: :--> org',mergedData)
        this.riskTableData = mergedData.slice(0,4) ;//    this.majorRisks.slice(0,5);    
        this.viewAlldata = mergedData //  this.majorRisks; 
        // console.log('viewAlldata: :--> org',this.viewAlldata)     
        this.processOrgData(this.viewAlldata);   
    }  

    processOrgData(data: any[]) {
        this.orgViewData.clear();
        for (const item of data) {
            if (!this.orgViewData.has(item)) {
                this.orgViewData.add(item);
            } else {
                this.orgViewData.delete(item);
            }
        }
        // console.log('this.orgViewData -->thur',this.orgViewData)
    }

    countMetricGroups(){
        // this.resetData(); 
        this.metricGroups=[];
        this.uniqueValues.clear();
        // console.log('this.RiskData-->>',this.RiskData)
        if (this.RiskData.length>0){
            let  group :any ={}; 
            // console.log('cc this.RiskData---->>',this.RiskData)
            let count =1;
            this.totalCriticaldata = this.RiskData.filter((obj: any) => obj.RiskMetricLevel == 3)
            this.totalCriticaldata.forEach((item:any)=>{     
                group[item.GroupName] ? group[item.GroupName]++ : group[item.GroupName] = 1;                     
            });               
            // console.log('result group:',group);   
            // console.log('this.metricGroups: 1st ',this.metricGroups);                   
            for(let key in group){         
                this.metricGroups.push({riskName:key, totalCount:group[key],val: count ? count ++ : count =1 });            
            }    
            // console.log('this.metricGroups: 2nd',this.metricGroups);
            // this.processData(this.metricGroups);
            for (const item of this.metricGroups.slice(0,10)) {
                if (!this.uniqueValues.has(item)) {
                    this.uniqueValues.add(item);
                } else {
                    this.uniqueValues.delete(item);
                }
            }
            // console.log('uniqueValues:--> ',this.uniqueValues)
        }
        
    }


    viewAll(){
        // console.log('this.orgDataViewAll.length: ',this.orgDataViewAll)
        if (Array.from(this.orgViewData).length>0) {
            // if(this.viewAlldata.length){
            // this.orgDataViewAll = Array.from(this.orgViewData);
            
            // console.log('Array.from(this.orgViewData) ',Array.from(this.orgViewData))
            const dialog = this.dialog.open(ViewAllComponent, {
                disableClose: true,         
                panelClass: 'full-screen-modal',
                data: {
                    id: Array.from(this.orgViewData)
                }
            });
            dialog.afterClosed().subscribe(() => {
            }) 
        } else {
            this.dashboardservice.popupInfo( 'Organizational Risk Appetite' + " - No Records  Available ", '')
        }            
    }

    viewAllGroups(){
   
        if (this.RawData.length && this.RiskData.length ) {
            const dialog = this.dialog.open(CmViewallComponent, {
                disableClose: true,         
                panelClass: 'full-screen-modal',
                data: {
                    id: this.RiskData,
                    rawdata: this.RawData,
                }
            });
            dialog.afterClosed().subscribe(() => {
            }) 
        } else {
            this.dashboardservice.popupInfo( 'Critical Metrics in Groups' + " - No Records  Available ", '')
        }
        
        
         
    }

    openTopBarPopup(status: string) :void{ 
        let RATitle = 'Risk Metric Status Wise';
        let topBarData:any;
        if (status === 'Open') {
            topBarData = this.formattedData.filter((item:any) =>  item.Quater == this.quarterFilter && item.StatusID !== 5)
        } else if (status === 'Not Started') {
            topBarData = this.formattedData.filter((item:any) =>  item.Quater == this.quarterFilter && item.CollectionStatusName == "Not Started" && item.StatusID == null);
        } else if (status === 'Submitted') {
            topBarData = this.formattedData.filter((item:any) =>  item.Quater == this.quarterFilter && item.StatusID == 3)
        } else if (status === 'In Progress') {
            topBarData = this.formattedData.filter((item:any) =>  item.Quater == this.quarterFilter && item.StatusID == 2)
        } else if (status === 'Rejected') {
            topBarData = this.formattedData.filter((item:any) =>  item.Quater == this.quarterFilter && item.StatusID == 4)
        } else if (status === 'Closed') {
            topBarData = this.formattedData.filter((item:any) =>  item.Quater == this.quarterFilter && item.StatusID == 5)
        }

        if(topBarData?.length > 0){ 
            const dialog = this.dialog.open(CmPopupComponent, {
                disableClose: true,         
                panelClass: 'full-screen-modal',        
                data: {
                    id: topBarData,
                    RATitle:RATitle,
                    title: status,
                }
            });
            dialog.afterClosed().subscribe(() => {
            })
        }
        else {      
            this.dashboardservice.popupInfo( status+" - No Records  Available ", '')
        }
        
    }


    openOrgPopup(status: string, element: any) :void{ 
        // console.log('element: ',element);
        let RATitle = 'Organizational RA';
        let statusMetric :any;
        let OrgData:any;
        if (status === 'open') {
            statusMetric='Open';
            OrgData =  this.openStatus.filter((obj: any) => obj.CaptionData == element.name)
        } else if (status === 'closed') {
            statusMetric = 'Closed';
            OrgData =  this.closedStatus.filter((obj: any) => obj.CaptionData == element.name)
        } else if ( status === 'ModerateRiskLevel'){
            statusMetric= 'Moderate Risk Level';
            OrgData = this.RiskData.filter((obj: any) => obj.CaptionData == element.name && obj.RiskMetricLevel == 2)
        }  else if ( status === 'CriticalRiskLevel'){
            statusMetric = 'Critical Risk Level'
            OrgData = this.RiskData.filter((obj: any) => obj.CaptionData == element.name && obj.RiskMetricLevel == 3)
        }
        // console.log('statusMetric: ',statusMetric)
        if(OrgData?.length > 0){ 
            const dialog = this.dialog.open(RaPopupComponent, {
                disableClose: true,         
                panelClass: 'full-screen-modal',        
                data: {
                    id: OrgData,
                    RATitle:RATitle,
                    status:element.name,
                    statusMetric:statusMetric
                }
            });
            dialog.afterClosed().subscribe(() => {
            })
        }
        else {      
            this.dashboardservice.popupInfo(element.name+ " "+ " - " +statusMetric+" - No Records  Available ", '')
        }
        
    }

    openRAPopup(riskDataName: any) :void{ 
    
      let rleveldata=  this.RiskData.filter((obj: any) => obj.GroupName == riskDataName  &&  obj.RiskMetricLevel == 3)
      let title=rleveldata[0].GroupName;
      let RATitle='Critical Metrics in Groups';
        if(rleveldata?.length > 0){     
            const dialog = this.dialog.open(CmPopupComponent, {

                disableClose: true,         
                panelClass: 'full-screen-modal',        
                data: {
                    id: rleveldata,
                    RATitle:RATitle,
                    title: title,
                }
                
            });
            dialog.afterClosed().subscribe(() => {
            }) 
            
    }  else {      
        this.dashboardservice.popupInfo( riskDataName ? riskDataName : "Level Name"+" - No Records  Available ", '')
    }
        
    }

    openRA(status: string): void {  
        let data :any
        let RATitle='Risk Metrics Level';
        if (status == 'Critical'){
            data=this.RiskData.filter((obj: any) => obj.RiskMetricLevel == 3);
        } else if (status == 'Moderate'){
            data=this.RiskData.filter((obj: any) => obj.RiskMetricLevel == 2);
        } else if (status == 'Low'){
            data=this.RiskData.filter((obj: any) => obj.RiskMetricLevel == 1);
        }
        
       
        if(data?.length > 0){   
        const dialog = this.dialog.open( CmPopupComponent, {
            disableClose: true,         
            panelClass: 'full-screen-modal',        
            data: {
                id : data,
                RATitle:RATitle,
                title: status,
            }
        });
        dialog.afterClosed().subscribe(() => {
        })
    }
        else {      
            this.dashboardservice.popupInfo( status + " - No Records  Available ", '')
        }
    }


}


