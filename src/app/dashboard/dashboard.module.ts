import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { DashboardOverviewComponent } from './dashboard-overview/dashboard-overview.component';
import { BuildStatusesComponent } from '../components/build-statuses/build-statuses.component';

@NgModule({
  declarations: [
    DashboardOverviewComponent,
    BuildStatusesComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    DashboardRoutingModule
  ],
  exports: [
    BuildStatusesComponent
  ]
})
export class DashboardModule { }
