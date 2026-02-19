import { DOCUMENT, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import jsPDF from 'jspdf';
import { UtilsService } from '../../utils/utils.service';
import { RestService } from '../../rest/rest.service';
import html2canvas from 'html2canvas';
import { WaitComponent } from 'src/app/includes/utilities/popups/wait/wait.component';

@Injectable({
  providedIn: 'root'
})
export class ExportDashboardViewService {
  // @ts-ignore
  wait;

  constructor(
    private _http: HttpClient,
    private datePipe: DatePipe,
    private _dialog: MatDialog,
    private utils: UtilsService,
    @Inject(DOCUMENT) private _document: any) {
  }

  // Export Dasboard View
  exportDashboardView(from: any, componentIds: Array<string>, selectedYear: string) {
    const pdfsize = 'a4';
    const pdf = new jsPDF('p', 'px', pdfsize);

    let contentHeight = 50;
    let linebreak = 20;
    let leftAlign = 55;
    let lineHeight = 5;
    //=============================Dashboard Title=============================
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);

    // Split text into lines to fit the page width
    const title = from + ' Dashboard'
    const maxWidth = pdf.internal.pageSize.width - 20; // 20px padding
    const textLines = pdf.splitTextToSize(title, maxWidth);

    // Add each line to the PDF
    textLines.forEach((line:any) => {
      const textWidth = pdf.getStringUnitWidth(line) * 12 / pdf.internal.scaleFactor; // Adjust font size factor as needed
      pdf.text(line, (pdf.internal.pageSize.width - textWidth) / 2, contentHeight);
      contentHeight += 10; // Increase content height for the next line
    });

    contentHeight += 30;

    pdf.text(`Financial Year : ${selectedYear}`, leftAlign, contentHeight);
    contentHeight += 30;

    //=============================Widget Images Starts=============================
    const imgWidth = 300; // Example width, adjust as needed

    const capturePromises = componentIds.map(id => {
      return this.captureComponent(id, imgWidth);
    });

    let count = 0;
    Promise.all(capturePromises).then((capturedImageData: any) => {
      capturedImageData.forEach((image: any, index: number) => {
        pdf.text(this.getWidgetTitle(componentIds[index], index + 1), leftAlign, contentHeight);
        contentHeight += (lineHeight *2);

        pdf.addImage(image.contentDataURL, 'jpeg', 50, contentHeight, image.imgWidth + 50, image.imgHeight + 10);
        count += 1;
        contentHeight += (image.imgHeight + 50)
        if (count == 2 && (++index < componentIds.length)) {
          count = 0;
          contentHeight = 50;
          pdf.addPage()
        }
      });

      this.downloadDashboardViewPDF(title, pdf)
    }).catch(error => {
      console.error('Error:', error);
    });

    //=============================Widget Images Ends===============================
  }

  getWidgetTitle(Id: string, index: number) {
    let splitedTitle = Id.split('-');
    splitedTitle = splitedTitle.slice(1, splitedTitle.length - 1)
    splitedTitle = splitedTitle.map((x: any) => x[0].toUpperCase() + x.slice(1));
    return ( index + '. ' + splitedTitle.join(' '));
  }

  captureComponent(componentId: string, imgWidth: number): Promise<{ contentDataURL: string, imgWidth: number, imgHeight: number }> {
    return new Promise((resolve, reject) => {
      const element: any = document.getElementById(componentId);
      if (!element) {
        reject(`Element with ID ${componentId} not found.`);
        return;
      }

      html2canvas(element).then(canvas => {
        const imgHeight = canvas.height * imgWidth / canvas.width;

        const imageData = {
          contentDataURL: canvas.toDataURL('image/jpeg'),
          imgWidth: imgWidth,
          imgHeight: imgHeight
        };

        resolve(imageData);
      }).catch(error => {
        reject(error);
      });
    });
  }

  downloadDashboardViewPDF(title: string, pdf: any) {
    // Generate pages and print
    const totalPages = pdf.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.text(
        `Page ${i} of ${totalPages}`,
        (pdf.internal.pageSize.width/2) - 15,
        pdf.internal.pageSize.height - 15
      );
    }

    this.closeWait();
    let FullReportName = (title.split(' ').join('_')) + '_'
    + this.datePipe.transform(new Date(), 'dd-MM-yyyy') + '_' + new Date().toLocaleTimeString() + '.pdf';
    pdf.save(FullReportName);
  }


  openWait(masg: any): void {
    this.wait = this._dialog.open(WaitComponent, {
      disableClose: true,
      panelClass: "dark",
      data: {
        text: masg
      }
    })
  }

  closeWait(): void {
    this.wait.close()
  }
}


