import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MasterSiteService } from 'src/app/services/master-data/master-site/master-site.service';
import { AddSiteComponent } from './add-site/add-site.component';
import { ConfirmDialogComponent } from 'src/app/includes/utilities/popups/confirm/confirm-dialog.component';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { addIndex, searchBy } from 'src/app/includes/utilities/commonFunctions'
import { AuthService } from 'src/app/services/auth/auth.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-site',
  templateUrl: './site.component.html',
  styleUrls: ['./site.component.scss'],
})

export class SiteComponent {
  displayedColumns = ['index', 'ShortCode', 'SiteName', 'Country', 'State', 'Location', 'SiteBusinessContinuityChampion', 'SiteAdminHead', 'BusinessFunctions', 'action'];

  constructor(
    public dialog: MatDialog,
    public service: MasterSiteService,
    public authService: AuthService,
    public utils: UtilsService,
    private router: Router) {
    if (this.utils.isSCUserNBCMUnitUser()) {
      this.authService.activeTab.next("master-data");
      this.service.getSiteMaster();
    } else {
      this.router.navigate(['/business-continuity-plan']);
    }
  }

  openSite(Mode?: any, siteData?: any) {
    const dialog = this.dialog.open(AddSiteComponent, {
      disableClose: true,
      maxWidth: '100vw',
      width: '50vw',
      panelClass: ['site', 'full-screen-modal'],
      data: {
        mode: Mode,
        selectedSite: siteData,
        allSites: (this.service.master['SiteMasterDetails'] || [])
      },
    });
    dialog.afterClosed().subscribe((result) => { });
  }

  deleteSite(siteData?: any) {
    const confirm = this.dialog.open(ConfirmDialogComponent, {
      id: "ConfirmDialogComponent",
      disableClose: true,
      minWidth: "300px",
      panelClass: "dark",
      data: {
        title: "Confirm Deletion",
        content: "This action will permanently delete the record.\nYou may not be able to retrieve it.\n\nDo you still want to delete it?"
      }
    });
    confirm.afterClosed().subscribe(result => {
      if (result) {
        this.service.deleteSite(siteData.SiteID).subscribe((res: any) => {
          next:
          this.deleteSuccess();
        });
      }
    });
  }

  deleteSuccess(): any {
    const timeout = 1000; // 1 Seconds
    const confirm = this.dialog.open(InfoComponent, {
      id: "InfoComponent",
      disableClose: true,
      minWidth: "300px",
      panelClass: "success",
      backdropClass: 'static',
      data: {
        title: "Success",
        content: "Threat Library is deleted successfully"
      }
    });

    confirm.afterOpened().subscribe(result => {
      setTimeout(() => {
        confirm.close();
        this.service.getSiteMaster();
      }, timeout)
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    const searchFields: any = ['ShortCode', 'SiteName', 'City', 'Country', 'State', 'BCChampionName', 'AdminName', 'BussinessFunctionCount'];
    this.service.TableSite.data = addIndex(JSON.parse(JSON.stringify(searchBy(filterValue, searchFields, (this.service.master['SiteMasterDetails'] || [])))), false);
  }

}
