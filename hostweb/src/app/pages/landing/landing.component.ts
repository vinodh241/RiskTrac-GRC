import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { WaitComponent } from 'src/app/includes/utilities/popups/wait/wait.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  mods: any[] = [];
  year:any

  // @ts-ignore
  wait;
  modsList:any[]=[]
  ormmods:any;
  dmsmods:any;
  bcmmods:any;
  ummods:any;
  tptracmods:any

  constructor(
    private router: Router,
    private _dialog: MatDialog,
    @Inject(DOCUMENT) private document: any
  ) { }

  ngOnInit(): void {
    let mods = localStorage.getItem("mods") || ""
    this.mods = mods?.split(",")
    this.ormmods = localStorage.getItem("orm")
    this.dmsmods= localStorage.getItem("dms")
    this.bcmmods= localStorage.getItem("bcm")
    this.tptracmods= localStorage.getItem("tptrac")
    this.ummods= localStorage.getItem("um")

    // console.log('[JSON.parse(JSON.stringify(localStorage.getItem("modulesList")))]: ', [JSON.parse(JSON.stringify(localStorage.getItem("modulesList")))]);
    console.log('this.modsList[4].ModuleName: ', (this.modsList));


    this.year = new Date().getFullYear()
    // if (this.mods.length == 1) {
    //   this.openWait()
    // }
  }

  navigateUserManagement(): void {
    //this.router.navigate(['user-management']);
    this.document.location.href = environment.userManagementUrl + "/";
  }

  navigateORM(): void {
    localStorage.setItem("AssessmentFilter", "Submitted");
    this.document.location.href = environment.ormUrl + "/";
  }

  navigateBCM(): void {
    this.document.location.href = environment.bcmUrl + "/";
  }

  navigateDM(): void {
    this.document.location.href = environment.dmsUrl + "/";
  }

  navigateTPP(): void {
    this.document.location.href = environment.tppUrl + "/";
  }

  openWait(): void {
    this.wait = this._dialog.open(WaitComponent, {
      disableClose: true,
      panelClass: "dark",
      data: {
        text: "Redirecting ..."
      }
    })

    this.wait.afterOpened().subscribe((result: any) => {
      setTimeout(() => {
        this.wait.close();
        switch (this.mods[0]) {
          case 'ORM':
            this.navigateORM()
            break
          case 'UM':
            this.navigateUserManagement()
            break
          case 'BCM':
            this.navigateBCM()
            break
        }
      }, 1000)
    });
  }

  closeWait(): void {
    this.wait.close()
  }
  
}
