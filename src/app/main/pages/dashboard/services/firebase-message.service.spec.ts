import { TestBed } from '@angular/core/testing';

import { FirebaseMessageService } from './firebase-message.service';

describe('FirebaseMessageService', () => {
  let service: FirebaseMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaseMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
