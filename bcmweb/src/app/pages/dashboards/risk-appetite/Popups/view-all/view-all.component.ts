import { Component, Inject, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { RaPopupComponent } from '../ra-popup/ra-popup.component';
import { CmPopupComponent } from '../cm-popup/cm-popup.component';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-view-all',
  templateUrl: './view-all.component.html',
  styleUrls: ['./view-all.component.scss']
})
export class ViewAllComponent implements OnInit {
  displayedColumns: string[] = ['name','openCount' , 'closedCount' , 'CriticalRiskLevel', 'ModerateRiskLevel'];
  dataSource = new MatTableDataSource<any>();

  formattedData: any;
  RawData: any;
  RiskData: any;
  closedStatus: any;
  openStatus: any;
  yearData: any;
  quaterData: any;
  quarterFilter: any;
  data:any =[]
  constructor(
    public dashboardservice: DashboardService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public parent: any
  ) { }

  ngOnInit(): void {
    

    this.data=[]
    this.data= this.parent.id;
    console.log('this.parent.id: ',this.data)
    this.dataSource =this.data;
    
   
    this.dashboardservice.gotRAMaster.subscribe((value) => {
      if (value == true) 
      {   
          //to get the details of the current quater         
          this.formattedData  = this.dashboardservice.RAMaster.Formatted_DATA;                 
          this.RawData        = this.formattedData.filter((item:any) => item.CollectionStatusName !== "Not Started" && item.StatusID !== null && item.StatusID !== 1 && item.StatusID !== 2 );
          this.dashboardservice.gotYearQuater.subscribe((value) => {
            this.yearData = this.dashboardservice.yearValue
            this.quaterData = this.dashboardservice.quaterValue
        


        let currentDate = new Date(); // Get the current date
        let currMonth = currentDate.getMonth() + 1;
        let currQuarter = Math.ceil(currMonth / 3);
        // console.log("currQuarter",currQuarter)

        this.quarterFilter = 'Q' + ((this.quaterData !== undefined && this.quaterData > 0) ? this.quaterData : currQuarter) + '-' + this.yearData.toString().substr(2, 2);                   
          // let currentDate     = new Date(); 
          // let currentQuarter  = "Q" + Math.ceil((currentDate.getMonth() + 1) / 3) + "-" + currentDate.getFullYear().toString().substr(2,2); // Get the current quarter
          this.RiskData       = this.RawData.filter((data:any) => data.Quater == this.quarterFilter); 
          this.closedStatus   = this.formattedData.filter((item:any) => item.Quater == this.quarterFilter && item.StatusID == 5);
          this.openStatus     = this.formattedData.filter((obj:any)  => obj.Quater == this.quarterFilter && ((obj.CollectionStatusName == "Not Started" && obj.StatusID == null) || obj.StatusID === 2 || obj.StatusID === 3 || obj.StatusID === 4));
          })
        }

    }) 
  }
  cancel(){
    
  }
  openOrgPopup(status: string, element: any) :void{ 
    console.log('element: ',element);
    let RATitle = 'Organizational RA';
    let statusMetric :any;
    let OrgData:any;
    if (status === 'open') {
        statusMetric='Open';
        OrgData =  this.openStatus.filter((obj: any) => obj.CaptionData == element.name)
    } else if (status === 'closed') {
        statusMetric = 'Closed';
        OrgData =  this.closedStatus.filter((obj: any) => obj.CaptionData == element.name)
    } else if ( status === 'ModerateRiskLevel'){
        statusMetric= 'Moderate Risk Level';
        OrgData = this.RiskData.filter((obj: any) => obj.CaptionData == element.name && obj.RiskMetricLevel == 2)
    }  else if ( status === 'CriticalRiskLevel'){
        statusMetric = 'Critical Risk Level'
        OrgData = this.RiskData.filter((obj: any) => obj.CaptionData == element.name && obj.RiskMetricLevel == 3)
    }
    console.log('statusMetric: ',statusMetric)
    if(OrgData?.length > 0){ 
        const dialog = this.dialog.open(RaPopupComponent, {
            disableClose: true,         
            panelClass: 'full-screen-modal',        
            data: {
                id: OrgData,
                RATitle:RATitle,
                status:element.name,
                statusMetric:statusMetric
            }
        });
        dialog.afterClosed().subscribe(() => {
        })
    }
    else {      
        this.dashboardservice.popupInfo(element.name+ " "+ " - " +statusMetric+" - No Records  Available ", '')
    }
    
    
}
}
