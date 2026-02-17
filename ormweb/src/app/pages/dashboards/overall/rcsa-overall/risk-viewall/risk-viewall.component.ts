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

  listdata: any;
  totalUnitsNames: any = [];
  spans: any = [];

  // Header row 1
  displayedHeaderOneColumns: string[] = [
    'Sno',
    'Group',
    'Unit',
    'Overhall Inherent Risk Rating',
    'OverAll Control Enviorment Rating',
    'Residul Risk Rating'
  ];

  // Header row 2
  displayedHeaderTwoColumns: string[] = [
    'Catastrophic',
    'Severe',
    'High',
    'Moderate',
    'Low',
    'NoControls',
    'Ineffective',
    'Partially Ineffective',
    'Effective',
    'CatastrophicRes',
    'SevereRes',
    'HighRes',
    'ModerateRes',
    'LowRes'
  ];

  // Data row columns
  displayedColumns: string[] = [
    'Sno',
    'Group',
    'Unit',
    'Catastrophic',
    'Severe',
    'High',
    'Moderate',
    'Low',
    'NoControls',
    'Ineffective',
    'Partially Ineffective',
    'Effective',
    'CatastrophicRes',
    'SevereRes',
    'HighRes',
    'ModerateRes',
    'LowRes'
  ];

  constructor(
    private dialogRef: MatDialogRef<RscaViewAllComponent>,
    @Inject(DOCUMENT) private _document: any,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private dashboardService: DashboardService
  ) { }

  ngOnInit(): void {
    // Group by Units
    const dt: any[] = [];
    for (const i of this.data.data) {
      dt.push(i.Units);
    }

    const setv = new Set(dt);
    for (const i of setv) {
      let list: any;
      let obj: any = {};
      for (const j of this.data.data) {
        const start = this.data.data.filter((da: { Units: any }) => da.Units === i);
        obj = {
          Units: i,
          Data: start,
          GroupName: start[0].GroupName
        };
        list = obj;
      }
      this.totalUnitsNames.push(list);
    }

    // Build rating buckets for each Unit
    this.totalUnitsNames.forEach((rcsaData: any) => {
      // Inherent
      const inherentLow: any[] = [];
      const inherentModerate: any[] = [];
      const inherentHigh: any[] = [];
      const inherentSevere: any[] = [];
      const inherentCatastrophic: any[] = [];

      // Control Environment
      const controlNoControls: any[] = [];
      const controlIneffective: any[] = [];
      const controlPartialEffective: any[] = [];
      const controlEffective: any[] = [];

      // Residual
      const residualLow: any[] = [];
      const residualModerate: any[] = [];
      const residualHigh: any[] = [];
      const residualSevere: any[] = [];
      const residualCatastrophic: any[] = [];

      rcsaData.Data.forEach((rcsaDataInner: any) => {

        // ----------------- Inherent Risk Rating -----------------
        // Expected values: Low, Medium/Moderate, High, Severe, Catastrophic
        const inherent = rcsaDataInner.InherentRiskRating;
        if (inherent === 'Low') {
          inherentLow.push(rcsaDataInner);
        } else if (inherent === 'Moderate' || inherent === 'Medium') {
          inherentModerate.push(rcsaDataInner);
        } else if (inherent === 'High') {
          inherentHigh.push(rcsaDataInner);
        } else if (inherent === 'Severe') {
          inherentSevere.push(rcsaDataInner);
        } else if (inherent === 'Catastrophic') {
          inherentCatastrophic.push(rcsaDataInner);
        }

        // -------------- Control Environment Rating --------------
        // Expected values: No Controls, Ineffective Controls, Partially Effective, Effective Controls
        const control = rcsaDataInner.ControlEnvironmentRating;
        if (control === 'No Controls') {
          controlNoControls.push(rcsaDataInner);
        } else if (control === 'Ineffective Controls' || control === 'Ineffective') {
          controlIneffective.push(rcsaDataInner);
        } else if (control === 'Partially Effective') {
          controlPartialEffective.push(rcsaDataInner);
        } else if (control === 'Effective Controls' || control === 'Effective') {
          controlEffective.push(rcsaDataInner);
        }

        // ---------------- Residual Risk Rating ------------------
        // Expected values: Low, Moderate, High, Severe, Catastrophic
        const residual = rcsaDataInner.ResidualRiskRating;
        if (residual === 'Low') {
          residualLow.push(rcsaDataInner);
        } else if (residual === 'Moderate' || residual === 'Medium') {
          residualModerate.push(rcsaDataInner);
        } else if (residual === 'High') {
          residualHigh.push(rcsaDataInner);
        } else if (residual === 'Severe') {
          residualSevere.push(rcsaDataInner);
        } else if (residual === 'Catastrophic') {
          residualCatastrophic.push(rcsaDataInner);
        }
      });

      rcsaData.inherit = {
        low: inherentLow,
        moderate: inherentModerate,
        high: inherentHigh,
        severe: inherentSevere,
        catastrophic: inherentCatastrophic
      };

      rcsaData.control = {
        noControls: controlNoControls,
        ineffective: controlIneffective,
        partiallyEffective: controlPartialEffective,
        effective: controlEffective
      };

      rcsaData.residual = {
        low: residualLow,
        moderate: residualModerate,
        high: residualHigh,
        severe: residualSevere,
        catastrophic: residualCatastrophic
      };
    });

    this.listdata = this.totalUnitsNames;

    // Sort by GroupName
    const sortedData = this.listdata.sort((b: any, a: any) => {
      if (a.GroupName < b.GroupName) {
        return -1;
      }
      if (a.GroupName > b.GroupName) {
        return 1;
      }
      return 0;
    });

    this.cacheSpan('GroupName', (d: any) => d.GroupName, sortedData);
  }

  getRowSpan(col: any, index: any) {
    return this.spans[index] && this.spans[index][col];
  }

  getRowSpanData(data: any) {
    let groupData;
    groupData = this.data.data.filter((dg: any) => dg.GroupName === data);
    return groupData;
  }

  getRowSerialNumber(index: number): number {
    let serialNumber = 0;
    for (let i = 0; i <= index; i++) {
      const rowSpan = this.getRowSpan('GroupName', i);
      if (rowSpan === 1) {
        serialNumber = serialNumber + 1;
      } else if (rowSpan > 1) {
        serialNumber = serialNumber + 1;
      }
    }
    return serialNumber;
  }

  cacheSpan(key: any, accessor: any, DATA: any) {
    for (let i = 0; i < DATA.length;) {
      const currentValue = accessor(DATA[i]);
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
}
