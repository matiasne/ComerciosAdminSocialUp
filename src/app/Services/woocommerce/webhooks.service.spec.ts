import { TestBed } from '@angular/core/testing';

import { WebhooksService } from './webhooks.service';

describe('WebhooksService', () => {
  let service: WebhooksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebhooksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
