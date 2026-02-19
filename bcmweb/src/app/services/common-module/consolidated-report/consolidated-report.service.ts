import { Inject, Injectable } from '@angular/core';
import { RestService } from '../../rest/rest.service';
import { UtilsService } from '../../utils/utils.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { DOCUMENT, DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { BehaviorSubject } from 'rxjs';
import { addIndex, dateToString, formatedDate1 } from 'src/app/includes/utilities/commonFunctions';
import * as XLSX from 'xlsx-js-style';

@Injectable({
  providedIn: 'root'
})
export class ConsolidatedReportService extends RestService {

  public FormatedReportHeader : any[] = [];
  public FormatedReportData   : any[] = [];

  // Incident Report and BCP Report - Declarations
  public incidentReportMaster: any;
  public bcpReportList: any;
  public gotIncidentReportData$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public gotBCPReportData$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  rowCountsBG: any = [];
  rowCountsBU: any = [];

  constructor(
    private _http: HttpClient,
    private _dialog: MatDialog,
    private datePipe: DatePipe,
    private utils: UtilsService,
    @Inject(DOCUMENT) private _document: any) {
    super(_http, _dialog);
  }

  getIncidentConsolidatedReportData(payload: any, url: any) {
    if (environment.dummyData) {
      this.processIncidentReportData({
        "success": 1,
        "message": "Data fetch from DB successful.",
        "result": {
          IncidentsReportData: [{
            IncidentID: 1,
            IncidentCode: 'IN23020',
            IncidentStatus: 'Ongoing',
            IncidentStatusID: 1,
            IncidentStartDateTime: '2024-03-22T20:21:34.757Z',
            IncidentEndDateTime: '2024-03-23T20:00:34.757Z',
            IncidentTitle: 'Fire in Basement',
            IncidentNature: 'Fire Incident',
            IncidentNatureID: 1,
            Classification: 'Major',
            ClassificationID: 1,
            IncidentLocation: 'Amlak DR Center',
            IncidentLocationID: 1,
            IncidentDescription: 'lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enimad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
            PostIncidentEvaluationConclusion: '<p>Evaluation added<p>',
            IsReviewer: 1,
            IsReviewed: 1,
            ActionsTaken: [{
              ActionID: 1,
              Action: 'Employees in basement and 2 floors asked to evacuate',
              ActionDateTime: '2024-01-11T13:23:28.490Z'
            }],
            ActionPlan: [{
              ActionItemID: 1,
              ActionItem: 'Duis aute irure dolor in reprehenderit',
              StartDate: '2024-03-15T10:21:34.757',
              TargetDate: '2024-03-15T10:21:34.757',
              ActionItemOwner: 'HR',
              ActionItemOwnerGUID: 1
            }],
          }]
        },
        "error": {
          "errorCode": null,
          "errorMessage": null
        },
        "token": ''
      });
    }
    else {
      this.post(url, { data: payload }).subscribe(res => {
        next:
        if (res.success == 1) {
          this.processIncidentReportData(res)
        } else {
          if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
          else
            this.popupInfo("Unsuccessful", res.error.errorMessage)
        }
      });
    }
  }

  htmlToPlainText(html: string): string {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = html;
    return tempElement.textContent || tempElement.innerText || '';
  }

