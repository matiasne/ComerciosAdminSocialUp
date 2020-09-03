import { TestBed } from '@angular/core/testing';

import { CajasService } from './cajas.service';

describe('CajasService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CajasService = TestBed.get(CajasService);
    expect(service).toBeTruthy();
  });
});
