import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddServicioSubscripcionPage } from './add-servicio-subscripcion.page';

describe('AddServicioSubscripcionPage', () => {
  let component: AddServicioSubscripcionPage;
  let fixture: ComponentFixture<AddServicioSubscripcionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddServicioSubscripcionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddServicioSubscripcionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
