import { DOCUMENT } from '@angular/common';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgModel } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { UserService } from '../../../services/user/user.service';
import { TranslateService } from '@ngx-translate/core';

export interface UserData {
  id: string;
  user: string;
  unit: string;
}

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class EditUser implements OnInit {
  // @ts-ignore
  searchForm: FormGroup;
  searchFormLocal!: FormGroup;
  roleForm!: FormGroup
  dcModules: string[] = ['select', 'module', 'role', 'admin'];
  dcUnits: string[] = ['id', 'group', 'unit', 'action'];
  accounts: any;
  modules: any;
  groups: any;
  units: any;
  copy: any;
  userRoles: any;
  searcherror = "";
  saveerror = "";
  uniterror = "";
  moduleerror = "";
  userId: any;
  emailId: any;
  authenticationMode: any;
  validateMobNo: any;
  fullName: string = '';
  validateMobNoL: string = ''
  selectedModule: any[] = [];
  existingModule: any;
  copyModules: any[] = []
  headerRowColor = 'rgb(152 207 223)'
  errorMessage: string = '';
  allowedRange: string = '';
  domainName: string = '';
  dupUnitID: any
  dupUnitIDs: Set<number> = new Set()
  validateSaveLocal: boolean = false;
  modAbTpTrac: any
  countUnitObj: any = {}
  moduleAbbrAllowedUnits: any;
  unitValidationReqForModule: boolean = false;
  // @ts-ignore
  @ViewChild('FirstName') FirstName: NgModel
  // @ts-ignore
  @ViewChild('MobileNumber') MobileNumber: NgModel
  // @ts-ignore
  @ViewChild('EmailID') EmailID: NgModel
  userNameValidation: any;

  constructor(
    private router: Router,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private _utils: UtilsService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<EditUser>,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(DOCUMENT) private _document: any) {
    if (data) {
      this.copy = JSON.parse(JSON.stringify(data));
      this.uniterror = ''
      this.refreshUnits();
    }
    this.dialogRef.updateSize('67vw', '99vh');
  }

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      userid: [''],
      emailid: ['']
    });
    if (this.copy.IsUserEnabled == 0) {
      this.searchForm.disable();
    }
    this.userService.getAssignedUserInfo().subscribe(res => {
      next:
      if (res.success == 1) {
        if (res.result[0].length > 0) {
          this.accounts = res.result[0];
        }
        if (res.result[1].length > 0) {
          this.modules = res.result[1];
        }
        if (res.result[2].length > 0) {
          this.groups = res.result[2];
        }
        if (res.result[3].length > 0) {
          this.units = res.result[3];
        }
        if (res.result[5].length > 0) {
          this.userRoles = res.result[5];
        }
        if (res.result[6].length > 0) {
          this.domainName = res.result[6][0]?.EmailDomain;
        }
        if (res.result[7].length > 0 && this.copy.Modules.length == 0) {
          this.copy.Modules = res.result[7];
          this.copyModules = res.result[7];
        }
        if (res.result[8]) {
          this.authenticationMode = res.result[8].authenticationMode;
        }
        if (res.result[9].length) {
          this.validateMobNo = res.result[9];
          const mobNoRange = this.validateMobNo[0]?.MobNoRange || [0, 0];
          this.allowedRange = this.translate.instant('userEdit.validation.allowedRange', { min: mobNoRange[0], max: mobNoRange[1] });
        }
        if (res.result[10]) {
          this.userNameValidation = res.result[10]
        }
        if (res.result[11]) {
          this.modAbTpTrac = res.result[11]?.ModuleAbbreviation
        }
        if (res.result[12]) {
          this.moduleAbbrAllowedUnits = res.result[12]?.AllowedModuleAbbreviation
        }
        if (this.authenticationMode == 3) {
          this.searchFormLocal = this.formBuilder.group({
            userName: ['', [Validators.required, Validators.pattern(this.userNameValidation.REGEXP_REFERENCE)]],
            fName: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
            lName: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
            mName: ['', [Validators.pattern('^[a-zA-Z ]+$')]],
            Designation: [''], // <-- added, optional
            userEmailId: ['', [Validators.required, Validators.email]],
            mobNo: ['', [Validators.required, Validators.pattern('^[0-9]*$')]]
          })

          this.listenToFormChanges()
          if (this.copy.mode != "add") {
            this.patchValueLocal()
            this.searchFormLocal.controls['userName'].disable()
          }
          if (this.copy.IsUserEnabled == 0) {
            this.searchForm.disable();
            this.searchFormLocal.disable();
          }
        }
        this.copyModules = res?.result[7];
      } else {
        if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
          this._utils.relogin(this._document);
      }
      error:
      console.log("err::", "error");
    });
    this.selectedModule = this.copy.Modules.filter((x: any) => x.IsSelected === true)
    if (this.copy.mode != "add") {
      this.searchForm.controls['userid'].disable()
      this.searchForm.controls['emailid'].disable()
      let obj: any = {}
      obj['firstName'] = this.copy.FirstName;
      obj['middleName'] = this.copy.MiddleName;
      obj['lastName'] = this.copy.LastName;
      this.getUserFullName(obj);
    }
  }

  patchValueLocal() {
    this.searchFormLocal.patchValue({
      userName: this.copy.UserName,
      fName: this.copy.FirstName,
      mName: this.copy.MiddleName,
      lName: this.copy.LastName,
      Designation: this.copy.Designation || '',
      mobNo: this.copy.MobileNumber,
      userEmailId: this.copy.EmailID
    })

  }

  public onSubmit(): void {
    this.copy.FirstName = "";
    this.copy.LastName = "";
    this.copy.MobileNumber = "";
    this.clearErrors();
    let obj: any = {}
    obj['userId'] = this.searchForm.value.userid;
    obj['emailId'] = this.searchForm.value.emailid;
    obj['authenticationMode'] = this.authenticationMode;
    this.userService.getUserDetails(obj).subscribe(res => {
      next:
      if (res.success == 1) {
        if (res.result[0].length > 0) {
          this.copy.ADUserName = res.result[0][0].adUserName;
          this.copy.FirstName = res.result[0][0].firstName;
          this.copy.MiddleName = res.result[0][0].middleName ? res.result[0][0].middleName : "";
          this.copy.LastName = res.result[0][0].lastName ? res.result[0][0].lastName : "";
          this.copy.MobileNumber = res.result[0][0].mobileNumber;
          this.copy.EmailID = res.result[0][0].userEmail;
          this.copy.Designation = res.result[0][0].Designation
          this.getUserFullName(res.result[0][0])
        }
      } else {
        if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
          this._utils.relogin(this._document);
        else
          this.searcherror = res.error.errorMessage;
      }
      error:
      console.log("err::", "error");
    });
  }

  assignUnit(): void {
    const table = document.getElementById('tblunit');
    console.log('table: ', table);
    if (table) {
      setTimeout(() => {
        table.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
      }, 0);
    }
    if (this.dupUnitIDs.size) {
      return;
    }
    this.clearErrors();
    this.copy.Units.push({ "id": (this.copy.Units.length + 1), "UnitID": -1 });
    this.copy.Units = [...this.copy.Units];
  }

  refreshUnits(): void {
    let id = 0;
    this.copy.Units.forEach((unit: any) => {
      id++;
      unit.id = id;
    });
    this.copy.Units = [...this.copy.Units];
  }

  deleteUnit(row: any): void {
    this.clearErrors();
    let ob: any = {}
    if (!this.copy.IsUserManager) {
      let idx = this.copy.Units.indexOf(row);
      this.copy.Units.splice(idx, 1);
      this.copy.Units = [...this.copy.Units];
      this.refreshUnits();
      console.log(ob)
      this.dupUnitIDs.clear();
      this.copy.Units.forEach((n: any) => {
        ob[n.UnitID] = ob[n.UnitID] ? ob[n.UnitID] + 1 : 1;
      })
      for (let key in ob) {
        if (ob[key] > 1) {
          this.dupUnitIDs.add(parseInt(key));
        }
      }
    }
  }

  filteredUnits(groupId: any) {
    return this.units.filter((unit: any) => unit.GroupID === groupId);
  }

  changeUserManager(): void {
    this.copy.IsUserManager = !this.copy.IsUserManager;
    if (this.copy.IsUserManager) {
      this.copy.Modules = [];
      this.copy.Units = [];
      this.copy.Modules = [...this.copyModules];
      this.copy.Units = [...this.copy.Units];
    }
  }

  changeModule(module: any): void {
    this.selectedModule.push(module);
    this.clearErrors();
    module.IsSelected = !module.IsSelected
    if (!module.IsSelected) {
      module.RoleID = 5;
      module.ModuleAbbreviation !== this.modAbTpTrac ? module.RoleID = 5 : module.RoleID = null;
      module.IsFunctionalAdmin = false;
    }
    this.selectedModule = this.selectedModule.filter((m, index, self) =>
      index === self.findIndex((t) => t.ModuleAbbreviation === m.ModuleAbbreviation)
    );
  }

  changeRole(module: any): void {
    if (module.RoleID == 4) {
      module.RoleID = 5;
      module.IsFunctionalAdmin = false;
    } else {
      module.RoleID = 4;
    }
  }

  validateSave(): void {
    if (this.authenticationMode == 1) {
      let blank: boolean = false;
      let units: any[] = [];
      this.clearErrors();
      this.FirstName.control.markAllAsTouched()
      this.MobileNumber.control.markAsTouched()
      this.EmailID.control.markAsTouched()
      let hasError: boolean =
        this.FirstName.control.hasError("required") ||
        this.MobileNumber.control.hasError("required") ||
        this.EmailID.control.hasError("required") ||
        this.EmailID.control.hasError("email");

      this.copy.Units.forEach((unit: any) => {
        if (unit.UnitID == -1)
          blank = true;
        units.push(unit.UnitID);
      });
      let modules = 0;
      this.copy.Modules.forEach((module: any) => {
        if (module.IsSelected)
          modules++;
      });
      let selectedUnitList = this.copy.Modules.filter((mod: any) => mod.IsSelected);
      this.unitValidationReqForModule = selectedUnitList.every((mod: any) => !this.moduleAbbrAllowedUnits.includes(mod.ModuleAbbreviation))
      if (!hasError) {
        if (!this.copy.IsUserManager) {
          if (modules == 0)
            this.moduleerror = this.translate.instant('userEdit.modules.atLeastOneModule');
          if (blank && !this.unitValidationReqForModule)
            this.uniterror = this.translate.instant('userEdit.units.blankUnitsFound');
          else {
            if (units.length == 0 && !this.unitValidationReqForModule)
              this.uniterror = this.translate.instant('userEdit.units.atLeastOneUnit');
            else if ((new Set(units)).size !== units.length)
              this.uniterror = this.translate.instant('userEdit.units.removeDuplicates');
          }
          if (this.moduleerror == "" && this.uniterror == "")
            this.saveUserDetails();
        } else
          this.saveUserDetails();
      }
    } else if (this.authenticationMode == 3) {
      let blank: boolean = false;
      let units: any[] = [];
      this.clearErrors();
      let hasError: boolean = false;
      if (!(this.copy.mode !== 'add' ? this.copy.UserName : this.searchFormLocal.value.userName) && !this.searchFormLocal.value.fName && !this.searchFormLocal.value.lName && !this.searchFormLocal.value.mobNo && !this.searchFormLocal.value.userEmailId) {
        this.errorMessage = this.translate.instant('userEdit.validation.fillMandatoryFields');
      } else {
        this.errorMessage = ''
      }
      if (this.searchFormLocal.invalid) {
        return;
      }
      if (this.validateSaveLocal == true) {
        return;
      } else {
        this.copy.Units.forEach((unit: any) => {
          if (unit.UnitID == -1)
            blank = true;
          units.push(unit.UnitID);
        });
        let modules = 0;
        this.copy.Modules.forEach((module: any) => {
          if (module.IsSelected) {
            modules++;
          }
        });
        let selectedUnitList = this.copy.Modules.filter((mod: any) => mod.IsSelected);
        this.unitValidationReqForModule = selectedUnitList.every((mod: any) => !this.moduleAbbrAllowedUnits.includes(mod.ModuleAbbreviation))
        if (!hasError) {
          if (!this.copy.IsUserManager) {
            if (modules == 0) {
              this.moduleerror = this.translate.instant('userEdit.modules.atLeastOneModule');
            }
            else if (blank && !this.unitValidationReqForModule) {
              this.uniterror = this.translate.instant('userEdit.units.blankUnitsFound');
            }
            else {
              if (units.length == 0 && !this.unitValidationReqForModule)
                this.uniterror = this.translate.instant('userEdit.units.atLeastOneUnit');
              else if ((new Set(units)).size !== units.length)
                this.uniterror = this.translate.instant('userEdit.units.removeDuplicates');
            }
            if (this.moduleerror == "" && this.uniterror == "") {
              this.saveUserDetails();
            }
          } else {
            this.saveUserDetails();
          }
        }
      }
    }
  }

  saveUserDetails(): void {
    this.clearErrors();
    let accGUID = "";
    let obj: any = {}
    this.accounts.forEach((account: any) => {
      if (account.Abbreviation == "AMLAK") {
        accGUID = account.AccountGUID;
      }
    });
    let modGUID = "";
    if (this.selectedModule.filter((mod: any) => mod.ModuleAbbreviation === this.modAbTpTrac)[0]?.RoleID == null && this.selectedModule.filter((mod: any) => mod.ModuleAbbreviation === this.modAbTpTrac)[0]?.IsSelected == true) {
      this.moduleerror = this.translate.instant('userEdit.modules.selectRoleDropdown');
      return;
    } else {
      this.moduleerror = '';
    }
    let selectedModulesWithParameters = this.selectedModule.filter(module => module.IsSelected).map(selected => {
      const matchingModule = this.modules.find((module: any) => module.Abbreviation === selected.ModuleAbbreviation);
      return {
        ModuleGUID: matchingModule ? matchingModule.ModuleGUID : null,
        RoleID: selected.RoleID,
        IsFunctionalAdmin: selected.IsFunctionalAdmin
      };
    });
    if (this.authenticationMode == 3) {
      obj['userName'] = this.copy.mode !== 'add' ? this.copy.UserName : this.searchFormLocal.value.userName;
      obj['fName'] = this.searchFormLocal.value?.fName?.trim();
      obj['mName'] = this.searchFormLocal.value?.mName?.trim();
      obj['lName'] = this.searchFormLocal.value?.lName?.trim();
      obj['Designation'] = this.searchFormLocal.value?.Designation?.trim() || '';
      obj['mobNo'] = this.searchFormLocal.value.mobNo;
      obj['userEmailId'] = this.searchFormLocal.value.userEmailId;
      obj['authenticationMode'] = this.authenticationMode;
    } else if (this.authenticationMode == 1) {
      obj['authenticationMode'] = this.authenticationMode;
    }
    this.userService.addAssignUser(this.copy, accGUID, selectedModulesWithParameters, obj).subscribe(res => {
      next:
      if (res.success == 1) {
        this.dialogRef.close(true);
        this.saveSuccess();
      } else {
        if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
          this._utils.relogin(this._document);
        else
          this.saveerror = res.error.errorMessage;
      }
      error:
      console.log("err::", "error");
    });
  }

  saveSuccess(): void {
    const timeout = 3000; // 3 Seconds
    const confirm = this.dialog.open(InfoComponent, {
      disableClose: true,
      minWidth: "300px",
      panelClass: "success",
      data: {
        title: this.translate.instant('userEdit.saveSuccess.title'),
        content: this.translate.instant('userEdit.saveSuccess.content')
      }
    });
    confirm.afterOpened().subscribe(result => {
      setTimeout(() => {
        confirm.close();
      }, timeout)
    });
  }

  clearErrors(): void {
    this.searcherror = "";
    this.saveerror = "";
    this.uniterror = "";
    this.moduleerror = "";
  }

  isAllSelected() {
    const numSelected = this.copy.Modules.filter((row: any) => row.IsSelected).length;
    return numSelected === this.copy.Modules.length;
  }

  isSomeSelected() {
    const numSelected = this.copy.Modules.filter((row: any) => row.IsSelected).length;
    return numSelected > 0 && numSelected < this.copy.Modules.length;
  }

  toggleAllSelection(event: any) {
    const isChecked = event.checked;
    this.copy.Modules.forEach((row: any) => {
      row.IsSelected = isChecked;
      row.ModuleAbbreviation !== this.modAbTpTrac ? row.RoleID = 5 : row.RoleID = null;
      row.IsFunctionalAdmin = false;
      if (isChecked) {
        if (!this.selectedModule.some(m => m.ModuleAbbreviation === row.ModuleAbbreviation)) {
          this.selectedModule.push(row);
        }
      } else {
        this.selectedModule = this.selectedModule.filter(m => m.ModuleAbbreviation !== row.ModuleAbbreviation);
      }
    });
  }

  roleFilter(roleID: number, row: any) {
    row.RoleID = roleID;
  }

  getUserFullName(res: any) {
    let name = ((res?.firstName != null && res?.firstName != undefined) ? res?.firstName : '') + " " +
      ((res?.middleName != null && res?.middleName != undefined) ? res?.middleName : '') + " " +
      ((res?.lastName != null && res?.lastName != undefined) ? res?.lastName : '');
    this.fullName = name.length > 25 ? name.substring(0, 25) + '...' : name
  }

  listenToFormChanges() {
    if (this.authenticationMode == 3) {
      this.searchFormLocal.controls['fName'].valueChanges.subscribe(() => {
        this.updateFullName();
      });
      this.searchFormLocal.controls['mName'].valueChanges.subscribe(() => {
        this.updateFullName();
      });
      this.searchFormLocal.controls['lName'].valueChanges.subscribe(() => {
        this.updateFullName();
      });
      if (this.validateMobNo[0].validateEmailIDDomain == true) {
        this.searchFormLocal.controls['userEmailId'].valueChanges.subscribe(() => {
          this.validateDomainAddressEmailID();
        });
      }
      this.searchFormLocal.controls['mobNo'].valueChanges.subscribe(() => {
        this.validateMobNoLength();
      });
      this.searchFormLocal.controls['userName'].valueChanges.subscribe(() => {
        this.validateUserName();
      });
    }
  }

  validateDomainAddressEmailID() {
    if (!this.searchFormLocal.controls['userEmailId'].hasError('email')) {
      let id: any = this.searchFormLocal.controls['userEmailId'].value;
      id = id.includes('@') ? id.split('@')[1] : null;
      if (this.domainName != null && id) {
        if (this.domainName.toLowerCase() != id.toLowerCase()) {
          this.validateSaveLocal = true;
          return this.translate.instant('userEdit.validation.domainInvalid');
        } else {
          return ''
        }
      } else {
        return ''
      }
    } else {
      this.validateSaveLocal = false;
    }
    return '';
  }

  validateUserName() {
    let userNameLen: number = this.searchFormLocal.controls['userName']?.value.length || 0;
    if (this.searchFormLocal.controls['userName'].hasError('required')) {
      this.validateSaveLocal = true;
      return this.translate.instant('userEdit.validation.userNameRequired');
    } else if (this.searchFormLocal.controls['userName'].hasError('pattern')) {
      this.validateSaveLocal = true;
      return `${this.userNameValidation.MESSAGE}`;
    } else if (userNameLen < this.userNameValidation.MIN_LENGTH || userNameLen > this.userNameValidation.MAX_LENGTH) {
      this.validateSaveLocal = true;
      return this.translate.instant('userEdit.validation.userNameRange', { 
        min: this.userNameValidation.MIN_LENGTH, 
        max: this.userNameValidation.MAX_LENGTH 
      });
    } else {
      this.validateSaveLocal = false;
    }
    return '';
  }

  updateFullName() {
    const firstName = this.searchFormLocal.controls['fName'].value || '';
    const middleName = this.searchFormLocal.controls['mName'].value || '';
    const lastName = this.searchFormLocal.controls['lName'].value || '';
    let fullName = `${firstName} ${middleName} ${lastName}`.trim();
    this.fullName = fullName
  }

  updateFullADName() {
    const firstName = this.copy.FirstName || '';
    const middleName = this.copy.MiddleName || '';
    const lastName = this.copy.LastName || '';
    let fullName = `${firstName} ${middleName} ${lastName}`.trim();
    this.fullName = fullName
  }

  validateMobNoLength() {
    const mobNo = this.searchFormLocal.controls['mobNo'].value || '';
    const mobNoRange = this.validateMobNo[0]?.MobNoRange || [0, 0];
    const isDigitsOnly = /^[0-9]+$/.test(mobNo);
    if (this.validateMobNo[0]?.ValidateMobNo && isDigitsOnly && (mobNo.length < mobNoRange[0] || mobNo.length > mobNoRange[1])) {
      this.validateMobNoL = this.translate.instant('userEdit.validation.mobileRange', { min: mobNoRange[0], max: mobNoRange[1] });
      this.validateSaveLocal = true;
    } else {
      this.validateMobNoL = '';
      this.validateSaveLocal = false;
    }
    return this.validateMobNoL;
  }

  duplicateUnits(unitid: any): any {
    let ob: any = {}
    this.dupUnitIDs.clear();
    this.copy.Units.forEach((n: any) => {
      ob[n.UnitID] = ob[n.UnitID] ? ob[n.UnitID] + 1 : 1;
    })
    for (let key in ob) {
      if (ob[key] > 1) {
        this.dupUnitIDs.add(parseInt(key));
      }
    }
    if (ob[unitid] > 1) {
      this.uniterror = this.translate.instant('userEdit.units.removeDuplicates');
      return unitid
    } else {
      this.uniterror = "";
      return 0
    }
  }

  isUnitDuplicate(unitId: any): any {
    let count = 0;
    this.copy.Units.forEach((unit: any) => {
      if (unit.UnitID === unitId) {
        count++;
        this.uniterror = this.translate.instant('userEdit.units.removeDuplicates');
      } else {
        this.uniterror = "";
      }
    });
    return count > 1;
  }

  onGroupChange(row: any): void {
    if (row.UnitID && this.dupUnitIDs.has(row.UnitID)) {
      this.dupUnitIDs.delete(row.UnitID);
    }
    this.dupUnitIDs.delete(row.UnitID);
    this.clearErrors();
  }

  canAccess(): Boolean {
    if (this.copy.mode == 'add') {
      return true;
    } else if (this.copy.mode == 'edit' && this.copy.IsUserEnabled == 1) {
      return true;
    } else {
      return false;
    }
  }
}
