import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from '../utilities/popups/confirm/confirm-dialog.component';
import { environment } from 'src/environments/environment';
import { Observable, from } from 'rxjs';
import { WaitComponent } from '../utilities/popups/wait/wait.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DOCUMENT, Location } from '@angular/common';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { InfoComponent } from '../utilities/popups/info/info.component';
import { ApiConstantsService } from 'src/app/services/api-constants/api-constants.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { NotificationService } from 'src/app/services/notification/notification.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {

  API_URL_DEV = environment.devConfig
  makeTabActive: any;
  userName: any;
  wait: any;
  all_pages: any[] = [];
  pagetitleData: any;
  pageID: any;
  popUpTitle: any;
  saveButton: any;
  cancelButton: any;
  HeaderButtonTitle: any;
  mergeredHeaders: any[] = [];
  unreadItems: any;
  staticHeaders: any[] = [
    { "routeLink": "master-data/site", "PageID": "", "DisplayName": "Site" },
    { "routeLink": "master-data/business-functions", "PageID": "", "DisplayName": "Business Functions" },
    { "routeLink": "master-data/business-sevices", "PageID": "", "DisplayName": "Business Services & Apps" },
    { "routeLink": "master-data/vendors", "PageID": "", "DisplayName": "Vendors" },
    // { "routeLink": "master-data/metrics-library", "PageID": "", "DisplayName": "Metrics Library" },        // Commented as it is not in use (Compliance Reviews Master Page)
    { "routeLink": "master-data/threat-library", "PageID": "", "DisplayName": "Threat Library" },
    { "routeLink": "master-data/crisis", "PageID": "", "DisplayName": "Crisis Comms Templates" },
    { "routeLink": "master-data/steering-committee", "PageID": "", "DisplayName": "Steering Committee" },
    { "routeLink": "master-data/OverallRiskScore", "PageID": "", "DisplayName": "BCP- Overall Risk Rating" }]
  filteredHeaders: any;
  mergersedHeaders: any;
  searchTerm: any;
  selectedContinuitytab: any;
  pagetitleData1: any;
  isFunctionalAdmin : boolean = false;
  formattedHeaders: any[] = []
  isSCUserNBCMUnitUser : boolean = false;
  error:any
  isBCMFA:any;
  triggerNotificationService: boolean = false;
  headerFlag: boolean = false;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    public utils: UtilsService,
    private location : Location,
    public authService: AuthService,
    private apiConstant: ApiConstantsService,
    public service: NotificationService,
    @Inject(DOCUMENT) private document: any,
  ) {
  }

  ngOnInit(): void {
    if(this.utils.isSCUserNBCMUnitUser()) {
      this.isSCUserNBCMUnitUser = true;
    } else {
      this.isSCUserNBCMUnitUser = false;
    }

    if(this.location.path() == ''){
      if(this.utils.isSCUserNBCMUnitUser()){
        this.router.navigate(['/dashboard']);

      }else{
        this.router.navigate(['/business-impact-analysis']);
      }
    }

    this.authService.activeTab.subscribe((x: any) => {
      this.makeTabActive = x;
    });
    console.log('this.selectedContinuitytabewew: ', this.selectedContinuitytab);

    this.authService.activeSubTab$.subscribe((x: any) => {
      this.selectedContinuitytab = x;
    console.log('this.selectedContinuitytab: ', this.selectedContinuitytab);

    });


    setTimeout(()=> {
      this.getNotificationData();
    },2000);


    this.isBCMFA= this.utils.isBCMFAUser();

    this.isFunctionalAdmin = this.utils.isFunctionalAdmin();

    this.userName = localStorage.getItem('username') || "";
  }

  onclickMaster() {
    this.formattedHeaders = [];
    this.searchTerm = ''
    this.apiConstant.getWebPageConfiguration1().subscribe((response) => {
      this.all_pages = response.data;
      this.apiConstant.gotConfigMaster.subscribe((value) => {
        if (value) {
          this.all_pages = response.data;
        }
        if (response.error != null) {
          if (response.error.errorCode && response.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this.document);
          else
            this.error = response.error.errorMessage;
        };
      });
      this.mergeredHeaders = [...this.staticHeaders]
      this.all_pages.forEach((ob: any) => {
        this.mergeredHeaders.push(ob)
      })

      const partSize = Math.ceil(this.mergeredHeaders.length / 6);
      for (let i = 0; i < this.mergeredHeaders.length; i += partSize) {
          this.formattedHeaders.push(this.mergeredHeaders.slice(i, i + partSize));
      }
    });
  }

  filterItems() {
    this.mergeredHeaders = this.mergeredHeaders.filter(
      (item: any) => item.PageTitle.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    if (this.searchTerm == "") {
      this.mergeredHeaders = [...this.staticHeaders]
      if (this.all_pages.length) {
        this.all_pages.forEach((ob: any) => {
          this.mergeredHeaders.push(ob)
        })
      }
      this.searchTerm = "";
    }
  }

  navigateToLanding() {
    this.document.location.href = environment.hostUrl + "/landing";
  }

  logout(): void {
    const confirm = this.dialog.open(ConfirmDialogComponent, {
      id: "ConfirmDialogComponent",
      disableClose: true,
      minWidth: "300px",
      panelClass: "dark",
      data: {
        title: "Confirm Logout",
        content: "Are you sure you want to logout?"
      }
    });

    confirm.afterClosed().subscribe(result => {
      if (result) {
        this.logoutyes()
      }
    });
  }

  logoutyes(): void {
    this.openWait()
    this.authService.logout()
      .subscribe({
        next: this.getLogout.bind(this),
        error: this.handleError.bind(this)
      });
  }

  getLogout(response: any) {
    if (response.success == 1) {
      localStorage.clear();
      this.document.location.href = environment.hostUrl;
    } else {
      if (response.error.errorCode && response.error.errorCode == "TOKEN_EXPIRED")
        this.utils.relogin(this.document);
      else
        this.popupInfo("Unsuccessful", response.error.errorMessage)
    }
  }

  private handleError<T>(operation = 'operation', result?: any) {
    return (error: any): Observable<any> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return from(result);
    };
  }

  openWait(): void {
    this.wait = this.dialog.open(WaitComponent, {
      id: "WaitComponent",
      disableClose: true,
      panelClass: "dark",
      data: {
        text: "Logging Out ..."
      }
    })
  }

  closeWait(): void {
    this.wait.close()
  }

  popupInfo(title: string, message: string) {
    const timeout = 3000; // 3 seconds
    const confirm = this.dialog.open(InfoComponent, {
      disableClose: true,
      minWidth: "300px",
      panelClass: "dark",
      data: {
        title: title,
        content: message
      }
    });
  }

  handleButtonClick(data: any): void {
    this.searchTerm = '';
    this.pagetitleData = data.PageTitle;
    this.pageID = data.PageID
    this.popUpTitle = data.PopUpTitle
    this.saveButton = data.SaveButtonTitle
    this.cancelButton = data.CancelButtonTitle
    this.HeaderButtonTitle = data.HeaderButtonTitle

    localStorage.setItem('pagetitleData', JSON.stringify(this.pagetitleData));
    localStorage.setItem('HeaderButtonTitle', JSON.stringify(this.HeaderButtonTitle));
    localStorage.setItem('pageID', JSON.stringify(this.pageID));
    localStorage.setItem('popUpTitle', JSON.stringify(this.popUpTitle));
    localStorage.setItem('saveButton', JSON.stringify(this.saveButton));
    localStorage.setItem('cancelButton', JSON.stringify(this.cancelButton));

    setTimeout(() => {
      this.getAllData();
    }, 2000)
  }

  getAllData() {
    this.pagetitleData1 = JSON.parse(localStorage.getItem('pagetitleData') ?? '[]')

    this.apiConstant.getPageDetails(this.pagetitleData1)
    this.apiConstant.gotMaster.subscribe((value) => {
      if (value) {
        // this.all_pages = this.apiConstant.master.procResponseData;
      }
    });
  }

  setcontinuityTab(tab: any) {
    console.log('tab: ', tab);
    this.authService.activeSubTab$.next(tab);
  }

  newNotifications(count: any) {
    if (count > 0) return 'assets/images/icon-bell-notifications-active.svg';
    else return 'assets/images/icon-bell-notifications-none.svg';
  }

  openBellIcon(value: boolean) {
    this.triggerNotificationService = true;
    console.log('this.triggerNotificationService : ', this.triggerNotificationService );
  }

  setValue(value: boolean, menuTrigger: MatMenuTrigger) {
    this.triggerNotificationService = value;
    if (value == false) {
        menuTrigger.closeMenu();
    }
  }

  onMenuClosed() {
    this.triggerNotificationService = false;
  }

  getNotificationData(): void {
    this.service.getInAppNotification().subscribe((res) => {
        if (res.success == 1) {
            this.headerFlag  = true;
            let inAppData = [...res.result.SRAInAppData,...res.result.RMTInAppData,...res.result.CrisisInAppData,...res.result.BCPInAppData,...res.result.BCMSInAppData]
            this.processDetails(inAppData);
        }
    });
  }

  processDetails(merg: any) {
    this.unreadItems = merg.filter((ob: any) => ob.IsRead === false);
    this.unreadItems = this.unreadItems.length;
}

}
