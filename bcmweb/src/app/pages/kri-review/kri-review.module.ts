import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KriReviewRoutingModule } from './kri-review-routing.module';
import { KriReviewComponent } from './kri-review.component';
import { MatModule } from 'src/app/modules/mat/mat.module';
import { ColorPickerModule } from 'ngx-color-picker';
import { CoresharedModule } from "../../core-shared/coreshared.module";


@NgModule({
    declarations: [
        KriReviewComponent
    ],
    imports: [
        CommonModule,
        KriReviewRoutingModule,
        MatModule,
        ColorPickerModule,
        CoresharedModule
    ]
})
export class KriReviewModule { }
