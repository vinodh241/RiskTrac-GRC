import { Inject, Injectable } from '@angular/core';
import { RestService } from '../rest/rest.service';
import { UtilsService } from '../utils/utils.service';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class NotificationService extends RestService  {


  constructor(
    private utils: UtilsService,
    private _dialog: MatDialog,
    private _http: HttpClient,
    @Inject(DOCUMENT) private _document: any) {
    super(_http, _dialog)
}


  getInAppNotification () {
    let data = { "userGUID": localStorage.getItem("userguid") }
    return this.post("/business-continuity-management/inApp-notification/get-user-alerts", { "data": data });
  }

  updateInAppNotification(alertId: any) {
    let data = {
        "userAlertID": alertId,
        "isRead": true
    }
    return this.post("/business-continuity-management/inApp-notification/update-user-alerts", {"data": data});
  }
}

