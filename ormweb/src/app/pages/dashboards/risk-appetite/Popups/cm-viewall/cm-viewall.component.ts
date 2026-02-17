import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import * as Highcharts from 'highcharts';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { CmPopupComponent } from '../cm-popup/cm-popup.component';
// import  obj from './obj.json';



@Component({
  selector: 'app-cm-viewall',
  templateUrl: './cm-viewall.component.html',
  styleUrls: ['./cm-viewall.component.scss']
})
export class CmViewallComponent implements OnInit {
  displayedColumns: string[] = [ 'No','groupsName', 'Unit', 'HighRisk', 'HighRiskUnit', 'HighRiskLastQuater', 'IncDec'];
  dataSource: any;
  metricGroups: any[] = [];
  majorRiskOptions: any;
  quarterData: any;
  totQuater: any;
  majorRAOptions: any;
  groupCount: any;
  totGroupCount: any[] = [];
  metricGroup: any[] = [];
  metricGroupData: any[] = [];
  metricGroupPrevData: any[] = [];
  totMetricGroupData: any[] = [];
  totMetricGroup :any=[];
  combinedData : any =[];
  currQuarterData: any;
  prevQuarterData: any;
  RawData: any;
  jsonData: any;
  uniqueData:any =[];
  image:any;
  imagedown: string = 'assets/icon-down.svg';
  imageup: string = 'assets/icon-up.svg';
  totalCriticaldata: any;
  totalCritical: any;
  incdec :any; 
  diffcount :any;
  highRiskLastQuater :any;
  matchedData:any = []; 
  unitDetails :any =[];
  rowData:any=[];
  spans:any = [];
  uniqueValues: Set<any> = new Set();
  sortedData: any=[];
  quaterData: any;
  yearData: any;
  quarterFilter: any;
  RiskData: any;
  constructor(
   
    @Inject(MAT_DIALOG_DATA) public parent: any,
    public dashboardservice: DashboardService,
    public dialog: MatDialog,
  ) {
    // this.cacheSpan('group', (d:any) => d.group);
    // console.log(this.spans);
   }

  ngOnInit(): void { 
    this.currQuarterData = this.parent.id;
    this.RawData = this.parent.rawdata;  
    this.dashboardservice.gotYearQuater.subscribe((value) => {
      this.yearData = this.dashboardservice.yearValue
      this.quaterData = this.dashboardservice.quaterValue
      let currentDate = new Date();

      
      let currMonth = currentDate.getMonth() + 1;
      let currQuarter = Math.ceil(currMonth / 3);
      // console.log("currQuarter",currQuarter)

      this.quarterFilter = 'Q' + ((this.quaterData !== undefined && this.quaterData > 0) ? this.quaterData : currQuarter) + '-' + this.yearData.toString().substr(2, 2);   
      const currentQuarterParts = this.quarterFilter.split('-');
      const currentQuarterNumber = parseInt(currentQuarterParts[0].substring(1));
      const currentYear = parseInt(currentQuarterParts[1]);

      let previousQuarterNumber = currentQuarterNumber - 1;
      let previousYear = currentYear;

      if (previousQuarterNumber === 0) {
        previousQuarterNumber = 4;
        previousYear--;
      }

      const previousQuarter = 'Q' + previousQuarterNumber + '-' + previousYear.toString().substr(-2);
      // console.log('previousQuarter: ----->>>> ',previousQuarter)

      // let previousQuarter = "Q" + (Math.floor((currentDate.getMonth() - 3) / 3) + 1) + "-" + currentDate.getFullYear().toString().substr(-2);
      this.prevQuarterData = this.RawData.filter((item: any) => item.Quater === previousQuarter);
      this.viewAllCountMetric();
    })
  }

