import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DetailsClientePage } from './details-cliente.page';

describe('DetailsClientePage', () => {
  let component: DetailsClientePage;
  let fixture: ComponentFixture<DetailsClientePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsClientePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailsClientePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
