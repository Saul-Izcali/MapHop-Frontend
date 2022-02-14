import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-barra-navegacion',
  templateUrl: './barra-navegacion.component.html',
  styleUrls: ['./barra-navegacion.component.css']
})
export class BarraNavegacionComponent implements OnInit {

  paginaInicio: boolean = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Si es la pagina de inicio se muestra el boton de registro en la barra
    if(this.router.url == '/') {
      this.paginaInicio = true;
    }
    else {
      this.paginaInicio = false;
    }
  }

  // Presionando el nombre del sistema
  inicio() {
    this.router.navigate(['/']);
  }

  // Presionando el boton de registro
  registrarte() {
    this.router.navigate(['/registro']);
  }
}
