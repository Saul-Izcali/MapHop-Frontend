import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioComun } from 'src/app/models/usuario-comun';
import { UsuarioEspecial } from 'src/app/models/usuario-especial';
import { Reporte } from 'src/app/models/reporte';
import { LoginService } from 'src/app/services/login/login.service';
import Swal from 'sweetalert2';
import { UsuarioComunService } from "../../services/usuario-comun/usuario-comun.service";
import { UsuarioEspecialService } from "../../services/usuario-especial/usuario-especial.service";
import { UsuarioResponsableService } from "../../services/usuario-responsable/usuario-responsable.service";
import { ReportesService } from "../../services/reportes/reportes.service";
import { FormBuilder, FormGroup } from '@angular/forms';
import { UsuarioResponsable } from 'src/app/models/usuario-responsable';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  barraProgreso: number = 0;
  editarInfoForm!: FormGroup;
  editarReporteForm!: FormGroup;
  confirmarIdentidadForm!: FormGroup;

  toggleEditarInfoForm = false;
  toggleEditarReporteForm = false;
  toggleConfirmarIdentidadForm = false;
  toggleDesactivarFondo = false;
  togglebloquearScroll = false;

  idReporteEditar?: string = "";
  tipoReporteEditar?: string = "";
  editar: string = "";

  coincideNombre = false;
  coincideContrasena = false;
  nombreLargo = false;
  contrasenaLarga = false;
  comentarioLargo = false;

  @Input() span = 'Seleccionar archivo de imagen';

  @ViewChild('file', {
    read: ElementRef
  }) file?: ElementRef;

  selectedImage?: File;

  usuarioComun: UsuarioComun = {
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    correoElectronico: '',
    nombreUsuario: '',
    contrasena: ''
  };

  usuarioEspecial: UsuarioEspecial = {
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    correoElectronico: '',
    nombreUsuario: '',
    contrasena: '',
    usuarioEspecial: {
      imagen: '',
    }
  };

  usuarioResponsable: UsuarioResponsable = {
    nombreUsuario: '',
    contrasena: ''
  };

  idUsuario: string = "";
  tipoUsuario: string = "";
  nombreUsuario: string = "";
  contrasena: string = "";
  nombre: string = "";
  apellidoPaterno: string = "";
  apellidoMaterno: string = "";
  reputacion: number = 0;

  reportes: Reporte[] = [{
    _id: "",
    ubicacion: {
      latitud: 0,
      longitud: 0
    },
    tipoProblema: "",
    credibilidad: 0,
    usuarios: [{
      _id: ""
    }]
  }];

  constructor(
              public usuarioComunService: UsuarioComunService,
              public usuarioEspecialService: UsuarioEspecialService,
              public usuarioResponsableService: UsuarioResponsableService,
              public reportesService: ReportesService,
              public loginService: LoginService,
              private formBuilder: FormBuilder,
              public router: Router) { }

  async ngOnInit(): Promise<void> {
    this.editarInfoForm = this.formBuilder.group({
      nombreUsuario: ['', ],
      contrasena: ['', ]
    }); 

    this.editarReporteForm = this.formBuilder.group({
      comentario: ['', ],
      imagen: ['', ]
    }); 

    this.confirmarIdentidadForm = this.formBuilder.group({
      contraseña: ['', ]
    }); 

    this.getUsuario();
  }

  // NECESARIO PARA RECIBIR LA IMAGEN (PENDIENTE)
  onImageSelected(event: Event) {
    this.selectedImage = this.file?.nativeElement.files[0];

    if(this.selectedImage?.name) {
			this.span = this.selectedImage?.name;

      const extencion = this.selectedImage?.name.substring(this.selectedImage?.name.lastIndexOf('.'),this.selectedImage?.name.length);
      console.log(extencion);

      if(extencion != ".png" && extencion != ".jpg" && extencion != ".jpeg" && extencion != ".pdf") {
        this.selectedImage = undefined;
        this.span = "Selecciona archivo de imagen";
          
        Swal.fire({
          title: 'Formato incorrecto!',
          text: 'El archivo no es png, jpg, jpeg o pdfo',
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      }
    }
    else {
      this.span = "Selecciona archivo de imagen";
    }
  }

  getUsuario() {
    if(!this.loginService.ingresado()) {
      this.router.navigate(['']);
    }

    const tipoUsuario = this.loginService.getTipoUsuario();
    const usuario = this.loginService.getUsuarioActual();

    switch (tipoUsuario) {
      case "comun":
        this.usuarioComunService.getUsuario(usuario!).subscribe(
          res => {
            this.usuarioComun = <UsuarioComun>res;

            this.idUsuario = this.usuarioComun._id!;
            this.tipoUsuario = "comun";
            this.nombreUsuario = this.usuarioComun.nombreUsuario;
            this.nombre = this.usuarioComun.nombre;
            this.contrasena = this.usuarioComun.contrasena;
            this.apellidoPaterno = this.usuarioComun.apellidoPaterno;
            this.apellidoMaterno = this.usuarioComun.apellidoMaterno;
            this.reputacion = this.usuarioComun.reputacion!;

            this.barraProgreso = this.reputacion*10;

            setTimeout(async () => this.getReportes(), 200);
          },
          err => {
            Swal.fire({
              title: 'Oh no!',
              text: 'Ocurrio un problema recibiendo el usuario',
              icon: 'error',
              confirmButtonText: 'Ok'
            });
    
            console.error(err);
          }
        );

        break;

      case "especial":
        this.usuarioEspecialService.getUsuario(usuario!).subscribe(
          res => {
            this.usuarioEspecial = <UsuarioEspecial>res;

            this.idUsuario = this.usuarioEspecial._id!;
            this.tipoUsuario = "especial";
            this.nombreUsuario = this.usuarioEspecial.nombreUsuario;
            this.nombre = this.usuarioEspecial.nombre;
            this.contrasena = this.usuarioEspecial.contrasena;
            this.apellidoPaterno = this.usuarioEspecial.apellidoPaterno;
            this.apellidoMaterno = this.usuarioEspecial.apellidoMaterno;
            this.reputacion = this.usuarioEspecial.reputacion!;

            this.barraProgreso = this.reputacion*10;

            setTimeout(async () => this.getReportes(), 200);
          },
          err => {
            Swal.fire({
              title: 'Oh no!',
              text: 'Ocurrio un problema recibiendo el usuario',
              icon: 'error',
              confirmButtonText: 'Ok'
            });
    
            console.error(err);
          }
        );

        break;

      case "responsable":
        this.usuarioResponsableService.getUsuario(usuario!).subscribe(
            res => {
              this.usuarioResponsable = <UsuarioResponsable>res;
  
              this.idUsuario = this.usuarioResponsable._id!;
              this.tipoUsuario = "responsable";
              this.nombreUsuario = this.usuarioResponsable.nombreUsuario;
              this.contrasena = this.usuarioResponsable.contrasena!;

              this.reportes = [];
            },
            err => {
              Swal.fire({
                title: 'Oh no!',
                text: 'Ocurrio un problema recibiendo el usuario',
                icon: 'error',
                confirmButtonText: 'Ok'
              });
      
              console.error(err);
            }
          );

        break;
    }
  }

  getReportes() {
    this.reportesService.getReportesUsuario(this.idUsuario).subscribe(
      res => {
        this.reportes = <Reporte[]>res;
      },
      err => {
        Swal.fire({
          title: 'Oh no!',
          text: 'Ocurrio un problema recibiendo los reportes',
          icon: 'error',
          confirmButtonText: 'Ok'
        });
        console.error(err);
      }
    );
  }

  editarForm(editarForm: string) {
    var siguienteForm = true;

    if(editarForm == "informacion") {
      this.editar = "informacion";

      const idContrasena = {
        id: this.idUsuario,
        contrasena: this.editarInfoForm.value.contrasena
      }



      if(!(this.editarInfoForm.value.nombreUsuario == '' && this.editarInfoForm.value.contrasena == '')){
        var valido = true;
        if(this.editarInfoForm.value.nombreUsuario.length > 30) {
          this.nombreLargo = true;
          valido = false;
        }
        else {
          this.nombreLargo = false;
        }
        if(this.editarInfoForm.value.contrasena.length > 30) {
          this.contrasenaLarga = true;
          valido = false;
        }
        else {
          this.contrasenaLarga = false;
        }

        if(valido == true) {
          this.loginService.usuarioRepetido(this.editarInfoForm.value.nombreUsuario).subscribe(
            res => {
              const existe = res.existe;
  
              if(existe) {
                  this.coincideNombre = true;
                  siguienteForm = false;
                }  
                else {
                  this.coincideNombre = false; 
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
          
          this.loginService.compararContrasenas(idContrasena).subscribe(
            res => {
              const coinciden = res.coinciden;
  
              console.log(coinciden);
  
              if(coinciden) {
                this.coincideContrasena = true;
                siguienteForm = false;
              }
              else {
                this.coincideContrasena = false;
              }
  
              if(siguienteForm == true) {
                this.toggleEditarInfoForm = false;
                this.toggleConfirmarIdentidadForm = true;
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
        }
      }
      else {
        this.coincideNombre = false;
        this.coincideContrasena = false;
        this.nombreLargo = false;
        this.contrasenaLarga = false;
      }
    }
      


    else if(editarForm == "reporte"){
      this.editar = "reporte";

      if(!(this.editarReporteForm.value.comentario.length == 0)) {
        if(this.editarReporteForm.value.comentario.length > 150) {
          this.comentarioLargo = true;
          siguienteForm = false;
        }
        else {
          this.comentarioLargo = false;
        }
      }
      else {
        siguienteForm = false;
      }
      if(this.selectedImage?.name) {
        siguienteForm = true;
      }

      if(siguienteForm == true) {
        this.toggleEditarReporteForm = false;
        this.toggleConfirmarIdentidadForm = true;
      }
      else {
        this.comentarioLargo = false;
      }
    }
    else {
      this.editar = "informacion";
      this.editarInfoForm.value.nombreUsuario = '';

      const idContrasena = {
        id: this.idUsuario,
        contrasena: this.editarInfoForm.value.contrasena
      }


      
      if(!(this.editarInfoForm.value.contrasena == '')){
        var valido = true;
        if(this.editarInfoForm.value.contrasena.length > 30) {
          this.contrasenaLarga = true;
          valido = false;
        }
        else {
          this.contrasenaLarga = false;
        }

        if(valido == true) {
          this.loginService.compararContrasenas(idContrasena).subscribe(
            res => {
              const coinciden = res.coinciden;
  
              console.log(coinciden);
  
              if(coinciden) {
                this.coincideContrasena = true;
                siguienteForm = false;
              }
              else {
                this.coincideContrasena = false;
              }
  
              if(siguienteForm == true) {
                this.toggleEditarInfoForm = false;
                this.toggleConfirmarIdentidadForm = true;
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
        }
      }
      else {
        this.coincideNombre = false;
        this.coincideContrasena = false;
      }
    }
  }

  confirmarIdentidad() {
    const idContrasena = {
      id: this.idUsuario,
      contrasena: this.confirmarIdentidadForm.value.contraseña
    }

    this.loginService.compararContrasenas(idContrasena).subscribe(
      res => {
        const contrasenaCorrecta = res.coinciden;

        if(contrasenaCorrecta) {
          if(this.editar == "informacion") {
            this.usuarioComunService.editUsuario(this.idUsuario, this.editarInfoForm.value).subscribe(
              res => {
                Swal.fire({
                  title: 'Información actualizada!',
                  text: 'Se ha editado la información correctamente',
                  icon: 'success',
                  confirmButtonText: 'Ok'
                });

                this.toggleConfirmarIdentidadForm = false;
                this.toggleDesactivarFondo = false;

                this.ngOnInit();
              },
              err => {
                Swal.fire({
                  title: 'Oh no!',
                  text: 'Ocurrio un problema editando la información',
                  icon: 'error',
                  confirmButtonText: 'Ok'
                });
                console.error(err);
              }
            );
          }
          
          else {
            let correcto = true;

            if(this.editarReporteForm.value.comentario.length > 1) {
              const reporte = {
                _id: this.idReporteEditar,
                comentario: this.editarReporteForm.value.comentario
              }
  
              this.reportesService.editReporte(reporte).subscribe(
                res => {
                },
                err => {
                  correcto = false;

                  Swal.fire({
                    title: 'Oh no!',
                    text: 'Ocurrio un problema editando el comentario del reporte reporte',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                  });
                  console.error(err);
                }
              );
            }

            if(this.selectedImage?.name) {
              const formData = new FormData;
              formData.append('imagen', "prueba");
              formData.append('imagenReporte', this.file?.nativeElement.files[0]);

              console.log("Si entra al de imagen");

              this.reportesService.editImagenReporte(this.idReporteEditar, formData).subscribe(
                res => {
                },
                err => {
                  correcto = false;

                  Swal.fire({
                    title: 'Oh no!',
                    text: 'Ocurrio un problema editando la imagen del reporte',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                  });
                  console.error(err);
                }
              );
            }

            if(correcto) {
              Swal.fire({
                title: 'Reporte actualizado!',
                text: 'Se ha editado el correctamente',
                icon: 'success',
                confirmButtonText: 'Ok'
              });

              this.toggleConfirmarIdentidadForm = false;
              this.toggleDesactivarFondo = false;

              this.ngOnInit();
            }
          }
        }



        else {
          Swal.fire({
            title: 'Oh no!',
            text: 'Contraseña incorrecta',
            icon: 'error',
            confirmButtonText: 'Ok'
          });
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
  }
}
