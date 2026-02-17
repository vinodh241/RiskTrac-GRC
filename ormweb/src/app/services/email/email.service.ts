import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { RestService } from '../rest/rest.service';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
@Injectable({
  providedIn: 'root'
})
export class EmailService extends RestService {

  constructor(
    private _http: HttpClient,
    private _dialog: MatDialog,) {
    super(_http, _dialog);
  }

  triggerEmail(userid: any, data: any) {
    let req = {
      userId: userid,
      data: data
    }
    this.post('/operational-risk-management/risk-appetite/generate-email', req).subscribe(res => {
      console.log(res);
      if (res.success == 1) {
        this.popupInfo("Success", res.message)
      }
    });
  }

  popupInfo(title: string, message: string) {
    const timeout = 3000; // 3 seconds
    const confirm = this.dialog.open(InfoComponent, {
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
        // this.router.navigate(['']);
      }, timeout)
    });
  }
}
