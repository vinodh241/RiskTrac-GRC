// rcsa-control-library.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button'; // for buttons in toolbar/table

import { MatModule } from 'src/app/modules/mat/mat.module';
import { MatGridListModule } from '@angular/material/grid-list';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ColorPickerModule } from 'ngx-color-picker';
import { FileUploadModule } from "ng2-file-upload";
import { CoresharedModule } from 'src/app/core-shared/coreshared.module';

import { RcsaControlLibraryRoutingModule } from './rcsa-control-library-routing.module';
import { RcsaControlLibraryComponent } from './rcsa-control-library/rcsa-control-library.component';
import { AddeditRcsaControlComponent } from './addedit-rcsa-control/addedit-rcsa-control.component';


@NgModule({
  declarations: [
    RcsaControlLibraryComponent,
    AddeditRcsaControlComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RcsaControlLibraryRoutingModule,

    MatModule,
    MatGridListModule,
    FlexLayoutModule,
    ColorPickerModule,
    FileUploadModule,
    CoresharedModule,

    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatToolbarModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule
  ]
})
export class RcsaControlLibraryModule { }
