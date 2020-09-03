import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DetailsWhatsappPage } from './details-whatsapp.page';

describe('DetailsWhatsappPage', () => {
  let component: DetailsWhatsappPage;
  let fixture: ComponentFixture<DetailsWhatsappPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsWhatsappPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailsWhatsappPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
