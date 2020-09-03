import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DashboardComercioPage } from './dashboard-comercio.page';

describe('DashboardComercioPage', () => {
  let component: DashboardComercioPage;
  let fixture: ComponentFixture<DashboardComercioPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardComercioPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComercioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
