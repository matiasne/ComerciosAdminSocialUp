import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SelectClientePage } from './select-cliente.page';

describe('SelectClientePage', () => {
  let component: SelectClientePage;
  let fixture: ComponentFixture<SelectClientePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectClientePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectClientePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
