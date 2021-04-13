import { TestBed } from '@angular/core/testing';

import { WPMediaService } from './media.service';

describe('MediaService', () => {
  let service: WPMediaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WPMediaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
