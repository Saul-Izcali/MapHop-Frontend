import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-btns-tablas-reportes',
  templateUrl: './btns-tablas-reportes.component.html',
  styleUrls: ['./btns-tablas-reportes.component.css']
})
export class BtnsTablasReportesComponent implements OnInit {

  toggleDesatendidos: boolean = true;
  toggleEnProceso: boolean = true;
  toggleSolucionados: boolean = true;
  toggleGraficas: boolean = true;

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Destaca el boton presionado
    if(this.router.url == '/reportes' || this.router.url == '/reportes-desatendidos')
      this.toggleDesatendidos = false;
    else if(this.router.url == '/reportes-en-proceso') 
      this.toggleEnProceso = false;
    else if(this.router.url == '/reportes-solucionados')
      this.toggleSolucionados = false;
    else if(this.router.url == '/grafica-mas-reportados')
      this.toggleGraficas == false
  }

  tablaDesatendidos() {
    this.router.navigate(['/reportes-desatendidos']);
  }

  tablaEnProceso() {
    this.router.navigate(['/reportes-en-proceso']);
  }

  tablaSolucionados() {
    this.router.navigate(['/reportes-solucionados']);
  }

  graficas() {
    this.router.navigate(['/graficas']);
  }

}
