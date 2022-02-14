import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaEspecialesComponent } from './tabla-especiales.component';

describe('TablaEspecialesComponent', () => {
  let component: TablaEspecialesComponent;
  let fixture: ComponentFixture<TablaEspecialesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TablaEspecialesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaEspecialesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
