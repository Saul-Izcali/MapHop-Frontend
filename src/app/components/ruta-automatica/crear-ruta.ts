import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Reporte } from "../../models/reporte";
import { ReportesService } from 'src/app/services/reportes/reportes.service';
import { AlgoritmoUrgencia } from "src/app/components/mapa-reportes/algoritmo-urgencia";
import Swal from 'sweetalert2';
import { error } from 'jquery';


export class CrearRuta {

    constructor(public reportesService: ReportesService, private http: HttpClient) { }

    toggleCrearRuta: boolean = false;

    fecha = new Date()

    reporte: Reporte = {
        ubicacion: {
            latitud: 0,
            longitud: 0
        },
        tipoProblema: "",
        credibilidad: 0,
        asignado: "",
        usuarios: [{
            _id: ""
        }]
      };

    reportes: Reporte[] = [{
        ubicacion: {
            latitud: 0,
            longitud: 0
        },
        tipoProblema: "",
        credibilidad: 0,
        asignado: "",
        usuarios: [{
            _id: ""
        }]
    }];

    urgenciaReporte = 0;

    // public directionsRenderer: any
    // public directionsService: any

    CrearRuta(){
        this.reportesService.getReporteAsignado().subscribe(
            res => {
                console.log(res);
                if(res == false){
                    this.toggleCrearRuta = true;
                    this.AsignarReporte();
                }else{
                    if(!navigator.geolocation){// obtiene la ubicacion actual del usuario
                        alert("No se puede obtener la Geolocalización");
                    }else{
                        var options = {
                            enableHighAccuracy: true,
                            timeout: 20000,
                            maximumAge: 0
                          };
                        navigator.geolocation.getCurrentPosition(//este metodo recibe 3 parametros,dos metodos y un objeto
                            (pos) =>{
                                this.TrazarRuta(pos.coords, res[0].ubicacion);
                                this.reporte = res[0];
                                console.log(this.reporte)
                                this.reportesService.disparadorReporteAsignado.emit(this.reporte)
                            }, 
                            (err) =>{
                                console.warn('ERROR(' + err.code + '): ' + err.message);
                            },  
                            options);
                    }
                }
            },
            err => {
                console.warn('error al obtener reporte ', err);
            }
        )
    }


    
    AsignarReporte(){
        let algoritmoUrgencia = new AlgoritmoUrgencia(this.reportesService);

        new Promise((resolve, reject) => {
            // Obtiene  U-N-I-C-A-M-E-N-T-E LOS REPORTES QUE NO HAN SIDO ASIGNADOS
            
          this.reportesService.getReportesNoAsignados(localStorage.getItem('Usr')).subscribe(  
              async res => {
                  this.reportes = <Reporte[]>res;  //obtiene todos los reportes
                  let list: Object[] = [];
                  if(this.reportes.length == 0){
                    Swal.fire({
                        title: 'No se puede asignar ruta',
                        text: "No hay reportes por asignar",
                        icon: 'info',
                        confirmButtonColor: '#3085d6',
                      })
                      this.reportesService.disparadorDesactivarBotones.emit("Desactivar")
                      return
                  }

                  for(let reporte of this.reportes) {  // calcula la urgencia de cada reporte y la guarda en un arreglo junto su id
                    let urgenciaReporte = await algoritmoUrgencia.PuntosUrgencia(reporte._id!);
                    let obj = {id: reporte._id, urgencia:urgenciaReporte, ubicacion: reporte.ubicacion, distancia:0}
                    list.push(obj);
                  }
                    
                    let reportesTodos = list;

                    // ordena las urgencia de mayor a menor y pasa las primeras 5 a otro arreglo
                    let top5 = list.sort(function (a: any, b: any){
                        return (b.urgencia - a.urgencia)
                    }).slice(0,5);
                    console.log(top5) 

                    let salto = localStorage.getItem("salto");
                    let contadorSalto = 0, bandera = true

                    top5.forEach( (element: any) => {
                        if(element.id == salto!){
                            bandera = false
                            console.log(element)
                        }
                        if(bandera)
                        contadorSalto++
                    });

                    // console.log(top5)
                    // console.log(salto)
                    // console.log(contadorSalto)
                    top5.splice(contadorSalto, 1)
                    // console.log(top5)

                    //AHORA ASIGNA UNO DE ESOS REPORTES PARA SER RESUELTO
                    if(!navigator.geolocation){// obtiene la ubicacion actual del usuario
                        alert("No se puede obtener la Geolocalización");
                    }else{
                        // console.log(navigator.geolocation);
                        var options = {
                            enableHighAccuracy: true,
                            timeout: 15000,
                            maximumAge: 0
                          };
                          
                        navigator.geolocation.getCurrentPosition(//este metodo recibe 3 parametros,dos metodos y un objeto
                            (pos) =>{
                                let coordenadasActuales = pos.coords;
                                console.log("latitude: " +  coordenadasActuales.latitude.toString() + "longitude: " +  coordenadasActuales.longitude.toString());
                                // console.log("precision: " + coordenadasActuales.accuracy.toString().slice(-3) + " metros");


                                let idReporteMasCercano: string | undefined , contador = 0;
                                let ordenDistancias

                                // checa cuanto tiempo falta para que termine la jornada laboral, en base a eso asigna ruta,
                                // en caso de que falte menos de 1:30 hrs asigna el problema mas cercano,
                                // en caso de que falte mas de 1:30 hrs asigna de forma normal
                                let diferencia = JSON.parse(localStorage.getItem('DiferenciaTiempo') || '{}');
                                let tiempoActual = this.fecha.getTime()
                                let sumaTermino = diferencia[0] + diferencia[1]
                                let horaMenos = sumaTermino - 5400000

                                console.log(sumaTermino)
                                if(tiempoActual < horaMenos){ //Entonces asigna de manera normal
                                    console.log("Asigna de manera normal")

                                    // calcula la distancia en km que hay entre la posicion actual y la ubicacion de cada reporte
                                    // mediante la formula de haversine
                                    top5.forEach( (e: any)=>{
                                        e.distancia = this.CalcularDistancia(e, coordenadasActuales);
                                        console.log(e.distancia)
                                    })

                                    //ordena el top 5 por distancia, del mas cercano al mas lejano
                                     ordenDistancias = top5.sort(function (a: any, b: any){  
                                        return (a.distancia - b.distancia)
                                    });
                                    console.log(ordenDistancias)

                                }else{ // asigna unicamente en base a la distancia
                                    console.log("Asigna unicamente en base a la distancia")

                                    list.forEach( (e: any)=>{
                                        e.distancia = this.CalcularDistancia(e, coordenadasActuales);
                                    })

                                    // ordena todos los reportes por distancia
                                    ordenDistancias = list.sort(function (a: any, b: any){  
                                        return (a.distancia - b.distancia)
                                    });
                                    console.log(ordenDistancias)

                                }
                                console.log(ordenDistancias)

                                // asigna el reporte mas cercano a la primera posicion del arreglo ordenado
                                ordenDistancias.forEach((e: any) => {
                                    if(contador == 0)
                                        idReporteMasCercano = e.id
                                    contador++;
                                });

                                try {
                                    let update = this.reportes.find(element => element._id == idReporteMasCercano);
                                    this.reporte = this.reportes.find(element => element._id == idReporteMasCercano)!;
                                    if(update != undefined){
                                        update.asignado = localStorage.getItem('IDU')!;
                                        update.estado = "En ruta";

                                        console.log(this.reporte)
                                
                                        this.reportesService.disparadorReporteAsignado.emit(this.reporte)
                                        setTimeout(() => {
                                            this.reportesService.editReporte(update).subscribe(  
                                                async res => {
                                                    console.log("El reporte fue asignado")
                                                    console.log(res)
                                                    this.TrazarRuta(coordenadasActuales, update?.ubicacion);
    
                                                                                                    // crear aqui el setinterval time para checar y cambiar el estado del reporte asignado
                                                    // una vez llegue a la ubicacion del problema
                                                    let cambioEnProceso = setInterval( () => {
                                                        console.log("paso set interval")
                                                        navigator.geolocation.getCurrentPosition(//este metodo recibe 3 parametros,dos metodos y un objeto
                                                            (pos) =>{   
                                                                let coordenadasAct = pos.coords;
                                                                console.log(pos.coords)
                                                                console.log(update?.ubicacion)
                                                                let distancia = this.CalcularDistancia(update, coordenadasAct)                            
                                                                console.log(distancia)
                                                                if(distancia <= 0.050){
                                                                    console.log(distancia)
                                                                    update!.estado = "En proceso";
                                                                    clearInterval(cambioEnProceso);
                                                                    this.reportesService.editReporte(update!).subscribe(
                                                                        res => {
                                                                            console.log("EL REPORTE ", update?._id, " HA PASADO A EN PROCESO")
                                                                        },
                                                                        error => {
                                                                            console.error(error)
                                                                        })
                                                                }else{
                                                                    console.log("aun se encuentra muy lejos")
                                                                    console.log(distancia)
                                                                }
                                                            }, 
                                                            (err) =>{
                                                                console.warn('ERROR(' + err.code + '): ' + err.message);
                                                            },  {enableHighAccuracy: true,
                                                                timeout: 5000,
                                                                maximumAge: 0});
                                                    }, 15000)     // 3000000

                                                    console.log("DESPUES DEL INTERVAL")
                                                },
                                                err => {
                                                    console.warn("Error al momento de asignar el reporte")
                                                }
                                            );
                                        }, 1000);
                                        
                                    }
                                } catch (error) {
                                    console.warn(error);
                                }

                            }, 
                            (err) =>{
                                console.warn('ERROR(' + err.code + '): ' + err.message);
                            },  
                            options);
                    }
              }, 
              err => {
                  console.warn('No se pudo cargar los reportes ', err);
              }
          );
        });
    }


    
    // Calcula la distancia en Km entre dos ubicaciones, mediante la formula de haversine
    // 'e' representa el objeto con la ubicacion de llegada (destino) y 
    // 'coordenadasActuales' representa el objeot con la ubicaccion actual (orginen) 
    CalcularDistancia(e: any, coordenadasActuales: any){
        const RadioTierraKm = 6371.0;
                                  
        let difLatitud = (Math.PI / 180) * (coordenadasActuales.latitude - parseFloat(e.ubicacion.latitud));
        let difLongitud = (Math.PI / 180) * (coordenadasActuales.longitude - parseFloat(e.ubicacion.longitud));

        let a = Math.pow(Math.sin(difLatitud/2), 2) +
                Math.cos(((coordenadasActuales.latitude)*(Math.PI / 180))) *
                Math.cos((parseFloat(e.ubicacion.latitud)*(Math.PI / 180)))*
                Math.pow(Math.sin(difLongitud/2), 2);

        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        
        return RadioTierraKm * c;
    }


    // Este metodo utiliza la API de maps para poder trazar la ruta entre la distancia actual
    // y la ubicacion del problema asignado a resolver
    TrazarRuta(origen:any, destino:any){
      // inicia la Configuración
        var directionsRenderer = new google.maps.DirectionsRenderer();
        var directionsService = new google.maps.DirectionsService();
        const map = new google.maps.Map(document.getElementById("mapa")!, {
          zoom: 14,
          center: { lat: origen.latitude, lng: origen.longitude },
          //   center: { lat: 20.523476, lng: -103.3585481 },
        });
        directionsRenderer.setMap(map);
      
        directionsService.route({
            origin:  { lat: origen.latitude, lng: origen.longitude },
            destination: { lat: destino.latitud, lng: destino.longitud },
            travelMode: google.maps.TravelMode["DRIVING"], // tambien se puede usar de otro modo WALKING - BICYCLING - TRANSIT
          },(response: any, status: any) => {
            if (status == "OK") {
              directionsRenderer.setDirections(response);
              console.log("DEBIO TERMINAR DE TRAZAR LA RUTA")
            } else {
              console.warn("Ocurrio un error al trazar la ruta " + status);
            }
          });
    }


}