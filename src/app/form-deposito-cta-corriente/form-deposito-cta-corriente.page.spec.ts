import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FormDepositoCtaCorrientePage } from './form-deposito-cta-corriente.page';

describe('FormDepositoCtaCorrientePage', () => {
  let component: FormDepositoCtaCorrientePage;
  let fixture: ComponentFixture<FormDepositoCtaCorrientePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormDepositoCtaCorrientePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FormDepositoCtaCorrientePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
