import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaEnProcesoComponent } from './tabla-en-proceso.component';

describe('TablaEnProcesoComponent', () => {
  let component: TablaEnProcesoComponent;
  let fixture: ComponentFixture<TablaEnProcesoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TablaEnProcesoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaEnProcesoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
