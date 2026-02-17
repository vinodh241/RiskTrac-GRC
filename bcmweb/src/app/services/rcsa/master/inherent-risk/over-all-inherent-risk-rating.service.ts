import { Injectable } from '@angular/core';
import { RestService } from 'src/app/services/rest/rest.service';

@Injectable({
  providedIn: 'root'
})
export class OverAllInherentRiskRatingService extends RestService {


  getAll() {
    return this.post("/rcsa/overall-inherent-risk-rating/get-all-overallinherentriskrating-data", {},false);
  }

  getActive() {
    return this.post("/rcsa/overall-inherent-risk-rating/get-all-active-overallinherentriskrating-data", {},false);
  }

  addNew(data:any) {
    return this.post("/rcsa/overall-inherent-risk-rating/add-overallinherentriskrating-data", data);
  }

  updateData(data:any) {
    return this.post("/rcsa/overall-inherent-risk-rating/update-overallinherentriskrating-data", data);
  }

  updateStatus(data:any) {
    return this.post("/rcsa/overall-inherent-risk-rating/update-overallinherentriskrating-status", data);
  }

}
