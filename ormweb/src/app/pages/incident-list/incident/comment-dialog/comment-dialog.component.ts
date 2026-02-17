import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IncidentService } from 'src/app/services/incident/incident.service';

@Component({
    selector: 'app-comment-dialog',
    templateUrl: './comment-dialog.component.html',
    styleUrls: ['./comment-dialog.component.scss']
})
export class CommentDialogComponent implements OnInit {
    comment = ""
    constructor(
        private _service: IncidentService,
        @Inject(MAT_DIALOG_DATA) private data: any,
        public dialogRef: MatDialogRef<CommentDialogComponent>
    ) { }

    ngOnInit(): void {
    }

    submit(): void {
        // let data = {
        //     "incidentID": this._service.incident.IncidentID,
        //     "comment": this.comment,
        //     "currentStatusCode": this._service.incident.StatusCode,
        //     "nextStatusCode": this.data.action.NextStatusCode
        // }
        let data = this.data.data
        data.comment = this.comment
        if(this.data.type == 'inc')
            this._service.setIncidentStatus(data)
        if(this.data.type == 'rec')
            this._service.setRecommendationStatus(data);
        this.dialogRef.close()
    }

}
