import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FormCajaPage } from './form-caja.page';

describe('FormCajaPage', () => {
  let component: FormCajaPage;
  let fixture: ComponentFixture<FormCajaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormCajaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FormCajaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
