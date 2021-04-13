import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SelectBeneficioPage } from './select-beneficio.page';

describe('SelectBeneficioPage', () => {
  let component: SelectBeneficioPage;
  let fixture: ComponentFixture<SelectBeneficioPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectBeneficioPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectBeneficioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
