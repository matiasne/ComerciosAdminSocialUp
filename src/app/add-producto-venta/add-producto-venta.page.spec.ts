import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddProductoVentaPage } from './add-producto-venta.page';

describe('AddProductoVentaPage', () => {
  let component: AddProductoVentaPage;
  let fixture: ComponentFixture<AddProductoVentaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddProductoVentaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddProductoVentaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
