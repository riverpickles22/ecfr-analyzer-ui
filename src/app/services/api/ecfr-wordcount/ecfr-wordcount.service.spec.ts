import { TestBed } from '@angular/core/testing';

import { EcfrWordCountService } from './ecfr-wordcount.service';

describe('EcfrAdminService', () => {
  let service: EcfrWordCountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EcfrWordCountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
