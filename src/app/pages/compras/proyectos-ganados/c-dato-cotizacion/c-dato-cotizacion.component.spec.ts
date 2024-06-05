import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CDatoCotizacionComponent } from './c-dato-cotizacion.component';

describe('CDatoCotizacionComponent', () => {
  let component: CDatoCotizacionComponent;
  let fixture: ComponentFixture<CDatoCotizacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CDatoCotizacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CDatoCotizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
