import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SteeringCommitteeService } from 'src/app/services/master-data/master-steerring-committee/steering-committee.service';

@Component({
  selector: 'app-add-steering-committee',
  templateUrl: './add-steering-committee.component.html',
  styleUrls: ['./add-steering-committee.component.scss']
})
export class AddSteeringCommitteeComponent {

  messagedata : any
  isEdit:boolean = false
  steeringUserList:any
  selectedUserGUID: any;
  submit:boolean = false


   constructor(
      public service: SteeringCommitteeService,
      public authService: AuthService,
      public dialog: MatDialog,
   ) {
    this.service.getSteeringMasterInfo();
    }

    ngOnInit(){
      this.service.gotMasterSteeringInfoData.subscribe((value: any) => {
        if (value) {
          this.steeringUserList =
            this.service.steeringInfoData;
        }
      })
    }

  onSubmit() {
    console.log("selectedUserGUID",this.selectedUserGUID)
    if (!this.selectedUserGUID){
      this.submit = true
      return;
    }else{
      console.log('this.selectedUserGUID.length: ', this.selectedUserGUID.length);
      this.submit = false
   let rowData = this.steeringUserList.filter((ele:any)=> ele.UserGUID==this.selectedUserGUID)[0]
    this.isEdit = false
    let data = [];
       data.push({
          "UnitID": rowData.UnitID,
          "userGUID": rowData.UserGUID,
          "IsActive": true,
          'isEdit' : this.isEdit
        });
        this.service.addOrUpdateSteering(
            { data: data[0] }

        );
    }
    } 

    close() {
      this.dialog.closeAll();
    }

    onSelectUser(event:any){
      if(event){
        this.submit = false
      }
    }
}
