import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { DashboardOverviewComponent } from './dashboard-overview/dashboard-overview.component';
import { BuildStatusComponent } from '../components/build-status/build-status.component';
import { TimeDifferencePipe } from './time-difference.pipe';

@NgModule({
  declarations: [
    DashboardOverviewComponent,
    BuildStatusComponent,
    TimeDifferencePipe
  ],
  imports: [
    CommonModule,
    NgbModule,
    DashboardRoutingModule
  ],
  exports: [
    BuildStatusComponent,
    TimeDifferencePipe
  ]
})
export class DashboardModule { }
