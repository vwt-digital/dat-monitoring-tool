import { Component, OnInit, OnDestroy } from '@angular/core';
import { trigger, transition, state, style, animate } from '@angular/animations';

import { DashboardService } from '../dashboard.service';
import { LoaderService } from 'src/app/loader.service';

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
  buildTriggerStatuses: any;
  buildOtherStatuses: any;
  blinkInterval: any;
  blinkingIcon = 'visible';

  constructor(
    public loader: LoaderService,
    public service: DashboardService
  ) {
    this.blinkInterval = setInterval(() => {
      this.blinkingIcon = (this.blinkingIcon === 'visible') ? 'invisible' : 'visible';
    }, 500);
  }

  async ngOnInit() {
    this.buildTriggerStatuses = this.service.buildTriggerStatuses$;
    this.buildOtherStatuses = this.service.buildOtherStatuses$;
    this.loader.isError.subscribe(
      res => this.service.hasError = res
    );

    await this.refreshData();
    this.service.interval = setInterval(() => {
      this.refreshData();
    }, this.service.refreshTime);
  }

  refreshData() {
    console.log('--- REFRESHING ---');
    this.service.updateData();
  }

  ngOnDestroy() {
    clearInterval(this.service.interval);
    clearInterval(this.blinkInterval);
  }
}
