import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcmsAssessmentDetailsComponent } from './bcms-assessment-details.component';

describe('BcmsAssessmentDetailsComponent', () => {
  let component: BcmsAssessmentDetailsComponent;
  let fixture: ComponentFixture<BcmsAssessmentDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BcmsAssessmentDetailsComponent]
    });
    fixture = TestBed.createComponent(BcmsAssessmentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
