import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { switchMap, filter, flatMap, map, toArray } from 'rxjs/operators';

import { EnvService } from 'src/app/env/env.service';

import { DashboardService } from '../dashboard.service';
import { ActivatedRoute } from '@angular/router';

import { BuildStatus } from '../build-status';

@Component({
  selector: 'app-dashboard-overview',
  templateUrl: './dashboard-overview.component.html',
  styleUrls: ['./dashboard-overview.component.scss']
})
export class DashboardOverviewComponent implements OnInit {
  buildStatuses$: Observable<BuildStatus[]>;
  branch = 'develop';

  constructor(
    private env: EnvService,
    private httpClient: HttpClient,
    private service: DashboardService,
    private route: ActivatedRoute
  ) { }

  async ngOnInit() {
    this.buildStatuses$ = await this.route.paramMap.pipe(
      switchMap(() => {
        return this.service.getBuildStatuses(this.branch);
      })
    );
  }
}
