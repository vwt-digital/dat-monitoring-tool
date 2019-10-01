import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { EnvService } from '../env/env.service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BuildStatus } from './build-status';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(
    private httpClient: HttpClient,
    private env: EnvService,
    private modalService: NgbModal
  ) { }

  getBuildStatuses(branch = 'develop'): Observable<BuildStatus[]> {
    return this.httpClient.get<BuildStatus>(`${this.env.apiUrl}/build-statuses/branch/${branch}`)
      .pipe(map((response: any) => response));
  }
}
