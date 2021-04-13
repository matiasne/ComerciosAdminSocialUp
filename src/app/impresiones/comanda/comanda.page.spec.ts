import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ComandaPage } from './comanda.page';

describe('ComandaPage', () => {
  let component: ComandaPage;
  let fixture: ComponentFixture<ComandaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComandaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ComandaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
