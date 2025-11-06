import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LocalStorageService } from '@localStorage';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    private localStorageService: LocalStorageService,
    protected router: Router
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
      const token= this.localStorageService.obtenerToken();
      if(token){
        request=request.clone({
          headers:request.headers.set("Authorization","Bearer "+token)
        });
      }

      return next.handle(request).pipe( tap(() => {},
      (err: any) => {
      if (err instanceof HttpErrorResponse) {
        this.handleError(err);
      }
    }));
  };

  handleError(error: HttpErrorResponse) {
    let _title: string = '';
    let _text: string = 'Empresa';
    switch (error.status) {
      case 0: {
        _title = 'Verifique Conexion'
        break;
      }
      case 400: {
        _title = 'Datos Invalidos'
        break;
      }
      case 401: {
        //
        _title = 'Sesion Caducada'
        of(_title)
          .pipe(delay(3000))
          .subscribe(() => this.router.navigate(['']));
        break;
      }
      default:{
        _title = 'Ocurrio un Error'
        break;
      }
    }

  }
}