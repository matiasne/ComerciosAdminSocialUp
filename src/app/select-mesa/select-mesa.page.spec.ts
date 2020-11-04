import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SelectMesaPage } from './select-mesa.page';

describe('SelectMesaPage', () => {
  let component: SelectMesaPage;
  let fixture: ComponentFixture<SelectMesaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectMesaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectMesaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
