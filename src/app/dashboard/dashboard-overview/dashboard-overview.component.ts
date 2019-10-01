import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { EnvService } from 'src/app/env/env.service';

import { DashboardService } from '../dashboard.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard-overview',
  templateUrl: './dashboard-overview.component.html',
  styleUrls: ['./dashboard-overview.component.scss']
})
export class DashboardOverviewComponent implements OnDestroy, OnInit {
  buildStatuses: any;
  interval: any;

  constructor(
    private env: EnvService,
    private httpClient: HttpClient,
    private service: DashboardService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.buildStatuses = this.service.buildStatuses$;

    this.refreshData();
    this.interval = setInterval(() => {
        this.refreshData();
    }, 10000);
  }

  refreshData() {
    console.log('--- REFRESHING ---');
    this.service.updateData();
  }

  ngOnDestroy() {
    this.buildStatuses.unsubscribe();
  }
}
