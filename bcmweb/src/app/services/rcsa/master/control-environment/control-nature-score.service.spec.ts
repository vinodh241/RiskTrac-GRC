import { TestBed } from '@angular/core/testing';

import { ControlNatureScoreService } from './control-nature-score.service';

describe('ControlNatureScoreService', () => {
  let service: ControlNatureScoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ControlNatureScoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
