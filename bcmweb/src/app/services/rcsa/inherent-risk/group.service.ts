import { Injectable } from '@angular/core';
import { RestService } from '../../rest/rest.service';

@Injectable({
  providedIn: 'root'
})
export class GroupService extends RestService {

  getActive() {
    return this.post("/rcsa/group/get-all-active-group-data", {});
  }
}