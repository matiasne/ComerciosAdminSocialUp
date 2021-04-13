import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CambiarPlanPage } from './cambiar-plan.page';

describe('CambiarPlanPage', () => {
  let component: CambiarPlanPage;
  let fixture: ComponentFixture<CambiarPlanPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CambiarPlanPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CambiarPlanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
