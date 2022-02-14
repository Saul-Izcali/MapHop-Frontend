import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroComunComponent } from './registro-comun.component';

describe('RegistroComunComponent', () => {
  let component: RegistroComunComponent;
  let fixture: ComponentFixture<RegistroComunComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroComunComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroComunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
