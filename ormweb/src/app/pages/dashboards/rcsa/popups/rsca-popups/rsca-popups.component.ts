import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-rsca-popups',
  templateUrl: './rsca-popups.component.html',
  styleUrls: ['./rsca-popups.component.scss']
})
export class RscaPopupComponent implements OnInit {  
  listdata:any;
  displayedColumns: string[] = ['srno', 'RCSACode', 'SLNO', 'Units', 'Risk', 'ScheduleInherentRiskStatusName', 'InherentRiskRating', 'ResidualRiskRating'];  
  constructor(
    private dialogRef: MatDialogRef<RscaPopupComponent>,
    @Inject(DOCUMENT) private _document: any,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {    
    // console.log(this.data.data)
    this.listdata = this.data.data;
  }

}
