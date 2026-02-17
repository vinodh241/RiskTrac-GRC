import { Component, OnInit } from '@angular/core';
import { IncidentService } from 'src/app/services/incident/incident.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

export interface AuditTrail {
    CreatedDate: string,
    Code: string,
    Action: string,
    FullName: string,
    Comment: string,
}

@Component({
    selector: 'app-audit-trail',
    templateUrl: './audit-trail.component.html',
    styleUrls: ['./audit-trail.component.scss'],
})

export class AuditTrailComponent implements OnInit {
    displayedColumns: string[] = ['AuditData']

    constructor(
        public service: IncidentService,
        public utils: UtilsService
    ) { }

    ngOnInit(): void { }
}
