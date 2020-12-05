import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DetailsCocinaPage } from './details-cocina.page';

describe('DetailsCocinaPage', () => {
  let component: DetailsCocinaPage;
  let fixture: ComponentFixture<DetailsCocinaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsCocinaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailsCocinaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
