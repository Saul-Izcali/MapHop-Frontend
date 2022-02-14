import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaReportesComponent } from './mapa-reportes.component';

describe('MapaReportesComponent', () => {
  let component: MapaReportesComponent;
  let fixture: ComponentFixture<MapaReportesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapaReportesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapaReportesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
