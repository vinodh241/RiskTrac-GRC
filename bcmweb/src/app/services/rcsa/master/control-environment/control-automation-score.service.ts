import { Injectable } from '@angular/core';
import { RestService } from 'src/app/services/rest/rest.service';

@Injectable({
  providedIn: 'root'
})
export class ControlAutomationScoreService extends RestService {

  getAll() {
    return this.post("/rcsa/control-automation-score/get-all-controlautomationscore-data", {});
  }

  getActive() {
    return this.post("/rcsa/control-automation-score/get-all-active-controlautomationscore-data", {},false);
  }

  addNew(data: any) {
    return this.post("/rcsa/control-automation-score/add-controlautomationscore-data", data);
  }

  updateData(data: any) {
    return this.post("/rcsa/control-automation-score/update-controlautomationscore-data", data);
  }

  updateStatus(data: any) {
    return this.post("/rcsa/control-automation-score/update-controlautomationscore-status", data);
  }

}