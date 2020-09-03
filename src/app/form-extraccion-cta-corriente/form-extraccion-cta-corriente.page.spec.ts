import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FormExtraccionCtaCorrientePage } from './form-extraccion-cta-corriente.page';

describe('FormExtraccionCtaCorrientePage', () => {
  let component: FormExtraccionCtaCorrientePage;
  let fixture: ComponentFixture<FormExtraccionCtaCorrientePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormExtraccionCtaCorrientePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FormExtraccionCtaCorrientePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
