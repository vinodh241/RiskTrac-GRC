import { Component, Input, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { NotificationsService } from 'src/app/services/notifications/notifications.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { DOCUMENT } from '@angular/common';
import { NavigationStart, Router } from '@angular/router';

@Component({
    selector: 'app-notifications',
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

    // @Output() triggerNotificationService: boolean = false;
    @Output() triggerNotificationService: EventEmitter<any> = new EventEmitter();

    rcsaNotificationDetails: any[] = [];
    indcidentNotificationDetails: any[] = [];
    kriNotificationDetails: any[] = [];
    raNotificationDetails: any[] = [];
    link: any;

    constructor(
        public service: NotificationsService,
        public utils: UtilsService, 
        private router: Router,
        @Inject(DOCUMENT) private _document: any,
    ) { 
    }

    processDetails(data: any) {
        if(data.RCSAInApp) {
            this.rcsaNotificationDetails = [];
            data.RCSAInApp.forEach((element: any) => {
                if(element.IsRead == false) {
                    this.rcsaNotificationDetails.push(element)
                }
            });
        }
        if(data.INCInApp) {
            this.indcidentNotificationDetails = [];
            data.INCInApp.forEach((element: any) => {
                if(element.IsRead == false) {
                    this.indcidentNotificationDetails.push(element)
                }
            });
        }
        if(data.KRIInApp) {
            this.kriNotificationDetails = [];
            data.KRIInApp.forEach((element: any) => {
                if(element.IsRead == false) {
                    this.kriNotificationDetails.push(element)
                }
            });
        }
        if(data.RAInApp) {
            this.raNotificationDetails = [];
            data.RAInApp.forEach((element: any) => {
                if(element.IsRead == false) {
                    this.raNotificationDetails.push(element)
                }
            });
        }
    }

    sendAlertId(alertId: string, link: string) {
        this.service.updateInAppNotification(alertId).subscribe(res => {
            next: {
                if(res.success == 1) {
                    localStorage.setItem("activePage", link);
                    switch(link) {
                        case "review-risk-assessments":
                            localStorage.setItem("risk-assessments", "review");
                            break;
                        case "submit-risk-assessments":
                            localStorage.setItem("risk-assessments", "submit");
                            break;
                        case "risk-assessments-submitted":
                            localStorage.setItem("AssessmentFilter", "View Submitted");
                            break;
                        default:
                            console.log('no active pages  link : ' +link)
                    }
                            
                    this.router.navigateByUrl(link);
                    this.triggerNotificationService.emit(false);
                }
            }
        })
    }


    getNotificationData(): void {
        this.service.getInAppNotification().subscribe(res => {
            next: {
                if (res.success == 1) {
                    this.processDetails(res.result);
                } else {
                    if (res.error.errorCode == "TOKEN_EXPIRED")
                            this.utils.relogin(this._document);
                }
            }

        });
    }

    ngOnInit(): void {
        this.getNotificationData();
    }
}
