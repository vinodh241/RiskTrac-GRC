import { DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Inject, Output } from '@angular/core';
import { Router } from '@angular/router';
import { image } from 'html2canvas/dist/types/css/types/image';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent {

  inAppData:any;
  SRAInAppData:any;
  BCPInAppData:any;
  BCMSInAppData:any;
  INCInAppData:any;
  CrisisInAppData:any;
  RMTInAppData:any;

  @Output() triggerNotificationService: EventEmitter<any> = new EventEmitter();

  constructor(
    public service: NotificationService,
    public utils: UtilsService,
    private router: Router,
    @Inject(DOCUMENT) private _document: any,
    private cdr: ChangeDetectorRef
) {
}
  ngOnInit(): void {
    console.log("1")
    this.getNotificationData();
  }
  getNotificationData(): void {
    this.service.getInAppNotification().subscribe({
      next: (res) => {
        if (res.success === 1) {
          this.SRAInAppData = res.result.SRAInAppData || [];
          this.BCMSInAppData = res.result.BCMSInAppData || [];
          this.BCPInAppData = res.result.BCPInAppData || [];
          this.CrisisInAppData = res.result.CrisisInAppData || [];
          this.RMTInAppData = res.result.RMTInAppData || [];

          // this.inAppData = [
          //   { title: "SRA", data: this.SRAInAppData, TotalCount: this.SRAInAppData.length, image: './assets/images/ic-sra.svg' },
          //   { title: "Business Continuity Plans", data: this.BCPInAppData, TotalCount: this.BCPInAppData.length, image: './assets/images/ic-bcplan.svg' },
          //   { title: "BCMS Testing", data: this.BCMSInAppData, TotalCount: this.BCMSInAppData.length, image: './assets/images/ic-bcmstesting.svg' },
          //   { title: "Crisis Communication", data: this.CrisisInAppData, TotalCount: this.CrisisInAppData.length, image: './assets/images/ic-crisis.svg' },
          //   { title: "Remediation Tracker", data: this.RMTInAppData, TotalCount: this.RMTInAppData.length, image: './assets/images/ic-tracker.svg' },
          // ];

          // Manually trigger change detection

        } else if (res.error?.errorCode === "TOKEN_EXPIRED") {
          this.utils.relogin(this._document);
        }
      },
      error: (err) => {
        console.error("Error fetching notification data", err);
      }
    });
  }

  sendAlertId(alertId: string, link: string) {
    console.log('link: ', link);
    this.service.updateInAppNotification(alertId).subscribe(res => {
        next: {
            if(res.success == 1) {
              this.triggerNotificationService.emit(false);
                this.router.navigateByUrl('/' + link.trim());

            }
        }
    })
}
}
