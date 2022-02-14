import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnsTablasReportesComponent } from './btns-tablas-reportes.component';

describe('BtnsTablasReportesComponent', () => {
  let component: BtnsTablasReportesComponent;
  let fixture: ComponentFixture<BtnsTablasReportesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BtnsTablasReportesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BtnsTablasReportesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
