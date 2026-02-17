import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InheritRiskChartChartComponent } from './inherit-risk-chart.component';

describe('InheritRiskChartChartComponent', () => {
  let component: InheritRiskChartChartComponent;
  let fixture: ComponentFixture<InheritRiskChartChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InheritRiskChartChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InheritRiskChartChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
