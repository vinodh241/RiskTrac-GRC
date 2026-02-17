import { TestBed } from '@angular/core/testing';

import { ConfigScoreRatingService } from './config-score-rating.service';

describe('ConfigScoreRatingService', () => {
  let service: ConfigScoreRatingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfigScoreRatingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
