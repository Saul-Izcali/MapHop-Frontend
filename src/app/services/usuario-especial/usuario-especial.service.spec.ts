import { TestBed } from '@angular/core/testing';

import { UsuarioEspecialService } from './usuario-especial.service';

describe('UsuarioEspecialService', () => {
  let service: UsuarioEspecialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsuarioEspecialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
