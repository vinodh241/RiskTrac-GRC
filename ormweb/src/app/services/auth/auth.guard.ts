
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { strencrypt, strdecrypt } from 'src/app/core-shared/utils/commonFunctions';

@Injectable()
export class AuthGuard implements CanActivate {
  isOnLine: boolean;

  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.isOnLine = localStorage.getItem('isOnLine') === 'true' ? true : false;
    //  console.log('this.isOnLine::', this.isOnLine);
    if (this.isOnLine) {
      if (localStorage.getItem('token')) {
        return true;
      } else {
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
      }
    } else {
      const pin1 = localStorage.getItem('PIN1') ? localStorage.getItem('PIN1') : null;
      const pin2 = localStorage.getItem('PIN2') ? localStorage.getItem('PIN2') : null;
      if (pin1 !== null && pin2 !== null) {
        // console.log('pin1::', strdecrypt(pin1));
        // console.log('pin2::', strdecrypt(pin2));
        if (strdecrypt(pin1) === strdecrypt(pin2)) {
          return true;
        } else {
          localStorage.setItem('PIN2', '');
          this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
          return false;
        }
      } else {
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
      }
    }

    // if (localStorage.getItem('token')) {
    //   return true;
    // } else if (!this.isOnLine) {
    //   this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    //   return false;
    // } else {
    //   this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    //   return false;
    // }

    // this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    // return false;

  }

}
