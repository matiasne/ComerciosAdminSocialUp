import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FormInvitacionPage } from './form-invitacion.page';

describe('FormInvitacionPage', () => {
  let component: FormInvitacionPage;
  let fixture: ComponentFixture<FormInvitacionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormInvitacionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FormInvitacionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
