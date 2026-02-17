import { Injectable } from '@angular/core';
import { RestService } from '../../../rest/rest.service';

@Injectable({
    providedIn: 'root'
})
export class InherentImpactRateService extends RestService {

    // getRiskCategories() {
    //     return this.post("/operational-risk-management/risk-assessment/get-risk-assessments", {});
    // }

    // getInherentLikelihoodRating() {
    //     return this.post("/operational-risk-management/risk-assessment/get-risk-assessments", {});
    // }

    getAll() {
        return this.post("/rcsa/inherent-impact-rating/get-all-inherentimpact-data", {},false);
    }

    getActive() {
        return this.post("/rcsa/inherent-impact-rating/get-all-active-inherentimpact-data", {},false);
    }

    addNew(data:any) {
        return this.post("/rcsa/inherent-impact-rating/add-inherentimpact-data", data);
    }

    updateData(data:any) {
        return this.post("/rcsa/inherent-impact-rating/update-inherentimpact-data",data);
    }

    updateStatus(data:any) {
        return this.post("/rcsa/inherent-impact-rating/update-inherentimpact-status", data);
    }

}