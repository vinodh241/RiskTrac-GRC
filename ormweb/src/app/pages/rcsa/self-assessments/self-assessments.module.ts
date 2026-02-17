import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SelfAssessmentsRoutingModule } from './self-assessments-routing.module';
import { MatModule } from 'src/app/modules/mat/mat.module';
import { MatGridListModule } from '@angular/material/grid-list';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ColorPickerModule } from 'ngx-color-picker';
import { MatTabsModule } from '@angular/material/tabs';

import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { SelfAssessmentsComponent } from './self-assessments.component';
import { NewScheduleSelfAssessmentsComponent } from './new-schedule-self-assessments/new-schedule-self-assessments.component';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { AdhocriskformComponent } from './adhocriskform/adhocriskform.component';
import { CoresharedModule } from 'src/app/core-shared/coreshared.module';


@NgModule({
  declarations: [
    NewScheduleSelfAssessmentsComponent,
    SelfAssessmentsComponent,
    AdhocriskformComponent
  ],
  imports: [
    CommonModule,
    SelfAssessmentsRoutingModule,
    MatModule,
    MatGridListModule,
    FlexLayoutModule,
    ColorPickerModule,
    MatTabsModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatTableModule,
    MatCardModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CoresharedModule
  ],
  exports: [
    CommonModule,
    SelfAssessmentsRoutingModule,
    MatModule,
    MatGridListModule,
    FlexLayoutModule,
    ColorPickerModule,
    MatTabsModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatTableModule,
    MatCardModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    SelfAssessmentsComponent,
    NewScheduleSelfAssessmentsComponent
  ]
})
export class SelfAssessmentsModule {


}
