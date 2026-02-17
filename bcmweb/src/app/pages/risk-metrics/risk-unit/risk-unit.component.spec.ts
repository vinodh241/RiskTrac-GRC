import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskUnitComponent } from './risk-unit.component';

describe('RiskUnitComponent', () => {
  let component: RiskUnitComponent;
  let fixture: ComponentFixture<RiskUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskUnitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiskUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