  viewAllCountMetric() {
    let result: any = {};
    let count: any;
    let groupData: any = {};
    let groupRow: any ={}
    let prevGroupData: any = {};
     this.totalCriticaldata = this.currQuarterData.filter((obj: any) => obj.RiskMetricLevel == 3)
    //for current quater
    
    
      this.currQuarterData.forEach((item: any) => {
        const groupName = item.GroupName;
        const unitName = item.UnitName;
        const levelName = item.LevelName;
        const currQuarter = item.Quater;
        if (!groupData[groupName]) {
          groupData[groupName] = {
            GroupName: groupName,
            GroupNameCount: 0,
            unitData: []
          };
        }
        if (item.RiskMetricLevel == 3) groupData[groupName].GroupNameCount++;    
        let unitData = groupData[groupName].unitData.find((unit:any) => unit.UnitName === unitName);
        if (!unitData) {
          unitData = {
            UnitName: unitName,
            CriticalRiskLevel: 0,
            currQuarter:currQuarter,
            Unitnamecount: 0
          };
          groupData[groupName].unitData.push(unitData);
        }
        if (item.RiskMetricLevel == 3) {
          unitData.CriticalRiskLevel++;
        }    
        unitData.Unitnamecount++;
      });
      // console.log('currquater new groupdata:', groupData);

      for (let i in groupData){
        this.metricGroupData.push(groupData[i])
      }
      // console.log('this: metricGroupData new ', this.metricGroupData);


      this.matchedData.push({
        currdata: this.metricGroupData
      });
      // matchedData array will contain the matched group names and unit names data from both arrays
      // console.log('matchedData: ',this.matchedData);
    if ( this.prevQuarterData.length == 0 ) {
      this.matchedData.forEach((data: any) => {         
        data.currdata.forEach((groupData: any) => {
          const currgroupName = groupData.GroupName;
          const currunitData = groupData.unitData;
          const currgroupCount = groupData.GroupNameCount;  
          currunitData.forEach((unit: any) => {       
            const currunitName = unit.UnitName;
            const currunitcount = unit.Unitnamecount;
            const currhighRiskcount = unit.CriticalRiskLevel;
            const highRiskinUnit = Math.round((currhighRiskcount * 100) / currunitcount).toFixed(0);
            let highRiskLastQuater = '-';
            // let incdec = ' ';
            // let image = ' ';  
            this.combinedData.push({
              groupsName: currgroupName,
              groupCount: currgroupCount,
              currunitcount: currunitcount,
              image: this.imageup,
              unitName: currunitName,
              currhighRiskcount: currhighRiskcount,
              highRiskinUnit: highRiskinUnit,
              highRiskLastQuater: highRiskLastQuater,
              incdec: this.incdec
            });
          });
    
        });
      });
    }  
   
    
      this.prevQuarterData.forEach((item: any) => {
        const groupName = item.GroupName;
        const unitName = item.UnitName;
        const levelName = item.LevelName;
        const currQuarter = item.Quater;
        if (!prevGroupData[groupName]) {
          prevGroupData[groupName] = {
            GroupName: groupName,
            GroupNameCount: 0,
            unitData: []
          };
        }
        if (item.RiskMetricLevel == 3) prevGroupData[groupName].GroupNameCount++;      
        let unitData = prevGroupData[groupName].unitData.find((unit:any) => unit.UnitName === unitName);
        if (!unitData) {
          unitData = {
            UnitName: unitName,
            CriticalRiskLevel: 0,
            currQuarter:currQuarter,
            Unitnamecount: 0
          };
          prevGroupData[groupName].unitData.push(unitData);
        }
        if (item.RiskMetricLevel == 3) {
          unitData.CriticalRiskLevel++;
        }    
        unitData.Unitnamecount++;
      });
      // console.log('prevQuarterData new :', prevGroupData);
  
      for (let i in prevGroupData){
        this.metricGroupPrevData.push(prevGroupData[i])
      }
    
      // console.log('this.metricGroupPrevData new: ',this.metricGroupPrevData);
       // 1st array - Current quarter records with common GroupName and UnitName name in both current and previous quarters
      const currentQuarterCommonRecords = this.metricGroupData.filter((record: any) => {
        const matchingPrevRecord = this.metricGroupPrevData.find((prevRecord: any) => {
          return record.GroupName === prevRecord.GroupName && record.UnitName === prevRecord.UnitName;
        });
        return matchingPrevRecord !== undefined; // Filter out records without a match in the previous quarter
      });
      // console.log('currentQuarterCommonRecords: ',currentQuarterCommonRecords)
      // 2nd array - Previous quarter records with common GroupName and UnitName name in both current and previous quarters
      const prevQuarterCommonRecords = this.metricGroupPrevData.filter((prevRecord: any) => {
        const matchingCurrentRecord = this.metricGroupData.find((record: any) => {
          return record.GroupName === prevRecord.GroupName && record.UnitName === prevRecord.UnitName;
        });
        return matchingCurrentRecord !== undefined; // Filter out records without a match in the current quarter
      });
      console.log('prevQuarterCommonRecords: ',prevQuarterCommonRecords)
      // 3rd array - Current quarter records with common GroupName and UnitName name in the current quarter but not in the previous quarter
      // Compare both arrays and retrieve unique records
    
     
     let currentQuarterUniqueRecords = this.metricGroupData.filter((currGroup) => {
      let prevGroup = this.metricGroupPrevData.find((group) => group.GroupName === currGroup.GroupName);
      if (!prevGroup) {
        return true; // GroupName doesn't match, include the record
      }
    
      let unmatchedUnits = currGroup.unitData.filter((currUnit:any) =>
        !prevGroup.unitData.some((prevUnit:any) => prevUnit.UnitName === currUnit.UnitName)
      );
    
      return unmatchedUnits.length > 0; // Include the record if there are unmatched units
    }).map((currGroup) => {
      let prevGroup = this.metricGroupPrevData.find((group) => group.GroupName === currGroup.GroupName);
      if (!prevGroup) {
        return currGroup; // Include the entire record if GroupName doesn't match
      }
    
      let uniqueUnits = currGroup.unitData.filter((currUnit:any) =>
        !prevGroup.unitData.some((prevUnit:any) => prevUnit.UnitName === currUnit.UnitName)
      );
    
      return {
        GroupName: currGroup.GroupName,
        GroupNameCount: currGroup.GroupNameCount,
        unitData: uniqueUnits
      };
    });
    
    console.log('currentQuarterUniqueRecords: ',currentQuarterUniqueRecords);
      // console.log('currentQuarterUniqueRecords: ',currentQuarterUniqueRecords);
    if (this.currQuarterData.length >0 && this.prevQuarterData.length>0) {   
      currentQuarterCommonRecords.forEach((curr:any)=> {
        prevQuarterCommonRecords.forEach((prev:any)=> {        
            const currgroupName = curr.GroupName;
            const currunitData = curr.unitData;
            const currgroupCount = curr.GroupNameCount;
            const prevgroupName = prev.GroupName;
            const prevunitData = prev.unitData;
            const prevgroupCount = prev.GroupNameCount;
        
            currunitData.forEach((unit: any) => {
              prevunitData.forEach((prevUnit:any)=> {
                const currunitName = unit.UnitName;
                const prevunitName = prevUnit.UnitName;
                let incdec:any;
                if (currgroupName == prevgroupName && currunitName == prevunitName) { 

                const currunitcount      = unit.Unitnamecount;
                const currhighRiskcount  = unit.CriticalRiskLevel;              
                const highRiskLastQuater = prevUnit.CriticalRiskLevel;
                const highRiskinUnit     = Math.round((currhighRiskcount * 100) / currunitcount).toFixed(0);              
                this.diffcount           =  Math.abs(currhighRiskcount - highRiskLastQuater); 
                highRiskLastQuater > 0 ? incdec  =  (Math.round(this.diffcount* 100) / highRiskLastQuater).toFixed(0) : incdec = 'NA';               
                
                let image                = currhighRiskcount > highRiskLastQuater ? this.imageup : (currhighRiskcount < highRiskLastQuater ? this.imagedown : ' ');
                // let decinc = incdec ?  incdec : ' ';
                this.combinedData.push({
                  groupsName: currgroupName,
                  groupCount: currgroupCount,
                  currunitcount: currunitcount,
                  image: image,
                  unitName: currunitName,
                  currhighRiskcount: currhighRiskcount,
                  highRiskinUnit: highRiskinUnit,
                  highRiskLastQuater: highRiskLastQuater,
                  incdec: incdec 
                });
              }

              });           
            
            });
      
          });
        
      });    
//  console.log('this.combinedData: 1st',this.combinedData);
      currentQuarterUniqueRecords.forEach((groupData: any) => {
        const currgroupName = groupData.GroupName;
        const currunitData = groupData.unitData;
        const currgroupCount = groupData.GroupNameCount;
    
        currunitData.forEach((unit: any) => {       
          const currunitName = unit.UnitName;
          const currunitcount = unit.Unitnamecount;
          const currhighRiskcount = unit.CriticalRiskLevel;
          const highRiskinUnit = Math.round((currhighRiskcount * 100) / currunitcount).toFixed(0);
          let highRiskLastQuater = '-';
          // let incdec = ' ';
          let image = ' ';
    
          this.combinedData.push({
            groupsName: currgroupName,
            groupCount: currgroupCount,
            currunitcount: currunitcount,
            image: image,
            unitName: currunitName,
            currhighRiskcount: currhighRiskcount,
            highRiskinUnit: highRiskinUnit,
            highRiskLastQuater: highRiskLastQuater,
            incdec: this.incdec
          });
        });
  
      });
    }
    
    let sortedData = this.combinedData.sort((a:any, b:any) => {
      if (a.groupsName < b.groupsName) {
        return -1;
      }
      if (a.groupsName > b.groupsName) {
        return 1;
      }
      return 0;
    });
    // console.log('this.combinedData: 2nd',this.combinedData);
    this.cacheSpan('groupsName', (d: any) => d.groupsName,sortedData);

  }

