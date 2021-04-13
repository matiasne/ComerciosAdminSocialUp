import { TestBed } from '@angular/core/testing';

import { ClientesPuntosService } from './clientes-puntos.service';

describe('ClientesPuntosService', () => {
  let service: ClientesPuntosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientesPuntosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
