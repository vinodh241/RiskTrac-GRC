import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatModule } from 'src/app/modules/mat/mat.module';
import { CrisisCommunicationRoutingModule } from './crisis-communication-routing.module';
import { CreateNewMessageComponent } from './create-new-message/create-new-message.component';
import { SendCommunicationComponent } from './send-communication/send-communication.component';
import { CrisisCommunicationListingComponent } from './crisis-communication-listing/crisis-communication-listing.component';
import { CKEditorModule } from 'ckeditor4-angular';
import { CoreSharedModule } from "../../../core-shared/core-shared.module";


@NgModule({
    declarations: [
        CreateNewMessageComponent,
        SendCommunicationComponent,
        CrisisCommunicationListingComponent
    ],
    imports: [
        MatModule,
        CommonModule,
        CKEditorModule,
        CrisisCommunicationRoutingModule,
        CoreSharedModule
    ]
})
export class CrisisCommunicationModule { }
