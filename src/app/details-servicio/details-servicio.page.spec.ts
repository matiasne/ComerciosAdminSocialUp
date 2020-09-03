import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DetailsServicioPage } from './details-servicio.page';

describe('DetailsServicioPage', () => {
  let component: DetailsServicioPage;
  let fixture: ComponentFixture<DetailsServicioPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsServicioPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailsServicioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
