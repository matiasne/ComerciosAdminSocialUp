import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CardComandaComponent } from './card-comanda.component';

describe('CardComandaComponent', () => {
  let component: CardComandaComponent;
  let fixture: ComponentFixture<CardComandaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardComandaComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CardComandaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
