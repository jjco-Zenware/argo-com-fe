import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CTipoCambioDatoComponent } from './c-tipo-cambio-dato.component';

describe('CTipoCambioDatoComponent', () => {
  let component: CTipoCambioDatoComponent;
  let fixture: ComponentFixture<CTipoCambioDatoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CTipoCambioDatoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CTipoCambioDatoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
