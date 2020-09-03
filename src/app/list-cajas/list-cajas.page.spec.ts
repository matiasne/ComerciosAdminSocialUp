import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListCajasPage } from './list-cajas.page';

describe('ListCajasPage', () => {
  let component: ListCajasPage;
  let fixture: ComponentFixture<ListCajasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListCajasPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListCajasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
