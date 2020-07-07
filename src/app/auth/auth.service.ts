import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private router: Router
  ) { }

  get hasApiKey(): boolean {
    const apiKey = sessionStorage.getItem('apiKey');

    if (apiKey && apiKey !== '') {
      return true;
    }

    return false;
  }

  removeApiKey(): void {
    sessionStorage.removeItem('apiKey');
  }

  toLoginpage(): void {
    this.router.navigate(['login']);
  }
}
