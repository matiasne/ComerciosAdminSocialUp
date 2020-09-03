import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DashboardProductosPage } from './dashboard-productos.page';

describe('DashboardProductosPage', () => {
  let component: DashboardProductosPage;
  let fixture: ComponentFixture<DashboardProductosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardProductosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardProductosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
