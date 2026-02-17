import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RasChartComponent } from './ras.component';

describe('RasChartComponent', () => {
  let component: RasChartComponent;
  let fixture: ComponentFixture<RasChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RasChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RasChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
