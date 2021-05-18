import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DetailsImagePage } from './details-image.page';

describe('DetailsImagePage', () => {
  let component: DetailsImagePage;
  let fixture: ComponentFixture<DetailsImagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsImagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailsImagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
