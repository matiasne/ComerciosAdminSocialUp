import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListVentaPage } from './list-venta.page';

describe('ListVentaPage', () => {
  let component: ListVentaPage;
  let fixture: ComponentFixture<ListVentaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListVentaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListVentaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
