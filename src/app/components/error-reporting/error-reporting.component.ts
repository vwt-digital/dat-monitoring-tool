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

  cardHeader = 'Error reporting';
  cardHeaderIcon = 'fas fa-sitemap';
  cardColor = 'red';

  constructor(
    public service: DashboardService
  ) { }

  getFilteredErrorReporting(errorReporting: ErrorReport[], amount: number): ErrorReport[] {
    // tslint:disable-next-line:max-line-length
    let filteredStatuses = errorReporting.sort((a, b) => a.receive_timestamp > b.receive_timestamp ? -1 : (a.receive_timestamp < b.receive_timestamp ? 1 : 0));
    filteredStatuses = filteredStatuses.slice(0, amount);

    return filteredStatuses;
  }

  getLogUrl(error: ErrorReport): string {
    return this.service.getErrorLogsViewerUrl(error);
  }
}
