import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { addIndex } from 'src/app/includes/utilities/commonFunctions';
import { BcmsTestingService } from 'src/app/services/bcms-testing/bcms-testing.service';

export interface ParticipantsTableColumns {
  index     : number;
  ShortCode : string;
  SiteName  : string;
  Location  : string;
}

@Component({
  selector: 'app-participants-list',
  templateUrl: './participants-list.component.html',
  styleUrls: ['./participants-list.component.scss']
})

export class ParticipantsListComponent implements OnInit{
  displayedColumns!: Array<any>;
  masterParticipantList: any;
  public TableParticipants!: MatTableDataSource<ParticipantsTableColumns>;

  statusFilter    = new FormControl();

  constructor(
    private route: Router,
    public service: BcmsTestingService,
    @Inject(MAT_DIALOG_DATA) public parent: any,
    public dialogRef: MatDialogRef<ParticipantsListComponent>
  ) {
    this.masterParticipantList = JSON.parse(JSON.stringify(parent.participantsList));
    this.TableParticipants = new MatTableDataSource(addIndex(this.masterParticipantList, false));
    if (parent.from == 1) {
      this.displayedColumns  = ['Index', 'BusinessFunctions', 'BusinessOwner'];
    } else {
      this.displayedColumns  = ['Index', 'BusinessFunctions', 'BusinessOwner', 'Status', 'Action'];
    }
  }

  ngOnInit(): void {
    this.statusFilter.valueChanges.subscribe((statusValue) => {
      const filteredValue = (statusValue || '');
      this.TableParticipants.data = addIndex(JSON.parse(JSON.stringify(this.masterParticipantList.filter((x: any) => (x.TestParticipantName || '').toLowerCase().trim().includes(filteredValue.toLowerCase().trim())))), false);
    });
  }

  navigateToParticipantReport(rowData: any) {
    this.parent.payload.scheduledTestId = rowData.ScheduledTestID
    let headerQueries = Object.assign(this.parent.payload, {testParticipantId: rowData.TestParticipantID});
    this.route.navigate(['bcms-testing/participant-report'], { queryParams: headerQueries });
    this.dialogRef.close();
  }

  resetParticipantList() {
    this.dialogRef.close(true);
  }


  getActionsLabel(row:any) {
    if (((row.BusinessOwnerGUID == this.service.loggedUser && [5, 6].includes(Number(row.TestWorkflowStatusID))) || this.service.isBCManager && [9, 10].includes(Number(row.TestWorkflowStatusID))))
      return 'Review';
    if (row.BCCUserGUIDs.includes(this.service.loggedUser) && [1,3,11].includes(Number(row.TestWorkflowStatusID)))
      return 'Submit For Review';
    return 'View Details';
  }
}
