import { Component, OnInit, HostListener, Input } from '@angular/core';
import { LoginService } from "../../../services/login/login.service";
import { Router } from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: 'app-menu-desplegable',
  templateUrl: './menu-desplegable.component.html',
  styleUrls: ['./menu-desplegable.component.css']
})
export class MenuDesplegableComponent implements OnInit {

  toggleMenu: boolean = false; // Variable para abrir y cerrar el menu y cambiar el icono
  clickDentro: boolean = false; // Variable para cerrar el menu tocando fuera

  // Cuando se hace click dentro del menu
  @HostListener('click')
  clickInside() {
    this.clickDentro = true;
  }

  // Cuando se hace click fuera del menu se cierra
  @HostListener('document:click')
  clickOutside() {
    if (!this.clickDentro && this.toggleMenu) {
      this.toggleMenu = false;
    }
    this.clickDentro = false;
  }

  constructor(private loginService: LoginService, private router: Router) { }

  ngOnInit(): void {
    
  }

  // Se muestran las opciones que corresponde al tipo de usuario que se encuentra en el sistema
  opciones(opcion: string) {
    let tipoUsuario = this.loginService.getTipoUsuario() || "invitado";

    if(tipoUsuario == "invitado") {
      if(opcion == "generarReporte" || opcion == "informacion") {
        return true;
      }
    }
    
    else if(tipoUsuario == "comun" || tipoUsuario == "especial") {
      if(opcion == "perfil" || opcion == "generarReporte" || opcion == "mapaSolucionados" || opcion == "informacion" || opcion == "cerrarSesion") {
        return true;
      }
    }
    
    else if(tipoUsuario == "responsable") {
      if(opcion == "perfil" || opcion == "historial" || opcion == "generarRuta" || opcion == "mapaSolucionados" || opcion == "informacion" || opcion == "cerrarSesion") {
        return true;
      }
    }
    
    else if(tipoUsuario == "admin") {
      if(opcion == "historial" || opcion == "crearResp" || opcion == "usuarios" || opcion == "cerrarSesion") {
        return true;
      }
    }

    return false;
  }

  // Cuando se cierra sesion se borra el token y el tipo de usuario ingresado, y se vuelve al inicio
  cerrarSesion() {
    Swal.fire({
      title: 'Seguro?',
      text: "Se cerrará la sesión",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, cerrar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loginService.logout();
        this.router.navigate(['/']);
      }
    });
  }
}