import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FormComentarioPage } from './form-comentario.page';

describe('FormComentarioPage', () => {
  let component: FormComentarioPage;
  let fixture: ComponentFixture<FormComentarioPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormComentarioPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FormComentarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
