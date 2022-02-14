import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../../../services/login/login.service'
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class InvitadoGuard implements CanActivate {
  constructor(private loginService: LoginService, private router: Router){}

  canActivate(){
    let u = this.loginService.getTipoUsuario();
    console.log(u);

    if(!u) return true;
    
    console.log("lo siento, no cuentas con los permisos")
    this.router.navigate(['/mapa-reportes'])
    return false;
  }
  
}
