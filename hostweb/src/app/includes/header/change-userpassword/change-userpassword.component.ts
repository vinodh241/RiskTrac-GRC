import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { InfoComponent } from '../../utilities/popups/info/info.component';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-change-userpassword',
  templateUrl: './change-userpassword.component.html',
  styleUrls: ['./change-userpassword.component.scss']
})
export class ChangeUserpasswordComponent implements OnInit {
  title: any;
  ChangePasswordForm!: FormGroup
  CHANGE_PASSWORD_CONFIG: any;
  CHANGE_PASSWORD_CONFIG_MAX_LENGTH: any;
  CHANGE_PASSWORD_CONFIG_MIN_LENGTH: any;
  CHANGE_PASSWORD_CONFIG_REGEXP_REFERENCE: any;
  passwordMismatch:boolean = false;
  newPassword: any;
  oldpassword: any;
  separator: any;
  submitted:boolean = false;
  showPassword = false;
  changepasswordOTPFlag:boolean = false;
  confirmpassword:any
  changepassword: Boolean = true
  errorMessageLogin:any

  OTPlength: any;
  resendOTPTime: any;
  ButtonForOTP: string = "Send OTP";
  sendResendOTPInfoMessage: string = "Please Click to Receive OTP";
  verifyOTPInfoMessage: string = "Please Click to Verify OTP";
  inputsArray:any;
  OTPsuccess: boolean = false;
  OTPmessage: any
  enteredOTP: any;
  isTimer: boolean = false;
  timeRemaining: any;
  otpDigits: any
  iSOTPForChangePassword: any;
  showChangePasswordOTP: boolean = true;
  submitIsEnabled:boolean = false
  disableButton: boolean = false;
  defaultUserFlag:boolean = false
  disableButtonOtp:boolean = true
  changePasswordOTP: any;
  disableUpdateButton:boolean = false
  wait: any;
  apierrorOTP:any
  conformpassword: any;
  otpDisable:boolean = true

  constructor(@Inject(MAT_DIALOG_DATA) public parent: any,
  private formBuilder: FormBuilder,
  private authService: AuthService,
  private router: Router,
  public dialogRef: MatDialogRef<ChangeUserpasswordComponent>,
  private _dialog: MatDialog,
  private utilservice:UtilsService) {
    this.CHANGE_PASSWORD_CONFIG = JSON.parse(localStorage.getItem('PasswordConfiguration') || "");
    let changepassword = this.CHANGE_PASSWORD_CONFIG
    this.CHANGE_PASSWORD_CONFIG_MAX_LENGTH = changepassword?.MAX_LENGTH;
    this.CHANGE_PASSWORD_CONFIG_MIN_LENGTH = changepassword?.MIN_LENGTH;
    this.changePasswordOTP = localStorage.getItem('changePasswordOTP')
   }

