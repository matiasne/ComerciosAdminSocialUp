import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DashboardClientesPage } from './dashboard-clientes.page';

describe('DashboardClientesPage', () => {
  let component: DashboardClientesPage;
  let fixture: ComponentFixture<DashboardClientesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardClientesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardClientesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
