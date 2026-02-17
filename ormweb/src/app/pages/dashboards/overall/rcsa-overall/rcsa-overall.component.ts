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
  listData: any;
  yearData: any;
  quaterData: any;
  currentQuarter: any;
  totalGroupNames: any = [];

  constructor(private dashboardService: DashboardService, public dialog: MatDialog,
    public DashboardComponent: DashboardComponent
  ) { }

  ngOnInit(): void {
    this.dashboardService.getYearQuarterData();
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
        this.dashboardService.gotOverallDashboardMaster.subscribe((data) => {
          if (data) {
            this.handledata();
          }
        });
      }, 1000)
    });
  }

  handledata() {
    this.totalGroupNames = [];

    // Filter by quarter
    this.listData = this.dashboardService.dashboardRCSAMaster.filter((item: any) => item.Quater === this.currentQuarter);

    // Group by GroupName
    const groupMap: {
      [key: string]: any[]
    } = {};
    for (const item of this.listData) {
      if (!groupMap[item.GroupName]) {
        groupMap[item.GroupName] = [];
      }
      groupMap[item.GroupName].push(item);
    }

    // Build totalGroupNames array
    Object.keys(groupMap).forEach(groupName => {
      this.totalGroupNames.push({
        GroupName: groupName,
        Data: groupMap[groupName]
      });
    });

    // Build inherent / control / residual breakdown for each group
    this.totalGroupNames.forEach((rcsaData: any) => {
      let inherentLow: any[] = [],
        inherentModerate: any[] = [],
        inherentHigh: any[] = [],
        inherentSevere: any[] = [],
        inherentCatastrophic: any[] = [];

      let controlEffective: any[] = [],
        controlPartialEffective: any[] = [],
        controlIneffective: any[] = [],
        nocontrols: any[] = [];

      let residualLow: any[] = [],
        residualModerate: any[] = [],
        residualHigh: any[] = [],
        residualSevere: any[] = [],
        residualCatastrophic: any[] = [];

      rcsaData.Data.forEach((rcsaDataInner: any) => {

        // INHERENT
        if (rcsaDataInner.InherentRiskRating === "Low") {
          inherentLow.push(rcsaDataInner);
        }
        if (rcsaDataInner.InherentRiskRating === "Medium") {
          inherentModerate.push(rcsaDataInner);
        }
        if (rcsaDataInner.InherentRiskRating === "High") {
          inherentHigh.push(rcsaDataInner);
        }
        if (rcsaDataInner.InherentRiskRating === "Severe") {
          inherentSevere.push(rcsaDataInner);
        }
        if (rcsaDataInner.InherentRiskRating === "Catastrophic") {
          inherentCatastrophic.push(rcsaDataInner);
        }

        // CONTROL ENVIRONMENT
        if (rcsaDataInner.ControlEnvironmentRating === "No Controls") {
          nocontrols.push(rcsaDataInner);
        }
        if (rcsaDataInner.ControlEnvironmentRating === "Effective Controls") {
          controlEffective.push(rcsaDataInner);
        }
        if (rcsaDataInner.ControlEnvironmentRating === "Partially Effective") {
          controlPartialEffective.push(rcsaDataInner);
        }
        if (rcsaDataInner.ControlEnvironmentRating === "Ineffective Controls") {
          controlIneffective.push(rcsaDataInner);
        }

        // RESIDUAL
        if (rcsaDataInner.ResidualRiskRating === "Low") {
          residualLow.push(rcsaDataInner);
        }
        if (rcsaDataInner.ResidualRiskRating === "Moderate") {
          residualModerate.push(rcsaDataInner);
        }
        if (rcsaDataInner.ResidualRiskRating === "High") {
          residualHigh.push(rcsaDataInner);
        }
        if (rcsaDataInner.ResidualRiskRating === "Severe") {
          residualSevere.push(rcsaDataInner);
        }
        if (rcsaDataInner.ResidualRiskRating === "Catastrophic") {
          residualCatastrophic.push(rcsaDataInner);
        }
      });

      // ---------- INHERENT ----------
      const inherentObj = {
        low: inherentLow,
        moderate: inherentModerate,
        high: inherentHigh,
        severe: inherentSevere,
        catastrophic: inherentCatastrophic,
        inherentColor: this.getColor("inherent", inherentLow, inherentModerate, inherentHigh, inherentSevere, inherentCatastrophic),
        inherentHigh: this.max_of_three(inherentLow?.length, inherentModerate?.length, inherentHigh?.length, inherentSevere?.length, inherentCatastrophic?.length),
        inherentValue: this.getValue("inherent", inherentLow, inherentModerate, inherentHigh, inherentSevere, inherentCatastrophic)
      };
      // keep both in case old code uses 'inherit'
      rcsaData.inherent = inherentObj;
      rcsaData.inherit = inherentObj;

      // console.log('controlEffective:', controlEffective);
      // console.log('controlPartialEffective:', controlPartialEffective);
      // console.log('controlIneffective:', controlIneffective);
      // console.log('nocontrols:', nocontrols);
      

      // ---------- CONTROL ----------
      rcsaData.control = {
        effective: controlEffective,
        partiallyEffective: controlPartialEffective,
        ineffective: controlIneffective,
        noControls: nocontrols,
        controlColor: this.getColor("control", controlEffective, controlPartialEffective, controlIneffective, nocontrols),
        controlHigh: this.max_of_three(controlEffective?.length, controlPartialEffective?.length, controlIneffective?.length, nocontrols?.length),
        controlValue: this.getValue("control", controlEffective, controlPartialEffective, controlIneffective, nocontrols)
      };

      // ---------- RESIDUAL ----------
      rcsaData.residual = {
        low: residualLow,
        moderate: residualModerate,
        high: residualHigh,
        severe: residualSevere,
        catastrophic: residualCatastrophic,
        residualColor: this.getColor("residual", residualLow, residualModerate, residualHigh, residualSevere, residualCatastrophic),
        residualHigh: this.max_of_three(residualLow?.length, residualModerate?.length, residualHigh?.length, residualSevere?.length, residualCatastrophic?.length),
        residualValue: this.getValue("residual", residualLow, residualModerate, residualHigh, residualSevere, residualCatastrophic)
      };
    });

    // sort group names descending
    this.totalGroupNames.sort((b: any, a: any) => {
      if (a.GroupName < b.GroupName) {
        return -1;
      }
      if (a.GroupName > b.GroupName) {
        return 1;
      }
      return 0;
    });
  }

  // ---------- HELPERS ----------

  // Now supports any number of values (not just 3)
  max_of_three(...values: any[]) {
    const nums = values.map(v => (typeof v === "number" ? v : Number(v) || 0));
    if (!nums.length) {
      return 0;
    }
    return Math.max(...nums);
  }

  /**
   * type: "inherent" | "control" | "residual"
   * buckets: arrays of items in order
   *   inherent/residual: [low, moderate, high, severe?, catastrophic?]
   *   control: [effective, partiallyEffective, ineffective, noControls?]
   */
  getColor(type: string, ...buckets: any[][]) {
    const counts = buckets.map(b => (b ? b.length : 0));
    const max = this.max_of_three(...counts);

    if (max === 0) {
      return "#949494"; // NO DATA
    }

    const idx = counts.indexOf(max);

    if (type === "control") {
      // 0: Effective, 1: Partially Effective, 2: Ineffective, 3: No Controls
      if (idx === 0)
        return "#0B9A45"; // Effective - green
      if (idx === 1)
        return "#FF6E05"; // Partially Effective - orange
      // Ineffective / No Controls - red
      return "#B10000";
    }

    // inherent / residual:
    // 0: Low, 1: Moderate, 2: High, 3: Severe, 4: Catastrophic
    if (idx === 0)
      return "#0B9A45"; // Low
    if (idx === 1)
      return "#FF6E05"; // Moderate
    // High / Severe / Catastrophic - red
    return "#B10000";
  }

  /**
   * type: "inherent" | "control" | "residual"
   */
  getValue(type: string, ...buckets: any[][]) {
    const counts = buckets.map(b => (b ? b.length : 0));
    const max = this.max_of_three(...counts);

    if (max === 0) {
      return "NO DATA";
    }

    const idx = counts.indexOf(max);

    if (type === "control") {
      // 0: Effective, 1: Partially Effective, 2: Ineffective, 3: No Controls
      if (idx === 0)
        return "EFFECTIVE";
      if (idx === 1)
        return "PARTIALLY EFFECTIVE";
      if (idx === 2)
        return "INEFFECTIVE";
      if (idx === 3)
        return "NO CONTROLS";
      return "NO DATA";
    }

    // inherent / residual
    // 0: Low, 1: Medium, 2: High, 3: Severe, 4: Catastrophic
    switch (idx) {
      case 0:
        return "LOW";
      case 1:
        return "MEDIUM";
      case 2:
        return "HIGH";
      case 3:
        return "SEVERE";
      case 4:
        return "CATASTROPHIC";
      default:
        return "NO DATA";
    }
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

  openDataPopUp(data: any, title: any) {
    if (data?.length > 0) {
      const rsca = this.dialog.open(RscaOverallPopupComponent, {
        disableClose: false,
        width: '70vw',
        data: {
          data: data,
          title: title
        }
      })
    }
    else {
      this.dashboardService.popupInfo(title, 'No Records Available')
    }
  }

  navigatePage() {
    this.DashboardComponent.openMenu('rcsa', 'same');
  }
}