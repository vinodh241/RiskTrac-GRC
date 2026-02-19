import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent {

  constructor(
    @Inject(DOCUMENT) private document: any,
  ) {
  }

  ngOnInit(): void {
    localStorage.clear();
    this.document.location.href = environment.hostUrl;
  }
}
