import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CardPedidoWoocommerceComponent } from './card-pedido-woocommerce.component';

describe('CardPedidoWoocommerceComponent', () => {
  let component: CardPedidoWoocommerceComponent;
  let fixture: ComponentFixture<CardPedidoWoocommerceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardPedidoWoocommerceComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CardPedidoWoocommerceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
