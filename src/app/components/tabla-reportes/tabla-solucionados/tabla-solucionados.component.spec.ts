import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaSolucionadosComponent } from './tabla-solucionados.component';

describe('TablaSolucionadosComponent', () => {
  let component: TablaSolucionadosComponent;
  let fixture: ComponentFixture<TablaSolucionadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TablaSolucionadosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaSolucionadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
