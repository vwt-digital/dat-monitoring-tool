import { Injectable } from '@angular/core';

import { OAuthService } from 'angular-oauth2-oidc';
import { Role } from './role.model';

@Injectable({
  providedIn: 'root'
})
export class AuthRoleService {

  constructor(
    private oauthService: OAuthService
  ) { }

  get hasValidAccessToken() {
    if (this.oauthService.hasValidAccessToken()) {
      return true;
    }
    return false;
  }

  get isAuthorized() {
    const claims = this.oauthService.getIdentityClaims();
    let isAuthorized = false;

    if (!claims || !(claims as any).roles) { return null; }

    for (const value of (claims as any).roles) {
      if (value === Role.Read) {
        isAuthorized = true;
      }
    }

    return isAuthorized;
  }

  get isRead() {
    const claims = this.oauthService.getIdentityClaims();
    let isAuthorized = false;

    if (!claims || !(claims as any).roles) { return null; }

    for (const value of (claims as any).roles) {
      if (value === Role.Read) {
        isAuthorized = true;
      }
    }

    return isAuthorized;
  }
}
