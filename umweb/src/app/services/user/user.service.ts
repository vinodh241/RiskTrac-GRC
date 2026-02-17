import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, BehaviorSubject, of, Subject } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { HttpParams, HttpHeaders } from '@angular/common/http';
import { catchError, finalize, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { RestService } from '../rest/rest.service';


@Injectable({
    providedIn: 'root'
})
export class UserService extends RestService {

    getAllUsers() {
        return this.post("/user-management/user-management/get-users", {

        });
    }

    getUserDetails(obj: any) {

        let data: any = {
            "userId": obj.userId,
            "emailId": obj.emailId,
            "authenticationMode": obj.authenticationMode
        }

        return this.post("/user-management/user-management/get-user-details-from-ad", {
            "userMaster": data
        });
    }

    getAssignedUserInfo() {
        return this.post("/user-management/user-management/get-assigned-user-info", {

        });
    }

    addAssignUser(user: any, accGUID: string, modGUID: any, localobj: any): Observable<any> {
        let modules: any[] = [];
        user.Modules.forEach((module: any) => {
            if (module.IsSelected) {
                modules.push({
                    "ModuleGUID": modGUID,
                    "RoleID": module.RoleID,
                    "IsFunctionalAdmin": module.IsFunctionalAdmin
                });
            }
        });

        let units: any[] = [];
        user.Units.forEach((unit: any) => {
            units.push({ "UnitID": unit.UnitID });
        });

        var userMaster = {
            "adUserName": localobj.authenticationMode == 3 ? localobj.userName : user.ADUserName,
            "firstName": localobj.authenticationMode == 3 ? localobj.fName : user.FirstName,
            "middleName": localobj.authenticationMode == 3 ? localobj.mName : user.MiddleName,
            "lastName": localobj.authenticationMode == 3 ? localobj.lName : user.LastName,
            "Designation": localobj.authenticationMode == 3 ? localobj.Designation : user.Designation,
            "mobileNumber": localobj.authenticationMode == 3 ? localobj.mobNo : user.MobileNumber,
            "emailID": localobj.authenticationMode == 3 ? localobj.userEmailId : user.EmailID,
            "defaultRoleID": user.IsUserManager ? user.UMRoleID : user.SURoleID,
            "isUserManager": user.IsUserManager,
            "assignedModules": "",
            "assignedGroupsUnits": "",
            "userGUID": user.UserGUID,
            "accountGUID": accGUID,
            "authenticationMode": localobj.authenticationMode
        }

        if (!userMaster.isUserManager) {
            userMaster.assignedModules = JSON.stringify(modGUID);
            userMaster.assignedGroupsUnits = JSON.stringify(units);
        }

        let postdata = {
            "userMaster": userMaster
        }
        return this.post("/user-management/user-management/add-assign-user", postdata);
    }

    deleteAssignedUser(user: any): Observable<any> {
        return this.post("/user-management/user-management/delete-user", {
            "userMaster": {
                "UserGUID": user.UserGUID
            }
        });
    }


    resetPassword(user: any): Observable<any> {
        return this.post("/user-management/user-management/reset-password", {
            "userMaster": {
                "UserGUID": user.UserGUID
            }
        });
    }

    enableDisableUser(row: any, isEnabled: any): Observable<any> {
        return this.post("/user-management/user-management/enable-disable-user", {
            "userMaster": {
                "UserGUID": row.UserGUID,
                "isEnabled": isEnabled
            }
        });
    }

}
