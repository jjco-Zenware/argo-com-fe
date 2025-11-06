import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CProduccionListComponent } from './c-produccion-list.component';

describe('CProduccionListComponent', () => {
  let component: CProduccionListComponent;
  let fixture: ComponentFixture<CProduccionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CProduccionListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CProduccionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
