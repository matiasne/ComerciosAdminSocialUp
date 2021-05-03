import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SelectProductPage } from './select-product.page';

describe('SelectProductPage', () => {
  let component: SelectProductPage;
  let fixture: ComponentFixture<SelectProductPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectProductPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectProductPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
