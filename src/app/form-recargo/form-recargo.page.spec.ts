import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FormRecargoPage } from './form-recargo.page';

describe('FormRecargoPage', () => {
  let component: FormRecargoPage;
  let fixture: ComponentFixture<FormRecargoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormRecargoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FormRecargoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
