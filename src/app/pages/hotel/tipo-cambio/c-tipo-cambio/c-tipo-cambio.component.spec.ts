import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CTipoCambioComponent } from './c-tipo-cambio.component';

describe('CTipoCambioComponent', () => {
  let component: CTipoCambioComponent;
  let fixture: ComponentFixture<CTipoCambioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CTipoCambioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CTipoCambioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
