import { Injectable } from '@angular/core';
import { RestService } from '../rest/rest.service';

@Injectable({
    providedIn: 'root'
})
export class RiskAssessmentService extends RestService {

    getInfoScheduleRiskAssessment(data:any) {
        return this.post("/operational-risk-management/risk-assessment/get-info-schedule-risk-assessment", { "data": data });
    }

    getRiskAssessments() {
        return this.post("/operational-risk-management/risk-assessment/get-risk-assessments", {});
    }

    getRiskAssessmentsViewSubmitted() {
        return this.post("/operational-risk-management/risk-assessment/get-risk-assessments-view-submitted", {});
    }

    setRiskAssessment(copy: any) {
        var data = {
            "fwid": copy.FWID.toString(),
            "startDate": copy.StartDate,
            "endDate": copy.EndDate,
            "isReviewerUnit": copy.IsReviewerUnit,
            "unitId": copy.IsReviewerUnit ? copy.UnitID : null,
            "reviewerGUID": copy.IsReviewerUnit ? null : copy.ReviewerGUID,
            "collectionScheduleID": copy.CollectionScheduleID,
            "quaterID": copy.QuaterID,
            "remainderdate":copy.RemainderDate
        }
        return this.post("/operational-risk-management/risk-assessment/set-risk-assessment", { "data": data });
    }

    getRiskAssessmentDetails(collectionScheduleID: any) {
        let data: any = {
            "collectionScheduleId": collectionScheduleID
        };
        return this.post("/operational-risk-management/risk-assessment/get-risk-assessment-details", { "data": data });
    }

    getRiskMetrics() {
        return this.post("/operational-risk-management/risk-assessment/get-risk-metrics", {});
    }

    getRiskMetricsMaker() {
        return this.post("/operational-risk-management/risk-assessment/get-risk-metrics-maker", {});
    }

    setRiskMetricsDraft(source: any, collectionScheduleID: any) {
        let data: any = [];
        console.log('setRiskMetricsDraft-source::', source);

        source.forEach((row: any) => {
            let evidencesNew = (row?.evidences && row?.evidences.length > 0 ? (row?.evidences.map((ele: any) => ele.EvidenceID)).join() : '')
            if (row.MetricScore != row.MetricScoreOld
                || row.Remarks != row.RemarksOld
                || row.ActionPlan != row.ActionPlanOld
                || evidencesNew != row.evidencesOld) {
                data.push({
                    "unitId": row.UnitID,
                    "collectionScheduleId": collectionScheduleID,
                    "nodeId": row.NodeID,
                    "metricScore": row.MetricScore,
                    "remarks": row.Remarks,
                    "actionPlan": row.ActionPlan,
                    "commentBody": row.ReviewComment,
                    "evidenceId": row?.evidences && row?.evidences.length > 0 ? (row?.evidences.map((ele: any) => ele.EvidenceID)).join() : ''
                });
            }
        });
        return this.post("/operational-risk-management/risk-assessment/set-risk-metrics-draft", { "data": data });
    }

    setRiskMetricsSubmit(source: any, collectionScheduleID: any) {
        let data: any = {
            "unitId": source[0].UnitID.toString(),
            "collectionScheduleId": collectionScheduleID
        };
        return this.post("/operational-risk-management/risk-assessment/set-risk-metrics-submit", { "data": data });
    }

    // setRiskMetricReview() {
    //     return this.post("/operational-risk-management/risk-assessment/set-risk-metric-review", {

    //     });
    // }

    setRiskMetricsReviewDraft(data: any, collectionScheduleID: any) {
        return this.post("/operational-risk-management/risk-assessment/set-risk-metrics-review-draft", { "data": data });
    }

    setRiskMetricsReviewSubmit(source: any, collectionScheduleID: any) {
        let data: any = {
            "unitId": source[0].UnitID.toString(),
            "collectionScheduleId": collectionScheduleID
        };
        return this.post("/operational-risk-management/risk-assessment/set-risk-metrics-review-submit", { "data": data });
    }


    uploadRiskUnitMaker(data: FormData) {
        return this.upload("/operational-risk-management/risk-assessment/upload-RiskUnitMaker-evidence", data)
    }

    downloadRiskUnitMakerEvidence(data: any) {
        return this.post("/operational-risk-management/risk-assessment/download-RiskUnitMaker-evidence", { data });
    }

    deleteRiskUnitMakerEvidence(data: any) {
        return this.post("/operational-risk-management/risk-assessment/delete-RiskUnitMaker-evidence", { data });
    }

    getEmailReminderDataRA(collectionScheduleID: any) {
        let data: any = {
            "collectionScheduleId": collectionScheduleID
        };
        return this.post("/operational-risk-management/risk-assessment/get-Email-Reminder-Data-RA", { "data": data });
    }
}
