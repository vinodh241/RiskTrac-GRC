import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverallControlEnvironmentRatingComponent } from './overall-control-environment-rating.component';

describe('OverallControlEnvironmentRatingComponent', () => {
  let component: OverallControlEnvironmentRatingComponent;
  let fixture: ComponentFixture<OverallControlEnvironmentRatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OverallControlEnvironmentRatingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OverallControlEnvironmentRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
