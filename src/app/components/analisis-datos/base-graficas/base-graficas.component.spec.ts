import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseGraficasComponent } from './base-graficas.component';

describe('BaseGraficasComponent', () => {
  let component: BaseGraficasComponent;
  let fixture: ComponentFixture<BaseGraficasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseGraficasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseGraficasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
