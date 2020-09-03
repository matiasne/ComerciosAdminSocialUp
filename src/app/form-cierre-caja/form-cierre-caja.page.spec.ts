import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FormCierreCajaPage } from './form-cierre-caja.page';

describe('FormCierreCajaPage', () => {
  let component: FormCierreCajaPage;
  let fixture: ComponentFixture<FormCierreCajaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormCierreCajaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FormCierreCajaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
