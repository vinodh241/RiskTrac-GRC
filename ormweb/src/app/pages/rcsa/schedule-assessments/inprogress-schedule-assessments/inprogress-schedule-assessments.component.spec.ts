import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InprogressScheduleAssessmentsComponent } from './inprogress-schedule-assessments.component';

describe('InprogressScheduleAssessmentsComponent', () => {
  let component: InprogressScheduleAssessmentsComponent;
  let fixture: ComponentFixture<InprogressScheduleAssessmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InprogressScheduleAssessmentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InprogressScheduleAssessmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
