import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RscaViewAllComponent } from './risk-viewall/risk-viewall.component';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { RscaOverallPopupComponent } from './rsca-popups/rsca-overall-popups.component';
import { DashboardComponent } from '../../dashboard.component';

@Component({
  selector: 'app-rcsa-overall',
  templateUrl: './rcsa-overall.component.html',
  styleUrls: ['./rcsa-overall.component.scss']
})
export class RcsaOverallComponent implements OnInit {

  listData:any;
  yearData: any;
  quaterData: any;
  currentQuarter: any;
  totalGroupNames: any = [];

  constructor( private dashboardService: DashboardService,public dialog: MatDialog,
    public DashboardComponent: DashboardComponent
    ) { }

  ngOnInit(): void {


    this.dashboardService.getYearQuarterData();
    this.dashboardService.gotYearQuater.subscribe((value) => {
      if(value==true){
        this.yearData = this.dashboardService.yearValue
        this.quaterData = this.dashboardService.quaterValue
      }
      let currentDate = new Date();
      let currMonth = currentDate.getMonth() + 1;
      let currQuarter = Math.ceil(currMonth / 3);
      let quarterFilter = 'Q' + ((this.quaterData !== undefined && this.quaterData > 0) ? this.quaterData : currQuarter) + '-' + this.yearData.toString().substr(2, 2);
      this.currentQuarter = quarterFilter;
      setTimeout(()=>{
        this.dashboardService.gotOverallDashboardMaster.subscribe((data) => {
          if(data) {
            this.handledata();
          }
        });
        }, 1000)
      });
    //   this.dashboardService.getOverallDashbardData(this.yearData,this.quaterData)

  }


  handledata(){
    this.totalGroupNames = [];
    this.listData = this.dashboardService.dashboardRCSAMaster.filter((item: any) => item.Quater === this.currentQuarter);

    let dt = []
    for (let i of this.listData) {
      dt.push(i.GroupName)
    }
    let setv = new Set(dt)
    for (let i of setv) {
      let list
      let obj = {}
      for (let j of this.listData) {
        let start = this.listData.filter((da: { GroupName: any; }) => da.GroupName == i)
        obj = {
          GroupName: i,
          Data: start
        }
        list = obj
      }
      this.totalGroupNames.push(list)
    }

    this.totalGroupNames.forEach((rcsaData: any) => {
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
        'high':inherentHigh,
        'inherentColor': this.getColor(inherentLow,inherentModerate,inherentHigh,"inherent"),
        'inherentHigh': this.max_of_three(inherentLow?.length,inherentModerate?.length,inherentHigh?.length),
        'inherentValue': this.getValue(inherentLow,inherentModerate,inherentHigh,'inherent')
      };

      rcsaData.control = {
        'low':controlEffective,
        'moderate':controlPartialEffective,
        'high':controlIneffective,
        'controlColor': this.getColor(controlEffective,controlPartialEffective,controlIneffective,"control"),
        'controlHigh': this.max_of_three(controlEffective?.length,controlPartialEffective?.length,controlIneffective?.length),
        'controlValue': this.getValue(controlEffective,controlPartialEffective,controlIneffective,'control')
      };
      rcsaData.residual = {
        'low':residualLow,
        'moderate':residualModerate,
        'high':residualHigh,
        'residualColor': this.getColor(residualLow,residualModerate,residualHigh,"residual"),
        'residualHigh': this.max_of_three(residualLow?.length,residualModerate?.length,residualHigh?.length),
        'residualValue': this.getValue(residualLow,residualModerate,residualHigh,'residual')
      };
    });

    this.totalGroupNames.sort((b:any, a:any) => {
      if (a.GroupName < b.GroupName) {
        return -1;
      }
      if (a.GroupName > b.GroupName) {
        return 1;
      }
      return 0;
    });

  }

  getColor(low:any,mod:any,high:any,type:any){
    var color;
    var value = this.max_of_three(low?.length,mod?.length,high?.length);
    if(value == 0){
        return color = "#949494";
    }
    if(value == high?.length){
      // if(type == "inherent"){
      //   return color = high[0].OverallInherentRiskColorCode;
      // }else if(type == "control"){
      //   return color =  high[0].OverallControlEnvironmentRatingColourCode;
      // }else if(type == "residual"){
      //   return color =  high[0].ResidualRiskRatingColourCode;
      // }else{
        // return color = "#B10000";
      // }
        return color = "#B10000";
    }else if(value == mod?.length){
      // if(type == "inherent"){
      //   return color = mod[0].OverallInherentRiskColorCode;
      // }else if(type == "control"){
      //   return color =  mod[0].OverallControlEnvironmentRatingColourCode;
      // }else if(type == "residual"){
      //   return color =  mod[0].ResidualRiskRatingColourCode;
      // }else{
        // return color = "#FF6E05";
      // }
        return color = "#FF6E05";
    }else if(value == low?.length){
      // if(type == "inherent"){
      //   return color = low[0].OverallInherentRiskColorCode;
      // }else if(type == "control"){
      //   return color =  low[0].OverallControlEnvironmentRatingColourCode;
      // }else if(type == "residual"){
      //   return color =  low[0].ResidualRiskRatingColourCode;
      // }else{
        // return color = "#0B9A45";
      // }
        return color = "#0B9A45";
    }else{
      return color = "#949494";
    }
  }
  getValue(low:any,mod:any,high:any,type:any){
    var dataValue;
    var value = this.max_of_three(low?.length,mod?.length,high?.length);
    if(value == 0){
       return dataValue = "NO DATA"
    }
    if(value == high?.length){
      if(type == "control"){
       return dataValue = "INEFFECTIVE"
      }else{
       return dataValue = "HIGH RISK"
      }
    }else if(value == mod?.length){
      if(type == "control"){
       return dataValue = "PARTIALLY EFFECTIVE"
      }else{
       return dataValue = "MODERATE RISK"
      }
    }else if(value == low?.length){
      if(type == "control"){
       return dataValue = "EFFECTIVE"
      }else{
       return dataValue = "LOW RISK"
      }
    }else{
      return dataValue = "NO DATA"
    }
  }

  max_of_three(x:any, y:any, z:any)
 {
  var max_val = 0;
  if (x > y)
  {
    max_val = x;
  } else
  {
    max_val = y;
  }
  if (z > max_val)
  {
    max_val = z;
  }
  return max_val;
}



  openPopUp() {
      const rsca = this.dialog.open(RscaViewAllComponent, {
          disableClose: false,
          width: '70vw',
          data: {
              data: this.listData,
              title: "RCSA - Group Wise Risk"
          }
      })
  }

  openDataPopUp(data:any,title:any) {
    if(data?.length > 0){
        const rsca = this.dialog.open(RscaOverallPopupComponent, {
            disableClose: false,
            width: '70vw',
            data: {
                data: data,
                title: title
            }
        })
    }
    else{
      this.dashboardService.popupInfo(title, 'No Records Available')
    }
  }

  navigatePage(){
    this.DashboardComponent.openMenu('rcsa','same');
  }

}
