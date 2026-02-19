import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportNewIncidentComponent } from './report-new-incident.component';

describe('ReportNewIncidentComponent', () => {
  let component: ReportNewIncidentComponent;
  let fixture: ComponentFixture<ReportNewIncidentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportNewIncidentComponent]
    });
    fixture = TestBed.createComponent(ReportNewIncidentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
