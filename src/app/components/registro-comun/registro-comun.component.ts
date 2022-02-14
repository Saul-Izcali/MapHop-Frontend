import { Component, OnInit } from '@angular/core';
import { UsuarioComunService } from "../../services/usuario-comun/usuario-comun.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import Swal from 'sweetalert2';
import { LoginService } from 'src/app/services/login/login.service';

@Component({
  selector: 'app-registro-comun',
  templateUrl: './registro-comun.component.html',
  styleUrls: ['./registro-comun.component.css']
})
export class RegistroComunComponent implements OnInit {
  registrarForm!: FormGroup;

  // Variables para validar los campos
  nombreValido = true;
  apaternoValido = true;
  amaternoValido = true;
  correoValido = true;
  nombreUsuarioValido = true;
  contrasenaValido = true;
  confContrasenaValido = true;

  // Variables con el mensaje de error del campo
  nombreMensaje = "No valido";
  apaternoMensaje = "No valido";
  amaternoMensaje = "No valido";
  correoMensaje = "No valido";
  nombreUsuarioMensaje = "No valido";
  contrasenaMensaje = "No valido";
  confContrasenaMensaje = "No valido";
  
  constructor(
              private formBuilder: FormBuilder,
              public usuarioComunService: UsuarioComunService,
              public loginService: LoginService,
              private router: Router
              ) { }
  
  ngOnInit(): void {
    // Se inicializan los campos del formulario con valores vacíos
    this.registrarForm = this.formBuilder.group({
      nombre: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      correoElectronico: "",
      nombreUsuario: "",
      contrasena: "",
      confirmarContrasena: "",
    }); 
  }


  // --------------------------------------------------------------------------------


  async ValidarCampo(campo: string) {
    // Se valida un campo al hacer cambios en él, para hacer el formulario reactivo
    switch(campo) {
      case 'nombre': {
        // Se valida que no esté vacío ni tenga más de 30 caracteres
        this.nombreValido = true;

        if(!this.registrarForm.value.nombre.length) {
          this.nombreValido = false;
          this.nombreMensaje = "Nombre vacío";
        }
        else if(this.registrarForm.value.nombre.length > 30) {
          this.nombreValido = false;
          this.nombreMensaje = "El nombre superó los 30 caracteres";
        }
        break; 
      }
      case 'apaterno': {
        // Se valida que no esté vacío ni tenga más de 30 caracteres
        this.apaternoValido = true;

        if(!this.registrarForm.value.apellidoPaterno.length) {
          this.apaternoValido = false;
          this.apaternoMensaje = "Apellido paterno vacío";
        }
        else if(this.registrarForm.value.apellidoPaterno.length > 30) {
          this.apaternoValido = false;
          this.apaternoMensaje = "El apellido paterno superó los 30 caracteres";
        }
        break; 
      }
      case 'amaterno': {
        // Se valida que no esté vacío ni tenga más de 30 caracteres
        this.amaternoValido = true;

        if(!this.registrarForm.value.apellidoMaterno.length) {
          this.amaternoValido = false;
          this.amaternoMensaje = "Apellido materno vacío";
        }
        else if(this.registrarForm.value.apellidoMaterno.length > 30) {
          this.amaternoValido = false;
          this.amaternoMensaje = "El apellido materno superó los 30 caracteres";
        }
        break; 
      }
      case 'correo': {
        // Se valida que no esté vacío, que no tenga más de 30 caracteres y que cuente con el formato de correo (con @ y .)
        this.correoValido = true;

        if(!this.registrarForm.value.correoElectronico.length) {
          this.correoValido = false;
          this.correoMensaje = "Correo electrónico vacío";
        }
        else if(!(this.registrarForm.value.correoElectronico.includes('@') && this.registrarForm.value.correoElectronico.includes("."))) {
          this.correoValido = false;
          this.correoMensaje = "Formato de correo electrónico no válido";
        }
        else if(await this.CorreoRepetido()) {
          this.correoValido = false;
          this.correoMensaje = "El correo electrónico ya está vinculado a una cuenta";
        }
        break; 
      }
      case 'nombreUsuario': {
        // Se valida que no esté vacío, que no tenga más de 30 caracteres, que no su usen la siglas de instituciones y que no exista el nombre de usuario
        this.nombreUsuarioValido = true;
        const siglas = this.registrarForm.value.nombreUsuario.substr(0,2).toLowerCase();

        if(!this.registrarForm.value.nombreUsuario.length) {
          this.nombreUsuarioValido = false;
          this.nombreUsuarioMensaje = "Nombre de usuario vacío";
        }
        else if(this.registrarForm.value.nombreUsuario.length > 30) {
          this.nombreUsuarioValido = false;
          this.nombreUsuarioMensaje = "El nombre de usuario superó los 30 caracteres";
        }
        else if(siglas == "sp" || siglas == "if" || siglas == "bm" || siglas == "cf" || siglas == "pc" || siglas == "sm") {
          this.nombreUsuarioValido = false;
          this.nombreUsuarioMensaje = "No puedes utilizar estas 2 letras iniciales";
        }
        else if(await this.UsuarioRepetido()) {
          this.nombreUsuarioValido = false;
          this.nombreUsuarioMensaje = "El nombre de usuario ya existe";
        }
        break; 
      }
      case 'contrasena': {
        // Se valida que no esté vacío, que no tenga más de 30 caracteres y que sea igual que el otro campo de contraseña
        this.contrasenaValido = true;

        if(!this.registrarForm.value.contrasena.length) {
          this.contrasenaValido = false;
          this.contrasenaMensaje = "Contraseña vacía";
        }
        else if(this.registrarForm.value.contrasena.length > 30) {
          this.contrasenaValido = false;
          this.contrasenaMensaje = "La contraseña superó los 30 caracteres";
        }

        if(this.registrarForm.value.confirmarContrasena != this.registrarForm.value.contrasena) {
          this.confContrasenaValido = false;
          this.confContrasenaMensaje = "Las contraseñas no coinciden";
        }
        else {
          this.confContrasenaValido = true;
        }
        break; 
      }
      case 'confContrasena': {
        // Se valida que sea igual que el otro campo de contraseña
        this.confContrasenaValido = true;

        if(this.registrarForm.value.confirmarContrasena != this.registrarForm.value.contrasena) {
          this.confContrasenaValido = false;
          this.confContrasenaMensaje = "Las contraseñas no coinciden";
        }
        break; 
      }
    }
  }


