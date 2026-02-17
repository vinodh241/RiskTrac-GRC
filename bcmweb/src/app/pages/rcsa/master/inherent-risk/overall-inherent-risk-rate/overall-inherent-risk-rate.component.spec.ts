import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverallInherentRiskRateComponent } from './overall-inherent-risk-rate.component';

describe('OverallInherentRiskRateComponent', () => {
  let component: OverallInherentRiskRateComponent;
  let fixture: ComponentFixture<OverallInherentRiskRateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OverallInherentRiskRateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OverallInherentRiskRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
