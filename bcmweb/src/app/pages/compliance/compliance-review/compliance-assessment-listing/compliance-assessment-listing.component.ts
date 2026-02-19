import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ComplianceService } from 'src/app/services/compliance-review/compliance.service';

@Component({
  selector: 'app-compliance-assessment-listing',
  templateUrl: './compliance-assessment-listing.component.html',
  styleUrls: ['./compliance-assessment-listing.component.scss']
})

export class ComplianceAssessmentListingComponent {

  displayedColumns: string[] = ['Position', 'BusinessFunctions', 'Respondents', 'ResponseStatus', 'Completed'];

  constructor(private readonly activatedRoute: ActivatedRoute,
    public authService: AuthService,
    public service: ComplianceService
  ) {
    this.authService.activeTab.next("ComplianceReview");
    this.authService.activeSubTab$.next("compliance");
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['COMID'])
        this.service.selectedCompliance.next(params['COMID'])
      this.service.getComplianceDashboard();
    });

    this.service.dashboardSubj.subscribe((value: any) => {
      if(value){
        this.service.dashboardObj.AssessmentStatusList || [];
      }
    })
  }

}
