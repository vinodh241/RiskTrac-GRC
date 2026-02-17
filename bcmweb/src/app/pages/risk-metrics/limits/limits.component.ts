import { Component, OnInit, Inject} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { getRendererType } from 'highcharts';

@Component({
  selector: 'app-limits',
  templateUrl: './limits.component.html',
  styleUrls: ['./limits.component.scss']
})
export class LimitsComponent implements OnInit {
  displayedColumns: string[] = ['limit1', 'limit2', 'limit3'];
  dataSource=[this.data.comments]
  constructor(public dialog: MatDialog,
    public dialogRef: MatDialogRef<LimitsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
    ngOnInit(): void {
      console.log(this.data)
      console.log(this.data.comments.PreviousScoring[this.data.pre].ColorCode)
  }
  color1s:string=this.data.comments.PreviousScoring[0].ColorCode
  color2s:string=this.data.comments.PreviousScoring[1].ColorCode
  color3s:string=this.data.comments.PreviousScoring[2].ColorCode
  
}
