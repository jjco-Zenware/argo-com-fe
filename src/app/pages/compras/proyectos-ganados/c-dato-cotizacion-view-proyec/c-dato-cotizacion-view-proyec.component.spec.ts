import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CDatoCotizacionViewProyecComponent } from './c-dato-cotizacion-view-proyec.component';


describe('CDatoCotizacionViewComponent', () => {
  let component: CDatoCotizacionViewProyecComponent;
  let fixture: ComponentFixture<CDatoCotizacionViewProyecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CDatoCotizacionViewProyecComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CDatoCotizacionViewProyecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
