import { Component, OnInit } from '@angular/core';
import { Reporte } from 'src/app/models/reporte';
import { ReportesService } from 'src/app/services/reportes/reportes.service';
import Swal from 'sweetalert2';
import { AlgoritmoUrgencia } from '../../mapa-reportes/algoritmo-urgencia';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { Notificacion } from 'src/app/models/notificacion';
import { NotificacionesService } from 'src/app/services/notificaciones/notificaciones.service';
import { UsuarioComunService } from 'src/app/services/usuario-comun/usuario-comun.service';
import { FormBuilder, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Loader } from '@googlemaps/js-api-loader';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-tabla-en-proceso',
  templateUrl: './tabla-en-proceso.component.html',
  styleUrls: ['./tabla-en-proceso.component.css']
})
export class TablaEnProcesoComponent implements OnInit {

  reportes: any = []
  guardarReportes: any = []
  guardarCronicos: any = []
  contadorCLick = 0

  usuariosInfo: any;

  busqueda = ""; // Pipe

  submitted = false;

  nuevoLatLng: any;
  ubicacion1: any
  ubicacion2: any
  nuevoProblema: string = "";

  public orden: string[] = ['Más reciente', 'Más antiguo', 'Más urgente', 'Menos urgente'];
  public seleccionado!: "ninguno";
  public filtros: string[] = ['Tipo de problema'];
  public nombresMunicipios: string[] = ["Municipio", "Zapopan", "Guadalajara", "Tlaquepaque", "Tonala", "Tlajomulco"]
  public meses: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  public mesesBase: string[] = ['Enero ', 'Febrero ', 'Marzo ', 'Abril ', 'Mayo ', 'Junio ', 'Julio ', 'Agosto ', 'Septiembre ', 'Octubre ', 'Noviembre ', 'Diciembre '];
  public otroDeMeses: string[] = [' Enero', ' Febrero', ' Marzo', ' Abril', ' Mayo', ' Junio', ' Julio', ' Agosto', ' Septiembre', ' Octubre', ' Noviembre', ' Diciembre'];
  public anos: string[] = ['2022', '2021', '2020', '2019'];
  public anosCambio: string[] = ['2022 ', '2021 ', '2020 ', '2019 '];
  public otroDeAnos: string[] = [' 2022 ', ' 2021 ', ' 2020 ', ' 2019 '];

  fecha = new Date()
  mesBase: any
  anoBase: any

  prueba: any;

  urlImagen: string = "";
  fechaMayor = false;

  tiempoMouseDown = false;

  constructor(public reportesService: ReportesService,
              public notificacionesService: NotificacionesService,
              public usuarioComunService: UsuarioComunService,
              private formBuilder: FormBuilder,
              private http: HttpClient,
              private router: Router,
              private modal:NgbModal
            ) {}

