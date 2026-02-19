import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/includes/utilities/popups/confirm/confirm-dialog.component';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { MasterCrisisService } from 'src/app/services/master-data/master-crisis/master-crisis.service';
import { AddCrisisCommsTemplateComponent } from './add-crisis-comms-template/add-crisis-comms-template.component';
import { addIndex, searchBy } from 'src/app/includes/utilities/commonFunctions';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crisis-comms-templates',
  templateUrl: './crisis-comms-templates.component.html',
  styleUrls: ['./crisis-comms-templates.component.scss']
})

export class CrisisCommsTemplatesComponent implements OnInit {
  displayedColumnsCrisis: string[] = ['Index', 'CommunicationTitle', 'Criticality', 'Action'];

  constructor(
    public dialog: MatDialog,
    public service: MasterCrisisService,
    public authService: AuthService,
    public utils: UtilsService,
    private router: Router) {
    if (this.utils.isSCUserNBCMUnitUser()) {
      this.authService.activeTab.next("master-data");
      this.service.getCrisisMaster();
    } else {
      this.router.navigate(['/business-continuity-plan']);
    }
  }

  ngOnInit(): void {
    // this.service.getCrisisMaster()
  }

  openCrisis(Mode?: any, crisisData?: any) {
    if (this.dialog.openDialogs.length == 0) {
      const dialog = this.dialog.open(AddCrisisCommsTemplateComponent, {
        disableClose: true,
        maxWidth: '100vw',
        width: '94vw',
        height: '84vh',
        panelClass: ['crisis', 'full-screen-modal'],
        data: {
          mode: Mode,
          selectedTemp: JSON.parse(JSON.stringify(crisisData)),
          allTemplates: this.service.master['CrisisEmailTemplateList']
        },
      });
      dialog.afterClosed().subscribe((result) => { });
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    const searchFields: any = ['TemplateName', 'CriticalityName'];
    this.service.TableCrisisCommsTemp.data = addIndex(JSON.parse(JSON.stringify(searchBy(filterValue, searchFields, this.service.master['CrisisEmailTemplateList']))), false)
  }

  deleteCrisis(data: any) {
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
        this.service.deleteThreatLibrary(data.EmailTemplateID).subscribe((res: any) => {
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
        content: "Template is deleted successfully"
      }
    });

    confirm.afterOpened().subscribe(result => {
      setTimeout(() => {
        confirm.close();
        this.service.getCrisisMaster();
      }, timeout)
    });
  }
}
