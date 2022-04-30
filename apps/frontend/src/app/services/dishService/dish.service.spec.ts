import { TestBed } from '@angular/core/testing';

import { DishService } from './dish.service';

describe('UploadService', () => {
  let service: DishService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DishService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
