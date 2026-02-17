import { Injectable } from '@angular/core';
import { RestService } from '../../rest/rest.service';

@Injectable({
    providedIn: 'root'
})
export class RcsaMasterService extends RestService {
    getRcsaMaster() {
        return this.post("/rcsa/schedule/get-rcsa-master-data", {});
    }

    addNew(data: any) {
        return this.post("/rcsa/schedule/add-rcsa-master-data", data);
    }

    addCorporateObjective(data: any) {
        return this.post("/rcsa/schedule/add-corporate-objective", data);
    }

    updateCorporateObjective(data: any) {
        return this.post("/rcsa/schedule/update-corporate-objective", data);
    }
}