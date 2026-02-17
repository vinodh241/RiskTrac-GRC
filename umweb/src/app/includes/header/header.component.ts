import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { from, Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { environment } from 'src/environments/environment';
import { ConfirmDialogComponent } from '../utilities/popups/confirm/confirm-dialog.component';
import { WaitComponent } from '../utilities/popups/wait/wait.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    // @ts-ignore
    wait;
    userName: any;
    @ViewChild('dropdownMenu') dropdownMenu: ElementRef | undefined;
    logoutflag:boolean = false;
    constructor(
        private authService: AuthService, 
        private formBuilder: FormBuilder, 
        private router: Router,
        public dialog: MatDialog,
        private translate: TranslateService,
        @Inject(DOCUMENT) private document: any) { }

    ngOnInit(): void {
        this.userName = localStorage.getItem('username') || "";
    }

    logout(): void {
        const confirm = this.dialog.open(ConfirmDialogComponent, {
            disableClose: true,
            minWidth: "300px",
            panelClass: "dark",
            data: {
                title: this.translate.instant('header.confirmLogout.title'),
                content: this.translate.instant('header.confirmLogout.content')
            }
        });

        confirm.afterClosed().subscribe(result => {
            if (result) {
                this.logoutflag = false
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
        if (response.success) {
            //localStorage.setItem('showmenu', 'true');
            this.document.location.href = environment.hostUrl;
            // this.router.navigate(['']);
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
            disableClose: true,
            panelClass: "dark",
            data: {
                text: this.translate.instant('header.loggingOut')
            }
        })
    }

    closeWait(): void {
        this.wait.close()
    }


  navigateToLanding() {
    this.document.location.href = environment.hostUrl + "/landing";
  }

  logoutUser(event: MouseEvent): void {
    this.logoutflag = !this.logoutflag;
    event.stopPropagation(); // Prevent click from propagating to the document
  }

  // Close the dropdown if clicked outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.logoutflag && !this.dropdownMenu?.nativeElement.contains(event.target)) {
      this.logoutflag = false;
    }
  }
}
