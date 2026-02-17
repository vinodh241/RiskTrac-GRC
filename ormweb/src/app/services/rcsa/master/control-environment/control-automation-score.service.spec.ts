import { TestBed } from '@angular/core/testing';

import { ControlAutomationScoreService } from './control-automation-score.service';

describe('ControlAutomationScoreService', () => {
  let service: ControlAutomationScoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ControlAutomationScoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
