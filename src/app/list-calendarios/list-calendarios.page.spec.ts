import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListCalendariosPage } from './list-calendarios.page';

describe('ListCalendariosPage', () => {
  let component: ListCalendariosPage;
  let fixture: ComponentFixture<ListCalendariosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListCalendariosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListCalendariosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
