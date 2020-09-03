import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListProductosServiciosPage } from './list-productos-servicios.page';

describe('ListProductosServiciosPage', () => {
  let component: ListProductosServiciosPage;
  let fixture: ComponentFixture<ListProductosServiciosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListProductosServiciosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListProductosServiciosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
