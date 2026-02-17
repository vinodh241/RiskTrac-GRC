import { Injectable } from '@angular/core';
import { RestService } from 'src/app/services/rest/rest.service';

@Injectable({
  providedIn: 'root'
})
export class OverAllInherentRiskScoreService extends RestService {


  getAll() {
    return this.post("/rcsa/overall-inherent-risk-score/get-all-overallinherentriskscore-data", {},false);
  }

  getActive() {
    return this.post("/rcsa/overall-inherent-risk-score/get-all-active-overallinherentriskscore-data", {});
  }

  getConfigurationMasterData(){
    return this.post("/rcsa/overall-inherent-risk-score/get-rcsa-config-score-and-rating",{});
  }

  addNew(data:any) {
    return this.post("/rcsa/overall-inherent-risk-score/add-overallinherentriskscore-data", data);
  }

  updateData() {
    return this.post("/rcsa/overall-inherent-risk-score/update-overallinherentriskscore-data", {});
  }

  updateStatus() {
    return this.post("/rcsa/overall-inherent-risk-score/update-overallinherentriskscore-status", {});
  }

}
