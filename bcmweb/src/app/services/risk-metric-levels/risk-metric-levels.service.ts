import { Injectable } from '@angular/core';
import { RestService } from '../rest/rest.service';

@Injectable({
    providedIn: 'root'
})
export class RiskMetricLevelsService extends RestService {

    getRiskMetricLevels() {
        return this.post("/operational-risk-management/risk-metric-levels/get-risk-metric-levels", {

        });
    }

    setRiskMetricLevels(arr:any) {
        let postdata = {
            "riskMetricData": arr
        }
        return this.post("/operational-risk-management/risk-metric-levels/set-risk-metric-levels", postdata);
    }

}
