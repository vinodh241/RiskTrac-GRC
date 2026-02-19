import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewComplianceComponent } from './new-compliance/new-compliance.component';
import { ComplianceService } from 'src/app/services/compliance-review/compliance.service';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-compliance-listing',
  templateUrl: './compliance-listing.component.html',
  styleUrls: ['./compliance-listing.component.scss']
})

export class ComplianceListingComponent {

  displayedColumns: string[] = ['Index', 'complainceCode', 'complainceName', 'type', 'framework', 'scope', 'startDate', 'endDate', 'status', 'progress', 'respondent','auditor'];
  dataSource = new MatTableDataSource<Element>();

  constructor(public dialog: MatDialog,
    private router: Router,
    public authService: AuthService,
    public complianceService: ComplianceService,
  ) {
    this.authService.activeTab.next("ComplianceReview");
    this.authService.activeSubTab$.next("compliance");
    this.complianceService.getComplianceListData();
  }

  ngOnInit() {
    this.complianceService.gotMasterComplainceData.subscribe((value) => {
      if (value) {
        this.dataSource = this.complianceService.allComplainceData.ComplianceReviewsList;
      }
    });
  }

  addCompliance() {
    const dialog = this.dialog.open(NewComplianceComponent, {
      disableClose: true,
      maxWidth: '100vw',
      width: '90vw',
      panelClass: ['site', 'full-screen-modal'],
      data: {
        //mode: mod,
        //data: row
      },
    });
    dialog.afterClosed().subscribe(() => { });
  }

  directToAsmtCompliance(item: any): void {
    this.router.navigate(['compliance/assessment-compliance-listing'], { queryParams: { 'COMID': item.ComplianceReviewID } });
  }

}
