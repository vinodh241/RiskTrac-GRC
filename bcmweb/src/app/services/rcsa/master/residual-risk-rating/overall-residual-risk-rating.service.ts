import { Injectable } from '@angular/core';
import { RestService } from 'src/app/services/rest/rest.service';

@Injectable({
  providedIn: 'root'
})
export class OverallResidualRiskRatingService extends RestService {

  getAll() {
    return this.post("/rcsa/overall-residual-risk-rating/get-all-overallresidualriskrating-data", {},false);
  }

  getActive() {
    return this.post("/rcsa/overall-residual-risk-rating/get-all-active-overallresidualriskrating-data", {});
  }

  addNew(data:any) {
    return this.post("/rcsa/overall-residual-risk-rating/add-overallresidualriskrating-data", data);
  }

  updateData(data:any) {
    return this.post("/rcsa/overall-residual-risk-rating/update-overallresidualriskrating-data", data);
  }

  updateStatus(data:any) {
    return this.post("/rcsa/overall-residual-risk-rating/update-overallresidualriskrating-status", data);
  }
}