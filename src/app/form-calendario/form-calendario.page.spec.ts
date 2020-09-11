import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FormCalendarioPage } from './form-calendario.page';

describe('FormCalendarioPage', () => {
  let component: FormCalendarioPage;
  let fixture: ComponentFixture<FormCalendarioPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormCalendarioPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FormCalendarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
