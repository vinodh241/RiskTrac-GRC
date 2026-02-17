import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';

@Component({
    selector: 'app-overall',
    templateUrl: './overall.component.html',
    styleUrls: ['./overall.component.scss']
})
export class OverAllDashboardComponent implements OnInit {
    yearData: any;
    quaterData: any;
    constructor(
        private dashboardService: DashboardService
    ) {
        this.dashboardService.getYearQuarterData();
        this.dashboardService.gotYearQuater.subscribe((value) => {
          if(value==true){
            this.yearData = this.dashboardService.yearValue
            this.quaterData = this.dashboardService.quaterValue
        }
    });
        // this.dashboardService.getOverallDashbardData(this.yearData,this.quaterData)

    }

    ngOnInit(): void {
    }
}
