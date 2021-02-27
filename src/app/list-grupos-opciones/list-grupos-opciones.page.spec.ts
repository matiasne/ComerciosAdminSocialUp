import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListGruposOpcionesPage } from './list-grupos-opciones.page';

describe('ListGruposOpcionesPage', () => {
  let component: ListGruposOpcionesPage;
  let fixture: ComponentFixture<ListGruposOpcionesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListGruposOpcionesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListGruposOpcionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
