import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaDesatendidosComponent } from './tabla-desatendidos.component';

describe('TablaDesatendidosComponent', () => {
  let component: TablaDesatendidosComponent;
  let fixture: ComponentFixture<TablaDesatendidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TablaDesatendidosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaDesatendidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
