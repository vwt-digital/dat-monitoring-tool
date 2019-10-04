import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private router: Router
  ) { }

  get hasApiKey() {
    const apiKey = sessionStorage.getItem('apiKey');

    if (apiKey && apiKey != '') {
      return true;
    }

    return false;
  }

  removeApiKey() {
    sessionStorage.removeItem('apiKey');
  }

  toLoginpage() {
    this.router.navigate(['login']);
  }
}
