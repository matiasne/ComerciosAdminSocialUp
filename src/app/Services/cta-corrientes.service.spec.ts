import { TestBed } from '@angular/core/testing';

import { CtaCorrientesService } from './cta-corrientes.service';

describe('CtaCorrientesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CtaCorrientesService = TestBed.get(CtaCorrientesService);
    expect(service).toBeTruthy();
  });
});
