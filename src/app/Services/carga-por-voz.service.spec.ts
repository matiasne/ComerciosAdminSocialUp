import { TestBed } from '@angular/core/testing';

import { CargaPorVozService } from './carga-por-voz.service';

describe('CargaPorVozService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CargaPorVozService = TestBed.get(CargaPorVozService);
    expect(service).toBeTruthy();
  });
});
