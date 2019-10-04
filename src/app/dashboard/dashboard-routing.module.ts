import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from 'src/app/auth/auth.guard';

import { DashboardOverviewComponent } from './dashboard-overview/dashboard-overview.component';

const dashboardRoutes: Routes = [
  {
    path: 'dashboard',
    component: DashboardOverviewComponent,
    canActivate: [AuthGuard]
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
