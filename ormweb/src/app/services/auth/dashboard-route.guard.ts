import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UtilsService } from '../utils/utils.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardRouteGuard implements CanActivate {
  role: string = '';
  userName: string = '';
  activePage: string = '';
  isRiskManagementUnit: boolean = false;

  constructor(
    private utilsService: UtilsService,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.role = localStorage.getItem('rorm') || "";
    this.userName = localStorage.getItem('username') || "";
    this.activePage = localStorage.getItem("activePage") || ""
    this.isRiskManagementUnit = this.utilsService.isRiskManagementUnit();
    if ((this.role == 'PU' || this.role == 'SU' || this.role == 'FA') && !this.isRiskManagementUnit) {
      this.router.navigate(['incident-list']);
      return false;
    } else {
      return true;
    }
  }
}
