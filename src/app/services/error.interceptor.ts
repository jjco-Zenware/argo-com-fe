import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Lo sentimos ocurrió un error';
        
        if (error.error instanceof ErrorEvent) {
          errorMessage = `error: ${error.error.message}`;
        } else if (error.status === 0) {
          errorMessage = 'API server rechazo la conexión.';
        } else if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }

        //console.error(errorMessage);
        return throwError(errorMessage);
      })
    );
  }
}
