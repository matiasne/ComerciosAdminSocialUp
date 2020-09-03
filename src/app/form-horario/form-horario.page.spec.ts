import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FormHorarioPage } from './form-horario.page';

describe('FormHorarioPage', () => {
  let component: FormHorarioPage;
  let fixture: ComponentFixture<FormHorarioPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormHorarioPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FormHorarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
