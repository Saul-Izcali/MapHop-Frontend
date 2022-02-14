import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnsTablasUsuariosComponent } from './btns-tablas-usuarios.component';

describe('BtnsTablasUsuariosComponent', () => {
  let component: BtnsTablasUsuariosComponent;
  let fixture: ComponentFixture<BtnsTablasUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BtnsTablasUsuariosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BtnsTablasUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
