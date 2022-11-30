import { TestBed } from '@angular/core/testing';

import { TransferAuthorityService } from './transfer-authority.service';

describe('TransferAuthorityService', () => {
  let service: TransferAuthorityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransferAuthorityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
