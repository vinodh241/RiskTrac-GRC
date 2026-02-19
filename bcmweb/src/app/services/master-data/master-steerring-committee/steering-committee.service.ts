import { Inject, Injectable } from '@angular/core';
import { UtilsService } from '../../utils/utils.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { DOCUMENT } from '@angular/common';
import { RestService } from '../../rest/rest.service';
import { MatTableDataSource } from '@angular/material/table';
import { addIndex } from 'src/app/includes/utilities/commonFunctions';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { BehaviorSubject } from 'rxjs';

export interface SteeringCommitteeTableColumns {
  index: number;
  userName: string;
  action: number;
}
@Injectable({
  providedIn: 'root'
})
export class SteeringCommitteeService extends RestService {
   public master!: any;
   public TableSteering!: MatTableDataSource<SteeringCommitteeTableColumns>;

    public steeringInfoData: any;
    public gotMasterSteeringInfoData: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(  
    private utils: UtilsService,
      private _http: HttpClient,
      private _dialog: MatDialog,
      @Inject(DOCUMENT) private _document: any) {
      super(_http, _dialog); }

      getlistSteeringMaster(): void {
        this.post("/business-continuity-management/master/steering-commitee/get-steering-commitee-master", {}).subscribe(res => {
          next:
          if (res.success == 1) {
            this.processSiteList(res)
          } else {
            if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
              this.utils.relogin(this._document);
            else
              this.popupInfo("Unsuccessful", res.error.errorMessage)
          }
        });
    }
  
    processSiteList(response: any): void {
      this.master = response.result.recordset;
      console.log(' this.master: ',  this.master);
      this.TableSteering = new MatTableDataSource(addIndex((this.master[0]), false));
    }

      getSteeringMasterInfo() {
          this.post("/business-continuity-management/master/steering-commitee/get-steering-commitee-master-info", {}).subscribe(res => {
            next:
            if (res.success == 1) {
              this.processSteeringInfo(res)
            } else {
              if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
                this.utils.relogin(this._document);
              else
                this.popupInfo("Unsuccessful", res.error.errorMessage)
            }
          });
      }
    
      processSteeringInfo(response: any) {
        
        this.steeringInfoData = response.result.recordset[0];
        if(!this.master[0].length) {
        console.log('this.master: ', this.master[0]);
        //   this.steeringInfoData = this.steeringInfoData;
        } else {
          let userGUID = [...new Set(this.master[0].map((nn:any) => nn.UserGUID))] 
          console.log('userGUID: ', userGUID);
          this.steeringInfoData = this.steeringInfoData.filter((ele:any) => !userGUID.includes(ele.UserGUID));
          console.log('this.steeringInfoData: ', this.steeringInfoData);

        }
        console.log('this.steeringInfoData: ', this.steeringInfoData);
        this.gotMasterSteeringInfoData.next(true)
      }
    
      addOrUpdateSteering( data: any) {
        console.log('data: ', data);
        this.post("/business-continuity-management/master/steering-commitee/add-steering-commitee-master" , { data : data.data }).subscribe(res => {
          if (res.success == 1) {
              if (data.data.isEdit) {
                  this.popupInfo("Success", "Record updated successfully");
              } else {
                  this.popupInfo("Success", "Record added successfully");
              }
              this.getlistSteeringMaster()
          } else {
              if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
                  this.utils.relogin(this._document);
              else
                  this.popupInfo("Unsuccessful", res.error.errorMessage);
          }
      });
      }

    popupInfo(title: string, message: string) {
        const timeout = 3000; // 3 seconds
        const confirm = this._dialog.open(InfoComponent, {
          disableClose: true,
          minWidth: "300px",
          panelClass: "dark",
          data: {
            title: title,
            content: message
          }
        });
    
        confirm.afterOpened().subscribe(result => {
          this.dialog.closeAll();
          setTimeout(() => {
            confirm.close();
          }, timeout)
        });
      }
    
}
