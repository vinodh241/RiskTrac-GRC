import { Component, Input } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GlobalDashboardService } from 'src/app/services/dashboard/global-dashboard/global-dashboard.service';

@Component({
  selector: 'app-site-risk-widget',
  templateUrl: './site-risk-widget.component.html',
  styleUrls: ['./site-risk-widget.component.scss']
})

export class SiteRiskWidgetComponent {
  @Input() siteRiskAssessmentsData: any;

  topSites                : Array<any>  = [];
  risksListData           : any         = [];

  constructor(
    public authService: AuthService,
    public service    : GlobalDashboardService
  ) {}

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    this.risksListData  = this.siteRiskAssessmentsData.RisksList;
    this.topSites       = this.siteRiskAssessmentsData.Top3Sites;
  }

  getOpenAssessmentPer(assessmentList: Array<object>): number {
    if (assessmentList == undefined) return 0;
    const openAssessment = (assessmentList || []).filter((arr: any) => [1, 2].includes(arr.SiteRiskAssessmentStatusID));
    const percentage = (openAssessment.length / (assessmentList || []).length) * 100
    return percentage == 0 ? percentage : Number(Math.round(percentage));
  }

  getOpenNClosedRiskCount(statusId: Array<number>) {
    return (this.risksListData || []).filter((risk: any) => statusId.includes(risk.StatusID)).length;
  }

  getInherentNResidualRiskCount(id: string, status: number): number{
    //excluding risks which are in draft(master risk) status
    let filteredRiskList  = (this.siteRiskAssessmentsData?.RisksList || []).filter((risk : any) => !(!risk.IsCustomRisk && [2].includes(risk.StatusID)));
    return (filteredRiskList || []).filter((risk: any) => risk[id] == status).length;
  }
}
