import { Component } from '@angular/core';

import { DashboardService } from '../dashboard/dashboard.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  title = 'Dasboard';

  constructor(
    private service: DashboardService
  ) {}
}
