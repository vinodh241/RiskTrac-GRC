import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-risk-details-widget',
  templateUrl: './risk-details-widget.component.html',
  styleUrls: ['./risk-details-widget.component.scss']
})
export class RiskDetailsWidgetComponent {
  @Input() siteRiskAssessmentsData: any;

  risksListData           : any   = [];
  riskChartId             : string= 'risks';
  riskStatusData          : any   = [];
  residualRiskStatusData  : any   = [];
  riskFilter                      = new FormControl(false);
  risksCount              : any   = [{riskId: 3, riskName: 'High Risk', riskCount: 0, class:'high'}, {riskId: 2, riskName: 'Medium Risk', riskCount: 0 ,class:'medium'}, {riskId: 1, riskName: 'Low Risk', riskCount: 0 ,class:'low'}]


  ngOnChanges(): void {
    this.risksListData  = this.siteRiskAssessmentsData.RisksList;
    this.calculateRiskCount(false);
    this.calculateRisksChartData(false);

    this.riskFilter.valueChanges.subscribe((riskValue: any) => {
      this.calculateRiskCount(riskValue);
      this.calculateRisksChartData(riskValue);
    });
  }

  getOpenResidualRiskStatusCount(id: string, status: number): number{
    //excluding risks which are in draft(master risk) status
    let filteredRiskList  = (this.siteRiskAssessmentsData?.RisksList || []).filter((risk : any) => !(!risk.IsCustomRisk && [2].includes(risk.StatusID)));
    return (filteredRiskList || []).filter((risk: any) => (risk[id] == status) && ![7].includes(risk.StatusID)).length;
  }

  calculateRiskCount(riskValue: any) {
    this.risksCount.forEach((x: any) => {
      let riskMode = riskValue? 'OverallResidualRiskRatingID' : 'OverallInherentRiskRatingID';
      //excluding risks which are in draft(master risk) status
      let filteredRiskList  = (this.siteRiskAssessmentsData?.RisksList || []).filter((risk : any) => !(!risk.IsCustomRisk && [2].includes(risk.StatusID)));
      x.riskCount = (filteredRiskList || []).filter((risk: any) => (risk[riskMode] == x.riskId) && ![7].includes(risk.StatusID)).length;
    });
  }

  calculateRisksChartData(riskValue: any) {
    this.riskStatusData = [];
    this.residualRiskStatusData = [];

    // Open/Closed Risks calculations -->
    let riskLevelStatus = [[1, 2, 3, 4, 5, 6], [7]];
    riskLevelStatus.forEach((status: Array<any>) => {
      this.riskStatusData.push({
        id    : status.length > 1? 1 : 2,
        name  : status.length > 1? 'Open' : 'Closed',
        color : status.length > 1? ['#E5316C', '#EA8A32'] : ['#16BF6E', '#1BDFDF'],
        radioColor: status.length > 1? '#E5316C' : '#16BF6E',
        class : status.length > 1? 'open' : 'closed',
        y     : (this.risksListData || []).filter((risk: any) => status.includes(risk.StatusID)).length
      });
    });

    // Open Residual Risk Calculation
    let residualStatus = [{ statusName: 'High Risk', statusId: 3, color: ['#E74B36', '#FFD5C8']}, { statusName: 'Medium Risk', statusId: 2, color: ['#FFA41C', '#FFC657']}, { statusName: 'Low Risk', statusId: 1, color: ['#2BE760', '#D2FD57']}];
    residualStatus.forEach((status: any) => {
      this.residualRiskStatusData.push({
        id    : status.statusId,
        name  : status.statusName,
        color : status.color,
        radioColor: status.color[0],
        y     : this.getOpenResidualRiskStatusCount(riskValue? 'OverallResidualRiskRatingID' : 'OverallInherentRiskRatingID', status.statusId),
        count : this.getOpenResidualRiskStatusCount(riskValue? 'OverallResidualRiskRatingID' : 'OverallInherentRiskRatingID', status.statusId)
      });
    });
  }
}
