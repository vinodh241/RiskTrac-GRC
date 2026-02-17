import { TestBed } from '@angular/core/testing';

import { ControlFrequencyScoreService } from './control-frequency-score.service';

describe('ControlFrequencyScoreService', () => {
  let service: ControlFrequencyScoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ControlFrequencyScoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
