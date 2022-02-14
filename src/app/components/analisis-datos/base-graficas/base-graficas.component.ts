import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login/login.service';
import Swal from 'sweetalert2';
import { GraficasService } from "../../../services/graficas/graficas.service";

@Component({
  selector: 'app-base-graficas',
  templateUrl: './base-graficas.component.html',
  styleUrls: ['./base-graficas.component.css']
})
export class BaseGraficasComponent implements OnInit {

  constructor(public graficasService: GraficasService, public loginService: LoginService) { }

  public graficas: string[] = ['Grafica 1', 'Grafica 2', 'Grafica 3'];
  public grafica!: "Grafica 1";
  public meses: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  public mesesBase: string[] = ['Enero ', 'Febrero ', 'Marzo ', 'Abril ', 'Mayo ', 'Junio ', 'Julio ', 'Agosto ', 'Septiembre ', 'Octubre ', 'Noviembre ', 'Diciembre '];
  public otroDeMeses: string[] = [' Enero', ' Febrero', ' Marzo', ' Abril', ' Mayo', ' Junio', ' Julio', ' Agosto', ' Septiembre', ' Octubre', ' Noviembre', ' Diciembre'];
  public mes!: "ninguno";
  public anos: string[] = ['2022', '2021', '2020', '2019'];
  public anosCambio: string[] = ['2022 ', '2021 ', '2020 ', '2019 '];
  public otroDeAnos: string[] = [' 2022 ', ' 2021 ', ' 2020 ', ' 2019 '];
  public ano!: "ninguno";
  public instituciones: string[] = ['Todas las instituciones', 'SIAPA', 'Infrectructura', 'Bomberos', 'CFE', 'Proteccion', 'Movilidad'];
  public institucionesCambio: string[] = ['Todas las instituciones ', 'SIAPA ', 'Infrectructura ', 'Bomberos ', 'CFE ', 'Proteccion ', 'Movilidad '];
  public otroDeInstituciones: string[] = ['Todas las instituciones ', 'SIAPA ', 'Infrectructura ', 'Bomberos ', 'CFE ', 'Proteccion ', 'Movilidad '];
  public institucion!: "ninguno";
  prueba: any;

  graficaSeleccionada: any = "Grafica 1"

  fecha = new Date()
  mesBase: any
  anoBase: any

  mesAux: any;
  anoAux: any;

  admin = false;

  ngOnInit(): void {
    if(localStorage.getItem('TipoUsr') == "admin")
      this.admin = true;
    else 
      this.admin = false;
    // document.getElementById("selectGraficas")!.options.item(1).selected = 'selected';
    this.mesBase = this.fecha.getMonth() + 1
    this.anoBase = this.fecha.getFullYear()

    this.mesAux = this.fecha.getMonth() + 1
    this.anoAux = this.fecha.getFullYear()
  }



  async tipoGraficas(g:any): Promise<void>{
      this.graficaSeleccionada = g

      this.anos = this.anosCambio
      this.anosCambio = this.otroDeAnos
      this.otroDeAnos = this.anos
      this.ReiniciarSelectMes()
      this.meses = this.prueba

      if(this.admin) {
        this.instituciones = this.institucionesCambio
        this.institucionesCambio = this.otroDeInstituciones
        this.otroDeInstituciones = this.instituciones
      }
  }
  
  async mesSeleccionado(m:any): Promise<void>{
      // CHECAR PARA QUE MANDE POR DEFAULT EL MES ACTUAL
      this.mesAux = m;

      if(this.anoAux == this.fecha.getFullYear()) {
        let indiceMes = this.meses.indexOf(m);
        
        if(indiceMes == -1) {
          indiceMes = this.mesesBase.indexOf(m);
          if(indiceMes == -1) {
            indiceMes = this.otroDeMeses.indexOf(m);
          }
        }
        
        if(indiceMes > this.fecha.getMonth()) {
          this.mesAux = this.meses[this.fecha.getMonth()];
          this.fechaMayor();
        }
      }

      this.graficasService.disparadorDeMes.emit(this.mesAux)
    }
    
  async anoSeleccionado(a:any): Promise<void>{
      this.anoAux = a;

      if(this.anoAux == this.fecha.getFullYear()) {
        let indiceMes = this.meses.indexOf(this.mesAux);
        
        if(indiceMes == -1) {
          indiceMes = this.mesesBase.indexOf(this.mesAux);
          if(indiceMes == -1) {
            indiceMes = this.otroDeMeses.indexOf(this.mesAux);
          }
        }
        
        if(indiceMes > this.fecha.getMonth()) {
          this.mesAux = this.meses[this.fecha.getMonth()];
          this.graficasService.disparadorDeMes.emit(this.mesAux)
          this.fechaMayor();
        }
      }

      this.graficasService.disparadorDeAño.emit(a)
    }

  async institucionSeleccionada(i:any): Promise<void>{
    this.graficasService.disparadorDeInstitucion.emit(i)
  }
    
  fechaMayor() {
    Swal.fire({
      title: 'Fecha ingresada mayor a la actual!',
      text: 'Se colocarán los reportes de la fecha actual',
      icon: 'error',
      confirmButtonText: 'Ok'
    });
  }
    
  Descargar(){
      console.log("hola")
      this.graficasService.disparadorDescargar.emit(this.graficaSeleccionada)
  }


  ReiniciarSelectMes(){
    this.mesesBase = this.otroDeMeses
    this.otroDeMeses = this.meses
    this.anoBase = this.otroDeAnos
    this.otroDeAnos = this.anos

    let ms = this.mesesBase
    let mesActualNombre = this.mesesBase[this.fecha.getMonth()]
    let mesActualNumero = this.fecha.getMonth()
      
    ms.splice(mesActualNumero, 1)

    ms.splice(0,0,mesActualNombre)

    this.prueba = ms
  }


}
