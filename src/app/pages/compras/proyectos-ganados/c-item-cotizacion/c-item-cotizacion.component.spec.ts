import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CItemCotizacionComponent } from './c-item-cotizacion.component';

describe('CItemCotizacionComponent', () => {
  let component: CItemCotizacionComponent;
  let fixture: ComponentFixture<CItemCotizacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CItemCotizacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CItemCotizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
