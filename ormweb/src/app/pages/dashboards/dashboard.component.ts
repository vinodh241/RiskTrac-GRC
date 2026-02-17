import { Location } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { RestService } from 'src/app/services/rest/rest.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    leftMenu: any = "";
    date: any = "";
    year: any;
    quarter: any;
    yearsList: any[] = [];
    quartersList: any = [];
    quarterFilter: any;
    yearFilter: any
    quarterData: any;
    yearData: any;
    startDate: any;
    endDate: any;
    isRiskManagementUnit: boolean = false;
    role = "";
    overAll: boolean = true
    constructor(private dashboardService: DashboardService,
        private utilsService: UtilsService,
        private router: Router,
        private location: Location,
        private rest: RestService,
    ) {
        this.router.events.subscribe((val) => {
            if (this.location.path() != '') {
                if (this.location.path() == '/dashboard-overall') {
                    this.dashboardService.dashboardLeftmenu = 'overall';
                } else if (this.location.path() == '/dashboard-risk-appetite') {
                    this.dashboardService.dashboardLeftmenu = 'risk-appetite';
                } else if (this.location.path() == '/dashboard-rcsa') {
                    this.dashboardService.dashboardLeftmenu = 'rcsa';
                } else if (this.location.path() == '/dashboard-kri') {
                    this.dashboardService.dashboardLeftmenu = 'kri';
                } else if (this.location.path() == '/dashboard-incident') {
                    this.dashboardService.dashboardLeftmenu = 'incident';
                }
            }
        });
    }

    ngOnInit(): void {
        this.getQuarter(new Date());
        var currentDate = new Date();
        var currentYear = currentDate.getFullYear();
        for (var i = 0; i < 7; i++) {
            this.yearsList.push(currentYear - i);
        }
        this.rest.openWait("Fetching Data ...")
        setTimeout(() => {
            this.rest.closeWait()
            if (localStorage.getItem("selectQ") != undefined && localStorage.getItem("selectQ") != null &&
                localStorage.getItem("selectY") != undefined && localStorage.getItem("selectY") != null) {
                this.checkYear(Number(localStorage.getItem("selectY")));
                this.checkQuarter(Number(localStorage.getItem("selectQ")));

            }
            localStorage.removeItem("selectQ")
            localStorage.removeItem("selectY")
        }, 2000)
    }

    @HostListener('window:popstate', ['$event'])
    onPopState(event: any) {
        this.router.events.subscribe((val) => {
            if (this.location.path() != '') {
                if (this.location.path() == '/dashboard-overall') {
                    this.dashboardService.dashboardLeftmenu = 'overall';
                } else if (this.location.path() == '/dashboard-risk-appetite') {
                    this.dashboardService.dashboardLeftmenu = 'risk-appetite';
                } else if (this.location.path() == '/dashboard-rcsa') {
                    this.dashboardService.dashboardLeftmenu = 'rcsa';
                } else if (this.location.path() == '/dashboard-kri') {
                    this.dashboardService.dashboardLeftmenu = 'kri';
                } else if (this.location.path() == '/dashboard-incident') {
                    this.dashboardService.dashboardLeftmenu = 'incident';
                }
            }
        });
    }

    checkYear(yearValue: any) {
        // console.log('yearValue: ', yearValue);
        this.yearData = yearValue
        this.yearFilter = yearValue
        this.dashboardService.getYearData(this.yearData);
        if (this.year == yearValue) {
            if (this.quarter == 1) {
                this.quartersList = [1];
                this.quarterFilter = 1;
            } else if (this.quarter == 2) {
                this.quartersList = [1, 2];
                this.quarterFilter = 2;
            } else if (this.quarter == 3) {
                this.quartersList = [1, 2, 3];
                this.quarterFilter = 3;
            } else if (this.quarter == 4) {
                this.quartersList = [1, 2, 3, 4];
                this.quarterFilter = 4;
            }
        } else {
            this.quartersList = [1, 2, 3, 4];
        }
        this.dashboardService.getQuarterData(this.quarterFilter);
        // console.log('this.quarterFilter: ', this.quarterFilter);
        if (this.dashboardService.dashboardLeftmenu == "overall") {
            this.allMethod()
        }
        this.checkMonth(this.quarterFilter);
    }

    checkMonth(quarterValue: number) {
        // console.log('this.yearFilter: ' + this.yearFilter)
        if (quarterValue == 1) {
            this.startDate = new Date(this.yearFilter, 0, 1);
            this.endDate = new Date(this.yearFilter, 2, 31);
        }
        else if (quarterValue == 2) {
            this.startDate = new Date(this.yearFilter, 3, 1);
            this.endDate = new Date(this.yearFilter, 5, 30);
        }
        else if (quarterValue == 3) {
            this.startDate = new Date(this.yearFilter, 6, 1);
            this.endDate = new Date(this.yearFilter, 8, 30);
        }
        else if (quarterValue == 4) {
            this.startDate = new Date(this.yearFilter, 9, 1);
            this.endDate = new Date(this.yearFilter, 11, 31);
        }
    }

    checkQuarter(quarterValue: any) {
        this.quarterFilter = quarterValue
        this.dashboardService.getQuarterData(quarterValue);
        this.checkMonth(quarterValue);
    }

    openMenu(data: any, type: any) {
        if (type == 'same') {
            localStorage.setItem("selectQ", this.quarterFilter);
            localStorage.setItem("selectY", this.yearFilter);
        } else {
            localStorage.removeItem("selectQ");
            localStorage.removeItem("selectY");
        }
        this.dashboardService.dashboardLeftmenu = data;
        if (data == 'overall') {
            this.router.navigate(['dashboard-overall']);
        } else if (data == 'risk-appetite') {
            this.router.navigate(['dashboard-risk-appetite']);
        } else if (data == 'rcsa') {
            this.router.navigate(['dashboard-rcsa']);
        } else if (data == 'kri') {
            this.router.navigate(['dashboard-kri']);
        } else if (data == 'incident') {
            this.router.navigate(['dashboard-incident']);
        }
    }

    allMethod() {
        this.dashboardService.getOverallDashbardData(this.yearFilter)
    }

    isActive(activeContent: any) {
        this.leftMenu = this.dashboardService.dashboardLeftmenu;
        if (this.leftMenu === activeContent) {
            return true;
        } else {
            return false;
        }
    }

    getType(data: any) {
        return this.dashboardService.dashboardLeftmenu == data
    }

    getQuarter(date: Date) {
        date = date || new Date();
        var month = Math.floor(date.getMonth() / 3) + 1;
        month -= month > 4 ? 4 : 0;
        this.year = date.getFullYear()
        switch (month) {
            case 1:
                this.date = "Jan " + this.year;
                this.quarter = 1;
                break;
            case 2:
                this.date = "Apr " + this.year;
                this.quarter = 2;
                break;
            case 3:
                this.date = "Jul " + this.year;
                this.quarter = 3;
                break;
            case 4:
                this.date = "Oct " + this.year;
                this.quarter = 4;
                break;
            default:
                break;
        }
        this.yearFilter = Number(this.year);
        this.checkYear(this.yearFilter);
    }
}