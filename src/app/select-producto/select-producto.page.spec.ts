import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SelectProductoPage } from './select-producto.page';

describe('SelectProductoPage', () => {
  let component: SelectProductoPage;
  let fixture: ComponentFixture<SelectProductoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectProductoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectProductoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
