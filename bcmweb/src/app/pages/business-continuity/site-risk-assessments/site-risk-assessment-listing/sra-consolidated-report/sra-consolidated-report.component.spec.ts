import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SraConsolidatedReportComponent } from './sra-consolidated-report.component';

describe('SraConsolidatedReportComponent', () => {
  let component: SraConsolidatedReportComponent;
  let fixture: ComponentFixture<SraConsolidatedReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SraConsolidatedReportComponent]
    });
    fixture = TestBed.createComponent(SraConsolidatedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
