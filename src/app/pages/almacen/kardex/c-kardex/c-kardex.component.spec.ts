import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CKardexComponent } from './c-kardex.component';

describe('CKardexComponent', () => {
  let component: CKardexComponent;
  let fixture: ComponentFixture<CKardexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CKardexComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CKardexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
