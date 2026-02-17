import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskMetricsComponent } from './risk-metrics.component';

describe('RiskMetricsComponent', () => {
  let component: RiskMetricsComponent;
  let fixture: ComponentFixture<RiskMetricsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskMetricsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiskMetricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
