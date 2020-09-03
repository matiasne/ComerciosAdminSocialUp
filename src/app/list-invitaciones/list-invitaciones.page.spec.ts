import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListInvitacionesPage } from './list-invitaciones.page';

describe('ListInvitacionesPage', () => {
  let component: ListInvitacionesPage;
  let fixture: ComponentFixture<ListInvitacionesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListInvitacionesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListInvitacionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
