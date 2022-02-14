import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaComunesComponent } from './tabla-comunes.component';

describe('TablaComunesComponent', () => {
  let component: TablaComunesComponent;
  let fixture: ComponentFixture<TablaComunesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TablaComunesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaComunesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
