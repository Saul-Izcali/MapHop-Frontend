import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Notificacion } from "../../models/notificacion";

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {
  URL_API = 'https://maphop.herokuapp.com/';

  selectedNotificacion: Notificacion = {
    tipoNotificacion: '',
    usuarios: [
          {
              _id: ''
          }
      ]
  }

  notificaciones: Notificacion[] = [];

  constructor(private http: HttpClient) { }

  // Nueva notificación
  createNotificacion(notificacion: Notificacion) {
    return this.http.post(this.URL_API + 'nueva-notificacion', notificacion);
  }

  // Obtener notificaciones
  getNotificaciones() {
    return this.http.get<any[]>(this.URL_API + 'buscar-notificaciones');
  }
  
  // Obtener notificaciones de un usuario
  getNotificacionesUsuario(usuario: string) {
    return this.http.get<any[]>(this.URL_API + 'buscar-notificaciones/' + usuario);
  }

  // Modificar notificación
  editNotificacion(_id: string, usuario: any) {
    return this.http.put(this.URL_API + 'editar-notificacion/' + _id, {usuario});
  }

  // Borrar notificación
  deleteNotificacion(_id: string) {
    return this.http.delete(this.URL_API + 'borrar-notificacion/' + _id);
  }
}
