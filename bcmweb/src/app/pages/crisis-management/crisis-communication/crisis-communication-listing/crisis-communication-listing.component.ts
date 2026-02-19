import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CrisisCommunicationService } from 'src/app/services/crisis-communication/crisis-communication.service';
import { CreateNewMessageComponent } from '../create-new-message/create-new-message.component';
import { SendCommunicationComponent } from '../send-communication/send-communication.component';
import { addIndex, searchBy, sortBy } from 'src/app/includes/utilities/commonFunctions';

@Component({
  selector: 'app-crisis-communication-listing',
  templateUrl: './crisis-communication-listing.component.html',
  styleUrls: ['./crisis-communication-listing.component.scss']
})
export class CrisisCommunicationListingComponent {
  displayedColumns = ['Index', 'ComID', 'Title', 'Category', 'Recipient', 'IssueDate', 'Attach', 'Status', 'Action'];

  constructor(
    public dialog: MatDialog,
    public authService: AuthService,
    public service: CrisisCommunicationService
  ) {
    this.authService.activeTab.next("CrisisManagement");
    this.authService.activeSubTab$.next("crisis-communication");
    this.service.getCrisisCommList();
  }

  sortData(event: any) {
    this.service.TableCrisisComm.data = addIndex(sortBy(event, this.service.TableCrisisComm.data));
  }

  addEditMessage(mode: any, data: any = {}) {
    const dialog = this.dialog.open(CreateNewMessageComponent, {
      panelClass: ['full-screen-modal'],
      disableClose: true,
      maxWidth: '100vw',
      width: '94.5vw',
      data: {
        crisisMode       : mode,
        crisisModelHeader: mode == 'Add'? 'Add New Communication' : 'Update Communication',
        crisisData       : JSON.parse(JSON.stringify(data)),
        allCrisis        : JSON.parse(JSON.stringify(this.service.masterCrisisList || []))
      },
    });
    dialog.afterClosed().subscribe((result) => {
      this.service.getCrisisCommList();
    });
  }

  directToCrisisCommDetails(data: any) {
    const dialog = this.dialog.open(SendCommunicationComponent, {
      disableClose: true,
      maxWidth: '100vw',
      width: '94.5vw',
      panelClass: ['full-screen-modal'],
      data: {
        clickedCrisis  : JSON.parse(JSON.stringify(data))
      },
    });
    dialog.afterClosed().subscribe((result) => {
      this.service.getCrisisCommList();
    });
  };

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    const searchFields: any = ['CommunicationID', 'CommunicationTitle', 'CrisisCategory', 'RecipentOption', 'FormatedIssueDate', 'Status'];
    this.service.TableCrisisComm.data = addIndex(JSON.parse(JSON.stringify(searchBy(filterValue, searchFields, (this.service.masterCrisisList || [])))), false);
  };

}
