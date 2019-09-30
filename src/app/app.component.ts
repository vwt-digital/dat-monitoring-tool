import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { EnvService } from './env/env.service';
import { AuthRoleService } from './auth/auth-role.service';

import { OAuthService, AuthConfig } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  constructor(
    private env: EnvService,
    private oauthService: OAuthService,
    private route: ActivatedRoute,
    private router: Router,
    public authRoleService: AuthRoleService
  ) {
    const config = new AuthConfig();
    config.loginUrl = env.loginUrl;
    config.redirectUri = window.location.origin + '/index.html';
    config.logoutUrl = env.logoutUrl;
    config.clientId = env.clientId;
    config.scope = env.scope;
    config.issuer = env.issuer;
    config.silentRefreshRedirectUri = window.location.origin + '/silent-refresh.html';

    this.oauthService.configure(config);
    this.oauthService.setupAutomaticSilentRefresh();
    this.oauthService.tryLogin({});
  }
}
