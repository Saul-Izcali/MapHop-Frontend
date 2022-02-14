import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../../services/login/login.service'
import { Router } from "@angular/router";


@Injectable({
  providedIn: 'root'
})
export class AutenticacionGuard implements CanActivate {
  // el Guard es una forma de proteger las rutas desde el frontend

  constructor(private loginService: LoginService, private router: Router){}

  canActivate(): boolean{
    if(this.loginService.ingresado()) return true

    this.router.navigate(['/'])
    return false;
  }
}
