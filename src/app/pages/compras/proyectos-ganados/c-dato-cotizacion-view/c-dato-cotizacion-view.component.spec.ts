import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CDatoCotizacionViewComponent } from './c-dato-cotizacion-view.component';

describe('CDatoCotizacionViewComponent', () => {
  let component: CDatoCotizacionViewComponent;
  let fixture: ComponentFixture<CDatoCotizacionViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CDatoCotizacionViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CDatoCotizacionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
