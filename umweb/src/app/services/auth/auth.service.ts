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

const API_MEMBER_URL = environment.umapiUrl;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  $encrypt: any;
  // public onCredentialUpdated$: Subject<AccessData>;
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
}
