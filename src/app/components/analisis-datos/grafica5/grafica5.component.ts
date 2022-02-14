import { Component, OnInit } from '@angular/core';
import { GraficasService } from 'src/app/services/graficas/graficas.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

declare var google: any;

@Component({
  selector: 'app-grafica5',
  templateUrl: './grafica5.component.html',
  styleUrls: ['./grafica5.component.css']
})
export class Grafica5Component implements OnInit {

  fecha = new Date()

  mesBase: any = 11
  añoBase: any = 2021

  institucionSeleccionada = "Ad";

  auxiliar: any = [ ]
  conclusiones: any = [  ]

  // es la forma que necesitan los datos para poder ser utilizados dentro de la grafica de barras
  datosRemasterizados: any = [
    ['Problema', 'Cantidad', { role: 'style' }],
    ['Alumbrado', 0, '#f8ef2a'],
    ['Inundacion', 0, '#33a5da'],
    ['Fuga de agua', 0, '#3fabcb'],
    ['Falta de alcantarilla', 0, '#3fbfcb'],
    ['Alcantarilla obstruida', 0, '#3fbffb'],
    ['Escombros', 0, '#7c4418'],
    ['Vehiculo abandonado', 0, '#af8461'],
    ['Arbol caido', 0, '#ADD82B'],
    ['Socavón', 0, '#795d45'],
    ['Cables', 0, '#ebee4a'],
    ['Incendio', 0, '#FF6A14'],
  ]
  
  ancho: any = "80%"

  // configuracion de la grafica
  options = {
    title: "Cantidad de problemas cronicos reportados en el año",
    width: 1050,
    // width: this.ancho,
    height: 600,
    bar: {groupWidth: "95%"},
    legend: { position: "none" },
    backgroundColor: 'transparent', //#FAFAFA
    // is3D: true,
    // vAxis: { minValue: 0 }
  };

  constructor(public graficasService: GraficasService) {
    this.mesBase = this.fecha.getMonth() + 1
    this.añoBase = this.fecha.getFullYear().toString()
   }

  ngOnInit(): void {

    this.graficasService.getReportesGrafica5(this.añoBase).subscribe(
      res => {
        google.charts.load('current', {packages: ['corechart']});
        google.charts.setOnLoadCallback( () => { // carga las graficas mediante una callback
          
            this.Calcular(res)  // pasa los reportes que vienen del backend y este metodo los cuenta para poder graficar
            
            var data = google.visualization.arrayToDataTable(this.auxiliar); // convierte los datos a un datatable
            
            var chart = new google.visualization.BarChart(document.getElementById('barchart_values')); //indica que tipo de grafica va a cargar en que elemento del dom
            chart.draw(data, this.options); // dibuja la grafica
            
            this.Conclusiones()
          } );  
        },
      err => {
        console.error(err);
      });


      this.graficasService.disparadorDeAño.subscribe(res => {
        this.añoBase = res
          this.graficasService.getReportesGrafica5(this.añoBase).subscribe(
            res => {
              console.log(res)
              google.charts.load('current', {packages: ['corechart']});
              google.charts.setOnLoadCallback( () => {
                
                for(let que = 1; que < this.datosRemasterizados.length; que++){
                  this.datosRemasterizados[que][1] = 0
                }
                
                this.Calcular(res)
  
                var data = google.visualization.arrayToDataTable(this.auxiliar);
  
                var chart = new google.visualization.BarChart(document.getElementById('barchart_values')); //indica que tipo de grafica va a cargar en que elemento del dom
                chart.draw(data, this.options);   

              this.Conclusiones()
          } );  
        },
        err => {
          console.error(err);
        }
          )
      })


    // Disparador del select de institucion que se le muestra solamente al Admin
      this.graficasService.disparadorDeInstitucion.subscribe(res => {
        let institucion = res;
  
        console.log(institucion)
  
          // 'Todas las instituciones', 'SIAPA', 'Infrectructura', 'Bomberos', 'CFE', 'Proteccion', 'Movilidad'
          if(institucion.substr(0,2) == "To") this.institucionSeleccionada = "Ad"
          else if(institucion.substr(0,2) == "SI") this.institucionSeleccionada = "SP"
          else if(institucion.substr(0,2) == "In") this.institucionSeleccionada = "IF"
          else if(institucion.substr(0,2) == "Bo") this.institucionSeleccionada = "BM"
          else if(institucion.substr(0,2) == "CF") this.institucionSeleccionada = "CF"
          else if(institucion.substr(0,2) == "Pr") this.institucionSeleccionada = "PC"
          else if(institucion.substr(0,2) == "Mo") this.institucionSeleccionada = "SM"
  
          console.log(this.institucionSeleccionada)
  
          this.graficasService.getReportesGrafica5(this.añoBase).subscribe(
            res => {
              console.log(res)
              google.charts.load('current', {packages: ['corechart']});
              google.charts.setOnLoadCallback( () => {
                
                for(let que = 1; que < this.datosRemasterizados.length; que++){
                  this.datosRemasterizados[que][1] = 0
                }
                
                this.Calcular(res)
  
                var data = google.visualization.arrayToDataTable(this.auxiliar);
  
                var chart = new google.visualization.BarChart(document.getElementById('barchart_values')); //indica que tipo de grafica va a cargar en que elemento del dom
                chart.draw(data, this.options);   

              this.Conclusiones()
          } );  
        },
        err => {
          console.error(err);
        }
          )
      })


      this.graficasService.disparadorDescargar.subscribe(res => {
        console.log(res)
        if(res == "Grafica 5"){
          const DATA = document.getElementById('contenedorDescargar');
          const doc = new jsPDF('l', 'pt', 'a4');
          const options = {
            background: 'white',
            scale: 5
          };
          html2canvas(DATA!, options).then((canvas) => {
            const img = canvas.toDataURL('image/PNG');
      
            // Add image Canvas to PDF
            const bufferX = 10;
            const bufferY = 10;
            const imgProps = (doc as any).getImageProperties(img);
            const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            // const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
            // const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
            return doc;
          }).then((docResult) => {
            docResult.save(`${new Date().toISOString()}_Grafica1.pdf`);
          });
        }
        
      },
      err => {
        console.error(err);
    })

  }


