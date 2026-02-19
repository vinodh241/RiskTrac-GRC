import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ExportDashboardViewService } from 'src/app/services/dashboard/export-dashboard-view/export-dashboard-view.service';
import { GlobalDashboardService } from 'src/app/services/dashboard/global-dashboard/global-dashboard.service';
import { RestService } from 'src/app/services/rest/rest.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-global-dashboard',
  templateUrl: './global-dashboard.component.html',
  styleUrls: ['./global-dashboard.component.scss']
})

export class GlobalDashboardComponent implements OnInit{
  yearsDropdownList   : Array<any>    = [];
  selectedYearsString : string        = '';
  selectedYear        : number        = 0;
  // dashboardWidgets    : Array<any>    = [];          // it is required for the dynamic dashboard widgets

  bcpCoverageData         : any[] = [];
  siteRiskAssessmentsData : object= {};
  remediationTrackerData  : object= {};
  periodicReviewData      : any[] = [];
  bcpCriticalityData      : any[] = [];

  dashboardElementIds: Array<string> = ['BCP-coverage-widget-id', 'periodic-review-widget-id', 'remediation-tracker-widget-id', 'site-risk-assessment-widget-id', 'risk-details-widget-id', 'BCP-criticality-widget-id'];

  constructor(
    public authService: AuthService,
    public restService: RestService,
    public utils      : UtilsService,
    private router    : Router,
    public service    : GlobalDashboardService,
    private exportViewService: ExportDashboardViewService
  ) {
    if(this.utils.isSCUserNBCMUnitUser()){
      this.authService.activeTab.next("dashboard");
      this.authService.activeSubTab$.next("global-dashboard");
      this.service.getGobalDashboardData([(new Date()).getFullYear()]);
      this.selectedYear = (new Date()).getFullYear();
      this.getSectedFinancialYears();
    }else{
      this.router.navigate(['/business-continuity-plan']);
    }
  }

  ngOnInit(): void {
    this.service.gotGlobalDashboardDataMaster$.subscribe((value: any) => {
      // value && (this.dashboardWidgets         = this.service.globalDashboardDataMaster.DashboardsList[0].DashboardWidgets);
      value && (this.yearsDropdownList        = this.service.globalDashboardDataMaster.FinancialYearsList);
      value && (this.bcpCoverageData          = this.service.globalDashboardDataMaster.BCPCoverageList)
      value && (this.siteRiskAssessmentsData  = this.service.globalDashboardDataMaster.SiteRiskAssessments);
      value && (this.remediationTrackerData   = JSON.parse(JSON.stringify(this.service.globalDashboardDataMaster.RemediationTracker || [])));
      value && (this.periodicReviewData       = this.service.globalDashboardDataMaster.PeriodicReviewList);
      value && (this.bcpCriticalityData       = this.service.globalDashboardDataMaster.BCPCriticalityDistribution);
    });
  }

  getSectedFinancialYears(): void {
    this.selectedYearsString = this.getYearFormat(this.selectedYear)

    // multi-select - start
    // if (this.selectedYearsList.length == 0) {
    //   this.selectedYearsString = this.getYearFormat((new Date()).getFullYear());
    //   return
    // }
    // let yearString: Array<string> = [];
    // this.selectedYearsList.forEach((yr: number) => {
    //   yearString.push(this.getYearFormat(yr));
    // });
    // this.selectedYearsString = yearString.join(', ');
    // multi-select - end
  }

  // 2024 --> 2024-25
  getYearFormat(year: number): string {
    return year.toString() + '-' + (year + 1).toString().slice(2, 5);
  }

  getSelectedYearsString(): string {
    return this.selectedYearsString?.length > 7? ((this.selectedYearsString).substring(0, 7)+'...') : this.selectedYearsString;
  }

  filterGlobalDashboardData(): void{
    this.getSectedFinancialYears();
    this.service.getGobalDashboardData(this.selectedYear);
  }

  resetFilter() {
    this.selectedYear = (new Date()).getFullYear();
    this.filterGlobalDashboardData();
  }

  exportGDashboardView(from: any) {
    this.exportViewService.openWait("Downloading...")
    setTimeout(() => {
      let attachId = this.dashboardElementIds.map((id: any) => from + '-' + id);
      this.exportViewService.exportDashboardView('Global', attachId, this.getSelectedYearsString());
    }, 100);
  }
}
