import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroResponsableComponent } from './registro-responsable.component';

describe('RegistroResponsableComponent', () => {
  let component: RegistroResponsableComponent;
  let fixture: ComponentFixture<RegistroResponsableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroResponsableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroResponsableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
