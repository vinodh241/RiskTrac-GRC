
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { strencrypt, strdecrypt } from 'src/app/core-shared/utils/commonFunctions';

@Injectable()
export class AuthGuard implements CanActivate {
  isOnLine: boolean;

  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // If token exists (e.g. from host login), allow access so ORM/BCM work after clicking from landing
    if (localStorage.getItem('token')) {
      return true;
    }
    this.isOnLine = localStorage.getItem('isOnLine') === 'true' ? true : false;
    if (this.isOnLine) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
    const pin1 = localStorage.getItem('PIN1') ? localStorage.getItem('PIN1') : null;
    const pin2 = localStorage.getItem('PIN2') ? localStorage.getItem('PIN2') : null;
    if (pin1 !== null && pin2 !== null) {
      if (strdecrypt(pin1) === strdecrypt(pin2)) {
        return true;
      }
      localStorage.setItem('PIN2', '');
    }
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;

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
