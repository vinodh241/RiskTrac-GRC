import { TestBed } from '@angular/core/testing';

import { ControlTotalScoreService } from './control-total-score.service';

describe('ControlTotalScoreService', () => {
  let service: ControlTotalScoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ControlTotalScoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
