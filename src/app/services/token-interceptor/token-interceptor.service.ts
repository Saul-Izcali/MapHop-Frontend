import { Injectable } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';
import { LoginService } from '../../services/login/login.service'

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor{
  
  constructor(private loginService: LoginService) { }

  intercept(req: { clone: (arg0: { setHeaders: { authorization: string; }; }) => any; }, next: { handle: (arg0: any) => any; }){
    const tokenReq = req.clone({
      setHeaders: {
        authorization: `Bearer ${this.loginService.getToken()}`
      }
    })
    return next.handle(tokenReq);
  }
}
