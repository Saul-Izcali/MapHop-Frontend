import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Reporte } from "../../models/reporte";
import { ReportesService } from 'src/app/services/reportes/reportes.service';
import { pipe } from 'rxjs';
import Swal from 'sweetalert2';

// implements OnInit
export class AlgoritmoIdentificacion {

    constructor(public reportesService: ReportesService, private http: HttpClient) { }
 
    mensajeError: any = {
        title: 'Oh no!',
        text: 'No se puede reportar',
        icon: 'error',
        confirmButtonText: 'Ok'
    }

    fecha = new Date();
    denegado: boolean = false;
    reportes: any[] = [];
    tiempos: any[] = [];


    async Identificacion(reporte: any) : Promise<boolean>{
        this.ChecarBan(); // cecha si esta baneado, en caso de que si no hace nada mas
        if(this.denegado == true){ // gracias a este if
            return this.denegado
        }
        
        if(this.Leer() == true){ // si existe la variable en el LS con algun reporte hace el resto de metodos
            // this.VerificarDistancia(reporte);
            // this.VerificarTiempo();
        } // estan comentados los metodos para hacer pruebas y realizar todos los reportes sin limitaciones (maximo 3, si el metodo fantasma esta acivado en el component)

        await console.log("el estado de denegado es: " ,this.denegado)
        return await this.denegado;
    }
    
    
    Leer() : boolean{
        if(localStorage.getItem("reportes")){   // si existe algun reporte aun si solucionar
            this.reportes = JSON.parse(localStorage.getItem('reportes') || '{}'); // convierte a arreglo la varible de LS
            this.tiempos = JSON.parse(localStorage.getItem('tiempos') || '{}'); // convierte a arreglo la varible de LS
            // this.denegado = true;
            return true;
        }else{
            // this.denegado = false;
            console.log("No existe ningun reporte");
            return false
        }
    }


    VerificarID( id_reporte: any): boolean{//  ESTE ES EL PASO 1, PERO OJO CON EL COMENTARIO DE ARRIBA
        let identificador = id_reporte;
        this.Leer();
        this.reportes.forEach(e => {
            if(e == identificador){ // si algun identificador coincide significa que este usuario habia hecho el reporte
                // console.log("No se puede repotar este problema de nuevo");
                this.denegado = true                
                Swal.fire({
                    title: 'Este problema ya lo reportaste',
                    text: 'No se puede reportar mas de una vez un problema',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                  });
            }
        });

        console.log(this.denegado)
        if(this.denegado) return true
        else{ // si es un usuario distinto entonces llama a quitarFantasma, si el reporte aun existe y tiene el atributo de fantasma lo quita (realmente le asigna 0)
            this.reportesService.quitarFantasma(id_reporte.toString()).subscribe(
                res =>{
                  console.log("fantasma eliminado, si es que lo tenia")
                },
                err =>{
                  console.log("Error al quitar fantasma")
            })
            console.log("SE PUEDE REPORTAR")
            return false
        }     
    }


 
    VerificarDistancia(reporteActual: any): any{   // ESTE ES EL PASO 2
        let latComparada, lngComparada, contador = 0;

        //busca cada uno de los reportes en el LS, para comparar las distancias de sus ubicaciones con el actual
        this.reportes.forEach((e: string | undefined) => {
            if(e != this.reportes[this.reportes.length-1]) {
                this.reportesService.getReporte(e).subscribe(
                    (        res: any) => {
                        latComparada = res.ubicacion.latitud
                        lngComparada = res.ubicacion.longitud

                        //  (LatNueva  -  LataComparar) / 111,100 = distancia en metros entre las dos latitudes, igual con longitudes
                        let distanciaLatitud = ((reporteActual.ubicacion.latitud - latComparada) * 111100)
                        let distaciaLongitud = ((reporteActual.ubicacion.longitud - lngComparada) * 111100)

                        if(distanciaLatitud < 0)
                            distanciaLatitud = distanciaLatitud*-1
                            
                        if(distaciaLongitud < 0)
                            distaciaLongitud = distaciaLongitud*-1

                        console.log("Parte izquierda: " + distanciaLatitud + "  |  " + "Parte derecha: " + distaciaLongitud)

                        if( distanciaLatitud < 30 && distaciaLongitud < 30){
                            //la distancia es menor a 30m
                            // console.log(latComparada, lngComparada)
                            // console.log(res.tipoProblema)
                            if(reporteActual.tipoProblema == res.tipoProblema){
                                if(contador == 0){
                                    // console.log(reporteActual.ubicacion.latitud, reporteActual.ubicacion.longitud)
                                    // el tipo de problema coincide y la distancia es menor a 30 m, no se puede reportar
                                    this.denegado = true
                                    console.log("El reporte no se puede reportar NOO!")
                                    Swal.fire({
                                        title: 'Este problema no se puede reportar',
                                        text: 'Muy cerca y del mismo tipo',
                                        icon: 'error',
                                        confirmButtonText: 'Ok'
                                    });
                                    console.log("denegado = ", this.denegado)
                                    
                                    contador++;
                                }
                            }
                        }
                    }, 
                    (err: any) => {
                        console.error(err);
                    })
            }
        });
    }


    VerificarTiempo(){    // ESTE ES EL PASO 3
        let tiempo;
            tiempo = this.reportes[this.reportes.length - 1] 
            if((this.fecha.getTime() - tiempo) < 300000 ){
                this.denegado = true;
                Swal.fire({
                    title: 'Oh no!',
                    text: 'No se puede reportar mas de un reporte cada 5 minutos.',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                  });
            }else{
                console.log(" El reporte se puede realizar")
                this.denegado = false;
                // this.mensajeError.text = "No se puede reportar mas un reporte cada 5 minutos."
            }
    }


