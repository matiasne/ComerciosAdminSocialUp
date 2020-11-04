import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FormMiPerfilPage } from './form-mi-perfil.page';

describe('FormMiPerfilPage', () => {
  let component: FormMiPerfilPage;
  let fixture: ComponentFixture<FormMiPerfilPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormMiPerfilPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FormMiPerfilPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
