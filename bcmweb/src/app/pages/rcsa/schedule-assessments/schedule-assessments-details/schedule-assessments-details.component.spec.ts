import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleAssessmentsDetailsComponent } from './schedule-assessments-details.component';

describe('ScheduleAssessmentsDetailsComponent', () => {
  let component: ScheduleAssessmentsDetailsComponent;
  let fixture: ComponentFixture<ScheduleAssessmentsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScheduleAssessmentsDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleAssessmentsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
