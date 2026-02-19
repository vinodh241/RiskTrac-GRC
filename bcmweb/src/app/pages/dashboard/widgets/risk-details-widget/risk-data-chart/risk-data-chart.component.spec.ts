import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskDataChartComponent } from './risk-data-chart.component';

describe('RiskDataChartComponent', () => {
  let component: RiskDataChartComponent;
  let fixture: ComponentFixture<RiskDataChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RiskDataChartComponent]
    });
    fixture = TestBed.createComponent(RiskDataChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
