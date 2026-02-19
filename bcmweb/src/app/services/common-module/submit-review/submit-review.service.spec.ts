import { TestBed } from '@angular/core/testing';

import { SubmitReviewService } from './submit-review.service';

describe('SubmitReviewService', () => {
  let service: SubmitReviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubmitReviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
