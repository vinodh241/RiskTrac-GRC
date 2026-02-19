import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RestService } from '../../rest/rest.service';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from '../../utils/utils.service';
import { MatDialog } from '@angular/material/dialog';
import { DOCUMENT } from '@angular/common';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';


@Injectable({
  providedIn: 'root'
})
export class MasterMetricLibraryService extends RestService {
  public masterMetric!: any;
  public gotMetricMaster: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public metricData!: any;
  public gotInfoMaster: BehaviorSubject<boolean> = new BehaviorSubject(false);

  FinalmetricData: any;

  constructor(
    private utils: UtilsService,
    private _http: HttpClient,
    private _dialog: MatDialog,
    @Inject(DOCUMENT) private _document: any) {
    super(_http, _dialog);
  }

  getMetricData(): void {
    if (environment.dummyData) {
      this.processMetricList({
        "success": 1,
        "message": "Data fetch from DB successful.",
        "result": {
          "metricsLibraryMasterList": [{
            "MetricID": 1,
            "Metric_Code": "2023-0101",
            "Metric_Title": "Percentage of documents revised and updated",
            "Metric_Description": "Documents revised and updated / Total No of documents X 100",
            "Metric_TypeID": 1,
            "Metric_Type": "KRI",
            "Framework_Control": ["ISO 22301 (8.4.1)", "SAMA BCM (5.2)"],
            "Frequency_ID": 1,
            "Review_Frequency": "Annually",
            "Metric_Target": "100%",
            "Metric_OwnerID": 1,
            "Metric_Owner": "BCM",
            "Target_Type_ID": 1,
            "Target_Type": "Percentage",
            "Threshold_ID": 1,
            "Threshold": "= Target",
            "Datapoint_1": "Number of documents revised and updated",
            "Datapoint_2": "Total number of documents",
            "Linked_Framework_Controls": [{
              "FrameworkID": 1,
              "Framework": "SAMA BC",
              "DomainID": 1,
              "Domain": "Operation",
              "ControlID": 1,
              "Control": "Establish and implement business continuity procedures",
            },
            {
              "FrameworkID": 2,
              "Framework": "ISO 22301",
              "DomainID": 1,
              "Domain": "Operations",
              "ControlID": 1,
              "Control": "Establish and implement business continuity procedures",
            }]
          },
          {
            "MetricID": 2,
            "Metric_Code": " 2023-0102",
            "Metric_Title": "Percentage of documents revised and updated",
            "Metric_Description": "Documents revised and updated / Total No of documents X 100",
            "Metric_TypeID": 2,
            "Metric_Type": "KPI",
            "Framework_Control": ["ISO 22301 (8.4.1)", "SAMA BCM (5.2)"],
            "Frequency_ID": 1,
            "Review_Frequency": "Annually",
            "Metric_Target": "100%",
            "Metric_OwnerID": 2,
            "Metric_Owner": "HR Admin",
            "Target_Type_ID": 2,
            "Target_Type": "Absolute Value",
            "Threshold_ID": 2,
            "Threshold": "< Target",
            "Datapoint_1": "Number of documents revised and updated",
            "Datapoint_2": "Total number of documents",
            "Linked_Framework_Controls": [{
              "FrameworkID": 1,
              "Framework": "SAMA BC",
              "DomainID": 1,
              "Domain": "Operation",
              "ControlID": 1,
              "Control": "Establish and implement business continuity procedures",
            },
            {
              "FrameworkID": 2,
              "Framework": "ISO 22301",
              "DomainID": 1,
              "Domain": "Operation",
              "ControlID": 1,
              "Control": "Establish and implement business continuity procedures",
            }]
          }],

          "MetricTypesList": [{
            "Metric_TypeID": 1,
            "Metric_Type": "KRI",
          }],

          "MetricOwnersList": [{
            "Metric_OwnerID": 1,
            "Metric_Owner": "BCM",
          }],

          "TargetTypeslist": [{
            "Target_Type_ID": 1,
            "Target_Type": "Percentage"
          }],

          "ThresholdsList": [{
            "Threshold_ID": 1,
            "Threshold": "= Target"
          }],

          "FrequenciesList": [{
            "Frequency_ID": 1,
            "Frequency": "Annually"
          }],

          "LinkedFrameworkControlsList": [{
            "FrameworkID": 1,
            "Framework": "SAMA BC",
            "DomainID": 1,
            "Domain": "Operation",
            "ControlID": 1,
            "Control": "Establish and implement business continuity procedures"
          }]
        },
        "error": {
          "errorCode": null,
          "errorMessage": null
        },
        "token": "eyJ0eXAiOiJKV"
      })
    } else {
      this.post("/business-continuity-management/master/metrics-library/get-metrics-master", {}).subscribe(res => {
        next:
        if (res.success == 1) {
          // console.log(res);
          this.processMetricList(res)
        } else {
          if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
          else
            this.popupInfo("Unsuccessful", res.error.errorMessage)
        }
      });
    }
  }

