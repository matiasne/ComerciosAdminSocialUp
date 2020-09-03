import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FormMesaPage } from './form-mesa.page';

describe('FormMesaPage', () => {
  let component: FormMesaPage;
  let fixture: ComponentFixture<FormMesaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormMesaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FormMesaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
