import { TestBed } from '@angular/core/testing';

import { UsuarioComunService } from './usuario-comun.service';

describe('UsuarioComunService', () => {
  let service: UsuarioComunService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsuarioComunService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
