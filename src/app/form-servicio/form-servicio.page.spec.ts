import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FormServicioPage } from './form-servicio.page';

describe('FormServicioPage', () => {
  let component: FormServicioPage;
  let fixture: ComponentFixture<FormServicioPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormServicioPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FormServicioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