  ngOnInit(): void {
    this.mesBase = this.fecha.getMonth() + 1
    // this.anoBase = this.fecha.getFullYear().toString()
    this.anoBase = this.fecha.getFullYear()

    this.ReiniciarSelectMes()

    try {
      localStorage.getItem("Usr");
      // this.getReportes();
      this.getReportesXmes()
      this.filtradoTipoSegunUsr();
      
    } catch (error) {
      console.error(error);
    }
  }


  
  async Ordenamientos(orden:any): Promise<void> {
    let cont = 0, aux;
    let algoritmoUrgencia = new AlgoritmoUrgencia(this.reportesService);

    switch (orden) {
      case "Más urgente":
        cont = 0;

        for(let reporte of this.guardarReportes) {  // calcula la urgencia de cada reporte y la guarda en un arreglo junto su id
          reporte.urgencia = await algoritmoUrgencia.PuntosUrgencia(reporte._id!);
        }

        aux = this.reportes;
        let ordenados = aux.sort(function (a: any, b: any){
          return (b.urgencia - a.urgencia)
        });

        this.reportes = []
        setTimeout( ()=> {
          this.reportes = ordenados
        },1)

      break;
      case "Menos urgente":
        cont = 0;
        for(let reporte of this.guardarReportes) {  // calcula la urgencia de cada reporte y la guarda en un arreglo junto su id
          reporte.urgencia = await algoritmoUrgencia.PuntosUrgencia(reporte._id!);
        }

        aux = this.reportes;
        let patin = aux.sort(function (a: any, b: any){
          return (a.urgencia - b.urgencia)
        });
        this.reportes = []
        setTimeout( ()=> {
          this.reportes = patin
        },1)

      break;
      case "Más reciente":
        cont = 0;

        for(let reporte of this.guardarReportes) {
            reporte.urgencia = await algoritmoUrgencia.PuntosUrgencia(reporte._id!);
        }

        let ordenados2 = this.reportes;
        aux = ordenados2[0];

        for(let i = ordenados2.length-1; i > 0; i--) {
          for(let j = 0; j < i; j++) {
            if(new Date(ordenados2[j].fechaCreacion).getTime() < new Date(ordenados2[j+1].fechaCreacion).getTime()) {
              aux = ordenados2[j+1];
              ordenados2[j+1] = ordenados2[j];
              ordenados2[j] = aux;
            }
          }
        }

        this.reportes = []
        setTimeout( ()=> {
          this.reportes = ordenados2
        },1)
       break;
      case "Más antiguo":
        cont = 0;

        for(let reporte of this.guardarReportes) {
            reporte.urgencia = await algoritmoUrgencia.PuntosUrgencia(reporte._id!);
        }

        let ordenados3 = this.reportes;
        aux = ordenados3[0];

        for(let i = ordenados3.length-1; i > 0; i--) {
          for(let j = 0; j < i; j++) {
            if(new Date(ordenados3[j].fechaCreacion).getTime() > new Date(ordenados3[j+1].fechaCreacion).getTime()) {
              aux = ordenados3[j+1];
              ordenados3[j+1] = ordenados3[j];
              ordenados3[j] = aux;
            }
          }
        }

        this.reportes = []
        setTimeout( ()=> {
          this.reportes = ordenados3
        },1)
      break;
      default:
        console.log("Opción no valida")
        break;
    }

  }

  async FiltradosTipo(filtro:any): Promise<void> {
    let auxiliarFiltro: any = []

    if(filtro == "Tipo de problema"){
      this.reportes = []
      this.reportes = this.guardarReportes
    }else{
      this.reportes = []
      this.guardarReportes.forEach((element: any) => {
        if(element.tipoProblema == filtro){
          auxiliarFiltro.push(element)
        }
      });
      this.reportes = auxiliarFiltro
    }

  }

  async FiltradosMunicipios(filtro:any): Promise<void> {
    console.log(filtro)

  }

  async FiltradosCronicos(filtro:any): Promise<void> {
    // console.log(filtro)
    let element = <HTMLInputElement> document.getElementById("filtradoCronicos");
    let isChecked = element.checked;

    
    if(isChecked){
      this.guardarCronicos = this.reportes
      let auxiliarCronicos = this.reportes
      let auxiliarFiltrados: any = []
      this.reportes = []

      auxiliarCronicos.forEach((element: any) => {
        if(element.cronico){
          auxiliarFiltrados.push(element)
        }
      });
      this.reportes = auxiliarFiltrados
    }else{
      this.reportes = []
      this.reportes = this.guardarCronicos
    }

  }


  AbrirMapa(mapaFiltrado: any){
    this.mapa()
    this.modal.open(mapaFiltrado,{size:'lg',centered:true});
  }


  async mesSeleccionado(m:any): Promise<void>{
    this.mesBase = m;
    this.fechaMayor = false;

    if(this.anoBase == this.fecha.getFullYear()) {
      let indiceMes = this.meses.indexOf(m);
      
      if(indiceMes == -1) {
        indiceMes = this.mesesBase.indexOf(m);
        if(indiceMes == -1) {
          indiceMes = this.otroDeMeses.indexOf(m);
        }
      }
      
      if(indiceMes > this.fecha.getMonth()) {
        this.mesBase = this.meses[this.fecha.getMonth()];
        this.fechaMayor = true;
      }
    }

    this.getReportesXmes();
  }
  
