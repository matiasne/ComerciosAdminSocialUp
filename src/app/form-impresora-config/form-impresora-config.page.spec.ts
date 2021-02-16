import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FormImpresoraConfigPage } from './form-impresora-config.page';

describe('FormImpresoraConfigPage', () => {
  let component: FormImpresoraConfigPage;
  let fixture: ComponentFixture<FormImpresoraConfigPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormImpresoraConfigPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FormImpresoraConfigPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
