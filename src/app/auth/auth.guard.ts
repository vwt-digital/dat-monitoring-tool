import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router
  ) { }

  async canActivate(): Promise<boolean> {
    const apiKey = sessionStorage.getItem('apiKey');

    if (apiKey) {
      return true;
    }

    this.router.navigate(['not-authorized']);
    return false;
  }
}
