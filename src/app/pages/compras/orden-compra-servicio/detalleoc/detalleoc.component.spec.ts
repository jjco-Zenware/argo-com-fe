import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleocComponent } from './detalleoc.component';

describe('DetalleocComponent', () => {
  let component: DetalleocComponent;
  let fixture: ComponentFixture<DetalleocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleocComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
