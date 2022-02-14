import { Component, OnInit } from '@angular/core';
import { GraficasService } from 'src/app/services/graficas/graficas.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

declare var google: any;

@Component({
  selector: 'app-grafica2',
  templateUrl: './grafica2.component.html',
  styleUrls: ['./grafica2.component.css']
})
export class Grafica2Component implements OnInit {

  fecha = new Date()

  mesBase: any = 0
  añoBase: any = 0

  institucionSeleccionada = "Ad";

  auxiliar: any = [ ]
  conclusiones: any = [  ]

  ordenDatos: any = [
    ['Problema', 'Reportados', 'Solucionados'],
    ['Alumbrado', 0, 0],
    ['Inundacion', 0, 0],
    ['Fuga de agua', 0, 0],
    ['Falta de alcantarilla', 0, 0],
    ['Alcantarilla obstruida', 0, 0],
    ['Escombros', 0, 0],
    ['Vehiculo abandonado', 0, 0],
    ['Arbol caido', 0, 0],
    ['Socavón', 0, 0],
    ['Cables', 0, 0],
    ['Incendio', 0, 0]
  ]

  materialOptions = {
    width: 1350,
    chart: {
      title: 'Diferencia de reportes',
      subtitle: 'Problemas reportados a la izquierda, problemas solucionados a la derecha'
    },
    backgroundColor: 'transparent',
    series: {
      0: { axis: 'Reportados', color: '#f5714e' }, // Bind series 0 to an axis named 'Reportados'.
      1: { axis: 'Solucionados', color: '#42dcd5' } // Bind series 1 to an axis named 'Solucionados'.
    },
  };
  

  constructor(public graficasService: GraficasService) {
    this.mesBase = this.fecha.getMonth() + 1
    this.añoBase = this.fecha.getFullYear().toString()
   }

