import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FormClienteEstadoPage } from './form-cliente-estado.page';

describe('FormClienteEstadoPage', () => {
  let component: FormClienteEstadoPage;
  let fixture: ComponentFixture<FormClienteEstadoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormClienteEstadoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FormClienteEstadoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
