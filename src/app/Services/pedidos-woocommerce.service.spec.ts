import { TestBed } from '@angular/core/testing';

import { PedidosWoocommerceService } from './pedidos-woocommerce.service';

describe('PedidosWoocommerceService', () => {
  let service: PedidosWoocommerceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PedidosWoocommerceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
