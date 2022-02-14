import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RutaAutomaticaComponent } from './ruta-automatica.component';

describe('RutaAutomaticaComponent', () => {
  let component: RutaAutomaticaComponent;
  let fixture: ComponentFixture<RutaAutomaticaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RutaAutomaticaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RutaAutomaticaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
