import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KriHistoricalReportingComponent } from './kri-historical-reporting.component';

describe('KriHistoricalReportingComponent', () => {
  let component: KriHistoricalReportingComponent;
  let fixture: ComponentFixture<KriHistoricalReportingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KriHistoricalReportingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KriHistoricalReportingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