  Calcular(magia: any){
    magia.forEach((e: any) => {
      switch (e.tipoProblema) {
        case "Alumbrado":
          this.datosRemasterizados[1][1]++
          break;
        case "Inundacion":
          this.datosRemasterizados[2][1]++
          break;
        case "Fuga de agua":
          this.datosRemasterizados[3][1]++
          break;
        case "Falta de alcantarilla":
          this.datosRemasterizados[4][1]++
          break;
        case "Alcantarilla obstruida":
          this.datosRemasterizados[5][1]++
          break;
        case "Escombros tirados":
          this.datosRemasterizados[6][1]++
        break;
        case "Vehículo abandonado":
          this.datosRemasterizados[7][1]++
          break;
        case "Árbol caído":
          this.datosRemasterizados[8][1]++
          break;
        case "Socavón":
          this.datosRemasterizados[9][1]++
          break;
        case "Cables caídos":
          this.datosRemasterizados[10][1]++
          break;
        case "Incendio":
          this.datosRemasterizados[11][1]++
          break;
        default:
          console.log("Entro al default")
          break;
      }
    });

    this.auxiliar.length = 0
    this.auxiliar.push(['Problema', 'Cantidad', { role: 'style' }])

    let institucion;

    if(localStorage.getItem('Usr') == "Admin") { // Si es Admin se toma la institución del select
      institucion = this.institucionSeleccionada;
    }
    else { // Si no es Admin se toma la institución que le corresponde
      institucion = localStorage.getItem('Usr')!;
    }
    let institucionUsr = institucion;

    let noElPrimero = false
    this.datosRemasterizados.forEach((element: any) => {
      if(noElPrimero){
        if(institucionUsr!.substr(0,2) == "SP")
          if(element[0] == "Inundacion" || element[0] == "Fuga de agua" || element[0] == "Falta de alcantarilla" || element[0] == "Alcantarilla obstruida")
            this.auxiliar.push(element)

        if(institucionUsr!.substr(0,2) == "CF")
          if(element[0] == "Alumbrado" || element[0] == "Cables")
            this.auxiliar.push(element)
             
        if(institucionUsr!.substr(0,2) == "BM")
          if(element[0] == "Incendio")
            this.auxiliar.push(element)

        if(institucionUsr!.substr(0,2) == "PC")
          if(element[0] == "Arbol caido" || element[0] == "Escombros")
            this.auxiliar.push(element)   
              
        if(institucionUsr!.substr(0,2) == "SM")
          if(element[0] == "Vehiculo abandonado")
            this.auxiliar.push(element)   

        if(institucionUsr!.substr(0,2) == "IF")
          if(element[0] == "Socavón")
            this.auxiliar.push(element)   
  
        if(institucionUsr!.substr(0,2) == "Ad")
          this.auxiliar.push(element)    
      }
      noElPrimero = true
    });


    switch (this.auxiliar.length) {
      case 1:
        // NO EXISTEN DATOS PARA MOSTRAR
        this.auxiliar.length = 0
        console.log("No hay reportes en la opcion seleccionada")
        return
      case 2:
        this.ancho = '50%'
      break;
      case 3:
        this.ancho = '65%'
      break;
      case 4:
        this.ancho = '80%'
      break;
      default:
        this.ancho = '100%'
        break;
    }

  }



  
  Conclusiones(){
    let copia = this.auxiliar
    let totalReportes = 0
    let ultimoDiaDelMes
    
    this.conclusiones.length = 0
    copia.shift()

    copia.forEach((e: any) => {
      totalReportes += parseInt( e[1] ,10)
    });

    let datosMayorMenor = this.auxiliar.sort(function (a: any, b: any){
      return (b[1] - a[1])
    });

    var getDaysInMonth = function(month: any, year: any) {
      return new Date(year, month, 0).getDate();
    };
     
    ultimoDiaDelMes = getDaysInMonth(this.mesBase, this.añoBase)

    console.log(ultimoDiaDelMes)
    console.log(datosMayorMenor)

    if (datosMayorMenor[0][1] == 0) {
      this.conclusiones.push("No existe ningún registro de reportes durante el año seleccionado.")
    } else {
      this.conclusiones.push(["Este año se registraron un total de " + totalReportes + " problemas cronicos."])
      this.conclusiones.push(["El problema cronico más reportado este mes es " + copia[0][0] + " con " + copia[0][1] + " reportes realizados."])
      this.conclusiones.push(["El problema cronico menos reportado este mes es " + copia[copia.length - 1][0] + " con " + copia[copia.length - 1][1] + " reportes realizados."])
      // this.conclusiones.push(["El promedio de reportes generados es de " + (totalReportes/ultimoDiaDelMes).toFixed(2) + " cada dia."])
    }

  }


}
