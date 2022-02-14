import { TestBed } from '@angular/core/testing';

import { UsuarioResponsableService } from './usuario-responsable.service';

describe('UsuarioResponsableService', () => {
  let service: UsuarioResponsableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsuarioResponsableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
