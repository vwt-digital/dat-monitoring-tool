import { Component, OnDestroy } from '@angular/core';
import { trigger, transition, state, style, animate } from '@angular/animations';

import { DashboardService } from '../dashboard/dashboard.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [
    trigger('showhide', [
      state('invisible', style({opacity: '0'})),
      state('visible', style({opacity: '1'})),
      transition('invisible <=> visible', animate('.5s linear'))
    ])
  ]
})
export class HeaderComponent implements OnDestroy {
  title = 'Dashboard';
  blinkingIcon = 'visible';
  blinkInterval: any;

  constructor(
    public service: DashboardService
  ) {
    this.blinkInterval = setInterval(() => {
      if (this.service.isInvalidRequest) {
        this.blinkingIcon = 'visible';
      } else {
        this.blinkingIcon = (this.blinkingIcon == 'visible') ? 'invisible' : 'visible';
      }
    }, 500)
  }

  ngOnDestroy() {
    clearInterval(this.blinkInterval);
  }
}
