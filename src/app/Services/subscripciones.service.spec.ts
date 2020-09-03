import { TestBed } from '@angular/core/testing';

import { SubscripcionesService } from './subscripciones.service';

describe('SubscripcionesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SubscripcionesService = TestBed.get(SubscripcionesService);
    expect(service).toBeTruthy();
  });
});
