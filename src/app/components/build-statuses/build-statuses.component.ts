import { Component, OnInit, Input } from '@angular/core';
import { BuildStatus } from 'src/app/dashboard/build-status';

@Component({
  selector: 'app-build-statuses',
  templateUrl: './build-statuses.component.html',
  styleUrls: ['./build-statuses.component.scss']
})
export class BuildStatusesComponent implements OnInit {
  @Input() buildStatuses: any;

  constructor() { }

  ngOnInit() { }

  getFilteredStatuses(status: string, amount: number = null) {
    let filteredStatuses = [];

    for (const buildStatus of this.buildStatuses) {
      if (buildStatus.status === status) {
        filteredStatuses.push(buildStatus);
      }
    }

    filteredStatuses = filteredStatuses.sort((a, b) => a.updated > b.updated ? -1 : (a.updated < b.updated ? 1 : 0))
    if (amount) {
      filteredStatuses = filteredStatuses.slice(0, amount);
    }

    return filteredStatuses;
  }

  getFilteredStatusesCount(status: string) {
    let filteredCount = 0;

    for (const buildStatus of this.buildStatuses) {
      if (buildStatus.status === status) {
        filteredCount++;
      }
    }

    return filteredCount;
  }

  color(buildStatus: BuildStatus) {
    if (buildStatus.status === 'pending') {
      return 'warning';
    } else if (buildStatus.status === 'failing') {
      return 'danger';
    } else {
      return 'success';
    }
  }
  icon(buildStatus: BuildStatus) {
    if (buildStatus.status === 'pending') {
      return 'fa-spinner fa-spin';
    } else if (buildStatus.status === 'failing') {
      return 'fa-times';
    } else {
      return 'fa-check';
    }
  }
}