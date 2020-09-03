import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RecortarImagenPage } from './recortar-imagen.page';

describe('RecortarImagenPage', () => {
  let component: RecortarImagenPage;
  let fixture: ComponentFixture<RecortarImagenPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecortarImagenPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RecortarImagenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
