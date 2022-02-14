import { TestBed } from '@angular/core/testing';

import { EspecialGuard } from './especial.guard';

describe('EspecialGuard', () => {
  let guard: EspecialGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(EspecialGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
