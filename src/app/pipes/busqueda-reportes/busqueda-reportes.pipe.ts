import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'busquedaReportes'
})
export class BusquedaReportesPipe implements PipeTransform {

  transform(value: any, arg: any): any {
    const resReportes = [];

    // Compara el valor recibido con la base de datos, si existe conincidencias regresa el resultado
    for(const reporte of value){
      if(reporte._id.toLowerCase().indexOf(arg.toLowerCase()) > -1 || reporte._id.toLowerCase().indexOf(arg.toLowerCase()) > -1) {
        resReportes.push(reporte);
      }
    }

    return resReportes;
  }

}
