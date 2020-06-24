import { Component, OnInit, Input } from '@angular/core';

import { BuildTriggerStatus } from 'src/app/dashboard/build-status';

@Component({
  selector: 'app-build-status',
  templateUrl: './build-status.component.html',
  styleUrls: ['./build-status.component.scss']
})
export class BuildStatusComponent implements OnInit {
  @Input() buildStatuses: BuildTriggerStatus[];
  @Input() buildStatusType: string;
  @Input() buildStatusKind: string;
  @Input() buildStatusAmount: number = null;
  @Input() totalDays: number = null;

  cardHeader: string;
  cardHeaderIcon: string;
  cardColor: string;

  ngOnInit(): void {
    if (this.buildStatusKind === 'trigger') {
      this.cardHeader = 'Cloud Builds';
      this.cardHeaderIcon = 'fas fa-code';
      this.cardColor = 'blue';
    } else {
      this.cardHeader = 'Other';
      this.cardHeaderIcon = 'fas fa-question';
      this.cardColor = 'gray';
    }
  }

  getFilteredStatuses(status: string, amount: number = null): BuildTriggerStatus[] {
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

  getFilteredStatusesCount(status: string): number {
    let filteredCount = 0;

    for (const buildStatus of this.buildStatuses) {
      if (buildStatus.status === status) {
        filteredCount++;
      }
    }

    return filteredCount;
  }

  getLogUrl(buildStatus: BuildTriggerStatus): string {
    if (buildStatus['log_url']) {
      return buildStatus['log_url'];
    } else {
      return `https://console.cloud.google.com/cloud-build/builds?project=${buildStatus.project_id}`;
    }
  }

  outlineColor(buildStatus: string): string {
    if (buildStatus === 'pending') {
      return 'orange';
    } else if (buildStatus === 'failing') {
      return 'red';
    } else {
      return 'green';
    }
  }

  outlineIcon(buildStatus: string): string {
    if (buildStatus === 'pending') {
      return 'fa-sync-alt';
    } else if (buildStatus === 'failing') {
      return 'fa-exclamation-triangle';
    } else {
      return 'fa-check';
    }
  }

  badgeColor(buildStatus: BuildTriggerStatus): string {
    if (buildStatus.status === 'pending') {
      return 'warning';
    } else if (buildStatus.status === 'failing') {
      return 'danger';
    } else {
      return 'success';
    }
  }

  badgeIcon(buildStatus: BuildTriggerStatus): string {
    if (buildStatus.status === 'pending') {
      return 'fa-spinner fa-spin';
    } else if (buildStatus.status === 'failing') {
      return 'fa-times';
    } else {
      return 'fa-check';
    }
  }
}
