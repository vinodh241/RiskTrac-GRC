import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TooltipPosition } from '@angular/material/tooltip';
import { IncidentService } from 'src/app/services/incident/incident.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { CommentDialogComponent } from '../comment-dialog/comment-dialog.component';
import { ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-recommendation',
    templateUrl: './recommendation.component.html',
    styleUrls: ['./recommendation.component.scss']
})
export class RecommendationComponent implements OnInit, OnChanges {
    @ViewChild('recForm') recForm?: NgForm;
    @Input() recommendations: any[] = [];
    @Output() recommendedCount: EventEmitter<number> = new EventEmitter();
    copy = { "Description": "", "TargetDate": "", "UnitID": -1, "UnitName": "" }

    arrRecos: any[] = []
    startDate = new FormControl(new Date());
    TargetDate = new FormControl();

    positionOptions: TooltipPosition[] = ['below', 'above', 'left', 'right'];
    position = new FormControl(this.positionOptions[0]);

    form = new FormGroup({
        desc: new FormControl(''),
        unit: new FormControl(''),
        date: new FormControl('')
    });
    attemptedSaveId: number | null = null;
    constructor(
        public service: IncidentService,
        public utils: UtilsService,
        public dialog: MatDialog
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        this.recommendations.map(x => {
            let item = this.service.expandedRecommendationIDs.find(el => el.id == x.RecommendationID);
            x['panelState'] = item ? item.panelState : false;
        });
    }

    ngOnInit(): void {
    }

    refresh(recData: any): void {
        if (recData.length > 0) {
            const reco = this.arrRecos.find(reco => reco.RecommendationID == recData[0].RecommendationID)
            if (reco)
                reco.recData = recData
            else
                this.arrRecos.push({ "RecommendationID": recData[0].RecommendationID, "recData": recData })
        }
    }

    add(): void {
        let date = ""
        let data = { "Description": "", "TargetDate": date, "UnitID": -1, "isEditable": true, "expanded": true }
        this.recommendations.push(data)
        this.copy = JSON.parse(JSON.stringify(data))
        this.service.isReviewInEdit = true
    }

    remove(data: any): void {
        let idx = this.recommendations.indexOf(data)
        if (idx !== -1)
            this.recommendations.splice(idx, 1)
        this.service.isReviewInEdit = this.inEdit()
    }

    edit(data: any): void {
        data.isEditable = true
        this.service.isReviewInEdit = true
        this.copy = JSON.parse(JSON.stringify(data))
    }

    save(data: any): void {
        data.Description = this.copy.Description
        data.UnitID = this.copy.UnitID
        data.UnitName = this.service.info.units.filter((unit: any) => unit.UnitID == this.copy.UnitID)[0].Name || ""
        data.TargetDate = this.utils.ignoreTimeZone(this.copy.TargetDate)
        data.StatusName = "Open"
        data.isEditable = false
        this.service.isReviewInEdit = this.inEdit();

    }

    cancel(data: any): void {
        if (data.UnitID == -1)
            this.remove(data)
        data.isEditable = false
        this.service.isReviewInEdit = this.inEdit()
    }

    inEdit(): boolean {
        return this.recommendations.some((reco: any) => reco.isEditable == true)
    }

    sameReporteeUnit(reco: any): boolean {
        return this.service.info?.currentUserData[0].UnitIDs.includes(reco.UnitID) || false
    }

    action(reco: any) {
        if (!reco) { return; }
        const controlName = 'action' + reco.RecommendationID;
        const ctrl = this.recForm?.controls ? (this.recForm.controls[controlName] as AbstractControl | undefined) : undefined;
        ctrl?.markAsTouched();
        this.attemptedSaveId = reco.RecommendationID;
        if (!reco.Action || !reco.Action.toString().trim()) {
            return;
        }
        this.attemptedSaveId = null;
        let data = {
            "recommendationID": reco.RecommendationID,
            "action": reco.Action,
            "LessonLearnt": reco.LessonLearnt,
            "fileIDs": this.arrRecos.find((rec: any) => rec.RecommendationID == reco.RecommendationID)?.recData.map((ele: any) => ele.EvidenceID).join(',') || ""
        }
        this.service.setRecommendationAction(data);
    }

    claimc(reco: any): void {
        this.openComment(reco, 2)
    }

    approv(reco: any): void {
        this.openComment(reco, 3)
    }

    reject(reco: any): void {
        this.openComment(reco, 1)
    }

    isModified(data: any): boolean {
        let newFiles = this.arrRecos.find(evdn => evdn.RecommendationID == data.RecommendationID)?.recData.map((evdn: any) => evdn.EvidenceID).toString() || ""
        return !data.OldAction || data.OldAction != data.Action
            || data.OldFiles != newFiles
    }

    openComment(reco: any, code: number) {
        const dialogRef = this.dialog.open(CommentDialogComponent, {
            height: '50vh',
            width: '50vw',
            data: {
                type: 'rec',
                data: {
                    "recommendationID": reco.RecommendationID,
                    "comment": "",
                    "currentStatusCode": reco.StatusCode,
                    "nextStatusCode": code
                }
            }
        });

        dialogRef.afterClosed().subscribe(result => {
        })
    }

    openPanel(data: any) {
        data.panelState = true;
        let item = this.service.expandedRecommendationIDs.find(x => x.id == data.RecommendationID);
        if (item) {
            item.panelState = true;
        } else {
            this.service.expandedRecommendationIDs.push({ id: data.RecommendationID, panelState: true });
        }
    }

    closePanel(data: any) {
        data.panelState = false;
        let item = this.service.expandedRecommendationIDs.find(x => x.id == data.RecommendationID);
        if (item) {
            item.panelState = false;
        } else {
            this.service.expandedRecommendationIDs.push({ id: data.RecommendationID, panelState: false });
        }
    }
}
