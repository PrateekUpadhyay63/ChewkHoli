import { TestBed } from '@angular/core/testing';

import { GetLocalUserService } from './get-local-user.service';

describe('GetLocalUserService', () => {
  let service: GetLocalUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetLocalUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
