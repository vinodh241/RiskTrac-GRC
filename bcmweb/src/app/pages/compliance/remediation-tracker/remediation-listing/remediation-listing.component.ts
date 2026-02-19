import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { RemediationTrackerService } from 'src/app/services/remediation-tracker/remediation-tracker.service';
import { NewActionItemsComponent } from './new-action-items/new-action-items.component';
import { MatDialog } from '@angular/material/dialog';
import { ActionItemDetailsComponent } from '../action-item-details/action-item-details.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { addIndex, searchBy } from 'src/app/includes/utilities/commonFunctions';

@Component({
  selector: 'app-remediation-listing',
  templateUrl: './remediation-listing.component.html',
  styleUrls: ['./remediation-listing.component.scss'],
})

export class RemediationListingComponent {

  dataSource = new MatTableDataSource<Element>();
  totalActionPlan: any;
  assignedActionPlan: any;
  delayedActionPlan: any;
  filterValue: any;
  totalFlag: boolean = false;
  customFilterFields: any[] = ['FilterStatusId'];
  assessmentStatusIds: any[] = [];
  displayedColumns: string[] = [
    'Index',
    'title',
    'source',
    'module',
    'owner',
    'startDate',
    'endDate',
    'status',
    'progress',
  ];
  searchFields: any = [
    'ActionItemName',
    'ActionItemSource',
    'ActionItemModule',
    'ActionItemOwner',
    'FormattedStartDate',
    'FormattedEndDate',
    'StatusName',
    'Progress'
  ];

  constructor(
    public remediationService: RemediationTrackerService,
    public dialog: MatDialog,
    public authService: AuthService,
    public utils: UtilsService
  ) {
    this.authService.activeTab.next('ComplianceReview');
    this.authService.activeSubTab$.next('remediation-tracker');
    this.remediationService.getRemediationListData();
  }

  ngOnInit() {
    this.remediationService.gotremediationList.subscribe((value) => {
      if (value) {
        this.dataSource = new MatTableDataSource(
          this.remediationService.remediationListObj.ActionItemsList
        );
        this.totalActionPlan =
          this.remediationService.remediationListObj.ActionItemsList?.length;
        this.assignedActionPlan =
          this.remediationService.remediationListObj.ActionItemsList.filter(
            (ele: any) => ele.FilterStatusId == 2
          ).length;
        this.delayedActionPlan =
          this.remediationService.remediationListObj.ActionItemsList.filter(
            (ele: any) => ele.FilterStatusId == 5
          ).length;
      }
    });
  }

  newAction() {
    const dialog = this.dialog.open(NewActionItemsComponent, {
      disableClose: true,
      maxWidth: '100vw',
      width: '90vw',
      panelClass: ['site', 'full-screen-modal'],
    });
    dialog.afterClosed().subscribe(() => { });
  }

  actionDetails(data: any) {
    if (
      (this.remediationService.remediationListObj.IsBCManager == 1 &&
        data.CurrentWorkFlowStatusIDToDB == 2) || (this.remediationService.remediationListObj.IsBCManager == 1 &&
          (data.StatusID == 1 || data.StatusID == 0))
    ) {
      const dialog = this.dialog.open(NewActionItemsComponent, {
        disableClose: true,
        maxWidth: '100vw',
        width: '90vw',
        panelClass: ['site', 'full-screen-modal'],
        data: {
          data: JSON.parse(JSON.stringify(data)),
          mode: 'edit',
        },
      });
      dialog.afterClosed().subscribe(() => { });
    } else {
      const dialog = this.dialog.open(ActionItemDetailsComponent, {
        disableClose: true,
        maxWidth: '100vw',
        width: '90vw',
        panelClass: ['site', 'full-screen-modal'],
        data: JSON.parse(JSON.stringify(data)),
      });
      dialog.afterClosed().subscribe(() => { });
    }
  }

  applyFilter(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value;
    this.dataSource = addIndex(
      JSON.parse(
        JSON.stringify(
          searchBy(
            this.filterValue,
            this.searchFields,
            this.remediationService.remediationListObj['ActionItemsList'],
            this.customFilterFields,
            this.assessmentStatusIds
          )
        )
      ),
      false
    );
  }

  filterStatus(id: any) {
    if (this.assessmentStatusIds.includes(id)) {
      const index = this.assessmentStatusIds.findIndex((x: any) => x == id);
      this.assessmentStatusIds.splice(index, 1);
    } else {
      this.assessmentStatusIds.push(Number(id));
    }
    this.totalFlag = false;
    this.dataSource = addIndex(
      JSON.parse(
        JSON.stringify(
          searchBy(
            this.filterValue,
            this.searchFields,
            this.remediationService.remediationListObj['ActionItemsList'],
            this.customFilterFields,
            this.assessmentStatusIds
          )
        )
      ),
      false
    );
  }

  filterTotal(data: any) {
    if (data) {
      this.dataSource = new MatTableDataSource(
        this.remediationService.remediationListObj.ActionItemsList
      );
      this.totalFlag = true;
    }
  }

  getColor(progress: any) {
    progress = Number(progress?.replace('%', ''));
    if (progress <= 25) {
      return 'color-class-1';
    } else if (progress <= 50) {
      return 'color-class-2';
    } else if (progress <= 75) {
      return 'color-class-3';
    } else {
      return 'color-class-4';
    }
  }

  //to remove +5:30 and format the date like - "2023-08-21T00:00:00.000Z"
  formatTimeZone(dateval: any) {
    let date = null;
    if (dateval instanceof Date) {
      const d = dateval.getDate();
      let dd = '';
      if (d < 10) {
        dd = '0' + d;
      } else {
        dd = '' + d;
      }
      let m = dateval.getMonth() + 1;
      let mm = '';
      if (m < 10) {
        mm = '0' + m;
      } else {
        mm = '' + m;
      }
      const y = dateval.getFullYear();
      const Timeval = "00:00:00.000Z"
      let val = y + '-' + mm + '-' + dd;
      date = val
    } else if (typeof dateval === 'string' || dateval instanceof String) {
      const dateval2 = dateval.split('T')[0];
      const Timeval = "00:00:00.000Z"
      date = dateval2;
    } else {
      return null;
    }
    return date;
  }

  getToolTip(ele: any): any {
    if (ele.StatusID == 1) {
      return " This action item is in BC Manager's Queue "
    } else if (ele.StatusID == 2 || ele.StatusID == 3) {
      return " This action item is in Action Item Owner's Queue "
    } else if (ele.StatusID == 4 && ele.CurrentWorkFlowStatusIDToDB == 4) {
      return " This action item is in Site Business Owner's Queue "
    } else if (ele.StatusID == 4 && ele.CurrentWorkFlowStatusIDToDB == 5) {
      return " This action item is in BC Manager's Queue "
    } else if (ele.StatusID == 4 && ele.CurrentWorkFlowStatusIDToDB == 6) {
      return " This action item is in Site Business Owner's Queue "
    } else if (ele.StatusID == 4 && ele.CurrentWorkFlowStatusIDToDB == 7) {
      return " This action item is in BC Manager's Queue "
    } else if (ele.StatusID == 5 && ele.CurrentWorkFlowStatusIDToDB == 8) {
      return "This Action Item is in BCM Steering Committee Queue"
    } else if (ele.StatusID == 6) {
      return "This Action Item is Closed"
    }
  }

}
