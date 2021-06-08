import { TestBed } from '@angular/core/testing';

import { ModalNotificacionService } from './modal-notificacion.service';

describe('ModalNotificacionService', () => {
  let service: ModalNotificacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalNotificacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
