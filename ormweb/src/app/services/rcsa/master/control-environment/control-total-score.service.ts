import { Injectable } from '@angular/core';
import { RestService } from 'src/app/services/rest/rest.service';

@Injectable({
  providedIn: 'root'
})
export class ControlTotalScoreService extends RestService {

  getAll() {
    return this.post("/rcsa/control-total-score/get-all-controltotalscore-data", {});
  }

  getActive() {
    return this.post("/rcsa/control-total-score/get-all-active-controltotalscore-data", {});
  }

  addNew(data:any) {
    return this.post("/rcsa/control-total-score/add-controltotalscore-data", data);
  }

  updateData() {
    return this.post("/rcsa/control-total-score/update-controltotalscore-data", {});
  }

  updateStatus() {
    return this.post("/rcsa/control-total-score/update-controltotalscore-status", {});
  }

}
