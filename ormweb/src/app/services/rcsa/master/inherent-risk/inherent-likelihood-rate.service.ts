import { Injectable } from '@angular/core';
import { RestService } from '../../../rest/rest.service';

@Injectable({
    providedIn: 'root'
})
export class InherentLikelihoodRankService extends RestService {


    getAll() {
        return this.post("/rcsa/inherent-likelihood-rating/get-all-inherent-data", {},false);
    }

    getActive() {
        return this.post("/rcsa/inherent-likelihood-rating/get-all-active-inherent-data", {});
    }

    addNew(data:any) {
        return this.post("/rcsa/inherent-likelihood-rating/add-inherent-data", data);
    }

    updateData(data:any) {
        return this.post("/rcsa/inherent-likelihood-rating/update-inherent-data", data);
    }

    updateStatus(data:any) {
        return this.post("/rcsa/inherent-likelihood-rating/update-inherent-status", data);
    }


}