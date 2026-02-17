import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-template-dialog',
  templateUrl: './template-dialog.component.html',
  styleUrls: ['./template-dialog.component.scss']
})
export class TemplateDialogComponent implements OnInit {
  // normalize message property so template can always use `message`
  public title: string = 'Info';
  public message: string = '';

  constructor(
    public dialogRef: MatDialogRef<TemplateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    // debug: make sure data arrived
    // console.log('TemplateDialogComponent received dialog data:', this.data);

    // accept multiple possible payload shapes
    if (!this.data) {
      this.message = 'No data provided';
      return;
    }

    this.title = this.data.title || this.data.heading || this.title;

    // prefer message, fallback to text or raw string
    if (typeof this.data.message === 'string' && this.data.message.trim().length) {
      this.message = this.data.message;
    } else if (typeof this.data.text === 'string' && this.data.text.trim().length) {
      this.message = this.data.text;
    } else if (typeof this.data === 'string' && this.data.trim().length) {
      this.message = this.data;
    } else {
      // if data is object with other fields, stringify a safe representation
      try {
        this.message = JSON.stringify(this.data, null, 2);
      } catch {
        this.message = 'Unable to display data';
      }
    }
  }

  close() {
    this.dialogRef.close();
  }
}
