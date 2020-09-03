import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FormVentaPage } from './form-venta.page';

describe('FormVentaPage', () => {
  let component: FormVentaPage;
  let fixture: ComponentFixture<FormVentaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormVentaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FormVentaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
