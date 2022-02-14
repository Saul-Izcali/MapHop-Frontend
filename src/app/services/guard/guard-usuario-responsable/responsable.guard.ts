import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../../../services/login/login.service'
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class ResponsableGuard implements CanActivate {
  constructor(private loginService: LoginService, private router: Router){}

  canActivate(route: ActivatedRouteSnapshot){
    // despues de checar el tipo de usuario si es responsable retorna un true aqui
    // caso contrario un false
      let u = this.loginService.getTipoUsuario();

      if(u == "responsable" || u == "admin") return true;
      
      console.log("lo siento, no cuentas con los permisos");

      this.router.navigate(['/'])
      return false;

  }
  
}
