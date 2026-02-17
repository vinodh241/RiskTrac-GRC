import { Injectable } from '@angular/core';
import { RestService } from '../rest/rest.service';

@Injectable({
    providedIn: 'root'
})
export class RiskReportsService extends RestService {

    getRiskReportsSetting() {
        return this.post("/operational-risk-management/risk-reports/get-risk-reports-setting", {

        });
    }

    setRiskReportsSetting(source: any, zones:any[]) {
        let data: any = [];
        source.forEach((row:any) => {
            data.push({
                "T0": row.T0,
                "T1": row.T1,
                "T2": row.T2,
                "RiskMetricLevelID": zones[row.RiskMetricLevel-1].RiskMetricLevelID,
                "RiskMetricLevel": row.RiskMetricLevel,
                "RiskMetricLevelName": row.RiskMetricLevelName,
                "IsEscalationMandatory": row.IsEscalationMandatory,
                "Escalation": row.Escalation,
                "IsActionMandatory": row.IsActionMandatory,
                "Action": row.Action
            });
        });
        return this.post("/operational-risk-management/risk-reports/set-risk-reports-setting", {"data":data});
    }

}
