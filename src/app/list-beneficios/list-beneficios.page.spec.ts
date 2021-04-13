import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListBeneficiosPage } from './list-beneficios.page';

describe('ListBeneficiosPage', () => {
  let component: ListBeneficiosPage;
  let fixture: ComponentFixture<ListBeneficiosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListBeneficiosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListBeneficiosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
