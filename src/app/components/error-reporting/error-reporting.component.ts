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
    let filteredStatuses = errorReporting.sort((a, b) => a.latest_updated > b.latest_updated ? -1 : (a.latest_updated < b.latest_updated ? 1 : 0));
    filteredStatuses = filteredStatuses.slice(0, amount);

    return filteredStatuses;
  }

  constructor() { }

  ngOnInit() { }
}
