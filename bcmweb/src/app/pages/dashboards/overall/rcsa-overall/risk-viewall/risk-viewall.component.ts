import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DOCUMENT } from '@angular/common'; 
import { DashboardService } from 'src/app/services/dashboard/dashboard.service'; 

@Component({
  selector: 'app-risk-viewall',
  templateUrl: './risk-viewall.component.html',
  styleUrls: ['./risk-viewall.component.scss']
})
export class RscaViewAllComponent implements OnInit {
  
  listdata:any;
  totalUnitsNames: any = [];
  spans:any = [];

  displayedHeaderOneColumns: string[] = ['Sno', 'Group','Unit', 'Overhall Inherent Risk Rating','OverAll Control Enviorment Rating','Residul Risk Rating'];
  displayedHeaderTwoColumns: string[] = ['High', 'Moderate', 'Low', 'Ineffective','Partially Ineffective','Effective', 'HighRes','ModerateRes','LowRes'];
  displayedColumns: string[] = ['Sno', 'Group', 'Unit', 'High', 'Moderate', 'Low', 'Ineffective','Partially Ineffective','Effective', 'HighRes','ModerateRes','LowRes'];
  constructor(
    private dialogRef: MatDialogRef<RscaViewAllComponent>,
    @Inject(DOCUMENT) private _document: any,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private dashboardService: DashboardService
  ) { }

  ngOnInit(): void { 
    let dt = []
    for (let i of this.data.data) {
      dt.push(i.Units)
    }
    let setv = new Set(dt)
    for (let i of setv) {
      let list
      let obj = {}
      for (let j of this.data.data) {
        let start = this.data.data.filter((da: { Units: any; }) => da.Units == i)
        obj = {
          Units: i, 
          Data: start,
          GroupName: start[0].GroupName
        }
        list = obj
      }
      this.totalUnitsNames.push(list) 
    } 
     
    this.totalUnitsNames.forEach((rcsaData: any) => {      
      var inherentLow:any[] = [],inherentModerate:any[] = [],inherentHigh:any[] = [];
      var controlEffective:any[] = [],controlPartialEffective:any[] = [],controlIneffective:any[] = [];
      var residualLow:any[] = [],residualModerate:any[] = [],residualHigh:any[] = []; 
      rcsaData.Data.forEach((rcsaDataInner: any) => {
        if(rcsaDataInner.InherentRiskRating == "Low Risk"){
          inherentLow.push(rcsaDataInner)
        }   
        if(rcsaDataInner.ControlEnvironmentRating == "Effective"){
          controlEffective.push(rcsaDataInner)
        }   
        if(rcsaDataInner.ResidualRiskRating == "Low Risk"){
          residualLow.push(rcsaDataInner)
        } 
  
        if(rcsaDataInner.InherentRiskRating == "Moderate Risk"){
          inherentModerate.push(rcsaDataInner)
        }   
        if(rcsaDataInner.ControlEnvironmentRating == "Partially Effective"){
          controlPartialEffective.push(rcsaDataInner)
        }   
        if(rcsaDataInner.ResidualRiskRating == "Moderate Risk"){
          residualModerate.push(rcsaDataInner)
        } 
  
        if(rcsaDataInner.InherentRiskRating == "High Risk"){
          inherentHigh.push(rcsaDataInner)
        }   
        if(rcsaDataInner.ControlEnvironmentRating == "Ineffective"){
          controlIneffective.push(rcsaDataInner)
        }   
        if(rcsaDataInner.ResidualRiskRating == "High Risk"){
          residualHigh.push(rcsaDataInner)
        } 
      });  
      rcsaData.inherit = {
        'low':inherentLow,
        'moderate':inherentModerate,
        'high':inherentHigh
      };
       
      rcsaData.control = {
        'low':controlEffective,
        'moderate':controlPartialEffective,
        'high':controlIneffective
      };
      rcsaData.residual = {
        'low':residualLow,
        'moderate':residualModerate,
        'high':residualHigh
      };
    }); 
    this.listdata = this.totalUnitsNames; 
    let sortedData = this.listdata.sort((b:any, a:any) => {
      if (a.GroupName < b.GroupName) {
        return -1;
      }
      if (a.GroupName > b.GroupName) {
        return 1;
      }
      return 0;
    }); 
    this.cacheSpan('GroupName', (d: any) => d.GroupName,sortedData);
  }

  
  getRowSpan(col:any, index:any) {    
    return this.spans[index] && this.spans[index][col];
  }
  getRowSpanData(data:any) {    
    var groupData;
    groupData = this.data.data.filter((dg:any) => dg.GroupName == data);
    return groupData;
  }
  
  getRowSerialNumber(index: number): number {
    let serialNumber = 0;    
    for (let i = 0; i <= index; i++) {
      const rowSpan = this.getRowSpan('GroupName', i);
      if (rowSpan === 1) {
        serialNumber= serialNumber+1;
      } else if (rowSpan > 1) {
        serialNumber = serialNumber+1;
      }
    }
    return serialNumber;
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

  
  getBackgroundColor(index: number): number | string {
    let serialNumber = 0;
  
    for (let i = 0; i <= index; i++) {
      const rowSpan = this.getRowSpan('GroupName', i);
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

  // getGroupDetails(data:any){
  //     if(data?.length > 0){ 
  //       let title = data[0].GroupName;     
  //         const dialog = this.dialog.open(CmPopupComponent, {

  //             disableClose: true,         
  //             panelClass: 'full-screen-modal',        
  //             data: {
  //                 id: data, 
  //                 title: title,
  //             }
              
  //         });
  //         dialog.afterClosed().subscribe(() => {
  //         }) 
          
  // }  else {      
  //     this.dashboardService.popupInfo("No Records  Available","")
  // }
  // }

}
