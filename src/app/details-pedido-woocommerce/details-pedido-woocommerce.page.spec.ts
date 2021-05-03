import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DetailsPedidoWoocommercePage } from './details-pedido-woocommerce.page';

describe('DetailsPedidoWoocommercePage', () => {
  let component: DetailsPedidoWoocommercePage;
  let fixture: ComponentFixture<DetailsPedidoWoocommercePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsPedidoWoocommercePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailsPedidoWoocommercePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
