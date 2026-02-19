import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { environment } from 'src/environments/environment';
import { RestService } from '../rest/rest.service';

@Injectable({
  providedIn: 'root'
})

export class UtilsService {
  constructor(private dialog: MatDialog, private rest: RestService) { }

  userUnits = JSON.parse(localStorage.getItem('userUnitData') ||'[]')
  steeringCommiteeUsers = JSON.parse(localStorage.getItem('bcmStreeringCommittee') || '[]');
  roleORM   = localStorage.getItem('rbcm') || "XX"

  formatDate(date: string, showTime:boolean = false): string { //2022-11-19T18:30:00.000Z
    if(date) {
        let ar:any[] = date.toString().split('T')
        let dt:any[] = []
        let t = ""

        if(ar.length > 0)
            dt = ar[0].split('-')
        if(ar.length > 1)
            t = ar[1].split('.')[0]

        let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        let d = dt.length == 3 ? dt[2] + '-' + months[Number(dt[1]) - 1] + '-' + dt[0] : 'DD-MMM-YYYY'

        return showTime?d + " " + t: d
    } else
        return ""
}

  ignoreTimeZoneFormat(date: any): string {
    let d: Date = new Date(date)
    return new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes() - d.getTimezoneOffset()).toISOString();
  }

  ignoreTimeZone(date: any): string {
    let d: Date = new Date(date)
    return new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes() - d.getTimezoneOffset()).toISOString();
  }

  //to remove +5:30 and format the date like - "2023-08-21T00:00:00.000Z"
  formatTimeZone(dateval: any) {
    let date = null;
    if (dateval instanceof Date) {
      const d = dateval.getDate();
      let dd = '';
      if (d < 10) {
        dd = '0' + d;
      } else {
        dd = '' + d;
      }
      let m = dateval.getMonth() + 1;
      let mm = '';
      if (m < 10) {
        mm = '0' + m;
      } else {
        mm = '' + m;
      }
      const y = dateval.getFullYear();
      const Timeval = "00:00:00.000Z"
      let val = y + '-' + mm + '-' + dd + 'T' + Timeval;
      date = new Date(val);
    } else if (typeof dateval === 'string' || dateval instanceof String) {
      const dateval2 = dateval.split('T')[0];
      const Timeval = "00:00:00.000Z"
      date = new Date(dateval2 + 'T' + Timeval);
    } else {
      return null;
    }
    return date.toISOString();
  }

  relogin(documnet: any): void {
    const timeout = 3000; // 3 Seconds
    const info = this.dialog.open(InfoComponent, {
      disableClose: true,
      id: 'InfoComponent',
      minWidth: "300px",
      panelClass: "error",
      data: {
        title: "Error",
        content: "Session has expired, please re-login."
      }
    });

    info.afterOpened().subscribe(result => {
      setTimeout(() => {
        info.close();
        document.location.href = environment.hostUrl;
      }, timeout)
    });
  }

  isBCMUnit():boolean{
    let data=this.userUnits.find((x:any) => x.Abbreviation === "BC");
    return (data!=undefined);
  }

  isFunctionalAdmin(): boolean {
    return ["FA"].includes(this.roleORM)
  }

  isBCMFAUser (): boolean {
    return (this.isFunctionalAdmin() && this.isBCMUnit())
  }

  isSCUserNBCMUnitUser () :boolean {
    return (this.userUnits.some((x: any) => x.UnitName.includes('BCM')) || this.steeringCommiteeUsers.some((x: any) => x.UserGUID == localStorage.getItem('userguid')))
  }
}
