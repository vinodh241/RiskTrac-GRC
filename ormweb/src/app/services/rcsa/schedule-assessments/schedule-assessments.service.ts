import { Injectable } from '@angular/core';
import { RestService } from '../../rest/rest.service';

@Injectable({
  providedIn: 'root'
})
export class ScheduleAssessmentsService extends RestService {

  getAll(data: any) {
    return this.post("/rcsa/schedule/get-all-schedule-data", data);
  }

  getActive() {
    return this.post("/rcsa/schedule/get-all-active-schedule-data", {}, false);
  }

  addNew(data: any) {
    return this.post("/rcsa/schedule/add-schedule-assessment-data", data);
  }

  updateData(data: any) {
    return this.post("/rcsa/schedule/update-schedule-assessment-data", data);
  }

  updateStatus(data: any) {
    return this.post("/rcsa/schedule/update-schedule-assessment-status-data", data);
  }

  getSchedulePeriod() {
    return this.post("/rcsa/schedule/get-schedule-period-data", {}, false);
  }

  getActiveReviewer() {
    return this.post("/rcsa/schedule/get-all-active-reviewer-data", {}, false);
  }

  getAssessmentYear() {
    return this.post("/rcsa/schedule/get-schedule-assessment-years-data", {}, false);
  }

  getInprogressScheduleAssessment() {
    return this.post("/rcsa/schedule/get-snapshot-for-inprogress-schedule-assessment-data", {}, false);
  }

  getActionScheduleAssessment(data: any) {
    return this.post("/rcsa/schedule/get-scheduled-action-plan-snapshot-data", data);
  }

  getCompletedScheduleAssessmentData(data: any) {
    return this.post("/rcsa/schedule/get-completed-schedule-assessment-for-dashboard-data", data, false);
  }
  getInProgressScheduleAssessmentData(data: any) {
    return this.post("/rcsa/schedule/get-inprogress-schedule-assessment-for-dashboard-data", data);
  }

  getAssessmentCard(data: any) {
    return this.post("/rcsa/scheduleassessment/get-all-schedule-assessment-cards-data", data, false);
  }

  getSnapInprogressDetails(data: any) {
    return this.post("/rcsa/schedule/get-snapshot-for-inprogress-schedule-assessment-details-data", data, false);
  }

  getSnapCompletedDetails(data: any) {
    return this.post("/rcsa/schedule/get-scheduled-action-plan-snapshot-details-data", data, false);
  }

  getEmailReminderData(data: any) {
    return this.post("/rcsa/schedule/get-reminder-email-data", data);
  }

  // --- New endpoints for Schedule RCSA - ALL vs Individual mode enhancement ---

  /** Fetch departments (groups) and units for Individual mode dropdown */
  getDepartmentsAndUnitsForSchedule() {
    return this.post("/rcsa/schedule/get-departments-and-units-for-schedule", {});
  }

  /** Fetch existing scheduled cycles for a given period */
  getExistingScheduledCycles(data: any) {
    return this.post("/rcsa/schedule/get-existing-scheduled-cycles", data);
  }

  /** Fetch unit mappings for an existing assessment (for edit pre-selection) */
  getScheduleAssessmentUnits(data: any) {
    return this.post("/rcsa/schedule/get-schedule-assessment-units", data);
  }
}
