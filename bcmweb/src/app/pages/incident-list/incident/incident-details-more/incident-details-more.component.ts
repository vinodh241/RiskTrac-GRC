import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { IncidentService } from 'src/app/services/incident/incident.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
    selector: 'app-incident-details-more',
    templateUrl: './incident-details-more.component.html',
    styleUrls: ['./incident-details-more.component.scss']
})
export class IncidentDetailsMoreComponent implements OnInit {
    panelOpenState = false;
    comments!: string;
    rca!: string;
    recommendationList: any;
    incident: any = { "Comment": "", "RCA": "","FinancialLossComment":"","IsFinancialLoss":""};
    recommendations: any
    incidentInfo: any;
    incidentStatusList: Array<any> = [
        {
            "id":"Yes",
            "value":"Yes"
        },
        {
            "id":"No",
            "value":"No"
        },
        {
            "id":"NA",
            "value":"NA"
        }
    ]


    constructor(
        public service: IncidentService,
        public utils: UtilsService
    ) {
        // this.incidentInfo = this.service.info
        // console.log("🚀 ~ file: incident-details-more.component.ts:26 ~ IncidentDetailsMoreComponent ~ ngOnInit ~ this.incidentInfo:", this.incidentInfo)
    }

    ngOnInit(): void {
        console.log(this.service.isReviewEditable)
    }

    edit(): void {
        this.incident = JSON.parse(JSON.stringify(this.service.incident))
        console.log("🚀 ~ file: incident-details-more.component.ts:29 ~ IncidentDetailsMoreComponent ~ edit ~ this.incident:", this.incident)
        this.recommendations = JSON.parse(JSON.stringify(this.service.recommendations))
        this.service.isReviewEditable = true;
    }

    recommendationCreated(data: any) {
        this.recommendationList = data
    }

    saveIncidentReview() {
        let recommendationData: any[] = []
        console.log("this.recommendations",this.recommendations, this.incident)
        this.recommendations.forEach((rec: any) => {
            let obj = {
                "recommendationID": rec.RecommendationID,
                "incidentID": rec.IncidentID,
                "description": rec.Description,
                "unitID": rec.UnitID,
                "targetDate": rec.TargetDate
            }
            recommendationData.push(obj)
        });

        const data = {
            "incidentID": this.incident.IncidentID,
            "comments": this.incident.Comment,
            "rca": this.incident.RCA,
            "recommendationData": recommendationData,
            "fileIDs": this.service.rcaEvidences.data.map(ele => ele.EvidenceID).join(','),
            "FinancialLossComment":this.incident.FinancialLossComment,
            "IsFinancialLoss":this.incident.IsFinancialLoss
        }
        this.service.setIncidentReview(data);
    }

    IncidentStatus(id:any){
console.log("idd",id)
    }

}
