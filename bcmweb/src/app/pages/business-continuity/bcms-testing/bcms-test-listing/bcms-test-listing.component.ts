import { Component, OnInit } from '@angular/core';
import { CreateBcmsTestComponent } from './create-bcms-test/create-bcms-test.component';
import { MatDialog } from '@angular/material/dialog';
import { BcmsTestingService } from 'src/app/services/bcms-testing/bcms-testing.service';
import { addIndex, searchBy } from 'src/app/includes/utilities/commonFunctions';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-bcms-test-listing',
  templateUrl: './bcms-test-listing.component.html',
  styleUrls: ['./bcms-test-listing.component.scss']
})
export class BcmsTestListingComponent implements OnInit {
  // coloumns
  displayedColumns = ['index', 'TestName', 'TestType', 'TestScenario', 'TestScope', 'Sites', 'ParticipatingFunctions', 'Observer', 'ScheduledData', 'Duration', 'Status', 'Actions'];

  // filter declarations
  filterValue       : any       = '';
  testStatusIds     : any[]     = [];
  customFilterFields: any[]     = ['TestAssessmentStatusID'];
  searchFields      : string[]  = ['TestName', 'TestType', 'TestingScenario', 'TestScope', 'FormatedSites', 'FormatedBusinessFunctions', 'TestObserver', 'FormatedDate', 'Duration', 'TestAssessmentStatus'];

  constructor(
    private route: Router,
    public dialog: MatDialog,
    public authService: AuthService,
    public service: BcmsTestingService
  ) {
    this.authService.activeTab.next("BC");
    this.authService.activeSubTab$.next("bcms-testing");
    this.service.getBCMSTestMaster();
  }

  ngOnInit(): void {
    this.service.gotMaster$.subscribe((value: any) => {
    if (value) {
      this.testStatusIds = [];
      let inputEl = document.getElementById('bcmsTestListSearch') as HTMLInputElement;
      if (inputEl)
        inputEl.value = ''};
    });
  }

  addUpdateTest(mode: any, rowdata: any = {}) {
    const dialog = this.dialog.open(CreateBcmsTestComponent, {
      disableClose: true,
      maxWidth: '100vw',
      width: '94vw',
      panelClass: ['full-screen-modal'],
      data: {
        testMode  : mode,
        testData  : JSON.parse(JSON.stringify(rowdata)),
        allTests : JSON.parse(JSON.stringify(this.service.master.BCMSTestsList))
      },
    });
    dialog.afterClosed().subscribe((result) => {
        this.service.getBCMSTestMaster();
    });
  }

  getStatusCount(status: Number) {
    return (this.service?.master?.BCMSTestsList || []).filter((test: any) => test.TestAssessmentStatusID == status).length;
  }

  applyFilter(event: any) {
    this.filterValue = (event.target as HTMLInputElement).value;
    this.service.TableBCMSTest.data = addIndex(JSON.parse(JSON.stringify(searchBy(this.filterValue, this.searchFields, this.service.master['BCMSTestsList'], this.customFilterFields, this.testStatusIds))), false);
  }

  filterStatus(id: any) {
    if (this.testStatusIds.includes(id)) {
      const index = this.testStatusIds.findIndex((x: any) => x == id);
      this.testStatusIds.splice(index, 1);
    } else {
      this.testStatusIds.push(Number(id));
    }
    this.service.TableBCMSTest.data = addIndex(JSON.parse(JSON.stringify(searchBy(this.filterValue, this.searchFields, this.service.master['BCMSTestsList'], this.customFilterFields, this.testStatusIds))), false);
  }

  directToTestDetails(item: any) {
    this.route.navigate(['bcms-testing/bcms-assessment-details'], { queryParams: { 'BCMSTestID': item.TestAssessmentID } });
  }
}
