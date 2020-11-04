import { TestBed } from '@angular/core/testing';

import { ClientesEstadosService } from './clientes-estados.service';

describe('ClientesEstadosService', () => {
  let service: ClientesEstadosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientesEstadosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
