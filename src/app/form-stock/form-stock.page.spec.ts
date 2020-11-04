import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FormStockPage } from './form-stock.page';

describe('FormStockPage', () => {
  let component: FormStockPage;
  let fixture: ComponentFixture<FormStockPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormStockPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FormStockPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
