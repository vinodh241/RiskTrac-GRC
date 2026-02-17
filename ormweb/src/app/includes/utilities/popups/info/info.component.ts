import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
  encapsulation: ViewEncapsulation.None // Allow styles to apply to dynamically inserted HTML
})
export class InfoComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sanitizer: DomSanitizer
  ) {
  }

  ngOnInit(): void {
  }

  getFormattedContent(): SafeHtml {
    if (!this.data.content) {
      return '';
    }
    
    // Replace "Failed Records:" with red colored version
    const formatted = this.data.content.replace(
      /Failed Records:/g,
      '<span class="failed-records-label">Failed Records:</span>'
    );
    
    // Sanitize and return as safe HTML
    return this.sanitizer.bypassSecurityTrustHtml(formatted);
  }

}
