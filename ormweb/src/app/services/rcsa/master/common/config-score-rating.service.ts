import { Injectable } from '@angular/core';
import { RestService } from 'src/app/services/rest/rest.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigScoreRatingService extends RestService {
  public scheduleAssessmentIDS: number = 0;
  configURL: string = "/rcsa/overall-control-environment-rating/get-config-score-and-rating";

  getControlEnvironmentRatingScreen() {
    let obj = { "configscreen": "ControlEnvironmentRating" };
    return this.post(this.configURL, obj, false);
  }

  getControlTotalScoreScreen() {
    let obj = { "configscreen": "ControlTotalScore" };
    return this.post(this.configURL, obj);
  }

  getInherentRiskRatingScreen() {
    let obj = { "configscreen": "InherentRiskRating" };
    return this.post(this.configURL, obj, false);
  }

  getInherentRiskScoreScreen() {
    let obj = { "configscreen": "InherentRiskScore" };
    return this.post(this.configURL, obj);
  }

  getMasterInherentRiskScreen() {
    return this.post("/rcsa/inherent-risk-rating-screen/get-data-for-inherent-risk-rating-screen", {});
  }

  getMasterControlEnvironmentScreen() {
    return this.post("/rcsa/control-environment-rating-screen/get-data-for-control-environment-rating-screen", {});
  }

  getMasterResidualRiskScreen() {
    return this.post("/rcsa/residual-risk-rating-screen/get-data-for-residual-risk-rating-screen", {});
  }

  getInherentRiskScreen(data: any) {
    return this.post("/rcsa/inherentrisk/get-data-for-manage-inherentrisk-screen", data);
  }

  getScheduleAssessmentScreen(data: any) {
    return this.post("/rcsa/schedule/get-data-for-schedule-assessment-screen", data);
  }

  getDataForManageScheduleAssessmentScreen(data: any) {
    return this.post("/rcsa/schedule/get-data-for-manage-schedule-assessment-screen", data);
  }

  getSelfAssessmentDashboardScreen(data: any) {
    return this.post("/rcsa/scheduleassessment/get-data-for-self-assessment-screen", data);
  }

  getDataForManageSelfAssessmentScreen(data: any) {
    return this.post("/rcsa/scheduleassessment/get-data-for-manage-self-assessment-screen", data);
  }

  getRiskRegisterData(id: any, year: any, actionPlanStatusIDs: any) {
    let data = {
      scheduleAssessmentID: id,
      year: year
    }
    return this.post("/rcsa/schedule/get-risk-register-data", { data: data });
  }

  addControlType(data: any) {
    return this.post('/rcsa/control-type/add-controltype-data', data);
  }

  updateControlType(data: any) {
    return this.post('/rcsa/control-type/update-controltype-data', data);
  }
}

