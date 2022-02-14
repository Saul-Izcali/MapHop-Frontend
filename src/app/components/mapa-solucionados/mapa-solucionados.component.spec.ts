import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaSolucionadosComponent } from './mapa-solucionados.component';

describe('MapaSolucionadosComponent', () => {
  let component: MapaSolucionadosComponent;
  let fixture: ComponentFixture<MapaSolucionadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapaSolucionadosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapaSolucionadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
