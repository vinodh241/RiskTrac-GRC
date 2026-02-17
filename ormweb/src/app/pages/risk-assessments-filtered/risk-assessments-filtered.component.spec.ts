import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RiskAssessmentsFilteredComponent } from './risk-assessments-filtered.component';

describe('RiskAssessmentsFilteredComponent', () => {
  let component: RiskAssessmentsFilteredComponent;
  let fixture: ComponentFixture<RiskAssessmentsFilteredComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskAssessmentsFilteredComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiskAssessmentsFilteredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
