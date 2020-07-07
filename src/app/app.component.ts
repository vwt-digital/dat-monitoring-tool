import { Component } from '@angular/core';

import { EnvService } from './env/env.service';
import { AuthService } from './auth/auth.service';

import { LicenseManager } from 'ag-grid-enterprise';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  constructor(
    private env: EnvService,
    public authService: AuthService
  ) {
    LicenseManager.setLicenseKey(env.agGridKey);
  }
}
