import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListMesasPage } from './list-mesas.page';

describe('ListMesasPage', () => {
  let component: ListMesasPage;
  let fixture: ComponentFixture<ListMesasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListMesasPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListMesasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
