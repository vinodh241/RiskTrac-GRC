import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewScheduleAssessmentsComponent } from './new-schedule-assessments.component';

describe('NewScheduleAssessmentsComponent', () => {
  let component: NewScheduleAssessmentsComponent;
  let fixture: ComponentFixture<NewScheduleAssessmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewScheduleAssessmentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewScheduleAssessmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
