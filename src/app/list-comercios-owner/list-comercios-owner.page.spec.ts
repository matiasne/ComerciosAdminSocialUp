import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListComerciosOwnerPage } from './list-comercios-owner.page';

describe('ListComerciosOwnerPage', () => {
  let component: ListComerciosOwnerPage;
  let fixture: ComponentFixture<ListComerciosOwnerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListComerciosOwnerPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListComerciosOwnerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