  getRowSerialNumber(index: number): number {
    let serialNumber = 0;    
    for (let i = 0; i <= index; i++) {
      const rowSpan = this.getRowSpan('groupsName', i);
      if (rowSpan === 1) {
        serialNumber= serialNumber+1;
      } else if (rowSpan > 1) {
        serialNumber = serialNumber+1;
      }
    }
    return serialNumber;
  }

  getBackgroundColor(index: number): number | string {
    let serialNumber = 0;
  
    for (let i = 0; i <= index; i++) {
      const rowSpan = this.getRowSpan('groupsName', i);
      if (rowSpan === 1 || rowSpan > 1) {
        serialNumber = serialNumber + 1;
      }
    }
  
    
    if (serialNumber % 2 === 0) {
      return '#f2f2f2'; 
    } else {
      return ''; 
    }
  }
  
   
  cacheSpan(key: any, accessor: any, DATA: any) {
    for (let i = 0; i < DATA.length;) {
      let currentValue = accessor(DATA[i]);
      let count = 1;
      for (let j = i + 1; j < DATA.length; j++) {
        if (currentValue !== accessor(DATA[j])) {
          break;
        }
        count++;
      }
      if (!this.spans[i]) {
        this.spans[i] = {};
      }
      this.spans[i][key] = count;
      i += count;
    }
  }

  
  getRowSpan(col:any, index:any) {    
    return this.spans[index] && this.spans[index][col];
  }

  getGroupDetails(riskDataName: any) :void{ 
    
    let rleveldata=  this.RawData.filter((obj: any) => obj.GroupName == riskDataName  &&  obj.RiskMetricLevel == 3  && obj.Quater == this.quarterFilter)
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


  
}

