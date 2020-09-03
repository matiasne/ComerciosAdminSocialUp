import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListSubscripcionesPage } from './list-subscripciones.page';

describe('ListSubscripcionesPage', () => {
  let component: ListSubscripcionesPage;
  let fixture: ComponentFixture<ListSubscripcionesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListSubscripcionesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListSubscripcionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
