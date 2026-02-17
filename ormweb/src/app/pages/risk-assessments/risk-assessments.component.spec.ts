import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskAssessmentsComponent } from './risk-assessments.component';

describe('RiskAssessmentsComponent', () => {
  let component: RiskAssessmentsComponent;
  let fixture: ComponentFixture<RiskAssessmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskAssessmentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiskAssessmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
