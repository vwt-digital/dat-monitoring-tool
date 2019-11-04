import { Component, OnInit, Input } from '@angular/core';

import { ErrorReport } from 'src/app/dashboard/error-report';

@Component({
  selector: 'app-error-reporting',
  templateUrl: './error-reporting.component.html',
  styleUrls: ['./error-reporting.component.scss']
})
export class ErrorReportComponent implements OnInit {
  @Input() errorReporting: any;
  @Input() errorReportingAmount: number = null;

  cardHeader = 'Error reporting';
  cardHeaderIcon = 'fas fa-sitemap';
  cardColor = 'red';

  getFilteredErrorReporting(errorReporting: ErrorReport[], amount: number) {
    let filteredStatuses = errorReporting.sort((a, b) => a.receive_timestamp > b.receive_timestamp ? -1 : (a.receive_timestamp < b.receive_timestamp ? 1 : 0));
    filteredStatuses = filteredStatuses.slice(0, amount);

    return filteredStatuses;
  }

  getLogUrl(errorReporting: any) {
    if (errorReporting['log_url']) {
      return errorReporting['log_url'];
    } else {
      return `https://console.cloud.google.com/errors?project=${errorReporting.project_id}`
    }
  }

  constructor() { }

  ngOnInit() { }
}
