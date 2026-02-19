import { TestBed } from '@angular/core/testing';

import { ExportDashboardViewService } from './export-dashboard-view.service';

describe('ExportDashboardViewService', () => {
  let service: ExportDashboardViewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExportDashboardViewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
