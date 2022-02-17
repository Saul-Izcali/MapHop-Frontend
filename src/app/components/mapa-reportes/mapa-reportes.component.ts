import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ReportesService } from "../../services/reportes/reportes.service";
import { HttpClient } from '@angular/common/http'
import { Reporte } from "../../models/reporte";
import { Loader } from '@googlemaps/js-api-loader';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup } from "@angular/forms";
import { LoginService } from "../../services/login/login.service";

import { AlgoritmoIdentificacion } from './algoritmo-identificacion';
import { AlgoritmoUrgencia } from "./algoritmo-urgencia";
import { createOfflineCompileUrlResolver } from '@angular/compiler';
import { NotificacionesService } from 'src/app/services/notificaciones/notificaciones.service';
import { Notificacion } from 'src/app/models/notificacion';

// import { from } from 'rxjs';

@Component({
  selector: 'app-mapa-reportes',
  templateUrl: './mapa-reportes.component.html',
  styleUrls: ['./mapa-reportes.component.css']
})
export class MapaReportesComponent implements OnInit {
  // MAS DE 150 CARACTERES EN COMENTARIO DEL FORMULARIO
  comentarioLargo = false;
  registrarForm!: FormGroup;
  @Input() span = 'Seleccionar archivo de imagen';

  @ViewChild('file', {
    read: ElementRef
  }) file?: ElementRef;

  selectedImage?: File;

  // VARIABLES PARA HACER TOGGLE DE CLASES
  toggleShowBotonReportar: boolean = false;
  toggleShowBotonReplicar: boolean = false;
  toggleDesactivarMapa: boolean = false;
  toggleTipoProblema: boolean = false;
  toggleTipoAgua: boolean = false;
  toggleTipoObstruccion: boolean = false;
  toggleFormReporte: boolean = false;

  // TRUE SI SE VA A HACER LA REPLICA DE UN REPORTE
  replica: boolean = false;

  // ID DEL REPORTE A REPLICAR
  replicaId: string = "";
  fecha = new Date();

  // COORDENADAS Y TIPO DEL NUEVO REPORTE EN DONDE SE COLOCÓ EL MARKER
  nuevoLatLng: any;
  nuevoProblema: string = "";

