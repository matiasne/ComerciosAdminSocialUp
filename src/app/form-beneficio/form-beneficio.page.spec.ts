import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FormBeneficioPage } from './form-beneficio.page';

describe('FormBeneficioPage', () => {
  let component: FormBeneficioPage;
  let fixture: ComponentFixture<FormBeneficioPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormBeneficioPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FormBeneficioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
