import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FormSubscripcionPage } from './form-subscripcion.page';

describe('FormSubscripcionPage', () => {
  let component: FormSubscripcionPage;
  let fixture: ComponentFixture<FormSubscripcionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormSubscripcionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FormSubscripcionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
