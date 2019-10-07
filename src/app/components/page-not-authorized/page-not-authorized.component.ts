import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-not-authorized',
  templateUrl: './page-not-authorized.component.html',
  styleUrls: ['./page-not-authorized.component.scss']
})
export class PageNotAuthorizedComponent {
  constructor(
    private router: Router
  ) {
    const apiKey = sessionStorage.getItem('apiKey');
    if (apiKey && apiKey != '') {
      this.router.navigate(['/']);
    }
  }

  navigateHome() {
    this.router.navigate(['/login']);
  }
}
