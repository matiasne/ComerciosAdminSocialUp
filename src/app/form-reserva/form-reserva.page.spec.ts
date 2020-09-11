import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FormReservaPage } from './form-reserva.page';

describe('FormReservaPage', () => {
  let component: FormReservaPage;
  let fixture: ComponentFixture<FormReservaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormReservaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FormReservaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
