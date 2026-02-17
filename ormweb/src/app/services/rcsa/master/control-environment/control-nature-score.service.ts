import { Injectable } from '@angular/core';
import { RestService } from 'src/app/services/rest/rest.service';

@Injectable({
  providedIn: 'root'
})
export class ControlNatureScoreService extends RestService {

  getAll() {
    return this.post("/rcsa/control-nature-score/get-all-controlnaturescore-data", {});
  }

  getActive() {
    return this.post("/rcsa/control-nature-score/get-all-active-controlnaturescore-data", {},false);
  }

  addNew(data:any) {
    return this.post("/rcsa/control-nature-score/add-controlnaturescore-data", data);
  }

  updateData(data:any) {
    return this.post("/rcsa/control-nature-score/update-controlnaturescore-data", data);
  }

  updateStatus(data:any) {
    return this.post("/rcsa/control-nature-score/update-controlnaturescore-status",data);
  }

}
