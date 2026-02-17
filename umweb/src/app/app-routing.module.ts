import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserManagementRouteGuard } from './guards/user-management-route.guard';

const routes: Routes = [ 
  { path: 'user-list', loadChildren: () => import('./pages/user-list/user-list.module').then(m => m.UserListModule), canActivate: [UserManagementRouteGuard]}, 
  { path: '', redirectTo: 'user-list', pathMatch: 'full' },
  { path: '**', redirectTo: 'user-list', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
