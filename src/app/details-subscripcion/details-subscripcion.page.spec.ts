import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DetailsSubscripcionPage } from './details-subscripcion.page';

describe('DetailsSubscripcionPage', () => {
  let component: DetailsSubscripcionPage;
  let fixture: ComponentFixture<DetailsSubscripcionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsSubscripcionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailsSubscripcionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
