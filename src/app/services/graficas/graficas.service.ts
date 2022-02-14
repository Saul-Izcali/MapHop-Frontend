import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Reporte } from "../../models/reporte";

@Injectable({
  providedIn: 'root'
})
export class GraficasService {
  @Output() disparadorDeMes: EventEmitter<any> = new EventEmitter();
  @Output() disparadorDeAño: EventEmitter<any> = new EventEmitter();
  @Output() disparadorDeInstitucion: EventEmitter<any> = new EventEmitter();
  @Output() disparadorDescargar: EventEmitter<any> = new EventEmitter();

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


  getReportesG(mes: any, año: any) {
      let usuario = localStorage.getItem('Usr')
      let mesNumero = this.ConvertirMes(mes)
      let anoCorrecto = this.ConvertirAno(año)

      usuario += "$" + mesNumero + "$" + anoCorrecto
      
      return this.http.get<any>(this.URL_API + '/reportes-graficas/' + usuario);
  }

  getReportesGrafica2(mes: any, año: any) {
    let usuario = localStorage.getItem('Usr')
    let mesNumero = this.ConvertirMes(mes)
    let anoCorrecto = this.ConvertirAno(año)

    usuario += "$" + mesNumero + "$" + anoCorrecto
    
    return this.http.get<any>(this.URL_API + '/reportes-grafica2/' + usuario);
  }


  getReportesGrafica5(año: any) {
    let usuario = localStorage.getItem('Usr')
    let anoCorrecto = this.ConvertirAno(año)

    usuario += "$" + anoCorrecto

    return this.http.get<any>(this.URL_API + '/reportes-grafica5/' + usuario);
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
