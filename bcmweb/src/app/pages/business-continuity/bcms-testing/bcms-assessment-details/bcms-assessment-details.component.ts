import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { BcmsTestingService } from 'src/app/services/bcms-testing/bcms-testing.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { ParticipantsListComponent } from './participants-list/participants-list.component';
import { dateToYMd, formatTimeType, formatedDate1 } from 'src/app/includes/utilities/commonFunctions';
import { RestService } from 'src/app/services/rest/rest.service';

@Component({
  selector: 'app-bcms-assessment-details',
  templateUrl: './bcms-assessment-details.component.html',
  styleUrls: ['./bcms-assessment-details.component.scss']
})
export class BcmsAssessmentDetailsComponent implements OnInit, OnDestroy{
  // open              : number = 0;
  BCMSTest          : any = {};
  previousUrl       : any;
  currentAction     : any = {};
  reportSections    : any;
  isBCCUsersExsists : boolean = false;
  noBCCBussinessFunctions : any = [];
  isPlannedStartDateTimeMeets: boolean = true;
  isPlannedEndDateTimeReached: boolean = false;

  saveerror       : any   = '';

  constructor(
    private route: Router,
    public dialog: MatDialog,
    private utils: UtilsService,
    public restService: RestService,
    public authService: AuthService,
    public service: BcmsTestingService,
    private activatedRoute: ActivatedRoute,
    @Inject(DOCUMENT) private _document: any,
  ) {
    this.authService.activeTab.next("BC");
    this.authService.activeSubTab$.next("bcms-testing");
  };

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params: any) => {
      if (params['BCMSTestID'])
        this.service.selectedBCMSTest$.next(params['BCMSTestID']);
      this.service.getBCMSTestData();
    });
    this.service.gotBCMSTestData$.subscribe((value: any) => {
      if (value) {
        // this.open = this.open + 1;
        this.reportSections = this.service.bcmsTestData.ReportSections;
        this.currentAction  = this.service.bcmsTestData.CurrentActions[0];
        this.isBCCUsersExsists = this.service.bcmsTestData.TestParticipantsList.every((x: any) => x.BusinessFunctionsBCCUsers.length > 0);
        this.noBCCBussinessFunctions = this.service.bcmsTestData.TestParticipantsList.filter((x:any) => x.BusinessFunctionsBCCUsers.length == 0);
        // if (this.open == 1)
        //   this.openPartcipantsListPopupIntial();    // Participant List Popup will open onclick of back button in Participant Report
      }
    });
    this.service.gotBCMSTestDetails$.subscribe((value: any) => {
      if (value) {
        this.BCMSTest = this.service.testDetails;
        this.checkPlannedStartDateTimeMeets();
        this.checkPlannedEndDateTimeReached();
      }
    });
  };

  openPartcipantsListPopupIntial() {
    this.restService.previousUrl$.subscribe((previousUrl: string) => {
      this.previousUrl = previousUrl;
    });
    if (!!this.previousUrl && this.previousUrl.includes('participant-report')) {
      if (this.service.bcmsTestData && this.BCMSTest && this.service.bcmsTestData?.TestParticipantsList?.length > 1 && (this.reportSections[0]?.ButtonName != null)) {
        this.openPartcipantsListPopup(this.service.bcmsTestData.TestParticipantsList, {testAssessmentId: this.BCMSTest.TestAssessmentID, testParticipantId: this.service.bcmsTestData.TestParticipantsList[0].TestParticipantID, scheduledTestId: this.service.bcmsTestData.TestParticipantsList[0].ScheduledTestID});
      }
    }
  }

  ngOnDestroy() {
    // this.open = 0;
    this.BCMSTest = {};
    this.previousUrl = '';
    this.currentAction = {};
    this.reportSections = [];;
    this.reportSections = [];
    this.isBCCUsersExsists = false;
    this.noBCCBussinessFunctions = [];
    this.isPlannedStartDateTimeMeets = true;
    this.isPlannedEndDateTimeReached = false;
    this.service.gotBCMSTestData$.next(false);
    this.service.gotBCMSTestDetails$.next(false);
    this.saveerror = '';
  }

  getCheckDateFormate(inputDateTime: any): string {
    return formatedDate1(inputDateTime);
  }

  checkPlannedStartDateTimeMeets() {
    this.isPlannedStartDateTimeMeets = true;
    let plannedStartDateTime = this.BCMSTest.ScheduledDate;
    let todaysDate = new Date().toISOString().split('T')[0]
    let todaysTime = new Date().toTimeString().split('GMT')[0].trim();
    let presentDateTime = todaysDate + "T" + todaysTime + ".000Z";
    if((new Date(plannedStartDateTime) >= (new Date(presentDateTime))) && (new Date(plannedStartDateTime).getTime() >= new Date(presentDateTime).getTime())){
      this.isPlannedStartDateTimeMeets = false;
    }else{
      this.isPlannedStartDateTimeMeets = true;
    }
  }


  checkPlannedEndDateTimeReached() {
    this.isPlannedEndDateTimeReached = false;
    let plannedEndDateTime = this.BCMSTest.EndDate;
    let todaysDate = new Date().toISOString().split('T')[0]
    let todaysTime = new Date().toTimeString().split('GMT')[0].trim();
    let presentDateTime = todaysDate + "T" + todaysTime + ".000Z";
    if ((new Date(plannedEndDateTime) <= (new Date(presentDateTime))) && (new Date(plannedEndDateTime).getTime() <= new Date(presentDateTime).getTime()))
      this.isPlannedEndDateTimeReached = true;
    else
      this.isPlannedEndDateTimeReached = false;
  }

  getDateFormat(date: any) {
    return dateToYMd(this.utils.formatDate(date));
  }

  getActionLength() {
    return this.BCMSTest?.CurrentActions?.length != 0? true : false;
  }

  // Navigation to the Listing Page
  navigateToTestListing() {
    this.service.selectedBCMSTest$.next('');
    this.route.navigate(['bcms-testing/bcms-test-listing']);
  };

  // Update the Test Assessment Status
  UpdateBCMSTestStatus() {
    this.service.UpdateAssessmentStatus(this.BCMSTest).subscribe((res: any) => {
      next:
      if (res.success == 1) {
        this.saveSuccess('Status Updated Successfully');
        this.service.getBCMSTestData();
        this.saveerror = '';
      } else {
        if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
          this.utils.relogin(this._document);
        else
          this.saveerror = res.error.errorMessage;
      };
    });
  };

  // Navigation to the Feedback Report (Questions)
  navigateToFeedbackReport(report: any): void {
    let headerQueries = { testAssessmentId: this.BCMSTest.TestAssessmentID };
    this.service.gotBCMSTestDetails$.next(false);
    switch (report.ReportSectionName) {
      case 'Participant Feedback':
        headerQueries = Object.assign(headerQueries, {testParticipantId: this.service.bcmsTestData.TestParticipantsList[0].TestParticipantID, scheduledTestId: this.service.bcmsTestData.TestParticipantsList[0].ScheduledTestID});
        if(this.service.bcmsTestData.TestParticipantsList?.length == 1) {
          this.route.navigate(['bcms-testing/participant-report'], { queryParams: headerQueries });
        } else {
          this.openPartcipantsListPopup(this.service.bcmsTestData.TestParticipantsList, headerQueries);
        }
        break;
      case 'Observer Report':
        headerQueries = Object.assign(headerQueries, {testObserverId: this.BCMSTest.TestObserverGUID, scheduledTestId: this.service.bcmsTestData.TestObserverDetails[0].ScheduledTestID});
        this.route.navigate(['bcms-testing/observer-report'], { queryParams: headerQueries });
        break;
      case 'Overall Test Observations & Report':
        this.route.navigate(['bcms-testing/test-report'], { queryParams: headerQueries });
        break;
      default:
        console.log("No User exsists!");
        break;
    }
  };

  // Popup for review Business Functions list
  openPartcipantsListPopup(participants: any, headerQueries: any) {
    const dialog = this.dialog.open( ParticipantsListComponent, {
      disableClose: true,
      maxWidth: '100vw',
      width: '92vw',
      panelClass: ['full-screen-modal'],
      data: {
        from              : 2,
        title             : 'Participant BCC Feedback Reports',
        participantsList  : JSON.parse(JSON.stringify(participants)),
        payload           : JSON.parse(JSON.stringify(headerQueries))
      },
    });
    dialog.afterClosed().subscribe((result) => {
      if(result)
        this.service.getBCMSTestData();
    });
  };

  // Popup for Business Functions list which are not linked with BCC(Business Cordinator)
  showBusinessFunctionList():void {
    const dialog = this.dialog.open(ParticipantsListComponent, {
      disableClose: true,
      maxWidth: '100vw',
      width: '50vw',
      panelClass: ['full-screen-modal'],
      data: {
        from            : 1,
        title           : "Business Functions List",
        participantsList: this.noBCCBussinessFunctions
      }
    });
    dialog.afterClosed().subscribe((result) => {
      if(result)
        this.service.getBCMSTestData();
    });
  }

  // Common Methods below (Save Sucess , Auto Scroll) -- start
  saveSuccess(content: string): void {
    const timeout = 3000; // 3 Seconds
    const confirm = this.dialog.open(InfoComponent, {
      id: "InfoComponent",
      disableClose: true,
      minWidth: "5vh",
      panelClass: "success",
      data: {
        title: "Success",
        content: content
      }
    });

    confirm.afterOpened().subscribe((result: any) => {
      setTimeout(() => {
        confirm.close();
      }, timeout)
    });
  };

  // Auto Scroll
  scrollDown(id: any) {
    let el = document.getElementById(id)!;
    setTimeout(() => {
      if (el) el.scrollTop = el.scrollHeight;
    }, 100);
  };

  scrollUp(id: any) {
    let el = document.getElementById(id)!;
    setTimeout(() => {
      if (el) el.scrollTop = 0;
    }, 100);
  };
}
