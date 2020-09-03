import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FormIngresoCajaPage } from './form-ingreso-caja.page';

describe('FormIngresoCajaPage', () => {
  let component: FormIngresoCajaPage;
  let fixture: ComponentFixture<FormIngresoCajaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormIngresoCajaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FormIngresoCajaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
