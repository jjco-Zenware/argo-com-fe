import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CAuthClaveComponent } from './c-auth-clave.component';


describe('CAuthClaveComponent', () => {
  let component: CAuthClaveComponent;
  let fixture: ComponentFixture<CAuthClaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CAuthClaveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CAuthClaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
