import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FormIngresoCtaCorrientePage } from './form-ingreso-cta-corriente.page';

describe('FormIngresoCtaCorrientePage', () => {
  let component: FormIngresoCtaCorrientePage;
  let fixture: ComponentFixture<FormIngresoCtaCorrientePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormIngresoCtaCorrientePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FormIngresoCtaCorrientePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
