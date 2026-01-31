import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CPlanningReservaComponent } from './c-planning-reserva.component';


describe('CPlanningReservaComponent', () => {
  let component: CPlanningReservaComponent;
  let fixture: ComponentFixture<CPlanningReservaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CPlanningReservaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CPlanningReservaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
