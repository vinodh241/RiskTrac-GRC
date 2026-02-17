import { Component, Inject, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IncidentService } from 'src/app/services/incident/incident.service';

@Component({
    selector: 'app-incident',
    templateUrl: './incident.component.html',
    styleUrls: ['./incident.component.scss']
})
export class IncidentComponent implements OnInit {
    @ViewChild('incidentDailog') contentIncident!: ElementRef;
    
    isMax = false;
    recommendedCount: number = 0;
    constructor(
        private dialogRef: MatDialogRef<IncidentComponent>,
        public service: IncidentService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.service.cleanIncident()
        if (data.id == -1)
            this.service.getIncidentInfo()
        else
            this.service.getIncident(data.id);
    }

    ngOnInit(): void {
        this.minimize()
    }

    closeDialog(){
        this.dialogRef.close();
        this.service.getIncidents();
        this.service.expandedRecommendationIDs = [];
    }

    ngOnDestroy(): void {
        // this.service.getIncidents()
    }

    maximize() {
        this.isMax = true;
        this.dialogRef.addPanelClass("maximumAdded");
        this.dialogRef.removePanelClass("minimumAdded");
        this.dialogRef.updateSize('100%', '100%');
    }

    minimize() {
        this.isMax = false;
        this.dialogRef.addPanelClass("minimumAdded");
        this.dialogRef.removePanelClass("maximumAdded");
        this.dialogRef.updateSize('85%', '90%');
    }

    scrollUp() {
        this.contentIncident.nativeElement.scrollTop = this.contentIncident.nativeElement.offsetHeight;
    }

}
