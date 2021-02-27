import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CardComandaV2Component } from './card-comanda-v2.component';

describe('CardComandaV2Component', () => {
  let component: CardComandaV2Component;
  let fixture: ComponentFixture<CardComandaV2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardComandaV2Component ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CardComandaV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
