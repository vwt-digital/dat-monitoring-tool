import { Component } from '@angular/core';

import { OAuthService } from 'angular-oauth2-oidc';
import { AuthRoleService } from '../auth/auth-role.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  title = 'Monitoring dashboard';

  constructor(
    private oauthService: OAuthService,
    public authRoleService: AuthRoleService
  ) {}
}
