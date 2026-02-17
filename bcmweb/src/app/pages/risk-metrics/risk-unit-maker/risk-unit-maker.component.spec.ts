import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskUnitMakerComponent } from './risk-unit-maker.component';

describe('RiskUnitMakerComponent', () => {
  let component: RiskUnitMakerComponent;
  let fixture: ComponentFixture<RiskUnitMakerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskUnitMakerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiskUnitMakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
