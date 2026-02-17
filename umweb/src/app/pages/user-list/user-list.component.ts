import { OnInit, AfterViewInit, Component, ViewChild, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../../services/user/user.service';
import { ConfirmDialogComponent } from '../../includes/utilities/popups/confirm/confirm-dialog.component';
import { EditUser } from './user-edit/user-edit.component';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { DOCUMENT } from '@angular/common';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { TranslateService } from '@ngx-translate/core';

export interface UserData {
  Index: string;
  Name: string;
  UnitNames: string;
}

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})

export class UserListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['Index', 'Name', 'UnitNames'];
  matRowDefData: string[] = []
  matHeaderRowDefData: string[] = []
  // @ts-ignore
  dataSource: MatTableDataSource<UserData>;
  data: any;

  saRoleID = "";
  umRoleID = "";
  suRoleID = "";
  inputSearch: any = "";
  authenticationMode: any;
  // @ts-ignore
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ts-ignore
  @ViewChild(MatSort) sort: MatSort;
  modules: any[] = [];
  roleDetailsTPT: any[] = [];
  modAbTpTrac: any;
  moduleData: any;
  constructor(
    private _utils: UtilsService,
    private userService: UserService,
    private dialog: MatDialog,
    private translate: TranslateService,
    @Inject(DOCUMENT) private _document: any
  ) { }

  ngOnInit() {
    this.getUsers();
  }

  ngAfterViewInit() {
  }

  applyFilter() {
    this.dataSource.filter = this.inputSearch.trim().toLocaleLowerCase()
    if (this.dataSource.paginator)
      this.dataSource.paginator.firstPage()
  }

  getUsers(): void {
    this.userService.getAllUsers().subscribe(res => {
      next:
      if (res.success == 1) {
        res.result.Roles.forEach((role: any) => {
          if (role.Abbreviation == 'SA') this.saRoleID = role.RoleID;
          if (role.Abbreviation == 'UM') this.umRoleID = role.RoleID;
          if (role.Abbreviation == 'SU') this.suRoleID = role.RoleID;
        });
        this.roleDetailsTPT = res.result?.roleDetailsTPT;
        this.modAbTpTrac = res.result?.modAbbreviationTPT?.ModuleAbbreviation
        this.authenticationMode = res.result?.authenticationMode
        if (res.result.Users.length > 0) {
          this.data = res.result.Users;
          this.moduleData = res.result?.AllowedModuleList
          if (this.data) {
            this.extractModules(res.result?.AllowedModuleList);
            let id = 0;
            let userguid = localStorage.getItem("userguid")
            this.data.forEach((user: any) => {
              id++
              user.Index = id
              user.UMRoleID = this.umRoleID
              user.SURoleID = this.suRoleID
              user.IsUserManager = false
              user.IsUserSelf = user.UserGUID == userguid
              user.Name = user.FirstName ? user.FirstName : ""
              user.Name += user.MiddleName ? (user.Name == "" ? "" : " ") + user.MiddleName : ""
              user.Name += user.LastName ? (user.Name == "" ? "" : " ") + user.LastName : ""
              if (user.DefaultRoleID == this.umRoleID) {
                user.IsUserManager = true;
              }
              if (user.Modules) {
              }

              user.UnitNames = "";
              if (user.Units) {
                user.Units.forEach((unit: any) => {
                  if (user.UnitNames != "")
                    user.UnitNames += " | ";
                  user.UnitNames += unit.UnitName;
                });
              }
            });
            this.dataSource = new MatTableDataSource(this.data);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;

            this.dataSource.filterPredicate = function (data, filter: string): boolean {
              return data.Name.toLowerCase().includes(filter) ||
                data.UnitNames.toLowerCase().includes(filter)
            };

            if (this.inputSearch != "") {
              this.applyFilter()
            }
          }
        }
      } else {
        if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
          this._utils.relogin(this._document);
      }
      error:
      console.log("err::", "error");
    });
  }

  extractModules(dataArr: any) {
    const moduleAbbrs = new Set<string>();
    dataArr.forEach((user: any) => {
      moduleAbbrs.add(user.ModuleAbbreviation);
    });

    this.modules = Array.from(moduleAbbrs);
    this.modules = this.modules.sort((a, b) => a.localeCompare(b));
    console.log('this.modules : ', this.modules);
    this.matRowDefData = ['Index', 'Name', 'UnitNames', ...this.modules.map(m => m + 'Name'), 'Action'];
    this.matHeaderRowDefData = this.modules.flatMap(m => {
      if (m === this.modAbTpTrac) {
        return [`${m}Role`];
      } else {
        return [`${m}Role`, `${m}Admin`];
      }
    });
    this.createModuleColumns();
  }

  createModuleColumns() {
    this.modules.forEach((module: any) => {
      if (module !== this.modAbTpTrac) {
        this.displayedColumns.push(`${module}Role`, `${module}Admin`);
      } else {
        this.displayedColumns.push(`${module}Role`);
      }
    });
    this.displayedColumns.push('Action');
    this.displayedColumns = [...new Set(this.displayedColumns)];
  }

  hasModule(row: any, moduleAbbreviation: string): boolean {
    return row?.filter((m: any) => m.ModuleAbbreviation === moduleAbbreviation)[0]?.IsSelected === true ? true : false;
  }

  hasModuleNoData(row: any, moduleAbbreviation: string): boolean {
    return row?.filter((m: any) => m.ModuleAbbreviation === moduleAbbreviation)[0]?.IsSelected === true ? false : true;
  }

  getColumnWidth(moduleCount: number, type: any): any {
    if (type === 'module') {
      switch (moduleCount) {
        case 1:
          return '30%';
        case 2:
          return '20%';
        case 3:
          return '20%';
        default:
          return '14%';
      }
    } else if (type === 'user') {
      switch (moduleCount) {
        case 1:
          return '30%';
        case 2:
          return '25%';
        case 3:
          return '15%';
        default:
          return '10%';
      }
    } else if (type === 'unit') {
      switch (moduleCount) {
        case 1:
          return '30%';
        case 2:
          return '25%';
        case 3:
          return '15%';
        default:
          return '10%';
      }
    }
  }

  addUser(): void {
    const editUser = this.dialog.open(EditUser, {
      disableClose: true,
      data: {
        "mode": "add",
        "UMRoleID": this.umRoleID,
        "SURoleID": this.suRoleID,
        "LirstName": "",
        "LastName": "",
        "MobileNumber": "",
        "IsUserManager": false,
        "Modules": [],
        "Units": []
      }
    });

    editUser.afterClosed().subscribe(result => {
      if (result)
        this.getUsers();
    });
  }

  editUser(row: any): void {
    if (row.IsUserSelf) return
    row.mode = "edit";
    const editUser = this.dialog.open(EditUser, {
      disableClose: true,
      data: row
    });

    editUser.afterClosed().subscribe(result => {
      if (result)
        this.getUsers();
    });
  }

  deleteUser(row: any): void {
    const confirm = this.dialog.open(ConfirmDialogComponent, {
      disableClose: true,
      minWidth: "300px",
      panelClass: "dark",
      data: {
        title: this.translate.instant('userList.dialogs.confirmDeletion.title'),
        content: this.translate.instant('userList.dialogs.confirmDeletion.content')
      }
    });

    confirm.afterClosed().subscribe(result => {
      if (result) {
        this.userService.deleteAssignedUser(row).subscribe(res => {
          next:
          this.deleteSuccess();
          error:
          console.log("err::", "error");
        });
      }
    });
  }

  deleteSuccess(): void {
    const timeout = 3000; // 3 Seconds
    const confirm = this.dialog.open(InfoComponent, {
      disableClose: true,
      minWidth: "300px",
      panelClass: "success",
      data: {
        title: this.translate.instant('userList.dialogs.deleteSuccess.title'),
        content: this.translate.instant('userList.dialogs.deleteSuccess.content')
      }
    });

    confirm.afterOpened().subscribe(result => {
      setTimeout(() => {
        confirm.close();
        this.getUsers();
      }, timeout)
    });
  }

  changeRole(user: any) {
    if (user.Modules[0].RoleID == 4) {
      user.Modules[0].RoleID = 5;
      user.Modules[0].IsFunctionalAdmin = false;
    } else {
      user.Modules[0].RoleID = 4;
    }
  }

  roleCheck(mod: any, selectdMod: any): boolean {
    let isPower = false
    for (let i = 0; i <= mod.Modules.length - 1; i++) {
      if ((mod.Modules[i].RoleID === 4 && mod.Modules[i].ModuleAbbreviation === selectdMod)) {
        isPower = true;
        break;
      }
    }
    return isPower;
  }

  roleCheckDropDown(mod: any, selectdMod: any) {
    let filteredData: any = []
    filteredData = mod?.Modules?.filter((role: any) => role.ModuleAbbreviation === selectdMod) || []
    if (filteredData && filteredData.length) {
      return this.roleDetailsTPT.filter((role: any) => role.AuditorRoleID === filteredData[0].RoleID)[0]?.AuditorRoleName
    }
    return;
  }

  isFunctionalAdmin(fun: any, selectdMod: any): boolean {
    let isFunctional = false
    for (let i = 0; i <= fun.Modules.length - 1; i++) {
      if (fun.Modules[i].IsFunctionalAdmin === true && fun.Modules[i].ModuleAbbreviation === selectdMod) {
        isFunctional = true;
        break;
      }
    }
    return isFunctional;
  }

  funCheck(fun: any, selectdMod: any) {
    for (let i = 0; i <= fun.Modules.length - 1; i++) {
      if ((fun.Modules[i].ModuleAbbreviation === selectdMod && fun.Modules[i].IsFunctionalAdmin === true)) {
        fun.Modules[i].ModuleAbbreviation === selectdMod && fun.Modules[i].IsFunctionalAdmin === true != fun.Modules[i].ModuleAbbreviation === selectdMod && fun.Modules[i].IsFunctionalAdmin === true
      }
    }
  }

  resetPassword(row: any) {
    if (row.IsUserSelf) {
      return;
    }
    const confirm = this.dialog.open(ConfirmDialogComponent, {
      disableClose: true,
      minWidth: "300px",
      panelClass: "dark",
      data: {
        title: this.translate.instant('userList.dialogs.confirmResetPassword.title'),
        content: this.translate.instant('userList.dialogs.confirmResetPassword.content')
      }
    });

    confirm.afterClosed().subscribe(result => {
      if (result) {
        this.userService.resetPassword(row).subscribe(res => {
          console.log(res)
          next:
          if (res.success) {
            this.resetSuccess(res.message);
          } else {
            if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED") {
              this._utils.relogin(this._document);
            }
          }
        });
      }
    });
  }

  resetSuccess(message: any): void {
    const timeout = 3000; // 3 Seconds
    const confirm = this.dialog.open(InfoComponent, {
      disableClose: true,
      minWidth: "300px",
      panelClass: "success",
      data: {
        title: this.translate.instant('common.success'),
        content: message
      }
    });

    confirm.afterOpened().subscribe(result => {
      setTimeout(() => {
        confirm.close();
        this.getUsers();
      }, timeout)
    });
  }

  changed(event: any, row: any) {
    if (row.IsUserSelf) {
      return;
    }
    const confirm = this.dialog.open(ConfirmDialogComponent, {
      disableClose: true,
      minWidth: "300px",
      panelClass: "dark",
      data: {
        title: this.translate.instant('userList.dialogs.confirmEnableDisable.title'),
        content: event.checked 
          ? this.translate.instant('userList.dialogs.confirmEnableDisable.enableContent') 
          : this.translate.instant('userList.dialogs.confirmEnableDisable.disableContent')
      }
    });

    confirm.afterClosed().subscribe(result => {
      if (result) {
        this.userService.enableDisableUser(row, event.checked).subscribe(res => {
          console.log(res)
          let message = event.checked 
            ? this.translate.instant('userList.dialogs.enableSuccess') 
            : this.translate.instant('userList.dialogs.disableSuccess');
          next:
          if (res.success) {
            this.resetSuccess(message);
          } else {
            if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED") {
              this._utils.relogin(this._document);
            }
          }

        });
      } else {
        this.getUsers();
      }
    });
  }

  getBackGround(module: any) {
    let colorData = this.moduleData.filter((ele: any) => ele.ModuleAbbreviation == module)[0].headColor
    return colorData
  }

  getBackGroundRow(module: any) {
    let colorData = this.moduleData.filter((ele: any) => ele.ModuleAbbreviation == module)[0].rowColor
    return colorData
  }
}
