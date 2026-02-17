import { Injectable, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DOCUMENT } from '@angular/common';
import { UtilsService } from '../utils/utils.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { RestService } from 'src/app/services/rest/rest.service';

@Injectable({
    providedIn: 'root'
})
export class NotificationsService extends RestService {

    public userAlertsData: any;
    public notificationsdata: any;
    public isNewNotificationView: boolean = false;
    public searchTermVal: any;
    public totalUnreadCount = 0;
    public totalCount = 0;
    public closeExpansion: boolean = false;
    public inAppUserNotificationData: any;

    constructor(
        private utils: UtilsService,
        private _dialog: MatDialog,
        private _http: HttpClient,
        @Inject(DOCUMENT) private _document: any) {
        super(_http, _dialog)
    }

    getNotifications(): void {
        if (environment.dummyData) {
            this.processNotifications({
                    "success": 1,
                    "message": "Data fetch from DB successful.",
                    "result": {
                        "UserAlerts": [
                            {
                                "AlertID": 1,
                                "AlertDate" : "2022-07-20T13:23:28.490Z",
                                "ToUserGUID" : "150067",
                                "InAppMessage": "Assessment Test Pre-Closure Completed   For Full scope Alinma Bank and Alinma Bank-Full Scope-2023-15",
                                "IsRead": false,
                                "IsInAppNotification": true,
                                "TotalCount": 2,
                                "UnReadCount" : 0
                            },
                            {
                                "AlertID": 1,
                                "AlertDate" : "2022-07-20T13:23:28.490Z",
                                "ToUserGUID" : "150067",
                                "InAppMessage": "Assessment Test Pre-Closure Completed   For Full scope Alinma Bank and Alinma Bank-Full Scope-2023-15",
                                "IsRead": false,
                                "IsInAppNotification": true,
                                "TotalCount": 2,
                                "UnReadCount" : 0
                            }
                        ]
                    },
                    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1",
                    "error": {
                        "errorCode": null,
                        "errorMessage": null
                    }
                });
        } else {
            let data = { "userGUID": localStorage.getItem("userguid") }
            // let data = { "userGUID": "AD88C7AD-5A8B-ED11-AEE5-000C296CF4F3" }
            this.post("/operational-risk-management/inApp-notification/get-user-alerts", { "data": data }).subscribe((res: any) => {
                next:
                if (res.success == 1) {
                    this.processNotifications(res)
                } else {
                    if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
                        this.utils.relogin(this._document);
                    else
                        this.popupInfo("Unsuccessful", res.error.errorMessage)
                }
            });
        }
    }

    processNotifications(response: any) {
        this.inAppUserNotificationData = response.result;
        // this.userAlertsData = response.result.UserAlerts;
        // this.notificationsdata = [...this.userAlertsData]
        // this.notificationsdata = response.result;
        console.log("data in servoce", this.inAppUserNotificationData);
        this.makeNotifications()
    }

    isUnreadNotifcation(notiItem: any) {
        let data = { "userAlertID": notiItem.AlertID, "isRead": !notiItem.IsRead }
        this.post("/operational-risk-management/inApp-notification/update-user-alerts", { "data": data }).subscribe((res: any) => {
            next:
            if (res.success == 1) {
                this.getNotifications();
            } else {
                if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
                    this.utils.relogin(this._document);
                else
                    this.popupInfo("Unsuccessful", res.error.errorMessage)
            }
        })
    }

    deleteNotification(notiItem: any) {
        let data = {"userAlertID" : notiItem.AlertID}
        this.post("/operational-risk-management/inApp-notification/delete-user-alerts", { "data": data }).subscribe((res: any) => {
            next:
            if (res.success == 1) {
                this.getNotifications();
            } else {
                if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
                    this.utils.relogin(this._document);
                else
                    this.popupInfo("Unsuccessful", res.error.errorMessage)
            }
        })
    }

    applyFilterNotification(event: Event) {
        this.notificationsdata = JSON.parse(JSON.stringify(this.userAlertsData));
        const filterValue = (event.target as HTMLInputElement).value;
        this.searchTermVal = filterValue.trim().toLowerCase();
        this.makeNotifications();
    }

    fnfilterTemplatesbySearchTerm(data: any) {
        if (data && data.length > 0) {
            if (!this.searchTermVal || this.searchTermVal.trim() === '') {
                return [...data];
            } else {
                return [...data.filter((x: any) =>
                    JSON.stringify(x).trim().toLowerCase().includes(this.searchTermVal.trim().toLowerCase())
                )];
            }
        } else {
            return [];
        }
    }

    updateNotificationCount() {
        let unreadobjs = this.notificationsdata.filter((ele: any) => !ele.IsRead);
        this.totalUnreadCount = 0;
        this.totalCount = 0;
        this.totalUnreadCount += unreadobjs.length;
        this.totalCount += this.notificationsdata.length;
    }

    onUnread() {
        this.notificationsdata = JSON.parse(JSON.stringify(this.userAlertsData));
        this.isNewNotificationView = !this.isNewNotificationView;
        this.makeNotifications();
    }

    makeNotifications() {
        this.closeExpansion = true
        let cloneNotificationData = JSON.parse(JSON.stringify(this.notificationsdata));
        if (this.isNewNotificationView) {
            this.notificationsdata = this.fnfilterTemplatesbySearchTerm(cloneNotificationData.filter((ele: any) => !ele.IsRead));
        } else {
            this.notificationsdata = this.fnfilterTemplatesbySearchTerm(cloneNotificationData);
        }
        this.updateNotificationCount();
    }

    popupInfo(title: string, message: string) {
        const timeout = 3000; // 3 seconds
        const confirm = this._dialog.open(InfoComponent, {
            id: "InfoComponent",
            disableClose: true,
            minWidth: "300px",
            panelClass: "dark",
            data: {
                title: title,
                content: message
            }
        });

        confirm.afterOpened().subscribe(result => {
            setTimeout(() => {
                confirm.close();
                this.dialog.closeAll()
                // this.router.navigate(['']);
            }, timeout)
        });
    }

    getInAppNotification () {
        let data = { "userGUID": localStorage.getItem("userguid") }
        return this.post("/operational-risk-management/inApp-notification/get-user-alerts", { "data": data });
    }

    updateInAppNotification(alertId: any) {
        let data = {
            "userAlertID": alertId,
            "isRead": true
        }
        return this.post("/operational-risk-management/inApp-notification/update-user-alerts", {"data": data});
    }
}
