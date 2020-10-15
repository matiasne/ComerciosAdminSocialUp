import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FormEstiloConfiguracionPage } from './form-estilo-configuracion.page';

describe('FormEstiloConfiguracionPage', () => {
  let component: FormEstiloConfiguracionPage;
  let fixture: ComponentFixture<FormEstiloConfiguracionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormEstiloConfiguracionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FormEstiloConfiguracionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
