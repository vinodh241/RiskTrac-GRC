import { Injectable } from '@angular/core';
import { RestService } from '../../rest/rest.service';

@Injectable({
  providedIn: 'root'
})
export class SelfAssessmentsService extends RestService {

  // getAll() {
  //   return this.post("/rcsa/scheduleassessment/get-all-schedule-assessment-data", {});
  // }

  getAll(data: any) {
    return this.post("/rcsa/scheduleassessment/get-all-schedule-assessment-data", data);
  }

  getSelfAssessmentFromSchedule(data: any) {
    return this.post("/rcsa/scheduleassessment/get-self-assessment-summary-by-schedule-assessment-id-data", data, false);
  }

  getScheduleAssessmentById(data: any) {
    //return this.post("/rcsa/scheduleassessment/get-all-schedule-assessment-by-id-data", data);
    return this.post("/rcsa/scheduleassessment/get-self-assessment-details-by-schedule-inherent-id-data", data);
  }

  getActionStatus() {
    return this.post("/rcsa/schedule/get-all-active-action-plan-status-data", {}, false);
  }

  getConfirmationVerification() {
    return this.post("/rcsa/schedule/get-all-active-control-verification-closure-data", {}, false);
  }

  getControlTestingResult() {
    return this.post("/rcsa/schedule/get-all-active-control-testing-result-data", {}, false);
  }
  getResidualRiskResponse() {
    return this.post("/rcsa/scheduleassessment/get-residual-risk-response-data", {}, false);
  }
  getResidualRiskResponsePerson() {
    return this.post("/rcsa/scheduleassessment/get-residual-risk-responsible-person-data", {}, false);
  }
  getActionResponsePerson() {
    return this.post("/rcsa/scheduleassessment/get-action-responsible-person-data", {}, false);
  }

  getControlType() {
    return this.post("/rcsa/scheduleassessment/get-control-type-data", {}, false);
  }

  updateScheduleAssessmentDetails(data: any) {
    return this.post("/rcsa/scheduleassessment/manage-schedule-assessment-details-data", data);
  }

  scheduleAssessmentRejected(data: any) {
    return this.post("/rcsa/scheduleassessment/update-rejected-schedule-inherent-risk-reviewer-details-data", data);
  }
  scheduleAssessmentApproved(data: any) {
    return this.post("/rcsa/scheduleassessment/update-approved-schedule-inherent-risk-reviewer-details-data", data);
  }
  getActionTrail(data: any) {
    return this.post("/rcsa/scheduleassessment/get-schedule-inherent-risk-action-trail-data", data, false);
  }

  getSelfAssessmentByStatus(data: any) {
    return this.post("/rcsa/scheduleassessment/get-all-schedule-assessment-summary-by-status-data", data);
  }

  submitSelfAssessment(data: any) {
    return this.post("/rcsa/scheduleassessment/submit-self-assessment-by-schedule-assessment", data);
  }


  uploadSelfAssessmentEvidence(data: any) {
    return this.upload("/rcsa/scheduleassessment/upload-rcsa", data);
  }

  downloadSelfAssessmentEvidence(data: any) {
    return this.post("/rcsa/scheduleassessment/download-rcsa", data);
  }
  
  deleteSelfAssessmentEvidence(data: any) {
    return this.post("/rcsa/scheduleassessment/delete-rcsa", data);
  }

  addAdhocrisk(data: any) {
    return this.post("/rcsa/scheduleassessment/add-ad-hoc-risk-data", data);
  }

  updateAdhocrisk(data: any) {
    return this.post("/rcsa/scheduleassessment/add-ad-hoc-risk-data", data);
  }
}