  processMetricList(res: any) {
    this.masterMetric = res.result
    // console.log('masterMetric: ', this.masterMetric);
    // this.masterMetric.MetricsLibraryMasterList = this.masterMetric.MetricsLibraryMasterList.map((x: any) => {
    //   x.Framework_Control_New = x.Framework_Control.join(',');
    //   return x;
    // });
    this.gotMetricMaster.next(true);

  }
  popupInfo(title: string, message: string) {
    const timeout = 3000; // 3 seconds
    const confirm = this._dialog.open(InfoComponent, {
      disableClose: true,
      minWidth: "300px",
      panelClass: "dark",
      data: {
        title: title,
        content: message
      }
    });

    confirm.afterOpened().subscribe(result => {
      setTimeout(() => {
        confirm.close();
        // this.router.navigate(['']);
      }, timeout)
    });
  }

  deleteMetricMaster(data: any) {
    // console.log('data: ', data);
    return this.post("/business-continuity-management/master/metrics-library/delete-metric-master", {
      "data": {
        "MetricID": Number(data.MetricsLibraryID)
      },
    });
  }
  addIndex(docs: any, addEditMode: any) {
    let Index = 1;
    docs.forEach((data: any) => {
      data.Index = Index;
      Index++;
    });
    // console.log('docs: ', docs);

    return docs;
  }

  getMetricLibraryMasterInfo() {
    if (environment.dummyData) {
      this.processMetricLibraryService({
        "success": 1,
        "message": "Data fetch from DB successful.",
        "result": {
          "MetricTypesList": [{
            "Metric_TypeID": 1,
            "Metric_Type": "KPI",
          }, {
            "Metric_TypeID": 2,
            "Metric_Type": "KRI",
          },
          ],

          "MetricOwnersList": [{
            "Metric_OwnerID": 1,
            "Metric_Owner": "HR Admin",
          }],

          "TargetTypeslist": [{
            "Target_Type_ID": 1,
            "Target_Type": "Percentage"
          }],

          "ThresholdsList": [{
            "Threshold_ID": 1,
            "Threshold": "> Target"
          }],

          "FrequenciesList": [{
            "Frequency_ID": 1,
            "Frequency": "Annualy"
          }],

          "LinkedFrameworkControlsList": [{
            "FrameworkID": 1,
            "Framework": "ISO 22301",
            "DomainID": 2,
            "Domain": "8. Operation ",
            "ControlID": 3,
            "Control": "8.4. Establish and implement"
          }],
          "FrameworkList": [{ "Framework": 'Framework1', "FrameworkID": 1 }, { "Framework": 'Framework2', "FrameworkID": 2 }, { "Framework": 'Framework3', "FrameworkID": 3 }],
          "DomainsList": [{ "Domain": 'Option', "DomainID": 4 }, { "Domain": 'Option 1', "DomainID": 5 }, { "Domain": 'Option 2', "DomainID": 6 }],
          "FrameworkControlsList": [{ "Control": 'OptionFrameC', "ControlID": 7 }, { "Control": 'OptionFrameC 1', "ControlID": 8 }, { "Control": 'OptionFrameC 2', "ControlID": 9 }]
        },
        "error": {
          "errorCode": null,
          "errorMessage": null
        },
      })
    } else {
      this.post("/business-continuity-management/master/metrics-library/get-metrics-master-info", {}).subscribe(res => {
        next:
        if (res.success == 1) {
          // console.log(res);

          this.processMetricLibraryService(res)
        } else {
          if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
          else
            this.popupInfo("Unsuccessful", res.error.errorMessage)
        }
      });

    }
  }
  processMetricLibraryService(response: any): void {
    this.metricData = response.result;
    // console.log('metricData: ', this.metricData);
    this.gotInfoMaster.next(true);
  }

  addUpdateMetricData(data: any, mod: any, table: any, metricId?: any) {
    // console.log('metricId: ', metricId);
    // console.log("data", data)

    this.FinalmetricData = {
      MetricID: mod == "Edit" ? Number(metricId.MetricsLibraryID) : null,
      Metric_Code: data.metricCode,
      Metric_TypeID: data.metricType,
      Metric_OwnerID: data.metricOwnerID,
      Metric_Title: data.title,
      Metric_Description: data.description,
      Target_Type_ID: data.targetType,
      Threshold_ID: data.threshold,
      Target_Value: data.targetValue.toString(),
      Frequency_ID: data.frequency,
      Datapoint_Numerator: data.datapoint1Num,
      Datapoint_Denominator: data.datapoint2Deno,
      Framework_Controls: []
    }
    table.forEach((item: any) => {
      this.FinalmetricData["Framework_Controls"].push({
        "FrameworkID": item.FrameworkID,
        "DomainID": item.DomainID,
        "ControlID": item.ControlID
      })
    });

    return this.post((mod != "Add" ? "/business-continuity-management/master/metrics-library/update-metric-master" : "/business-continuity-management/master/metrics-library/add-metric-master"), {data: this.FinalmetricData});

  }

}
