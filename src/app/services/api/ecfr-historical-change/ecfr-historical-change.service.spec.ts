import { TestBed } from '@angular/core/testing';
import { EcfrHistoricalChangeService } from './ecfr-historical-change.service';


describe('IEcfrHistoricalChangeService', () => {
  let service: EcfrHistoricalChangeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EcfrHistoricalChangeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
