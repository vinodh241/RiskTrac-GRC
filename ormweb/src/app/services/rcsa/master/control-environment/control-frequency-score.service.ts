import { Injectable } from '@angular/core';
import { RestService } from 'src/app/services/rest/rest.service';

@Injectable({
  providedIn: 'root'
})
export class ControlFrequencyScoreService extends RestService {

  getAll() {
    return this.post("/rcsa/control-frequency-score/get-all-controlfrequencyscore-data", {});
  }

  getActive() {
    return this.post("/rcsa/control-frequency-score/get-all-active-controlfrequencyscore-data", {},false);
  }

  addNew(data:any) {
    return this.post("/rcsa/control-frequency-score/add-controlfrequencyscore-data", data);
  }

  updateData(data:any) {
    return this.post("/rcsa/control-frequency-score/update-controlfrequencyscore-data", data);
  }

  updateStatus(data:any) {
    return this.post("/rcsa/control-frequency-score/update-controlfrequencyscore-status", data);
  }

}
