import { TestBed } from '@angular/core/testing';

import { ComandasService } from './comandas.service';

describe('ComandasService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ComandasService = TestBed.get(ComandasService);
    expect(service).toBeTruthy();
  });
});
