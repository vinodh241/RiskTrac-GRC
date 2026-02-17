import { TestBed } from '@angular/core/testing';

import { SelfAssessmentsService } from './self-assessments.service';

describe('SelfAssessmentsService', () => {
  let service: SelfAssessmentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelfAssessmentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
