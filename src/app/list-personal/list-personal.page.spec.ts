import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListPersonalPage } from './list-personal.page';

describe('ListPersonalPage', () => {
  let component: ListPersonalPage;
  let fixture: ComponentFixture<ListPersonalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPersonalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListPersonalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
