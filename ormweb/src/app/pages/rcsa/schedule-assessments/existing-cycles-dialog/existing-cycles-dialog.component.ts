import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-existing-cycles-dialog',
  templateUrl: './existing-cycles-dialog.component.html',
  styleUrls: ['./existing-cycles-dialog.component.scss']
})
export class ExistingCyclesDialogComponent implements OnInit {
  displayedColumns: string[] = ['srno', 'ScheduleAssessmentCode', 'DepartmentName', 'UnitName', 'StatusName'];
  cycles: any[] = [];
  period: string = '';

  constructor(
    public dialogRef: MatDialogRef<ExistingCyclesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.cycles = this.data?.cycles || [];
    this.period = this.data?.period || '';
  }

  close(): void {
    this.dialogRef.close();
  }
}
