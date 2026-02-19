import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { addIndex, searchBy } from 'src/app/includes/utilities/commonFunctions';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SteeringCommitteeService } from 'src/app/services/master-data/master-steerring-committee/steering-committee.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { AddSteeringCommitteeComponent } from './add-steering-committee/add-steering-committee.component';

@Component({
  selector: 'app-steering-committee',
  templateUrl: './steering-committee.component.html',
  styleUrls: ['./steering-committee.component.scss']
})
export class SteeringCommitteeComponent {
  displayedColumns = ['index', 'userName', 'action']
  isEdit:boolean = false
  constructor(
    public dialog: MatDialog,
    public service: SteeringCommitteeService,
    public authService: AuthService,
    public utils: UtilsService,
    private router: Router) {
    if (this.utils.isSCUserNBCMUnitUser()) {
      this.authService.activeTab.next("master-data");
      this.service.getlistSteeringMaster();
    } else {
      this.router.navigate(['/business-continuity-plan']);
    }
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    const searchFields: any = ['index', 'FullName', 'action'];
    this.service.TableSteering.data = addIndex(JSON.parse(JSON.stringify(searchBy(filterValue, searchFields, (this.service.master[0]|| [])))), false);
  }

  addSteering() {
      const dialog = this.dialog.open(AddSteeringCommitteeComponent, {
        disableClose: true,
        maxWidth: '100vw',
        width: '50vw',
        panelClass: ['site', 'full-screen-modal'],
        data: {
          mode: "Add Steering Committee",
        },
      });
      dialog.afterClosed().subscribe((result) => { });
    }
  
    status(rowData: any) {
      console.log("rowData",rowData)
      this.isEdit = true
      let data = [];
         data.push({
            "UnitID": rowData.UnitID,
            "userGUID": rowData.UserGUID,
            "IsActive": rowData.IsActive,
            'isEdit' : this.isEdit
          });
          this.service.addOrUpdateSteering(
              { data: data[0] }
          );
      } 
    
}
