import { Injectable } from '@angular/core';
import { RestService } from 'src/app/services/rest/rest.service';

@Injectable({
  providedIn: 'root'
})
export class ControlInPaceService extends RestService {

  getAll() {
    return this.post("/rcsa/control-in-place/get-all-controlinpace-data", {});
}

getActive() {
  return this.post("/rcsa/control-in-place/get-all-active-controlinpace-data", {},false);
}

addNew(data:any) {
  return this.post("/rcsa/control-in-place/add-controlinpace-data", data);
}

updateData(data:any) {
  return this.post("/rcsa/control-in-place/update-controlinpace-data", data);
}

updateStatus(data:any) {
  return this.post("/rcsa/control-in-place/update-controlinpace-status", data);
}

}
