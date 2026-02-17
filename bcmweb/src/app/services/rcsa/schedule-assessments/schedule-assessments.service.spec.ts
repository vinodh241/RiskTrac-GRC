import { TestBed } from '@angular/core/testing';

import { ScheduleAssessmentsService } from './schedule-assessments.service';

describe('ScheduleAssessmentsService', () => {
  let service: ScheduleAssessmentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScheduleAssessmentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
