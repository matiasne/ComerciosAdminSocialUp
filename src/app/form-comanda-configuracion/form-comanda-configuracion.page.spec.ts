import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FormComandaConfiguracionPage } from './form-comanda-configuracion.page';

describe('FormComandaConfiguracionPage', () => {
  let component: FormComandaConfiguracionPage;
  let fixture: ComponentFixture<FormComandaConfiguracionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormComandaConfiguracionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FormComandaConfiguracionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
