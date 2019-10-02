import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { DashboardOverviewComponent } from './dashboard-overview/dashboard-overview.component';
import { BuildStatusesComponent } from '../components/build-statuses/build-statuses.component';
import { TimeDifferencePipe } from './time-difference.pipe';

@NgModule({
  declarations: [
    DashboardOverviewComponent,
    BuildStatusesComponent,
    TimeDifferencePipe
  ],
  imports: [
    CommonModule,
    NgbModule,
    DashboardRoutingModule
  ],
  exports: [
    BuildStatusesComponent,
    TimeDifferencePipe
  ]
})
export class DashboardModule { }
