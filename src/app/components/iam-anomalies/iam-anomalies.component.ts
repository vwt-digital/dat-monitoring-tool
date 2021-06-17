import { Component, Input } from '@angular/core';

import { IAMAnomaly } from 'src/app/dashboard/iam-anomaly';
import { DashboardService } from 'src/app/dashboard/dashboard.service';

@Component({
  selector: 'app-iam-anomalies',
  templateUrl: './iam-anomalies.component.html',
  styleUrls: ['./iam-anomalies.component.scss']
})
export class IAMAnomaliesComponent {
  @Input() iamAnomalies: IAMAnomaly[];
  @Input() iamAnomaliesAmount: number = null;

  cardHeader = 'IAM';
  cardHeaderIcon = 'fas fa-user-shield';
  cardColor = 'red';

  constructor(
    public service: DashboardService
  ) { }

  get getFilteredAnomaliesCount(): number {
    let filteredCount = 0;

    for (const buildStatus of this.iamAnomalies) {
      if (buildStatus.active === true) {
        filteredCount++;
      }
    }

    return filteredCount;
  }

  getFilterediamAnomalies(iamAnomalies: IAMAnomaly[], amount: number): IAMAnomaly[] {
    let filteredIAMAnomalies = [];

    for (const anomaly of iamAnomalies) {
      if (anomaly.active === true) {
        filteredIAMAnomalies.push(anomaly);
      }
    }

    // tslint:disable-next-line:max-line-length
    filteredIAMAnomalies = filteredIAMAnomalies.sort((a, b) => a.updated_at > b.updated_at ? -1 : (a.updated_at < b.updated_at ? 1 : 0));
    filteredIAMAnomalies = filteredIAMAnomalies.slice(0, amount);

    return filteredIAMAnomalies;
  }

  getIAMAnomalyUrl(anomaly: IAMAnomaly): string {
    return `https://console.cloud.google.com/iam-admin/iam?project=${anomaly.project_id}`;
  }
}
