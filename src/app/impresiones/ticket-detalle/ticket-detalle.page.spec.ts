import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TicketDetallePage } from './ticket-detalle.page';

describe('TicketDetallePage', () => {
  let component: TicketDetallePage;
  let fixture: ComponentFixture<TicketDetallePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketDetallePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TicketDetallePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
