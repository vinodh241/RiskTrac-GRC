import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KriChartComponent } from './kri-chart.component';

describe('KriChartComponent', () => {
  let component: KriChartComponent;
  let fixture: ComponentFixture<KriChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KriChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KriChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
