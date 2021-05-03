import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CardProductoWoocommerceComponent } from './card-producto-woocommerce.component';

describe('CardProductoWoocommerceComponent', () => {
  let component: CardProductoWoocommerceComponent;
  let fixture: ComponentFixture<CardProductoWoocommerceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardProductoWoocommerceComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CardProductoWoocommerceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
