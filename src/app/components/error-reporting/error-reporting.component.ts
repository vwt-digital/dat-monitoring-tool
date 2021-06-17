import { Component, Input } from '@angular/core';

import { ErrorReport } from 'src/app/dashboard/error-report';
import { DashboardService } from 'src/app/dashboard/dashboard.service';

@Component({
  selector: 'app-error-reporting',
  templateUrl: './error-reporting.component.html',
  styleUrls: ['./error-reporting.component.scss']
})
export class ErrorReportComponent {
  @Input() errorReporting: ErrorReport[];
  @Input() errorReportingAmount: number = null;

  cardHeader = 'Stackdriver errors';
  cardHeaderIcon = 'fas fa-sitemap';
  cardColor = 'red';

  constructor(
    public service: DashboardService
  ) { }

  getFilteredErrorReporting(errorReporting: ErrorReport[], amount: number): ErrorReport[] {
    // tslint:disable-next-line:max-line-length
    let filteredStatuses = errorReporting.sort((a, b) => a.received_at > b.received_at ? -1 : (a.received_at < b.received_at ? 1 : 0));
    filteredStatuses = filteredStatuses.slice(0, amount);

    return filteredStatuses;
  }

  getLogUrl(error: ErrorReport): string {
    return this.service.getErrorLogsViewerUrl(error);
  }
}
