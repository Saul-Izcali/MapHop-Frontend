import { Component, OnInit } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';
import { Reporte } from 'src/app/models/reporte';
import { ReportesService } from 'src/app/services/reportes/reportes.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mapa-solucionados',
  templateUrl: './mapa-solucionados.component.html',
  styleUrls: ['./mapa-solucionados.component.css']
})
export class MapaSolucionadosComponent implements OnInit {

  // COORDENADAS Y TIPO DEL NUEVO REPORTE EN DONDE SE COLOCÓ EL MARKER
  nuevoLatLng: any;
  nuevoProblema: string = "";

  // ARREGLO CON LOS REPORTES SOLUCIONADOS
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

  reportesFiltrados: Reporte[] = [{
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

  reporteSeleccionado: Reporte = {
    ubicacion: {
      latitud: 0,
      longitud: 0
    },
    tipoProblema: "",
    credibilidad: 0,
    usuarios: [{
      _id: ""
    }]
  };

  vecesReportado = 0;

  toggleInfoReporte: Boolean = false;
  toggleDesactivarMapa: Boolean = false;
  toggleDesactivarSelects: Boolean = false;

  constructor(public reportesService: ReportesService) { }

  public meses: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  public anos: string[] = ['2022', '2021', '2020', '2019'];

  fecha = new Date();
  mesBase = this.fecha.getMonth()+1;
  anoBase = this.fecha.getFullYear();

  mes: any;
  ano: any;

  ngOnInit(): void {
    this.mes = this.mesBase;
    this.ano = this.anoBase;

    // SE OBTIENEN LOS REPORTES
    this.getReportesSolucionados();
  }



  // CONSEGUIR LOS REPORTES
  getReportesSolucionados() {
    // SE OBTIENEN TODOS LOS REPORTES EXISTENTES DESDE EL BACKEND CON EL SERVICE
    this.reportesService.getReportes().subscribe(
      res => {
        this.reportes.shift();
        this.reportesFiltrados.shift();

        // Se agregan solo los reportes solucionados
        for(let reporte of <Reporte[]>res) {
          if(reporte.estado == "Solucionado")
            this.reportes.push(reporte);
        }

        // Se filtran los reportes del mes y año actuales
        for(let reporte of this.reportes) {
          const mes = new Date(reporte.fechaSolucion!).getMonth() + 1;
          const ano = new Date(reporte.fechaSolucion!).getFullYear();

          if((this.mesBase == mes) && (this.anoBase == ano))
            this.reportesFiltrados.push(reporte);
        }
        console.log(this.reportesFiltrados)

        // SE INICIA EL MAPA
        this.mapa();
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

  mesSeleccionado(m:any) {
    console.log(this.mes)
    console.log(this.ano)
    // Se cambia el mes seleccionado
    this.mes = this.meses.indexOf(m);

    if(this.ano == this.fecha.getFullYear()) {
      let indiceMes = this.meses.indexOf(m);
      
      if(indiceMes > this.fecha.getMonth()) {
        this.mes = this.fecha.getMonth();
        this.fechaMayor();
      }
      else
        this.filtrar(); // Se filtra 
    }
    else
      this.filtrar(); // Se filtra 
  }
  
  anoSeleccionado(a:any) {
    console.log(this.mes)
    console.log(this.ano)

    // Se cambia el año seleccionado
    this.ano = a;

    if(this.ano == this.fecha.getFullYear()) {
      let indiceMes = this.meses.indexOf(this.mes);
      
      if(indiceMes > this.fecha.getMonth()) {
        this.mes = this.fecha.getMonth();
        this.fechaMayor();
      }
      else
        this.filtrar(); // Se filtra 
    }
    else
      this.filtrar(); // Se filtra 
  }

  fechaMayor() {
    Swal.fire({
      title: 'Fecha ingresada mayor a la actual!',
      text: 'Se colocarán los reportes de la fecha actual',
      icon: 'error',
      confirmButtonText: 'Ok'
    });
  }

  filtrar() {
    // Se filtran los reportes por el mes y año seleccionados
    this.reportesFiltrados = [];

    for(let reporte of this.reportes) {
      const mesReporte = new Date(reporte.fechaSolucion!).getMonth();
      const anoReporte = new Date(reporte.fechaSolucion!).getFullYear();

      if(this.mes == mesReporte && this.ano == anoReporte)
        this.reportesFiltrados.push(reporte);
    }
    console.log(this.reportesFiltrados)

    // SE INICIA EL MAPA
    this.mapa();
  }


  
  //||||||||||||||||||||||||||||||||||||| SE CARGA EL MAPA |||||||||||||||||||||||||||||||||||||
  mapa() {
    // COORDENADAS DEL USUARIO PARA CENTRAR EL MAPA
    let longitud: number =  -103.3479102;
    let latitud: number = 20.6763989;

    // DECLARAR LOADER DEL MAPA CON LA APIKEY
    let loader = new Loader({
      // apiKey: 'AIzaSyAYN-jmRSHPR78rT0l1na0XchXlJT7_sDw'
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
      loader.load().then(async () => {
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

        // SE CREAN LOS MARCADORES DE LOS REPORTES YA EXISTENTES
        this.mostrarReportesSolucionados(map);
      });
    }, 100);
  }
  // |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||



  // AGREGAR LOS MARCADORES DE LOS REPORTES SOLUCIONADOS
  mostrarReportesSolucionados(map: google.maps.Map) {
    // LOS COLORES DE LOS MARCADORES DE CADA TIPO DE PROBLEMA
    const markerAlumbrado = "#ccc547";
    const markerAgua = "#6cb7ce";
    const markerObstruccion = "#864109";
    const markerIncendio = "#fd8037";

    if(!this.reportesFiltrados.length) {
      this.toggleDesactivarMapa = true;

      Swal.fire({
        title: 'No hay reportes!',
        text: 'No hay reportes solucionados en la fecha seleccionada',
        icon: 'info',
        confirmButtonText: 'Ok'
      });
    }
    else {
      this.toggleDesactivarMapa = false;
      // FOR PARA CREAR TODOS LOS MARCADORES
      for (let i = 0; i < this.reportesFiltrados.length; i++) {
        let markerColor;
  
        // SE IDENTIFICA EL TIPO DE REPORTE PARA ASIGNAR UN COLOR
        switch (this.reportesFiltrados[i].tipoProblema) {
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
          position: { lat: this.reportesFiltrados[i].ubicacion.latitud, lng: this.reportesFiltrados[i].ubicacion.longitud },
          map: map,
          title: "Ver detalles",
          icon: icon,
          optimized: true,
        });

        // CUANDO SE HACE CLICK EN EL MARCADOR DE UN REPORTE EXISTENTE SE MUESTRA UN INFOWINDOW
        marker.addListener("click", () => {
          this.reporteSeleccionado = this.reportesFiltrados[i];

          this.vecesReportado = this.reporteSeleccionado.usuarios.length;

          this.toggleInfoReporte = true;
          this.toggleDesactivarMapa = true;
          this.toggleDesactivarSelects = true;
        })
      }
    }
  }
}