  processIncidentReportData(res: any) {
    this.incidentReportMaster = addIndex(res.result.IncidentsReportData, false);
    this.incidentReportMaster = this.incidentReportMaster.map((inc: any) => {
      inc.FormatedStartDate   = formatedDate1(inc.IncidentStartDateTime);
      inc.FormatedEndDate     = formatedDate1(inc.IncidentEndDateTime);
      inc.FormatedActionsTaken= ((inc.ActionsTaken  ||  []).map((action: any) => action.Action)).join();
      inc.FromatedActionPlan  = ((inc.ActionPlan  || []).map((action: any) => action.ActionItem)).join();
      inc.ActionItemOwner     = ((inc.ActionPlan  || []).map((action: any) => action.ActionItemOwner)).join();
      return inc;
    });
    this.FormatedReportHeader = [ 'Sl. No.', 'Incident Title', 'Incident Code', 'Incident Status', 'Incident Start Date & Time',
      'Incident End Date & Time', 'Incident Nature', 'Classification', 'Incident Location', 'Description', 'Post-incident Evaluation & Conclusion',
      'Actions Taken so far / Updates', 'Action Plan', 'Action Plan Owner'
    ];

    this.incidentReportMaster.forEach((x: any) => {
      this.FormatedReportData.push([x.Index, (x.IncidentTitle || ''), (x.IncidentCode || ''), (x.ActualStatus || ''), (x.FormatedStartDate || ''),
        (x.FormatedEndDate || ''), (x.IncidentNature || ''), (x.Classification || ''), (x.IncidentLocation || ''), (x.IncidentDescription || ''),
        (this.htmlToPlainText(x.PostIncidentEvaluationConclusion) || ''),
        (x.FormatedActionsTaken || ''), (x.FromatedActionPlan || ''), (x.ActionItemOwner || '')]
      );
    });

    this.gotIncidentReportData$.next(true);
  }

