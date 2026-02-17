import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';


@Component({
  selector: 'app-cm-popup',
  templateUrl: './cm-popup.component.html',
  styleUrls: ['./cm-popup.component.scss']
})
export class CmPopupComponent implements OnInit {
  
  displayedColumns: string[] = ['No', 'FrameworkName','Quater', 'StartDate','EndDate','GroupName','UnitName','Risks', 'MetricScore' ,'CollectionStatusName'];
  dataSource = new MatTableDataSource<any>();
  popupdata: any;
  popUpName: any;
  
  constructor(  public dashboardservice: DashboardService,
    
    
    @Inject(MAT_DIALOG_DATA) public parent: any) {
    
   }

  ngOnInit(): void {
    this.dataSource = this.parent.id;
    this.popUpName = this.parent.RATitle
    this.popupdata = this.parent.title;
    console.log('this.parent.data: ',this.parent.title)
    
  }
  
  formatDate(date: string, showTime:boolean = false): string { //2022-11-19T18:30:00.000Z
    if(date) {
        let ar:any[] = date.toString().split('T')
        let dt:any[] = []
        let t = ""

        if(ar.length > 0) 
            dt = ar[0].split('-')
        if(ar.length > 1)
            t = ar[1].split('.')[0]
        
        let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        let d = dt.length == 3 ? dt[2] + ' ' + months[Number(dt[1]) - 1] + ' ' + dt[0] : 'DD-MMM-YYYY'
        
        return showTime?d + " " + t: d
    } else 
        return ""
}

}
