import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DetailsCtaCorrientePage } from './details-cta-corriente.page';

describe('DetailsCtaCorrientePage', () => {
  let component: DetailsCtaCorrientePage;
  let fixture: ComponentFixture<DetailsCtaCorrientePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsCtaCorrientePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailsCtaCorrientePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
