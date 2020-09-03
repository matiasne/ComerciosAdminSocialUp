import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FormPlanPage } from './form-plan.page';

describe('FormPlanPage', () => {
  let component: FormPlanPage;
  let fixture: ComponentFixture<FormPlanPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormPlanPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FormPlanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
