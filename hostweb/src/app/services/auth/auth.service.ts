import { Injectable } from '@angular/core';
// import { BehaviorSubject, Observable, Subject, from, throwError, observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
// import 'rxjs/add/operator/catch';
// import 'rxjs/add/observable/throw';
import { HttpParams, HttpHeaders } from '@angular/common/http';
// import { map, catchError, tap, switchMap } from 'rxjs/operators';
import { TokenStorage } from './token-storage.service';
import { AccessData } from './access-data';


import * as JsEncryptModule from 'jsencrypt';
import { Observable } from 'rxjs';

const API_MEMBER_URL = environment.umapiUrl;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  $encrypt: any;
  // public onCredentialUpdated$: Subject<AccessData>;
  $encryptCaptcha: any;
  private loggedInUserRoleID = 0;
  private loggedInUserID = 0;
  constructor(private http: HttpClient, private tokenStorage: TokenStorage) { }

  setloggedInUserRoleID(val1: number) {
    this.loggedInUserRoleID = val1;
  }

  getloggedInUserRoleID() {
    return this.loggedInUserRoleID;
  }

  setloggedInUserID(val2: number) {
    this.loggedInUserID = val2;
  }

  getloggedInUserID() {
    return this.loggedInUserID;
  }

  getPublicKey() {
    return this.http.post(
      API_MEMBER_URL + "/user-management/auth/get-key", {}
    );
  }

  // errortest(error: HttpErrorResponse) {
  //   return Observable.throw(error.message || "server error")

  // }

  public login(user:any, pass:any, publicKey:any, separator:any, serverTime:any, account: any) {
    // console.log("User:" + user+", Pass:" + pass);
    this.$encrypt = new JsEncryptModule.JSEncrypt();
    this.$encrypt.setPublicKey(publicKey);

    var reqString = user + separator + pass + separator + serverTime + separator + account;
    let finalString = this.$encrypt.encrypt(reqString);

    const httpHeaders = this.getHTTPHeaders();
    return this.http.post(
      API_MEMBER_URL + "/user-management/auth/login", { "userData": finalString }, { headers: httpHeaders }
    ).pipe(
      // map((result: any) => {
      //   if (result instanceof Array) {
      //     return result.pop();
      //   }
      //   return result;
      // }),
      // tap(this.saveAccessData.bind(this)),
      //catchError(this.handleError('login', []))
    );
  }

  getHTTPHeaders(): HttpHeaders {
    const result = new HttpHeaders();
    result.set('Content-Type', 'application/json');
    return result;
  }

  private handleError<T>(operation = 'operation', result?: any) {
    // return (error: any): Observable<any> => {
      // TODO: send the error to remote logging infrastructure
      console.error("error"); // log to console instead

      // Let the app keep running by returning an empty result.
      // return from(result);
    // };
  }

  private saveAccessData(accessData: AccessData) {
    if (typeof accessData !== 'undefined') {
      // this.tokenStorage
      //   .setAccessToken(accessData["success"])
      //   .setRefreshToken(accessData["success"])
      //   .setUserRoles(["USER"]);
    }
  }

  logout() {
    const httpHeaders = this.getHTTPHeaders();
    let token = localStorage.getItem("token");
    return this.http.post(API_MEMBER_URL + "/user-management/auth/logout", {
      "token": token
    }, { headers: httpHeaders });
  }

  getAllAccounts(){
    const httpHeaders = this.getHTTPHeaders();
    let token = localStorage.getItem("token");
    return this.http.get(
      API_MEMBER_URL + "/user-management/auth/get-All-Accounts-Name",{ headers: httpHeaders }
    ).pipe(
      // map((result: any) => {
      //   if (result instanceof Array) {
      //     return result.pop();
      //   }
      //   return result;
      // }),
      // tap(this.saveAccessData.bind(this)),
      //catchError(this.handleError('login', []))
    );
  }

  changePassword(oldpassword:any, password:any, separator:any,publickey:any,account:any,confirmPassword:any,username:any,changepasswordflag:any,otp?:any):any{

    this.$encrypt = new JsEncryptModule.JSEncrypt();
    this.$encrypt.setPublicKey(publickey);

   if(changepasswordflag == 'ChangePasswordOTP'){
    var reqString = username + separator + oldpassword + separator + password + separator + confirmPassword + separator + account + separator + otp;
   }else if(changepasswordflag == 'forgetOTP'){
    var reqString = username + separator + password + separator + confirmPassword + separator + account + separator + otp;;
   }else{
    var reqString = username + separator + oldpassword + separator + password + separator + confirmPassword + separator + account;
   }

    let finalString = this.$encrypt.encrypt(reqString);

    return this.http.post(API_MEMBER_URL + "/user-management/auth/change-password", {
      "data": finalString,
    });
  }

  changePasswordLanding(oldpassword:any, password:any, separator:any,publickey:any,account:any,confirmPassword:any,username:any,otp?:any,changePsswordOTP?:any):any{
    let token = localStorage.getItem("token");
    this.$encrypt = new JsEncryptModule.JSEncrypt();
    this.$encrypt.setPublicKey(publickey);

    if(changePsswordOTP == "password"){
      var reqString = username + separator + oldpassword + separator + password + separator + confirmPassword + separator + account + separator + otp;
    }else{
    var reqString = username + separator + oldpassword + separator + password + separator + confirmPassword + separator + account;
    }

    let finalString = this.$encrypt.encrypt(reqString);

    return this.http.post(API_MEMBER_URL + "/user-management/auth/change-password-user",  {   password: {
      data: finalString,
    },
    "token": token
  });
  }


  public sendOTP(UserId: any,Type:any){
    // let token = localStorage.getItem("token");
    return this.http.post(API_MEMBER_URL + '/user-management/auth/send-otp-for-forgot-password', {
      authMaster: {
        userID: UserId,
        "isSendOtp" : 1,
        AccountName:localStorage.getItem('accountType'),
        Type:Type
      },
      // "token": token
    });
  }

  public reSendOTP(UserId: any,Type:any) {
    // let token = localStorage.getItem("token");
    return this.http.post(API_MEMBER_URL + '/user-management/auth/send-otp-for-forgot-password', {
      authMaster: {
        userID: UserId,
        "isSendOtp" : 0,
        AccountName:localStorage.getItem('accountType'),
        Type:Type
      },
      // "token": token
    });
  }
  public sendOTPChangePassword(UserId: any){
    let token = localStorage.getItem("token");
    return this.http.post(API_MEMBER_URL + '/user-management/auth/send-otp-for-change-password', {
      authMaster: {
        userID: UserId,
        "isSendOtp" : 1,
        AccountName:localStorage.getItem('accountType'),
        Type:"ChangePWD"
      },
      "token": token
    });
  }

  public reSendOTPChangePassword(UserId: any) {
    let token = localStorage.getItem("token");
    return this.http.post(API_MEMBER_URL + '/user-management/auth/send-otp-for-change-password', {
      authMaster: {
        userID: UserId,
        "isSendOtp" : 0,
        AccountName:localStorage.getItem('accountType')
      },
      "token": token
    });
  }
  getUserDetails(username: any,separator:any,accountName:any,publicKey:any,newpassword:any,oldpassword:any,conformpassword:any){
    this.$encrypt = new JsEncryptModule.JSEncrypt();
    this.$encrypt.setPublicKey(publicKey);

    var reqString = username + separator + accountName + separator + newpassword + separator + oldpassword + separator + conformpassword;

    let finalString = this.$encrypt.encrypt(reqString);

    return this.http.post(API_MEMBER_URL + '/user-management/auth/get-user-details-by-name', {
      "data": finalString
    });
  }

  verifyUserDetails(fpDetails: any,separator:any,publicKey:any,accountName:any):any {

    this.$encrypt = new JsEncryptModule.JSEncrypt();
    this.$encrypt.setPublicKey(publicKey);


    var reqString = fpDetails.userID?.trim() + separator + fpDetails.firstName?.trim() + separator + fpDetails.lastfName?.trim() + separator + fpDetails.emailID + separator + fpDetails.password + separator + fpDetails.confirmPassword + separator + accountName;

    let finalString = this.$encrypt.encrypt(reqString);


    return this.http.post(API_MEMBER_URL + "/user-management/auth/verify-user-details",
      {
        "cipherData": finalString,
      });
  }

   verifyOTP(OTP:any,userId:any,separator:any,password:any,account:any,publicKey:any,flag:any){

    this.$encryptCaptcha = new JsEncryptModule.JSEncrypt();
    this.$encryptCaptcha.setPublicKey(publicKey);

    let reqString = userId + separator + OTP + separator + password + separator + account + separator + flag

    let finalString = this.$encryptCaptcha.encrypt(reqString);

    return this.http.post(API_MEMBER_URL + '/user-management/auth/verify-OTP-for-forgot-password', {
      "data": finalString,
    });
  }

  verifyOTPLogin(OTP:any,userId:any,separator:any,account:any,publicKey:any){
    let token = localStorage.getItem("tokenlOGIN");
    this.$encryptCaptcha = new JsEncryptModule.JSEncrypt();
    this.$encryptCaptcha.setPublicKey(publicKey);

    let reqString = userId + separator + OTP + separator + account

    let finalString = this.$encryptCaptcha.encrypt(reqString);


    return this.http.post(API_MEMBER_URL + '/user-management/auth/verify-OTP-for-login', {   OTP: {
      data: finalString,
    },
    "token": token
  });
  }
  getpasswordHistory(username: any,separator:any,accountName:any,publicKey:any,newpassword:any,confirmpassword:any,oldpassword:any){
    let token = localStorage.getItem("token");
    this.$encrypt = new JsEncryptModule.JSEncrypt();
    this.$encrypt.setPublicKey(publicKey);

    var reqString = username + separator + accountName + separator + newpassword + separator + confirmpassword + separator + oldpassword;

    let finalString = this.$encrypt.encrypt(reqString);

    return this.http.post(API_MEMBER_URL + '/user-management/auth/get-password-history-data', {   password: {
      data: finalString,
    },
    "token": token
  }
     );
  }

  sendOtpForLogin(UserName: any,Type:any){
    return this.http.post(API_MEMBER_URL + '/user-management/auth/send-otp-for-login', {
      authMaster: {
        userName: UserName,
        "isSendOtp" : 1,
        AccountName:localStorage.getItem('accountType'),
        Type:Type
      },
      // "token": token
    });
  }

  resendOtpForLogin(UserName: any,Type:any){
    return this.http.post(API_MEMBER_URL + '/user-management/auth/send-otp-for-login', {
      authMaster: {
        userName: UserName,
        "isSendOtp" : 0,
        AccountName:localStorage.getItem('accountType'),
        Type:Type
      },
      // "token": token
    });
  }


  verifyAccountDetails(publicKey:any,accountName:any):any {

    this.$encrypt = new JsEncryptModule.JSEncrypt();
    this.$encrypt.setPublicKey(publicKey);
    var reqString = accountName;
    let finalString = this.$encrypt.encrypt(reqString);

    return this.http.post(API_MEMBER_URL + "/user-management/auth/verify-account-details",
      {
        "cipherData": finalString,
      });
  }


  // { "userData": finalString }, { headers: httpHeaders }
}
