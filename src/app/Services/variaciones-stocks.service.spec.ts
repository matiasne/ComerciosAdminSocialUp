import { TestBed } from '@angular/core/testing';

import { VariacionesStocksService } from './variaciones-stocks.service';

describe('VariacionesStocksService', () => {
  let service: VariacionesStocksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VariacionesStocksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
