import { DOCUMENT } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Component, Inject, Injectable, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { catchError, interval, map, Observable, tap } from 'rxjs';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { WaitComponent } from 'src/app/includes/utilities/popups/wait/wait.component';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

@Injectable({
  providedIn: 'root'
})
export class LoginComponent implements OnInit {
  logoPath: string | null = '/assets/Logo.png';
  // @ts-ignore
  authForm: FormGroup;
  // @ts-ignore
  separator;
  // @ts-ignore
  serverTime;
  // @ts-ignore
  wait;
  publicKey: any;
  publicKeyUM: any
  hide = true;
  apierror = "";
  apierrorForgotPassword = "";
  apierrorOTP = "";
  apierrorChangePassword = "";
  accountOptions: any;
  forgotPasswordForm!: FormGroup;
  submitted = false;
  passwordMismatch = false;
  userForgotErrors = '';
  showPassword = false;
  forgotPasswordFlag: boolean = false
  otpFlag: boolean = false
  forgotOTP: boolean = false
  OTPlength: any;
  resendOTPTime: any;
  ButtonForOTP: string = "Send OTP";
  sendResendOTPInfoMessage: string = "Please Click to Receive OTP";
  verifyOTPInfoMessage: string = "Please Click to Verify OTP";
  inputsArray: any;
  OTPsuccess: boolean = false;
  OTPmessage: any
  enteredOTP: any;
  isTimer: boolean = false;
  timeRemaining: any;
  otpDigits: any
  iSOTPForChangePassword: any;
  showChangePasswordOTP: boolean = true;
  submitIsEnabled: boolean = false
  disableButton: boolean = false;
  otpDisable: boolean = true
  USER_ID_CONFIG: any
  CHANGE_PASSWORD_CONFIG: any;
  CHANGE_PASSWORD_CONFIG_MAX_LENGTH: any;
  CHANGE_PASSWORD_CONFIG_MIN_LENGTH: any;
  CHANGE_PASSWORD_CONFIG_REGEXP_REFERENCE: any;
  validateSaveLocal: any
  defaultUserFlag: boolean = false
  disableButtonOtp: boolean = true
  defaultUserData: boolean = false
  ChangePasswordForm!: FormGroup
  newPassword: any;
  oldpassword: any;
  forgotPassword: boolean = false;
  authenticationModeDetails: any;
  changePasswordOTP: any;
  conformpassword: any;
  changepasswordflag: any;
  userName: any;
  userID: any;
  userId: any;
  verifyOtp: boolean = false;
  loginConfig: any;
  passwordExpire: boolean = false
  type: any
  emailIDLanding: any;
  projectLanding: any;
  errorCodeLogin: any
  verifiyAccErr: string = '';
  interval: any

  constructor(
    private utils: UtilsService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private _dialog: MatDialog,
    @Inject(DOCUMENT) private document: any,
    private fb: FormBuilder,
    private utilservice: UtilsService
  ) {
  }

