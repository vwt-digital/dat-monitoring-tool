import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { EnvService } from '../env/env.service';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private env: EnvService,
    public oauthService: OAuthService
  ) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (request.url.includes(this.env.apiUrl)) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.oauthService.getAccessToken()}`
        }
      });
    }

    return next.handle(request);
  }
}
