import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Reporte } from "../../models/reporte";
import { ReportesService } from 'src/app/services/reportes/reportes.service';

// implements OnInit
export class AlgoritmoUrgencia {

    reporte: Reporte = {
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

    constructor(public reportesService: ReportesService) { }
 

    // ----------------------------------------------------------------------------------------


    // Se obtiene si el problema es urgente o no (AL CONSULTAR LA URGENCIA DE LOS REPORTES)
    async Urgente(_id: string): Promise<boolean> {
        let limitePuntosUrgencia = await this.LimiteUrgencia(); // Se obtiene el límite de puntos de urgencia
        let puntosUrgencia = await this.PuntosUrgencia(_id); // Se obtienen los puntos de urgencia del reporte

        console.log("Limite de puntos de urgencia: " + limitePuntosUrgencia);
        console.log("Puntos de urgencia del reporte: " + puntosUrgencia);

        if(await puntosUrgencia >= limitePuntosUrgencia) // Si los puntos de urgencia del reporte superan el límite, el problema es urgente
            return true;
        else
            return false;
    }


    // ----------------------------------------------------------------------------------------


    // Se crea un límite de urgencia de los reportes en base al promedio de urgencia que se tiene
    async LimiteUrgencia(): Promise<number> {
        return new Promise((resolve, reject) => {
            let limite =  0;
            let sumaUrgencias = 0;

            this.reportesService.getReportes().subscribe(
                async res => {
                    this.reportes = <Reporte[]>res;

                    for(let reporte of this.reportes) {
                        sumaUrgencias += await this.PuntosUrgencia(reporte._id!);
                    }

                    limite = (sumaUrgencias/this.reportes.length) * 3/2;

                    resolve(limite);
                }, 
                err => {
                    console.log('No se pudo cargar los reportes');
                    console.error(err);
                }
            );
        });
    }

    // Se obtienen los puntos de urgencia de un problema (AL CONSULTAR LA URGENCIA DE LOS REPORTES)
    async PuntosUrgencia(_id: string): Promise<number> {
        let puntosCredibilidad = await this.PuntosCredibilidad(_id);
        let puntosVidaEnRiesgo = await this.PuntosVidaEnRiesgo(_id);
        let puntosCronico = await this.PuntosCronico(_id);
        let puntosTiempo = await this.PuntosTiempo(_id);

        let puntosUrgencia = puntosCredibilidad + puntosVidaEnRiesgo + puntosCronico + puntosTiempo;

        return puntosUrgencia;
    }

    // Se obtienen los puntos del reporte más urgente
    async MasUrgente(): Promise<number> {
        return new Promise((resolve, reject) => {
            let masUrgente = 0;

            this.reportesService.getReportes().subscribe(
                async res => {
                    this.reportes = <Reporte[]>res;

                    for(let reporte of this.reportes) {
                        if(await this.PuntosUrgencia(reporte._id!) > masUrgente)
                            masUrgente = await this.PuntosUrgencia(reporte._id!);
                    }

                    resolve(masUrgente);
                }, 
                err => {
                    console.log('No se pudo cargar los reportes');
                    console.error(err);
                }
            );
        });
    }


    // ----------------------------------------------------------------------------------------


    // Se obtienen los puntos dependiendo de los puntos de credibilidad que tiene el reporte (AL CONSULTAR LA URGENCIA DE LOS REPORTES)
    async PuntosCredibilidad(_id: string): Promise<number> {
        return new Promise((resolve, reject) => {
            let puntosCredibilidad = 0;
            
            this.reportesService.getReporte(_id).subscribe(
                res => {
                    this.reporte = <Reporte>res;
                    puntosCredibilidad = this.reporte.credibilidad;

                    resolve(puntosCredibilidad);
                },
                err => {
                    console.log('No se pudo cargar el reporte');
                    console.error(err);
                }
            )
        });    
    }

    // Se obtienen los puntos dependiendo de los usuarios que reportaron el problema como potencialmente 
    // peligroso para alguna vida (AL CONSULTAR LA URGENCIA DE LOS REPORTES)
    async PuntosVidaEnRiesgo(_id: string): Promise<number> {
        return new Promise((resolve, reject) => {
            let puntosVidaEnRiesgo = 0;
            let promedioCredibilidad = 0;
            let usuariosNoVidaRiesgo = 0;

            this.reportesService.getReporte(_id).subscribe(
                res => {
                    this.reporte = <Reporte>res;
                    promedioCredibilidad = this.reporte.credibilidad / this.reporte.usuarios.length
                    usuariosNoVidaRiesgo = this.reporte.usuarios.length - this.reporte.vidaRiesgo!;

                    puntosVidaEnRiesgo = (3*(promedioCredibilidad) + 4*(this.reporte.vidaRiesgo!+1)/(usuariosNoVidaRiesgo+1));
                    
                    resolve(puntosVidaEnRiesgo);
                },
                err => {
                    console.log('No se pudo cargar el reporte');
                    console.error(err);
                }
            );
        });
    }

    // Se obtienen los puntos dependiendo si el problema es crónico o no (AL CONSULTAR LA URGENCIA DE LOS REPORTES)
    async PuntosCronico(_id: string): Promise<number> {
        return new Promise((resolve, reject) => {
            let puntosCronico = 0;

            this.reportesService.getReporte(_id).subscribe(
                res => {
                    this.reporte = <Reporte>res;

                    if(this.reporte.cronico = true)
                        puntosCronico =  20;

                    resolve(puntosCronico);
                },
                err => {
                    console.log('No se pudo cargar el reporte');
                    console.error(err);
                }
            );
        });
    }

    // Se obtienen los puntos de urgencia/tiempo del reporte (AL CONSULTAR LA URGENCIA DE LOS REPORTES)
    async PuntosTiempo(_id: string): Promise<number> {
        return new Promise((resolve, reject) => {
            let puntosTiempo = 0;

            this.reportesService.getReporte(_id).subscribe(
                res => {
                    this.reporte = <Reporte>res;
                    
                    puntosTiempo = this.reporte.urgenciaTiempo!;

                    resolve(puntosTiempo);
                },
                err => {
                    console.log('No se pudo cargar el reporte');
                    console.error(err);
                }
            );
        });
    }
}