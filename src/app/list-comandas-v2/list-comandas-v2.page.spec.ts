import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListComandasV2Page } from './list-comandas-v2.page';

describe('ListComandasV2Page', () => {
  let component: ListComandasV2Page;
  let fixture: ComponentFixture<ListComandasV2Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListComandasV2Page ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListComandasV2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
