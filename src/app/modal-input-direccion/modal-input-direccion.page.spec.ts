import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalInputDireccionPage } from './modal-input-direccion.page';

describe('ModalInputDireccionPage', () => {
  let component: ModalInputDireccionPage;
  let fixture: ComponentFixture<ModalInputDireccionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalInputDireccionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalInputDireccionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
