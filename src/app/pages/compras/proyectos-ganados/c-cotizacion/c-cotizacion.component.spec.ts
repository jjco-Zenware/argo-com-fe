import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CCotizacionComponent } from './c-cotizacion.component';

describe('CCotizacionComponent', () => {
  let component: CCotizacionComponent;
  let fixture: ComponentFixture<CCotizacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CCotizacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CCotizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
