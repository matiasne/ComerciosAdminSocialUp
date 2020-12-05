import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TicketPrintPage } from './ticket-print.page';

describe('TicketPrintPage', () => {
  let component: TicketPrintPage;
  let fixture: ComponentFixture<TicketPrintPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketPrintPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TicketPrintPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
