import { Injectable } from '@angular/core';
import { RestService } from '../../rest/rest.service';

@Injectable({
  providedIn: 'root'
})
export class InherentRiskService extends RestService {

  getAll() {
    return this.post("/rcsa/inherentrisk/get-all-inherentrisk-data", {});
  }

  getActive() {
    return this.post("/rcsa/inherentrisk/get-all-active-inherentrisk-data", {});
  }

  addNew(data: any) {
    return this.post("/rcsa/inherentrisk/add-inherentrisk-data", data);
  }

  updateData(data: any) {
    return this.post("/rcsa/inherentrisk/update-inherentrisk-data", data);
  }

  updateStatus(data: any) {
    return this.post("/rcsa/inherentrisk/update-inherentrisk-status", data);
  }

  bulkUploadInherentRisk(data:FormData) {
    return this.upload("/rcsa/schedule/add-bulk-inherent-risk", data)
  }

}