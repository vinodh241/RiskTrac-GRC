import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemediationTrackerPieChartComponent } from './remediation-tracker-pie-chart.component';

describe('RemediationTrackerPieChartComponent', () => {
  let component: RemediationTrackerPieChartComponent;
  let fixture: ComponentFixture<RemediationTrackerPieChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RemediationTrackerPieChartComponent]
    });
    fixture = TestBed.createComponent(RemediationTrackerPieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
