import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BusinessFunctionPopupComponent } from './business-function-popup/business-function-popup/business-function-popup.component';
import { MasterBusinessFunctionService } from 'src/app/services/master-data/master-business-function/master-business-function.service';
import { MatTableDataSource } from '@angular/material/table';
import { addIndex, searchBy } from 'src/app/includes/utilities/commonFunctions';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { Router } from '@angular/router';

export interface bussFunListing {
  Index: number;
  ShortCode: string;
  Name: string;
  BusinessGroup: string;
  SiteNameCSV: string;
  FBCC_Name: string;
  HeadCount: string;
}

@Component({
  selector: 'app-business-functions',
  templateUrl: './business-functions.component.html',
  styleUrls: ['./business-functions.component.scss']
})

export class BusinessFunctionsComponent implements OnInit {

  displayedColumns: string[] = ['Position', 'ShortCode', 'Name', 'BusinessGroup', 'Site(s)', 'FBCC', 'HeadCount', 'Action'];
  businessFunData = new MatTableDataSource<bussFunListing>;
  bussFbccList: any;
  bussGroupList: any
  siteUniqueArray: any

  constructor(
    public dialog: MatDialog,
    public service: MasterBusinessFunctionService,
    public authService: AuthService,
    public utils: UtilsService,
    private router: Router) {
    if (this.utils.isSCUserNBCMUnitUser()) {
      this.authService.activeTab.next('master-data');
      this.service.getBusinessFunMaster();
    } else {
      this.router.navigate(['/business-continuity-plan'])
    }
  }

  ngOnInit(): void {
    // this.service.getBusinessFunMaster();
    this.service.businessFunSubj.subscribe((value) => {
      if (value) {
        this.businessFunData = new MatTableDataSource(addIndex(this.service.masterBusinessFun.businessFunctionList, false));
      }
    })
  }

  addEditBusiness(Mod?: any, bussFun?: any) {
    const dialog = this.dialog.open(BusinessFunctionPopupComponent, {
      disableClose: true,
      maxWidth: '50vw',
      panelClass: ['bussfun', 'full-screen-modal'],
      data: {
        mod: Mod,
        selectedBussFun: bussFun,
        allBussFun: this.service.masterBusinessFun['businessFunctionList']
      },
    });
    dialog.afterClosed().subscribe((result) => {
      this.service.getBusinessFunMaster();
     });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    const searchFields: any = ['ShortCode', 'Name', 'BusinessGroup', 'SiteNameCSV', 'FBCC_Name', 'HeadCount'];
    this.businessFunData = addIndex(JSON.parse(JSON.stringify(searchBy(filterValue, searchFields, this.service.masterBusinessFun['businessFunctionList']))), false)
  }

}