  // ESQUEMA DE REPORTE PARA RECIBIR LOS REPORTES YA EXISTENTES
  reportes: Reporte[] = [{
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

  constructor(public reportesService: ReportesService, public notificacionesService: NotificacionesService, public http: HttpClient, private formBuilder: FormBuilder, public loginService: LoginService) { }

  ngOnInit(): void {
    

    // SE INICIA EL MAPA
    
    this.mapa();

    // ASI SE UTILIZA LA CLASE CON EL ALGORITMO DE IDENTIFICACION,
    

    // let prueba = new AlgoritmoIdentificacion(this.reportesService, this.http);
    // prueba.Identificacion(this.reportePrueba); // es el reporte que se esta haciendo

    this.registrarForm = this.formBuilder.group({
      comentario: ['', ],
      imagen: ['', ],
      cronico: [false, ],
      vidaRiesgo: [false, ],
      fantasma: [false, ],
      tipoProblema: ['', ],
      ubicacion: {
        longitud: [0, ],
        latitud: [0, ]
        },
      usuarios: {
        _id: ""
      }
    }); 
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




//||||||||||||||||||||||||||||||||||||| SE CARGA EL MAPA |||||||||||||||||||||||||||||||||||||
mapa() {
  // COORDENADAS DEL USUARIO PARA CENTRAR EL MAPA
  let longitud: number =  -103.3479102;
  let latitud: number = 20.6763989;

  // DECLARAR LOADER DEL MAPA CON LA APIKEY
  let loader = new Loader({
   
    apiKey: ''
  });

  // CONSEGUIR COORDENADAS DEL USUARIO
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      latitud = position.coords.latitude;
      longitud = position.coords.longitude;
    }, function(err){
      console.error(err);
    }, {enableHighAccuracy: true});
  }

  setTimeout(() => {
  // SE CARGA EL MAPA CENTRADO EN LA UBICACION DEL USUARIO
  loader.load().then(() => {
    const map = new google.maps.Map(document.getElementById("mapa")!, {
      center: { lat: latitud, lng: longitud},
      disableDefaultUI: true,
      zoomControl: true,
      zoom: 15,
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

    // ESTO ES PARA INTENTAR HACER EL BUSCADOR EN UN FUTURO
    // const buscador = <HTMLInputElement>document.getElementById("buscador")!;
    // const buscar = new google.maps.places.Autocomplete(buscador);
    // buscar.bindTo("bounds", map);

    // INFOWINDOW
    const infoWindow = new google.maps.InfoWindow();
    // ARREGLO DE MARKERS PARA CAMBIAR DE POSICION EL MARCADOR CUANDO EL USUARIO PRESIONA EL MAPA
    let newMarker: google.maps.Marker[] = [];



    // SE CREAN LOS MARCADORES DE LOS REPORTES YA EXISTENTES
    this.reportesExistentes(map);



    // ICONO DEL MARKER DEL NUEVO REPORTE
    const nuevoReporteMarker = {
      path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
      fillColor: "#04CAB3",
      fillOpacity: 1,
      strokeWeight: 0,
      rotation: 0,
      scale: 2,
      anchor: new google.maps.Point(15, 30)
    };



    // SE CREA EL LISTENER DEL MAPA PARA CREAR NUEVOS REPORTES
    google.maps.event.addListener(map, "click", (event: any) => {
      let latitud1 = 20.77758;
      let latitud2 = 20.521687;
      let longitud1 = -103.4836477;
      let longitud2 = -103.2066437;

      const container = document.querySelector('.container')
      const boton = document.getElementById('botonReportar')
      this.nuevoLatLng = event.latLng; // SE OBTIENE LA UBICACIÓN SELECCIONADA
      let dentroDeGDL = true;

      if(this.nuevoLatLng.lat() < latitud1 && this.nuevoLatLng.lat() > latitud2) {
        if(this.nuevoLatLng.lng() > longitud1 && this.nuevoLatLng.lng() < longitud2) {
          // SI YA EXISTE EL MARKER SE BORRA
          if(newMarker.length > 0) {
            newMarker[0].setMap(null);
            newMarker = [];
          }

          // -------- efecto onda -----------------
            let ripple = document.createElement('span')
            let x = event.domEvent.offsetX 
            let y = event.domEvent.offsetY

            // event.domEvent.offsetX 
            //   Y1 = event.domEvent.offsetY 
        
            ripple.style.left = x + 'px'
            ripple.style.top = y + 'px'
        
            container!.appendChild(ripple)
        
            setTimeout(() => {
                ripple.remove()
            }, 2000)
            console.log(x, y)
          // -------- efecto onda -----------------

          console.log(newMarker) //------------------------------------------------------
          // SE CREA EL MARKER
          const addMarker = new google.maps.Marker({
            position: this.nuevoLatLng,
            map,
            title: "Has un reporte!",
            optimized: true,
            icon: nuevoReporteMarker,
            draggable: true
          });

          // SE AGREGA EL MARKER AL ARREGLO PARA SABER CUANDO SE CREA
          newMarker.push(addMarker);

          console.log(newMarker) //------------------------------------------------------

          // SE CIERRA EL INFOWINDOW DEL OTRO MARKER EN CASO DE EXISTIR Y SE MUESTRA EL BOTON EN EL NUEVO MARCADOR
          setTimeout(() => {
            infoWindow.close();
            if(localStorage.getItem('TipoUsr') == 'admin' || localStorage.getItem('TipoUsr') == 'responsable'){
              infoWindow.setContent('<h2>No tiene permitido realizar reportes</h2>');
            }
            else {
              // <button id="botonReportar" class="botonReportar" [ngClass]="{'showBotonReportar': toggleShowBotonReportar}">Reportar</button>

              infoWindow.setContent(boton);
              console.log(boton)

              this.toggleShowBotonReportar = true;
            }

            infoWindow.open(newMarker[0].getMap(), newMarker[0]);
          }, 100);
          
          // AL PRESIONAR EL BOTON SE USA EL METODO
          boton?.addEventListener('click', () => {
            this.tipoProblema();
          })
        }
        else 
          dentroDeGDL = false;
      }
      else
        dentroDeGDL = false;

      if(!dentroDeGDL) {
        Swal.fire({
          title: 'Oh no!',
          text: 'Solo se puede realizar reportes dentro de la zona metropolitana de Guadalajara',
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      }
    })
  });
  }, 100);
  
}
// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||




  // AGREGAR LOS MARCADORES DE LOS REPORTES EXISTENTES
  reportesExistentes(map: google.maps.Map) {
    const infoWindow = new google.maps.InfoWindow();
    let boton = document.getElementById('botonReplicar')

    // LOS COLORES DE LOS MARCADORES DE CADA TIPO DE PROBLEMA
    const markerAlumbrado = "#ccc547";
    const markerAgua = "#6cb7ce";
    const markerObstruccion = "#864109";
    const markerIncendio = "#fd8037";
    


    // SE OBTIENEN TODOS LOS REPORTES EXISTENTES DESDE EL BACKEND CON EL SERVICE
    this.reportesService.getReportes().subscribe(
      res => {
        for(let reporte of <Reporte[]>res) {
          if(reporte.estado == "Desatendido")
            this.reportes.push(reporte);
        }
        
        // FOR PARA CREAR TODOS LOS MARCADORES
        for (let i = 0; i < this.reportes.length; i++) {
          let markerColor;
    
          // SE IDENTIFICA EL TIPO DE REPORTE PARA ASIGNAR UN COLOR
          switch (this.reportes[i].tipoProblema) {
            case "Alumbrado":
              markerColor = markerAlumbrado;
              break;
    
            case "Inundación":
            case "Fuga de agua":
            case "Falta de alcantarilla":
            case "Alcantarilla obstruida":
              markerColor = markerAgua;
              break;
    
            case "Escombros tirados":
            case "Vehículo abandonado":
            case "Árbol caído":
            case "Socavón":
            case "Cables caídos":
              markerColor = markerObstruccion;
              break;
    
            case "Incendio":
              markerColor = markerIncendio;
              break;
          }
    
          // EL ICONO TOMA EL COLOR QUE LE CORRESPONDE
          const icon = {
            path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
            fillColor: markerColor,
            fillOpacity: 1,
            strokeWeight: 0,
            rotation: 0,
            scale: 2,
            anchor: new google.maps.Point(15, 30)
          };
    
          // SE CREA EL MARCADOR CON EL ICONO Y LAS COORDENADAS DEL PROBLEMA
          const marker = new google.maps.Marker({
            position: { lat: this.reportes[i].ubicacion.latitud, lng: this.reportes[i].ubicacion.longitud },
            map: map,
            title: "Ver detalles",
            icon: icon,
            optimized: true,
          });

          // CUANDO SE HACE CLICK EN EL MARCADOR DE UN REPORTE EXISTENTE SE MUESTRA UN INFOWINDOW
          marker.addListener("click", () => {
            this.replicaId = this.reportes[i]._id!; // CUANDO SE PRESIONA UN MARKER DE UN REPORTE EXISTENTE SE OBTIENE SU ID
            infoWindow.close();
            if(localStorage.getItem('TipoUsr') == 'admin' || localStorage.getItem('TipoUsr') == 'responsable'){
              infoWindow.setContent('<h2>No tiene permitido replicar reportes</h2>');
            }
            else {
              infoWindow.setContent(boton);
              this.toggleShowBotonReplicar = true;
            }
              
            infoWindow.open(marker.getMap(), marker);
          })

          // AL PRESIONAR EL BOTON SE ABRE EL FORMULARIO DE LA REPLICA
          boton?.addEventListener('click', () => {
            this.formReplicar();
          })
        }
      },



      err => {
        Swal.fire({
          title: 'Oh no!',
          text: 'Ocurrio un problema cargando los reportes existentes',
          icon: 'error',
          confirmButtonText: 'Ok'
        });

        console.error(err);
      }
    );
  }




  // MOSTRAR LA VENTANA DE TIPO DE PROBLEMA
  tipoProblema() {
    this.toggleTipoProblema = true; // MUESTRA FORM 1
    this.toggleDesactivarMapa = true; // DESACTIVA EL MAPA
  }
  // MOSTRAR LA VENTANA DE TIPO DE PROBLEMA DE AGUA Y CERRAR LA GENERAL
  tipoAgua() {
    this.toggleTipoProblema = false // ESCONDE EL FORM 1
    this.toggleTipoAgua = true; // MUESTRA EL FORM DE AGUA
  }
  // MOSTRAR LA VENTANA DE TIPO DE PROBLEMA DE OBSTRUCCION Y CERRAR LA GENERAL
  tipoObstruccion() {
    this.toggleTipoProblema = false // ESCONDE EL FORM 1
    this.toggleTipoObstruccion = true; // MUESTRA EL FORM DE OBSTRUCCION
  }




// FORMULARIO DE DETALLES DEL REPORTE
  formReporte(tipoProblema: string) {
    this.nuevoProblema = tipoProblema; // SE OBTIENE EL TIPO DE PROBLEMA
    this.toggleTipoProblema = false // SE ESCONDE EL FORM 1
    this.toggleTipoAgua = false; // SE ESCONDE EL FORM DE AGUA
    this.toggleTipoObstruccion = false; // SE ESCONDE EL FORM DE OBSTRUCCION
    this.toggleFormReporte = true; // SE MUESTRA EL FORM DE DETALLES
  }

  // FORMULARIO DE DETALLES DEL REPORTE
  formReplicar() {
    this.replica = true; // SE COLOCA COMO TRUE QUE SE VA A REPLICAR UN REPORTE
    this.toggleDesactivarMapa = true; // SE DESACTIVA EL MAPA
    this.toggleFormReporte = true; // SE MUESTRA EL FORM DE DETALLES
  }





  cerrarForm() {
    // SE CIERRA EL FORM DE DETALLES CON UN TOGGLE
    this.toggleFormReporte = false; 

    // SI ES EL FORM DE UNA REPLICA SE VA DIRECTO AL MAPA
    if(this.replica == true) {
      this.replica = false;
      this.toggleDesactivarMapa = false;
    }
    // SI ES EL FORM DE REPORTE NUEVO SE VA AL FORM DE TIPO DE PROBLEMA
    else
      this.toggleTipoProblema = true;  
  }





  // FORM DE DETALLES Y ENVIAR REPORTE
  async reportar(): Promise<any> {
    //hace las validaciones del algoritmo de identificacion
    // ASI SE UTILIZA LA CLASE CON EL ALGORITMO DE IDENTIFICACION
    let identificacion = new AlgoritmoIdentificacion(this.reportesService, this.http); // ---------------

    if(!identificacion.ChecarBan()){ // primero revisa que el dispositivo no este baneado
        // Revisa si el usuario es invitado o no
        if(!localStorage.getItem('TipoUsr')) {
          this.registrarForm.value.usuarios._id = '000000000000000000000000'; // Id de usuario invitado
          
        } else {
          this.registrarForm.value.usuarios._id = this.loginService.getUsuarioActual();
        }
        
        // SI ES REPLICA SE ENVIAN LOS DATOS PARA MODIFICAR EL REPORTE
        if(this.replica == true) {

          // SE INGRESA LA CREDIBILIDAD Y ID DEL USUARIO QUE VA A REPLICAR
          if(!identificacion.VerificarID(this.replicaId)){ // No replicar un reporte que ya hiciste // --------------- Quitar para prueba

            this.reportesService.replicarReporte(this.replicaId, this.registrarForm?.value).subscribe(
              async res => {
                Swal.fire({
                  title: 'Reporte replicado!',
                  text: 'Hemos recibido tu replica de un reporte ya existente',
                  icon: 'success',
                  confirmButtonText: 'Ok'
                });

                identificacion.AccederYGuardar(res.toString(), true);

                // CUANDO SE REPLICA UN REPORTE SE VA DIRECTO AL MAPA Y SE REFRESCA
                this.toggleFormReporte = false; // SE ESCONDE EL FORM DE DETALLES
                this.toggleDesactivarMapa = false; // SE ACTIVA EL MAPA
                this.ngOnInit();
              },
              err => {
                Swal.fire({
                  title: 'Oh no!',
                  text: 'Ocurrio un problema replicando el reporte',
                  icon: 'error',
                  confirmButtonText: 'Ok'
                });

                console.error(err);
              }
            );
          } // --------------- Quitar para prueba
        }



        // SI NO ES REPLICA ES REPORTE NUEVO
        else {
          if(this.registrarForm.value.comentario.length > 150) {
            this.comentarioLargo = true;
          }
          else {
            if(await identificacion.Identificacion(this.registrarForm?.value) == false){ // si pasa los algoritmos de validacion guarda el reporte ----------
              let temporal: boolean, idReporte: any, cachaMetodoFantasma: any, guardar = true
              // /* ------ // si quieres que no haga lo de checar fantasma quita el comentario de esta linea y la 543 para que se comente todo lo que esta adentro jaja
              // una vez que paso las validaciones de tiempo y distancia (paso 2 y 3) llama al metedo verificar fantasma
              cachaMetodoFantasma = await identificacion.VerificarFantasma()

              // dependiendo lo que retorne realiza o asigna
              if(cachaMetodoFantasma == 1){ // crea el reporte de forma normal sin conciderarlo fantasma
                this.registrarForm.value.fantasma = 0;
                temporal = false
                console.log(this.registrarForm.value)
              }else if(cachaMetodoFantasma == 3){ // si retorna 3 significa que se concidera reporte fantasma
                this.registrarForm.value.fantasma = this.fecha.getTime();
                console.log(this.registrarForm.value)
                temporal = true
              }else if(cachaMetodoFantasma == 4){ // significa que no se debe generar el cuarto reporte
                guardar = false
              }else if(cachaMetodoFantasma == false){ // significa que no se debe generar ningun reporte, lo decidio cancelar
                guardar = false
              }
              // */  // ------
              
              // this.registrarForm.value.fantasma = await identificacion.VerificarFantasma();
              // SE OBTIENEN LAS COORDENADAS DEL MARKER COLOCADO POR EL USUARIO
              const latitud = this.nuevoLatLng.lat();
              const longitud = this.nuevoLatLng.lng();

              // SE GUARDAN LA UBICACION, EL TIPO DE PROBLEMA Y EL ID DEL USUARIO
              this.registrarForm.value.ubicacion.latitud = latitud;
              this.registrarForm.value.ubicacion.longitud = longitud;
              this.registrarForm.value.tipoProblema = this.nuevoProblema;

              if(guardar){  // simpre va a entrar a menos que sea en 4to reporte en menos de 24 horas
                this.reportesService.createReporte(this.registrarForm.value).subscribe(
                  async res => {
                    let correcto = true;
                    let idReporte = res

                      if(this.selectedImage?.name) {
                        const formData = new FormData;
                        formData.append('imagen', "prueba");
                        formData.append('imagenReporte', this.file?.nativeElement.files[0]);
          
                          this.reportesService.editImagenReporte(res.toString(), formData).subscribe(
                            res => {
                              correcto = true;
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
                            });
                      }
                    
                    console.log(correcto)
                    if(correcto) {
                      console.log(res.toString())
                      identificacion.AccederYGuardar(res.toString(), true); // si se creo el reporte con exito guarda su id en el ls del usuario
                      
                        if(temporal){ // en caso de que el reporte sea considerado fantasma se lanza un settimeout para eliminarlo en 24 horas (si no lo reporto otro usr)
                          console.log("Entro a temporal")
                              setTimeout( () => {
                                console.log("Entro al settimeout")
                                console.log(idReporte)
                                  this.reportesService.eliminarFantasma(idReporte).subscribe(
                                      res =>{
                                        console.log("Fantasma excedio el tiempo de espera y fue eliminado")
                                        console.log(res)
                                      },
                                      err =>{
                                        console.log("Error al eliminar el reporte fantasma")
                                  })
                              }, 60000)
                        }
                          
                      this.ngOnInit();
                      // CUANDO SE CREA UN REPORTE SE VA DIRECTO AL MAPA Y SE REFRESCA
                      this.toggleFormReporte = false; // SE ESCONDE EL FORM DE DETALLES
                      this.toggleDesactivarMapa = false; // SE ACTIVA EL MAPA
                    }
                  },
                  err => {
                    Swal.fire({
                      title: 'Oh no!',
                      text: 'Ocurrio un problema enviando tu reporte',
                      icon: 'error',
                      confirmButtonText: 'Ok'
                    });
                    console.error(err);
                  }
                );
              }
              
            } // ----------
          }
        }
    }

  }
}
