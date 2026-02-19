import { Injectable } from '@angular/core';
import { RestService } from '../../rest/rest.service';

@Injectable({
  providedIn: 'root'
})
export class MasterInherentLikelyhoodService extends RestService {


  updateData(data:any) {
    return this.post("/business-continuity-management/master/risk-rating/manage-overall-risk-rating",  {data:{ "LikelihoodRatingData": data[0] }});
  }

  addNew(data:any) {
   return this.post("/business-continuity-management/master/risk-rating/manage-overall-risk-rating",  {data:{ "LikelihoodRatingData": data[0] }});
  }

  updateStatus(data:any) {
  return this.post("/business-continuity-management/master/risk-rating/manage-overall-risk-rating",  {data:{ "LikelihoodRatingData": data[0] }});
  }

addNewinherentimpact(data:any) {
  return this.post("/business-continuity-management/master/risk-rating/manage-overall-risk-rating", {data:{"ImpactRatingData" : data[0]}});
}

updateDatainherentimpact(data:any) {
  return this.post("/business-continuity-management/master/risk-rating/manage-overall-risk-rating", {data:{"ImpactRatingData" : data[0]}});
}

updateStatusinherentimpact(data:any) {
  return this.post("/business-continuity-management/master/risk-rating/manage-overall-risk-rating", {data:{"ImpactRatingData" : data[0]}});
}

addNewoverallinherentriskscore(data:any) {
  return this.post("/business-continuity-management/master/risk-rating/manage-overall-risk-rating", {data:{"OverallRiskScore" : data[0]}})
}

addNewoverallinherentriskrating(data:any) {
  return this.post("/business-continuity-management/master/risk-rating/manage-overall-risk-rating", {data:{"OverallRiskRating" : data[0]}})
}

updateDataoverallinherentriskrating(data:any) {
  return this.post("/business-continuity-management/master/risk-rating/manage-overall-risk-rating", {data:{"OverallRiskRating" : data[0]}})
}

updateStatusoverallinherentriskrating(data:any) {
  return this.post("/business-continuity-management/master/risk-rating/manage-overall-risk-rating", {data:{"OverallRiskRating" : data[0]}})
}

getMasterInherentRiskScreen(){
  return this.post("/business-continuity-management/master/risk-rating/get-data-for-overall-risk-rating", {});
}

}
