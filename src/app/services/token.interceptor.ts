import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { UtilidadService } from '../reutilizable/utilidad.service';
@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    private authService: UtilidadService) { }

  // Intercepta todas las solicitudes HTTP y agrega el token de autorización si está disponible

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

      // Manejo de errores de autorización o en caso de Token caducado, pues lo bota de una patada al login

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 403) {
          console.log("Vuelva a iniciar sesion")
          alert("Vuelva a iniciar sesion")
        }
        return throwError(error);
      })
    );
  }
}
