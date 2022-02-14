import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroEspecialComponent } from './registro-especial.component';

describe('RegistroEspecialComponent', () => {
  let component: RegistroEspecialComponent;
  let fixture: ComponentFixture<RegistroEspecialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroEspecialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroEspecialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
