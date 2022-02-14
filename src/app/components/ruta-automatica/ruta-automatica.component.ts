import { NodeWithI18n, ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormControl } from '@angular/forms';
import { Loader } from '@googlemaps/js-api-loader';
import { Reporte } from 'src/app/models/reporte';
import { ReportesService } from 'src/app/services/reportes/reportes.service';
import { AlgoritmoUrgencia } from "src/app/components/mapa-reportes/algoritmo-urgencia";
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http'
import { CrearRuta } from "src/app/components/ruta-automatica/crear-ruta";
import { Notificacion } from 'src/app/models/notificacion';
import { NotificacionesService } from 'src/app/services/notificaciones/notificaciones.service';
import { UsuarioComunService } from 'src/app/services/usuario-comun/usuario-comun.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-ruta-automatica',
  templateUrl: './ruta-automatica.component.html',
  styleUrls: ['./ruta-automatica.component.css']
})
export class RutaAutomaticaComponent implements OnInit {

  toggleDesactivarMapa: boolean = true;
  toggleCrearRuta: boolean = true;
  toggleFormRuta: boolean = false;
  toggleOpcionesRuta: boolean = false;
  toggleDetallesRuta: boolean = false;
  toggleSaltarReporte: boolean = false;
  toggleTerminarRuta: boolean = false;
  toggleOtraInstitucion: boolean = false;

  finJornada = new FormControl();

  longitud: number =  -103.3479102;
  latitud: number = 20.6763989;

  fecha = new Date()
  // desactivado = false

  reporte: Reporte = {
    ubicacion: {
        latitud: 0,
        longitud: 0
    },
    tipoProblema: "Generico",
    credibilidad: 0,
    usuarios: [{
        _id: ""
    }],
    urgenciaOriginal: 0,
    fechaCreacion: undefined
  };
  // ("2022-01-01T00:00:00Z")
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

  urgenciaReporte = 0;

  constructor(
              public reportesService: ReportesService,
              public notificacionesService: NotificacionesService,
              public usuarioComunService: UsuarioComunService,
              private http: HttpClient,
              private modal:NgbModal
            ) { }


  ngOnInit(): void {
    // this.reverseGeocoding()
      this.mapa();
    
      let urgencia = new AlgoritmoUrgencia(this.reportesService);
    this.reportesService.disparadorReporteAsignado.subscribe(async res => {
        this.reporte = res;
        this.urgenciaReporte = await urgencia.PuntosUrgencia(this.reporte._id!);

        console.log(res);
      },
      err => {
        console.error(err);
      })

      this.reportesService.disparadorDesactivarBotones.subscribe(res => {
        console.log(res);
        if(res == "Desactivar")
          this.DeshabilitarBotones();
      },
      err => {
        console.error(err);
      })
    
  }



