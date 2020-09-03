import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FormCtaCorrientePage } from './form-cta-corriente.page';

describe('FormCtaCorrientePage', () => {
  let component: FormCtaCorrientePage;
  let fixture: ComponentFixture<FormCtaCorrientePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormCtaCorrientePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FormCtaCorrientePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
