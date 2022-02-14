import { TestBed } from '@angular/core/testing';

import { ComunGuard } from './comun.guard';

describe('ComunGuard', () => {
  let guard: ComunGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ComunGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
