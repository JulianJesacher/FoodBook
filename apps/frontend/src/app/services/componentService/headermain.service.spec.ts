import { TestBed } from '@angular/core/testing';

import { HeadermainService } from './headermain.service';

describe('HeadermainService', () => {
  let service: HeadermainService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeadermainService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
