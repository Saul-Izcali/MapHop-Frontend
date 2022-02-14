import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  URL_API = 'https://maphop.herokuapp.com/';

  constructor(private http: HttpClient, private router: Router) { }

  ingresar(usuario: any){
    return this.http.post<any>(this.URL_API, usuario);
  }

  ingresado(){
    // si el token existe en el localStoreage regresa un true, si no existe un false
    return !!localStorage.getItem('token');
  }

  getToken(){
    return localStorage.getItem('token');
  }

  getTipoUsuario(){
    return localStorage.getItem('TipoUsr');
  }

  getUsuarioActual(){
    return localStorage.getItem('IDU');
  }

  getTipoUsuarioNLS(){
    let usuario = localStorage.getItem('IDU');
    
    return this.http.get<any>(this.URL_API + 'tipoUsuario/' + usuario);
  }

  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('IDU');
    localStorage.removeItem('TipoUsr');
    localStorage.removeItem('Usr');
    localStorage.removeItem('FinJornada');

    this.router.navigate(['/']);
  }

  usuarioRepetido(nombreUsuario: any){
    return this.http.post<any>(this.URL_API + "usuarioRepetido/", {nombreUsuario});
  }

  correoRepetido(correoElectronico: any){
    return this.http.post<any>(this.URL_API + "correoRepetido/", {correoElectronico})
  }

  compararContrasenas(idContrasena: any){
    return this.http.post<any>(this.URL_API + "comparar/", idContrasena);
  }
}