    VerificarFantasma(){  // ESTE ES EL PASO 4
        let contador = 1;
        let tipoUsr = localStorage.getItem("TipoUsr")
        // console.log(this.tiempos)
        this.tiempos.forEach(e => { // recorre todo los tiempos en el que el usuario hizo sus reporetes anteriores
            if(e >= (this.fecha.getTime() - 86400000)){ // si fue hace menos de 24 horas aumenta contador
                console.log("Fue hace menos de 24 horas");
                contador++;
            }
        });

        // primero checa que tipo de usuario es, para cambiar la aleta y consecuencias dependiendo si es comun o invitado
        if(tipoUsr == "comun"){
            if(contador == 3){
                 return 3;  ////////////// retorna 3 para indicar que es fantasma
            }else if(contador == 4){
                Swal.fire({
                    title: 'Seguro?',
                    text: 'Si realizas el reporte no podras realizar algún otro por 36 horas y se te restará 1 punto de reputación',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si, enviar reporte!'
                        }).then((result => {
                            if (result.isConfirmed){
                                localStorage.setItem("Ban", this.fecha.getTime().toString()); // banea por 36 horas ///////////////////////
                                this.reportesService.bajarReputacion(localStorage.getItem("IDU"), 1).subscribe( // baja 1 punto de reputacion
                                    res =>{
                                      console.log("Reputacion modificada")
                                    },
                                    err =>{
                                      console.log("Error al Bajar la reputacion")
                                })
                                return 4
                            }else{
                                console.log("Pues no hace nada, no guarda el reporte ni banea")
                                return false
                            }
                        }));
                        // ----------------------------------------------------------------------------------------------------------------------------
                        // este bloque entre la linea de puntos deberia estar dentro del if(result.isConfirmed) de la alerta, ya que son las consecuencias
                        // console.log("mando true")
                        // localStorage.setItem("Ban", this.fecha.getTime().toString()); // banea por 36 horas ///////////////////////
                        // this.reportesService.bajarReputacion(localStorage.getItem("IDU"), 1).subscribe( // baja 1 punto de reputacion
                        //     res =>{
                        //       console.log("Reputacion modificada")
                        //     },
                        //     err =>{
                        //       console.log("Error al Bajar la reputacion")
                        // })
                        // el usuario invitado tiene un bloque igual, pero sin bajar reputacion, unicamente banea dispositivo, pero tambien deberia estar dentro de la alerta
                        // ----------------------------------------------------------------------------------------------------------------------------
                        return 4;  ////////////// retorna 4 para indicar que no se debe crear
            }else if(contador > 4){
                this.denegado = true;
            }

        } else if(tipoUsr == null){
            console.log("Entro a el invitado")
            if(contador == 3){
                 return 3;  ////////////// retorna un 3 para indicar que es fantasma
            }else if(contador == 4){
                Swal.fire({
                    title: 'Seguro?',
                    text: 'Si realizas el reporte no podras realizar algún otro por 36 horas',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si, enviar reporte!'
                        }).then((result => {
                            if (result.isConfirmed){
                                localStorage.setItem("Ban", this.fecha.getTime().toString()); // banea por 36 horas
                                console.log("TRUE")
                                return 4
                            }else{
                                console.log("FALSE")
                                console.log("Pues no hace nada, no guarda el reporte ni banea")
                                return false
                            }
                        }));
                        // console.log("mando true")
                        // localStorage.setItem("Ban", this.fecha.getTime().toString()); // banea por 36 horas ///////////////////////
                        return 4;  ////////////// retorna un 4 para indicar que no se debe realizar
            }else if(contador > 4){
                this.denegado = true;
            }
        }

        console.log("retorno 1, se puede guardar normal")
        return 1;
    }


    ChecarBan(): boolean{
        let ban = JSON.parse(localStorage.getItem('Ban') || '{}');

        if(localStorage.getItem("Ban")){ // significa que fue baneado
            if(ban >= (this.fecha.getTime() - 129600000)){ // si han pasado menos de 36 desde que fue baneado no lo deja hacer reporte
                console.log("No se puede generar");
                this.denegado = true;
                Swal.fire({
                    title: 'Estas baneado',
                    text: 'No puedes hacer ningun reporte por el momento',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                  });
                return true;
            }else{
                localStorage.removeItem("Ban");
            }
        }
        
        return false;
    }


    AccederYGuardar(idReporte: any, componente: boolean){

            if(this.denegado == true){
                console.log("-- NO SE PUEDE HACER EL REPORTE --")
                if(componente){
                    this.reportesService.deleteReporte(idReporte.toString()).subscribe(
                        res =>{
                          console.log("Reporte eliminado")
                        },
                        err =>{
                          console.log("Error al eliminar el reporte")
                    })
                }
            }else{
                this.reportes.pop();
                this.reportes.push(idReporte)
                this.reportes.push(this.fecha.getTime())
                this.tiempos.push(this.fecha.getTime())
                localStorage.setItem("reportes", JSON.stringify(this.reportes));
                localStorage.setItem("tiempos", JSON.stringify(this.tiempos));
                console.log("-- SE GUARDO EL ID EN EL LOCALSTORAGE --")
                Swal.fire({
                    title: 'Reporte enviado!',
                    text: 'Hemos recibido tu reporte del problema',
                    icon: 'success',
                    confirmButtonText: 'Ok'
                  }).then((result) => {
                    //   if(result.isConfirmed || result.isDismissed) {
                    //     window.location.reload();
                    //   }
                  });
            }
    }


}