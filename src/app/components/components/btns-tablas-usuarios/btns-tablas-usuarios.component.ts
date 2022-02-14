import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-btns-tablas-usuarios',
  templateUrl: './btns-tablas-usuarios.component.html',
  styleUrls: ['./btns-tablas-usuarios.component.css']
})
export class BtnsTablasUsuariosComponent implements OnInit {

  toggleComun: boolean = true;
  toggleEspecial: boolean = true;
  toggleResponsable: boolean = true;

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Destaca el boton presionado
    if(this.router.url == '/usuarios' || this.router.url == '/usuarios-comunes')
      this.toggleComun = false;
    else if(this.router.url == '/usuarios-especiales') 
      this.toggleEspecial = false;
    else if(this.router.url == '/usuarios-responsables')
      this.toggleResponsable = false;
  }

  tablaComunes() {
    this.router.navigate(['/usuarios-comunes']);
  }

  tablaEspeciales() {
    this.router.navigate(['/usuarios-especiales']);
  }

  tablaResponsables() {
    this.router.navigate(['/usuarios-responsables']);
  }
}
