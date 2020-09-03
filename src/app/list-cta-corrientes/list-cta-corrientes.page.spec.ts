import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListCtaCorrientesPage } from './list-cta-corrientes.page';

describe('ListCtaCorrientesPage', () => {
  let component: ListCtaCorrientesPage;
  let fixture: ComponentFixture<ListCtaCorrientesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListCtaCorrientesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListCtaCorrientesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