  ngOnInit(): void {
    this.title = this.parent.title
    this.OTPlength = localStorage.getItem('OTPlength')
    this.otpDigits =  Array(Number(this.OTPlength)).fill('');
    this.inputsArray =  Array(Number(this.OTPlength)).fill('');
    this.changePasswordOTP = localStorage.getItem('changePasswordOTP')

    this.resendOTPTime = localStorage.getItem('resendOTPTime')


    this.separator = localStorage.getItem('separator') || "";
    this.initialiseChangePassword()
  }
  initialiseChangePassword(){

    this.ChangePasswordForm = this.formBuilder.group(
      {
        oldpassword: [
          '',
          [
            Validators.required,
            Validators.minLength(this.CHANGE_PASSWORD_CONFIG.MIN_LENGTH),
            Validators.maxLength(this.CHANGE_PASSWORD_CONFIG.MAX_LENGTH),
            Validators.pattern(this.CHANGE_PASSWORD_CONFIG.REGEXP_REFERENCE),
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

  onChangePasswordSubmit(){
    this.submitted = true
    Object.keys(this.ChangePasswordForm.controls).forEach((controlName) => {
      this.ChangePasswordForm.get(controlName)?.markAsTouched();
    });
    if (this.ChangePasswordForm.invalid) {
      return;
    }

    let publicKeyUm = localStorage.getItem('publicKeyUM')


    if(this.changePasswordOTP == "true"){
      this.newPassword = this.ChangePasswordForm.get('newpassword')?.value;
      let accountType = localStorage.getItem('accountType')
      this.confirmpassword = this.ChangePasswordForm.get('confirmCPassword')?.value;
      let usernameLogin = localStorage.getItem('usernameLogin')
      this.oldpassword = this.ChangePasswordForm.get('oldpassword')?.value;
      this.authService.getpasswordHistory(usernameLogin,this.separator, accountType, publicKeyUm,this.newPassword,this.confirmpassword,this.oldpassword).subscribe((res:any) => {
        if (res.success === 1) {
          this.changepasswordOTPFlag = true
          this.disableUpdateButton = false
          this.errorMessageLogin = ''
          this.ButtonForOTP = "Send OTP";
          this.sendResendOTPInfoMessage = "Please Click to Receive OTP";
          this.verifyOTPInfoMessage  = "Please Click to Verify OTP";
          this.changepassword = false
          localStorage.setItem('token', res.token);
        } else {
          // this.loaderLogin = false;
          // this.errorFlag = true;
          this.changepassword = true
          this.changepasswordOTPFlag = false
          this.disableUpdateButton = false
          this.errorMessageLogin = res.error.errorMessage;
          // this.addClass(1);
          if(res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED") {
            this._dialog.closeAll()
            this.utilservice.relogin()
            // this.router.navigate(['']);
        }
          if (res['error'].errorCode == 'INV_WP') {
            this.ChangePasswordForm.controls['oldCPassword'].enable();
          }
          localStorage.setItem('token', res.token);
        }
      });


    }else if(this.changePasswordOTP == "false"){
    this.newPassword = this.ChangePasswordForm.get('newpassword')?.value;
    this.oldpassword = this.ChangePasswordForm.get('oldpassword')?.value;
    this.confirmpassword = this.ChangePasswordForm.get('confirmCPassword')?.value;

    let accountType = localStorage.getItem('accountType')
    let usernameLogin = localStorage.getItem('usernameLogin')
    // oldpassword:any, password:any, separator:any,publickey:any,account:any,confirmPassword:any,username:any
    this.authService.changePasswordLanding(this.oldpassword, this.newPassword, this.separator,publicKeyUm,accountType,this.confirmpassword,usernameLogin).subscribe((res:any) => {
      if (res.success === 1) {
        this.disableUpdateButton = false
        this.saveSuccess(" Password updated successfully")
        this.errorMessageLogin = ''
        this._dialog.closeAll()
        // this.getDataOnSuccessfulLogin(res);
        setTimeout(() => {
        this.router.navigate(['']);
        }, 3000);
        localStorage.setItem('token', res.token);
      } else {
        // this.loaderLogin = false;
        // this.errorFlag = true;
        // this.errorMessageLogin = res['error'].errorMessage;
        // this.addClass(1);
        this.errorMessageLogin = res.error.errorMessage;
        this.disableUpdateButton = false
        if(res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED") {
          this._dialog.closeAll()
          this.utilservice.relogin()
          // this.router.navigate(['']);
      }
        if (res['error'].errorCode == 'INV_WP') {
          this.ChangePasswordForm.controls['oldCPassword'].enable();
        }
        localStorage.setItem('token', res.token);
      }
    });
  }
  }

  sendOTP() {
    this.disableButton = true
    let userID = localStorage.getItem("userguid")
    if (this.ButtonForOTP == "Send OTP" && !this.isTimer) {
      this.authService.sendOTPChangePassword(userID).subscribe((res:any) => {
        if (res.success === 1) {
          this.saveSuccess("OTP sent successfully")
          this.otpDisable = false
          this.disableButton = false
          this.disableButtonOtp = false
          this.ButtonForOTP = "Resend OTP";
          this.apierrorOTP = "";
          if (res.message) {
            this.OTPsuccess = true;
          }
          localStorage.setItem('token', res.token);
          this.StartTimer();
          this.submitIsEnabled = true;
        } else {
          this.disableButtonOtp = false
          this.disableButton = false
          this.ButtonForOTP = "Send OTP";
          this.apierrorOTP = res.error.errorMessage;;
          if (res.error.errorMessage) {
            this.OTPsuccess = false;
          }
            // this.addClass(1);
        if(res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED") {
          this._dialog.closeAll()
          this.utilservice.relogin()
          // this.router.navigate(['']);
      }
          localStorage.setItem('token', res.token);
          this.submitIsEnabled = false;
        }
        this.enteredOTP = '';
      });
    } else if (this.ButtonForOTP == "Resend OTP" && !this.isTimer) {
      this.authService.reSendOTPChangePassword(userID).subscribe((res:any) => {
        if (res.success === 1) {
          this.saveSuccess("OTP sent successfully")
          this.otpDigits = this.otpDigits.map(() => '');
          this.otpDisable = false
          this.ButtonForOTP = "Resend OTP";
          this.disableButtonOtp = false
          this.OTPmessage = res.message;
          this.disableButton = false
          if (res.message) {
            this.OTPsuccess = true;
          }
          this.StartTimer();
          localStorage.setItem('token', res.token);
          this.submitIsEnabled = true;
        } else {
          this.disableButtonOtp = false
          this.disableButton = false
          this.ButtonForOTP = "Resend OTP";
          this.apierrorOTP = res.error.errorMessage;
          if (res.error.errorMessage) {
            this.OTPsuccess = false;
          }
            // this.addClass(1);
        if(res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED") {
          this._dialog.closeAll()
          // this.router.navigate(['']);
          this.utilservice.relogin()
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
    let interval: any;
    let remainingTime = this.resendOTPTime;
    this.isTimer = true;
    interval = setInterval(() => {
      if (remainingTime < 0) {
        clearInterval(interval);
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
    if(this.timeRemaining == '00:00'){
      setTimeout(() => {
      this.disableButton = false

      }, 1000);
    }
  }

  verifyOTP() {
    this.OTPsuccess = false;
    // this.disableButtonOtp = true
    this.enteredOTP = this.otpDigits.join('');
    if (this.enteredOTP == '' || (this.enteredOTP && this.enteredOTP.length != this.OTPlength) || !(/^[0-9]*$/.test(this.enteredOTP))) {
      this.OTPmessage = "Please Enter Valid OTP";
      this.OTPsuccess = false;
      return;
    }

    let accountType = localStorage.getItem('accountType')
    if(this.changePasswordOTP == "true"){
      let changePsswordOTP = "password"
      this.newPassword = this.ChangePasswordForm.get('newpassword')?.value;
      this.oldpassword = this.ChangePasswordForm.get('oldpassword')?.value;
      this.conformpassword = this.ChangePasswordForm.get('confirmCPassword')?.value;

      let usernameLogin = localStorage.getItem('usernameLogin')
      let publicKeyUM = localStorage.getItem('publicKeyUM')
       this.authService.changePasswordLanding(this.oldpassword, this.newPassword, this.separator,publicKeyUM,accountType,this.conformpassword,usernameLogin,this.enteredOTP,changePsswordOTP).subscribe((res:any) => {
         if (res.success === 1) {
          this.disableButtonOtp = false
          this.saveSuccess("Verified OTP,Password updated successfully")
          setTimeout(() => {
            this.router.navigate(['']);
          }, 3000);

          this.dialogRef.close();
           // this.getDataOnSuccessfulLogin(res);
         } else {
           // this.loaderLogin = false;
           // this.errorFlag = true;
           this.apierrorOTP = res.error.errorMessage;
           if(res.error.errorCode && res.error.errorCode == "maxnumber") {
            this.utilservice.relogin()
          }
           // this.addClass(1);
           if(res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED") {
            this._dialog.closeAll()
             this.utilservice.relogin()
            // this.router.navigate(['']);
        }
           if (res['error'].errorCode == 'INV_WP') {
           }
           localStorage.setItem('token', res.token);
         }
       });
    }else if(this.changePasswordOTP == "false"){

      let changePsswordOTP = ""
       this.newPassword = this.ChangePasswordForm.get('newpassword')?.value;
       this.oldpassword = this.ChangePasswordForm.get('oldpassword')?.value;
       this.conformpassword = this.ChangePasswordForm.get('confirmCPassword')?.value;
      let usernameLogin = localStorage.getItem('usernameLogin')
      let publicKeyUM = localStorage.getItem('publicKeyUM')
       this.authService.changePasswordLanding(this.oldpassword, this.newPassword, this.separator,publicKeyUM,accountType,this.conformpassword,usernameLogin,this.enteredOTP,changePsswordOTP).subscribe((res:any) => {
         if (res.success === 1) {
          this.disableButtonOtp = false
          this.saveSuccess("Verified OTP,Password updated successfully")
          setTimeout(() => {
            this.router.navigate(['']);
          }, 3000);

          this.dialogRef.close();
           // this.getDataOnSuccessfulLogin(res);
         } else {
           // this.loaderLogin = false;
           // this.errorFlag = true;
           this.apierrorOTP = res.error.errorMessage;
           if(res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED") {
            this.utilservice.relogin()
            this._dialog.closeAll()
            // this.router.navigate(['']);
        }
           // this.addClass(1);
           if (res['error'].errorCode == 'INV_WP') {
           }
           localStorage.setItem('token', res.token);
         }
       });
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
