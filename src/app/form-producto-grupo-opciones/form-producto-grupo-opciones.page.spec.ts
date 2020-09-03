import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FormProductoGrupoOpcionesPage } from './form-producto-grupo-opciones.page';

describe('FormProductoGrupoOpcionesPage', () => {
  let component: FormProductoGrupoOpcionesPage;
  let fixture: ComponentFixture<FormProductoGrupoOpcionesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormProductoGrupoOpcionesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FormProductoGrupoOpcionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
