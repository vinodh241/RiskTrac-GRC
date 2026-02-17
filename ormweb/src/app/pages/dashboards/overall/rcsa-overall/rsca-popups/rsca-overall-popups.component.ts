import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-rsca-overall-popups',
  templateUrl: './rsca-overall-popups.component.html',
  styleUrls: ['./rsca-overall-popups.component.scss']
})
export class RscaOverallPopupComponent implements OnInit {  
  listdata:any;
  displayedColumns: string[] = ['srno', 'RCSACode', 'SLNO', 'Units', 'Risk', 'ScheduleInherentRiskStatusName', 'InherentRiskRating', 'ControlEnvironmentRating', 'ResidualRiskRating'];  
  constructor(
    private dialogRef: MatDialogRef<RscaOverallPopupComponent>,
    @Inject(DOCUMENT) private _document: any,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {    
    // console.log(this.data.data)
    this.listdata = this.data.data;
  }

}
