import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletedScheduleAssessmentsComponent } from './completed-schedule-assessments.component';

describe('CompletedScheduleAssessmentsComponent', () => {
  let component: CompletedScheduleAssessmentsComponent;
  let fixture: ComponentFixture<CompletedScheduleAssessmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompletedScheduleAssessmentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompletedScheduleAssessmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
