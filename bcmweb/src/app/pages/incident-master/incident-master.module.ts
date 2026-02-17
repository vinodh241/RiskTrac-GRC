import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IncidentMasterRoutingModule } from './incident-master-routing.module';
import { IncidentMasterComponent } from './incident-master.component';
import { MatModule } from 'src/app/modules/mat/mat.module';


@NgModule({
  declarations: [
    IncidentMasterComponent
  ],
  imports: [
    CommonModule,
    MatModule,
    IncidentMasterRoutingModule
  ]
})
export class IncidentMasterModule { }
