import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverallInherentRiskScoreComponent } from './overall-inherent-risk-score.component';

describe('OverallInherentRiskScoreComponent', () => {
  let component: OverallInherentRiskScoreComponent;
  let fixture: ComponentFixture<OverallInherentRiskScoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OverallInherentRiskScoreComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OverallInherentRiskScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
