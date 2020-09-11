import { TestBed } from '@angular/core/testing';

import { CalendariosService } from './calendarios.service';

describe('CalendariosService', () => {
  let service: CalendariosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalendariosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
