import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskUnitReviewerComponent } from './risk-unit-reviewer.component';

describe('RiskUnitReviewerComponent', () => {
  let component: RiskUnitReviewerComponent;
  let fixture: ComponentFixture<RiskUnitReviewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskUnitReviewerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiskUnitReviewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
