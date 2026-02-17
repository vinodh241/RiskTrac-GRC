import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { environment } from 'src/environments/environment';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { RestService } from '../rest/rest.service';
import autoTable from 'jspdf-autotable';

@Injectable({
    providedIn: 'root'
})

export class UtilsService {
    constructor(private dialog:MatDialog, private rest: RestService) { }
    roleORM = localStorage.getItem('rorm') || "XX" //SU, PU, FA
    role = localStorage.getItem('role') || "XX" //SU, PU, FA
    userUnits=JSON.parse(localStorage.getItem('userUnitData') ||'[]')

    formatDate(date: string, showTime:boolean = false): string { //2022-11-19T18:30:00.000Z
        if(date) {
            let ar:any[] = date.toString().split('T')
            let dt:any[] = []
            let t = ""

            if(ar.length > 0)
                dt = ar[0].split('-')
            if(ar.length > 1)
                t = ar[1].split('.')[0]

            let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            let d = dt.length == 3 ? dt[2] + '-' + months[Number(dt[1]) - 1] + '-' + dt[0] : 'DD-MMM-YYYY'

            return showTime?d + " " + t: d
        } else
            return ""
    }

    // formatedDate(DateFormat:any){
    //     try {
    //         let dateValue = new Date(DateFormat);
    //         let day = dateValue.getUTCDate();
    //         let month = dateValue.getUTCMonth() +1;
    //         let year = dateValue.getUTCFullYear();
    //         let newDate = day + "-" + month + "-" + year ;
    //         return newDate;
    //     } catch (error) {
    //         return null;
    //     }
    // }
     formatedDate(DateFormat:any) {
        try {
            // console.log('formatedDate: DateFormat'+DateFormat)
            if (DateFormat != null) {
                let dateValue = new Date(DateFormat);
                let day = dateValue.getUTCDate();
                let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                let monthIndex = dateValue.getUTCMonth();
                let month = monthNames[monthIndex];
                let year = dateValue.getUTCFullYear();
                let newDate = day + "-" + month + "-" + year ;
                // console.log('newDate: formatedDate '+ newDate)
                return newDate ;
            } else {
                return null;
            }
        } catch (error) {
            return null;
        }
    }

    formatDateNew( DateFormat:any){
        try {
            let dateValue = new Date(DateFormat);
            let day = dateValue.getUTCDate();
            let month = dateValue.getUTCMonth() +1;
            let year = dateValue.getUTCFullYear();
            let newDate = day + "-" + month + "-" + year ;
            return newDate;
        } catch (error) {
            return null;

        }

    }


    getZoneColor(score: number): string {
        let color = "#4468AA"
        if (score < 3) color = "#FF0000"
        if (score > 4) color = "#00FF00"
        return color
    }

