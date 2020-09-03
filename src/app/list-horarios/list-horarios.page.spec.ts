import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListHorariosPage } from './list-horarios.page';

describe('ListHorariosPage', () => {
  let component: ListHorariosPage;
  let fixture: ComponentFixture<ListHorariosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListHorariosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListHorariosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
