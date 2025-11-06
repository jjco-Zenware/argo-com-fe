import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmProductoComponenteComponent } from './cm-producto-componente.component';

describe('CmProductoComponenteComponent', () => {
  let component: CmProductoComponenteComponent;
  let fixture: ComponentFixture<CmProductoComponenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmProductoComponenteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CmProductoComponenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
