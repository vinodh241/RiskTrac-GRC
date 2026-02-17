import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewScheduleSelfAssessmentsComponent } from './new-schedule-self-assessments.component';

describe('NewScheduleSelfAssessmentsComponent', () => {
  let component: NewScheduleSelfAssessmentsComponent;
  let fixture: ComponentFixture<NewScheduleSelfAssessmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewScheduleSelfAssessmentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewScheduleSelfAssessmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
