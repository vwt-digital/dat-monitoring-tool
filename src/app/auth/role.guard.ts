import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';

import { OAuthService } from 'angular-oauth2-oidc';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private oauthService: OAuthService,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const claims = this.oauthService.getIdentityClaims();

    if (route.data.roles && (claims as any).roles) {
      let isAuthorisedRoute = false;
      for (const value of (claims as any).roles) {
        if (route.data.roles.indexOf(value) > -1) {
          isAuthorisedRoute = true;
        }
      }

      if (isAuthorisedRoute) {
          return true;
      }
    }

    this.router.navigate(['404']);
    return false;
  }
}
