import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FormWoocommerceConfiguracionPage } from './form-woocommerce-configuracion.page';

describe('FormWoocommerceConfiguracionPage', () => {
  let component: FormWoocommerceConfiguracionPage;
  let fixture: ComponentFixture<FormWoocommerceConfiguracionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormWoocommerceConfiguracionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FormWoocommerceConfiguracionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
