import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CDatoProveedorComponent } from './c-dato-proveedor.component';

describe('CDatoProveedorComponent', () => {
  let component: CDatoProveedorComponent;
  let fixture: ComponentFixture<CDatoProveedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CDatoProveedorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CDatoProveedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
