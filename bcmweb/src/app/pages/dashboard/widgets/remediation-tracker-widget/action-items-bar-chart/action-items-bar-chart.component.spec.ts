import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionItemsBarChartComponent } from './action-items-bar-chart.component';

describe('ActionItemsBarChartComponent', () => {
  let component: ActionItemsBarChartComponent;
  let fixture: ComponentFixture<ActionItemsBarChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActionItemsBarChartComponent]
    });
    fixture = TestBed.createComponent(ActionItemsBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
