import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FormPedidosConfiguracionPage } from './form-pedidos-configuracion.page';

describe('FormPedidosConfiguracionPage', () => {
  let component: FormPedidosConfiguracionPage;
  let fixture: ComponentFixture<FormPedidosConfiguracionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormPedidosConfiguracionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FormPedidosConfiguracionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
