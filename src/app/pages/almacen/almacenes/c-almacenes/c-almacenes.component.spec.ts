import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CAlmacenesComponent } from './c-almacenes.component';

describe('CAlmacenesComponent', () => {
  let component: CAlmacenesComponent;
  let fixture: ComponentFixture<CAlmacenesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CAlmacenesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CAlmacenesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
