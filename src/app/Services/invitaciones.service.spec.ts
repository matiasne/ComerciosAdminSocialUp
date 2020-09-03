import { TestBed } from '@angular/core/testing';

import { InvitacionesService } from './invitaciones.service';

describe('InvitacionesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InvitacionesService = TestBed.get(InvitacionesService);
    expect(service).toBeTruthy();
  });
});
