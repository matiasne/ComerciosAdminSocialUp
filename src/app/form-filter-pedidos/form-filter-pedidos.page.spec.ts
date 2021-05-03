import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FormFilterPedidosPage } from './form-filter-pedidos.page';

describe('FormFilterPedidosPage', () => {
  let component: FormFilterPedidosPage;
  let fixture: ComponentFixture<FormFilterPedidosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormFilterPedidosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FormFilterPedidosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
