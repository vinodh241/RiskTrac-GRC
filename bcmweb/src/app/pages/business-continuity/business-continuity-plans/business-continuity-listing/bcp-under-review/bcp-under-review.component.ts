import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { addIndex, searchBy } from 'src/app/includes/utilities/commonFunctions';
import { AuthService } from 'src/app/services/auth/auth.service';
import { BusinessContinuityPlansService } from 'src/app/services/business-continuity-plans/business-continuity-plans.service';

@Component({
  selector: 'app-bcp-under-review',
  templateUrl: './bcp-under-review.component.html',
  styleUrls: ['./bcp-under-review.component.scss']
})

export class BcpUnderReviewComponent {

  dataSource = new MatTableDataSource<Element>();
  displayedColumns: string[] = ['Index','businessFunction','group', 'mtpd',  'rto', 'rpo','fbcc','bcc','docStatus','reviewCompletion','reviewStatus'];
  businessData:any[] = []
  reviewCount:any
  inProgressCount:any
  OverdueCount:any
  allBusinessData: any;
  BusinessFunctionName: any;
  FBCCName: any;
  BusinessGroup: any;
  BCCName: any;
  BusinessContinuityPlanID: any;

  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    public businessContinuityService: BusinessContinuityPlansService,
    private router: Router,
  ) {
    this.authService.activeTab.next("BC");
    this.authService.activeSubTab$.next("business-continuity-plans");
    this.businessContinuityService.getBusinessContinuityReviewList();
    this.businessContinuityService.gotReviewMaster.subscribe((value) => {
      if(value){
      this.dataSource = this.businessContinuityService.masterReviewData.BusinessContinuityPlansList;
      }
    })
  }

  applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      const searchFields: any = ['Index','businessFunction','department','group', 'mtpd',  'rto', 'rpo','fbcc','bcc','docStatus','reviewCompletion','reviewStatus']
      this.dataSource = addIndex(JSON.parse(JSON.stringify(searchBy(filterValue, searchFields, this.businessContinuityService.masterData['BusinessContinuityPlansList']))), false)
  }

  review(id: any) {
    // this.dataSource = this.allData.filter((ele: any) => ele.StatusID == id)
    // this.completedCount = this.allData.filter((ele: any) => ele.StatusID == id).length
    // console.log('this.dataSource:filter ', this.dataSource);
  }

  Overdue(id: any) {
    // this.dataSource = this.allData.filter((ele: any) => ele.StatusID == id)
    // console.log('this.dataSource:filter ', this.dataSource);
  }

  inProgress(id: any) {
    // this.dataSource = this.allData.filter((ele: any) => ele.StatusID == id)
    // this.inProgressCount = this.allData.filter((ele: any) => ele.StatusID == id).length
    // console.log('this.dataSource:filter ', this.dataSource);
  }

  // select(item?: any){
  //   console.log('item: ', item);
  //   this.BusinessContinuityPlanID =  localStorage.setItem('BusinessContinuityPlanID',(item.BusinessContinuityPlanID))
  //   this.businessContinuityService.selectedBusinessContinuityID.next(item.BusinessContinuityPlanID);
  //   this.BusinessFunctionName =  localStorage.setItem('BusinessFunctionName',(item.BusinessFunctionName))
  //   this.FBCCName =  localStorage.setItem('FBCCName',(item.FBCCName))
  //   this.BusinessGroup =  localStorage.setItem('BusinessGroup',(item.BusinessGroup))
  //   this.BCCName =  localStorage.setItem('BCCName',(item.BCCName))
  //   this.businessContinuityService.selectedBusinessFunction.next(item.BCCName);
  //   let listingPageFlag = false
  //   this.businessContinuityService.listingPage.next(listingPageFlag);
  //   localStorage.setItem('BusinessFunctionID',(item.BusinessFunctionID))
  //   this.router.navigate(['business-continuity-plan/review-business-function'])
  // }
}
