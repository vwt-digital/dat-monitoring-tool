import { Component, Input } from '@angular/core';

import { SecurityNotification } from 'src/app/dashboard/security-notification';
import { DashboardService } from 'src/app/dashboard/dashboard.service';

@Component({
  selector: 'app-security-notifications',
  templateUrl: './security-notifications.component.html',
  styleUrls: ['./security-notifications.component.scss']
})
export class SecurityNotificationsComponent {
  @Input() securityNotifications: SecurityNotification[];
  @Input() securityNotificationsAmount: number = null;

  cardHeader = 'Security Command Centre';
  cardHeaderIcon = 'fas fa-shield-alt';
  cardColor = 'red';

  constructor(
    public service: DashboardService
  ) { }

  getFilteredsecurityNotifications(securityNotifications: SecurityNotification[], amount: number): SecurityNotification[] {
    // tslint:disable-next-line:max-line-length
    let filteredStatuses = securityNotifications.sort((a, b) => a.updated_at > b.updated_at ? -1 : (a.updated_at < b.updated_at ? 1 : 0));
    filteredStatuses = filteredStatuses.slice(0, amount);

    return filteredStatuses;
  }
}
