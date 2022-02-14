import { Component, OnInit } from '@angular/core';
import { UsuarioComunService } from "../../../services/usuario-comun/usuario-comun.service";
import { UsuarioComun } from "../../../models/usuario-comun";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tabla-comunes',
  templateUrl: './tabla-comunes.component.html',
  styleUrls: ['./tabla-comunes.component.css']
})
export class TablaComunesComponent implements OnInit {

  usuarios: UsuarioComun[] = [{
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    correoElectronico: '',
    nombreUsuario: '',
    contrasena: ''
  }];

  busqueda = ""; // Pipe

  constructor(public usuarioComunService: UsuarioComunService) { }

  ngOnInit(): void {
    this.getUsuarios(); // Se cargan los usuarios comunes en la tabla
  }

  getUsuarios() {
    this.usuarioComunService.getUsuarios().subscribe(
      res => {
        this.usuarios = <UsuarioComun[]>res;
      },
      err => {
        Swal.fire({
          title: 'Oh no!',
          text: 'Ocurrio un problema recibiendo los usuarios',
          icon: 'error',
          confirmButtonText: 'Ok'
        });

        console.error(err);
      }
    );
  }

  deleteUsuario(id?: string) {
    Swal.fire({
      title: 'Seguro?',
      text: "No podrás recuperar al usuario eliminado",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioComunService.deleteUsuario(id)?.subscribe(
          res => {
            Swal.fire({
              title: 'Eliminado',
              text: "Se eliminó al usuario",
              icon: 'success',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Ok'
            }).then((result) => {
              if (result.isConfirmed || result.isDismissed) {
                window.location.reload();
              }
            });
          },
          err => {
            Swal.fire({
              title: 'Oh no!',
              text: 'Ocurrio un problema eliminando al usuario',
              icon: 'error',
              confirmButtonText: 'Ok'
            });
            console.error(err);
          }
          );
      }
    });
  }
}
