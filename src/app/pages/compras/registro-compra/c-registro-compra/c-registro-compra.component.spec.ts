import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CRegistroCompraComponent } from './c-registro-compra.component';

describe('CRegistroCompraComponent', () => {
  let component: CRegistroCompraComponent;
  let fixture: ComponentFixture<CRegistroCompraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CRegistroCompraComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CRegistroCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
