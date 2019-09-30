import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';
import { throwError } from 'rxjs';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private oauthService: OAuthService,
    private router: Router
  ) { }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    try {
      await this.oauthService.tryLogin();
    } catch (error) {
      throwError(error);
    }

    if (this.oauthService.hasValidAccessToken()) {
      const claims = this.oauthService.getIdentityClaims();
      if (!claims['roles'] && claims['roles'].length <= 0) {
        this.router.navigate(['not-authorized']);
      }
      return true;
    }
    this.oauthService.initImplicitFlow();
    return false;
  }
}
