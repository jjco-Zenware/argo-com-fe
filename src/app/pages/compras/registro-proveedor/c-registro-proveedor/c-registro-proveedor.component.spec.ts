import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CRegistroProveedorComponent } from './c-registro-proveedor.component';

describe('CRegistroProveedorComponent', () => {
  let component: CRegistroProveedorComponent;
  let fixture: ComponentFixture<CRegistroProveedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CRegistroProveedorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CRegistroProveedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
