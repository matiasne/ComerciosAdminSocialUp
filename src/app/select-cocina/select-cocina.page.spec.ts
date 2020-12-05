import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SelectCocinaPage } from './select-cocina.page';

describe('SelectCocinaPage', () => {
  let component: SelectCocinaPage;
  let fixture: ComponentFixture<SelectCocinaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectCocinaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectCocinaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