  async anoSeleccionado(a:any): Promise<void>{
    this.anoBase = a;
    this.fechaMayor = false;

    if(this.anoBase == this.fecha.getFullYear()) {
      let indiceMes = this.meses.indexOf(this.mesBase);
      
      if(indiceMes == -1) {
        indiceMes = this.mesesBase.indexOf(this.mesBase);
        if(indiceMes == -1) {
          indiceMes = this.otroDeMeses.indexOf(this.mesBase);
        }
      }
      
      if(indiceMes > this.fecha.getMonth()) {
        this.mesBase = this.meses[this.fecha.getMonth()];
        this.fechaMayor = true;
      }
    }

    this.getReportesXmes();
  }

  openCentrado(contenido: any, reporte: any){
    this.reportesService.getInfoUsuariosReporte(reporte.usuarios).subscribe(
      async res => {
          this.usuariosInfo = res;
          for(let i = 0; i < (reporte.usuarios.length - this.usuariosInfo.length);  i++){
            this.usuariosInfo.push({
              _id: "Usuario Anonimo",
              nombreUsuario: "---",
              reputacion: "---"
            })
          }
          if(reporte.imagen)
            this.urlImagen = "http://localhost:4000/" + reporte.imagen;
          else
            this.urlImagen = "";
      }, 
      err => {
          console.log('No se pudo cargar los reportes');
          console.error(err);
      }
    );

    this.modal.open(contenido,{centered:true});
  }


  
  getReportesXmes() {
    let algoritmoUrgencia = new AlgoritmoUrgencia(this.reportesService);
    let estado = "En proceso"

    this.reportesService.getReportesXMes(this.mesBase, this.anoBase, estado).subscribe(
      async res => {
          this.guardarReportes = res
          for(let reporte of this.guardarReportes) {  // calcula la urgencia de cada reporte y la guarda en un arreglo junto su id
            reporte.urgencia = await algoritmoUrgencia.PuntosUrgencia(reporte._id!);
          }
          
          let aux: any = [];
          let urgentes: any = [];
          let noUrgentes = this.guardarReportes;

          for(let i = 0; i < noUrgentes.length; i++) {
            if(await algoritmoUrgencia.Urgente(noUrgentes[i]._id!))
              urgentes.push(noUrgentes.splice(i, 1)[0]);
          }

          urgentes = urgentes.sort(function (a: any, b: any){
            return (b.urgencia - a.urgencia)
          });
        
          for(let urgente of urgentes) {
            aux.push(urgente);
          }

          for(let noUrgente of noUrgentes) {
            aux.push(noUrgente);
          }

          this.reportes = aux;
      }, 
      err => {
          console.log('No se pudo cargar los reportes');
          console.error(err);
    });
  }


  getReportes() {
    let algoritmoUrgencia = new AlgoritmoUrgencia(this.reportesService);
    let estado = "En proceso$"+ localStorage.getItem("Usr");
    
    this.reportesService.getEstadoReportes(estado).subscribe(
      async res => {
          this.reportes = <Reporte[]>res;

          for(let reporte of this.reportes) {
            console.log(reporte);
          }
      }, 
      err => {
          console.log('No se pudo cargar los reportes');
          console.error(err);
      }
    );
  }

