import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-risk-popup',
  templateUrl: './risk-popup.component.html',
  styleUrls: ['./risk-popup.component.scss']
})
export class RiskPopupComponent implements OnInit {
  listdata:any;
  displayedColumns: string[] = ['srno', 'code', 'unit', 'risk', 'status', 'inherent-risk-rating', 'residual-risk-rating'];
  constructor(
    private dialogRef: MatDialogRef<RiskPopupComponent>,
    @Inject(DOCUMENT) private _document: any,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.listdata = this.data.data;
    console.log(this.data)
  }

}
