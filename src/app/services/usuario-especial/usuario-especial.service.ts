import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { UsuarioEspecial } from "../../models/usuario-especial";

@Injectable({
  providedIn: 'root'
})
export class UsuarioEspecialService {

  URL_API = 'https://maphop.herokuapp.com/registro-especial';

  selectedUsuario: UsuarioEspecial = {
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    correoElectronico: '',
    nombreUsuario: '',
    contrasena: '',
    usuarioEspecial: {
      imagen: '',
      validado: false
    }
  };

  usuarios: UsuarioEspecial[] = [];

  constructor(private http: HttpClient) { }

  createUsuario(formData: FormData) {
    return this.http.post(this.URL_API, formData);
  }

  getUsuarios() {
    return this.http.get<any>('http://localhost:4000/buscarEspecial');
  }

  getUsuario(_id?: string) {
    return this.http.get<UsuarioEspecial>("http://localhost:4000/registro/" + _id);
  }

  editUsuario(usuarios: UsuarioEspecial) {
    let url = "http://localhost:4000/registro/" + usuarios._id;
    return this.http.put(url, usuarios);
  }

  aceptarEspecial(_id?: string) {
    let url = "http://localhost:4000/aceptar-especial/" + _id;
    return this.http.post(url, {validado: true});
  }

  deleteUsuario(_id?: string) {
    let url = "http://localhost:4000/registro/" + _id
    return this.http.delete(url);
  }
}
