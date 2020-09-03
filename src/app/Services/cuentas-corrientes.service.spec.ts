import { TestBed } from '@angular/core/testing';

import { CuentasCorrientesService } from './cuentas-corrientes.service';

describe('CuentasCorrientesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CuentasCorrientesService = TestBed.get(CuentasCorrientesService);
    expect(service).toBeTruthy();
  });
});
