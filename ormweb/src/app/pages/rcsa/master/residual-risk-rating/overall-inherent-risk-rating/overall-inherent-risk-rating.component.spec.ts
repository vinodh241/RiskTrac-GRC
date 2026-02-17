import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverallInherentRiskRatingComponent } from './overall-inherent-risk-rating.component';

describe('OverallInherentRiskRatingComponent', () => {
  let component: OverallInherentRiskRatingComponent;
  let fixture: ComponentFixture<OverallInherentRiskRatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OverallInherentRiskRatingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OverallInherentRiskRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
