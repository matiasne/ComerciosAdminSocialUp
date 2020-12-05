import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FormCocinaPage } from './form-cocina.page';

describe('FormCocinaPage', () => {
  let component: FormCocinaPage;
  let fixture: ComponentFixture<FormCocinaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormCocinaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FormCocinaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
