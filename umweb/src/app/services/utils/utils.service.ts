import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})

export class UtilsService {
    constructor(private dialog:MatDialog) { }

    formatDate(date: string): string { //2022-11-19T18:30:00.000Z
        let arr = date.split('T')[0].split('-')
        let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        return arr.length == 3 ? arr[2] + '-' + months[Number(arr[1]) - 1] + '-' + arr[0] : '00-Xxx-0000'
    }

    getZoneColor(score: number): string {
        let color = "#4468AA"
        if (score < 3) color = "#FF0000"
        if (score > 4) color = "#00FF00"
        return color
    }

    ignoreTimeZone(date: any): string {
        let d: Date = new Date(date)
        return new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes() - d.getTimezoneOffset()).toISOString();
    }

    relogin(documnet:any): void {
        const timeout = 3000; // 3 Seconds
        const info = this.dialog.open(InfoComponent, {
            disableClose: true,
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
}
