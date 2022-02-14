import { TestBed } from '@angular/core/testing';

import { ResponsableGuard } from './responsable.guard';

describe('ResponsableGuard', () => {
  let guard: ResponsableGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ResponsableGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
