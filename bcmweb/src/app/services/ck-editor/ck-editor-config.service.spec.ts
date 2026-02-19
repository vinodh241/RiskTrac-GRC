import { TestBed } from '@angular/core/testing';

import { CkEditorConfigService } from './ck-editor-config.service';

describe('CkEditorConfigService', () => {
  let service: CkEditorConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CkEditorConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
