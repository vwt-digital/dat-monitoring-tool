import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { EnvService } from '../env/env.service';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { BuildStatus } from './build-status';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  public buildStatuses$: BehaviorSubject<BuildStatus[]> = new BehaviorSubject([]);

  constructor(
    private httpClient: HttpClient,
    private env: EnvService
  ) { }

  updateData() {
    this.httpClient.get(`${this.env.apiUrl}/build-statuses/branch/${this.getBranch}`)
      .pipe(
        map((response: any) => response)
      ).subscribe(
        data => this.buildStatuses$.next(data),
        error => console.log(error)
      );
  }

  get getBranch() {
    return this.env.environment;
  }
}
