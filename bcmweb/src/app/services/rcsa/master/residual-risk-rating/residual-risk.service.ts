import { Injectable } from '@angular/core';
import { RestService } from 'src/app/services/rest/rest.service';

@Injectable({
  providedIn: 'root'
})
export class ResidualRiskService extends RestService {

  getAll() {
    return this.post("/rcsa/residual-risk/get-all-residualrisk-data", {});
  }

  getActive() {
    return this.post("/rcsa/residual-risk/get-all-active-residualrisk-data", {},true);
  }

  addNew(data:any) {
    return this.post("/rcsa/residual-risk/add-residualrisk-data", data);
  }

  updateData(data:any) {
    return this.post("/rcsa/residual-risk/update-residualrisk-data", data);
  }

  updateStatus(data:any) {
    return this.post("/rcsa/residual-risk/update-residualrisk-status", data);
  }
}
