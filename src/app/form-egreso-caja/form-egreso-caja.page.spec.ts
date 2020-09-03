import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FormEgresoCajaPage } from './form-egreso-caja.page';

describe('FormEgresoCajaPage', () => {
  let component: FormEgresoCajaPage;
  let fixture: ComponentFixture<FormEgresoCajaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormEgresoCajaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FormEgresoCajaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
