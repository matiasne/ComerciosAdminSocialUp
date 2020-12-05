import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListCocinasPage } from './list-cocinas.page';

describe('ListCocinasPage', () => {
  let component: ListCocinasPage;
  let fixture: ComponentFixture<ListCocinasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListCocinasPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListCocinasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