    ignoreTimeZoneFormat(date: any): string {
        let d: Date = new Date(date)
        return new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes() - d.getTimezoneOffset()).toISOString();
    }

    ignoreTimeZone(date: any): string {
        let d: Date = new Date(date)
        return new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes() - d.getTimezoneOffset()).toISOString();
    }

    //to remove +5:30 and format the date like - "2023-08-21T00:00:00.000Z"
    formatTimeZone(dateval: any) {
        let date = null;
        if (dateval instanceof Date) {
          const d = dateval.getDate();
          let dd = '';
          if (d < 10) {
            dd = '0' + d;
          } else {
            dd = '' + d;
          }
          let m = dateval.getMonth() + 1;
          let mm = '';
          if (m < 10) {
            mm = '0' + m;
          } else {
            mm = '' + m;
          }
          const y = dateval.getFullYear();
          const Timeval = "00:00:00.000Z"
          let val = y + '-' + mm + '-' + dd + 'T' + Timeval;
          date = new Date(val);
        } else if (typeof dateval === 'string' || dateval instanceof String) {
          const dateval2 = dateval.split('T')[0];
          const Timeval = "00:00:00.000Z"
          date = new Date(dateval2 + 'T' + Timeval);
        } else {
          return null;
        }
        return date.toISOString();
      }



    relogin(documnet:any): void {
        const timeout = 3000; // 3 Seconds
        const info = this.dialog.open(InfoComponent, {
            disableClose: true,
            id: 'InfoComponent',
            minWidth: "300px",
            panelClass: "error",
            data: {
                title: "Error",
                content: "Session has expired, please re-login."
            }
        });

        info.afterOpened().subscribe(result => {
            setTimeout(() => {
                info.close();
                document.location.href = environment.hostUrl;
            }, timeout)
        });
    }

    isReadOnlyUserORM(): boolean {
        return ["SU"].includes(this.roleORM)
    }

    isStandardUser(): boolean {
        return ["SU"].includes(this.roleORM)
    }

    isFunctionalAdmin(): boolean {
        return ["FA"].includes(this.roleORM)
    }

    isPowerUser(): boolean {
        return (["PU"].includes(this.roleORM) || ["FA"].includes(this.roleORM))
    }
    isPowerUserRole(): boolean {
        return (["PU"].includes(this.roleORM))
    }

    isRiskManagementUnit():boolean{
        let data=this.userUnits.find((x:any) => x.Abbreviation === "RM");
        return (data!=undefined);
    }

    isLoggedInUserUnitData() {
        return this.userUnits
    }

    // generateHtmlAsImageInPDF(data: any, pdfFileName: string) {
    //     this.rest.openWait("Downloading ...")
    //     html2canvas(data).then((canvas) => {
    //       var imgWidth = 208;
    //       var pageHeight = 295;
    //       var imgHeight = (canvas.height * imgWidth) / canvas.width;
    //       var heightLeft = imgHeight;
    //       const contentDataURL = canvas.toDataURL('image/png');
    //       let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
    //       var position = 0;
    //       pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
    //       pdf.save(pdfFileName);
    //       this.rest.closeWait();
    //     });
    // }

    generateHtmlAsImageInPDF(data: any, pdfFileName: string) {
        this.rest.openWait("Downloading ...");

        html2canvas(data, { scale: 2 }).then((canvas) => {
            // Use the dimensions of the canvas
            var imgWidth = 300;
            var imgHeight = 1200;

            // Adjust the PDF page size based on the canvas dimensions
            let pdf = new jsPDF('p', 'mm', [imgWidth, imgHeight]);

            // Set the position to 0 to start placing the image from the top of the PDF page
            var position = 0;

            // Add image to PDF
            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);

            // Save PDF
            pdf.save(pdfFileName);

            this.rest.closeWait();
        });
    }

    generatePdf(tableId: string, exColumns: string[] = [], fileName: string) {
        const pdfsize = 'a4';
        const pdf = new jsPDF('l', 'pt', pdfsize);
        let pageWidth = pdf.internal.pageSize.getWidth() - 50;

        let styles = { overflow: 'linebreak', fontSize: 10, minCellHeight: 10, columnWidth: pageWidth * 0.125 };
        let data = document.getElementById(tableId) as HTMLElement;

        const tableRows = Array.from(data.querySelectorAll('tr'));

        const tableHeader: any = Array.from(tableRows[0].querySelectorAll('th')).map(th => th.textContent);

        // Exclude unwanted columns from the table header
        // const excludedColumns = ['Recommendations', 'Claimed Closed'];
        const filteredTableHeader = exColumns.length > 0 ? tableHeader.filter((column: any) => !exColumns.includes(column.trim())) : tableHeader;

        console.log("🚀 ~ file: report-kri.component.ts:470 ~ ReportKriComponent ~ generatePdf ~ tableHeader:", filteredTableHeader)

        const tableData = tableRows.slice(1).map(row => {
            // Exclude corresponding data for unwanted columns
            const rowData = Array.from(row.querySelectorAll('td')).map(cell => cell.textContent);
            return exColumns.length > 0 ? rowData.filter((_, index) => !exColumns.includes(filteredTableHeader[index])) : rowData;
        });

        console.log("🚀 ~ file: report-kri.component.ts:472 ~ ReportKriComponent ~ generatePdf ~ tableData:", tableData)

        autoTable(pdf, {
            startY: 60,
            head: [filteredTableHeader],
            body: tableData,
            columns: filteredTableHeader,
            headStyles: { overflow: 'linebreak', fillColor: [140, 180, 156], fontStyle: 'bold', textColor: [255, 255, 255], valign:'middle', halign: 'center' },
            bodyStyles: { textColor: [80, 80, 80] },
            columnStyles: { values: { overflow: 'linebreak', fontSize: 5, minCellHeight: 10, cellWidth: pageWidth * 0.5, textColor: '#505050' } },
        });

        pdf.save(fileName + `_${new Date().toISOString()}.pdf`);
      }
}
