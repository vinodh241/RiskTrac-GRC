import { Injectable } from '@angular/core';
import { RestService } from 'src/app/services/rest/rest.service';

@Injectable({
  providedIn: 'root'
})
export class ProcessService extends RestService {

  getAll() {
    return this.post("/rcsa/process/get-all-process-data", {});
  }

  getActive() {
    return this.post("/rcsa/process/get-all-active-process-data", {},true);
  }

  addNew(data:any) {
    return this.post("/rcsa/process/add-process-data", data);
  }

  updateData(data:any) {
    return this.post("/rcsa/process/update-process-data", data);
  }

  updateStatus(data:any) {
    return this.post("/rcsa/process/update-process-status", data);
  }
}
