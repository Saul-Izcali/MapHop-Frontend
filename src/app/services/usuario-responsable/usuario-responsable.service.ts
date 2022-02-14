import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { UsuarioResponsable } from "../../models/usuario-responsable";
// import { Usuario } from "../../models/";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioResponsableService {
  numResp = 0;
  usuarioTemp = "";

  URL_API = 'https://maphop.herokuapp.com/registro-responsable';

  selectedUsuario: UsuarioResponsable = {
    // UsuarioResponsable.institucion: "",
    nombreUsuario: "",
    contrasena: "",
    usuarioResponsable: {
      institucion: ""
    }    
  };

  usuarios: UsuarioResponsable[] = [];

  constructor(private http: HttpClient) { }

  createUsuario(usuarios: UsuarioResponsable) {
    this.numResp = 0;

    usuarios.usuarioResponsable={
        institucion: "cualquiera"
        // institucion: usuarios.usuarioResponsable?.institucion
    }  
    usuarios.contrasena = "Aqui ponemos la contraseña temporal";
    usuarios.nombreUsuario = "Aqui ponemos el nombre de usuario temporal";


    return this.http.post<UsuarioResponsable[]>(this.URL_API, usuarios);
  }

  getUsuarios() {
    return this.http.get<any[]>('http://localhost:4000/buscarResponsable');
  }

  getUsuario(_id?: string) {
    return this.http.get<UsuarioResponsable>("http://localhost:4000/registro/" + _id);
  }

  editUsuario() {

  }

  deleteUsuario(_id?: string) {
    let url = "http://localhost:4000/registro/" + _id
    return this.http.delete(url);
  }
}