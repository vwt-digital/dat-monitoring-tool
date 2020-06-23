import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxMasonryModule } from 'ngx-masonry';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { DashboardOverviewComponent } from './dashboard-overview/dashboard-overview.component';
import { BuildStatusComponent } from '../components/build-status/build-status.component';
import { ErrorReportComponent } from '../components/error-reporting/error-reporting.component';
import { TimeDifferencePipe } from './time-difference.pipe';
import { TimeToTextPipe } from './time-to-text.pipe';
import { ReplaceValuePipe } from './replace-value.pipe';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    DashboardOverviewComponent,
    BuildStatusComponent,
    ErrorReportComponent,
    TimeDifferencePipe,
    TimeToTextPipe,
    ReplaceValuePipe
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgxMasonryModule,
    NgbModule
  ],
  exports: [
    BuildStatusComponent,
    ErrorReportComponent,
    TimeDifferencePipe,
    TimeToTextPipe,
    ReplaceValuePipe
  ]
})
export class DashboardModule { }
