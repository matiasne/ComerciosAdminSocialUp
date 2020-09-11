import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ServicioCalendarioPage } from './servicio-calendario.page';

describe('ServicioCalendarioPage', () => {
  let component: ServicioCalendarioPage;
  let fixture: ComponentFixture<ServicioCalendarioPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServicioCalendarioPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ServicioCalendarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
