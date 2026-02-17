import { TestBed } from '@angular/core/testing';

import { OverallControlEnvironmentRatingService } from './overall-control-environment-rating.service';

describe('OverallControlEnvironmentRatingService', () => {
  let service: OverallControlEnvironmentRatingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OverallControlEnvironmentRatingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
