import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { UsuarioComun } from "../../models/usuario-comun";

@Injectable({
  providedIn: 'root'
})
export class UsuarioComunService {

  URL_API = 'https://maphop.herokuapp.com/registro';

  selectedUsuario: UsuarioComun = {
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    correoElectronico: '',
    nombreUsuario: '',
    contrasena: ''
  };

  usuarios: UsuarioComun[] = [];

  constructor(private http: HttpClient) { }

  createUsuario(usuarios: UsuarioComun) {
    return this.http.post<UsuarioComun[]>(this.URL_API, usuarios);
  }

  getUsuarios() {
    return this.http.get<any[]>('http://localhost:4000/buscarComun');
  }
  
  getUsuario(_id?: string) {
    return this.http.get<UsuarioComun>(this.URL_API + '/' + _id);
  }

  editUsuario(_id?: string, usuario?: any) {
    return this.http.put(this.URL_API + '/' + _id, usuario);
  }

  reputacionUsuario(reputacionUsr?: any) {
    return this.http.put('http://localhost:4000/reputacion', reputacionUsr);
  }

  deleteUsuario(_id?: string) {
    return this.http.delete(this.URL_API + '/' + _id);
  }
  
  getNombresUsuarios(){
    return this.http.get<any[]>('http://localhost:4000/nombresUsuarios');
  }

  getCorreosUsuarios(){
    return this.http.get<any[]>('http://localhost:4000/correosUsuarios');
  }
}
