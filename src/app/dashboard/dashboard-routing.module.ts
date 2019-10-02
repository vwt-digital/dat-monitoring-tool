import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from 'src/app/auth/auth.guard';
import { Role } from 'src/app/auth/role.model';
import { RoleGuard } from '../auth/role.guard';

import { DashboardOverviewComponent } from './dashboard-overview/dashboard-overview.component';

const dashboardRoutes: Routes = [
  {
    path: 'dashboard',
    component: DashboardOverviewComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [Role.Read] }
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(dashboardRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class DashboardRoutingModule { }
