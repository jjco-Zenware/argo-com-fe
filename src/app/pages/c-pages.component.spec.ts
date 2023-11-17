import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CPagesComponent } from './c-pages.component';

describe('CPagesComponent', () => {
  let component: CPagesComponent;
  let fixture: ComponentFixture<CPagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CPagesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