      //   EN ESTA GRAFICA BAJAR LAS CONCLUSIONES CUANDO SE ENTRE CON EL ADMIN
      //   EN CASO DE QUE SEA UN RERESPONSABLE PONERLAS A LA DERECHA DE LA GRAFICA Y REDUCIR EL TAMAÑO DE LA GRAFICA
      //   PARA QUE QUEPAN LAS DOS EN FILA
  ngOnInit(): void {
    let solucionados: any, elResto: any;

    
    this.graficasService.getReportesGrafica2(this.mesBase, this.añoBase).subscribe(
      res => {
        console.log(res)
        google.charts.load('current', {'packages':['corechart', 'bar']});
        google.charts.setOnLoadCallback( () => {
          var chartDiv = document.getElementById('chart_div');

          solucionados = res.solucionados
          elResto = res.elResto

          this.Convertir( elResto, solucionados)
  
          var data = google.visualization.arrayToDataTable(this.auxiliar);
  
          var materialChart = new google.charts.Bar(chartDiv);
          materialChart.draw(data, google.charts.Bar.convertOptions(this.materialOptions));

          this.Conclusiones();
        });
        },
      err => {
        console.error(err);
      });


    this.graficasService.disparadorDeMes.subscribe(res => {
      this.mesBase = res
      console.log(res, "---------------------------------------")
      this.graficasService.getReportesGrafica2(this.mesBase, this.añoBase).subscribe(
        res => {
          google.charts.load('current', {'packages':['corechart', 'bar']});
          google.charts.setOnLoadCallback( () => {
            var chartDiv = document.getElementById('chart_div');
            
            solucionados = res.solucionados
            elResto = res.elResto

            for(let que = 1; que < this.ordenDatos.length; que++){
              this.ordenDatos[que][1] = 0
              this.ordenDatos[que][2] = 0
            }

            this.Convertir(elResto, solucionados)

    
            var data = google.visualization.arrayToDataTable(this.auxiliar);
    
            var materialChart = new google.charts.Bar(chartDiv);
            materialChart.draw(data, google.charts.Bar.convertOptions(this.materialOptions));

            this.Conclusiones();
          });
          },
        err => {
          console.error(err);
        });
    })


    this.graficasService.disparadorDeAño.subscribe(res => {
      this.añoBase = res
      console.log(res)
      this.graficasService.getReportesGrafica2(this.mesBase, this.añoBase).subscribe(
        res => {
          console.log(res)
          google.charts.load('current', {'packages':['corechart', 'bar']});
          google.charts.setOnLoadCallback( () => {
            var chartDiv = document.getElementById('chart_div');

            solucionados = res.solucionados
            elResto = res.elResto

            for(let que = 1; que < this.ordenDatos.length; que++){
              this.ordenDatos[que][1] = 0
              this.ordenDatos[que][2] = 0
            }

            this.Convertir(elResto, solucionados)
    
            var data = google.visualization.arrayToDataTable(this.auxiliar);
    
            var materialChart = new google.charts.Bar(chartDiv);
            materialChart.draw(data, google.charts.Bar.convertOptions(this.materialOptions));

            this.Conclusiones();
          });
          },
        err => {
          console.error(err);
        });
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

        this.graficasService.getReportesGrafica2(this.mesBase, this.añoBase).subscribe(
          res => {
            console.log(res)
            google.charts.load('current', {'packages':['corechart', 'bar']});
            google.charts.setOnLoadCallback( () => {
              var chartDiv = document.getElementById('chart_div');
  
              solucionados = res.solucionados
              elResto = res.elResto
  
              for(let que = 1; que < this.ordenDatos.length; que++){
                this.ordenDatos[que][1] = 0
                this.ordenDatos[que][2] = 0
              }
  
              this.Convertir(elResto, solucionados)
      
              var data = google.visualization.arrayToDataTable(this.auxiliar);
      
              var materialChart = new google.charts.Bar(chartDiv);
              materialChart.draw(data, google.charts.Bar.convertOptions(this.materialOptions));
  
              this.Conclusiones();
            });
            },
          err => {
            console.error(err);
          });
    });


    this.graficasService.disparadorDescargar.subscribe(res => {
      console.log(res)
      if(res == "Grafica 2"){
        console.log("hola")
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


  Convertir(a: any, b: any){
    a.forEach((e: any) => {
      switch (e.tipoProblema) {
        case "Alumbrado":
          this.ordenDatos[1][1]++
          break;
        case "Inundación":
          this.ordenDatos[2][1]++
          break;
        case "Fuga de agua":
          this.ordenDatos[3][1]++
          break;
        case "Falta de alcantarilla":
          this.ordenDatos[4][1]++
          break;
        case "Alcantarilla obstruida":
          this.ordenDatos[5][1]++
          break;
        case "Escombros tirados":
          this.ordenDatos[6][1]++
        break;
        case "Vehículo abandonado":
          this.ordenDatos[7][1]++
          break;
        case "Árbol caído":
          this.ordenDatos[8][1]++
          break;
        case "Socavón":
          this.ordenDatos[9][1]++
          break;
        case "Cables caídos":
          this.ordenDatos[10][1]++
          break;
        case "Incendio":
          this.ordenDatos[11][1]++
          break;
        default:
          this.ordenDatos[12][1]++
          break;
      }
    });
    b.forEach((e: any) => {
      switch (e.tipoProblema) {
        case "Alumbrado":
          this.ordenDatos[1][2]++
          break;
        case "Inundación":
          this.ordenDatos[2][2]++
          break;
        case "Fuga de agua":
          this.ordenDatos[3][2]++
          break;
        case "Falta de alcantarilla":
          this.ordenDatos[4][2]++
          break;
        case "Alcantarilla obstruida":
          this.ordenDatos[5][2]++
          break;
        case "Escombros tirados":
          this.ordenDatos[6][2]++
        break;
        case "Vehículo abandonado":
          this.ordenDatos[7][2]++
          break;
        case "Árbol caído":
          this.ordenDatos[8][2]++
          break;
        case "Socavón":
          this.ordenDatos[9][2]++
          break;
        case "Cables caídos":
          this.ordenDatos[10][2]++
          break;
        case "Incendio":
          this.ordenDatos[11][2]++
          break;
        default:
          console.log("Entro al default")
          break;
      }
    });

    this.auxiliar.length = 0
    this.auxiliar.push(['Problema', 'Reportados', 'Solucionados'])

    let institucion;

    if(localStorage.getItem('Usr') == "Admin") { // Si es Admin se toma la institución del select
      institucion = this.institucionSeleccionada;
    }
    else { // Si no es Admin se toma la institución que le corresponde
      institucion = localStorage.getItem('Usr')!;
    }
    let institucionUsr = institucion;

    let noElPrimero = false
    this.ordenDatos.forEach((element: any) => {
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
  }


  Conclusiones(){
    let copia = this.auxiliar
    let totalReportesSolucionados = 0, totalReportesHechos = 0
    let ultimoDiaDelMes
    // ['Problema', 'Reportados', 'Solucionados'],
    
    this.conclusiones.length = 0
    copia.shift()

    copia.forEach((e: any) => {
      totalReportesHechos += parseInt( e[1] ,10)
      totalReportesSolucionados += parseInt( e[2] ,10)
    });
    
    let datosMayorMenorReportados = this.auxiliar.sort(function (a: any, b: any){
      return (b[1] - a[1])
    });
    let datosMayorMenorSolucionados = this.auxiliar.sort(function (a: any, b: any){
      return (b[2] - a[2])
    });

    var getDaysInMonth = function(month: any, year: any) {
      return new Date(year, month, 0).getDate();
    };
     
    ultimoDiaDelMes = getDaysInMonth(this.mesBase, this.añoBase)

    console.log(ultimoDiaDelMes)
    console.log(datosMayorMenorReportados)

    if (datosMayorMenorReportados[0][1] == 0) {
      this.conclusiones.push("No existe ningún registro de reportes durante el mes y año seleccionados")
    } else {
      this.conclusiones.push(["Este mes se reportaron un total de " + totalReportesHechos + " problemas de los cuales fueron solucionados " + totalReportesSolucionados ])
      
        copia.forEach((e: any) => {
          if(e[1] > 0){
            this.conclusiones.push(["Se reportaron  " + e[1] + " problemas de " + e[0] + " de los cuales " + e[2] + " ya están resueltos, esto refleja una eficacia del " + (e[2]/e[1])*100 + "% en problemas de este tipo."])
          }
        });

    }

    // se han reportado 15 problemas de falta de alcantarillas de los cuales 14 ya están resueltos, esto muestra que el índice de eficacia de ese mes es de 93.3% en problemas de este tipo.


  }



}
