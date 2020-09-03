import { TestBed } from '@angular/core/testing';

import { PagaresService } from './pagares.service';

describe('PagaresService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PagaresService = TestBed.get(PagaresService);
    expect(service).toBeTruthy();
  });
});
