import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DetailsMesaPage } from './details-mesa.page';

describe('DetailsMesaPage', () => {
  let component: DetailsMesaPage;
  let fixture: ComponentFixture<DetailsMesaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsMesaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailsMesaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
