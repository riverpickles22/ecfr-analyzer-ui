import { TestBed } from '@angular/core/testing';

import { EcfrAdminService } from './ecfr-admin.service';

describe('EcfrAdminService', () => {
  let service: EcfrAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EcfrAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