  async mapa() {
    // CONSEGUIR COORDENADAS DEL USUARIO
    if(navigator.geolocation) {
      let prueba = navigator.geolocation.getCurrentPosition(position => {
        this.latitud = position.coords.latitude;
        this.longitud = position.coords.longitude;
      }, function(err){
        console.error(err);
      }, {enableHighAccuracy: true});
    }
    
    // DECLARAR LOADER DEL MAPA CON LA APIKEY
    let loader = new Loader({
      apiKey: 'AIzaSyAYN-jmRSHPR78rT0l1na0XchXlJT7_sDw'
      // apiKey: ''
    });

    setTimeout(() => {
    // SE CARGA EL MAPA CENTRADO EN LA UBICACION DEL USUARIO
    loader.load().then(() => {
      const map = new google.maps.Map(document.getElementById("mapa")!, {
        center: { lat: this.latitud, lng: this.longitud},
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
    });

  }, 100);

    if(localStorage.getItem("FinJornada")){
      this.toggleDesactivarMapa = false;
      this.toggleCrearRuta = false;
      let des = localStorage.getItem("desactivado")
      console.log(des)
      if(des == "true"){
        this.DeshabilitarBotones();
      }else{
        this.crearRuta();
      }
    }

  }


  ObtenerUbicacion(){
  }


  formRuta() {
    this.toggleCrearRuta = false;
    this.toggleFormRuta = true;
  }


  DeshabilitarBotones(){
    this.toggleCrearRuta = false;
    this.toggleFormRuta = false;
    this.toggleOpcionesRuta = false;
    this.toggleDetallesRuta = false;
    this.toggleSaltarReporte = false;
    this.toggleTerminarRuta = false;
    this.toggleOtraInstitucion = false;
  }


  async crearRuta() {
    let hoy = new Date;
    let horaValida = true;
    let fin;

    //si existe el item entonces va a hacer la ruta luego luego
    // en caso contrario sale el form de jornada
    if(!localStorage.getItem("FinJornada")){
              if(this.finJornada.value == null) {
                horaValida = false;
              }
              else {
                fin = this.finJornada.value.split(":");

                if(hoy.getHours() == fin[0]) {
                  if(hoy.getMinutes() >= fin[1])
                    horaValida = false;
                }
                else if(hoy.getHours() > fin[0])
                  horaValida = false;
              }
    }


    if(horaValida == false) {
      Swal.fire({
        title: 'Oh no!',
        text: 'La hora ingresada no es válida',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
    }
    else {
      if(!localStorage.getItem("FinJornada")){
        let durJornada = Math.abs((hoy.getHours() - fin[0])*60 + (hoy.getMinutes() - fin[1]))*60000;
        console.log("ENTRO AL IF")
        this.finTiempoJornada(durJornada);
      }

      this.toggleFormRuta = false;
      this.toggleDesactivarMapa = false;
      this.toggleOpcionesRuta = true;

      let ruta = new CrearRuta(this.reportesService, this.http);
      await ruta.CrearRuta();

      // await this.reportesService.getReporteAsignado().subscribe(
      //   async res => {
      //       console.log(".........");
      //       console.log(res)
      //       this.reporte = res[0];
      //       console.log(this.reporte._id);
      //       console.log(".........");

      //       // Obtenemos la urgencia del problema
      //       let urgencia = new AlgoritmoUrgencia(this.reportesService);
      //       this.urgenciaReporte = await urgencia.PuntosUrgencia(this.reporte._id!);
      //   },
      //   err => {
      //       console.warn('error al obtener reporte ', err);
      //   }  );


    }
  }





  finTiempoJornada(durJornada: number) {
    localStorage.removeItem("DiferenciaTiempo")
    localStorage.setItem("FinJornada", durJornada.toString())
    let diferencias = [durJornada, this.fecha.getTime()]
    localStorage.setItem("DiferenciaTiempo", JSON.stringify(diferencias))
    
    console.log("---------------------")
    console.log(durJornada)
    setTimeout(() => {
      localStorage.removeItem("FinJornada")
      localStorage.removeItem("desactivado")
      Swal.fire({
        title: 'Tiempo de jornada terminado',
        text: "Se llegó al final de la jornada, desea salir y guardar el reporte para la siguiente jornada? En caso de continuar con el problema actual no se asignarán más reportes al terminar.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, salir!',
        cancelButtonText: 'No, continuar!'
      }).then((result) => {
        if(result.isConfirmed) {
          
          Swal.fire({
            title: 'Terminó su jornada!',
            text: 'Se ha guardado el último reporte de la ruta para su próxima jornada.',
            icon: 'success',
            confirmButtonText: 'Ok'
          }).then(() => {
            window.location.reload();
          });
        }
        else {
          localStorage.removeItem("FinJornada")
          Swal.fire({
            title: 'Continúa con el reporte actual!',
            text: 'No se le asignarán más reportes al terminar con este último.',
            icon: 'success',
            confirmButtonText: 'Ok'
          });
        }
      });
    }, durJornada);
  }


  terminarRutaModalOpen(terminarRutaModal: any){
    this.modal.open(terminarRutaModal,{size:'sl',centered:true});
  }

  saltarRutaModalOpen(saltarRutaModal: any){
    this.modal.open(saltarRutaModal,{size:'sl',centered:true});
  }



  saltarReporte() {
    Swal.fire({
      title: 'Saltar reporte?',
      text: "Se asignará un nuevo reporte.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if(result.isConfirmed) {
        Swal.fire({
          title: 'Se saltó el reporte!',
          text: 'Se asignará un nuevo reporte.',
          icon: 'success',
          confirmButtonText: 'Ok'
        });

        this.reportesService.saltarReporte(this.reporte._id).subscribe(
          res =>{
            console.log(res)
            localStorage.setItem("salto", this.reporte._id!)
            window.location.reload();
          }, error =>{
            console.log("Error al saltar reporte")
          })

        this.toggleSaltarReporte = false;
        this.toggleDetallesRuta = false;
        this.toggleDesactivarMapa = false;
        this.toggleOpcionesRuta = true;
      }
    });
  }

  terminarRuta() {
    Swal.fire({
      title: 'Terminar ruta?',
      text: "Se guardará el reporte actual para su siguiente jornada.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if(result.isConfirmed) {
        Swal.fire({
          title: 'Terminó su jornada!',
          text: 'Se ha guardado el último reporte de la ruta para su próxima jornada.',
          icon: 'success',
          confirmButtonText: 'Ok'
        }).then(() => {
          localStorage.setItem("desactivado", "true");
          setTimeout(() => {
            // localStorage.removeItem("FinJornada")
            console.log("eliminar")
            localStorage.removeItem("desactivado")
          }, 30000) //600000
          console.log("Paso el settimeout")

          this.reportesService.terminoRutaRepentino(this.reporte._id).subscribe(
            res =>{
              console.log(res)
            }, error =>{
              console.log("Error al saltar reporte: ", error)
            })

          this.ngOnInit();
        });
      }
    });
  }



  formDetallesRuta() {
    this.toggleOpcionesRuta = false;
    this.toggleDetallesRuta = true;
  }

  formTerminarRuta() {
    this.toggleDesactivarMapa = true;
    this.toggleOpcionesRuta = false;
    this.toggleTerminarRuta = true;
  }

  

  cambioSolucionado() {
    Swal.fire({
      title: 'Reporte solucionado?',
      text: "Se cambiará el estado del reporte a solucionado",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        let correcto = true;
        this.reporte.estado = "Solucionado";
        let hoy = new Date(Date.now());
        this.reporte.fechaSolucion = hoy;

        this.reportesService.editReporte(this.reporte)?.subscribe(
          res => {
            let notificacion: Notificacion = {
                tipoProblema: this.reporte.tipoProblema,
                folioReporte: this.reporte._id,
                tipoNotificacion: 'estadoSolucionado',
                usuarios: this.reporte.usuarios
              }

            this.notificacionesService.createNotificacion(notificacion).subscribe(
              res => {
                const reputacionUsr = {
                  reputacion: 1,
                  usuarios: this.reporte.usuarios
                }

                this.usuarioComunService.reputacionUsuario(reputacionUsr).subscribe(
                  res => {
                    Swal.fire({
                      title: 'Solucionado!',
                      text: "Se cambió el estado del reporte a 'Solucionado'",
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
                    correcto = false;
                    console.error(err);
                  }
                );
              },
              err => {
                correcto = false;
                console.error(err);
              }
            );
          },
          err => {
            correcto = false;
            console.error(err);
          }
        );

        if(!correcto){
          this.reporte.estado = "En proceso";
            Swal.fire({
              title: 'Oh no!',
              text: 'Ocurrio un problema cambiando el estado del reporte',
              icon: 'error',
              confirmButtonText: 'Ok'
            });
        }
      }
    });
  }

  cambioDenegado() {
    Swal.fire({
      title: 'Reporte denegado?',
      text: "Se cambiará el estado del reporte a denegado",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        let correcto = true;
        this.reporte.estado = "Denegado";

        this.reportesService.editReporte(this.reporte)?.subscribe(
          res => {
            let notificacion: Notificacion = {
                tipoProblema: this.reporte.tipoProblema,
                folioReporte: this.reporte._id,
                tipoNotificacion: 'estadoDenegado',
                usuarios: this.reporte.usuarios
              }

            this.notificacionesService.createNotificacion(notificacion).subscribe(
              res => {
                const reputacionUsr = {
                  reputacion: 1,
                  usuarios: this.reporte.usuarios
                }

                this.usuarioComunService.reputacionUsuario(reputacionUsr).subscribe(
                  res => {
                    Swal.fire({
                      title: 'Denegado!',
                      text: "Se cambió el estado del reporte a 'Denegado'",
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
                    correcto = false;
                    console.error(err);
                  }
                );
              },
              err => {
                correcto = false;
                console.error(err);
              }
            );
          },
          err => {
            correcto = false;
            console.error(err);
          }
        );

        if(!correcto){
          this.reporte.estado = "En proceso";
            Swal.fire({
              title: 'Oh no!',
              text: 'Ocurrio un problema cambiando el estado del reporte',
              icon: 'error',
              confirmButtonText: 'Ok'
            });
        }
      }
    });
  }



  otraInstitucion(tipoProblema: string) {
    Swal.fire({
      title: 'Enviar reporte?',
      text: "Se enviará este reporte a otra institución",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if(result.isConfirmed) {
        console.log("Otra institucion:");
        console.log(this.reporte._id);
        console.log("Tipo de problema nuevo: " + tipoProblema);

        this.reportesService.reasignarReporte(this.reporte._id, tipoProblema).subscribe(
          res => {
            Swal.fire({
              title: 'Reporte reasignado!',
              text: 'Se ha enviado este reporte a otra institución',
              icon: 'success',
              confirmButtonText: 'Ok'
            });
    
            this.toggleOtraInstitucion = false;
            this.toggleDesactivarMapa = false;
            this.toggleDetallesRuta = true;
          },
          err => {
              console.warn('error al reasignar reporte ', err);
          }
        );
      }
    });
  }

  refuerzos() {
    console.log("URGENCIA:", this.urgenciaReporte)
    Swal.fire({
      title: 'Pedir refuerzos?',
      text: "Se solicitará la ayuda de otra cuadrilla",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si!',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if(result.isConfirmed) {

        const urgencia = new AlgoritmoUrgencia(this.reportesService);
        const masUrgente = await urgencia.MasUrgente();
        
        const datos = this.reporte._id + "$" + masUrgente + "$" + this.urgenciaReporte;

        this.reportesService.refuerzoReporte(datos).subscribe(
          res => {
            Swal.fire({
              title: 'Refuerzos llamados!',
              text: 'Se ha solicitado otra cuadrilla a este problema',
              icon: 'success',
              confirmButtonText: 'Ok'
            });
    
            this.toggleOtraInstitucion = false;
            this.toggleDesactivarMapa = false;
            this.toggleDetallesRuta = true;
          },
          err => {
              console.warn('error al pedir el refuerzo del reporte ', err);
          }
        );
      };
    })
  }


  reverseGeocoding(){
    this.reportesService.reverseGeocoding().subscribe(
      res => {
        console.log(res)
      },
      err => {
          console.warn('error al hacer el geocoding ', err);
      }
    );
  }


}
