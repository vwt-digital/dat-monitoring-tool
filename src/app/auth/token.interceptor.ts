import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { EnvService } from '../env/env.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private env: EnvService
  ) {}
  intercept(request: HttpRequest<object>, next: HttpHandler): Observable<HttpEvent<object>> {

    if (sessionStorage.getItem('apiKey') && request.url.includes(this.env.apiUrl)) {
      request = request.clone({
        setHeaders: {
          'x-api-key': sessionStorage.getItem('apiKey')
        }
      });
    }

    return next.handle(request);
  }
}
