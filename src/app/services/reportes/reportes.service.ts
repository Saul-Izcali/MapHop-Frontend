import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Reporte } from "../../models/reporte";

@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  @Output() disparadorReporteAsignado: EventEmitter<any> = new EventEmitter();
  @Output() disparadorDesactivarBotones: EventEmitter<any> = new EventEmitter();

  URL_API = 'https://maphop.herokuapp.com';

  selectedReporte: Reporte = {
    ubicacion: {
      longitud: 0,
      latitud: 0
    },
    tipoProblema: '',
    credibilidad: 0,
    usuarios: [
      {_id: ''}
    ]
  }

  reportes: Reporte[] = [];

  constructor(private http: HttpClient) { }

  createReporte(reporte: Reporte) {
    return this.http.post(this.URL_API + '/nuevo-reporte/', reporte);
  }

  replicarReporte(_id?: string, formData?: FormData) {
    return this.http.put<any>(this.URL_API + '/replicar-reporte/' + _id, formData);
  }

  reasignarReporte(_id?: string, tipoProblema?: string) {
    return this.http.get<any>(this.URL_API + '/reasignar-reporte/' + _id + "$" + tipoProblema);
  }

  refuerzoReporte(_id?: string) {
    return this.http.get<any>(this.URL_API + '/refuerzo-reporte/' + _id);
  }

  getTipoReportes(tipo: string) {
    return this.http.get<any[]>(this.URL_API + '/reportes-tipo/' + tipo);
  }

  getEstadoReportes(estado: string) {
    return this.http.get<any[]>(this.URL_API + '/reportes-estado/' + estado);
  }

  getReportesNoAsignados(nombreUsuario: any) {
    return this.http.get<any[]>(this.URL_API + '/reportes-no-asignados/' + nombreUsuario);
  }

  getReporteAsignado() {
    let id = localStorage.getItem("IDU");
    return this.http.get<any>(this.URL_API + '/reporte-asignado/' +  id);
  }

  getReportes() {
    return this.http.get<any[]>(this.URL_API + '/reportes/');
  }

  getReportesSegunUsr(institucion: string){
    return this.http.get<any[]>(this.URL_API + '/reportes/');
  }

  getReportesUsuario(usuario: string) {
    return this.http.get<any[]>(this.URL_API + '/reportes-usuario/' + usuario);
  }

  getReporte(_id?: string) {
    return this.http.get<any>(this.URL_API + '/reporte/' + _id);
  }

  editReporte(reporte: any) {
    return this.http.put(this.URL_API + '/reporte/' + reporte._id, reporte);
  }

  editImagenReporte(id?: string, formData?: FormData) {
    return this.http.put(this.URL_API + '/imagen-reporte/' + id, formData);
  }

  deleteReporte(_id?: string) {
    return this.http.delete(this.URL_API + '/reporte/' + _id);
  }

  getInfoUsuariosReporte(ids: any){
    return this.http.post<any[]>(this.URL_API + '/infoUsuariosReporte/', ids)
  }

  getReportesXMes(mes: any, año: any, estado: any){
    let usuario = localStorage.getItem('Usr')
    let mesNumero = this.ConvertirMes(mes)
    let anoCorrecto = this.ConvertirAno(año)

    usuario += "$" + mesNumero + "$" + anoCorrecto + "$" + estado
    console.log(usuario)
    
    return this.http.get<any>(this.URL_API + '/reportes-x-mes/' + usuario);
  }


  saltarReporte(id: any){
    return this.http.get<any>(this.URL_API + '/saltar-reporte/' + id)
  }

  terminoRutaRepentino(id: any){
    return this.http.get<any>(this.URL_API + '/termino-ruta/' + id)
  }

  quitarFantasma(id: any){
    return this.http.get<any>(this.URL_API + '/quitar-fantasma/' + id)
  }
 
  bajarReputacion(id: any, puntos: number){
    return this.http.get<any>(this.URL_API + '/bajar-reputacion-usr/' + id)
  }

  eliminarFantasma(id: any){
    return this.http.get<any>(this.URL_API + '/eliminar-fantasma/' + id)
  }

  reverseGeocoding(){
    // AIzaSyD8LFh53VddzDev0C6A5Jhln9KgpmpoExg
    // return this.http.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&amp;key=AIzaSyC6fYd8wgc8L8L9GDxRZlEUZim4JnhBJh4")
    return this.http.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&amp;key=AIzaSyAYN-jmRSHPR78rT0l1na0XchXlJT7_sDw")
  }
  



  
  ConvertirMes(mes: any){
    switch (mes) {
      case 1:
        return '01'
      case 2:
        return '02'
      case "Enero":
        return '01'
      case "Febrero":
        return '02'
      case "Marzo":
        return '03'
      case "Abril":
        return '04'
      case "Mayo":
        return '05'
      case "Junio":
        return '06'
      case "Julio":
        return '07'
      case "Agosto":
        return '08'
      case "Septiembre":
        return '9'
      case "Octubre":
        return '10'
      case "Noviembre":
        return '11'
      case "Diciembre":
        return '12'

      case "Enero ":
        return '01'
      case "Febrero ":
        return '02'
      case "Marzo ":
        return '03'
      case "Abril ":
        return '04'
      case "Mayo ":
        return '05'
      case "Junio ":
        return '06'
      case "Julio ":
        return '07'
      case "Agosto ":
        return '08'
      case "Septiembre ":
        return '9'
      case "Octubre ":
        return '10'
      case "Noviembre ":
        return '11'
      case "Diciembre ":
        return '12'

        case " Enero":
          return '01'
        case " Febrero":
          return '02'
        case " Marzo":
          return '03'
        case " Abril":
          return '04'
        case " Mayo":
          return '05'
        case " Junio":
          return '06'
        case "Julio":
          return '07'
        case " Agosto":
          return '08'
        case " Septiembre":
          return '9'
        case " Octubre":
          return '10'
        case " Noviembre":
          return '11'
        case " Diciembre":
          return '12'
        
      default:
        return mes
    }
  }


  ConvertirAno(ano: any){
    switch (ano) {
      case "2019 ":
        return '2019'
      case " 2019 ":
        return '2019'
      case "2020 ":
        return '2020'
      case " 2020 ":
        return '2020'
      case "2021 ":
        return '2021'
      case " 2021 ":
        return '2021'
      case "2022 ":
        return '2022'
      case " 2022 ":
        return '2022'

      default:
        return ano
    }
  }



}
