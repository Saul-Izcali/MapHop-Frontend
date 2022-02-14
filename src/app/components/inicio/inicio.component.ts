import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from "@angular/forms";
import { HttpClient } from '@angular/common/http'
import { Router } from "@angular/router";
import { LoginService } from '../../services/login/login.service'
import { Loader } from '@googlemaps/js-api-loader';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  noCoinciden = false;
  noAceptado = false;
  cuentaBaneada = false;
  noExiste = false;
  fallaServidor = false;

  fecha = new Date();

  constructor(private loginService: LoginService, private router: Router) { }

  usuario = {
    nombreUsuario: '',
    contrasena: '',
    tipoUsuario: ''
  }

  ngOnInit(): void {
    this.mapa();
  }

  login() {
    this.noAceptado = false;
    this.noExiste = false;
    this.noCoinciden = false;
    this.cuentaBaneada = false;
    this.fallaServidor = false;
    
    this.loginService.ingresar(this.usuario).subscribe(
      res => {
        let validado = true;

        if(res.noExiste) {
          this.noExiste = true;
        }
        else if(res.noCoincide) {
          this.noCoinciden = true;
        }
        else {
          if(res.tipoUsuario == "especial") {
            console.log(res.especialValidado);
            if(!res.especialValidado) {
              validado = false;
              this.noAceptado = true;
            }
          }
  
          if(res.baneado) {
            if(res.baneado == "Si") {
              console.log(res.baneado)
              validado = false
              this.cuentaBaneada = true;
            }
          }
          
  
          if(validado) {
            console.log("usuario valido")
            console.log(res.token)
            console.log(this.usuario);
    
            localStorage.setItem('token',res.token);
            localStorage.setItem('IDU', res.idUsuario);
            localStorage.setItem('TipoUsr', res.tipoUsuario);
            localStorage.setItem('Usr', res.nombreUsuario);
    
            this.router.navigate(['/mapa-reportes']);
          }
        }
      },
      err => {
        console.error(err);
        this.fallaServidor = true;
      }
    );
  }

  mapa() {
    let longitud: number =  -103.3491014;
    let latitud: number = 20.6524009;

    let loader = new Loader({
      // apiKey: 'AIzaSyAYN-jmRSHPR78rT0l1na0XchXlJT7_sDw'
      apiKey: ''
    });

    loader.load().then(() => {
      const map = new google.maps.Map(document.getElementById("mapa")!, {
        center: { lat: latitud, lng: longitud},
        zoom: 12,
        disableDefaultUI:true, 
        styles: [
          {
            "featureType": "administrative.land_parcel",
            "elementType": "labels",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "labels.text",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "road.local",
            "elementType": "labels",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          }
        ]
      });

      
      map.addListener("mousedown", () => {
        let ban = JSON.parse(localStorage.getItem('Ban') || '{}');

          if(localStorage.getItem("Ban")){ // significa que fue baneado
            if(ban >= (this.fecha.getTime() - 129600000)){ // si han pasado menos de 36 desde que fue baneado no lo deja hacer reporte
                console.log("No se puede ingresar");
                Swal.fire({
                    title: 'Estas baneado',
                    text: 'No puedes ingresar al mapa por el momento',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                  });
            }
          }else{
                localStorage.removeItem("Ban");
                this.router.navigate(['/mapa-reportes']) 
          }
        
      })

    });
  }

}