  cambioSolucionado(reporte: Reporte) {
    Swal.fire({
      title: 'Seguro?',
      text: "Se cambiará el estado del reporte a 'Solucionado'",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, aceptar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        let correcto = true;
        let hoy = new Date(Date.now());
        reporte.fechaSolucion = hoy;
        reporte.estado = "Solucionado";
        
        this.reportesService.editReporte(reporte)?.subscribe(
          res => {
            let notificacion: Notificacion = {
                tipoProblema: reporte.tipoProblema,
                folioReporte: reporte._id,
                tipoNotificacion: 'estadoSolucionado',
                usuarios: reporte.usuarios
              }

            this.notificacionesService.createNotificacion(notificacion).subscribe(
              res => {
                const reputacionUsr = {
                  reputacion: 1,
                  usuarios: reporte.usuarios
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
          reporte.estado = "En proceso";
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

  cambioDenegado(reporte: Reporte) {
    Swal.fire({
      title: 'Seguro?',
      text: "Se cambiará el estado del reporte a 'Denegado'",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, aceptar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        let correcto = true;
        reporte.estado = "Denegado";
        
        this.reportesService.editReporte(reporte)?.subscribe(
          res => {
            let notificacion: Notificacion = {
                tipoProblema: reporte.tipoProblema,
                folioReporte: reporte._id,
                tipoNotificacion: 'estadoDenegado',
                usuarios: reporte.usuarios
              }

            this.notificacionesService.createNotificacion(notificacion).subscribe(
              res => {
                const reputacionUsr = {
                  reputacion: -1,
                  usuarios: reporte.usuarios
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
          reporte.estado = "En proceso";
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


  
  filtradoTipoSegunUsr(){
    let institucionUsr = localStorage.getItem('Usr')

    if(institucionUsr!.substr(0,2) == "SP"){
      this.filtros.push("Inundación")
      this.filtros.push("Fuga de agua")
      this.filtros.push("Falta de alcantarilla")
      this.filtros.push("Alcantarilla obstruida")   
    }
    if(institucionUsr!.substr(0,2) == "CF"){
      this.filtros.push("Alumbrado")
      this.filtros.push("Cables caídos")
    }
    if(institucionUsr!.substr(0,2) == "BM"){
      this.filtros.push("Incendio")
    }
    if(institucionUsr!.substr(0,2) == "PC"){
      this.filtros.push("Árbol caído")
      this.filtros.push("Escombros tirados")
    }
    if(institucionUsr!.substr(0,2) == "SM"){
      this.filtros.push("Vehículo abandonado")
    }
    if(institucionUsr!.substr(0,2) == "IF"){
      this.filtros.push("Socavón")
    }
    if(institucionUsr!.substr(0,2) == "Ad"){
      this.filtros.push("Inundación")
      this.filtros.push("Fuga de agua")
      this.filtros.push("Falta de alcantarilla")
      this.filtros.push("Alcantarilla obstruida")   
      this.filtros.push("Alumbrado")
      this.filtros.push("Cables caídos")
      this.filtros.push("Incendio")
      this.filtros.push("Árbol caído")
      this.filtros.push("Escombros tirados")
      this.filtros.push("Vehículo abandonado")
      this.filtros.push("Socavón")
      }
    }


    mapa() {
      // COORDENADAS DEL USUARIO PARA CENTRAR EL MAPA
      let longitud: number =  -103.3479102;
      let latitud: number = 20.6763989;
      this.contadorCLick = 0
    
      // DECLARAR LOADER DEL MAPA CON LA APIKEY
      let loader = new Loader({
        // apiKey: 'AIzaSyAYN-jmRSHPR78rT0l1na0XchXlJT7_sDw'
        apiKey: ''
      });

      loader.load().then(() => {
        const map = new google.maps.Map(document.getElementById("mapa")!, {
          center: { lat: latitud, lng: longitud},
          disableDefaultUI: true,
          zoomControl: true,
          zoom: 12,
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

        // Se llama al método que muestra todos los reportes que hay en la lista para el filtrado especial
        this.reportesExistentes(map);

        let X1 = 0, X2 = 0, Y1 = 0, Y2 = 0;
        let marco1 = document.getElementById("marco1");
        let marco2 = document.getElementById("marco2");
        let diferenciax = 0, diferenciaY = 0;

        let origenx = marco2?.getBoundingClientRect().x
        let origeny = marco2?.getBoundingClientRect().y
    
        google.maps.event.addListener(map, "click", (event: any) => {
          this.nuevoLatLng = event.latLng; // SE OBTIENE LA UBICACIÓN SELECCIONADA

            if(this.contadorCLick == 0){
              X1 = event.domEvent.offsetX 
              Y1 = event.domEvent.offsetY 
              this.contadorCLick++;
              this.ubicacion1 = event.latLng; // SE OBTIENE LA UBICACIÓN SELECCIONADA

              marco2!.style.marginLeft = (X1 - origenx!).toString()+"px"
              marco2!.style.marginTop = (Y1 - origeny! - 25).toString()+"px"
              // marco2!.style.marginTop = (Y1 - origeny!).toString()+"px"
              console.log("diferencia en x: ", X1, " - ", origenx, " = ", (X1 - origenx!));
              console.log("diferencia en y: ", Y1, " - ", origeny, " = ", (Y1 - origeny!));
              // marco2!.style.top = (X1 - origenx!).toString()+"px"
              // marco2!.style.left = (Y1 - origeny!).toString()+"px"
            }else if(this.contadorCLick == 1){
              X2 = event.domEvent.offsetX
              Y2 = event.domEvent.offsetY
              this.ubicacion2 = event.latLng; 

              // el tamaño del div (marco) es dictado por la diferencia que hay entre el primer click y el segundo
              marco2!.style.width = (X2 - X1).toString()+"px"
              marco2!.style.height = (Y2 - Y1).toString()+"px"

              // marco1!.style.width = (X2 - X1).toString()+"px"
              // marco1!.style.height = (Y2 - Y1).toString()+"px"
              marco2!.style.zIndex = "1000";
              
              this.contadorCLick++;
            }else{
              X2 = event.domEvent.clientX
              Y2 = event.domEvent.clientY
              marco2!.style.width = "0px"
              marco2!.style.height = "0px"
              marco2!.style.width = (X2 - X1).toString()+"px"
              marco2!.style.height = (Y2 - Y1).toString()+"px"
              this.ubicacion2 = event.latLng; 

              this.contadorCLick--
            }
        })
      });
    }

      // AGREGAR LOS MARCADORES DE LOS REPORTES
  reportesExistentes(map: google.maps.Map) {

    // LOS COLORES DE LOS MARCADORES DE CADA TIPO DE PROBLEMA
    const markerAlumbrado = "#ccc547";
    const markerAgua = "#6cb7ce";
    const markerObstruccion = "#864109";
    const markerIncendio = "#fd8037";
        
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
    }
  }


    filtradoMapa(){
      let marco2 = document.getElementById("marco2");
      let auxiliarMapa: any = []
      let longitud1 = this.ubicacion1.lng()
      let latitud1 = this.ubicacion1.lat()
      let longitud2 = this.ubicacion2.lng()
      let latitud2 = this.ubicacion2.lat()

      marco2!.style.marginLeft = "0px"
      marco2!.style.marginTop = "0px"

      this.guardarReportes.forEach((element: any) => {
          if(element.ubicacion.longitud > longitud1 && element.ubicacion.longitud < longitud2){
            if(element.ubicacion.latitud < this.ubicacion1.lat() && element.ubicacion.latitud > this.ubicacion2.lat()){
              auxiliarMapa.push(element)
              console.log(element)
            }
          }
      });

      this.reportes = []
      this.reportes = auxiliarMapa

      console.log(longitud1, latitud1, longitud2, latitud2)
      
      this.modal.dismissAll()
    }


    
  ReiniciarSelectMes(){
    this.mesesBase = this.otroDeMeses
    this.otroDeMeses = this.meses
    // this.anoBase = this.otroDeAnos
    this.otroDeAnos = this.anos

    let ms = this.mesesBase
    let mesActualNombre = this.mesesBase[this.fecha.getMonth()]
    let mesActualNumero = this.fecha.getMonth()
      
    ms.splice(mesActualNumero, 1)

    ms.splice(0,0,mesActualNombre)

    this.prueba = ms
  }


  Descargar(reporte: any){
    const doc = new jsPDF('p', 'pt', 'a4');
    let elementHTML = document.getElementById("ContenedorDescarga");
    html2canvas(elementHTML!).then(canvas => {
    const imgWidth = 280; // your own stuff to calc the format you want
    const imgHeight = canvas.height * imgWidth / canvas.width; // your own stuff to calc the format you want
    const contentDataURL = canvas.toDataURL('image/png');
    doc.addImage(contentDataURL, 'JPEG', 20, 20, imgWidth, imgHeight, undefined, 'FAST');
    doc.save(`Reporte_${reporte._id}.pdf`);
    })
  }

  Pinnear(numero: Number, _id: String) {
    if(numero == 1) {
      this.tiempoMouseDown = false;
      setTimeout(() => {
        this.tiempoMouseDown = true;
      }, 2000);
    }
    else {
      if(this.tiempoMouseDown) {
        console.log(this.reportes)
        let index = 0;
        let aux: any = [];
        let noPinneados = this.reportes;

        for(let i = 0; i < noPinneados.length; i++) {
          if(noPinneados[i]._id === _id)
              index = i;
        }

        let pinneado: any = noPinneados.splice(index, 1)[0];

        aux.push(pinneado);

        for(let noPinneado of noPinneados) {
          aux.push(noPinneado);
        }

        this.reportes = [];

        this.reportes = aux;     
      }
    }
  }
}
