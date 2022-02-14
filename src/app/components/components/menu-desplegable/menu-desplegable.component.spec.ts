import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuDesplegableComponent } from './menu-desplegable.component';

describe('MenuDesplegableComponent', () => {
  let component: MenuDesplegableComponent;
  let fixture: ComponentFixture<MenuDesplegableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuDesplegableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuDesplegableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