  ngOnInit(): void {
    localStorage.clear();
    localStorage.setItem('publicPage', '0');
    localStorage.setItem('showmenu', 'false');
    this.authForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      accountType: ['', Validators.required]
    });
    this.authForm.controls['accountType'].valueChanges.subscribe(value => {
      if (value && value.length > 0) {
        this.forgotPassword = true;
      } else {
        this.forgotPassword = false;
      }
    });
    this.authService.getPublicKey()
      .subscribe((response: any) => {
        next:
        this.publicKey = response.result.publicKey;
        this.publicKeyUM = response.result.publicKeyUM;
        localStorage.setItem('publicKeyUM', this.publicKeyUM);
        this.separator = response.result.separator;
        localStorage.setItem('separator', this.separator);
        this.serverTime = response.result.serverTime;
        this.OTPlength = response?.result?.OTPLength
        localStorage.setItem('OTPlength', this.OTPlength)
        this.otpDigits = Array(Number(this.OTPlength)).fill('');
        localStorage.setItem('otpDigits', this.otpDigits)
        this.inputsArray = new Array(Number(this.OTPlength)).fill('');
        localStorage.setItem('inputsArray', this.inputsArray)
        this.CHANGE_PASSWORD_CONFIG = response?.result?.CHANGE_PASSWORD_CONFIG;
        localStorage.setItem('PasswordConfiguration', JSON.stringify(this.CHANGE_PASSWORD_CONFIG));
        let changepassword = this.CHANGE_PASSWORD_CONFIG
        this.CHANGE_PASSWORD_CONFIG_MAX_LENGTH = changepassword?.MAX_LENGTH;
        this.CHANGE_PASSWORD_CONFIG_MIN_LENGTH = changepassword?.MIN_LENGTH;
        this.USER_ID_CONFIG = response['result'].USER_NAME_CONFIG;
        this.authenticationModeDetails = response?.result?.authenticationMode
        localStorage.setItem('authenticationModeDetails', this.authenticationModeDetails);
        this.resendOTPTime = Number(response?.result?.ResentOTPTime)
        localStorage.setItem('resendOTPTime', this.resendOTPTime);
        this.changePasswordOTP = response?.result?.IS_OTP_FOR_CHANGE_PASSWORD
        localStorage.setItem('changePasswordOTP', this.changePasswordOTP);
        this.loginConfig = response?.result?.MFA_CONFIG_IS_MFA
        this.emailIDLanding = response?.result?.LOGIN_PAGE_DATA?.LANDING_EMAILID;
        localStorage.setItem('emailIDLanding', this.emailIDLanding);
        this.projectLanding = response?.result?.LOGIN_PAGE_DATA?.LANDING_TEXT;
        localStorage.setItem('projectLanding', this.projectLanding);
        if (response.success === 1) {
          this.getAccountsResult();
        }
        error: this.handleError.bind(this)
      });
  }

  getHTTPHeaders(): HttpHeaders {
    const result = new HttpHeaders();
    result.set('Content-Type', 'application/json');
    return result;
  }

  public onSubmit(): void {
    if (this.authForm.valid) {
      this.openWait()
      let username = this.authForm.value.username
      localStorage.setItem('usernameLogin', username)
      if (this.authenticationModeDetails == 1) {
        if (username.indexOf("@") == -1)
          username += "@" + environment.domain
      }
      let account = this.authForm.value.accountType
      localStorage.setItem('accountType', this.authForm.value.accountType);
      this.authService.login(username, this.authForm.value.password, this.publicKey, this.separator, this.serverTime, account)
        .subscribe({
          next: this.getlogin.bind(this),
          error: this.handleError.bind(this)
        });
    }
  }

  getlogin(response: any) {
    this.closeWait()
    localStorage.setItem('token', response.token);
    localStorage.setItem('tokenlOGIN', response.token);
    if (response.success) {
      let login = response.result.loginData[0];
      let roles = response.result.roleData || [];
      let auths = response.result.authorizedModuleData || [];
      const roleoRaw = response.result.userModuleRoleData || [];
      const listModRaw = response.result.moduleList || [];
      const authAbbrevs = new Set(
        (auths || [])
          .map((a: any) => (a?.Abbreviation || a?.ModuleAbbreviation || '').toString().trim().toUpperCase())
          .filter(Boolean)
      );
      const roleo = Array.isArray(roleoRaw)
        ? roleoRaw.filter((r: any) => {
          const rAbbrev = (r?.Abbreviation || r?.ModuleName || '').toString().trim().toUpperCase();
          return authAbbrevs.has(rAbbrev);
        })
        : [];
      const listMod = Array.isArray(listModRaw)
        ? listModRaw.filter((m: any) => {
          const modAbbrev = (m?.ModuleAbbreviation || m?.Abbreviation || m?.ModuleName || '').toString().trim().toUpperCase();
          return authAbbrevs.has(modAbbrev);
        })
        : [];
      if (Array.isArray(listMod)) {
        const seen = new Set<string>();
        listMod.forEach((m: any, idx: number) => {
          if (!m) return;
          const rawKey = (m.ModuleAbbreviation)?.toString();
          const key = rawKey.replace(/\s+/g, '_').toLowerCase();
          if (seen.has(key)) {
            return;
          }
          seen.add(key);
          if (m.ModuleName) {
            localStorage.setItem(key, m.ModuleName);
          } else {
            localStorage.setItem(key, JSON.stringify(m));
          }
        });
      }
      const modules = roleo.map((n: any) => n.ModuleName);
      const formattedModules = modules.length > 1 ?
        modules.slice(0, -1).join(', ') + ' ' + '<span style="color:black;"> and </span>' + ' '
        + modules[modules.length - 1] : modules[0];
      localStorage.setItem('modules', formattedModules);
      let userUnitData = response.result.userUnitData;
      let bcmStreeringCommittee = response.result?.bcmStreeringCommittee || [];
      let role = 'XX';
      if (login && auths && roles && roleo) {
        localStorage.setItem('userguid', login.UserGUID)
        let mods: any[] = [];
        roleo.forEach((r: any) => {
          const module = auths.find((a: any) => a.ModuleGUID === r.ModuleGUID);
          if (module) {
            mods.push(module.Abbreviation);
          }
        });
        localStorage.setItem('mods', mods.join(','))
        let sa = -1;
        let um = -1;
        let pu = -1;
        let su = -1;
        roles.forEach((role: any) => {
          if (role.Abbreviation == "SA") sa = role.RoleID;
          if (role.Abbreviation == "UM") um = role.RoleID;
          if (role.Abbreviation == "PU") pu = role.RoleID;
          if (role.Abbreviation == "SU") su = role.RoleID;
        });
        if (login.RoleID == sa) role = 'SA';
        if (login.RoleID == um) role = 'UM';
        localStorage.setItem('role', role);
        roleo.forEach((roles: any) => {
          role = 'XX';
          if (roles.RoleID == su) { role = 'SU'; }
          if (roles.RoleID == pu) {
            role = 'PU';
            if (roles.IsFunctionalAdmin)
              role = 'FA';
          }
          if (roles.Abbreviation == "BCM") localStorage.setItem('rbcm', role);
          if (roles.Abbreviation == "ORM") localStorage.setItem('rorm', role);
          if (roles.Abbreviation == "DMS") localStorage.setItem('rdm', role);
        });
        localStorage.setItem('username', response.result.loginData[0].FullName);
        localStorage.setItem('userUnitData', JSON.stringify(userUnitData));
        localStorage.setItem('bcmStreeringCommittee', JSON.stringify(bcmStreeringCommittee));
      }
      if (this.loginConfig && this.authenticationModeDetails == 3) {
        localStorage.setItem('publicPage', '0');
        this.type = "login"
        this.otpFlag = true
      } else {
        localStorage.setItem('publicPage', '1');
        let login = response.result.loginData[0];
        let roles = response.result.roleData || [];
        let auths = response.result.authorizedModuleData || [];
        const roleoRaw = response.result.userModuleRoleData || [];
        const authAbbrevs = new Set(
          (auths || [])
            .map((a: any) => (a?.Abbreviation || a?.ModuleAbbreviation || '').toString().trim().toUpperCase())
            .filter(Boolean)
        );

        const roleo = Array.isArray(roleoRaw)
          ? roleoRaw.filter((r: any) => {
            const rAbbrev = (r?.Abbreviation || r?.ModuleName || '').toString().trim().toUpperCase();
            return authAbbrevs.has(rAbbrev);
          })
          : [];

        const modules = roleo.map((n: any) => n.ModuleName);
        const formattedModules = modules.length > 1 ? modules.slice(0, -1).join(', ') + ' ' + '<span style="color:black;"> and </span>' + ' ' + modules[modules.length - 1] : modules[0];
        localStorage.setItem('modules', formattedModules);
        let userUnitData = response.result.userUnitData;
        let bcmStreeringCommittee = response.result?.bcmStreeringCommittee || [];
        let role = 'XX';
        if (login && auths && roles && roleo) {
          localStorage.setItem('userguid', login.UserGUID)
          let mods: any[] = [];
          roleo.forEach((r: any) => {
            const module = auths.find((a: any) => a.ModuleGUID === r.ModuleGUID);
            if (module) {
              mods.push(module.Abbreviation);
            }
          });
          localStorage.setItem('mods', mods.join(','))
          let sa = -1;
          let um = -1;
          let pu = -1;
          let su = -1;
          roles.forEach((role: any) => {
            if (role.Abbreviation == "SA") sa = role.RoleID;
            if (role.Abbreviation == "UM") um = role.RoleID;
            if (role.Abbreviation == "PU") pu = role.RoleID;
            if (role.Abbreviation == "SU") su = role.RoleID;
          });
          if (login.RoleID == sa) role = 'SA';
          if (login.RoleID == um) role = 'UM';
          localStorage.setItem('role', role);
          roleo.forEach((roles: any) => {
            role = 'XX';
            if (roles.RoleID == su) { role = 'SU'; }
            if (roles.RoleID == pu) {
              role = 'PU';
              if (roles.IsFunctionalAdmin)
                role = 'FA';
            }
            if (roles.Abbreviation == "BCM") localStorage.setItem('rbcm', role);
            if (roles.Abbreviation == "ORM") localStorage.setItem('rorm', role);
            if (roles.Abbreviation == "DMS") localStorage.setItem('rdm', role);
          });
          localStorage.setItem('username', response.result.loginData[0].FullName);
          localStorage.setItem('userUnitData', JSON.stringify(userUnitData));
          localStorage.setItem('bcmStreeringCommittee', JSON.stringify(bcmStreeringCommittee));
          localStorage.setItem('showmenu', 'true');
          this.router.navigate(['landing']);
        }
      }
    } else {
      this.errorCodeLogin = response?.error?.errorCode;
      localStorage.setItem('userguid', response.result?.userId)
      if (this.loginConfig && this.authenticationModeDetails == 3 && (response.error.errorCode == 'DefaultPasswordReset' || response.error.errorCode == 'ForcePasswordReset')) {
        localStorage.setItem('publicPage', '0');
        this.type = "login"
        this.otpFlag = true
      } else if (response.error.errorCode == 'DefaultPasswordReset' || response.error.errorCode == 'ForcePasswordReset') {
        this.wait.close()
        this.type = "ChangePWD"
        this.apierror = ""
        this.defaultUserFlag = true
        this.apierrorOTP = ""
        if (response.error.errorCode == 'ForcePasswordReset') {
          this.passwordExpire = true;
        } else {
          this.passwordExpire = false;
        }
        this.initialiseChangePassword()
      }
      if (response.error.errorCode == "PAGE_EXPIRED")
        this.utils.relogin(this.document)
      else
        this.apierror = response.error.errorMessage;
    }
  }

  private handleError(error: any) {
    this.closeWait();
    const status = error?.status;
    if (status === 502 || status === 503 || status === 504) {
      this.apierror = 'Authentication service is temporarily unavailable. Please check that the User Management API (umapi) is running and try again.';
    } else if (error?.error?.error?.errorMessage) {
      this.apierror = error.error.error.errorMessage;
    } else if (error?.message) {
      this.apierror = error.message;
    } else {
      this.apierror = 'An error occurred. Please try again.';
    }
  }

  getErrorMessage() {
    if (this.authForm.get('username')?.hasError('required')) {
      return 'User name is required';
    }
    if (this.authForm.get('password')?.hasError('required')) {
      return 'Password is required';
    }
    if (this.authForm.get('accountType')?.hasError('required')) {
      return 'CRN is required';
    }
    return '';
  }

  openWait(): void {
    this.wait = this._dialog.open(WaitComponent, {
      disableClose: true,
      panelClass: "dark",
      data: {
        text: "Signing In ..."
      }
    })
  }

  closeWait(): void {
    this.wait.close()
  }

  onRightClick(event: Event) {
    event.preventDefault();
  }

  getAccountsResult(): void {
    this.authService.getAllAccounts().subscribe((response: any) => {
      this.accountOptions = response.result[0]
    })
  }

  get f1() {
    return this.forgotPasswordForm.controls;
  }

  onForgotPasswordSubmit(): void {
    // this.otpFlag = true
    // this.forgotPasswordFlag = false;
    this.submitted = true;
    // this.passwordMismatch = false;
    if (this.forgotPasswordForm.invalid) {
      return;
    }
    localStorage.setItem('accountType', this.authForm.value.accountType);
    this.authService.verifyUserDetails(this.forgotPasswordForm.value, this.separator, this.publicKeyUM, this.authForm.value.accountType).subscribe((response: any) => {
      if (response.success === 1) {
        this.forgotPasswordFlag = false;
        this.type = "ForgotPWD"
        this.forgotOTP = true
        this.otpFlag = true;
        this.submitted = false
        this.apierrorForgotPassword = ''
        this.userId = response.result.userID
        localStorage.setItem("userID", this.userId)
      } else {
        this.apierrorForgotPassword = response.error.errorMessage;;
      }
    });
  }

  // Reset the form
  resetForgetPassword(): void {
    this.submitted = false;
    this.passwordMismatch = false;
    this.userForgotErrors = '';
    this.forgotPasswordForm.reset();
  }

  onclickForgot() {
    this.authService.verifyAccountDetails(this.publicKeyUM, this.authForm.value.accountType).subscribe((response: any) => {
      if (response.success === 1) {
        this.forgotPasswordFlag = true
        this.otpFlag = false
        this.initialiseforgot()
      } else {
        this.verifiyAccErr = response.error.errorMessage;;
      }
    });
  }

  initialiseforgot() {
    this.forgotPasswordForm = this.formBuilder.group(
      {
        userID: [
          '',
          [
            Validators.required,
            Validators.minLength(this.USER_ID_CONFIG.MIN_LENGTH),
            Validators.maxLength(this.USER_ID_CONFIG.MAX_LENGTH),
            Validators.pattern(this.USER_ID_CONFIG.REGEXP_REFERENCE),
          ],
        ],
        emailID: [
          '',
          [
            Validators.required,
            Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
          ],
        ],
        firstName: [
          '',
          [
            Validators.required,
            Validators.pattern('^[a-zA-Z ]+$'),
          ],
        ],
        lastfName: [
          '',
          [
            Validators.required,
            Validators.pattern('^[a-zA-Z ]+$'),
          ],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(this.CHANGE_PASSWORD_CONFIG.MIN_LENGTH),
            Validators.maxLength(this.CHANGE_PASSWORD_CONFIG.MAX_LENGTH),
            Validators.pattern(this.CHANGE_PASSWORD_CONFIG.REGEXP_REFERENCE),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
    );
    this.forgotPasswordForm.controls['userID'].setValue("");
  }

  valueChangeUser() {
    this.forgotPasswordForm.controls['userID'].valueChanges.subscribe(() => {
      this.validateUserName()
    });
  }

  validateUserName() {
    let userNameLen: number = this.forgotPasswordForm.controls['userID']?.value.length || 0;
    if (this.forgotPasswordForm.controls['userID'].hasError('required')) {
      return `User Name is required`;
    } else if (this.forgotPasswordForm.controls['userID'].hasError('pattern')) {
      this.validateSaveLocal = true;
      return `${this.USER_ID_CONFIG.MESSAGE}`;
    } else if (userNameLen < this.USER_ID_CONFIG.MIN_LENGTH || userNameLen > this.USER_ID_CONFIG.MAX_LENGTH) {
      this.validateSaveLocal = true;
      return `User Name should contain ${this.USER_ID_CONFIG.MIN_LENGTH} - ${this.USER_ID_CONFIG.MAX_LENGTH} characters long`
    }
    this.validateSaveLocal = false;
    return '';
  }

  // valueChangeCRN(){
  //   this.authForm.controls['accountType'].valueChanges.subscribe(() => {
  //     this.validateCRN()
  //    });
  // }
  // validateCRN() {
  //   if(this.authForm.controls['accountType'].hasError('required')){
  //     return `CRN Number is required`;
  //   }else if (this.authForm.controls['accountType'].hasError('pattern') ) {
  //     return `User Name should contain (A-Z,a-z), (0-9).`;
  //   }
  //   return '';
  // }

  onCancel() {
    this.forgotPasswordFlag = false
    this.otpFlag = false
    this.forgotPasswordForm.reset();
  }

  passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const newPassword = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  };

  onBackspaceKey(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace' && index > 0 && this.otpDigits[index] === '') {
      this.focusPreviousInput(index);
    }
  }

  focusPreviousInput(index: number): void {
    const prevIndex = index - 1;
    const prevInput = document.getElementById('digit' + (prevIndex + 1)) as HTMLInputElement;
    if (prevInput) {
      prevInput.focus();
    }
  }

  onDigitChanged(index: number, newValue: string): void {
    if (newValue.length > 0 && index < this.OTPlength - 1) {
      this.focusNextInput(index);
    }
  }

  private focusNextInput(index: number): void {
    const nextIndex = index + 1;
    const nextInput = document.getElementById('digit' + (nextIndex + 1)) as HTMLInputElement;
    if (nextInput) {
      nextInput.focus();
    }
  }

  sendOTP() {
    this.disableButtonOtp = true;
    this.disableButton = true;
    let userID = localStorage.getItem("userID") ? localStorage.getItem("userID") : localStorage.getItem("userguid")
    if (this.ButtonForOTP == "Send OTP" && !this.isTimer) {
      this.authService.sendOTP(userID, this.type).subscribe((res: any) => {
        if (res.success === 1) {
          this.saveSuccess("OTP sent successfully")
          this.otpDisable = false
          this.disableButton = false;
          this.disableButtonOtp = false;
          this.ButtonForOTP = "Resend OTP";
          this.apierrorOTP = "";
          if (res.message) {
            this.OTPsuccess = true;
          }
          localStorage.setItem('token', res.token);
          this.StartTimer();
          this.submitIsEnabled = true;
        } else {
          this.disableButton = false
          this.ButtonForOTP = "Send OTP";
          this.apierrorOTP = res.error.errorMessage;
          if (res['error'].errorMessage) {
            this.OTPsuccess = false;
          }
          localStorage.setItem('token', res.token);
          this.submitIsEnabled = false;
        }
        this.enteredOTP = '';
      });
    } else if (this.ButtonForOTP == "Resend OTP" && !this.isTimer) {
      this.authService.reSendOTP(userID, this.type).subscribe((res: any) => {
        if (res.success === 1) {
          this.otpDigits = this.otpDigits.map(() => '');
          this.otpDisable = false
          this.saveSuccess("OTP sent successfully")
          this.ButtonForOTP = "Resend OTP";
          this.disableButtonOtp = false;
          this.apierrorOTP = '';
          this.disableButton = false
          if (res.message) {
            this.OTPsuccess = true;
          }
          this.StartTimer();
          localStorage.setItem('token', res.token);
          this.submitIsEnabled = true;
        } else {
          this.disableButton = false
          this.ButtonForOTP = "Resend OTP";
          this.apierrorOTP = res.error.errorMessage;
          if (res.error.errorMessage) {
            this.OTPsuccess = false;
          }
          localStorage.setItem('token', res.token);
          this.submitIsEnabled = false;
        }
        this.enteredOTP = '';
      });
    }
  }

  StartTimer() {
    this.disableButton = true
    let remainingTime = this.resendOTPTime;
    this.isTimer = true;
    this.interval = setInterval(() => {
      if (remainingTime < 0) {
        clearInterval(this.interval);
        this.isTimer = false;
      } else {
        this.updateTimerDisplay(remainingTime);
        remainingTime--;
      }
    }, 1000);
  }

  updateTimerDisplay(time: number): void {
    const minutes: number = Math.floor(time / 60);
    const seconds: number = time % 60;
    const timeString: string = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    this.timeRemaining = timeString;
    if (this.timeRemaining == '00:00') {
      setTimeout(() => {
        this.disableButton = false
      }, 1000);
    }
  }

  verifyOTP() {
    this.OTPsuccess = false;
    this.disableButtonOtp = true
    this.enteredOTP = this.otpDigits.join('');
    if (this.enteredOTP === '' || this.enteredOTP.length !== this.OTPlength || !/^\d+$/.test(this.enteredOTP)) {
      this.apierrorOTP = "Invalid OTP, Please Enter the correct OTP to proceed.";
      this.OTPsuccess = false;
      this.disableButtonOtp = false;
      return;
    }
    if (this.loginConfig && this.authenticationModeDetails == 3 && !this.forgotOTP && (this.errorCodeLogin == 'DefaultPasswordReset' || this.errorCodeLogin == 'ForcePasswordReset')) {
      //   this.wait.close()
      //   // this.saveSuccess(response.error.errorMessage)
      //    this.type = "ChangePWD"
      //   this.apierror = ""
      //   this.defaultUserFlag = true
      //   this.apierrorOTP = ""
      //   this.initialiseChangePassword()
      this.changepasswordflag = "forgetOTP"
      let userguid = localStorage.getItem('userguid')
      let separator = localStorage.getItem('separator')
      let accountType = localStorage.getItem('accountType')
      this.authService.verifyOTP(this.enteredOTP, userguid, separator, this.authForm.value.password, accountType, this.publicKeyUM, false).subscribe((res: any) => {
        if (res.success === 1) {
          clearInterval(this.interval);
          this.saveSuccess("OTP verified")
          if (this.errorCodeLogin == 'DefaultPasswordReset' || this.errorCodeLogin == 'ForcePasswordReset') {
            this.wait.close()
            // this.saveSuccess(response.error.errorMessage)
            this.type = "ChangePWD"
            this.apierror = ""
            this.defaultUserFlag = true
            this.otpFlag = false
            this.apierrorOTP = ""
            this.ButtonForOTP = "Send OTP"
            this.isTimer = false
            this.otpDigits = this.otpDigits.map(() => '');
            this.errorCodeLogin = ""
            this.initialiseChangePassword()
          }
          // this.getDataOnSuccessfulLogin(res);
        } else {
          this.disableButtonOtp = false;
          // if(res.error){
          this.apierrorOTP = res.error.errorMessage;
          if (res.error.errorCode && res.error.errorCode == "maxnumber") {
            this.utilservice.relogin()
          }
          if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED") {
            this.utilservice.relogin()
          }
          if (res.error.errorCode === "SES-INV-TKN-01") {
            setTimeout(() => {
              // this.router.navigate(['/login']);
              location.reload();
            }, 5000);
          }
          // SES-INV-TKN-01
        }
        this.enteredOTP = '';
      });
    } else if (this.changePasswordOTP == true && this.defaultUserData) {
      this.changepasswordflag = "ChangePasswordOTP"
      this.newPassword = this.ChangePasswordForm.get('newpassword')?.value;
      this.oldpassword = this.ChangePasswordForm.get('oldpassword')?.value;
      this.conformpassword = this.ChangePasswordForm.get('confirmCPassword')?.value;
      let username = this.authForm.value.username
      let accountType = localStorage.getItem('accountType')
      this.authService.changePassword(this.oldpassword, this.newPassword, this.separator, this.publicKeyUM, accountType, this.conformpassword, username, this.changepasswordflag, this.enteredOTP).subscribe((res: any) => {
        if (res.success === 1) {
          clearInterval(this.interval);
          this.saveSuccess("OTP verified,Password updated successfully")
          // this.getDataOnSuccessfulLogin(res);
          //  location.reload();
          setTimeout(() => {
            this.router.navigate(['/login']);
            location.reload();
          }, 3000);
        } else {
          if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED") {
            this.utilservice.relogin()
          }
          this.apierrorOTP = res.error.errorMessage;
          // this.addClass(1);
          if (res.error.errorCode && res.error.errorCode == "maxnumber") {
            this.utilservice.relogin()
          }
          this.disableButtonOtp = false;
          if (res['error'].errorCode == 'INV_WP') {
          }
          localStorage.setItem('token', res.token);
        }
      });
    } else if (this.forgotOTP) {
      this.changepasswordflag = "forgetOTP"
      let userguid = localStorage.getItem('userguid')
      let separator = localStorage.getItem('separator')
      let accountType = localStorage.getItem('accountType')
      this.authService.verifyOTP(this.enteredOTP, this.userId, separator, this.forgotPasswordForm.value.password, accountType, this.publicKeyUM, true).subscribe((res: any) => {
        if (res.success === 1) {
          clearInterval(this.interval);
          this.saveSuccess("OTP verified,Password has been updated successfully ")
          this.disableButtonOtp = false
          this.isTimer = false
          this.apierrorForgotPassword = ''
          this.ButtonForOTP = "Resend OTP";
          this.OTPmessage = res.message;
          if (res.message) {
            this.OTPsuccess = true;
          }
          this.disableButton = true;
          // this.getDataOnSuccessfulLogin(res);
          setTimeout(() => {
            this.router.navigate(['/login']);
            location.reload();
          }, 3000);
          localStorage.setItem('token', res.token);
        } else {
          this.disableButtonOtp = false;
          // if(res.error){
          this.apierrorOTP = res.error.errorMessage;
          if (res.error.errorCode && res.error.errorCode == "maxnumber") {
            this.utilservice.relogin()
          }
          if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED") {
            this.utilservice.relogin()
          }
          if (res.error.errorCode === "SES-INV-TKN-01") {
            setTimeout(() => {
              // this.router.navigate(['/login']);
              location.reload();
            }, 5000);
          }
          // SES-INV-TKN-01
        }
        this.enteredOTP = '';
      });
    } else if (this.loginConfig && this.otpFlag && !this.defaultUserData) {
      this.changepasswordflag = "loginOTP"
      let username = localStorage.getItem('usernameLogin')
      let userguid = localStorage.getItem('userguid')
      let separator = localStorage.getItem('separator')
      let accountType = localStorage.getItem('accountType')
      this.authService.verifyOTPLogin(this.enteredOTP, username, separator, accountType, this.publicKeyUM).subscribe((res: any) => {
        if (res.success === 1) {
          clearInterval(this.interval);
          localStorage.setItem('publicPage', '1');
          this.isTimer = false
          this.saveSuccess("Logged in successfully")
          this.disableButtonOtp = false
          setTimeout(() => {
            localStorage.setItem('showmenu', 'true');
            this.router.navigate(['landing']);
          }, 3000);
          this.apierrorForgotPassword = ''
          this.ButtonForOTP = "Resend OTP";
          this.OTPmessage = res.message;
          if (res.message) {
            this.OTPsuccess = true;
          }
          this.disableButton = true;
          // this.getDataOnSuccessfulLogin(res);
          localStorage.setItem('token', res.token);
        } else {
          this.disableButtonOtp = false;
          // if(res.error){
          this.apierrorOTP = res.error.errorMessage;
          if (res.error.errorCode && res.error.errorCode == "maxnumber") {
            this.utilservice.relogin()
          }
          if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED") {
            this.utilservice.relogin()
          }
          if (res.error.errorCode === "SES-INV-TKN-01") {
            setTimeout(() => {
              // this.router.navigate(['/login']);
              location.reload();
            }, 5000);
          }
          // SES-INV-TKN-01
        }
        this.enteredOTP = '';
      });
    } else {
    }
  }

  changePassword() {
    this.defaultUserFlag = true
    this.forgotPasswordFlag = false
    this.otpFlag = false
    this.initialiseChangePassword()
  }

  onChangePasswordSubmit() {
    // if (this.ChangePasswordForm.get('newpassword')?.value !== this.ChangePasswordForm.get('confirmCPassword')?.value) {
    //   this.passwordMismatch = true;
    //   return;
    // } else {
    //   this.passwordMismatch = false;
    // }
    this.submitted = true
    this.changepasswordflag = ""
    this.newPassword = this.ChangePasswordForm.get('newpassword')?.value;
    this.oldpassword = this.ChangePasswordForm.get('oldpassword')?.value;
    this.conformpassword = this.ChangePasswordForm.get('confirmCPassword')?.value;
    let username = this.authForm.value.username
    let accountType = localStorage.getItem('accountType')
    Object.keys(this.ChangePasswordForm.controls).forEach((controlName) => {
      this.ChangePasswordForm.get(controlName)?.markAsTouched();
    });
    if (this.ChangePasswordForm.invalid) {
      return
    }
    if (this.changePasswordOTP == true) {
      this.authService.getUserDetails(username, this.separator, accountType, this.publicKeyUM, this.newPassword, this.oldpassword, this.conformpassword).subscribe((res: any) => {
        if (res.success === 1) {
          let userId = res?.result?.userID
          localStorage.setItem("userID", userId)
          this.otpFlag = true
          this.defaultUserFlag = false
          this.defaultUserData = true
          this.disableButton = false
        } else {
          this.apierrorChangePassword = res.error.errorMessage;
          this.otpFlag = false
          this.defaultUserFlag = true
        }
      })
    } else {
      this.authService.changePassword(this.oldpassword, this.newPassword, this.separator, this.publicKeyUM, accountType, this.conformpassword, username, this.changepasswordflag).subscribe((res: any) => {
        if (res.success === 1) {
          // this.getDataOnSuccessfulLogin(res);
          this.defaultUserFlag = false
          this.saveSuccess("Password changed successfully")
          this.apierrorChangePassword = ''
          this.ChangePasswordForm.disable();
          // location.reload();
          localStorage.setItem('token', res.token);
          this.disableButton = true;
          setTimeout(() => {
            this.router.navigate(['/login']);
            location.reload();
          }, 3000);
        } else {
          // this.loaderLogin = false;
          // this.errorFlag = true;
          this.defaultUserFlag = true
          this.apierrorChangePassword = res.error.errorMessage;
          if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED") {
            this.utilservice.relogin()
          }
          if (res['error'].errorCode == 'INV_WP') {
            this.ChangePasswordForm.controls['oldCPassword'].enable();
          }
          localStorage.setItem('token', res.token);
        }
      });
    }
  }

  initialiseChangePassword() {
    this.apierror = ''
    this.ChangePasswordForm = this.formBuilder.group(
      {
        oldpassword: [
          '',
          [
            Validators.required,
            // Validators.minLength(this.CHANGE_PASSWORD_CONFIG.MIN_LENGTH),
            // Validators.maxLength(this.CHANGE_PASSWORD_CONFIG.MAX_LENGTH),
            // Validators.pattern(this.CHANGE_PASSWORD_CONFIG.REGEXP_REFERENCE),
          ],
        ],
        newpassword: [
          '',
          [
            Validators.required,
            Validators.minLength(this.CHANGE_PASSWORD_CONFIG.MIN_LENGTH),
            Validators.maxLength(this.CHANGE_PASSWORD_CONFIG.MAX_LENGTH),
            Validators.pattern(this.CHANGE_PASSWORD_CONFIG.REGEXP_REFERENCE),
          ],
        ],
        confirmCPassword: ['', Validators.required],
      }
    )
  }

  getAccountName(value: any) {
    if (value) {
      this.forgotPassword = false
    }
  }

  saveSuccess(content: string): void {
    const timeout = 3000; // 3 Seconds
    const confirm = this._dialog.open(InfoComponent, {
      id: "InfoComponent",
      disableClose: true,
      minWidth: "5vh",
      panelClass: "success",
      data: {
        title: "Success",
        content: content
      }
    });
    confirm.afterOpened().subscribe((result: any) => {
      setTimeout(() => {
        confirm.close();
      }, timeout)
    });
  }

}