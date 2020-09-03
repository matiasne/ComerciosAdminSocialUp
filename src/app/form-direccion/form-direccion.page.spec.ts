import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FormDireccionPage } from './form-direccion.page';

describe('FormDireccionPage', () => {
  let component: FormDireccionPage;
  let fixture: ComponentFixture<FormDireccionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormDireccionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FormDireccionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
