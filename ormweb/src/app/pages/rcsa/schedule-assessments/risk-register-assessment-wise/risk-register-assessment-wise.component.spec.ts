import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskRegisterAssessmentWiseComponent } from './risk-register-assessment-wise.component';

describe('RiskRegisterAssessmentWiseComponent', () => {
  let component: RiskRegisterAssessmentWiseComponent;
  let fixture: ComponentFixture<RiskRegisterAssessmentWiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskRegisterAssessmentWiseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiskRegisterAssessmentWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
