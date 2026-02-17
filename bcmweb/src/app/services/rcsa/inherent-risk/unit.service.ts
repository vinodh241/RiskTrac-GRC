import { Injectable } from '@angular/core';
import { RestService } from '../../rest/rest.service';

@Injectable({
  providedIn: 'root'
})
export class UnitService extends RestService {

  getActiveByGroupId(data:any) {
    return this.post("/rcsa/unit/get-all-active-unit-by-groupid-data", data);
  }
}
