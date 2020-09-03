import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FormProductoPage } from './form-producto.page';

describe('FormProductoPage', () => {
  let component: FormProductoPage;
  let fixture: ComponentFixture<FormProductoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormProductoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FormProductoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
