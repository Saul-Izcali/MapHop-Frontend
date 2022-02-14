import { TestBed } from '@angular/core/testing';

import { InvitadoGuard } from './invitado.guard';

describe('InvitadoGuard', () => {
  let guard: InvitadoGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(InvitadoGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
