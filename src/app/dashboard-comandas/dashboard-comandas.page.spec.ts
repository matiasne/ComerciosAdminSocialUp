import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DashboardComandasPage } from './dashboard-comandas.page';

describe('DashboardComandasPage', () => {
  let component: DashboardComandasPage;
  let fixture: ComponentFixture<DashboardComandasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardComandasPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComandasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
