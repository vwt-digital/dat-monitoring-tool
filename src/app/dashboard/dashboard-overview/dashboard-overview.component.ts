import { Component, OnInit, OnDestroy } from '@angular/core';

import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-dashboard-overview',
  templateUrl: './dashboard-overview.component.html',
  styleUrls: ['./dashboard-overview.component.scss']
})
export class DashboardOverviewComponent implements OnDestroy, OnInit {
  buildStatuses: any;

  constructor(
    private service: DashboardService
  ) { }

  async ngOnInit() {
    this.buildStatuses = this.service.buildStatuses$;

    await this.refreshData();
    if (!this.service.isInvalidRequest) {
      this.service.intervalIsSet = true;
      this.service.interval = setInterval(() => {
        this.refreshData();
      }, this.service.refreshTime);
    }
  }

  refreshData() {
    console.log('--- REFRESHING ---');
    this.service.updateData();
  }

  ngOnDestroy() {
    clearInterval(this.service.interval);
    this.service.intervalIsSet = false;
  }
}
