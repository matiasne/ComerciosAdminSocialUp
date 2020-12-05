import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FormAperturaCajaPage } from './form-apertura-caja.page';

describe('FormAperturaCajaPage', () => {
  let component: FormAperturaCajaPage;
  let fixture: ComponentFixture<FormAperturaCajaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormAperturaCajaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FormAperturaCajaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