  DownloadIncidentReport(ReportName: any) {
    if(!!this.FormatedReportData && this.FormatedReportData?.length > 0) {
      this.openWait("Downloading...");
      const wb = XLSX.utils.book_new();
      const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([this.FormatedReportHeader, ...this.FormatedReportData]);

      const headerCellStyle = {
        font: { bold: true },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { rgb: 'C4D79B' } },  // Header background color
        alignment: { vertical: 'top' },
        border: {
          top: { style: 'thin', color: { rgb: '000000' } }, // Top border
          bottom: { style: 'thin', color: { rgb: '000000' } }, // Bottom border
          left: { style: 'thin', color: { rgb: '000000' } }, // Left border
          right: { style: 'thin', color: { rgb: '000000' } }, // Right border
        },
      };

      this.FormatedReportHeader.forEach((header: any, i: any) => {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: i });
        ws[cellAddress].s = headerCellStyle;
      });

      const wscols = this.FormatedReportHeader.map((col: string, i: number) => {
        const dataWidth = Math.max(
          col.length,
          ...this.FormatedReportData.map((row: any) => (row[i] ? String(row[i]).length : 0))
        );

        const columnWidth = dataWidth > 45 ? 45 : dataWidth;

        return {
          wch: columnWidth,
          s: {
            ...(dataWidth > 45 && { alignment: { wrapText: true } }),
          },
        };
      });
      ws['!cols'] = wscols;

      const wrapTextColumnIndices = [1, 6, 8, 9, 10, 11, 12, 13];

      const wscols2 = this.FormatedReportHeader.map((col: any, i: any) => {
        const isWrapTextColumn = wrapTextColumnIndices.includes(i);
        const maxColumnWidth = isWrapTextColumn
          ? Math.min(
            50,
            this.FormatedReportData.reduce((maxWidth: any, row: any) => {
              const cellValue = row[i];
              const cellWidth = cellValue ? String(cellValue).length : 0;
              return Math.max(maxWidth, cellWidth);
            }, col.length)
          )
          : ![2, 3, 4, 5, 7].includes(i) ? 10
          : Math.max(col.length, ...this.FormatedReportData.map((row: any) => (row[i] ? String(row[i]).length : 0)));
        return {
          wch: maxColumnWidth,
          s: { alignment: { vertical: 'top' } }
        };
      });

      ws['!cols'] = wscols2;

      const statusStyles: any = [{ fill: { type: 'pattern', pattern: 'solid', fgColor: { rgb: 'da260b' } } }, {fill: { type: 'pattern', pattern: 'solid', fgColor: { rgb: 'f5991e' }}},{fill: { type: 'pattern', pattern: 'solid', fgColor: { rgb: '149d0b' }}}]
      for (var i in ws) {
        if (typeof ws[i] != 'object') continue;
        let cell = XLSX.utils.decode_cell(i);

        if (cell.r >= 1) {
          if (cell.c == 7) {
            if (ws[i].v == 'Major') {
              ws[i].s = statusStyles[0];
            } else if (ws[i].v == 'Moderate') {
              ws[i].s = statusStyles[1];
            } else if (ws[i].v == 'Minor'){
              ws[i].s = statusStyles[2];
            }
          }
          if (!ws[i].s) {
            ws[i].s = {};
          }
          ws[i].s.alignment = {
            ...(ws[i].s.alignment || {vertical: 'top'}),
            wrapText: true,
          };
        }
      }

      ws['!protect'] = { selectLockedCells: true, selectUnlockedCells: true };
      XLSX.utils.book_append_sheet(wb, ws, 'Incidents');

      let FullReportName = ReportName + '_'
        + this.datePipe.transform(new Date(), 'dd-MM-yyyy') + '_' + new Date().toLocaleTimeString() + '.xlsx'
      XLSX.writeFile(wb, FullReportName)
      this.closeWait();

      this.FormatedReportHeader = [];
      this.FormatedReportData = [];
      this.gotIncidentReportData$.next(false);
    }
  }

  // Subscribing get BCP list for consolidated report
  getBCPConsolidatedReportData(payload: any, url: any) {
    if (environment.dummyData) {
      this.processBCPReportData({
    "success": 1,
    "message": "Saved successfully.",
    "result": {
        "FinalBusinessContinuityPlansList": [
            {
                "BusinessContinuityPlanID": 1,
                "BusinessFunctionID": 1,
                "BusinessFunctionName": "Collections.",
                "BusinessGroupID": 2,
                "BusinessGroup": "Operations & Shared Services",
                "DocStatusID": 3,
                "DocStatus": "Published",
                "BIARating": "Medium",
                "SubProcessList": [
                    {
                        "SubProcessID": 1,
                        "SubProcessName": "Description ",
                        "BusinessProcessID": 1
                    }
                ],
                "TechnologyDependencies": [
                    {
                        "ApplicationID": 10056,
                        "ApplicationName": "14359457"
                    }
                ],
                "InterdependentProcess": [
                    {
                        "SubProcessID": 1,
                        "SubProcessName": "Description ",
                        "DependentFunction": "Retail Business",
                        "DependencyTypeID": 1,
                        "DependencyType": "Upstream"
                    }
                ],
                "SupplierDependencies": [
                    {
                        "SupplierID": 33,
                        "SupplierName": "Akon",
                        "SubProcessID": 1
                    }
                ],
                "VitalRecords": [
                    {
                        "SubProcessID": 1,
                        "MediaType": "Electronic & Physical",
                        "AlternateSource": "Data backup"
                    }
                ],
                "CriticalEquipmentSupplies": [
                    {
                        "CriticalEquipementName": "Telephone",
                        "TotalCount": 10,
                        "MinCount": 10
                    }
                ],
                "MTPD": "10 Hours",
                "RTO": "10 Day(s)",
                "RPO": "21 Day(s)",
                "MACValue": "10%",
                "MNPRRemotely": 10,
                "MNPROnPremise": 10,
                "SiteID": 1,
                "SiteName": "Amlak Head Office",
                "BusinessProcessID": 1,
                "BusinessProcessName": "Description ",
                "PeakHoursStartTime": "11:23 PM",
                "PeakHoursEndTime": "11:27 PM",
                "NormalHoursStartTime": "11:23 AM",
                "NormalHoursEndTime": "11:23 PM"
            }
        ]
      },
    "error": {
        "errorCode": null,
        "errorMessage": null
      }
    });
    }
    else {
      this.post(url, { data: payload }).subscribe(res => {
        next:
        if (res.success == 1) {
          this.processBCPReportData(res)
        } else {
          if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
          else
            this.popupInfo("Unsuccessful", res.error.errorMessage)
        }
      });
    }
  }

  // formatting the API result for BCP report data
  processBCPReportData(res: any) {
    this.bcpReportList = res.result.FinalBusinessContinuityPlansList.map((bcp: any) => {
      let addedIndex = 1;
      bcp.PeakWorkingHours            = (bcp.PeakHoursStartTime != null && bcp.PeakHoursEndTime != null) ? `${bcp.PeakHoursStartTime} - ${bcp.PeakHoursEndTime}` : 'NA';
      bcp.NormalWorkingHours          = (bcp.NormalHoursStartTime != null && bcp.NormalHoursEndTime != null) ? `${bcp.NormalHoursStartTime} - ${bcp.NormalHoursEndTime}` : 'NA';
      bcp.formatDependantFunctions    = bcp.InterdependentProcess.map((inter: any) => inter.DependentFunction).join(", ");
      bcp.formatDependencyType        = bcp.InterdependentProcess.map((inter: any) => {
        return `${inter.SubProcessName} - ${inter.DependencyType}`
      }).join(", ");
      bcp.formatTechDependency        = bcp.TechnologyDependencies.map((tech: any) => tech.ApplicationName).join(", ");
      bcp.formatSupplierNames         = bcp.SupplierDependencies.map((supp: any) => supp.SupplierName).join(", ");
      bcp.RecordNames                 = null;
      bcp.formatMediaTypes            = bcp.VitalRecords.map((mtype: any) => mtype.MediaType).join(", ");
      bcp.formatAlternateSources      = bcp.VitalRecords.map((alt: any) => alt.AlternateSource).join(", ");
      bcp.formatEquipments            = bcp.CriticalEquipmentSupplies.map((equip: any) => equip.CriticalEquipementName).join(", ");
      bcp.formatTotalCounts           = bcp.CriticalEquipmentSupplies.map((equip: any) => equip.TotalCount).join(", ");
      bcp.formatMinCounts             = bcp.CriticalEquipmentSupplies.map((equip: any) => equip.MinCount).join(", ");
      bcp.formatSubProcessList        = (bcp.SubProcessList != null) ? bcp.SubProcessList.map((sub: any) => {
        return `${addedIndex++}. ${sub.SubProcessName}`
      }).join(", ") : null;
      return bcp;
    });

    this.FormatedReportHeader = [
      ["Consolidated BIA Results - Version 1.0", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",  "Vital Records", "",  "Critical Equipment & Supplies", "", ""],
      ['Business Group', 'Business Unit', 'Business Processes', 'Sub Processes/Activities',
      'Facility/Premises Required', 'MTPD', 'RTO', 'RPO', 'Peak Working Hours', 'Normal Working Hours',
      'Dependant Function', 'Dependency Type(Upstream or Downstream)', 'IT/Technology Dependancy',
      'Supplier Name', 'Minimum Acceptable Capacity', 'Minimum No. of People Required Working Remotely',
      'Minimum No. of People Required On Premise', 'LastReviewedDate', 'BIA', 'Media Type(Electronic/Physical)', 'Alternate Source (e.g. Data Backup)',
      'Critical Equipment', 'Total Count', 'Min Count']
    ];

    this.bcpReportList.forEach((x: any) => {
      this.FormatedReportData.push([(x.BusinessGroup || ''), (x.BusinessFunctionName || ''), (x.BusinessProcessName || ''), (x.formatSubProcessList || ''),
        (x.SiteName || ''), (x.MTPD || ''), (x.RTO || ''), (x.RPO || ''), (x.PeakWorkingHours || ''),
        (x.NormalWorkingHours || ''), (x.formatDependantFunctions || ''), (x.formatDependencyType || ''),
        (x.formatTechDependency || ''), (x.formatSupplierNames || ''), (x.MACValue || ''), (x.MNPRRemotely || ''),
        (x.MNPROnPremise || ''), (x.LastReviewedDate || ''), (x.BIARating || ''), (x.formatMediaTypes || ''), (x.formatAlternateSources || ''),
        (x.formatEquipments || ''), (x.formatTotalCounts || ''), (x.formatMinCounts || '')]
      );

    });

    this.gotBCPReportData$.next(true);
  }

  // Downloading BCP report
  DownloadBCPReport(ReportName: any) {
    if(!!this.FormatedReportData && this.FormatedReportData?.length > 0) {
      this.openWait("Downloading...");
      const wb = XLSX.utils.book_new();
      const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(
      this.FormatedReportHeader.concat(this.FormatedReportData));

      const headerCellStyle = {
        font: { bold: true },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { rgb: 'C4D79B' } },  // Second Header background color
        alignment: { vertical: 'top' },
        border: {
          top: { style: 'thin', color: { rgb: '000000' } }, // Top border
          bottom: { style: 'thin', color: { rgb: '000000' } }, // Bottom border
          left: { style: 'thin', color: { rgb: '000000' } }, // Left border
          right: { style: 'thin', color: { rgb: '000000' } }, // Right border
        },
      };

      const headerStyleVitalRecords = {
        font: {bold: true, sz: 13, color: {rgb: "FFFFFF"}},
        fill: { type: 'pattern', pattern: 'solid', fgColor: { rgb: '366092' } },  // First Header background color
        alignment: { vertical: 'center' , horizontal: 'center'},
        border: {
          top: { style: 'thin', color: { rgb: '000000' } }, // Top border
          bottom: { style: 'thin', color: { rgb: '000000' } }, // Bottom border
          left: { style: 'thin', color: { rgb: '000000' } }, // Left border
          right: { style: 'thin', color: { rgb: '000000' } }, // Right border
        },
      }

      this.FormatedReportHeader[1].forEach((header: any, i: any) => {
        const cellAddress = XLSX.utils.encode_cell({ r: 1, c: i });
        ws[cellAddress].s = headerCellStyle;
      });

      ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 18} },
      { s: { r: 0, c: 19 }, e: { r: 0, c: 20} },
      { s: { r: 0, c: 21 }, e: { r: 0, c: 23 } },
    ];

      this.FormatedReportHeader[0].forEach((header: any, i: any) => {
        const cellAddress = XLSX.utils.encode_cell({r: 0, c: i});
        ws[cellAddress].s = headerStyleVitalRecords;
      })

      ws['!cols'] = [
      { wch: 30 }, { wch: 30 }, { wch: 20 }, { wch: 30 }, { wch: 40 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 20 }, { wch: 20 },
      { wch: 20 }, { wch: 30 }, { wch: 30 }, { wch: 30 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, {wch: 20}, {wch: 10}, { wch: 30 }, { wch: 30 }, { wch: 30 }, { wch: 10 }, {wch: 10}
    ];

      // adding styles for High, Medium, Low BIA ratings
      const BIAStatusStyles: any = [{ fill: { type: 'pattern', pattern: 'solid', fgColor: { rgb: 'DE1010' } } }, {fill: { type: 'pattern', pattern: 'solid', fgColor: { rgb: 'F6F63E' }}},{fill: { type: 'pattern', pattern: 'solid', fgColor: { rgb: '18E435' }}}] 
      for (var i in ws) {
        if (typeof ws[i] != 'object') continue;
        let cell = XLSX.utils.decode_cell(i);

        if (cell.r >= 2) {
          if (cell.c == 18) {
            if (ws[i].v == 'High') {
              ws[i].s = BIAStatusStyles[0];
            } else if (ws[i].v == 'Medium') {
              ws[i].s = BIAStatusStyles[1];
            } else if (ws[i].v == 'Low'){
              ws[i].s = BIAStatusStyles[2];
            }
          }
          if (!ws[i].s) {
            ws[i].s = {};
          }
        }
      }

      // ws['!protect'] = { selectLockedCells: true, selectUnlockedCells: true };
      XLSX.utils.book_append_sheet(wb, ws, 'Business Continuity Plans');

      let FullReportName = ReportName + '_'
        + this.datePipe.transform(new Date(), 'dd-MM-yyyy') + '_' + new Date().toLocaleTimeString() + '.xlsx'
      XLSX.writeFile(wb, FullReportName)
      this.closeWait();

      this.FormatedReportHeader = [];
      this.FormatedReportData = [];
      this.gotBCPReportData$.next(false);
    }
  }


  // common functions below
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
      }, timeout)
    });
  }
}
