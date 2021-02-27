import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SelectGruposOpcionesPage } from './select-grupos-opciones.page';

describe('SelectGruposOpcionesPage', () => {
  let component: SelectGruposOpcionesPage;
  let fixture: ComponentFixture<SelectGruposOpcionesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectGruposOpcionesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectGruposOpcionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
