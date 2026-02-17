import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { from, Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { environment } from 'src/environments/environment';
import { ConfirmDialogComponent } from '../utilities/popups/confirm/confirm-dialog.component';
import { WaitComponent } from '../utilities/popups/wait/wait.component';
import { NotificationsService } from 'src/app/services/notifications/notifications.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { Location } from '@angular/common';
import { MatMenuTrigger } from '@angular/material/menu';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { IncidentService } from 'src/app/services/incident/incident.service';
import { ConfigScoreRatingService } from 'src/app/services/rcsa/master/common/config-score-rating.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
    // @ts-ignore
    wait;

    userName: any;

    role = '';
    isPowerUser: boolean = false;
    isFunctionalAdmin: boolean = false;
    isStandardUser: boolean = false;
    isRiskManagementUnit: boolean = false;
    isPowerUserRole: boolean = false;
    activePage: string = localStorage?.getItem('activePage') || '';
    totalCount:any
    triggerNotificationService: boolean = false;
    reviewFlag: boolean = false;
    @ViewChild('menuContacts') menuContacts: any;
    InAppUnreadCount:any
    unreadItems: any;
    headerFlag: boolean = false;
    @ViewChild('dropdownMenu') dropdownMenu: ElementRef | undefined;
    logoutflag:boolean = false;

    // @ViewChild(MatMenuTrigger)
    // trigger!: MatMenuTrigger;

    constructor(
        private authService: AuthService,
        private formBuilder: FormBuilder,
        private router: Router,
        public dialog: MatDialog,
        public notificationService: NotificationsService,
        private utilsService: UtilsService,
        public dashboardService: DashboardService,
        public incService: IncidentService,
        private activatedRoute: ActivatedRoute,
        @Inject(DOCUMENT) private document: any,
        private location: Location,
        private configScoreRatingService : ConfigScoreRatingService
    ) {
        this.headerFlag = false;
    }

    ngOnInit(): void {

        this.role = localStorage.getItem('rorm') || '';
        this.userName = localStorage.getItem('username') || '';
        this.activePage = localStorage.getItem('activePage') || '';
        this.isRiskManagementUnit = this.utilsService.isRiskManagementUnit();
        if (this.location.path() == '') {
            if ((this.role == 'PU' || this.role == 'SU' || this.role == 'FA') && !this.isRiskManagementUnit) {
                localStorage.setItem('activePage', 'incident-list');
                this.activePage = 'incident-list'
                this.router.navigate(['incident-list']);
            } else {
                localStorage.setItem('activePage', 'dashboard');
                this.activePage = 'dashboard'
                this.router.navigate(['dashboard-overall']);
            }
        }
        this.role = localStorage.getItem('rorm') || '';
        console.log('currentUrl', this.activePage);


            setTimeout(()=> {
                this.getNotificationData();
            },2000);

        this.isFunctionalAdmin = this.utilsService.isFunctionalAdmin();
        this.isStandardUser = this.utilsService.isStandardUser();
        this.isPowerUser = this.utilsService.isPowerUser();
        this.isPowerUserRole = this.utilsService.isPowerUserRole();
        this.isRiskManagementUnit = this.utilsService.isRiskManagementUnit();
        if (this.isPowerUserRole && !this.isRiskManagementUnit) {
            this.reviewFlag = true;
        } else if (this.isPowerUserRole && this.isRiskManagementUnit) {
            this.reviewFlag = false;
        } else if (this.isFunctionalAdmin && !this.isRiskManagementUnit) {
            this.reviewFlag = true;
        } else if (
            !this.isFunctionalAdmin &&
            !this.isPowerUserRole &&
            !this.isRiskManagementUnit
        ) {
            this.reviewFlag = true;
        }
    }

    riskAppetiteDocuments(): void {
        localStorage.setItem('activePage', 'risk-appetite-documents');
        this.activePage = 'risk-appetite-documents'
        this.router.navigate(['risk-appetite-documents']);
    }

    riskAppetiteTemplates(): void {
        localStorage.setItem('activePage', 'risk-appetite-templates');
        this.activePage = 'risk-appetite-templates'
        this.router.navigate(['risk-appetite-templates']);
    }

    manageRiskAssessments(): void {
        localStorage.setItem('activePage', 'manage-risk-assessments');
        this.activePage = 'manage-risk-assessments';
        this.router.navigate(['manage-risk-assessments']);
    }

    viewRiskAssessments(): void {
        localStorage.setItem('activePage', 'manage-risk-assessments');
        this.activePage = 'manage-risk-assessments';
        localStorage.setItem('risk-assessments', 'view');
        // this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        //     this.router.navigate(['view-risk-assessments']);
        // });
        this.router.navigate(['view-risk-assessments']);
    }

    submitRiskAssessments(): void {
        localStorage.setItem('activePage', 'submit-risk-assessments');
        this.activePage = 'submit-risk-assessments';
        localStorage.setItem('risk-assessments', 'submit');
        // this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        //     this.router.navigate(['submit-risk-assessments']);
        // });
        this.router.navigate(['submit-risk-assessments']);
    }

    reviewRiskAssessments(): void {
        localStorage.setItem('activePage', 'review-risk-assessments');
        this.activePage = 'review-risk-assessments';
        localStorage.setItem('risk-assessments', 'review');
        // this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        //     this.router.navigate(['review-risk-assessments']);
        // });
        this.router.navigate(['review-risk-assessments']);
    }

    riskAssessmentsHistorical(): void {
        localStorage.setItem('activePage', 'risk-assessments-historical');
        this.activePage = 'risk-assessments-historical';
        localStorage.setItem('AssessmentFilter', 'Historical');
        this.router.navigate(['risk-assessments-historical']);
    }

    generateEmail() {
        this.router.navigate(['generate-email']);
    }

    riskAssessmentsSubmitted(): void {
        localStorage.setItem('activePage', 'risk-assessments-submitted');
        this.activePage = 'risk-assessments-submitted';
        localStorage.setItem('AssessmentFilter', 'View Submitted');
        this.router.navigate(['risk-assessments-submitted']);
    }

    reportSettings(): void {
        localStorage.setItem('activePage', 'report-setting');
        this.activePage = 'report-setting';
        this.router.navigate(['report-setting']);
    }


    isActiveForSetting():boolean {
        return ['report-setting', 'risk-metric-levels'].includes(this.activePage);
    }

    riskMetricLevels(): void {
        localStorage.setItem('activePage', 'risk-metric-levels');
        this.activePage = 'risk-metric-levels';
        this.router.navigate(['risk-metric-levels']);
    }

    isActiveForRA():boolean {
        return ['risk-assessments-submitted','risk-assessments-historical','review-risk-assessments','submit-risk-assessments','manage-risk-assessments','risk-appetite-templates','risk-appetite-documents'].includes(this.activePage);
    }

    kriMaster(): void {
        localStorage.setItem('activePage', 'kri-master');
         this.activePage = 'kri-master'
        localStorage.setItem('activeMenu', 'measurement');
        this.router.navigate(['kri-master']);
    }

    kriDefinition(): void {
        localStorage.setItem('activePage', 'kri-definitions');
         this.activePage = 'kri-definitions'
        this.router.navigate(['kri-definitions']);
    }

    kriMesurementMykri(): void {
        localStorage.setItem('activeePage', 'kri-measurement-mykri');
         this.activePage = 'kri-measurement-mykri'
        this.router.navigate(['kri-measurement-mykri']);
    }

    kriMeasurementReview(): void {
        localStorage.setItem('activePage', 'kri-measurement-review');
         this.activePage = 'kri-measurement-review'
        this.router.navigate(['kri-measurement-review']);
    }

    kriScoring(): void {
        localStorage.setItem('activePage', 'kri-measurement-mykri');
         this.activePage = 'kri-measurement-mykri'
        this.router.navigate(['kri-measurement-mykri']);
    }

    kriHistorical(): void {
        localStorage.setItem('activePage', 'kri-historical');
         this.activePage = 'kri-historical'
        this.router.navigate(['kri-historical']);
    }

    kriReporting(): void {
        localStorage.setItem('activePage', 'kri-reporting');
         this.activePage = 'kri-reporting'
        this.router.navigate(['kri-reporting']);
    }
    kriReview(): void {
        localStorage.setItem('activePage', 'kri-review');
         this.activePage = 'kri-review'
        this.router.navigate(['kri-review']);
    }

    kriHistoricalReporting(): void {
        localStorage.setItem('activePage', 'kri-historical-reporting');
         this.activePage = 'kri-historical-reporting'
        this.router.navigate(['kri-historical-reporting']);
    }

    isActiveForKRI():boolean {
        return ['kri-master','kri-historical-reporting', 'kri-review','kri-historical','kri-measurement-mykri','kri-measurement-review','kri-measurement-mykri','kri-definitions','kri-master','kri-reporting'].includes(this.activePage);
    }

    incidentMaster(): void {
        localStorage.setItem('activePage', 'incident-maste');
         this.activePage = 'incident-maste'
        this.router.navigate(['incident-master']);
    }

    incidentList(): void {
        localStorage.setItem('activePage', 'incident-list');
         this.activePage = 'incident-list'
        this.router.navigate(['incident-list']);
    }


    isActiveForIncident():boolean {
        return ['incident-list', 'incident-maste'].includes(this.activePage);
    }

    manageInherentRisk(): void {
        localStorage.setItem('activePage', 'master-inherent-risk');
        this.activePage = 'master-inherent-risk'
        this.router.navigate(['master-inherent-risk']);
    }

    // start RCSA Master method
    manageMasterRCSA(): void {
        localStorage.setItem('activePage', 'master-Rcsa');
        this.activePage = 'master-Rcsa'
        this.router.navigate(['master-rcsa']);
    }
    // end

    manageControlEnvironment(): void {
        localStorage.setItem('activePage', 'master-control-environment');
        this.activePage = 'master-control-environment'
        this.router.navigate(['master-control-environment']);
    }

    manageResidualRisk(): void {
        localStorage.setItem('activePage', 'master-residual-risk-rating');
        this.activePage = 'master-residual-risk-rating'
        this.router.navigate(['master-residual-risk-rating']);
    }
    inherentRisk(): void {
        console.log('inherent');
        localStorage.setItem('activePage', 'inherent-risk');
        this.activePage = 'inherent-risk';
        this.router.navigate(['inherent-risk']);
    }
    scheduleAssessments(): void {
        localStorage.setItem('activePage', 'schedule-assessments');
        this.activePage = 'schedule-assessments'
        this.router.navigate(['schedule-assessments']);
        localStorage.setItem('selectedYear', 'undefined');
    }

    isActiveForRcsa(): boolean {
        return ['master-Rcsa', 'master-inherent-risk', 'master-control-environment','master-residual-risk-rating','inherent-risk','schedule-assessments','self-assessments'].includes(this.activePage);
    }



    selfAssessments(): void {
        localStorage.setItem('activePage', 'self-assessments');
        this.activePage = 'self-assessments';
        this.router.navigate(['self-assessments']);
    }
    home(): void {
        console.log('home');
        this.router.navigate(['']);
    }
    dashboard(): void {
        console.log('dashboard');
        localStorage.setItem('activePage', 'dashboard');
        this.activePage = 'dashboard'
        console.log('this.activePage: ', this.activePage);
        this.router.navigate(['dashboard-overall']);
    }
    reports(): void {
        localStorage.setItem('activePage', 'reports');
        this.activePage = 'reports'
        this.router.navigate(['reports']);
    }

    newNotifications(count: any) {

        if (count > 0) return 'assets/icons/icon-bell-notifications-active.svg';
        else return 'assets/icons/icon-bell-notifications-none.svg';
    }

    logout(): void {
        const confirm = this.dialog.open(ConfirmDialogComponent, {
            id: 'ConfirmDialogComponent',
            disableClose: true,
            minWidth: '300px',
            panelClass: 'dark',
            data: {
                title: 'Confirm Logout',
                content: 'Are you sure you want to logout?',
            },
        });

        confirm.afterClosed().subscribe((result) => {
            if (result) {
                this.logoutyes();
            }
        });
    }

    logoutyes(): void {
        this.openWait();
        this.authService.logout().subscribe({
            next: this.getLogout.bind(this),
            error: this.handleError.bind(this),
        });
    }

    // getLogout(response: any) {
    //     if (response.success) {
    //         //localStorage.setItem('showmenu', 'true');
    //         this.document.location.href = environment.hostUrl;
    //         // this.router.navigate(['']);
    //     }
    // }
    getLogout(response: any) {
        localStorage.clear();
        this.document.location.href = environment.hostUrl;
    }

    private handleError<T>(operation = 'operation', result?: any) {
        return (error: any): Observable<any> => {
            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead

            // Let the app keep running by returning an empty result.
            return from(result);
        };
    }

    reloadCurrentRoute() {
        console.log('reload');
        const currentUrl = this.router.url;
        this.router
            .navigateByUrl('/', { skipLocationChange: true })
            .then(() => {
                this.router.navigate([currentUrl]);
            });
    }

    openWait(): void {
        this.wait = this.dialog.open(WaitComponent, {
            id: 'WaitComponent',
            disableClose: true,
            panelClass: 'dark',
            data: {
                text: 'Logging Out ...',
            },
        });
    }

    closeWait(): void {
        this.wait.close();
    }

    openBellIcon(value: boolean) {
        this.triggerNotificationService = value;
    }

    setValue(value: boolean, menuTrigger: MatMenuTrigger) {
        this.triggerNotificationService = value;
        if (value == false) {
            menuTrigger.closeMenu();
        }
    }

    getNotificationData(): void {
        if (!this.isRiskManagementUnit) {  //       && (this.activePage != 'dashboard' || this.activePage != 'dashboard-overall') ) {
            this.notificationService.getInAppNotification().subscribe((res) => {
                if (res.success == 1) {
                    this.headerFlag  = true;
                    let inAppData = [...res.result.INCInApp,...res.result.RAInApp,...res.result.RCSAInApp,...res.result.RAInApp]
                    this.processDetails(inAppData);
                }
            });
        } else if (this.isRiskManagementUnit ) { // && (this.activePage == 'dashboard' || this.activePage == '' || this.activePage == 'dashboard-overall' || this.activePage == 'manage-risk-assessments')){
            this.dashboardService.gotOverallDashboardMaster.subscribe((res) => {
                console.log('res:  '+res)
                if (res){
                    this.headerFlag  = true;
                    let inAppResp = [...this.dashboardService.inAppRCSA,...this.dashboardService.inAppINC,...this.dashboardService.inAppRA,...this.dashboardService.inAppKRI]
                    this.processDetails(inAppResp)
                } else{
                    this.headerFlag  = true;
                    this.unreadItems = localStorage.getItem('Unread-Items')
                    console.log('Unread Items', this.unreadItems)
                }
            });
        }
        else{
            this.notificationService.getInAppNotification().subscribe((res) => {
                if (res.success == 1) {
                    this.headerFlag  = true;
                    console.log('res.success : ' + res.success)
                    let inAppData = [...res.result.INCInApp,...res.result.RAInApp,...res.result.RCSAInApp,...res.result.RAInApp]
                    this.processDetails(inAppData);
                }
            });
        }
    }

    processDetails(merg: any) {
        this.unreadItems = merg.filter((ob: any) => ob.IsRead === false);
        console.log('Count of unread items: ' + this.unreadItems.length);
        this.unreadItems = this.unreadItems.length;
        localStorage.setItem('Unread-Items', this.unreadItems)
    }

    navigateToLanding() {
        this.document.location.href = environment.hostUrl + "/landing";
    }

    riskRegister() {
        localStorage.setItem('activePage', 'risk-register');
        this.activePage = 'risk-register';
        this.router.navigate(['risk-register',{ ScheduleAssessmentID : 0 }]);

        // let id = this.configScoreRatingService.scheduleAssessmentIDS;
        // if(Number(id) > 0) {
        // this.configScoreRatingService.scheduleAssessmentIDS = 0
        //     // localStorage.removeItem("scheduleAssessmentID");
        //     // localStorage.setItem("scheduleAssessmentID", "0")
        //     this.router.navigate([], {
        //         relativeTo: this.activatedRoute,
        //         queryParams: { ScheduleAssessmentID: 0 },
        //         queryParamsHandling: 'merge'
        //     });
            // this.document.location.reload()
        // }


    }

    
  logoutUser(event: MouseEvent): void {
    event.stopPropagation(); // Prevent click from propagating to the document

    this.logoutflag = !this.logoutflag;
  }

  // Close the dropdown if clicked outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.logoutflag && !this.dropdownMenu?.nativeElement.contains(event.target)) {
      this.logoutflag = false;
    }
  }

}
