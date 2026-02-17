import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskMetricLevelsComponent } from './risk-metric-levels.component';

describe('RiskMetricLevelsComponent', () => {
  let component: RiskMetricLevelsComponent;
  let fixture: ComponentFixture<RiskMetricLevelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskMetricLevelsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiskMetricLevelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
