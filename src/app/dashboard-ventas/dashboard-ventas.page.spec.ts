import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DashboardVentasPage } from './dashboard-ventas.page';

describe('DashboardVentasPage', () => {
  let component: DashboardVentasPage;
  let fixture: ComponentFixture<DashboardVentasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardVentasPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardVentasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
