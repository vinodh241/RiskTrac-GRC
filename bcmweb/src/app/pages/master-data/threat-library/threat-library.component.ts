import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddThreatComponent } from './add-threat/add-threat.component';
import { MasterThreatLibraryService } from 'src/app/services/master-data/master-threat-library/master-threat-library.service';
import { ConfirmDialogComponent } from 'src/app/includes/utilities/popups/confirm/confirm-dialog.component';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { addIndex, searchBy, sortBy } from 'src/app/includes/utilities/commonFunctions';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-threat-library',
  templateUrl: './threat-library.component.html',
  styleUrls: ['./threat-library.component.scss']
})
export class ThreatLibraryComponent implements OnInit {
  displayedColumnsTL: string[] = ['Index', 'RiskCode', 'Risk', 'ThreatCategory', 'RiskImpactCode', 'RiskOwner', 'Action'];

  constructor(
    public dialog: MatDialog,
    public service: MasterThreatLibraryService,
    public authService: AuthService,
    public utils: UtilsService,
    private router: Router) {
    if (this.utils.isSCUserNBCMUnitUser()) {
      this.authService.activeTab.next("master-data");
      this.service.getThreatMaster();
    } else {
      this.router.navigate(['/business-continuity-plan'])
    }
  }

  ngOnInit(): void {
    // this.service.getThreatMaster();
  }

  openThreat(Mode?: any, threatData?: any) {
    if (this.dialog.openDialogs.length == 0) {
      const dialog = this.dialog.open(AddThreatComponent, {
        disableClose: true,
        maxWidth: '100vw',
        width: '90vw',
        panelClass: ['threat', 'full-screen-modal'],
        data: {
          mode: Mode,
          headerName: `Threat Library - ${Mode} Risk`,
          selectedThread: JSON.parse(JSON.stringify(threatData)),
          allTreats: JSON.parse(JSON.stringify(this.service.master['ThreatMasterList'] || [])),
          from: 1
        },
      });
      dialog.afterClosed().subscribe((result) => { });
    }
  }

  deleteThreat(data?: any) {
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
        this.service.deleteThreatLibrary(data).subscribe((res: any) => {
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
        this.service.getThreatMaster();
      }, timeout)
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    const searchFields: any = ['Index', 'RiskCode', 'RiskTitle', 'ThreatCategory', 'RiskImpactCode', 'RiskOwner'];
    this.service.TableTL.data = addIndex(JSON.parse(JSON.stringify(searchBy(filterValue, searchFields, (this.service.master['ThreatMasterList'] || [])))), false)
  }

  sortData(event: any) {
    this.service.TableTL.data = addIndex(sortBy(event, this.service.TableTL.data));
  }
}
