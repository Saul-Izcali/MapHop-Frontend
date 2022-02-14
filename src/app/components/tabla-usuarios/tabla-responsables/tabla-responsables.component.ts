import { Component, OnInit } from '@angular/core';
import { UsuarioResponsableService } from "../../../services/usuario-responsable/usuario-responsable.service";
import { UsuarioResponsable } from "../../../models/usuario-responsable";
import Swal from 'sweetalert2';
import { LoginService } from 'src/app/services/login/login.service';

@Component({
  selector: 'app-tabla-responsables',
  templateUrl: './tabla-responsables.component.html',
  styleUrls: ['./tabla-responsables.component.css']
})
export class TablaResponsablesComponent implements OnInit {

  // usuarios: UsuarioResponsable[] | undefined;
  usuarios: UsuarioResponsable[] = [{
    nombreUsuario: '',
    contrasena: '',
    usuarioResponsable: {
      institucion: '',
    }
  }];

  busqueda = "";
  
  constructor(public usuarioResponsableService: UsuarioResponsableService, public loginService: LoginService,) { }

  ngOnInit(): void {
    this.getUsuarios(); // Se cargan los usuarios responsables en la tabla
  }

  getUsuarios() {
    this.usuarioResponsableService.getUsuarios().subscribe(
      async res => {
        this.usuarios = <UsuarioResponsable[]>res;
        for(let i = 0; i < this.usuarios.length; i++) {
          const idContrasena = {
            id: this.usuarios[i]._id,
            contrasena: this.usuarios[i].nombreUsuario
          }
    
          this.usuarios[i].contrasena = await this.CompararContras(idContrasena, i);
        }

        let contraNoModif = this.usuarios;
        let contraModif: any = [];
        let aux: any = []

        for(let i = 0; i < this.usuarios.length; i++) {
          if(contraNoModif[i].contrasena != contraNoModif[i].nombreUsuario) {
            contraModif.push(contraNoModif.splice(i, 1)[0]);
          }
        }

        this.usuarios = [];

        aux = contraNoModif;

        for(let modif of contraModif) {
          aux.push(modif);
        }

        setTimeout( ()=> {
          this.usuarios = aux;
        },1)
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

  async CompararContras(idContrasena: any, indice: number): Promise<string> {
    return new Promise((resolve, reject) => {
      this.loginService.compararContrasenas(idContrasena).subscribe(
        res => {
          const coinciden = res.coinciden;

          if(coinciden) {
            resolve(idContrasena.contrasena);
          }
          else {
            resolve("El usuario ya modificó su contraseña");
          }
        },
        err => {
          Swal.fire({
            title: 'Oh no!',
            text: 'Ocurrio un problema revisando las credenciales',
            icon: 'error',
            confirmButtonText: 'Ok'
          });
          console.error(err);
        }
      );
    });
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
        this.usuarioResponsableService.deleteUsuario(id)?.subscribe(
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
