import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListPedidosPage } from './list-pedidos.page';

describe('ListPedidosPage', () => {
  let component: ListPedidosPage;
  let fixture: ComponentFixture<ListPedidosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPedidosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListPedidosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
