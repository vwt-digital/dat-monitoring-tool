import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { LoginComponent } from './components/login/login.component';
import { PageNotAuthorizedComponent } from './components/page-not-authorized/page-not-authorized.component';
import { ErrorsOverviewComponent } from './errors-overview/errors-overview.component';
import { SecurityCommandCentreComponent } from './security-command-centre/security-command-centre.component';
import { IAMCentreComponent } from './iam-centre/iam-centre.component';
import { DashboardOverviewComponent } from './dashboard/dashboard-overview/dashboard-overview.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardOverviewComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'errors-overview',
    component: ErrorsOverviewComponent,
  },
  {
    path: 'security-command-centre',
    component: SecurityCommandCentreComponent,
  },
  {
    path: 'iam-centre',
    component: IAMCentreComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
    pathMatch: 'full'
  },
  {
    path: 'not-authorized',
    component: PageNotAuthorizedComponent,
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  }
];

@NgModule({
    imports: [
      RouterModule.forRoot(routes)
    ],
    exports: [
      RouterModule
    ]
  })
  export class AppRoutingModule { }
