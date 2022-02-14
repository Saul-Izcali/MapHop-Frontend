import { Component, OnInit } from '@angular/core';
import { UsuarioResponsableService } from '../../services/usuario-responsable/usuario-responsable.service';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro-responsable',
  templateUrl: './registro-responsable.component.html',
  styleUrls: ['./registro-responsable.component.css']
})
export class RegistroResponsableComponent implements OnInit {
  UsuarioResponsableService: any;
  registrarForm!: FormGroup;
  submitted = false;
  // numResp = 0;
  // usuarioTemp = "";

  constructor(private formBuilder: FormBuilder, public usuarioResponsableService: UsuarioResponsableService) { }

  ngOnInit(): void {
    this.registrarForm = this.formBuilder.group({
      institucion: ['', Validators.required]
    });
  }
  
  
  
  CreateUsuario() {
    if(!this.registrarForm.value.institucion) {
      Swal.fire({
        title: 'Oh no!',
        text: 'Selecciona una institución para crear el usuario',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
    }
    else {
      this.usuarioResponsableService.createUsuario(this.registrarForm.value).subscribe(
        res => {
          console.log("Respuesta de la peticion")
          Swal.fire({
            title: 'Responsable de mantenimiento registrado!',
            html: 'El nombre de usuario y contraseña son: <b>' + res + '</b>',
            icon: 'success',
            confirmButtonText: 'Ok'
          });
        },
        err => {
          Swal.fire({
            title: 'Oh no!',
            text: 'Ocurrio un problema enviando el registro"',
            icon: 'error',
            confirmButtonText: 'Ok'
          });
          
          console.error(err)
        }
      );
    }
  }
}
