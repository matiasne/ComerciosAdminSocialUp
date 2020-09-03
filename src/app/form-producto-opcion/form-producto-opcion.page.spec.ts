import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FormProductoOpcionPage } from './form-producto-opcion.page';

describe('FormProductoOpcionPage', () => {
  let component: FormProductoOpcionPage;
  let fixture: ComponentFixture<FormProductoOpcionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormProductoOpcionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FormProductoOpcionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
