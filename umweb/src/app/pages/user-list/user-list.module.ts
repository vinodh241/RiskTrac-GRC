import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListRoutingModule } from './user-list-routing.module';
import { UserListComponent } from './user-list.component';
import { EditUser } from './user-edit/user-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GroupUnitComponent } from './user-edit/group-unit/group-unit.component';
import { ConfirmDialogComponent } from '../../includes/utilities/popups/confirm/confirm-dialog.component';
import { MatModule } from 'src/app/modules/mat/mat.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    UserListComponent,
    EditUser,
    GroupUnitComponent,
    ConfirmDialogComponent
  ],
  imports: [
    CommonModule,
    UserListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatModule,
    TranslateModule
  ]
})
export class UserListModule { }
