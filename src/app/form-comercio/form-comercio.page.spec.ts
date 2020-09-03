import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FormComercioPage } from './form-comercio.page';

describe('FormComercioPage', () => {
  let component: FormComercioPage;
  let fixture: ComponentFixture<FormComercioPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormComercioPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FormComercioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
