import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CAuthUsuarioComponent } from './c-auth-usuario.component';


describe('CAuthUsuarioComponent', () => {
  let component: CAuthUsuarioComponent;
  let fixture: ComponentFixture<CAuthUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CAuthUsuarioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CAuthUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
