import { TestBed } from '@angular/core/testing';

import { GlobalDashboardService } from './global-dashboard.service';

describe('GlobalDashboardService', () => {
  let service: GlobalDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
