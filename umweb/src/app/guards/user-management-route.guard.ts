import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserManagementRouteGuard implements CanActivate {
  mods: any[] = [];

  constructor(private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let mods = localStorage.getItem("mods") || ""
      this.mods = mods?.split(",");

    if(!mods.includes('UM')) {
      return false;
    } else {
      return true;
    }
  }
  
}
