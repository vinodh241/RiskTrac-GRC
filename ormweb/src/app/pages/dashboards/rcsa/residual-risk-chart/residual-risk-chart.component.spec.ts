import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidualRiskChartChartComponent } from './residual-risk-chart.component';

describe('ResidualRiskChartChartComponent', () => {
  let component: ResidualRiskChartChartComponent;
  let fixture: ComponentFixture<ResidualRiskChartChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResidualRiskChartChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResidualRiskChartChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
