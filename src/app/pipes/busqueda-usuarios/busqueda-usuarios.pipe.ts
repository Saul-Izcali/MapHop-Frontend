import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'busquedaUsuarios'
})
export class BusquedaUsuariosPipe implements PipeTransform {

  transform(value: any, arg: any): any {
    const resUsuarios = [];

    // Compara el valor recibido con la base de datos, si existe conincidencias regresa el resultado
    for(const usuario of value){
      if(usuario.nombreUsuario.toLowerCase().indexOf(arg.toLowerCase()) > -1 || usuario._id.toLowerCase().indexOf(arg.toLowerCase()) > -1) {
        resUsuarios.push(usuario);
      }
    }

    return resUsuarios;
  }

}
