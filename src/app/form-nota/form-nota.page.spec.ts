import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FormNotaPage } from './form-nota.page';

describe('FormNotaPage', () => {
  let component: FormNotaPage;
  let fixture: ComponentFixture<FormNotaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormNotaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FormNotaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