  // --------------------------------------------------------------------------------


  UsuarioRepetido(){
    // Se busca el nombre de usuario ingresado, para saber si ya existe
    return new Promise((resolve, reject) => {
      this.loginService.usuarioRepetido(this.registrarForm.value.nombreUsuario).subscribe(
        res => {
          let repetido = res.existe;

          resolve(repetido);
        },
        err => {
          console.error(err);
        }
      );
    });
  }

  CorreoRepetido(){
    // Se busca el correo electrónico ingresado, para saber si ya existe
    return new Promise((resolve, reject) => {
      this.loginService.correoRepetido(this.registrarForm.value.correoElectronico).subscribe(
        res => {
          let repetido = res.existe;

          resolve(repetido);
        },
        err => {
          console.error(err);
        }
      );
    });
  }


  // --------------------------------------------------------------------------------


  CreateUsuario(): any {
    // Si se presiona el botón de registro sin haber modificado un campo se revisa si están vacíos
    if(!this.registrarForm.value.nombre.length) {
      this.nombreValido = false;
      this.nombreMensaje = "Nombre vacío"
    }
    if(!this.registrarForm.value.apellidoPaterno.length) {
      this.apaternoValido = false;
      this.apaternoMensaje = "Apellido paterno vacío"
    }
    if(!this.registrarForm.value.apellidoMaterno.length) {
      this.amaternoValido = false;
      this.amaternoMensaje = "Apellido materno vacío"
    }
    if(!this.registrarForm.value.correoElectronico.length) {
      this.correoValido = false;
      this.correoMensaje = "Correo electrónico vacío"
    }
    if(!this.registrarForm.value.nombreUsuario.length) {
      this.nombreUsuarioValido = false;
      this.nombreUsuarioMensaje = "Nombre de usuario vacío"
    }
    if(!this.registrarForm.value.contrasena.length) {
      this.contrasenaValido = false;
      this.contrasenaMensaje = "Contraseña vacía"
    }
    if(!this.registrarForm.value.confirmarContrasena.length) {
      this.confContrasenaValido = false;
      this.confContrasenaMensaje = "Contraseña vacía"
    }

    // Si se validaron todos los campos se envía la petición de creación de usuario al backend
    if(this.nombreValido && this.apaternoValido && this.amaternoValido && this.correoValido && this.nombreUsuarioValido && this.contrasenaValido && this.confContrasenaValido) {
      console.log("Todo valido");
      this.usuarioComunService.createUsuario(this.registrarForm.value).subscribe(
        res => {
          Swal.fire({
            title: 'Te has registrado!',
            text: 'Bienvenido a Map Hop',
            icon: 'success',
            confirmButtonText: 'Ok'
          });
          
          this.router.navigate(['/']);
        },
        err => {
          Swal.fire({
            title: 'Oh no!',
            text: 'Ocurrio un problema registrandote',
            icon: 'error',
            confirmButtonText: 'Ok'
          });

          console.error(err);
        }
      );
    }
    else {
      Swal.fire({
        title: 'Oh no!',
        text: 'Por favor revisa todos los campos',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
    }
  }
}
