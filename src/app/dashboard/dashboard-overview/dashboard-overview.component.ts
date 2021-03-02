import { Component, OnInit, OnDestroy } from '@angular/core';
import { trigger, transition, state, style, animate } from '@angular/animations';

import { DashboardService } from '../dashboard.service';
import { LoaderService } from 'src/app/loader.service';
import { BuildTriggerStatus } from '../build-status';
import { ErrorReport, ErrorReportCount } from '../error-report';
import { SecurityNotification } from '../security-notification';

import { NgxMasonryOptions } from 'ngx-masonry';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-dashboard-overview',
  templateUrl: './dashboard-overview.component.html',
  styleUrls: ['./dashboard-overview.component.scss'],
  animations: [
    trigger('showhide', [
      state('invisible', style({opacity: '0'})),
      state('visible', style({opacity: '1'})),
      transition('invisible <=> visible', animate('.5s linear'))
    ])
  ]
})

export class DashboardOverviewComponent implements OnDestroy, OnInit {
  buildTriggerStatuses: BehaviorSubject<BuildTriggerStatus[]>;
  errorReporting: BehaviorSubject<ErrorReport[] | ErrorReportCount[]>;
  securityNotifications: BehaviorSubject<SecurityNotification[] | SecurityNotification[]>;
  blinkInterval: number;
  blinkingIcon = 'visible';

  public masonryOptions: NgxMasonryOptions = {
    animations: {
      show: [
        style({opacity: 0}),
        animate('500ms ease-in', style({opacity: 1})),
      ],
      hide: [
        style({opacity: '*'}),
        animate('500ms ease-in', style({opacity: 0})),
      ]
    }
  };

  constructor(
    public loader: LoaderService,
    public service: DashboardService
  ) {
    this.blinkInterval = window.setInterval(() => {
      this.blinkingIcon = (this.blinkingIcon === 'visible') ? 'invisible' : 'visible';
    }, 500);
  }

  async ngOnInit(): Promise<void> {
    this.buildTriggerStatuses = this.service.buildTriggerStatuses$;
    this.errorReporting = this.service.errorReporting$;
    this.securityNotifications = this.service.securityNotifications$;

    this.loader.isError.subscribe(
      res => this.service.hasError = res
    );

    this.refreshData();
    this.service.interval = window.setInterval(() => {
      this.refreshData();
    }, this.service.refreshTime);
  }

  refreshData(): void {
    console.log('--- REFRESHING ---');
    this.service.updateData();
  }

  ngOnDestroy(): void {
    clearInterval(this.service.interval);
    clearInterval(this.blinkInterval);
  }
}
