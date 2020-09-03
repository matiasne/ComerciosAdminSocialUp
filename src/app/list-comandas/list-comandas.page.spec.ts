import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListComandasPage } from './list-comandas.page';

describe('ListComandasPage', () => {
  let component: ListComandasPage;
  let fixture: ComponentFixture<ListComandasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListComandasPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListComandasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
