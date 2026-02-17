import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { catchError, from, map, Observable, tap } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ConfirmDialogComponent } from '../utilities/popups/confirm/confirm-dialog.component';
import { WaitComponent } from '../utilities/popups/wait/wait.component';
import { ChangeUserpasswordComponent } from './change-userpassword/change-userpassword.component';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    // @ts-ignore
    wait;
    userName: any;
    module: any;
    access: any;
    moduleAccess: any;
    bcmAccess:any;
    authentication:any
    accessFlag:boolean = false
  projectLanding: any;
  emailIDLanding: any;

    constructor(
        private authService: AuthService,
        private router: Router,
        public dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.userName = localStorage.getItem('username') || "";
        this.module = localStorage.getItem('modules') || "";
        this.authentication = localStorage.getItem('authenticationModeDetails')
        this.projectLanding = localStorage.getItem('projectLanding') ||"";
        this.emailIDLanding = localStorage.getItem('emailIDLanding') ||"";
        // if(this.module == 'ORM,BCM'){
        //   this.access = "Operational Risk Management";
        //   this.bcmAccess =  "Business Continuity Management "
        //   this.accessFlag = true
        //   this.moduleAccess = "2"
        // }else if(this.module == 'ORM'){
        //   this.access = "Operational Risk Management"
        //   this.accessFlag = false
        //   this.moduleAccess = "1"
        // }else if(this.module == 'BCM'){
        //   this.access = "Business Continuity Management"
        //   this.accessFlag = false
        //   this.moduleAccess = "1"
        // }else if(this.module == 'ORM,UM'){
        //   this.access = "User Management"
        //   this.accessFlag = false
        //   this.moduleAccess = "1"
        // }else if(this.module == 'UM'){
        //   this.access = "User Management"
        //   this.accessFlag = false
        //   this.moduleAccess = "1"
        // }
    }

    logout(): void {
        const confirm = this.dialog.open(ConfirmDialogComponent, {
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
        this.closeWait()
        if (response.success) {
            this.router.navigate(['']);
        } else {
            if(response.error.errorCode && response.error.errorCode == "TOKEN_EXPIRED") {
                this.router.navigate(['']);
            }
        }
        localStorage.clear();
    }

    private handleError<T>(operation = 'operation', result?: any) {
        this.closeWait()
        return (error: any): Observable<any> => {
            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead

            // Let the app keep running by returning an empty result.
            return from(result);
        };
    }

    openWait(): void {
        this.wait = this.dialog.open(WaitComponent, {
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

    changeUserPassword(){
      const confirm = this.dialog.open(ChangeUserpasswordComponent, {
        disableClose: true,
        minWidth: "300px",
        panelClass: "full-screen-modal",
        data: {
            title: "Change Password",
        }
    });

    confirm.afterClosed().subscribe(result => {
        if (result) {
          console.log('result: ', result);
        }
    });
    }
}
