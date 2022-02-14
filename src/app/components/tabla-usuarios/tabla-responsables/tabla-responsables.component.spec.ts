import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaResponsablesComponent } from './tabla-responsables.component';

describe('TablaResponsablesComponent', () => {
  let component: TablaResponsablesComponent;
  let fixture: ComponentFixture<TablaResponsablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TablaResponsablesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaResponsablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
