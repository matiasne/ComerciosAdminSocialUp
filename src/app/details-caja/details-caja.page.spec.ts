import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DetailsCajaPage } from './details-caja.page';

describe('DetailsCajaPage', () => {
  let component: DetailsCajaPage;
  let fixture: ComponentFixture<DetailsCajaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsCajaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailsCajaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
