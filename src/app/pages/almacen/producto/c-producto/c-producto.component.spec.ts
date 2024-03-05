import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CProductoComponent } from './c-producto.component';

describe('CProductoComponent', () => {
  let component: CProductoComponent;
  let fixture: ComponentFixture<CProductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CProductoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
