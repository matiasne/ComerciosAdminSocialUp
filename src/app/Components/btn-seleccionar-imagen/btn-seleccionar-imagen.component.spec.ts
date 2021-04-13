import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BtnSeleccionarImagenComponent } from './btn-seleccionar-imagen.component';

describe('BtnSeleccionarImagenComponent', () => {
  let component: BtnSeleccionarImagenComponent;
  let fixture: ComponentFixture<BtnSeleccionarImagenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BtnSeleccionarImagenComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BtnSeleccionarImagenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
