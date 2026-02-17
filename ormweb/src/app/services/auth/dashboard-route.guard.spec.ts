import { TestBed } from '@angular/core/testing';

import { DashboardRouteGuard } from './dashboard-route.guard';

describe('DashboardRouteGuard', () => {
  let guard: DashboardRouteGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(DashboardRouteGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
