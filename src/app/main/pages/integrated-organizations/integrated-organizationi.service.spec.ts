import { TestBed } from '@angular/core/testing';

import { IntegratedOrganizationiService } from './integrated-organizationi.service';

describe('IntegratedOrganizationiService', () => {
  let service: IntegratedOrganizationiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IntegratedOrganizationiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
