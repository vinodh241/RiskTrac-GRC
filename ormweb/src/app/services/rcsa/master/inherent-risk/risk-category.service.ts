import { Injectable } from '@angular/core';
import { RestService } from '../../../rest/rest.service';

@Injectable({
    providedIn: 'root'
})
export class RiskCategoryService extends RestService {

    getAll() {
        return this.post("/rcsa/risk-category/get-all-riskcategory-data", {},false);
    }

    getActive() {
        return this.post("/rcsa/risk-category/get-all-active-riskcategory-data", {});
    }

    addNew(data:any) {
        return this.post("/rcsa/risk-category/add-riskcategory-data", data);
    }

    updateData(data:any) {
        return this.post("/rcsa/risk-category/update-riskcategory-data", data);
    }

    updateStatus(data:any) {
        return this.post("/rcsa/risk-category/update-riskcategory-status", data);
    }
}