import { Component, OnInit, Input } from '@angular/core';

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

  constructor() { }

  ngOnInit() { }
}
