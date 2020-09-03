import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DashboardServiciosPage } from './dashboard-servicios.page';

describe('DashboardServiciosPage', () => {
  let component: DashboardServiciosPage;
  let fixture: ComponentFixture<DashboardServiciosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardServiciosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardServiciosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
