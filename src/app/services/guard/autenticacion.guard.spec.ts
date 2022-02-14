import { TestBed } from '@angular/core/testing';

import { AutenticacionGuard } from './autenticacion.guard';

describe('AutenticacionGuard', () => {
  let guard: AutenticacionGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AutenticacionGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
