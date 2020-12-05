import { TestBed } from '@angular/core/testing';

import { CocinasService } from './cocinas.service';

describe('CocinasService', () => {
  let service: CocinasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CocinasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
