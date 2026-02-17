import { Injectable } from '@angular/core';
import { RestService } from 'src/app/services/rest/rest.service';

@Injectable({
  providedIn: 'root'
})
export class OverallControlEnvironmentRatingService extends RestService {

  getAll() {
    return this.post("/rcsa/overall-control-environment-rating/get-all-overallcontrolenvironmentrating-data", {});
  }

  getActive() {
    return this.post("/rcsa/overall-control-environment-rating/get-all-active-overallcontrolenvironmentrating-data", {},false);
  }

  addNew(data:any) {
    return this.post("/rcsa/overall-control-environment-rating/add-overallcontrolenvironmentrating-data", data);
  }

  updateData(data:any) {
    return this.post("/rcsa/overall-control-environment-rating/update-overallcontrolenvironmentrating-data", data);
  }

  updateStatus(data:any) {
    return this.post("/rcsa/overall-control-environment-rating/update-overallcontrolenvironmentrating-status", data);
  }

}
