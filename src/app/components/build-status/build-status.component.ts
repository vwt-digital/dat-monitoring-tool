import { Component, OnInit, Input } from '@angular/core';

import { BuildTriggerStatus } from 'src/app/dashboard/build-status';

@Component({
  selector: 'app-build-status',
  templateUrl: './build-status.component.html',
  styleUrls: ['./build-status.component.scss']
})
export class BuildStatusComponent implements OnInit {
  @Input() buildStatuses: any;
  @Input() buildStatusType: string;
  @Input() buildStatusKind: string;
  @Input() buildStatusAmount: number = null;

  constructor() { }

  ngOnInit() { }

  getFilteredStatuses(status: string, amount: number = null) {
    let filteredStatuses = [];

    for (const buildStatus of this.buildStatuses) {
      if (buildStatus.status === status) {
        filteredStatuses.push(buildStatus);
      }
    }

    filteredStatuses = filteredStatuses.sort((a, b) => a.updated > b.updated ? -1 : (a.updated < b.updated ? 1 : 0));
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

  outlineColor(buildStatus: string) {
    if (buildStatus === 'pending') {
      return 'orange';
    } else if (buildStatus === 'failing') {
      return 'red';
    } else {
      return 'green';
    }
  }

  outlineIcon(buildStatus: string) {
    if (buildStatus === 'pending') {
      return 'fa-sync-alt';
    } else if (buildStatus === 'failing') {
      return 'fa-exclamation-triangle';
    } else {
      return 'fa-check';
    }
  }

  badgeColor(buildStatus: BuildTriggerStatus) {
    if (buildStatus.status === 'pending') {
      return 'warning';
    } else if (buildStatus.status === 'failing') {
      return 'danger';
    } else {
      return 'success';
    }
  }

  badgeIcon(buildStatus: BuildTriggerStatus) {
    if (buildStatus.status === 'pending') {
      return 'fa-spinner fa-spin';
    } else if (buildStatus.status === 'failing') {
      return 'fa-times';
    } else {
      return 'fa-check';
    }
  }
}
