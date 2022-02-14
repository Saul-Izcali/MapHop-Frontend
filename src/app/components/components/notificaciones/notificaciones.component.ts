import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificacionesService } from 'src/app/services/notificaciones/notificaciones.service';
import { LoginService } from 'src/app/services/login/login.service';
import { Notificacion } from "../../../models/notificacion";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.css']
})
export class NotificacionesComponent implements OnInit {

  toggleMenu: boolean = false; // Variable para abrir y cerrar el menu y cambiar el icono
  clickDentro: boolean = false; // Variable para cerrar el menu tocando fuera
  
  hayNotificaciones: boolean = false; // Variable para identificar el icono a usar

  btnAbrirNotificaciones: boolean = true; // Variable icono para abrir las notificaciones
  btnCerrarNotificaciones: boolean = false; // Variable icono para cerrar las notificaciones

  idUsuario: string = '';
  // useState<any[]>([]);
  notificaciones: Notificacion[] = [{
    tipoNotificacion: '',
    usuarios: [
          {
              _id: ''
          }
      ]
  }];

  noNever: any = []

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
      this.btnCerrarNotificaciones = false;
      this.btnAbrirNotificaciones = true;
    }
    this.clickDentro = false;
  }

  constructor(public notificacionesService: NotificacionesService, public loginService: LoginService, private router: Router) { }

  ngOnInit(): void {
    this.getNotificaciones();
  }

  getNotificaciones() {
    if(!this.notificaciones)
          this.hayNotificaciones = false;

    if(!this.loginService.ingresado())
      this.btnAbrirNotificaciones = false;

    const tipoUsuario = this.loginService.getTipoUsuario();
    this.idUsuario = this.loginService.getUsuarioActual()!;

    if(tipoUsuario == 'admin')
      this.btnAbrirNotificaciones = false;
    
      console.log("HOLA")
    this.notificacionesService.getNotificacionesUsuario(this.idUsuario).subscribe(
      res => {
        this.notificaciones = res;
        console.log(res)
        console.log(this.notificaciones)
        this.noNever = res
        if(this.notificaciones){
          this.hayNotificaciones = true;

          let reportesLS = JSON.parse(localStorage.getItem('reportes') || '{}');
          let tiemposReportes = JSON.parse(localStorage.getItem('tiempos') || '{}');
          let aux, cont = 0

          console.log(reportesLS)
          console.log(tiemposReportes)
          console.log(this.noNever)

          this.noNever.forEach((element:any) => {
            if(element.tipoNotificacion == "estadoSolucionado" || element.tipoNotificacion == "estadoDenegado"){
              // aux = reportesLS.find((e:any) => e == e.folioReporte) // busca el id del reporte dentro del 
              aux = reportesLS.indexOf(element.folioReporte)
              console.log(aux)
              if(aux != -1){
                reportesLS.splice(aux, 1);
                tiemposReportes.splice(aux, 1);
              }
              
            }
          });

          if(tiemposReportes.length >= 1){
            localStorage.setItem("reportes", JSON.stringify(reportesLS));
            localStorage.setItem("tiempos", JSON.stringify(tiemposReportes));
          }else{ 
            localStorage.removeItem("reportes")
            localStorage.removeItem("tiempos")
          }

        }else{
        }
      },
      err => {
        Swal.fire({
          title: 'Oh no!',
          text: 'Ocurrio un problema recibiendo las notificaciones',
          icon: 'error',
          confirmButtonText: 'Ok'
        });
        console.error(err);
      }
    );
  }

  borrarNotificacion(notificacion?: string) {
    console.log(notificacion);

    this.notificacionesService.editNotificacion(notificacion!, this.idUsuario).subscribe(
      res => {
        this.ngOnInit();
      },
      err => {
        Swal.fire({
          title: 'Oh no!',
          text: 'Ocurrio un problema eliminando la notificacion',
          icon: 'error',
          confirmButtonText: 'Ok'
        });
        console.error(err);
      }
    );
  }

  borrarTodas() {
    for(let notificacion of this.notificaciones) {
      this.notificacionesService.editNotificacion(notificacion._id!, this.idUsuario).subscribe(
        res => {
          this.ngOnInit();
        },
        err => {
          Swal.fire({
            title: 'Oh no!',
            text: 'Ocurrio un problema eliminando las notificaciones',
            icon: 'error',
            confirmButtonText: 'Ok'
          });
          console.error(err);
        }
      );
    }
  }
}
